"use client"
import { FormSchema, FormSchemaTypeChat } from "@/types/models/chat-from-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Smile } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import axios from "axios";

interface ChatProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel"
}


export default function ChatInput({
  apiUrl,
  query,
  name,
  type
}: ChatProps) {

  const { register, formState: { errors, isLoading }, handleSubmit, control } = useForm<FormSchemaTypeChat>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: ""
    }
  })

  const onSubmit: SubmitHandler<FormSchemaTypeChat> = async (formData) => {
    try {
      await axios.post(apiUrl, {
        ...formData,
        ...query
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller control={control} name="content" render={({ field }) => (
        <div className="relative p-6 pb-6" {...field}>
          <button type="button" onClick={() => { }}
            className="absolute top-9 left-8 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
              dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
          >
            <Plus className="text-white dark:text-[#313338]" />
          </button>
          <Input disabled={isLoading} className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/50
          border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200
          " placeholder={`Message ${type === "conversation" ? name : "#" + name}`} {...register} />
          <div className="absolute top-9 right-8">
            <Smile className="text-white" />
          </div>
        </div>
      )}
      />
    </form>

  )
}
