"use client"

import { Smile } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useTheme } from "next-themes"

interface EmojiProps {
    onChange: (value: string) => void
}

export default function EmojiPicker({onChange}: EmojiProps) {

  return (
    <Popover>
        <PopoverTrigger>
            <Smile className="w-6 h-6 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
        </PopoverTrigger>
        <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
            <Picker data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)} 
            theme={useTheme().resolvedTheme === "dark" ? "dark" : "light"}/>
        </PopoverContent>
    </Popover>
  )
}
