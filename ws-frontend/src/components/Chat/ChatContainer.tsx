import { useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import SideBar from "./SideBar";
import { useChatStore } from "../../store/chatStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "./CreateChat";
import { useUserStore } from "../../store/userStore";
import { useWSStore } from "../../store/wsStore";
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

  const { setGroupChat, setChatId, setChatName } = useChatStore((state) => ({
    setGroupChat: state.setGroupChat,
    setChatId: state.setChatId,
    setChatName: state.setChatName,
  }));
  const setSocket=useWSStore((state)=>state.setSocket)
  const userId = useUserStore((state) => state.userId);

  const [messages, setMessages] = useState<Message[]>([]);

  const [typing, setTyping]=useState('')
  

  
  useEffect(() => {
    if (!chatId) return;
    const newSocket = new WebSocket("ws://localhost:5001");

    newSocket.onopen = () => {
      console.log("Connected to the server");
      setSocket(newSocket);
      
    };

    newSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "message") {
        console.log(data, "Data");
        setMessages((prev) => [...prev, data.data]);
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
    };

    newSocket.onclose=()=>{
      console.log("Disconnected from the server")
    }

    return () => {
      newSocket.close();
     
    };
  }, []);




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
  }, [chatId, userId]);
  // The chatId will go to global state manager....

  return (
    <div>
      <div className="flex overflow-y-hidden">
        <div className="h-screen sticky flex-[0.2] inset-0">
          <SideBar />
        </div>
        <div className="flex-[0.8] w-full h-full">
          <ChatMessages typing={typing} messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;

// chat/d6d4be19-511d-428c-876a-da95eb36beeb
