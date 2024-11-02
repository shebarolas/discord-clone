"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChannelFormSchema, ChannelFormSchemaType } from "@/types/models/form-model";
import { Controller, Form, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import InputError from "../common/InputError";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/zustand/modal-store";
import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import axios from "axios";

export default function CreateChannel() {

  const { isOpen, onClose, type } = useModal();
  const params = useParams();
  const router = useRouter();
  const isOpenModal = isOpen && type === "createChannel"

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
    setValue,
    control
  } = useForm<ChannelFormSchemaType>({
    resolver: zodResolver(ChannelFormSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT
    }
  });
  const onSubmit: SubmitHandler<ChannelFormSchemaType> = async (formData) => {
    console.log(formData);
    try {
      await axios.post(`/api/channels`, {
        formData,
        serverId: params?.serverId
      });
      router.refresh();
      reset();
      onClose();
    } catch (error) {
      console.log(error)
    }
   
  }
  const handleClose = () =>{
    reset();
    onClose();
  }

 

  return (
    <Dialog open={isOpenModal} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-xl text-center">
            Crear canal para servidor
          </DialogTitle>
        </DialogHeader>
        <Form control={control}>
          <form onClick={handleSubmit(onSubmit)}>
            <div className="px-6">
              <label htmlFor="nameServer" className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Nombre del canal
              </label>
              <Input
                disabled={
                  isLoading
                }
                placeholder="Nombre del canal"
                className="bg-purple-300 border-none mt-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-black"
                id="nameServer"
                type="text"
                {...register("name")}
              />
              {errors.name && <InputError message={errors.name.message} />}
            </div>
            <div className="px-6">
              <label htmlFor="channelType" className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Tipo de canal
              </label>
              <Controller name="type" control={control} render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  disabled={ isLoading }
                >
                  <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                    <SelectValue placeholder="Seleccionar el tipo de canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      Object.values(ChannelType).map((type) => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type.toLowerCase()}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              )} />
              {errors.type && <InputError message={errors.type.message} />}
            </div>
            <DialogFooter className="px-6 py-4">
              <Button disabled={isLoading} type="submit" className="bg-purple-900 text-white hover:bg-purple-900/70 transition-all">
                Crear Canal
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
