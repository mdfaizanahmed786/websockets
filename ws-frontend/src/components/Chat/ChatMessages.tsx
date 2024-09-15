import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Messages from "./Messages";
import { useChatStore } from "../../store/chatStore";
import { Message, validateUUID } from "./ChatContainer";
import toast from "react-hot-toast";
import axios from "axios";
import { useWSStore } from "../../store/wsStore";
import { useUserStore } from "../../store/userStore";
import TypingInput from "./TypingInput";
import { AlignJustify } from "lucide-react";
import Attachment from "./Attachment";


function ChatMessages({
  messages,
  typing,
  onlineUsers,
  sideBarRef,
}: {
  messages: Message[];
  typing: string;
  onlineUsers: string[];
  sideBarRef: React.RefObject<HTMLDivElement>;
}) {
  const { chatId, chatName, members } = useChatStore((state) => ({
    chatName: state.chatName,
    isGroupChat: state.isGroupChat,
    chatId: state.chatId,
    members: state.members,
  }));
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { name, userId } = useUserStore((state) => ({
    name: state.name,
    userId: state.userId,
    userName: state.userName,
  }));

  const socket = useWSStore((state) => state.socket);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    // send message to the server...
    e.preventDefault();
    if (!chatId || !validateUUID.test(chatId)) {
      toast.error("Invalid Request");
      return;
    }
    try {
      setSending(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send`,
        {
          message,
          chatId,
        },
        {
          withCredentials: true,
        }
      );
      if (data.success && socket) {
        if (socket.readyState === WebSocket.OPEN) setMessage("");
        socket.send(
          JSON.stringify({
            type: "message",
            data: {
              message,
              chatId,
              sender: {
                id: userId,
                name: name,
              },
            },
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const checkSenderId =
    members.length === 2
      ? members.find((member) => member.id !== userId)?.id
      : null;
  const findOtherUserid = onlineUsers.find((user) => user === checkSenderId);

  function handleOpenNav() {
    sideBarRef.current?.classList.remove("hidden");
  }

  return (
    <div className="flex flex-col gap-2  h-screen">
      {chatId && (
        <div className="flex sticky top-0 items-center p-3 justify-between border-b-2 border-b-gray-200">
          <div className="flex items-center gap-2">
            <AlignJustify onClick={handleOpenNav} className="md:hidden" />
            <div className="w-10 h-10 bg-gray-200 flex-grow-0 flex items-center justify-center rounded-full">
              {chatName[0].toUpperCase()}
            </div>
            <h1 className="text-xl font-semibold">{chatName}</h1>
            {chatId && findOtherUserid && (
              <p className="text-green-300">Online</p>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 p-5 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full gap-2">
            {chatId && validateUUID.test(chatId) ? (
              <p className="text-2xl text-gray-500 text-center">
                This is the beginning of your chat with{" "}
                <span className="font-semibold">{chatName}</span>
              </p>
            ) : (
              <>
                <h2 className="text-6xl text-black text-center font-semibold">
                  Welcome to Chat App!
                </h2>
                <p className="text-2xl text-gray-500 text-center">
                  Start a conversation with your friends
                </p>
                <Button className="md:hidden" onClick={handleOpenNav}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <Messages key={message.id} message={message} />
            ))}
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>
      <div className="sticky w-full p-5 bottom-0 flex flex-col gap-2">
        <div className="flex  gap-2 items-center">
      {chatId && <Attachment/>}
          <form onSubmit={sendMessage} className="flex gap-2 w-full">
            <TypingInput
              validateUUID={validateUUID}
              chatId={chatId}
              socket={socket}
              message={message}
              setMessage={setMessage}
            />
            {chatId && validateUUID.test(chatId) && (
              <Button type="submit" disabled={sending || !message}>
                {sending ? "...." : "Send"}
              </Button>
            )}
          </form>
        </div>

        {typing && <p className="text-gray-500">{typing}</p>}
      </div>

     



    </div>
  );
}

export default ChatMessages;
