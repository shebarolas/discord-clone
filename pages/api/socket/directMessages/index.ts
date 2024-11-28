import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/type/socketType";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if(req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    try {
        const profile = await currentProfilePages(req);
        if(!profile) return res.status(401).json({error: "Unauthorized"});
        const {fileUrl, content, conversationId} = await req.body;
        if(!conversationId) return res.status(400).json({error: "Conversation ID is required"});
        if(!content) return res.status(400).json({error: "Content is required"});
        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id 
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            
                }
        })

        if(!conversation) return res.status(404).json({error: "Conversation not found"});

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;
        if(!member) return res.status(404).json({error: "Member not found"});

        const message = await db.directMessage.create({
            data:{
                fileUrl: fileUrl,
                content: content,
                conversationId: conversationId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        const channelKey = `chat:${conversationId}:message`;

        res?.socket?.server?.io?.emit(channelKey, message)

        res.status(200).json(message);


    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }

}