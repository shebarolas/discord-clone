import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}: {params: {channelId: string}}) {
    try {
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unautorized", {status: 401});
        const {serverId, formData} = await req.json();
        if(!serverId) return new NextResponse("Server ID missing", {status: 400});
        if(!params.channelId) return new NextResponse("Channel ID missing", {status: 400});

       console.log(serverId)
       console.log(params.channelId)
       console.log(formData)
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
                 update: {
                     where: {
                         id: params.channelId,
                         name: {
                             not: "general"
                         }
                     },
                     data: {
                        name: formData.name,
                        type: formData.type
                     }
                 },
             }
         }
        });

        return NextResponse.json(server)


    } catch (error) {
        return new NextResponse("Internal Error", {status: 500});
    }

}

export async function DELETE(req: Request, {params}: {params: {channelId: string}}) {
    try {
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unautorized", {status: 401});
        const {serverId} = await req.json();
        if(!serverId) return new NextResponse("Server ID missing", {status: 400});
        if(!params.channelId) return new NextResponse("Channel ID missing", {status: 400});
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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        });

        return NextResponse.json(server)

    } catch (error) {
        return new NextResponse("Internal Error", {status: 500});
    }
}   