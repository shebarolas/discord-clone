"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
interface FieldProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "messageFile" | "imageUpload";
}

export default function FileUpload({ onChange, value, endpoint }: FieldProps) {

  console.log(value)

  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
}
