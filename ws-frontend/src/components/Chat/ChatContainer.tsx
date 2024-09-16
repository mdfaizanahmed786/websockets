import { useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import SideBar from "./SideBar";
import { useChatStore } from "../../store/chatStore";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { User } from "./CreateChat";
import { useUserStore } from "../../store/userStore";
import { useWSStore } from "../../store/wsStore";
export interface Message {
  id: string;
  message: string;
  createdAt: string;
  sender: User;
  media?:string
  messageType?:string
}
export const validateUUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function ChatContainer() {
  const { chatId } = useParams();

  const { setGroupChat, setChatId, setChatName, setMembers } = useChatStore(
    (state) => ({
      setGroupChat: state.setGroupChat,
      setChatId: state.setChatId,
      setChatName: state.setChatName,
      setMembers: state.setMembers,
    })
  );
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { socket, setSocket } = useWSStore((state) => ({
    setSocket: state.setSocket,
    socket: state.socket,
  }));
  const { userId } = useUserStore((state) => ({
    userId: state.userId,
    name: state.name,
    userName: state.userName,
  }));

  const [messages, setMessages] = useState<Message[]>([]);

  const [typing, setTyping] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket(import.meta.env.VITE_WS_URL);
// "wss://api.anxiousdev.online/"
    newSocket.onopen = () => {
      console.log("Connected to the server");
      setSocket(newSocket);

      newSocket.send(
        JSON.stringify({
          type: "online_status",
          data: {
            userId,
          },
        })
      );
    };

    newSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "message") {
        console.log(data, "Data");
        setMessages((prev) => [...prev, data.data]);
      }

      if (data.type === "online_status") {
        console.log(data, "Online Status");
        setOnlineUsers(data.data);
      }

      if (data.type === "typing") {
        console.log(data, "Typing");
        setTyping(` ${data.data.name} is typing...`);
      }
      if (data.type === "stop_typing") {
        console.log(data, "Stop Typing");
        setTyping("");
      }
    };

    newSocket.onerror = (error) => {
      console.log("Error", error);
      setOnlineUsers([]);
    };

    newSocket.onclose = () => {
      console.log("Disconnected from the server");
      setOnlineUsers([]);
    };

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const sideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId || !socket) {
      setChatId("");
      return;
    }
    const getChat = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chatId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setChatId(chatId);
          setMembers(response.data.chat.members);
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "join",
                data: {
                  chatId,
                  userId,
                },
              })
            );
          }
          setMessages(response.data.chat.messages);
          if (response.data.chat.name && response.data.chat.isGroupChat) {
            setChatName(response.data.chat.name);
            setGroupChat(true);
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
  }, [chatId]);

  return (
    <div>
      <div className="flex overflow-y-hidden">
        <div
          ref={sideBarRef}
          className="h-screen transition-all flex-1 w-full md:sticky md:flex-[0.2] hidden absolute z-50 bg-white inset-0 md:block"
        >
          <SideBar sideBarRef={sideBarRef} />
        </div>
        <div className="md:flex-[0.8] w-full h-full">
          <ChatMessages
            sideBarRef={sideBarRef}
            onlineUsers={onlineUsers}
            typing={typing}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;

// chat/d6d4be19-511d-428c-876a-da95eb36beeb
