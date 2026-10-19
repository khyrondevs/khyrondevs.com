'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Send, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { ReplySession } from '@/lib/crypto'

interface Preset {
  title: string
  generate: (name: string, company: string) => string
}

const PRESETS: Preset[] = [
  {
    title: 'Discovery Call',
    generate: (name, company) =>
      `Hi ${name || 'there'},\n\nThank you for reaching out to Khyron Devs. We thoroughly reviewed your brief${company ? ` for ${company}` : ''}. We have deep experience building high-performance architectures in this space and would love to walk you through our benchmark blueprints.\n\nCould we schedule a brief 20-minute architecture discovery call this Thursday or Friday to align on technical requirements?`,
  },
  {
    title: 'Scope & Preliminary Estimate',
    generate: (name, company) =>
      `Hi ${name || 'there'},\n\nWe evaluated your project scope${company ? ` for ${company}` : ''} against our engineering benchmarks. Based on our preliminary breakdown, this project maps cleanly to an agile 4–6 week delivery cycle with bi-weekly sprint demos and dedicated telemetry.\n\nLet us know your availability for a kickoff conversation.`,
  },
  {
    title: 'Architecture Clarification',
    generate: (name) =>
      `Hi ${name || 'there'},\n\nWe received your inquiry and have queued it for architectural sizing. To help us provide a precise milestone breakdown, could you share a bit more about:\n1. Your target concurrent user volume / throughput\n2. Any mandatory third-party integrations or cloud preferences\n3. Your ideal launch target date\n\nLooking forward to your thoughts!`,
  },
]

const TEAM_MEMBERS = [
  { name: 'Vittal', role: 'Lead Systems & Full-Stack Architect' },
  { name: 'Gowtham R', role: 'Lead Compute & Distributed Backend Engineer' },
  { name: 'Gurupavan BR', role: 'Business Intelligence & Data Strategist' },
]

interface ReplyClientProps {
  session: ReplySession
  sessionToken?: string
}

