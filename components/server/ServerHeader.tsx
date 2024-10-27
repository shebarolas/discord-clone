"use client"
import { ServerWithMembersAndProfile } from '@/types/type/serverType'
import { MemberRole } from '@prisma/client';
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown, PlusCircle, Settings, Trash, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { useModal } from '@/zustand/modal-store';

interface Props {
    rol?: MemberRole;
    server: ServerWithMembersAndProfile;
}

export default function ServerHeader({ rol, server }: Props) {
    const {onOpen} = useModal();
    const isAdmin = rol === MemberRole.ADMIN;
    const isModerator = isAdmin || rol === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='focus:outline-none'>
                <button className='w-full flex items-center text-sm font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all'>
                    {server.name}
                    <ChevronDown className='h-5 w-5 ml-auto' />
                </button>

            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
                {
                    isModerator && (
                        <div className="">
                            <DropdownMenuItem onClick={() => onOpen("inivte", {server})} className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'>
                                Invitar miembros
                                <UserPlus className='ml-auto h-5 w-5' />
                            </DropdownMenuItem>
                            <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
                                Crear canales
                                <PlusCircle className='ml-auto h-5 w-5'/>
                            </DropdownMenuItem>
                        </div>
                    )
                }
                {
                    isAdmin && (
                        <div>
                            <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
                                Configuración del servidor
                                <Settings className='ml-auto h-5 w-5' />
                            </DropdownMenuItem>
                            <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'>
                                Manejar miembros
                                <UserCheck className='ml-auto h-5 w-5' />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className='text-red-600 dark:text-red-400 px-3 py-2 text-sm cursor-pointer'>
                                Eliminar servidor
                                <Trash2 className='ml-auto h-5 w-5' />
                            </DropdownMenuItem>
                        </div>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
