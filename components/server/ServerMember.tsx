"use client"

import { Member, Profile, Server } from "@prisma/client"
import { useParams, useRouter } from "next/navigation";
import { roleMap } from "../utils/CustomMaps";
import { cn } from "@/lib/utils";

interface Props {
  member: Member & { profile: Profile };
  server: Server;
}

export default function ServerMember({ member, server }: Props) {

  const params = useParams();
  const router = useRouter();
  console.log(member)
  const Icon = roleMap[member.rol];

  return (
    <button className={cn(
      "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
      params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
    )}>
      
      <img src={member.profile.imageUrl} alt="profile image" className="w-8 h-8 rounded-full"/>
      <p className={cn(
        "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"
      )}>{member.profile.name}</p>
      <div className="">
        {Icon}
      </div>
    </button>
  )
}
