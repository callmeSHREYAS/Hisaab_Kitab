'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Building2, LockKeyhole, Mail, Sparkles, User2 } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [mode, setMode] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
  })

  useEffect(() => {
    const requestedMode = new URLSearchParams(window.location.search).get('mode')
    if (requestedMode === 'register') {
      setMode('register')
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleGoogle = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const handleDemo = async () => {
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: 'demo@hisabkitab.local',
      password: 'demo123',
      redirect: false,
      callbackUrl: '/dashboard',
    })

    if (result?.error) {
      setError('Demo login is unavailable right now')
      setLoading(false)
      return
    }

    router.replace(result?.url || '/dashboard')
    router.refresh()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()

        if (!res.ok) {
          setError(data.error)
          setLoading(false)
          return
        }

        const result = await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
          callbackUrl: '/dashboard',
        })

        if (result?.error) {
          setError(result.error)
        } else {
          router.replace(result?.url || '/dashboard')
          router.refresh()
        }
      } else {
        const result = await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
          callbackUrl: '/dashboard',
        })

        if (result?.error) {
          setError('Invalid email or password')
        } else {
          router.replace(result?.url || '/dashboard')
          router.refresh()
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-orange-200/35 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[34px] bg-[#10233f] p-8 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.85)] sm:p-10">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-300 transition hover:text-white">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to home
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100">
            <Sparkles className="h-4 w-4" />
            Welcome to HisabKitab
          </div>

          <h1 className="font-display mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Keep the business moving without losing the small details.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Sign in to manage customers, cashflow, reminders, and inventory from a cleaner daily workflow.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'One place for orders, customers, and stock',
              'Faster follow-up with WhatsApp reminders',
              'Useful on desktop and mobile from day one',
            ].map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3">
                <BadgeCheck className="h-5 w-5 text-emerald-300" />
                <span className="text-sm text-slate-100">{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="soft-panel flex items-center p-6 sm:p-8">
          <div className="w-full">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <div className="font-display text-3xl font-bold text-stone-900">
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </div>
                <div className="mt-1 text-sm text-stone-500">
                  {mode === 'signin' ? 'Pick up where you left off.' : 'Set up your workspace in a minute.'}
                </div>
              </div>
              <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                Secure access
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError('')
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'signin' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setError('')
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'register' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
                }`}
              >
                Register
              </button>
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="secondary-btn mb-6 w-full gap-3"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleDemo}
              disabled={loading}
              className="primary-btn mb-6 w-full bg-emerald-500 hover:bg-emerald-600"
            >
              Open demo workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">or continue with email</span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                      <User2 className="h-4 w-4" />
                      Your name
                    </span>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Ramesh Kumar"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                      <Building2 className="h-4 w-4" />
                      Business name
                    </span>
                    <input
                      name="businessName"
                      type="text"
                      placeholder="Ramesh Tiffin Centre"
                      value={form.businessName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                </div>
              ) : null}

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                  <LockKeyhole className="h-4 w-4" />
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <button type="submit" disabled={loading} className="primary-btn mt-2 w-full">
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in to dashboard' : 'Create account'}
                {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-500">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'register' : 'signin')
                  setError('')
                }}
                className="font-semibold text-orange-600 transition hover:text-orange-700"
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
