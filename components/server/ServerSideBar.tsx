import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './ServerSearch';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import ServerSection from './ServerSection';
import { Separator } from '../ui/separator';
import { iconMap, roleMap } from '../utils/CustomMaps';
import ServerChannels from './ServerChannels';
import ServerMember from './ServerMember';


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
        <ScrollArea className='flex-1 px-3'>
            <div className="mt-2">
                <ServerSearch data={[
                    {
                        label: "Text Channels",
                        type: "channel",
                        data: textChannels?.map((channel)=> ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type]
                        }))
                    },
                    {
                        label: "Voice Channels",
                        type: "channel",
                        data: audioChannels?.map((channel)=> ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type]
                        }))
                    },
                    {
                        label: "Video Channels",
                        type: "channel",
                        data: videoChannles?.map((channel)=> ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type]
                        }))
                    },
                    {
                        label: "Members",
                        type: "member",
                        data: members?.map((member)=> ({
                            id: member.id,
                            name: member.profile.name,
                            icon: roleMap[member.rol],
                            image: member.profile.imageUrl
                        }))
                    }
                ]} />
            </div>
            <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2'/>
            {!!textChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                       sectionType='channels'
                       channelType={ChannelType.TEXT}
                       role={rol}
                       label='Text Channels' 
                    />
                    {textChannels.map((channels)=>(
                        <ServerChannels key={channels.id} role={rol} server={server} channel={channels}/>
                    ))}
                </div>
            )}
             {!!audioChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                       sectionType='channels'
                       channelType={ChannelType.AUDIO}
                       role={rol}
                       label='Audio Channels' 
                    />
                    {audioChannels.map((channels)=>(
                        <ServerChannels key={channels.id} role={rol} server={server} channel={channels}/>
                    ))}
                </div>
            )}
             {!!videoChannles?.length && (
                <div className="mb-2">
                    <ServerSection
                       sectionType='channels'
                       channelType={ChannelType.VIDEO}
                       role={rol}
                       label='Video Channels' 
                    />
                    {videoChannles.map((channels)=>(
                        <ServerChannels key={channels.id} role={rol} server={server} channel={channels}/>
                    ))}
                </div>
            )}
            {!!members?.length && (
                <div className="mb-2">
                    <ServerSection
                       sectionType='members'
                       role={rol}
                       label='Members'
                       server={server}
                    />
                    {members.map((members)=>(
                       <ServerMember key={members.id} server={server} member={members}/>
                    ))}
                </div>
            )}
        </ScrollArea>
    </div>
  )
}
    