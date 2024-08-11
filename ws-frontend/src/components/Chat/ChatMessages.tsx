import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Messages from "./Messages";

function ChatMessages() {
  // all logic will happen here.....
  return (
    <div className="flex flex-col gap-2 p-5 h-screen">
      <div className="flex-1 p-5 overflow-y-auto">
        <Messages />
      </div>

      <div className="flex sticky w-full bottom-0 gap-2 items-center">
        <Input placeholder="Type a message" />
        <Button>Send</Button>
      </div>
    </div>
  );
}

export default ChatMessages;
