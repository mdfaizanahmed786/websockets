import { useUserStore } from "../../store/userStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Message } from "./ChatContainer";

function Messages({ message }: { message: Message }) {
  const userId = useUserStore((state) => state.userId);
  return (
    <div>
      {userId === message.sender.id ? (
        <div className="flex justify-end">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-gray-200 rounded-full">
              {message.sender.name.slice(0, 1)}
            </div>
            <div className="bg-black text-white p-3 rounded-lg">
              {message.messageType === "IMAGE" ? (
                <Dialog>
                  <DialogTrigger>
                    <img
                      src={message.media}
                      draggable={false}
                      alt="image"
                      className="w-44 h-44 object-cover"
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogDescription>
                        <img
                          src={message.media}
                          draggable={false}
                          alt="image w-full h-full"
                          className="object-cover"
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ) : message.messageType === "VIDEO" ? (
                <video
                  src={message.media}
                  controls
                  className="w-44 h-44 object-cover"
                />
              ) : message.messageType === "AUDIO" ? (
                <audio src={message.message} controls />
              ) : message.messageType === "DOCUMENT" ? (
                <a
                  target="_blank"
                  className="text-center"
                  href={message.media}
                  download
                >
                  {message.media?.includes("pdf") && (
                    <img className="h-40 w-40" src="/pdf.svg" />
                  )}
                  {message.media?.includes("xls") && (
                    <img className="h-40 w-40" src="/excel.svg" />
                  )}
                  Download File
                </a>
              ) : message.messageType === "TEXT" ? (
                message.message
              ) : null}
            </div>

            <div className="text-sm text-gray-500">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-gray-200 rounded-full">
              {message.sender.name.slice(0, 1)}
            </div>
            <div className="bg-gray-200 text-black p-3 rounded-lg">
              {message.messageType === "IMAGE" ? (
                <Dialog>
                  <DialogTrigger>
                    <img
                      src={message.media}
                      draggable={false}
                      alt="image"
                      className="w-44 h-44 object-cover"
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogDescription>
                        <img
                          src={message.media}
                          draggable={false}
                          alt="image w-full h-full"
                          className="object-cover"
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ) : message.messageType === "VIDEO" ? (
                <video
                  src={message.media}
                  controls
                  className="w-44 h-44 object-cover"
                />
              ) : message.messageType === "AUDIO" ? (
                <audio src={message.message} controls />
              ) : message.messageType === "DOCUMENT" ? (
                <a
                  target="_blank"
                  className="text-center"
                  href={message.media}
                  download
                >
                  {message.media?.includes("pdf") && (
                    <img className="h-40 w-40" src="/pdf.svg" />
                  )}
                  {message.media?.includes("xls") && (
                    <img className="h-40 w-40" src="/excel.svg" />
                  )}
                  Download File
                </a>
              ) : message.messageType === "TEXT" ? (
                message.message
              ) : null}
            </div>

            <div className="text-sm text-gray-500">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
