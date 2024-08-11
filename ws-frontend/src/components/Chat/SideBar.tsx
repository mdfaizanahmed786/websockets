import { Button } from "../ui/button";
import Chats from "./Chats";
import CreateChat from "./CreateChat";

function SideBar() {
  return (
    <div className="relative border-r-2 h-full border-gray-200 p-5">
      <div className="flex flex-col space-y-3 h-full">
        <div className="flex flex-col gap-2">
          <CreateChat />
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
       
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          <Chats />
          {/* Repeat <Chats /> as needed */}
        </div>

        <div className="bg-white">
          <Button className="w-full">Logout</Button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
