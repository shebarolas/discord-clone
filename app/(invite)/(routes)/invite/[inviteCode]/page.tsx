import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface Props {
    params: {
        inviteCode: string
    }
}

export default async function InviteCodePage({params}: Props) {
    const profile = await currentProfile();

    if (!profile) return auth().redirectToSignIn();
    if (!params.inviteCode) return redirect("/");

    const existServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(existServer) return redirect(`/servers/${existServer.id}`);

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: {
                    profileId: profile.id
                }
            }
        }
    });


    if(server) return redirect(`/servers/${server.id}`);

  return (
    <div>page</div>
  )
}
