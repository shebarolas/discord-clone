"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/zustand/modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function InvitePeople() {
 
  const {isOpen, onClose, type} = useModal();

  const isOpenModal = isOpen && type === "inivte"
  

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
            <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value="Link invitacion"/>
          </div>
         </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
