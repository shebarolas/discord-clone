import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_COUNT = 10;

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unauthorized", {status: 401});
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");

        const conversationId = searchParams.get("conversationId")
        if(!conversationId) return new NextResponse("Invalid Conversation ID", {status: 400});

        let message : DirectMessage[] = [];

        if(cursor){
            message = await db.directMessage.findMany({
                take: MESSAGES_COUNT,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where:{
                    conversationId
                },
                include: {
                    member:{
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createAt: "desc"
                }
            });
        } else {
            message = await db.directMessage.findMany({
                take: MESSAGES_COUNT,
                where:{
                    conversationId
                },
                include: {
                    member:{
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createAt: "desc"
                }
            });
        }

        let nextCursor = null;
        if(message.length === MESSAGES_COUNT){
            nextCursor = message[MESSAGES_COUNT - 1].id;
        }
        return NextResponse.json({
            items: message,
            nextCursor
        });

    } catch (error) {
        return new NextResponse("Internal Server Error",{status: 500});
    }
}