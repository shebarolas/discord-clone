import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/type/socketType";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if(req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    try {
        const profile = await currentProfilePages(req);
        if(!profile) return res.status(401).json({error: "Unauthorized"});

        const {fileUrl, content, channelId, serverId} = await req.body;
        console.log(await req.body)
        if(!serverId) return res.status(400).json({error: "Server ID is required"});
        if(!channelId) return res.status(400).json({error: "Channel ID is required"});
        if(!content) return res.status(400).json({error: "Content is required"});

        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });

        if(!server) return res.status(404).json({error: "Server not found"});

        const channel = await db.channel.findFirst({
            where:{
                id: channelId,
                serverId: serverId
            }
        });

        if(!channel) return res.status(404).json({error: "Channel not found"});

        const member = server.members.find((member)=> member.profileId === profile.id)
        if(!member) return res.status(404).json({error: "Member not found"});


        const message = await db.message.create({
            data:{
                fileUrl: fileUrl,
                content: content,
                channelId: channelId,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        const channelKey = `chat:${channelId}:message`;

        res?.socket?.server?.io?.emit(channelKey, message)

        res.status(200).json(message);


    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }

}