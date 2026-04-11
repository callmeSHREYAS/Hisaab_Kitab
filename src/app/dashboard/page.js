'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'
import { ArrowRight, CalendarDays, CircleAlert, Clock3, IndianRupee, PackageSearch } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, highlight }) {
  return (
    <div
      className={`rounded-[28px] border p-6 shadow-sm transition duration-200 hover:-translate-y-1 ${
        highlight
          ? 'border-orange-300 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow-[0_24px_70px_-34px_rgba(249,115,22,0.9)]'
          : 'border-stone-200 bg-white/85 text-stone-900'
      }`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${highlight ? 'bg-white/15' : 'bg-orange-50 text-orange-600'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className={`mt-5 text-3xl font-black tracking-tight ${highlight ? 'text-white' : 'text-stone-900'}`}>{value}</div>
      <div className={`mt-2 text-sm font-medium ${highlight ? 'text-orange-50' : 'text-stone-500'}`}>{label}</div>
      {sub ? <div className={`mt-1 text-xs ${highlight ? 'text-orange-100' : 'text-stone-400'}`}>{sub}</div> : null}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="soft-panel flex h-64 items-center justify-center text-stone-400">
        Loading your dashboard...
      </div>
    )
  }

  const chartData =
    data?.weeklyChart?.map((d) => ({
      day: format(parseISO(d._id), 'EEE'),
      earnings: d.earnings,
      orders: d.orders,
    })) || []

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-[#10233f]/10 bg-[#10233f] px-6 py-7 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.95)] sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.28),transparent_54%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(), 'EEEE, d MMMM yyyy')}
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">
              Business overview at a glance
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              See today&apos;s performance, spot unpaid balances, and keep low-stock items from sneaking up on you.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Today</div>
              <div className="mt-2 text-2xl font-bold">
                Rs {(data?.todayEarnings || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Alerts</div>
              <div className="mt-2 text-2xl font-bold">{data?.lowStockItems?.length || 0} low stock</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={IndianRupee}
          label="Today's Earnings"
          value={`Rs ${(data?.todayEarnings || 0).toLocaleString('en-IN')}`}
          sub={`${data?.todayOrderCount || 0} orders today`}
          highlight
        />
        <StatCard
          icon={CalendarDays}
          label="This Month"
          value={`Rs ${(data?.monthEarnings || 0).toLocaleString('en-IN')}`}
        />
        <StatCard
          icon={Clock3}
          label="Total Pending"
          value={`Rs ${(data?.totalPending || 0).toLocaleString('en-IN')}`}
          sub={`${data?.customerCount || 0} customers affected`}
        />
        <StatCard
          icon={PackageSearch}
          label="Low Stock Alerts"
          value={data?.lowStockItems?.length || 0}
          sub="Items that need restock"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="soft-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Weekly earnings</h2>
              <p className="text-sm text-stone-500">A clean view of how the week is trending.</p>
            </div>
            <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Performance
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebe7df" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`Rs ${val.toLocaleString('en-IN')}`, 'Earnings']}
                  contentStyle={{ borderRadius: '18px', border: '1px solid #e7e5e4', boxShadow: '0 16px 40px -28px rgba(15,23,42,0.45)' }}
                />
                <Bar dataKey="earnings" fill="#f97316" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-[24px] bg-stone-50 text-sm text-stone-400">
              No orders yet this week. Add your first order to start the trend line.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800">
              <CircleAlert className="h-5 w-5" />
              <h2 className="text-lg font-bold">Restock watchlist</h2>
            </div>
            {data?.lowStockItems?.length > 0 ? (
              <div className="mt-4 space-y-3">
                {data.lowStockItems.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-amber-200 bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="text-sm font-semibold text-amber-700">
                        {item.quantity} {item.unit} left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-white/80 px-4 py-5 text-sm text-stone-500">
                No urgent restock alerts right now.
              </div>
            )}
          </div>

          <div className="soft-panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Recent orders</h2>
                <p className="text-sm text-stone-500">Keep the latest activity in view.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-400" />
            </div>

            {data?.recentOrders?.length > 0 ? (
              <div className="space-y-3">
                {data.recentOrders.map((order) => (
                  <div key={order._id} className="rounded-2xl bg-stone-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-stone-900">{order.description}</div>
                        <div className="text-xs text-stone-500">{order.customerName || 'Walk-in customer'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-stone-900">Rs {order.amount.toLocaleString('en-IN')}</div>
                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            order.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.status === 'partial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-400">
                No orders yet. Add your first one from the Orders page.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
