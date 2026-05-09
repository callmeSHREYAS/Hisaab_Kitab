'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { LANGUAGES, TEMPLATES } from '@/lib/whatsappTemplates'
import { CheckCircle2, Languages, MessageCircleMore, Send, UserCheck } from 'lucide-react'

export default function WhatsAppPage() {
  const searchParams = useSearchParams()
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [language, setLanguage] = useState('en')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [preview, setPreview] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data)
        const preselectedId = searchParams.get('customerId')
        if (preselectedId) {
          const found = data.find((c) => c._id === preselectedId)
          if (found) setSelectedCustomer(found)
        }
      })
  }, [searchParams])

  useEffect(() => {
    const templates = TEMPLATES[language] || TEMPLATES.en
    setSelectedTemplateId(templates[0]?.id || '')
  }, [language])

  useEffect(() => {
    if (!selectedCustomer || !selectedTemplateId) {
      setPreview('')
      return
    }

    const templates = TEMPLATES[language] || TEMPLATES.en
    const template = templates.find((t) => t.id === selectedTemplateId)
    if (!template) return

    const msg = template.message
      .replace(/{name}/g, selectedCustomer.name)
      .replace(/{amount}/g, (selectedCustomer.pendingAmount || 0).toLocaleString('en-IN'))
      .replace(/{business}/g, 'Your Business')

    setPreview(msg)
    setResult(null)
  }, [selectedCustomer, language, selectedTemplateId])

  const handleSend = async () => {
    if (!selectedCustomer || !selectedTemplateId) return
    setSending(true)
    setResult(null)

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer._id,
          templateId: selectedTemplateId,
          language,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer')
        }
        setResult({
          success: true,
          message:
            data.transport === 'whatsapp_web'
              ? 'WhatsApp opened with your reminder. Review it and press send.'
              : 'WhatsApp reminder sent successfully.',
        })
      } else {
        setResult({ success: false, message: data.error || 'Failed to send message' })
      }
    } catch (err) {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  const currentTemplates = TEMPLATES[language] || TEMPLATES.en
  const payableCustomers = customers.filter((c) => c.pendingAmount > 0)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-green-200 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-400 px-6 py-7 text-white shadow-[0_30px_90px_-50px_rgba(34,197,94,0.8)] sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_54%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-green-50">
              <MessageCircleMore className="h-4 w-4" />
              Reminder studio
            </div>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">
              Send polished payment reminders in just a few clicks
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50/90">
              Pick the customer, switch language, preview the message, and send a reminder without losing the human tone.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-green-100">Customers pending</div>
            <div className="mt-1 text-2xl font-bold">{payableCustomers.length}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="soft-panel p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-stone-900">
              <UserCheck className="h-5 w-5 text-orange-600" />
              1. Select customer
            </h2>
            <select
              value={selectedCustomer?._id || ''}
              onChange={(e) => {
                const customer = customers.find((c) => c._id === e.target.value)
                setSelectedCustomer(customer || null)
              }}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
            >
              <option value="">Choose a customer with pending payment</option>
              {payableCustomers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} - Rs {c.pendingAmount.toLocaleString('en-IN')} pending
                </option>
              ))}
            </select>
            {payableCustomers.length === 0 ? (
              <p className="mt-2 text-xs text-stone-400">No customers with pending balances right now.</p>
            ) : null}
          </div>

          <div className="soft-panel p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-stone-900">
              <Languages className="h-5 w-5 text-orange-600" />
              2. Pick language
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(LANGUAGES).map(([code, { label, flag }]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                    language === code
                      ? 'border-orange-300 bg-orange-50 text-orange-700'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-lg">{flag}</div>
                  <div className="mt-1">{label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="soft-panel p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-stone-900">
              <CheckCircle2 className="h-5 w-5 text-orange-600" />
              3. Choose tone
            </h2>
            <div className="space-y-2">
              {currentTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedTemplateId === template.id
                      ? 'border-orange-300 bg-orange-50 text-orange-800'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-semibold">{template.tone}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Message preview</h2>
                <p className="text-sm text-stone-500">Preview the exact reminder before sending.</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                WhatsApp style
              </div>
            </div>

            <div className="rounded-[28px] bg-[#e7ddd3] p-4">
              {preview ? (
                <div className="ml-auto max-w-[88%] rounded-[22px] rounded-br-md bg-[#dcf8c6] p-4 text-sm leading-7 text-stone-800 shadow-sm whitespace-pre-wrap">
                  {preview}
                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center text-sm text-stone-500">
                  Select a customer to generate the message preview.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!selectedCustomer || !selectedTemplateId || sending}
            className="w-full rounded-[26px] bg-green-500 px-5 py-4 text-lg font-semibold text-white shadow-[0_24px_50px_-26px_rgba(34,197,94,0.9)] transition hover:-translate-y-0.5 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2">
              <Send className="h-5 w-5" />
              {sending ? 'Sending...' : 'Send WhatsApp reminder'}
            </span>
          </button>

          {result ? (
            <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${result.success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {result.message}
            </div>
          ) : null}

          <div className="rounded-[28px] border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-sky-800">
            <strong>Twilio sandbox note:</strong> For testing, the customer must first send{' '}
            <code className="rounded bg-sky-100 px-1.5 py-0.5">join &lt;your-sandbox-keyword&gt;</code> to{' '}
            <strong>+14155238886</strong> on WhatsApp.
          </div>
        </div>
      </section>
    </div>
  )
}
