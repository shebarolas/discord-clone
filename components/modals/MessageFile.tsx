"use client"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSchema, FormSchemaMessageFile, FormSchemaMessageFileType } from "@/types/models/form-model";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "../ui/button";
import InputError from "../common/InputError";
import { useState } from "react";
import '@uploadthing/react/styles.css'
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import axios from "axios"
import { useRouter } from "next/navigation";
import { useModal } from "@/zustand/modal-store";
import { Archive, FileIcon } from "lucide-react";

export default function MessageFile() {
  const { isOpen, onClose, type, data } = useModal();
  const [urlImage, setUrlImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const router = useRouter();
  const query = data?.query;
  const apiUrl = data?.apiUrl;
  const {
    handleSubmit,
    formState: { errors, isLoading },
    reset,
    setValue
  } = useForm<FormSchemaMessageFileType>({
    resolver: zodResolver(FormSchemaMessageFile)
  });

  const isOpenModal = isOpen && type === "messageFile";

  const handleClose = () => {
    reset();
    setUrlImage("")
    onClose();
  }

  const CreateServer: SubmitHandler<FormSchemaMessageFileType> = async (formData) => {
    console.log(formData, apiUrl, query)
    try {
      await axios.post(apiUrl ?? "", {
        ...formData,
        ...query,
        content: formData.fileUrl
      });
      reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }

  }

  const onChange = (url: string, name: string) => {
    const typeFile = name?.split(".").pop();
    setName(typeFile ?? "");
    setUrlImage(url)
    setValue("fileUrl", url);
  }

  return (
    <Dialog open={isOpenModal} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-xl text-center">
            Enviar arichivo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(CreateServer)}>
          <div className="px-6">
            <div className="flex place-content-center w-full">
              {
                urlImage !== '' ? (
                  <div className="relative h-24">
                    {name === "pdf" && (
                      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                        <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400"/>
                        <a href={urlImage} 
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline w-[20rem]
                        break-words whitespace-normal">
                          {urlImage}
                        </a>
                      </div>
                    )}
                    {name === "jpg" && (
                        <Image
                          src={urlImage}
                          fill
                          alt="Image"
                          className="relative rounded-full w-24"
                        />
                      )}
                    <button className="bg-red-500 w-5 h-5 rounded-full text-center grid place-content-center absolute top-0 right-0" onClick={() => onChange('', '')}>
                      <p className="font-medium text-white cursor-pointer">X</p>
                    </button>
                  </div>
                ) :
                  <div className="">
                    <UploadDropzone
                      endpoint="messageFile"
                      onClientUploadComplete={(res) => {
                        onChange(res?.[0].url, res?.[0].name);
                      }}
                      onUploadError={(error: Error) => {
                        console.log('Upload Error:', error)
                      }}
                    />
                    {errors.fileUrl && <InputError message={errors.fileUrl.message} />}
                  </div>
              }
            </div>
          </div>
          <DialogFooter className="px-6 py-4">
            <Button disabled={isLoading} type="submit" className="bg-purple-900 text-white hover:bg-purple-900/70 transition-all">
              Enviar arichivo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
