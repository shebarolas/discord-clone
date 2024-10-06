import NavigationSideBar from "@/components/navigation/NavigationSideBar"

export default async function LayoutMain({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full flex flex-row">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSideBar />
            </div>
            <div className="md:pl-[72px] h-full">
                {children}
            </div>
        </div>

    )
}