// src/app/layout.js
// -------------------------------------------------------
// Root layout — wraps all pages.
// SessionProvider makes the NextAuth session available
// to all client components via useSession() hook.
// -------------------------------------------------------

import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'HisabKitab — Smart Business Helper',
  description: 'AI-powered business management for micro-entrepreneurs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        {/* Providers wraps everything so session is accessible everywhere */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
