import ServerSideBar from "@/components/server/ServerSideBar";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function layout({ children, params }: { children: React.ReactNode; params: { serverId: string } }) {

    const profile = await currentProfile();

    if (!profile) return auth().redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) return redirect("/");

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSideBar serverId={params.serverId}/>
            </div>
            <div className="h-full md:pl-60">
                {children}
            </div>
        </div>
    )
}
