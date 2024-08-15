import axios from "axios";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import CreateChat from "./CreateChat";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

type Member = {
  name: string;
  username: string;
  id: string;
};

type Chat = {
  name: string | null;
  isGroupChat: boolean;
  createdAt: string;
  members: Member[];
  id: string;
};

function SideBar() {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const [allChats, setAllChats] = useState([]);

  const logout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/v1/user/logout",

        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/chat", {
          withCredentials: true,
        });

        if (response.data.success) {
          setAllChats(response.data.chats);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, []);
  return (
    <div className="relative border-r-2 h-full border-gray-200 p-5">
      <div className="flex flex-col space-y-3 h-full">
        <div className="flex flex-col gap-2">
          <CreateChat />
        </div>

        <div className="flex-1 flex flex-col gap-5 overflow-y-auto ">
          {allChats.map((chat: Chat) => {
            const chatName = chat.isGroupChat
              ? chat.name
              : chat.members.find((member: Member) => member.id !== userId)
                  ?.name;
            return (
              <div>
                <Chat
                  chatName={chatName}
                  createdAt={chat.createdAt}
                  id={chat.id}
                  key={chat.id}
                />
              </div>
            );
          })}

          {/* Repeat <Chats /> as needed */}
        </div>

        <div className="bg-white">
          <Button onClick={logout} className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
