'use client'
import ActionTool from "../ActionTool"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

interface Props {
    id: string,
    imageUrl: string,
    name: string,
}


export default function NavigationItems({
    id,
    imageUrl,
    name
}: Props) {

    const params = useParams();
    const router = useRouter();
    
    const handleClick = () => {
        router.push(`/servers/${id}`)
    }
    
    return (
        <div className="group flex w-full items-center">
            <ActionTool side="right" align="center" label={name}>
                <button className="relative flex items-center" onClick={handleClick}>
                    <div className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-1",
                        params?.serverId !== id && "group-hover:h-5",
                        params?.serverId === id ? "h-10" : "h-2"
                    )} />
                    <div className={cn(
                        "relative group flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden",
                        params?.serverId === id && "bg-primary/10 text-primary rounded-2xl"
                    )}>
                        <Image
                            fill
                            src={imageUrl}
                            alt="Image server"
                        />
                    </div>

                </button>
                {/* <img src={imageUrl} alt="Image server" className="cursor-pointer h-12 w-12 rounded-xl hover:" /> */}
            </ActionTool>
        </div>
    )
}
