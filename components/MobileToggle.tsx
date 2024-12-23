
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSideBar from "./navigation/NavigationSideBar";
import ServerSideBar from "./server/ServerSideBar";

export default function MobileToggle({serverId}: {serverId: string}) {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="md:hidden">
                <Menu/>
            </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 flex gap-0">
            <div className="w-20">
                <NavigationSideBar/>
            </div>
            <ServerSideBar serverId={serverId}/>
        </SheetContent>
    </Sheet>
  )
}
