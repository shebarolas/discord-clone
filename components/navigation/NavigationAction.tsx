"use client"

import { Plus } from "lucide-react"
import ActionTooltip from "../ActionTooltip"
import { useModal } from "@/zustand/modal-store"

export default function NavigationAction() {
  const {onOpen} = useModal();
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Crear Servidor">
        <button className="group" onClick={()=> onOpen("createServer")}>
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] 
            transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={32}
            />
          </div>
        </button>
      </ActionTooltip>

    </div>
  )
}
