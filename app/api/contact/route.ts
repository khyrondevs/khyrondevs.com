import { NextResponse } from 'next/server'

interface ContactPayload {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  budget?: string
  currency?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildEmailHtml(payload: ContactPayload): string {
  const safeName = escapeHtml(payload.name.trim())
  const safeEmail = escapeHtml(payload.email.trim())
  const rawPhone = payload.phone?.trim()
  const safePhone = rawPhone ? escapeHtml(rawPhone) : null
  const cleanPhone = rawPhone ? rawPhone.replace(/[^0-9+]/g, '') : ''
  const waNumber = cleanPhone.replace(/^\+/, '')
  const safeCompany = payload.company?.trim() ? escapeHtml(payload.company.trim()) : 'Direct / Individual'
  const safeBudget = payload.budget?.trim() ? escapeHtml(payload.budget.trim()) : 'Not specified'
  const safeCurrency = payload.currency?.trim() ? escapeHtml(payload.currency.trim()) : 'INR'
  const safeMessage = escapeHtml(payload.message.trim()).replace(/\n/g, '<br/>')
  const now = new Date()
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const istTime = `${istFormatter.format(now)} IST`

  const gmtFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const gmtTime = `${gmtFormatter.format(now)} GMT`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Inquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07080d; color: #f1f5f9; margin: 0; padding: 24px;">
  <div style="max-width: 620px; margin: 0 auto; background: #0f121d; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; overflow: hidden;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%); padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.12);">
      <span style="display: inline-block; font-family: monospace; font-size: 11px; font-weight: 600; background: rgba(56,189,248,0.2); color: #38bdf8; padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.35); text-transform: uppercase; letter-spacing: 0.08em;">Khyron Devs &bull; Client Inquiry Dispatch</span>
      <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 12px 0 0 0; letter-spacing: -0.01em;">New Project Brief Received</h1>
    </div>

    <!-- Content -->
    <div style="padding: 28px 32px; background-color: #0f121d;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; width: 140px;">Client Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 15px; color: #38bdf8; font-weight: 600;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Email:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; color: #ffffff;"><a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: underline;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Phone / WhatsApp:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; color: #ffffff;">
            ${safePhone ? `<a href="tel:${cleanPhone}" style="color: #38bdf8; text-decoration: underline; font-weight: 600;">${safePhone}</a> <span style="color: #64748b; font-size: 12px; margin-left: 8px;">(<a href="https://wa.me/${waNumber}" target="_blank" style="color: #22c55e; text-decoration: none; font-weight: 500;">💬 Open WhatsApp</a>)</span>` : '<span style="color: #64748b;">Not provided</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Company / Entity:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; color: #e2e8f0;">${safeCompany}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Selected Currency:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; color: #ffffff; font-family: monospace;">${safeCurrency}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Budget Range:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 15px; color: #38bdf8; font-weight: 600;">${safeBudget}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Received At:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 13px; font-family: monospace; color: #ffffff;">
            <strong>${istTime}</strong> <span style="color: #94a3b8; font-size: 11px;">(${gmtTime})</span>
          </td>
        </tr>
      </table>

      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 6px;">Project Scope &amp; Description:</div>
        <div style="background: #07090e; border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid #38bdf8; border-radius: 6px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e2e8f0;">
          ${safeMessage}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 18px 32px; background: #07090e; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748b; font-family: monospace;">
      Delivered via Khyron Devs Contact Pipeline &bull; ${safeCurrency} Inquiry &bull; Hit 'Reply' in email to respond directly
    </div>
  </div>
</body>
</html>
  `
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json()

    // 1. Validation
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
    }
    if (!body.email || !isValidEmail(body.email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (!body.message || body.message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please describe your project in at least 20 characters.' },
        { status: 400 }
      )
    }
    if (body.phone && body.phone.trim().length > 0) {
      const trimmedPhone = body.phone.trim()
      const cleanDigits = trimmedPhone.replace(/\D/g, '')
      if (trimmedPhone.startsWith('+91')) {
        // '+91' followed by 10 digits = 12 total digits
        if (cleanDigits.length !== 12) {
          return NextResponse.json(
            { error: 'Indian phone number (+91) must be exactly 10 digits excluding country code.' },
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
    const subject = `New Project Inquiry: ${body.name.trim()} (${body.company?.trim() || 'Direct'}) [${body.currency || 'INR'}]`
    const html = buildEmailHtml(body)
    let dispatched = false

    // 2. Dispatch Method: Brevo REST API (if BREVO_API_KEY is configured)
    if (process.env.BREVO_API_KEY) {
      try {
        const senderName = process.env.BREVO_SENDER_NAME || 'Khyron Devs Inquiries'
        const senderEmail = process.env.BREVO_SENDER_EMAIL || recipient

        const payload: Record<string, unknown> = {
          sender: { name: senderName, email: senderEmail },
          to: [{ email: recipient, name: 'Khyron Devs Team' }],
          replyTo: { email: body.email.trim(), name: body.name.trim() },
          subject,
          htmlContent: html,
        }

        if (process.env.BREVO_TEMPLATE_ID) {
          const templateIdNum = Number(process.env.BREVO_TEMPLATE_ID)
          if (!Number.isNaN(templateIdNum) && templateIdNum > 0) {
            payload.templateId = templateIdNum
            payload.params = {
              CLIENT_NAME: body.name.trim(),
              CLIENT_EMAIL: body.email.trim(),
              CLIENT_PHONE: body.phone?.trim() || 'Not provided',
              CLIENT_COMPANY: body.company?.trim() || 'Direct / Individual',
              CURRENCY: body.currency || 'INR',
              BUDGET: body.budget || 'Not specified',
              MESSAGE: body.message.trim(),
            }
          }
        }

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          dispatched = true
        } else {
          const errData = await res.json().catch(() => ({}))
          console.error('[CONTACT API] Brevo API error:', errData)
        }
      } catch (brevoErr) {
        console.error('[CONTACT API] Brevo fetch failed:', brevoErr)
      }
    }

    // 3. Fallback in Local / Development Mode (when BREVO_API_KEY is not set)
    if (!dispatched) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📬 [CONTACT INQUIRY RECEIVED]')
      console.log(`👤 Name:     ${body.name}`)
      console.log(`✉️  Email:    ${body.email}`)
      console.log(`📞 Phone:    ${body.phone || 'N/A'}`)
      console.log(`🏢 Company:  ${body.company || 'N/A'}`)
      console.log(`💰 Currency: ${body.currency || 'INR'}`)
      console.log(`📊 Budget:   ${body.budget || 'N/A'}`)
      console.log(`📝 Message:  ${body.message}`)
      console.log('ℹ️  Tip: Set BREVO_API_KEY in .env to enable live email delivery.')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }

    return NextResponse.json(
      { success: true, message: 'Message received. We will be in touch within 2 business days.' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[CONTACT API] Unhandled exception:', err)
    return NextResponse.json({ error: 'Failed to process inquiry. Please try again.' }, { status: 500 })
  }
}
