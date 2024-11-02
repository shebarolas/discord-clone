import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { channel } from 'diagnostics_channel';
import { redirect } from 'next/navigation';
import React from 'react'
import ServerHeader from './ServerHeader';

export default async function ServerSideBar({serverId}: {serverId: string}) {
    const profile = await currentProfile();

    if(!profile) return redirect("/");

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    rol: "asc"
                }
            }
        }
    });
    const textChannels = server?.channels.filter((channel)=> channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel)=> channel.type === ChannelType.AUDIO);
    const videoChannles = server?.channels.filter((channel)=> channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member)=> member.profileId !== profile.id);

    if(!server) return redirect("/");
    const rol = server?.members.find((member)=> member.profileId === profile.id)?.rol;

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
        <ServerHeader rol={rol} server={server}/>
    </div>
  )
}
    