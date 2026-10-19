'use client'

import { useState, useEffect, useRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurrencySelector } from '@/components/ui/currency-selector'
import {
  CURRENCIES,
  useCurrency,
  type CurrencyCode,
} from '@/lib/currency'
import { formatCooldownTime } from '@/lib/rate-limiter'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface Faq {
  question: string
  answer: string
}

interface ContactFormProps {
  faqs: Faq[]
}

interface CountryCodeOption {
  code: string
  name: string
  flag: string
}

const COUNTRY_CODES: CountryCodeOption[] = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'US / Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
]

export function ContactForm({ faqs }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [currency, setCurrency] = useCurrency()
  const [countryCode, setCountryCode] = useState('+91')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    budget: '',
    hp_source: '',
  })

  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (cooldownSeconds <= 0) return

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setErrorMsg('')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldownSeconds])

  useEffect(() => {
    if (!siteKey || !turnstileContainerRef.current) return

    const renderWidget = () => {
      if (window.turnstile && turnstileContainerRef.current && !turnstileWidgetId.current) {
        try {
          turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setTurnstileToken(token)
            },
            'expired-callback': () => {
              setTurnstileToken('')
            },
            theme: 'dark',
          })
        } catch (e) {
          console.error('Turnstile render error:', e)
        }
      }
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      let script = document.querySelector(
        'script[src*="turnstile/v0/api.js"]'
      ) as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
      const checkTurnstileInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstileInterval)
          renderWidget()
        }
      }, 100)
      return () => {
        clearInterval(checkTurnstileInterval)
        if (turnstileWidgetId.current && window.turnstile) {
          window.turnstile.remove(turnstileWidgetId.current)
          turnstileWidgetId.current = null
        }
      }
    }

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current)
        turnstileWidgetId.current = null
      }
    }
  }, [siteKey])

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency)
    setFormData((prev) => ({ ...prev, budget: '' }))
  }

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value
    setCountryCode(newCode)
    if (newCode === '+91' && formData.phone.length > 10) {
      setFormData((prev) => ({ ...prev, phone: prev.phone.slice(0, 10) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (cooldownSeconds > 0) {
      setErrorMsg(
        `Submission rate limit reached. Please try again after ${formatCooldownTime(cooldownSeconds)}.`
      )
      return
    }

    if (formData.name.trim().length < 2) {
      setErrorMsg('Name must be at least 2 characters.')
      return
    }
    if (formData.name.trim().length > 100) {
      setErrorMsg('Name cannot exceed 100 characters.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (formData.email.trim().length > 100) {
      setErrorMsg('Email address cannot exceed 100 characters.')
      return
    }
    if (formData.company.trim().length > 100) {
      setErrorMsg('Company name cannot exceed 100 characters.')
      return
    }
    if (formData.phone.trim().length > 0) {
      if (countryCode === '+91' && formData.phone.trim().length !== 10) {
        setErrorMsg('Indian phone numbers (+91) must be exactly 10 digits.')
        return
      }
      if (
        countryCode !== '+91' &&
        (formData.phone.trim().length < 7 || formData.phone.trim().length > 15)
      ) {
        setErrorMsg('Please enter a valid phone number (7 to 15 digits).')
        return
      }
    }
    if (formData.message.trim().length < 20) {
      setErrorMsg('Please describe your project in at least 20 characters.')
      return
    }
    if (formData.message.trim().length > 3000) {
      setErrorMsg('Project description cannot exceed 3,000 characters.')
      return
    }
    if (siteKey && !turnstileToken) {
      setErrorMsg('Please complete the security verification challenge.')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.trim() ? `${countryCode} ${formData.phone.trim()}` : '',
          currency,
          turnstileToken: turnstileToken || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429 && typeof data.retryAfter === 'number') {
          const waitSeconds = Math.max(1, data.retryAfter)
          setCooldownSeconds(waitSeconds)
          throw new Error(
            `Submission limit reached. Please try again after ${formatCooldownTime(waitSeconds)}.`
          )
        }
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
    } catch (err: unknown) {
      if (siteKey && window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current)
        setTurnstileToken('')
      }
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setErrorMsg(message)
      setStatus('error')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
      <div className="lg:col-span-7">
        {status === 'success' ? (
          <div className="bg-surface border border-border rounded-lg p-8 md:p-12 text-center">
            <h3 className="text-2xl font-light text-fg mb-4">Message received.</h3>
            <p className="text-fg-muted">Thanks — we’ll be in touch within 2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invisible Honeypot field for bot mitigation */}
            <div
              style={{
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                zIndex: -1,
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
              tabIndex={-1}
            >
              <label htmlFor="hp_source">Leave this field blank</label>
              <input
                id="hp_source"
                name="hp_source"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.hp_source}
                onChange={(e) => setFormData({ ...formData, hp_source: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="text-sm text-fg-muted mb-1.5 block font-medium">Name <span className="text-accent">*</span></label>
                <input
                  id="name"
                  type="text"
                  required
                  maxLength={100}
                  aria-required="true"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-fg-muted mb-1.5 block font-medium">Email <span className="text-accent">*</span></label>
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={100}
                  aria-required="true"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="phone" className="text-sm text-fg-muted block font-medium">
                    Phone / WhatsApp
                  </label>
                  {countryCode === '+91' && (
                    <span className="text-[11px] font-mono text-fg-subtle">
                      {formData.phone.length}/10 digits
                    </span>
                  )}
                </div>
                <div className="flex rounded-lg border border-border bg-surface focus-within:border-border-strong focus-within:ring-1 focus-within:ring-[var(--accent)] transition-colors overflow-hidden">
                  <select
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    className="bg-surface/50 border-r border-border px-2.5 py-3 text-fg text-sm focus:outline-none cursor-pointer shrink-0"
                    aria-label="Country Code"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#0f121d] text-fg">
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={countryCode === '+91' ? 10 : 15}
                    placeholder={countryCode === '+91' ? '98765 43210' : 'Phone number'}
                    className="bg-transparent px-3.5 py-3 text-fg w-full placeholder:text-fg-subtle focus:outline-none text-sm"
                    value={formData.phone}
                    onKeyDown={(e) => {
                      if (
                        !/^[0-9]$/.test(e.key) &&
                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) &&
                        !e.ctrlKey &&
                        !e.metaKey
                      ) {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, '')
                      const max = countryCode === '+91' ? 10 : 15
                      setFormData({ ...formData, phone: numbersOnly.slice(0, max) })
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="text-sm text-fg-muted mb-1.5 block font-medium">Company</label>
                <input
                  id="company"
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Acme Studio"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label htmlFor="budget" className="text-sm text-fg-muted block font-medium">Budget range</label>
                <CurrencySelector value={currency} onChange={handleCurrencyChange} />
              </div>
              <select
                id="budget"
                className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors appearance-none"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              >
                <option value="">Select a range ({currency})</option>
                {CURRENCIES[currency].budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="text-sm text-fg-muted mb-1.5 block font-medium">Project description <span className="text-accent">*</span></label>
              <textarea
                id="message"
                required
                maxLength={3000}
                aria-required="true"
                rows={5}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-y"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {siteKey && (
              <div className="pt-2">
                <div ref={turnstileContainerRef} />
              </div>
            )}

            {errorMsg && (
              <div role="alert" className="text-red-400 text-sm bg-red-400/10 p-3 rounded-md border border-red-400/20">
                {cooldownSeconds > 0
                  ? `Submission limit reached. Please try again after ${formatCooldownTime(cooldownSeconds)}.`
                  : errorMsg}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === 'submitting' || cooldownSeconds > 0}
              className="w-full md:w-auto h-12 px-8"
            >
              {status === 'submitting'
                ? 'Sending...'
                : cooldownSeconds > 0
                  ? `Please wait (${formatCooldownTime(cooldownSeconds)})`
                  : 'Send message'}
            </Button>
          </form>
        )}
      </div>

      <div className="lg:col-span-5">
        <h2 className="text-xl font-light text-fg mb-6">Common questions</h2>
        <Accordion.Root type="single" collapsible className="space-y-4 w-full">
          {faqs.map((faq, i) => (
            <Accordion.Item key={i} value={`item-${i}`} className="border-b border-border overflow-hidden">
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex flex-1 items-center justify-between py-4 text-left text-fg hover:text-accent transition-colors group [&[data-state=open]>svg]:rotate-180">
                  <span className="font-medium text-sm md:text-base pr-4">{faq.question}</span>
                  <ChevronDown className="text-fg-subtle transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]" size={16} />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="text-fg-muted text-sm md:text-base leading-relaxed overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" style={{ transition: 'height 0.3s ease' }}>
                <div className="pb-4 pt-0">
                  {faq.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  )
}