export function ReplyClient({ session, sessionToken }: ReplyClientProps) {
  const clientName = session.clientName || ''
  const clientEmail = session.clientEmail || ''
  const clientPhone = session.clientPhone || ''
  const clientCompany = session.clientCompany || ''
  const budget = session.budget || ''
  const currency = session.currency || 'INR'
  const originalMessage = session.message || ''

  const [devIndex, setDevIndex] = useState(0)
  const [customDevName, setCustomDevName] = useState('')
  const [customDevRole, setCustomDevRole] = useState('')
  const [isCustomDev, setIsCustomDev] = useState(false)

  const activeDevName = isCustomDev ? customDevName : TEAM_MEMBERS[devIndex].name
  const activeDevRole = isCustomDev ? customDevRole : TEAM_MEMBERS[devIndex].role

  const [replyMessage, setReplyMessage] = useState(
    () => PRESETS[0].generate(clientName, clientCompany)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    messageId?: string
    error?: string
  } | null>(null)

  // Clean address bar and browser history without an expensive or fragile server redirect
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleApplyPreset = (preset: Preset) => {
    setReplyMessage(preset.generate(clientName, clientCompany))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientEmail) {
      setResult({ success: false, error: 'Client email is missing from active session.' })
      return
    }
    if (!replyMessage.trim()) {
      setResult({ success: false, error: 'Please enter a reply message.' })
      return
    }

    setIsSubmitting(true)
    setResult(null)

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (sessionToken) {
        headers['x-reply-session'] = sessionToken
      }

      const res = await fetch('/api/reply', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          replyMessage,
          devName: activeDevName,
          devRole: activeDevRole,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setResult({ success: true, messageId: data.messageId })
      } else {
        setResult({ success: false, error: data.error || 'Failed to dispatch email.' })
      }
    } catch (err) {
      setResult({ success: false, error: String(err) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-border/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider bg-accent/15 text-accent border border-accent/30 px-2.5 py-0.5 rounded-full">
              Khyron Devs &bull; Response Studio
            </span>
            <span className="font-mono text-xs text-fg-muted">Occasion 3 // Template Dispatcher</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-fg">
            Dispatch Branded Developer Reply
          </h1>
          <p className="text-sm text-fg-muted mt-1">
            Wraps your message in dark-mode <strong className="text-fg">Template 3</strong> and automatically preserves the client’s original inquiry brief.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-fg-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Contact
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-bg-card border border-border/60 rounded-xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Engineer Profile Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-fg-muted mb-2">
                Replying Engineer / Signature
              </label>
              {!isCustomDev ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {TEAM_MEMBERS.map((dev, i) => (
                    <button
                      key={dev.name}
                      type="button"
                      onClick={() => setDevIndex(i)}
                      className={`p-2.5 text-left rounded-lg border text-xs transition-all flex flex-col justify-between ${
                        devIndex === i
                          ? 'border-accent bg-accent/10 text-fg shadow-sm'
                          : 'border-border/60 bg-bg/40 text-fg-muted hover:border-border'
                      }`}
                    >
                      <div className="font-semibold text-fg">{dev.name}</div>
                      <div className="text-[10px] text-accent font-mono leading-tight mt-1 break-words">{dev.role}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={customDevName}
                    onChange={(e) => setCustomDevName(e.target.value)}
                    placeholder="Engineer Name"
                    className="bg-bg/60 border border-border/60 rounded-lg px-3 py-2 text-xs text-fg focus:border-accent outline-none"
                  />
                  <input
                    type="text"
                    value={customDevRole}
                    onChange={(e) => setCustomDevRole(e.target.value)}
                    placeholder="Role Title"
                    className="bg-bg/60 border border-border/60 rounded-lg px-3 py-2 text-xs text-fg focus:border-accent outline-none"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsCustomDev(!isCustomDev)}
                className="mt-2 text-[11px] font-mono text-accent hover:underline"
              >
                {isCustomDev ? '← Use Core Team Presets' : '+ Custom Engineer / Role'}
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-fg-muted mb-2">
                Quick Response Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-bg/80 border border-border/60 text-fg-muted hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3 text-accent" />
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Message Field */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-fg-muted mb-2">
                Your Response Message <span className="text-accent">*</span>
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={9}
                required
                placeholder="Type your response to the client..."
                className="w-full bg-bg/80 border border-border/60 rounded-lg p-3.5 text-sm text-fg leading-relaxed placeholder:text-fg-muted/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none font-sans"
              />
              <p className="mt-1.5 text-[11px] text-fg-muted font-mono">
                Paragraph breaks will be automatically converted to responsive HTML email formatting.
              </p>
            </div>

            {/* Feedback / Status */}
            {result && (
              <div
                className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
                  result.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {result.success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-200">
                        Template 3 Delivered Successfully!
                      </div>
                      <div className="text-xs font-mono text-emerald-400/80 mt-1">
                        Brevo Message ID: {result.messageId}
                      </div>
                      <div className="text-xs text-fg-muted mt-2">
                        The client has received your custom response with their original inquiry brief embedded below your signature.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-rose-200">Dispatch Failed</div>
                      <div className="text-xs mt-1 text-rose-300/80">{result.error}</div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs font-mono text-fg-muted">
                Recipient: <span className="text-accent">{clientEmail || 'No email specified'}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !clientEmail}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-bg font-semibold text-xs tracking-wider uppercase hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent/20"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Dispatch Branded Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Client Inquiry Dossier Card */}
          <div className="bg-bg-card border border-border/60 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/40">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Recorded Inquiry Dossier
              </span>
              <span className="font-mono text-[10px] text-fg-muted bg-bg px-2 py-0.5 rounded border border-border/40">
                Verified Transmission
              </span>
            </div>

            <dl className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/20">
                <dt className="text-fg-muted font-mono uppercase text-[11px]">Client Name:</dt>
                <dd className="font-semibold text-fg">{clientName || 'N/A'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <dt className="text-fg-muted font-mono uppercase text-[11px]">Email Address:</dt>
                <dd className="font-mono text-accent">{clientEmail || 'N/A'}</dd>
              </div>
              {clientPhone && (
                <div className="flex justify-between py-1 border-b border-border/20">
                  <dt className="text-fg-muted font-mono uppercase text-[11px]">Phone / WhatsApp:</dt>
                  <dd className="font-mono text-fg">{clientPhone}</dd>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-border/20">
                <dt className="text-fg-muted font-mono uppercase text-[11px]">Company / Entity:</dt>
                <dd className="text-fg">{clientCompany || 'Direct / Individual'}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <dt className="text-fg-muted font-mono uppercase text-[11px]">Selected Budget:</dt>
                <dd className="font-mono font-bold text-accent">
                  {budget ? `${budget} (${currency})` : 'Flexible'}
                </dd>
              </div>
            </dl>

            <div className="mt-4 pt-3 border-t border-border/30">
              <div className="text-[10px] font-mono uppercase text-fg-muted mb-2">Original Project Scope:</div>
              <div className="text-xs text-fg-muted leading-relaxed italic bg-bg/50 p-3 rounded border border-border/30 max-h-48 overflow-y-auto">
                &ldquo;{originalMessage || 'No project description provided.'}&rdquo;
              </div>
            </div>
          </div>

          {/* How This Works Card */}
          <div className="bg-bg/40 border border-border/40 rounded-xl p-5 text-xs space-y-2.5 text-fg-muted">
            <div className="font-mono font-semibold text-fg text-xs uppercase tracking-wider flex items-center gap-1.5">
              💡 Why use this studio?
            </div>
            <p className="leading-relaxed">
              Standard email clients (Zoho Mail, Gmail) cannot automatically wrap outbound replies in custom HTML templates.
            </p>
            <p className="leading-relaxed">
              Clicking <strong>Dispatch Branded Reply</strong> triggers Brevo REST API with <code className="text-accent font-mono">BREVO_REPLY_TEMPLATE_ID</code>, generating an official, dark-mode email containing your message, engineer credentials, and their exact inquiry summary.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
