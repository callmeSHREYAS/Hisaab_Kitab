// src/lib/auth.js
// -------------------------------------------------------
// NextAuth configuration.
// Supports two sign-in methods:
//   1. Email + Password (CredentialsProvider)
//   2. Google OAuth (GoogleProvider)
// -------------------------------------------------------

import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

const providers = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

providers.push(
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },

    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password are required')
      }

      await connectDB()

      const email = credentials.email.toLowerCase().trim()
      const user = await User.findOne({ email }).select('+password')

      if (!user || !user.password) {
        throw new Error('No account found with this email')
      }

      const isValid = await user.comparePassword(credentials.password)
      if (!isValid) {
        throw new Error('Incorrect password')
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        language: user.language,
        businessName: user.businessName,
      }
    },
  })
)

export const authOptions = {
  // ---- Providers ----
  providers,

  // ---- Callbacks ----
  callbacks: {
    // Called when a user signs in with Google → create/update user in DB
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()

        const dbUser = await User.findOneAndUpdate(
          { email: user.email },
          {
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google',
          },
          { upsert: true, new: true }
        )

        user.id = dbUser._id.toString()
        user.language = dbUser.language
        user.businessName = dbUser.businessName
      }
      return true // Allow sign-in
    },

    // Add extra fields (id, language, businessName) into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.language = user.language
        token.businessName = user.businessName
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }

      if ((!token.id || !token.language || !token.businessName) && token.email) {
        await connectDB()
        const dbUser = await User.findOne({ email: token.email })
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.language = dbUser.language
          token.businessName = dbUser.businessName
        }
      }

      return token
    },

    // Expose token data to the client-side session
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
          language: token.language,
          businessName: token.businessName,
        }
      }
      return session
    },
  },

  // Use JWT strategy (no DB sessions — stateless)
  session: {
    strategy: 'jwt',
  },

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect errors back to signin page
  },

  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions
