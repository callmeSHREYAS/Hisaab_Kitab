// src/app/api/customers/route.js
// -------------------------------------------------------
// GET  → list all customers for logged-in user
// POST → create a new customer
// -------------------------------------------------------

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Customer from '@/models/Customer'

// GET /api/customers
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    // Fetch only this user's customers, sorted by most pending first
    const customers = await Customer.find({ userId: session.user.id })
      .sort({ pendingAmount: -1 })
      .lean()

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

// POST /api/customers
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, phone, pendingAmount, notes } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    await connectDB()

    const customer = await Customer.create({
      userId: session.user.id,
      name,
      phone,
      pendingAmount: pendingAmount || 0,
      notes,
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
