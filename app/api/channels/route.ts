import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        if (!profile) return new NextResponse("Unauthorized", { status: 401 });
        const { formData: { name, type }, serverId } = await req.json();
        if (!serverId) return new NextResponse("Server ID missing", { status: 400 });
        if (name === "general") return new NextResponse("Name cannot be 'general'", { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        rol: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name: name,
                        type: type
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 });
    }

}