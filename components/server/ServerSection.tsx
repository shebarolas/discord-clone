"use client"

import { ServerWithMembersAndProfile } from "@/types/type/serverType";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings  } from "lucide-react";
import { useModal } from "@/zustand/modal-store";

interface Props {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersAndProfile;
}



export default function ServerSection({ label, role, sectionType, channelType, server }: Props) {
    
    const { onOpen } = useModal();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label="Crear Canal" side="top">
                    <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" onClick={() => onOpen("createChannel", {channelType})}>
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Modificar Miembros" side="top">
                    <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" onClick={() => onOpen("editMembers", { server })}>
                        <Settings className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    )
}
