import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

export function useUpload(){
    const [file, setFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<null | string>(null);
    const [uploading, setUploading] = useState(false);
  
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
  
    const handleCheckFileType = (file: File) => {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        return "image";
      }
      if (fileType.startsWith("video/")) {
        return "video";
      }
      return "document";
    }


    return {getRootProps, getInputProps, isDragActive, file, previewURL, uploading, handleCheckFileType, setUploading, setPreviewURL, setFile}
}