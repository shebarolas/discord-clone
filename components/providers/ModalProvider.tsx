"use client"

import { useEffect, useState } from "react"
import CreateServer from "../modals/CreateServer"
import InvitePeople from "../modals/InvitePeople"

export default function ModalProvider() {

    const [isMounted, setIsMounted] = useState<boolean>(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])
    if (!isMounted) return null
    return (
        <div>
            <CreateServer />
            <InvitePeople/>
        </div>
    )
}
