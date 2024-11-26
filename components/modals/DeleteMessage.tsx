"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import qs from "query-string";
import { useModal } from "@/zustand/modal-store";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function DeleteMessage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onClose, type, data } = useModal();
  const apiUrl = data?.apiUrl;
  const query = data?.query
  const isOpenModal = isOpen && type === "deleteMessage";

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `${apiUrl}` || "",
        query: query
      });

      await axios.delete(url);
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
            Eliminar el mensaje
          </DialogTitle>
          <div className="">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 flex flex-row gap-1">
              Estas seguro de querer eliminar el mensaje?
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
