import { useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import SideBar from "./SideBar";

function ChatContainer() {
  const {chatId}=useParams();
  console.log(chatId, "THIS SI CHAT ID")
  console.log("I am rendering....")
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
