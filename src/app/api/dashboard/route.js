// src/app/api/dashboard/route.js
// -------------------------------------------------------
// Returns all data needed for the dashboard:
//   - Today's earnings
//   - This month's earnings
//   - Total pending payments
//   - Recent orders
//   - Low inventory alerts
// -------------------------------------------------------

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { Order } from '@/models/Order'
import { Inventory } from '@/models/Order'
import Customer from '@/models/Customer'
import { startOfDay, startOfMonth, endOfDay } from 'date-fns'
import { getDemoDashboard, isDemoUser } from '@/lib/demoData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Authenticate: only logged-in users can view their dashboard
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    if (isDemoUser(userId)) {
      return NextResponse.json(getDemoDashboard())
    }

    await connectDB()

    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const monthStart = startOfMonth(now)

    // --- Today's earnings (all paid orders today) ---
    const todayOrders = await Order.aggregate([
      {
        $match: {
          userId: userId,
          status: { $in: ['paid', 'partial'] },
          createdAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' },
          count: { $sum: 1 },
        },
      },
    ])

    // --- This month's earnings ---
    const monthOrders = await Order.aggregate([
      {
        $match: {
          userId: userId,
          status: { $in: ['paid', 'partial'] },
          createdAt: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' },
        },
      },
    ])

    // --- Total pending across all customers ---
    const pendingResult = await Customer.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$pendingAmount' }, count: { $sum: 1 } } },
    ])

    // --- Recent 5 orders ---
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    // --- Low inventory items (quantity <= threshold) ---
    const lowStock = await Inventory.find({
      userId,
      $expr: { $lte: ['$quantity', '$restockThreshold'] },
    }).lean()

    // --- Weekly earnings for chart (last 7 days) ---
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 6)

    const weeklyData = await Order.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          earnings: { $sum: '$amountPaid' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return NextResponse.json({
      todayEarnings: todayOrders[0]?.total || 0,
      todayOrderCount: todayOrders[0]?.count || 0,
      monthEarnings: monthOrders[0]?.total || 0,
      totalPending: pendingResult[0]?.total || 0,
      customerCount: pendingResult[0]?.count || 0,
      recentOrders,
      lowStockItems: lowStock,
      weeklyChart: weeklyData,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(getDemoDashboard())
  }
}
