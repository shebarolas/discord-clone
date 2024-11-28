import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/type/socketType";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "DELETE" && req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

    try {
        const profile = await currentProfilePages(req);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { directMessageId, conversationId } = req.query;
        const { content } = await req.body;
        if (!directMessageId) return res.status(400).json({ error: "Message id is required" });
        if (!conversationId) return res.status(400).json({ error: "Conversation id is required" });


        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profile: {
                                id: profile.id
                            }
                        }
                    },
                    {
                        memberTwo: {
                            profile: {
                                id: profile.id
                            }
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
        });
        if (!conversation) return res.status(404).json({ error: "Conversation not found" });
        const member = conversation.memberOne.profile.id === profile.id ? conversation.memberOne : conversation.memberTwo

        if (!member) return res.status(404).json({ error: "Member not found" });

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!directMessage || directMessage.deleted) return res.status(404).json({ error: "Message not found" });

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.rol === MemberRole.ADMIN;
        const isModerator = member.rol === MemberRole.MODERATOR;
        const canDeleteMessage = isMessageOwner || isAdmin || isModerator;

        if (!canDeleteMessage) return res.status(401).json({ error: "Unauthorized" });

        if (req.method === "DELETE")
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string
                },
                data: {
                    fileUrl: null,
                    content: "Este mensaje ha sido eliminado",
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        if (req.method === "PATCH")
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string
                },
                data: {
                    content: content
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        const updateKey = `chat:${conversation.id}:message:update`;
        res?.socket?.server?.io?.emit(updateKey, directMessage)

        return res.status(200).json(directMessage);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }

}