import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { renderDeveloperReplyEmail, escapeHtml } from '@/lib/email-templates'
import { unsealReplySession, REPLY_SESSION_COOKIE_NAME } from '@/lib/crypto'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function HEAD() {
  return new Response(null, { status: 404 })
}

export async function POST(request: Request) {
  try {
    // 1. Mandatory Security Gate: Authenticate via sealed HttpOnly session cookie or x-reply-session header
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(REPLY_SESSION_COOKIE_NAME)?.value
    let session = unsealReplySession(sessionCookie)

    // Resilient fallback: If browser blocked/partitioned cookies, check sealed session header
    if (!session) {
      const headerToken = request.headers.get('x-reply-session')
      session = unsealReplySession(headerToken)
    }

    if (!session) {
      console.warn(
        '[REPLY API] Stealth 404: Blocked unauthenticated attempt to /api/reply (missing or invalid session).'
      )
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const {
      clientEmail,
      clientName,
      clientPhone,
      clientCompany,
      budget,
      currency,
      message,
    } = session

    const body = await request.json()
    const {
      replyMessage,
      devName = 'Vittal',
      devRole = 'Lead Systems & Full-Stack Architect',
    } = body

    if (!clientEmail || !isValidEmail(clientEmail.trim())) {
      return NextResponse.json({ error: 'Valid client email is required.' }, { status: 400 })
    }
    if (!replyMessage || replyMessage.trim().length < 5) {
      return NextResponse.json({ error: 'Please enter a reply message of at least 5 characters.' }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'enquiries@khyrondevs.com'
    const teamRecipient = process.env.CONTACT_RECIPIENT_EMAIL || 'enquiries@khyrondevs.com'
    const trimmedDevName = (devName || 'Khyron Devs Lead').trim()
    const trimmedDevRole = (devRole || 'Lead Systems & Full-Stack Architect').trim()

    const subject = `Re: Project Brief Discussion // Khyron Devs`
    const replyPayload: Record<string, unknown> = {
      sender: { name: `${trimmedDevName} // Khyron Devs`, email: senderEmail },
      to: [{ email: clientEmail.trim(), name: (clientName || 'Valued Client').trim() }],
      replyTo: { email: teamRecipient, name: 'Khyron Devs Team' },
      subject,
    }

    const replyTemplateId = Number(process.env.BREVO_REPLY_TEMPLATE_ID)
    if (!Number.isNaN(replyTemplateId) && replyTemplateId > 0) {
      replyPayload.templateId = replyTemplateId
      replyPayload.params = {
        CLIENT_NAME: (clientName || 'Valued Client').trim(),
        CLIENT_EMAIL: clientEmail.trim(),
        CLIENT_PHONE: clientPhone?.trim() || 'Not provided',
        CLIENT_COMPANY: clientCompany?.trim() || 'Direct / Individual',
        CURRENCY: currency || 'INR',
        BUDGET: budget || 'Flexible',
        ORIGINAL_MESSAGE: escapeHtml(message || 'N/A').replace(/\n/g, '<br/>'),
        REPLY_MESSAGE: escapeHtml(replyMessage.trim()).replace(/\n/g, '<br/>'),
        DEV_NAME: trimmedDevName,
        DEV_ROLE: trimmedDevRole,
      }
    } else {
      replyPayload.htmlContent = renderDeveloperReplyEmail(
        {
          name: clientName || 'Valued Client',
          email: clientEmail,
          phone: clientPhone,
          company: clientCompany,
          budget,
          currency,
          message: message || '',
        },
        replyMessage,
        trimmedDevName,
        trimmedDevRole
      )
    }

    if (!apiKey) {
      console.warn('[REPLY API] BREVO_API_KEY not configured. Simulating reply dispatch.')
      const simResponse = NextResponse.json({
        success: true,
        simulated: true,
        message: 'Reply simulated (no Brevo API key configured).',
      })
      simResponse.cookies.set(REPLY_SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      return simResponse
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(replyPayload),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('[REPLY API] Brevo dispatch failed:', res.status, errorText)
      return NextResponse.json(
        { error: `Brevo dispatch failed: ${res.statusText}`, detail: errorText },
        { status: 502 }
      )
    }

    const resData = (await res.json()) as { messageId?: string }
    const successResponse = NextResponse.json({
      success: true,
      messageId: resData.messageId,
      message: 'Branded developer reply (Template 3) successfully delivered.',
    })

    // Single-use security enforcement: invalidate the session cookie upon successful reply
    successResponse.cookies.set(REPLY_SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return successResponse
  } catch (err) {
    console.error('[REPLY API] Unhandled exception:', err)
    return NextResponse.json({ error: 'Failed to dispatch reply.' }, { status: 500 })
  }
}
