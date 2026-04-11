'use client'
// src/app/providers.js
// -------------------------------------------------------
// NextAuth's SessionProvider must be a Client Component.
// We separate it here so layout.js (a Server Component) can import it.
// -------------------------------------------------------

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}
