import { NextResponse } from 'next/server'
import {
  type ContactPayload,
  renderClientConfirmationEmail,
  renderTeamNotificationEmail,
  escapeHtml,
} from '@/lib/email-templates'
import { generateReplyStudioUrl } from '@/lib/crypto'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

import { checkRateLimit, resetRateLimits } from '@/lib/rate-limiter'

export { checkRateLimit as checkContactRateLimit, resetRateLimits as resetContactRateLimits }

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp?.trim()) return realIp.trim()
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp?.trim()) return cfIp.trim()
  return '127.0.0.1'
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json()

    // 1. Invisible Honeypot check (zero-friction bot neutralization)
    if (body.hp_source && body.hp_source.trim().length > 0) {
      console.log('🤖 [CONTACT API] Bot trapped in invisible honeypot. Dropped silently.')
      return NextResponse.json(
        {
          success: true,
          message: 'Message received. We will be in touch within 2 business days.',
          telemetry: {
            teamDispatched: false,
            clientDispatched: false,
          },
        },
        { status: 200 }
      )
    }

    // 2. Sliding-Window IP Rate Limiting (3 requests per 10 mins)
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(clientIp)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.retryAfter || 600,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 600),
          },
        }
      )
    }

    // 3. Cloudflare Turnstile Verification (if configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
    if (turnstileSecret) {
      if (!body.turnstileToken) {
        return NextResponse.json(
          { error: 'Security verification failed. Please complete the verification challenge.' },
          { status: 403 }
        )
      }

      try {
        const verifyFormData = new URLSearchParams()
        verifyFormData.append('secret', turnstileSecret)
        verifyFormData.append('response', body.turnstileToken)
        verifyFormData.append('remoteip', clientIp)

        const verifyRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: verifyFormData,
          }
        )

        const verifyData = (await verifyRes.json()) as {
          success: boolean
          'error-codes'?: string[]
        }
        if (!verifyData.success) {
          console.warn('[CONTACT API] Turnstile verification failed:', verifyData['error-codes'])
          return NextResponse.json(
            { error: 'Security verification failed. Please try again.' },
            { status: 403 }
          )
        }
      } catch (verifyErr) {
        console.error('[CONTACT API] Turnstile siteverify network error:', verifyErr)
        return NextResponse.json(
          { error: 'Unable to verify challenge. Please try again later.' },
          { status: 503 }
        )
      }
    }

    // 4. Payload Validation & Upper Bound Length Guards (Anti-DoS)
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
    }
    if (body.name.trim().length > 100) {
      return NextResponse.json({ error: 'Name cannot exceed 100 characters.' }, { status: 400 })
    }
    if (!body.email || !isValidEmail(body.email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (body.email.trim().length > 100) {
      return NextResponse.json(
        { error: 'Email address cannot exceed 100 characters.' },
        { status: 400 }
      )
    }
    if (!body.message || body.message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please describe your project in at least 20 characters.' },
        { status: 400 }
      )
    }
    if (body.message.trim().length > 3000) {
      return NextResponse.json(
        { error: 'Project description cannot exceed 3,000 characters.' },
        { status: 400 }
      )
    }
    if (body.company && body.company.trim().length > 100) {
      return NextResponse.json(
        { error: 'Company name cannot exceed 100 characters.' },
        { status: 400 }
      )
    }
    if (body.budget && body.budget.trim().length > 50) {
      return NextResponse.json(
        { error: 'Budget specification cannot exceed 50 characters.' },
        { status: 400 }
      )
    }
    if (body.phone && body.phone.trim().length > 0) {
      const trimmedPhone = body.phone.trim()
      if (trimmedPhone.length > 25) {
        return NextResponse.json(
          { error: 'Phone number cannot exceed 25 characters.' },
          { status: 400 }
        )
      }
      const cleanDigits = trimmedPhone.replace(/\D/g, '')
      if (trimmedPhone.startsWith('+91')) {
        // '+91' followed by 10 digits = 12 total digits
        if (cleanDigits.length !== 12) {
          return NextResponse.json(
            {
              error:
                'Indian phone number (+91) must be exactly 10 digits excluding country code.',
            },
            { status: 400 }
          )
        }
      } else if (cleanDigits.length < 7 || cleanDigits.length > 15) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number (7 to 15 digits).' },
          { status: 400 }
        )
      }
    }

    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'enquiries@khyrondevs.com'
    const senderName = process.env.BREVO_SENDER_NAME || 'Khyron Devs Inquiries'
    const senderEmail = process.env.BREVO_SENDER_EMAIL || recipient
    const apiKey = process.env.BREVO_API_KEY

    let teamDispatched = false
    let clientDispatched = false

    // 5. Dispatch via Brevo REST API (Hybrid: Template ID or High-Fidelity Custom HTML)
    if (apiKey) {
      const brevoHeaders = {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }

      const replyStudioUrl = generateReplyStudioUrl(body)
      const clientParams = {
        CLIENT_NAME: body.name.trim(),
        CLIENT_EMAIL: body.email.trim(),
        CLIENT_PHONE: body.phone?.trim() || 'Not provided',
        CLIENT_COMPANY: body.company?.trim() || 'Direct / Individual',
        CURRENCY: body.currency || 'INR',
        BUDGET: body.budget || 'Flexible',
        MESSAGE: escapeHtml(body.message.trim()).replace(/\n/g, '<br/>'),
        REPLY_STUDIO_URL: replyStudioUrl,
      }

      // ───────────────────────────────────────────────────────────────────────
      // DISPATCH A: Internal Team Alert (Delivered to Zoho Mail group)
      // ───────────────────────────────────────────────────────────────────────
      const teamSubject = `[NEW BRIEF] ${body.name.trim()} (${body.company?.trim() || 'Direct'}) [${body.currency || 'INR'}]`
      const teamPayload: Record<string, unknown> = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: recipient, name: 'Khyron Devs Team' }],
        replyTo: { email: body.email.trim(), name: body.name.trim() },
        subject: teamSubject,
      }

      const teamTemplateId = Number(
        process.env.BREVO_TEAM_TEMPLATE_ID || process.env.BREVO_TEMPLATE_ID
      )
      if (!Number.isNaN(teamTemplateId) && teamTemplateId > 0) {
        teamPayload.templateId = teamTemplateId
        teamPayload.params = clientParams
      } else {
        teamPayload.htmlContent = renderTeamNotificationEmail(body)
      }

      // ───────────────────────────────────────────────────────────────────────
      // DISPATCH B: Automated Client Confirmation (Delivered to Enquirer)
      // ───────────────────────────────────────────────────────────────────────
      const clientSubject = 'Inquiry Acknowledged: Project Partnership // Khyron Devs'
      const clientPayload: Record<string, unknown> = {
        sender: { name: 'Khyron Devs', email: senderEmail },
        to: [{ email: body.email.trim(), name: body.name.trim() }],
        replyTo: { email: recipient, name: 'Khyron Devs Team' },
        subject: clientSubject,
      }

      const clientTemplateId = Number(process.env.BREVO_CLIENT_TEMPLATE_ID)
      if (!Number.isNaN(clientTemplateId) && clientTemplateId > 0) {
        clientPayload.templateId = clientTemplateId
        clientPayload.params = clientParams
      } else {
        clientPayload.htmlContent = renderClientConfirmationEmail(body)
      }

      // Execute both dispatches in parallel with isolated fault-tolerance
      const [teamResult, clientResult] = await Promise.allSettled([
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: brevoHeaders,
          body: JSON.stringify(teamPayload),
        }),
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: brevoHeaders,
          body: JSON.stringify(clientPayload),
        }),
      ])

      // Process Team Result
      if (teamResult.status === 'fulfilled' && teamResult.value.ok) {
        teamDispatched = true
      } else {
        const errorDetail =
          teamResult.status === 'fulfilled'
            ? await teamResult.value.json().catch(() => ({}))
            : teamResult.reason
        console.error('[CONTACT API] Brevo Team Dispatch Failed:', errorDetail)
      }

      // Process Client Result
      if (clientResult.status === 'fulfilled' && clientResult.value.ok) {
        clientDispatched = true
      } else {
        const errorDetail =
          clientResult.status === 'fulfilled'
            ? await clientResult.value.json().catch(() => ({}))
            : clientResult.reason
        console.error('[CONTACT API] Brevo Client Confirmation Failed:', errorDetail)
      }
    }

    // 6. Fallback / Dev Telemetry Log
    if (!teamDispatched || !clientDispatched) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📬 [CONTACT INQUIRY PROCESSED]')
      console.log(`👤 Name:             ${body.name}`)
      console.log(`✉️  Client Email:    ${body.email} (Dispatched: ${clientDispatched ? '✅' : '❌'})`)
      console.log(`🏢 Zoho Team Inbox:  ${recipient} (Dispatched: ${teamDispatched ? '✅' : '❌'})`)
      console.log(`📞 Phone:            ${body.phone || 'N/A'}`)
      console.log(`🏢 Company:          ${body.company || 'N/A'}`)
      console.log(`💰 Currency:         ${body.currency || 'INR'}`)
      console.log(`📊 Budget:           ${body.budget || 'N/A'}`)
      console.log(`📝 Message:          ${body.message}`)
      if (!apiKey) {
        console.log('ℹ️  Tip: Set BREVO_API_KEY in .env to enable live email delivery.')
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message received. We will be in touch within 2 business days.',
        telemetry: {
          teamDispatched,
          clientDispatched,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[CONTACT API] Unhandled exception:', err)
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again.' },
      { status: 500 }
    )
  }
}
