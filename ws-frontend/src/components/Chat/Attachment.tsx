import axios from "axios";
import { Paperclip, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUpload } from "../../hooks/useUpload";
import { useUserStore } from "../../store/userStore";
import { useWSStore } from "../../store/wsStore";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

function Attachment({ chatId }: { chatId: string }) {
const {getRootProps, getInputProps, isDragActive, file, previewURL, uploading, handleCheckFileType, setUploading, setPreviewURL, setFile}=useUpload();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setFile(null);
    setOpen((prev) => !prev);
    setPreviewURL(null);
  };

  const socket = useWSStore((state) => state.socket);
  const {userId, name} = useUserStore((state) => ({
    userId: state.userId,
    name: state.name,
  }));

  const handleSendAttachment = async () => {
    if (!file) {
      toast.error("Please select a file to send");
      return;
    }
  
    try {
      setUploading(true);
  
      // First, get the signed URL and upload the file
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/signed-url`,
        {
          key: file.name,
          contentType: file.type,
          chatId,
        },
        {
          withCredentials: true,
        }
      );
  
      if (data.success) {
        const { signedURL, fileLink } = data;
  
        await Promise.all([
          axios.put(signedURL, file, {
            headers: {
              "Content-Type": file.type,
            },
          }),
          axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send`,
            {
              message: file.name,
              chatId,
              media: fileLink,
              messageType: handleCheckFileType(file).toUpperCase(),
            },
            {
              withCredentials: true,
            }
          ),
        ]);
  
        toast.success("File uploaded and message sent successfully");
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "message",
              data: {
                message: file.name,
                media:fileLink,
                messageType: handleCheckFileType(file).toUpperCase(),
                chatId,
                sender: {
                  id: userId,
                  name: name,
                },
              },
            })
          );
        }
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while uploading or sending the message");
    } finally {
      setFile(null);
      setOpen(false);
      setUploading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Paperclip onClick={handleOpen} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Attachment</DialogTitle>
          <DialogDescription>
            <div
              {...getRootProps()}
              className={`p-6 border-4 mt-4 border-dashed rounded-lg text-center cursor-pointer transition-all
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-300 bg-gray-100 text-gray-600"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-lg font-semibold">Drop the file here ...</p>
              ) : (
                <p className="text-lg">
                  Drag 'n' drop a file here, or click to select a file
                </p>
              )}
            </div>

            {file && (
              <div className="mt-6 relative">
                <h4 className="text-lg font-medium">File Details:</h4>
                <p className="text-sm text-gray-600">Name: {file.name}</p>
                <p className="text-sm text-gray-600">Type: {file.type}</p>
                <p className="text-sm text-gray-600">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>

                {previewURL && file.type.startsWith("image/") && (
                  <>
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="mt-4 max-w-full h-auto rounded-md border"
                    />
                    <div
                      className="absolute top-0 right-0 cursor-pointer"
                      onClick={() => setFile(null)}
                    >
                      <X />
                    </div>
                  </>
                )}

                {previewURL && file.type.startsWith("video/") && (
                  <>
                    <video controls className="mt-4 w-full rounded-md">
                      <source src={previewURL} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                    <div
                      className="absolute top-0 right-0 cursor-pointer"
                      onClick={() => setFile(null)}
                    >
                      <X />
                    </div>
                  </>
                )}

                {!previewURL && (
                  <>
                    <a
                      href={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-blue-500 hover:underline"
                    >
                      View/Download File
                    </a>
                    <div
                      className="absolute top-0 right-0 cursor-pointer"
                      onClick={() => setFile(null)}
                    >
                      <X />
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center gap-4">
          <DialogClose asChild>
            <Button
              onClick={() => setFile(null)}
              type="button"
              variant="destructive"
              disabled={uploading}
            >
              Cancel
            </Button>
          </DialogClose>
          {file && (
            <Button
              onClick={handleSendAttachment}
              type="button"
              variant="default"
              disabled={uploading}
            >
              {uploading ? "Sending..." : "Send"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Attachment;



