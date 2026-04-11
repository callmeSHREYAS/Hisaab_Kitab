'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ArrowRight, LogOut } from 'lucide-react'

export default function HomeAuthActions({ isSignedIn = false }) {
  if (isSignedIn) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/dashboard" className="primary-btn">
          Open dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="secondary-btn"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href="/auth/signin" className="primary-btn">
        Sign in
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
      <Link href="/auth/signin?mode=register" className="secondary-btn">
        Create account
      </Link>
    </div>
  )
}
