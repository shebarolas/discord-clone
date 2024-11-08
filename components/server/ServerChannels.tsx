"use client"

import { Channel, MemberRole, Server } from "@prisma/client"
import { useParams, useRouter } from "next/navigation";
import { iconMap } from "../utils/CustomMaps";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import { Edit, Lock, Trash } from "lucide-react";

interface Props {
    channel: Channel;
    server: Server;
    role?: MemberRole
}

export default function ServerChannels({channel, server, role}: Props) {
    const params = useParams();
    console.log(params)
    const router = useRouter();

    const Icon = iconMap[channel.type];
    
  return (
    <button onClick={()=>{}} className={cn(
      "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1" 
    )}>
      <div className="text-zinc-500 dark:text-zinc-400">
        {Icon}
      </div>
      <p className={cn(
        "line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
      )}>{channel.name}</p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Editar">
            <Edit className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
          </ActionTooltip>
          <ActionTooltip label="Eliminar">
            <Trash className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
      )}
    </button>
  )
}
