import { Hash } from "lucide-react";
import MobileToggle from "../MobileToggle";
import SocketIndicator from "../SocketIndicator";
import ChatVideoButton from "./ChatVideoButton";

interface PropsChat {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}
export default function ChatHeader({ serverId, name, type, imageUrl }: PropsChat) {
    return (
        <div className="text-sm font-semibold px-3 gap-1 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 w-full">
            <MobileToggle serverId={serverId} />
            {
                type === "channel" && (
                    <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
                )
            }
            {
                type === "conversation" && (
                    <img src={imageUrl} alt="member image" className="h-6 w-6 rounded-xl"/>
                )
            }
            <p className="font-semibold text-sm text-black dark:text-white">{name}</p>
            <div className="ml-auto flex items-center">
                {type === "conversation" && (
                    <ChatVideoButton/>
                )}
                <SocketIndicator/>
            </div>
        </div>
    )
}
