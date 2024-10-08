import { useNavigate } from "react-router-dom";

interface ChatProps {
  id: string;
  chatName: string | null | undefined;
  createdAt: string;
  handleCloseNav: () => void;
}
function Chats({ id, createdAt, chatName, handleCloseNav }: ChatProps) {
  const navigate = useNavigate();
  const navigateToChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
    handleCloseNav();
  };
  return (
    <div
      onClick={() => navigateToChat(id)}
      className="cursor-pointer hover:bg-slate-100 hover:rounded-md transition-bg"
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <h1 className="text-xs">{chatName}</h1>
            <p className="text-sm text-gray-500">Last message</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chats;
