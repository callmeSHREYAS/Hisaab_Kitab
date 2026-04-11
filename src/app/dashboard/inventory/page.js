'use client'

import { useEffect, useState } from 'react'

const UNIT_OPTIONS = ['pieces', 'kg', 'litre', 'packet', 'dozen', 'metre']
const FILTERS = [
  { id: 'all', label: 'All Items' },
  { id: 'low', label: 'Low Stock' },
  { id: 'healthy', label: 'Healthy' },
]

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString('en-IN')}`
}

function getStatusMeta(item) {
  if (item.needsRestock) {
    return {
      label: 'Needs restock',
      tone: 'border-amber-200 bg-amber-50 text-amber-800',
      progress: 'bg-amber-500',
      surface: 'from-amber-50 via-white to-orange-50',
      ring: 'ring-amber-100',
    }
  }

  return {
    label: 'Stock healthy',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    progress: 'bg-emerald-500',
    surface: 'from-white via-white to-emerald-50',
    ring: 'ring-emerald-100',
  }
}

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [alertCount, setAlertCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editQty, setEditQty] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    restockThreshold: '5',
    costPerUnit: '',
  })

  useEffect(() => {
    fetch('/api/inventory')
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || [])
        setAlertCount(data.alertCount || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const lowStockItems = items.filter((item) => item.needsRestock)
  const healthyItems = items.filter((item) => !item.needsRestock)
  const totalUnits = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const inventoryValue = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.costPerUnit || 0),
    0
  )
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())

    if (!matchesSearch) return false
    if (activeFilter === 'low') return item.needsRestock
    if (activeFilter === 'healthy') return !item.needsRestock
    return true
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)

    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        restockThreshold: Number(form.restockThreshold),
        costPerUnit: form.costPerUnit ? Number(form.costPerUnit) : undefined,
      }),
    })

    if (res.ok) {
      const newItem = await res.json()
      const withAlert = {
        ...newItem,
        needsRestock: Number(newItem.quantity) <= Number(newItem.restockThreshold),
      }

      setItems((currentItems) => [...currentItems, withAlert])
      if (withAlert.needsRestock) {
        setAlertCount((count) => count + 1)
      }

      setForm({
        name: '',
        quantity: '',
        unit: 'pieces',
        restockThreshold: '5',
        costPerUnit: '',
      })
      setShowForm(false)
    }

    setSaving(false)
  }

  const handleUpdateQty = async (itemId) => {
    const res = await fetch('/api/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity: Number(editQty) }),
    })

    if (res.ok) {
      const updated = await res.json()
      setItems((currentItems) => {
        const nextItems = currentItems.map((item) => (item._id === itemId ? updated : item))
        setAlertCount(nextItems.filter((item) => item.needsRestock).length)
        return nextItems
      })
    }

    setEditingId(null)
    setEditQty('')
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-orange-200 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 px-6 py-7 text-white shadow-[0_24px_70px_-30px_rgba(249,115,22,0.85)] md:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.38),transparent_58%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-50 backdrop-blur">
              Smart inventory workspace
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Inventory that feels alive, clear, and easy to manage.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-orange-50/90 sm:text-base">
              Track stock health, spot restock risk faster, and update quantities from one clean workspace.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <div className="rounded-2xl border border-white/20 bg-white/14 px-4 py-3 backdrop-blur">
                <div className="text-orange-50/75">Total items</div>
                <div className="mt-1 text-xl font-bold">{items.length}</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/14 px-4 py-3 backdrop-blur">
                <div className="text-orange-50/75">Low stock</div>
                <div className="mt-1 text-xl font-bold">{alertCount}</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/14 px-4 py-3 backdrop-blur">
                <div className="text-orange-50/75">Inventory value</div>
                <div className="mt-1 text-xl font-bold">{formatCurrency(inventoryValue)}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm((current) => !current)}
              className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-stone-900"
            >
              {showForm ? 'Hide form' : 'Add new item'}
            </button>
            <button
              onClick={() => setActiveFilter('low')}
              className="rounded-2xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Focus low stock
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/50">
          <div className="text-sm font-medium text-stone-500">Total units in hand</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-stone-900">{totalUnits}</div>
          <div className="mt-2 text-sm text-stone-500">Across all inventory entries</div>
        </div>

        <div className="rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm shadow-amber-100/70">
          <div className="text-sm font-medium text-amber-700">Restock pressure</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-amber-900">{alertCount}</div>
          <div className="mt-2 text-sm text-amber-700">
            {alertCount === 0 ? 'Everything looks healthy right now.' : 'Items need attention soon.'}
          </div>
        </div>

        <div className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm shadow-emerald-100/70">
          <div className="text-sm font-medium text-emerald-700">Healthy stock lines</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-emerald-900">{healthyItems.length}</div>
          <div className="mt-2 text-sm text-emerald-700">Items safely above their threshold</div>
        </div>

        <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/50">
          <div className="text-sm font-medium text-stone-500">Average units per item</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-stone-900">
            {items.length ? Math.round(totalUnits / items.length) : 0}
          </div>
          <div className="mt-2 text-sm text-stone-500">Quick pulse on stock distribution</div>
        </div>
      </section>

      <section className="rounded-[28px] border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/50 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-xl">
            <label className="mb-2 block text-sm font-medium text-stone-600">Search inventory</label>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 transition focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by item name"
                className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-2 block text-sm font-medium text-stone-600">Browse mode</div>
            <div className="relative grid grid-cols-3 rounded-2xl bg-stone-100 p-1">
              <div
                className={`absolute bottom-1 top-1 w-[calc(33.333%-0.17rem)] rounded-xl bg-white shadow-sm transition-transform duration-300 ${
                  activeFilter === 'all'
                    ? 'translate-x-0'
                    : activeFilter === 'low'
                    ? 'translate-x-[calc(100%+0.15rem)]'
                    : 'translate-x-[calc(200%+0.3rem)]'
                }`}
              />
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative z-10 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    activeFilter === filter.id ? 'text-stone-900' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {alertCount > 0 && (
        <section className="rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-white p-5 shadow-sm shadow-amber-100/60">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                Restock spotlight
              </div>
              <h2 className="mt-1 text-xl font-bold text-stone-900">
                {alertCount} item{alertCount > 1 ? 's are' : ' is'} running low
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Prioritize the most sensitive stock lines before they affect orders.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {lowStockItems.slice(0, 4).map((item) => (
                <span
                  key={item._id}
                  className="rounded-full border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-800"
                >
                  {item.name} - {item.quantity} {item.unit}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {showForm && (
        <section className="rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)]">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Add inventory item</h2>
              <p className="text-sm text-stone-500">
                Fill the essentials and keep stock tracking tidy from day one.
              </p>
            </div>
            <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Fast entry
            </div>
          </div>

          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">Item name *</label>
              <input
                required
                placeholder="e.g. Rice"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">Current quantity *</label>
              <input
                required
                type="number"
                placeholder="10"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">Restock alert below</label>
              <input
                type="number"
                placeholder="5"
                value={form.restockThreshold}
                onChange={(e) => setForm({ ...form, restockThreshold: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">Cost per unit</label>
              <input
                type="number"
                placeholder="Optional"
                value={form.costPerUnit}
                onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Add item'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {loading ? (
        <div className="rounded-[28px] border border-stone-200 bg-white p-10 text-center text-stone-400 shadow-sm">
          Loading inventory...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <div className="text-2xl font-bold text-stone-800">
            {items.length === 0 ? 'No inventory items yet' : 'No matching items'}
          </div>
          <p className="mt-2 text-sm text-stone-500">
            {items.length === 0
              ? 'Start by adding your first stock item and this page will become your control center.'
              : 'Try another search term or switch the browse mode above.'}
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const statusMeta = getStatusMeta(item)
            const quantity = Number(item.quantity || 0)
            const threshold = Math.max(Number(item.restockThreshold || 0), 1)
            const progress = Math.min((quantity / threshold) * 100, 100)

            return (
              <article
                key={item._id}
                className={`group rounded-[28px] border bg-gradient-to-br ${statusMeta.surface} p-5 shadow-sm ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${statusMeta.ring} ${
                  item.needsRestock ? 'border-amber-200' : 'border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.tone}`}>
                      {statusMeta.label}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-stone-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">
                      Restock threshold: {item.restockThreshold} {item.unit}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/80 px-3 py-2 text-right shadow-sm">
                    <div className="text-xs uppercase tracking-[0.2em] text-stone-400">Value</div>
                    <div className="mt-1 text-sm font-semibold text-stone-800">
                      {formatCurrency(quantity * Number(item.costPerUnit || 0))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] bg-white/80 p-4 shadow-sm">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-sm text-stone-500">Available now</div>
                      <div className="mt-1 flex items-end gap-2">
                        <span className="text-4xl font-black tracking-tight text-stone-900">{quantity}</span>
                        <span className="pb-1 text-sm font-medium text-stone-500">{item.unit}</span>
                      </div>
                    </div>

                    {!editingId || editingId !== item._id ? (
                      <button
                        onClick={() => {
                          setEditingId(item._id)
                          setEditQty(String(item.quantity))
                        }}
                        className="rounded-2xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                      >
                        Update qty
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-stone-500">
                      <span>Stock health</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${statusMeta.progress}`}
                        style={{ width: `${Math.max(progress, quantity > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {editingId === item._id ? (
                  <div className="mt-4 rounded-[24px] border border-stone-200 bg-white p-4">
                    <label className="mb-2 block text-sm font-medium text-stone-600">Update quantity</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateQty(item._id)}
                        className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditQty('')
                        }}
                        className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {[5, 10, 25].map((increment) => (
                        <button
                          key={increment}
                          type="button"
                          onClick={() => setEditQty(String(Number(editQty || item.quantity || 0) + increment))}
                          className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-orange-100 hover:text-orange-700"
                        >
                          +{increment}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-stone-500">
                    Cost per unit: <span className="font-semibold text-stone-800">{formatCurrency(item.costPerUnit)}</span>
                  </div>
                  {item.needsRestock ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      Reorder soon
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Ready
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
