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

export default function LeaveServer() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const server = data?.server;
  console.log(server);

  const isOpenModal = isOpen && type === "leaveServer";

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-xl text-center">
            Salir del servidor
          </DialogTitle>
          <div className="">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              Estas seguro de querer salir del servidor {server?.name}?
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
            <Button disabled={isLoading} variant="destructive">
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
