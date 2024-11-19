"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/zustand/modal-store";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function DeleteChannel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const channel = data?.channel;
  const params = useParams();
  const router = useRouter();
  const isOpenModal = isOpen && type === "deleteChannel";

  const handleClick = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/channels/${channel?.id}`, {
        data: {
          serverId: params?.serverId
        }
      });
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-xl text-center">
            Eliminar el canal
          </DialogTitle>
          <div className="">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 flex flex-row gap-1">
              Estas seguro de querer eliminar el canal <p className="text-indigo-500">{channel?.name}</p>?
            </Label>
          </div>
        </DialogHeader>
        <DialogFooter className="">
          <div className="flex flex-row justify-between w-full">
            <Button
              className="bg-indigo-500 text-white hover:bg-indigo-500/90"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button disabled={isLoading} variant="destructive" onClick={handleClick}>
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
