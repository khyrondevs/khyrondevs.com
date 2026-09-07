'use client'

import { useState } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Faq {
  question: string
  answer: string
}

interface ContactFormProps {
  faqs: Faq[]
}

export function ContactForm({ faqs }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    budget: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (formData.name.trim().length < 2) {
      setErrorMsg('Name must be at least 2 characters.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (formData.message.trim().length < 20) {
      setErrorMsg('Please describe your project in at least 20 characters.')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
    } catch (err: unknown) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="text-sm text-fg-muted mb-1.5 block font-medium">Name <span className="text-accent">*</span></label>
                <input
                  id="name"
                  type="text"
                  required
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
                  aria-required="true"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="text-sm text-fg-muted mb-1.5 block font-medium">Company</label>
                <input
                  id="company"
                  type="text"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="budget" className="text-sm text-fg-muted mb-1.5 block font-medium">Budget range</label>
                <select
                  id="budget"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors appearance-none"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option value="">Select a range</option>
                  <option value="< £5k">&lt; £5k</option>
                  <option value="£5k–£20k">£5k–£20k</option>
                  <option value="£20k–£50k">£20k–£50k</option>
                  <option value="£50k+">£50k+</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-sm text-fg-muted mb-1.5 block font-medium">Project description <span className="text-accent">*</span></label>
              <textarea
                id="message"
                required
                aria-required="true"
                rows={5}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-fg w-full placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-y"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {errorMsg && (
              <div role="alert" className="text-red-400 text-sm bg-red-400/10 p-3 rounded-md border border-red-400/20">
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === 'submitting'}
              className="w-full md:w-auto h-12 px-8"
            >
              {status === 'submitting' ? 'Sending...' : 'Send message'}
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
