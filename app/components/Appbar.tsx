"use client"
import { signIn, signOut } from 'next-auth/react'
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Appbar = () => {
  const { data: session } = useSession()

  return (
    <div className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* App title */}
        <div className="text-lg font-bold">
          <Link href={"/"}>Subsmart</Link>
        </div>

        {/* Signin/Signout Button */}
        {!session ? (
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Welcome message */}
            <span className="text-gray-300">Welcome, {session.user?.name?.toUpperCase()}</span>

            {/* Signout button */}
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Appbar
