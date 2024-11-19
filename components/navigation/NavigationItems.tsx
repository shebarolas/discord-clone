"use client"
import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Props{
    id: string;
    name: string;
    imageUrl: string
}

export default function NavigationItems({
    id,
    name,
    imageUrl
}: Props) {
    const params = useParams();
    const router = useRouter();

    const onClick = ()=>{
        router.push(`/servers/${id}`);
    }

  return (
    <div className="w-full">
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={onClick    } className="group w-full relative flex items-center">
                <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all w-[4px]", params?.serverId !== id && "group-hover:h-5",
                    params?.serverId === id ? "h-9" : "h-[8px]"
                )}/>
                <div className={cn("relative group flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}
                >
                    <Image
                        fill
                        src={imageUrl}
                        alt="Channel"
                    />
                </div>

            </button>
        </ActionTooltip>
    </div>
  )
}
