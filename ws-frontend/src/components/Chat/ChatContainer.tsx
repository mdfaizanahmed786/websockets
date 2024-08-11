import ChatMessages from "./ChatMessages";
import SideBar from "./SideBar";

function ChatContainer() {
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
