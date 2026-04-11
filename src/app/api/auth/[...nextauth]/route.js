// src/app/api/auth/[...nextauth]/route.js
// -------------------------------------------------------
// This is the NextAuth catch-all API route.
// It handles all auth endpoints:
//   POST /api/auth/signin
//   POST /api/auth/signout
//   GET  /api/auth/session
//   GET  /api/auth/callback/google
//   etc.
// -------------------------------------------------------

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

// Next.js App Router exports GET and POST from the same handler
export { handler as GET, handler as POST }
