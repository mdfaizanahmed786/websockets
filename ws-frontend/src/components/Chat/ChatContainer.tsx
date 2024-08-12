import { useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import SideBar from "./SideBar";
import { useChatStore } from "../../store/chatStore";
import { useEffect } from "react";
import axios from "axios";

export const validateUUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function ChatContainer() {
  const { chatId } = useParams();
  const setChatId = useChatStore((state) => state.setChatId);


  useEffect(() => {
    if (!chatId || !validateUUID.test(chatId)) {
      return;
    }
    const getChat=async()=>{
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/chat/${chatId}`,
          {
            withCredentials: true,
          }
        );
  
        if (response.data.success) {
          setChatId(chatId);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getChat()
  }, [chatId]);
  // The chatId will go to global state manager....
  console.log("I am rendering....");
  return (
    <div>
      <div className="flex overflow-y-hidden">
        <div className="h-screen sticky flex-[0.2] inset-0">
          <SideBar />
        </div>
        <div className="flex-[0.8] w-full h-full">
          <ChatMessages />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;

// chat/d6d4be19-511d-428c-876a-da95eb36beeb
