// src/app/api/orders/route.js
// -------------------------------------------------------
// GET  → list all orders for the logged-in user
// POST → create a new order (and update customer pending balance)
// -------------------------------------------------------

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { Order } from '@/models/Order'
import Customer from '@/models/Customer'
import { DEMO_ORDERS, isDemoUser } from '@/lib/demoData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (isDemoUser(session.user.id)) {
      return NextResponse.json(DEMO_ORDERS)
    }

    await connectDB()

    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(DEMO_ORDERS)
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { customerId, customerName, description, amount, status, amountPaid } =
      await request.json()

    if (!description || !amount) {
      return NextResponse.json(
        { error: 'Description and amount are required' },
        { status: 400 }
      )
    }

    if (isDemoUser(session.user.id)) {
      const paidAmount = status === 'paid' ? Number(amount) : Number(amountPaid) || 0
      return NextResponse.json(
        {
          _id: `demo-order-${Date.now()}`,
          userId: session.user.id,
          customerId,
          customerName,
          description,
          amount: Number(amount),
          status: status || 'pending',
          amountPaid: paidAmount,
          createdAt: new Date().toISOString(),
        },
        { status: 201 }
      )
    }

    await connectDB()

    const paidAmount = status === 'paid' ? amount : amountPaid || 0
    const pendingAmount = amount - paidAmount

    // Create the order
    const order = await Order.create({
      userId: session.user.id,
      customerId,
      customerName,
      description,
      amount,
      status: status || 'pending',
      amountPaid: paidAmount,
    })

    // If linked to a customer, update their pending balance
    if (customerId && pendingAmount > 0) {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: {
          pendingAmount: pendingAmount,
          totalPaid: paidAmount,
        },
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
