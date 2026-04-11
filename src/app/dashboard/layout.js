// src/app/dashboard/layout.js
// -------------------------------------------------------
// Shared layout for all /dashboard/* pages.
// Includes: sidebar nav, mobile header, auth guard.
// -------------------------------------------------------

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({ children }) {
  // Server-side auth guard — unauthenticated users go to signin
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin?callbackUrl=%2Fdashboard')
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Sidebar (hidden on mobile, shown on md+) */}
      <DashboardNav user={session.user} />

      {/* Main content area */}
      <main className="min-w-0 px-4 pb-8 pt-4 md:ml-[304px] md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
