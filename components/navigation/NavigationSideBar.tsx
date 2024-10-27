import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import NavigationItems from "./NavigationItems";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default async function NavigationSideBar() {

    const profile = await currentProfile();

    if (!profile) return redirect('/');

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })


    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
            <div className="flex flex-col items-center h-full gap-4">
                <div className="flex flex-col items-center gap-4">
                    <NavigationAction />
                    <Separator
                        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
                    />
                </div>

                <ScrollArea className="w-full h-[26rem]">
                    {
                        servers.map((server) => (
                            <div key={server.id} className="w-full">
                                <NavigationItems id={server.id} imageUrl={server.imageUrl} name={server.name} />
                            </div>
                        ))
                    }
                    <ScrollBar orientation="vertical"/>
                </ScrollArea>

            </div>

            <div className="flex flex-col justify-end mt-auto gap-y-4 items-center">
                <ModeToggle />
                <UserButton appearance={{
                    elements: {
                        avatarBox: "h-[48px] w-[48px]"
                    }
                }}/>
            </div>
        </div>
    )
}
