import axios from "axios";
import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";
import Chat from "./Chat";
import CreateChat from "./CreateChat";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useChatStore } from "../../store/chatStore";
import { MessageCircleMore, X } from "lucide-react";

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

type SideBarProps = {
  sideBarRef: React.RefObject<HTMLDivElement>;
};

function SideBar({ sideBarRef }: SideBarProps) {
  const navigate = useNavigate();
  const { setUserId, userId, name } = useUserStore((state) => {
    return {
      setUserId: state.setUserId,
      userId: state.userId,
      name: state.name,
    };
  });

  const setChatId = useChatStore((state) => state.setChatId);

  const [allChats, setAllChats] = useState([]);

  const logout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,

        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUserId("");
        setChatId("");


        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setAllChats(response.data.chats);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, []);

  const handleCloseNav = useCallback(() => {
    sideBarRef.current?.classList.add("hidden");
  }, []);
  return (
    <div className="relative border-r-2 h-full border-gray-200 p-4">
      <div className="flex flex-col space-y-3 h-full">
        <div className="flex justify-between">
          <div
            onClick={() => (window.location.href = "/")}
            className="flex cursor-pointer items-center gap-2"
          >
            <MessageCircleMore />
            <h1 className="text-2xl text-center font-semibold">Chat App</h1>
          </div>

          <X onClick={handleCloseNav} className="md:hidden" />
        </div>
        <div className="flex flex-col gap-2">
          <CreateChat handleCloseNav={handleCloseNav} />
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-y-auto ">
          {allChats.map((chat: Chat) => {
            const chatName = chat.isGroupChat
              ? chat.name
              : chat.members.find((member: Member) => member.id !== userId)
                  ?.name;
            return (
              <div>
                <Chat
                  handleCloseNav={handleCloseNav}
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

        <div className="text-center p-3">
          Hi, <span className="font-semibold">{name}</span>
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
