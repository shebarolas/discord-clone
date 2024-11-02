"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/zustand/modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export default function InvitePeople() {
 const [copied, setCopied] = useState<boolean>(false);
 const [isLoading, setIsLoading] = useState<boolean>(false);
  const {onOpen, isOpen, onClose, type, data} = useModal();
  const origin = useOrigin();
  const server = data?.server;
  console.log(server)

  const isOpenModal = isOpen && type === "inivte"

  const inviteUrl = `${origin}/invite/${server?.inviteCode}` 

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000);
  }

  const newCode = async ()=>{
    try {
      setIsLoading(true);
      const {data} = await axios.patch(`/api/server/${server?.id}/inviteCode`);
      
      onOpen("inivte", {server: data});
      
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-xl text-center">
            Invita a tus amigos!
          </DialogTitle>
         <div className="">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Link de invitación al servidor
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input disabled={isLoading} readOnly className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value={inviteUrl}/>
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {
                copied ? (<Check className="w-4 h-4"/>) : (<Copy className="w-4 h-4"/>)
              }
            </Button>
          </div>
          <Button disabled={isLoading} onClick={newCode} variant={"link"} size={"sm"} className="text-xs text-zinc-400 mt-4">
            Generar link
            <RefreshCcw className="w-4 h-4 ml-2"/>
          </Button>
         </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
