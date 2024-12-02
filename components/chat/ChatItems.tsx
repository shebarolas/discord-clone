"use client"
import { Member, MemberRole, Profile } from '@prisma/client';
import qs from "query-string";
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import ActionTooltip from '../ActionTooltip';
import { roleMap } from '../utils/CustomMaps';
import { Edit, FileIcon, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FormSchema, FormSchemaTypeChat } from '@/types/models/chat-from-model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { useModal } from '@/zustand/modal-store';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '../providers/SocketProvider';

interface ChatItemsProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile
    },
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, any>;
}
export default function ChatItems({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemsProps) {
  
    const fileType = fileUrl?.split('.').pop();
    const isPdf = fileType === 'pdf' && fileUrl;
    const isImage = !isPdf && fileUrl;
    const [isPdfs, setIsPdfs] = useState<boolean>(false);
    const isAdmin = MemberRole.ADMIN === currentMember.rol
    const isModerator = MemberRole.MODERATOR === currentMember.rol
    const isOwner = currentMember.id === member.id;
    const canDeleted = !deleted && (isAdmin || isModerator || isOwner)
    const canEdit = !deleted && isOwner && !fileUrl
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
      const ahndleKeyDown = (event: any) => {
        if (event.key === "Escape" || event.key === "Esc") {
          setIsEditing(false);
        }
      }
      window.addEventListener("keydown", ahndleKeyDown);
    }, [])

    const {handleSubmit, formState: {isLoading}, setValue, control } = useForm<FormSchemaTypeChat>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            content: content
        }
    });

    const onMemberClick = ()=>{
        if (member.id === currentMember.id) return;

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    const {onOpen} = useModal();

    useEffect(() => {
        setValue("content", content);
    }, [content])

    const onSubmit: SubmitHandler<FormSchemaTypeChat> = async (formData) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });

            await axios.patch(url, formData);
            setIsEditing(false);

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition" onClick={onMemberClick}>
                    <img src={member.profile.imageUrl} className="rounded-full mr-4 h-8 w-8" alt="Profile" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-2">
                            <p className='font-semibold text-sm hover:underline cursor-pointer'>{member.profile.name}</p>
                            <ActionTooltip label={member.rol}>
                                {roleMap[member.rol]}
                            </ActionTooltip>
                        </div>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                            {timestamp}
                        </span>
                    </div>
                    
                    {isImage && (
                        <a href={fileUrl} target='_blank' rel='noopener noreferrer' className={cn('relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48',
                            isPdfs && "hidden"
                        )}>
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className='object-cover'
                                onError={() => setIsPdfs(true)}
                            />
                        </a>
                    )}
                    {isPdfs && fileUrl && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
                            <a href={fileUrl}
                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline w-[20rem]
                        break-words whitespace-normal">
                                {fileUrl}
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className='text-xs mx-2 text-zinc-500 dark:text-zinc-400'>
                                    (editado)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <div className="">
                            <form className='flex items-center w-full gap-x-2 pt-2' onSubmit={handleSubmit(onSubmit)}>
                                <Controller control={control} name='content' render={({ field }) => (
                                    <div className='flex-1' {...field}>
                                        <div className="relative w-full">
                                            <Input disabled={isLoading} className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                                        focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                                                placeholder='Edited Messsage'
                                                {...field}
                                            />
                                        </div>
                                    </div>
                                )} />
                                <Button size={'sm'} variant={'default'}>Editar</Button>
                            </form>
                            <span className='text-[10px] mt-1 text-zinc-400'>
                                Presiona Espace para cancelar, o enter si deces editar el mensaje.
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {canDeleted && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEdit &&
                        (<ActionTooltip label='Editar'>
                            <Edit onClick={() => setIsEditing(true)} className='cursor-pointer h-4 w-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
                        </ActionTooltip>)
                    }
                    <ActionTooltip label='Eliminar'>
                        <Trash className='cursor-pointer h-4 w-4  text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition' onClick={()=> onOpen("deleteMessage", {
                            apiUrl: `${socketUrl}/${id}`,
                            query: socketQuery
                        })} />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}
