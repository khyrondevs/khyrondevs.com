import { NextResponse } from 'next/server'

interface ContactPayload {
  name: string
  email: string
  company?: string
  message: string
  budget?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json()

    // Validate — do not log contents
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
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

    // Configured endpoint for incoming inquiries. Connect external webhook or email delivery
    // provider (e.g. Resend, Postmark) via environment variables when live dispatch is active.

    return NextResponse.json(
      { success: true, message: 'Message received. We will be in touch within 2 business days.' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
