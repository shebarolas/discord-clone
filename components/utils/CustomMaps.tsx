import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

export const iconMap = {
    [ChannelType.TEXT]: <Hash className='h-4 w-4'/>,
    [ChannelType.AUDIO]: <Mic className='h-4 w-4'/>,
    [ChannelType.VIDEO]: <Video className='h-4 w-4'/>
}
export const roleMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='w-4 h-4'/>,
    [MemberRole.ADMIN]: <ShieldAlert className='w-4 h-4'/>
}

