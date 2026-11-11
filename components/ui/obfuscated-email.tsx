'use client'

import { useState } from 'react'
import { Mail, Copy, Check } from 'lucide-react'
import { copyText } from '@/lib/clipboard'
import { sound } from '@/lib/sound'

interface ObfuscatedEmailProps {
  email: string
  name: string
}

/**
 * Enterprise Anti-Scraping Team Contact Component
 *
 * Prevents automated harvest bots from scraping plaintext `mailto:` tags in SSR HTML
 * while delivering a 1-tap native mail launch and instant clipboard copy with audio feedback.
 */
export function ObfuscatedEmail({ email, name }: ObfuscatedEmailProps) {
  const [copied, setCopied] = useState(false)

  // Disassemble user and domain components to avoid static mailto links in raw markup
  const parts = email.split('@')
  const user = parts[0] ?? ''
  const domain = parts[1] ?? ''

  const handleLaunchMail = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user || !domain) return
    window.location.href = `mailto:${user}@${domain}`
  }

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!user || !domain) return
    const success = await copyText(`${user}@${domain}`)
    if (success) {
      sound.playChime()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="inline-flex items-center justify-between gap-2 group/email w-full py-0.5">
      <button
        type="button"
        onClick={handleLaunchMail}
        className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted hover:text-accent transition-colors text-left truncate min-w-0 flex-1 outline-none focus-visible:text-accent cursor-pointer select-text"
        title={`Email ${name} directly`}
        aria-label={`Email ${name} directly`}
      >
        <Mail size={13} className="text-accent shrink-0" aria-hidden="true" />
        <span className="truncate select-text" data-user={user} data-domain={domain}>
          {user}&#64;{domain}
        </span>
      </button>

      <button
        type="button"
        onClick={handleCopyEmail}
        onMouseEnter={() => sound.playHover()}
        title="Copy email to clipboard"
        aria-label={`Copy ${name}'s email to clipboard`}
        className="opacity-0 group-hover/email:opacity-100 focus:opacity-100 transition-opacity p-1 text-fg-subtle hover:text-accent outline-none cursor-pointer shrink-0 rounded"
      >
        {copied ? (
          <Check size={12} className="text-accent" aria-hidden="true" />
        ) : (
          <Copy size={12} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
