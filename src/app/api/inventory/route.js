// src/app/api/inventory/route.js
// -------------------------------------------------------
// GET  → list all inventory items with restock alerts
// POST → add a new inventory item
// -------------------------------------------------------

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { Inventory } from '@/models/Order'
import { DEMO_INVENTORY, isDemoUser } from '@/lib/demoData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (isDemoUser(session.user.id)) {
      return NextResponse.json({
        items: DEMO_INVENTORY,
        alertCount: DEMO_INVENTORY.filter((item) => item.needsRestock).length,
      })
    }

    await connectDB()

    const items = await Inventory.find({ userId: session.user.id })
      .sort({ quantity: 1 }) // Show low-stock items first
      .lean()

    // Tag each item with whether it needs restocking
    const itemsWithAlert = items.map((item) => ({
      ...item,
      needsRestock: item.quantity <= item.restockThreshold,
    }))

    const alertCount = itemsWithAlert.filter((i) => i.needsRestock).length

    return NextResponse.json({ items: itemsWithAlert, alertCount })
  } catch (error) {
    return NextResponse.json({
      items: DEMO_INVENTORY,
      alertCount: DEMO_INVENTORY.filter((item) => item.needsRestock).length,
    })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, quantity, unit, restockThreshold, costPerUnit } = await request.json()

    if (!name || quantity === undefined) {
      return NextResponse.json({ error: 'Name and quantity are required' }, { status: 400 })
    }

    if (isDemoUser(session.user.id)) {
      const item = {
        _id: `demo-inventory-${Date.now()}`,
        userId: session.user.id,
        name,
        quantity: Number(quantity),
        unit: unit || 'pieces',
        restockThreshold: restockThreshold ?? 5,
        costPerUnit,
      }

      return NextResponse.json(item, { status: 201 })
    }

    await connectDB()

    const item = await Inventory.create({
      userId: session.user.id,
      name,
      quantity,
      unit: unit || 'pieces',
      restockThreshold: restockThreshold ?? 5,
      costPerUnit,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 })
  }
}

// -------------------------------------------------------
// PATCH /api/inventory — update quantity (e.g. after restocking)
// -------------------------------------------------------
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { itemId, quantity, restockThreshold } = await request.json()

    if (isDemoUser(session.user.id)) {
      const item = DEMO_INVENTORY.find((entry) => entry._id === itemId) || DEMO_INVENTORY[0]
      const updated = {
        ...item,
        quantity,
        ...(restockThreshold !== undefined && { restockThreshold }),
      }

      return NextResponse.json({
        ...updated,
        needsRestock: updated.quantity <= updated.restockThreshold,
      })
    }

    await connectDB()

    const item = await Inventory.findOneAndUpdate(
      { _id: itemId, userId: session.user.id }, // Verify ownership
      { quantity, ...(restockThreshold !== undefined && { restockThreshold }) },
      { new: true }
    )

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...item.toObject(),
      needsRestock: item.quantity <= item.restockThreshold,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}
