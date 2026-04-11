'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CircleDollarSign, MessageCircleMore, Phone, Plus, Users } from 'lucide-react'

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString('en-IN')}`
}

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', pendingAmount: '', notes: '' })

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        pendingAmount: Number(form.pendingAmount) || 0,
      }),
    })

    if (res.ok) {
      const newCustomer = await res.json()
      setCustomers((current) => [newCustomer, ...current])
      setForm({ name: '', phone: '', pendingAmount: '', notes: '' })
      setShowForm(false)
    }

    setSaving(false)
  }

  const handleSendReminder = (customerId) => {
    router.push(`/dashboard/whatsapp?customerId=${customerId}`)
  }

  const totalPending = customers.reduce((sum, c) => sum + (c.pendingAmount || 0), 0)
  const pendingCustomers = customers.filter((customer) => customer.pendingAmount > 0)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 px-6 py-7 text-white shadow-[0_30px_90px_-50px_rgba(20,184,166,0.85)] sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_56%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-50">
              <Users className="h-4 w-4" />
              Customer relationships
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">
              Keep people, balances, and follow-up in one place
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/90">
              Quickly see who owes money, who needs a reminder, and which customers need a little extra context.
            </p>
          </div>

          <button onClick={() => setShowForm((current) => !current)} className="secondary-btn border-white/20 bg-white/15 text-white hover:bg-white/20 hover:text-white">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Hide form' : 'Add customer'}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="soft-panel p-5">
          <div className="text-sm font-medium text-stone-500">Total customers</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-stone-900">{customers.length}</div>
        </div>
        <div className="rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
          <div className="text-sm font-medium text-amber-700">Pending balances</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-amber-900">{formatCurrency(totalPending)}</div>
        </div>
        <div className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="text-sm font-medium text-emerald-700">Need reminder</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-emerald-900">{pendingCustomers.length}</div>
        </div>
      </section>

      {showForm ? (
        <section className="soft-panel p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-stone-900">Add customer</h2>
            <p className="text-sm text-stone-500">Store contact details and pending balances for cleaner follow-up.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">Name *</span>
              <input
                required
                placeholder="Customer name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">WhatsApp number *</span>
              <input
                required
                placeholder="+919876543210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">Pending amount</span>
              <input
                type="number"
                placeholder="0"
                value={form.pendingAmount}
                onChange={(e) => setForm({ ...form, pendingAmount: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-600">Notes</span>
              <input
                placeholder="Any notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="primary-btn">
                {saving ? 'Saving...' : 'Save customer'}
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
            <h2 className="text-xl font-bold text-stone-900">Customer list</h2>
            <p className="text-sm text-stone-500">Balances, contact info, and quick reminders.</p>
          </div>
          <ArrowRight className="h-4 w-4 text-stone-400" />
        </div>

        {loading ? (
          <div className="rounded-[24px] bg-stone-50 p-8 text-center text-stone-400">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="rounded-[24px] bg-stone-50 p-10 text-center text-stone-400">
            No customers yet. Add your first customer to start tracking relationships.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {customers.map((customer) => (
              <article key={customer._id} className="rounded-[26px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{customer.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${customer.pendingAmount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {customer.pendingAmount > 0 ? 'Pending' : 'Clear'}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <CircleDollarSign className="h-4 w-4" />
                    Pending amount
                  </div>
                  <div className={`mt-2 text-2xl font-black tracking-tight ${customer.pendingAmount > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                    {formatCurrency(customer.pendingAmount)}
                  </div>
                  {customer.notes ? <div className="mt-3 text-sm text-stone-500">{customer.notes}</div> : null}
                </div>

                <div className="mt-4 flex gap-3">
                  {customer.pendingAmount > 0 ? (
                    <button
                      onClick={() => handleSendReminder(customer._id)}
                      className="primary-btn flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <MessageCircleMore className="mr-2 h-4 w-4" />
                      Send reminder
                    </button>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      No reminder needed
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
