import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_COUNT = 10;

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unauthorized", {status: 401});
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");

        const channelId = searchParams.get("channelId")
        if(!channelId) return new NextResponse("Invalid Channel ID", {status: 400});

        let message : Message[] = [];

        if(cursor){
            message = await db.message.findMany({
                take: MESSAGES_COUNT,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where:{
                    channelId
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
            message = await db.message.findMany({
                take: MESSAGES_COUNT,
                where:{
                    channelId
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