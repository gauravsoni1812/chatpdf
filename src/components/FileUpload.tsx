"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      try {
        const response = await axios.post("/api/create-chat", {
          file_key,
          file_name,
        });
        return response.data; 
      } catch (error) {
        
       console.log("error in getting response") 
      }
      
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      console.log(file);
      if (file.size > 10 * 1024 * 1024) {
        toast.error("please upload a file less than 10MB");
        // alert("please upload a file less than 10MB");
        return;
      }

      try {
        setUploading(true);  
        const data = await uploadToS3(file);
        console.log(data);
        if (!data?.file_key || !data.file_name) {
          toast.error("something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({chat_id}) => {
            toast.success("chat created")

            router.push(`/chat/${chat_id}`)
            console.log(data);
          },
          onError: (error) => {
            console.log(error);
            toast.error("Error creating chat");
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin"/>

          <p className="mt-2 text-sm text-slate-400">
            Spilling Tea to GPT...
          </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
