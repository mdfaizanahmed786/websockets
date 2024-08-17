import React, { useRef } from "react";
import { Input } from "../ui/input";
import { useUserStore } from "../../store/userStore";

function TypingInput({
  chatId,
  message,
  setMessage,
  validateUUID,
  socket,
}: {
  chatId: string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  validateUUID: RegExp;
  socket: WebSocket | null;
}) {
  const { userId, name } = useUserStore((state) => ({
    userId: state.userId,
    name: state.name,
  }));

  const timeoutRef = useRef<NodeJS.Timeout>();
  const handleTyping = () => {
    socket?.send(
      JSON.stringify({
        type: "typing",
        data: {
          chatId,
          userId,
          name,
        },
      })
    );

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      socket?.send(
        JSON.stringify({
          type: "stop_typing",
          data: {
            chatId,
            userId,
            name,
          },
        })
      );
    }, 2000);
  };
  return (
    <Input
      value={message}
      className="flex-1"
      onChange={(e) => {
        setMessage(e.target.value);
        handleTyping();
      }}
      disabled={!chatId || !validateUUID.test(chatId)}
      placeholder="Type a message"
    />
  );
}

export default TypingInput;
