"use client"
import { useParams } from 'next/navigation'
import React from 'react'

export default function Server() {
  const params = useParams();
  return (
    <div>Server page {params.serverId}
    </div>
  )
}
