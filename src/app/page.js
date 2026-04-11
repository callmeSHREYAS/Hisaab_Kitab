import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import HomeAuthActions from '@/components/auth/HomeAuthActions'
import { CheckCircle2, MessageCircleMore, Package, ShieldCheck, Sparkles, Wallet } from 'lucide-react'

const FEATURES = [
  { icon: Wallet, label: 'Cashflow clarity', text: 'Track earnings, pending amounts, and recent orders at a glance.' },
  { icon: MessageCircleMore, label: 'WhatsApp reminders', text: 'Send payment nudges in multiple languages with one click.' },
  { icon: Package, label: 'Inventory radar', text: 'Know which items are healthy, low, and ready to restock.' },
  { icon: ShieldCheck, label: 'Simple and secure', text: 'Protected login with a setup small businesses can adopt fast.' },
]

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200/35 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-between rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,247,237,0.82))] p-6 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8 lg:p-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-display text-2xl font-bold text-stone-900">
              HisabKitab
            </div>
            <div className="text-sm text-stone-500">A sharper operating desk for small businesses</div>
          </div>
          <HomeAuthActions isSignedIn={Boolean(session)} />
        </header>

        <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-14">
          <div className="float-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
              <Sparkles className="h-4 w-4" />
              Built for founders who run everything themselves
            </div>

            <h1 className="font-display mt-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-stone-950 sm:text-6xl text-balance">
              Orders, inventory, reminders, and daily business health in one focused workspace.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              HisabKitab helps tiffin providers, shop owners, tutors, freelancers, and local operators stay on top of money, stock, and customer follow-up without wrestling with bulky software.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <HomeAuthActions isSignedIn={Boolean(session)} />
              <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-stone-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {session ? 'You are signed in. Open the dashboard or sign out from here.' : 'New here? Create an account first, then sign in and open the dashboard.'}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Live dashboard', 'Multilingual WhatsApp', 'Pending tracking', 'Restock alerts', 'Customer memory'].map((item) => (
                <span key={item} className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="soft-panel grid-glow relative overflow-hidden p-6 sm:p-7">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-orange-100/70 to-transparent" />
            <div className="relative">
              <div className="rounded-[28px] bg-[#10233f] p-5 text-white shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)]">
                <div className="text-xs uppercase tracking-[0.28em] text-slate-300">Today at a glance</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-sm text-slate-300">Earnings</div>
                    <div className="mt-2 text-2xl font-bold">Rs 12,400</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-sm text-slate-300">Pending</div>
                    <div className="mt-2 text-2xl font-bold">Rs 3,250</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-sm text-slate-300">Low stock</div>
                    <div className="mt-2 text-2xl font-bold">4 items</div>
                  </div>
                  <div className="rounded-2xl bg-orange-400 p-4 text-stone-950">
                    <div className="text-sm font-medium">Reminder ready</div>
                    <div className="mt-2 text-lg font-bold">Hindi polite</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[26px] border border-stone-200 bg-white/90 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-stone-800">Why teams like it</div>
                    <div className="text-sm text-stone-500">Useful features without a hard learning curve.</div>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Ready in minutes
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {FEATURES.slice(0, 3).map((feature) => {
                    const Icon = feature.icon
                    return (
                      <div key={feature.label} className="flex gap-3 rounded-2xl bg-stone-50 p-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">{feature.label}</div>
                          <div className="text-sm text-stone-500">{feature.text}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-stone-200/80 pt-6 md:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.label} className="rounded-[26px] border border-white/80 bg-white/70 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-stone-900">{feature.label}</div>
                <div className="mt-2 text-sm leading-6 text-stone-500">{feature.text}</div>
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
