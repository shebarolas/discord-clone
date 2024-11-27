"use client"

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

interface Props {
  data: {
    label: string,
    type: "channel" | "member",
    data: {
      icon: React.ReactNode,
      name: string,
      id: string
    }[] | undefined
  }[]
}

export default function ServerSearch({ data }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) =>{
      if(e.key === "k" && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);

  }, [])
  

  return (
    <div>
      <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10
      dark:hover:bg-zinc-700/50 transition-all
      " onClick={() => setOpen(true)}>
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600
        dark:group-hover:text-zinc-300 transition
        ">
          Buscar
        </p>
        <kbd
          className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px]
          font-medium text-muted-foreground ml-auto
          "
        >
          <span className="text-sm">ctrl</span> K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Busca todos los canales y mimbros" />
        <CommandList>
          <CommandEmpty>
            No hay resultados para tu busqueda
          </CommandEmpty>
          {data.map(({label, type, data})=>{
            if(!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({id, icon, name})=>{
                    return (
                      <CommandItem key={id}>
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </div>
  )
}
