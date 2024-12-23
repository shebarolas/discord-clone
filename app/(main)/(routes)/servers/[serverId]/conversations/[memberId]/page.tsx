import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import RoomMedia from "@/components/RoomMedia";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemmberProps {
  params: {
    memberId: string;
    serverId: string;
  },
  searchParams: {
    video?: boolean;
  }
}

export default async function page({ params, searchParams }: MemmberProps) {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(currentMember.id, params?.memberId);

  if (!conversation) return redirect(`/servers/${params?.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      {!searchParams.video && (
        <>
          <ChatMessages member={currentMember} name={otherMember.profile.name} chatId={conversation.id} type="conversation" apiUrl="/api/directMessages"
            paramKey="conversationId" paramValue={conversation.id} socketQuery={{
              conversationId: conversation.id
            }}
            socketUrl="/api/socket/directMessages"
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/directMessages"
            query={{
              conversationId: conversation.id
            }}
          />
        </>
      )}

      {searchParams.video && (
        <RoomMedia
          chatId={conversation.id}
          audio={true}
          video={true}
        />
      )}

    </div>
  )
}
