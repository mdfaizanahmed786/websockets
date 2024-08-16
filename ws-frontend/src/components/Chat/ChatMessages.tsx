import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Messages from "./Messages";
import { useChatStore } from "../../store/chatStore";
import { Message, validateUUID } from "./ChatContainer";
import toast from "react-hot-toast";
import axios from "axios";
import { useWSStore } from "../../store/wsStore";

function ChatMessages({ messages }: { messages: Message[] }) {
  // all logic will happen here.....

  const chatId = useChatStore((state) => state.chatId);
  const [message, setMessage] = useState("");
  const chatName = useChatStore((state) => state.chatName);
  const [sending, setSending] = useState(false); 

  const { socket, setSocket } = useWSStore((state) => {
    return {
      socket: state.socket,
      setSocket: state.setSocket,
    };
  });

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:5001");

    newSocket.onopen = () => {
      console.log("Connected to the server");
      setSocket(newSocket);
    };

    newSocket.onerror = (error) => {
      console.log("Error", error);
    };

    return () => {
      newSocket.close();
    };
  }, []);

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
        setMessage("");
        socket.send(
          JSON.stringify({
            type: "message",
            data: {
              message,
              chatId,
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
      </div>

      <div className="flex sticky w-full p-5 bottom-0 gap-2 items-center">
        <form onSubmit={sendMessage} className="flex gap-2 w-full">
          <Input
            value={message}
            className="flex-1"
            onChange={(e) => setMessage(e.target.value)}
            disabled={!chatId || !validateUUID.test(chatId)}
            placeholder="Type a message"
          />
          {chatId && validateUUID.test(chatId) && (
            <Button type="submit" disabled={sending || !message}>
              {sending ? "...." : "Send"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChatMessages;
