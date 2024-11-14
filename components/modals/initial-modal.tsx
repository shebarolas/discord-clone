"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSchema, FormSchemaType } from "@/types/models/form-model";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import InputError from "../common/InputError";
import { useEffect, useState } from "react";
import '@uploadthing/react/styles.css'
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import axios from "axios"
import { useRouter } from "next/navigation";

export default function InitialModal() {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [urlImage, setUrlImage] = useState<string>('')
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
    setValue
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });


  const CreateServer: SubmitHandler<FormSchemaType> = async (formData) => {
    console.log(formData)
    try {
      await axios.post("/api/server", formData);
      reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }

  }

  if (!isMounted) return null;

  const onChange = (url: string) => {
    setUrlImage(url)
    setValue("imageUrl", url);
  }

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-xl text-center">
            Costumize server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your new server a personality with a name and an icon. You can
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(CreateServer)}>
          <div className="px-6">
            <div className="grid place-content-center">
              {
                urlImage !== '' ? (
                  <div className="relative h-24 w-24">
                    <Image
                      fill
                      src={urlImage}
                      alt="server image"
                      className="h-min w-min rounded-full"
                    />
                    <button className="bg-red-500 w-5 h-5 rounded-full text-center grid place-content-center absolute top-0 right-0" onClick={() => onChange('')}>
                      <p className="font-medium text-white cursor-pointer">X</p>
                    </button>
                  </div>
                ) :
                  <div className="">
                    <UploadDropzone
                      endpoint="imageUpload"
                      onClientUploadComplete={(res) => {
                        onChange(res?.[0].url)
                      }}
                      onUploadError={(error: Error) => {
                        console.log('Upload Error:', error)
                      }}
                    />
                    {errors.imageUrl && <InputError message={errors.imageUrl.message} />}
                  </div>


              }

            </div>
            <label htmlFor="nameServer" className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              Nombre del servidor
            </label>
            <Input
              disabled={
                isLoading
              }
              placeholder="Nombre del servidor"
              className="bg-purple-300 border-none mt-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-black"
              id="nameServer"
              type="text"
              {...register("name")}
            />
            {errors.name && <InputError message={errors.name.message} />}
          </div>
          <DialogFooter className="px-6 py-4">
            <Button disabled={isLoading} type="submit" className="bg-purple-900 text-white hover:bg-purple-900/70 transition-all">
              Crear servidor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
