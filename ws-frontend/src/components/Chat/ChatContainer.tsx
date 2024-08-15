import { useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import SideBar from "./SideBar";
import { useChatStore } from "../../store/chatStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "./CreateChat";
import { useUserStore } from "../../store/userStore";
export interface Message {
  id: string;
  message: string;
  createdAt: string;
  sender: User;
}
export const validateUUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function ChatContainer() {
  const { chatId } = useParams();
  const setChatId = useChatStore((state) => state.setChatId);
  const setChatName = useChatStore((state) => state.setChatName);
  const userId = useUserStore((state) => state.userId);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) {
      setChatId("");
      return;
    }
    const getChat = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/chat/${chatId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setChatId(chatId);
          setMessages(response.data.chat.messages);
          if (response.data.chat.name && response.data.chat.isGroupChat) {
            setChatName(response.data.chat.name);
          } else {
            const user = response.data.chat.members.find(
              (user: User) => user.id !== userId
            );

            setChatName(user.name);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getChat();
  }, [chatId, userId]);
  // The chatId will go to global state manager....

  return (
    <div>
      <div className="flex overflow-y-hidden">
        <div className="h-screen sticky flex-[0.2] inset-0">
          <SideBar />
        </div>
        <div className="flex-[0.8] w-full h-full">
          <ChatMessages messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;

// chat/d6d4be19-511d-428c-876a-da95eb36beeb
