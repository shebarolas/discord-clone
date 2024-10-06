import React from 'react'

export default function layout({children} : {children: React.ReactNode}) {
  return (
    <div className='h-screen bg-black flex justify-center items-center'>
      {children}
    </div>
  )
}
