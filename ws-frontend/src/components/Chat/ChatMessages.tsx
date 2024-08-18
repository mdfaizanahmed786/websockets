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

function ChatMessages({
  messages,
  typing

}: {
  messages: Message[];
  typing: string
 
}) {
const {chatId, chatName, isGroupChat}=useChatStore((state)=>({
  chatId: state.chatId,
  chatName: state.chatName,
  isGroupChat: state.isGroupChat
}))
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);


  const bottomRef = useRef<HTMLDivElement>(null);

  const { name, userId } = useUserStore((state) => ({
    name: state.name,
    userId: state.userId,
  }));
  const socket = useWSStore((state) => state.socket);


  useEffect(()=>{
     if(!socket) return;
     socket.send(JSON.stringify({
      type: "join",
      data: { chatId }
    }));
  },[chatId])


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
        `http://localhost:5001/api/v1/message/send`,
        {
          message,
          chatId,
        },
        {
          withCredentials: true,
        }
      );
      if (data.success && socket) {
        if(socket.readyState===WebSocket.OPEN)
        setMessage("");
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
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2  h-screen">
      {chatId && (
        <div className="flex sticky top-0 items-center p-3 justify-between border-b-2 border-b-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <h1 className="text-xl font-semibold">{chatName}</h1>
            {/* { && !isGroupChat && <p className="text-green-300">Online</p>} */}
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
