"use client"
import { signIn } from 'next-auth/react'
import React from 'react'
import { useSession } from 'next-auth/react'

const Appbar = () => {
    const session = useSession();
  return (
    <div>
        <div>
            Appbar
        </div>
        <div onClick={()=>signIn()}>Signin</div>
        <div>{JSON.stringify(session.data?.user)}</div>
    </div>
  )
}

export default Appbar