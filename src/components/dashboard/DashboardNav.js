'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  Boxes,
  LayoutDashboard,
  LogOut,
  MessageCircleMore,
  Users,
  WalletCards,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/customers', icon: Users, label: 'Customers' },
  { href: '/dashboard/orders', icon: WalletCards, label: 'Orders' },
  { href: '/dashboard/inventory', icon: Boxes, label: 'Inventory' },
  { href: '/dashboard/whatsapp', icon: MessageCircleMore, label: 'WhatsApp' },
]

export default function DashboardNav({ user }) {
  const pathname = usePathname()

  return (
    <>
      <aside className="hidden md:flex fixed inset-y-4 left-4 z-20 w-[272px] flex-col rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,247,237,0.88))] p-4 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="rounded-[28px] bg-[#10233f] p-5 text-white">
          <div className="font-display inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold tracking-[0.18em]">
            HK
          </div>
          <div className="mt-4">
            <div className="font-display text-2xl font-bold tracking-tight">
              HisabKitab
            </div>
            <div className="mt-1 text-sm text-slate-200/80">
              Business cockpit for daily cashflow, reminders, and stock.
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-3">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-300">Workspace</div>
            <div className="mt-1 truncate text-sm font-semibold">{user?.businessName || user?.name}</div>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-[0_18px_36px_-18px_rgba(249,115,22,0.95)]'
                    : 'text-stone-600 hover:bg-white hover:text-stone-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`rounded-xl p-2 ${isActive ? 'bg-white/12' : 'bg-stone-100 text-stone-700'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </span>
                <ArrowRight className={`h-4 w-4 transition ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </Link>
            )
          })}
        </nav>

        <div className="mt-4 rounded-[26px] border border-stone-200 bg-white/80 p-4">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img src={user.image} alt="" className="h-10 w-10 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-sm font-bold text-orange-700">
                {user?.name?.[0]?.toUpperCase() || 'H'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-stone-900">{user?.name}</div>
              <div className="truncate text-xs text-stone-500">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:hidden sticky top-0 z-20 border-b border-white/70 bg-[rgba(255,251,235,0.88)] backdrop-blur">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <div className="font-display text-lg font-bold text-stone-900">
              HisabKitab
            </div>
            <div className="text-xs text-stone-500">{user?.businessName || user?.name}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-600"
          >
            Logout
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-orange-500 text-white' : 'bg-white text-stone-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
