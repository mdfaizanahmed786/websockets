import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Messages from "./Messages";
import { useChatStore } from "../../store/chatStore";
import { validateUUID } from "./ChatContainer";
import toast from "react-hot-toast";
import axios from "axios";

function ChatMessages() {
  // all logic will happen here.....
  const [messages, setMessages] = useState([]);
  const chatId = useChatStore((state) => state.chatId);
  const [message, setMessage] = useState("");
  const chatName = useChatStore((state) => state.chatName);
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    // send message to the server...
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
          chatId
        },
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setMessage("");
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
                 This is the beginning of your chat with {chatName}
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
          <Messages />
        )}
      </div>

      <div className="flex sticky w-full p-5 bottom-0 gap-2 items-center">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!chatId || !validateUUID.test(chatId)}
          placeholder="Type a message"
        />
        {chatId && validateUUID.test(chatId) && (
          <Button onClick={sendMessage} disabled={sending || !message}>{sending ? "...." : "Send"}</Button>
        )}
      </div>
    </div>
  );
}

export default ChatMessages;
