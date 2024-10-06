"use client"

import { Plus } from "lucide-react"

export default function NavigationAction() {
  return (
    <div>
        <button className="group">
            <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] 
            transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                <Plus
                className="group-hover:text-white transition text-emerald-500"
                size={32}
                />
            </div>
        </button>
    </div>
  )
}
