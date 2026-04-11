// src/app/api/auth/register/route.js
// -------------------------------------------------------
// Handles new user registration (email + password).
// Google users don't need this — they're auto-created in NextAuth signIn callback.
// -------------------------------------------------------

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  try {
    const { name, email, password, businessName } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if email is already registered
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Create user — password gets hashed automatically via the pre-save hook in the model
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      businessName: businessName || name + "'s Business",
      provider: 'credentials',
    })

    return NextResponse.json(
      { message: 'Account created successfully', userId: user._id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
