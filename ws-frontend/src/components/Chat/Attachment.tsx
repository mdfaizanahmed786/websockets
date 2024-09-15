import { Paperclip, X } from "lucide-react";
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
import { Button } from "../ui/button";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

function Attachment() {
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<null | string>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);

    const fileType = uploadedFile.type;
    const fileSize = uploadedFile.size;
    if (fileSize > 1024 * 1024 * 5) {
      toast.error("File size should be less than 5MB");
      return;
    }
    if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
      setPreviewURL(URL.createObjectURL(uploadedFile));
    } else {
      setPreviewURL(null);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDrop,
    multiple: false,
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setFile(null);
    setOpen((prev) => !prev);
    setPreviewURL(null);
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
            >
              Cancel
            </Button>
          </DialogClose>
            {file && (
              <Button type="button" variant="default">
                Send
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Attachment;
