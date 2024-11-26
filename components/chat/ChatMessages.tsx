"use client"
import { format } from "date-fns"
import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import ChatItems from "./ChatItems";
import { useSocket } from "../providers/SocketProvider";

const DATE_FORMAT = "d MMM yyyy, HH:mm"

interface PropsChatMessages {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, any>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

type MessageWithMemberWithProfiel = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatItem {
    id: string;
    content: string;
    member: any;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
}

export default function ChatMessages({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: PropsChatMessages) {
    const queryKey = `chat:${chatId}`;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });

    const { socket } = useSocket();
    const [messages, setMessages] = useState<ChatItem[]>([]);

    useEffect(() => {
        if (!socket || !socketQuery.channelId) return;

        const channelKey = `chat:${socketQuery.channelId}:message`;

        // Escuchar nuevos mensajes
        socket.on(channelKey, (newMessage: ChatItem) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off(channelKey);
        };
    }, [socket, socketQuery.channelId]);

    if (status === "pending") return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cargando mensajes....
            </p>
        </div>
    )
    if (status === "error") return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Error al cargar los mensajes
            </p>
        </div>
    )

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, id) => (
                    <Fragment key={id}>
                        {group?.items?.map((message: MessageWithMemberWithProfiel) => (
                            <ChatItems
                                key={message.id}
                                id={message.id}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                member={message.member}
                                currentMember={member}
                                deleted={message.deteled}
                                timestamp={format(new Date(message.createAt), DATE_FORMAT)}
                                isUpdated={message.updateAt !== message.createAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            {messages.map((message) => (
                <div key={message.id}>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    )
}
