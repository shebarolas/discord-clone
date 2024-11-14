import ChatHeader from "@/components/chat/ChatHeader";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";


export default async function page({params}: {params:{channelId: string, serverId: string}}) {
   const profile = await currentProfile();

   if(!profile) return auth().redirectToSignIn();

   const channel = await db.channel.findUnique({
    where:{
      id: params?.channelId
    }
   });

   const member = await db.member.findFirst({
    where:{
      serverId: params?.serverId,
      profileId: profile.id
    }
   });
   
   if(!channel || !member) return("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name={channel.name} type={"channel"} serverId={channel.serverId} />
    </div>
  )
}
