'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ClipboardList, IndianRupee, Plus, ReceiptText } from 'lucide-react'

const STATUS_STYLES = {
  paid: 'bg-emerald-100 text-emerald-700',
  partial: 'bg-amber-100 text-amber-700',
  pending: 'bg-rose-100 text-rose-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    description: '',
    amount: '',
    status: 'pending',
    amountPaid: '',
  })

  useEffect(() => {
    Promise.all([fetch('/api/orders').then((r) => r.json()), fetch('/api/customers').then((r) => r.json())])
      .then(([ord, cust]) => {
        setOrders(ord)
        setCustomers(cust)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const selectedCustomer = customers.find((c) => c._id === form.customerId)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        customerName: selectedCustomer?.name || form.customerName,
        amount: Number(form.amount),
        amountPaid: Number(form.amountPaid) || 0,
      }),
    })

    if (res.ok) {
      const newOrder = await res.json()
      setOrders((current) => [newOrder, ...current])
      setForm({ customerId: '', customerName: '', description: '', amount: '', status: 'pending', amountPaid: '' })
      setShowForm(false)
    }

    setSaving(false)
  }

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0)
  const pendingOrders = orders.filter((order) => order.status !== 'paid').length

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-violet-200 bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 px-6 py-7 text-white shadow-[0_30px_90px_-50px_rgba(79,70,229,0.85)] sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_56%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-50">
              <ReceiptText className="h-4 w-4" />
              Order tracker
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">
              Capture sales and keep payment status visible
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-50/90">
              Add new orders quickly, monitor what is pending, and keep the latest business flow easy to scan.
            </p>
          </div>
          <button onClick={() => setShowForm((current) => !current)} className="secondary-btn border-white/20 bg-white/15 text-white hover:bg-white/20 hover:text-white">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Hide form' : 'Add order'}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="soft-panel p-5">
          <div className="text-sm font-medium text-stone-500">Total orders</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-stone-900">{orders.length}</div>
        </div>
        <div className="rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
          <div className="text-sm font-medium text-violet-700">Order value</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-violet-900">Rs {totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className="rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
          <div className="text-sm font-medium text-amber-700">Pending or partial</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-amber-900">{pendingOrders}</div>
        </div>
      </section>

      {showForm ? (
        <section className="soft-panel p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-stone-900">New order</h2>
            <p className="text-sm text-stone-500">Add a sale with customer and payment status details.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">Customer</span>
              <select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="">Walk-in / No customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">Description *</span>
              <input
                required
                placeholder="e.g. Tiffin - 10 boxes"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">Total amount *</span>
              <input
                required
                type="number"
                placeholder="500"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">Payment status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </label>

            {form.status === 'partial' ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-600">Amount received</span>
                <input
                  type="number"
                  placeholder="200"
                  value={form.amountPaid}
                  onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </label>
            ) : null}

            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="primary-btn">
                {saving ? 'Saving...' : 'Save order'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="secondary-btn">
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="soft-panel overflow-hidden p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Order history</h2>
            <p className="text-sm text-stone-500">Designed to scan quickly on both laptop and mobile.</p>
          </div>
          <ClipboardList className="h-5 w-5 text-stone-400" />
        </div>

        {loading ? (
          <div className="rounded-[24px] bg-stone-50 p-8 text-center text-stone-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-[24px] bg-stone-50 p-10 text-center text-stone-400">No orders yet. Add your first order to begin tracking sales.</div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <article key={order._id} className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-bold text-stone-900">{order.description}</div>
                    <div className="mt-1 text-sm text-stone-500">{order.customerName || 'Walk-in customer'}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl bg-stone-50 px-4 py-3 text-right">
                      <div className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-stone-400">
                        <IndianRupee className="h-3.5 w-3.5" />
                        Amount
                      </div>
                      <div className="mt-1 font-semibold text-stone-900">Rs {order.amount.toLocaleString('en-IN')}</div>
                      {order.status === 'partial' ? (
                        <div className="text-xs text-stone-500">Rs {order.amountPaid.toLocaleString('en-IN')} paid</div>
                      ) : null}
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <div className="text-sm text-stone-400">{format(new Date(order.createdAt), 'd MMM yyyy')}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
