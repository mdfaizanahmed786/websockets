import ChatMessages from "./ChatMessages";
import SideBar from "./SideBar";

function ChatContainer() {
  return (
    <div>
      <div className="flex">
        <div className="sticky overflow-y-auto h-screen flex-[0.2] inset-0">
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
