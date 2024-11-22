"use client"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { useState } from "react"

export default function QueryProvider({children}: {children: React.ReactNode}) {

    const [queryCliente] = useState(()=> new QueryClient());

  return (
    <QueryClientProvider client={queryCliente}>
        {children}
    </QueryClientProvider>
  )
}
