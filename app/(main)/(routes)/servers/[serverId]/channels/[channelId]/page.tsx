"use client"

import { useParams } from "next/navigation"

export default function page() {
    const params = useParams();
  return (
    <div>Channel Page {params?.channelId}</div>
  )
}
