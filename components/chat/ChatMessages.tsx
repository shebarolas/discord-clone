"use client"
import { format } from "date-fns"
import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-query";
import { Loader2, ServerCrash } from "lucide-react";
import {useEffect, useRef, useState } from "react";
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

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
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
    const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket } = useSocket();
    const [messages, setMessages] = useState<MessageWithMemberWithProfile[]>([]);

    useEffect(() => {
        if (data?.pages) {
            // Aseguramos de que los mensajes se carguen correctamente al final
            const loadedMessages = data.pages.flatMap((page) => page.items);
            setMessages((prevMessages) => {
                const messageIds = new Set(prevMessages.map((msg) => msg.id));
                const newMessages = loadedMessages.filter(
                    (msg) => !messageIds.has(msg.id)
                );
                return [...prevMessages, ...newMessages];
            });
        }
    }, [data]);

    useEffect(() => {
        if (!socket) return;
        const channelKey = `chat:${socketQuery.channelId || socketQuery.conversationId}:message`;
        // Escuchar nuevos mensajes por WebSocket
        socket.on(channelKey, (newMessage: MessageWithMemberWithProfile) => {
            setMessages((prevMessages) => {

                if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
                    return [newMessage, ...prevMessages]; // Agregar el nuevo mensaje al final
                }
                return prevMessages;
            });
        });
        const updateKeyEdit = `chat:${socketQuery.channelId || socketQuery.conversationId}:message:update`;
        // Escuchar edición de mensajes por WebSocket
        socket.on(updateKeyEdit, (updatedMessage: MessageWithMemberWithProfile) => {
            setMessages((prevMessages) => {
                return prevMessages.map((msg) =>
                    msg.id === updatedMessage.id ? updatedMessage : msg
                );
            });
        });
        return () => {
            socket.off(channelKey);
            socket.off(updateKeyEdit);
        };
    }, [socket, socketQuery.channelId]);

    useEffect(() => {
        // Scroll al final cada vez que los mensajes cambian
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    

    if (status === "pending") return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cargando mensajes....
            </p>
        </div>
    );

    if (status === "error") return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Error al cargar los mensajes
            </p>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome type={type} name={name} />
            <div className="flex flex-col-reverse mt-auto">
                <div ref={messagesEndRef} />
                {messages.map((message: MessageWithMemberWithProfile) => (
                    <div className="">
                        <ChatItems
                        key={message.id}
                        id={message.id}
                        content={message.content}
                        fileUrl={message.fileUrl}
                        member={message.member}
                        currentMember={member}
                        deleted={message.deleted}
                        timestamp={format(new Date(message.createAt), DATE_FORMAT)}
                        isUpdated={message.updateAt !== message.createAt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}
                    />
                    </div>
                    
                ))}

                {hasNextPage && (
                    <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? <Loader2 className="animate-spin text-zinc-500 w-4 h-4"/> : <div>
                                <p className="mt-3 mb-3 text-xs text-zinc-400">Cargar más</p>
                            </div>}
                    </button>
                )}
            </div>
        </div>
    );
}