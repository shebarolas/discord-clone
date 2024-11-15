'use client'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Server() {
  const {serverId} = useParams();
  return (
    <div>{serverId}</div>
  )
}
