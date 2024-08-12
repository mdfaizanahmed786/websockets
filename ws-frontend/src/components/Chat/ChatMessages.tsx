import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Messages from "./Messages";
import { useChatStore } from "../../store/chatStore";
import { validateUUID } from "./ChatContainer";

function ChatMessages() {
  // all logic will happen here.....
  const [messages, setMessages] = useState([]);
  const chatId=useChatStore(state=>state.chatId)
  return (
    <div className="flex flex-col gap-2 p-5 h-screen">
      <div className="flex-1 p-5 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full gap-2">

            <h2 className="text-6xl text-black text-center font-semibold">Welcome to Chat App!</h2>
            <p className="text-2xl text-gray-500 text-center">Start a conversation with your friends</p>
          </div>
        ) : (
          <Messages />
        )}
      </div>

      <div className="flex sticky w-full bottom-0 gap-2 items-center">
        <Input disabled={!chatId || !validateUUID.test(chatId)}  placeholder="Type a message" />
        {chatId  && validateUUID.test(chatId) &&  <Button>Send</Button>}
      </div>
    </div>
  );
}

export default ChatMessages;
