"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/zustand/modal-store";
import { Label } from "../ui/label";
import { ServerWithMembersAndProfile } from "@/types/type/serverType";
import { ScrollArea } from "../ui/scroll-area";
import { Check, Loader2, MoreVertical, Shield, ShieldAlert, ShieldBan, ShieldQuestion, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { memo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const typeRoles = [
  {
    type: "ADMIN",
    icon: <ShieldBan className="h-4 w-4 text-indigo-600" />
  },
  {
    type: "MODERATOR",
    icon: <ShieldAlert className="h-4 w-4" />
  },
  {
    type: "GUEST",
    icon: null
  }
]

export default function EditMembers() {

  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { server } = data as { server: ServerWithMembersAndProfile };
  const router = useRouter();
  const isOpenModal = isOpen && type === "editMembers"


  const onRoleChange = async (memberId: string, role: string) => {
    try {
      setIsLoading(true)
      const { data } = await axios.patch(`/api/members/${memberId}`, {
        role: role,
        serverId: server?.id
      });
      router.refresh();
      onOpen("editMembers", { server: data });
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  const onKick = async (memberId: string) => {
    try {
      setIsLoading(true)

      const { data } = await axios.delete(`/api/members/${memberId}`, {
        data: {
          serverId: server?.id
        }
      });

      router.refresh();
      onOpen("editMembers", { server: data });

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
            Editar miembros del servidor
          </DialogTitle>
          <DialogDescription className="text-center">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-52 rounded-sm">
          {
            server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-sm transition-all cursor-pointer">
                <div className="flex flex-row items-center gap-2">
                  <img src={member.profile.imageUrl} alt={member.profile.name} className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col items-center justify-center ">
                    <div className="flex flex-row items-center">
                      <Label className="text-sm">{member.profile.name}</Label>
                      <div className="flex flex-row items-center">
                        {
                          typeRoles.map((role) => {
                            if (role.type === member.rol) {
                              return (
                                <Label key={role.type} className="text-xs text-zinc-500">
                                  {role.icon}
                                </Label>
                              )
                            }
                          })
                        }
                      </div>
                    </div>
                    <p className="text-[9px]">{member.profile.email}</p>
                  </div>
                </div>
                {server.profileId !== member.profileId && !isLoading && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex flex-row gap-1">
                            <ShieldQuestion className="w-4 h-4" />
                            <span>Rol</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {
                                typeRoles.map((role) => (
                                  <DropdownMenuItem className="flex flex-row items-center gap-1" onClick={() => onRoleChange(member.id, role.type)}>
                                    {role.icon}
                                    <p className="text-xs">{role.type}</p>
                                    {role.type === member.rol && (
                                      <Check className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                ))
                              }
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex flex-row items-center gap-1" onClick={() => onKick(member.id)} >
                            <Trash className="h-4 w-4 text-red-400" />
                            <p>Eliminar</p>
                          </DropdownMenuItem>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                )}
                {
                  isLoading && (
                    <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                  )
                }
              </div>
            ))
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
