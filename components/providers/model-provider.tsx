'use client'

import React, { useEffect, useState } from 'react'
import CreateServer from '../modals/server-modal'

export default function ModalProvider() {
    const [isMounted, setisMounted] = useState<boolean>(false)

    useEffect(() => {
        setisMounted(true)
    }, [])

    if(!isMounted) return null

    
  return (
    <div>
        <CreateServer/>
    </div>
  )
}
