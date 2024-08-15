import { useUserStore } from "../../store/userStore";
import { Message } from "./ChatContainer";

function Messages({ message }: { message: Message }) {
  const userId = useUserStore((state) => state.userId);
  return (
    <div>
      {userId === message.sender.id ? (
        <div className="flex justify-end">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-gray-200 rounded-full">{message.sender.name.slice(0,1)}</div>
            <div className="bg-black text-white p-3 rounded-lg">
              {message.message}
            </div>

            <div className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleTimeString()}</div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-black p-2 rounded-lg">
            {message.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
