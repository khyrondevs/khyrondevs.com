import crypto from 'node:crypto'
import type { ContactPayload } from './email-templates'

const DEFAULT_EXP_SECONDS = 14 * 24 * 60 * 60 // 14 days TTL

function getSigningSecret(customSecret?: string): string {
  const secret =
    customSecret ||
    process.env.REPLY_SIGNING_SECRET ||
    process.env.BREVO_API_KEY ||
    'khyron-devs-airgap-internal-fallback-secret'
  return secret
}

function normalizeInput(email: string, name: string): { normEmail: string; normName: string } {
  return {
    normEmail: email.toLowerCase().trim(),
    normName: name.trim(),
  }
}

/**
 * Computes a tamper-proof HMAC-SHA256 token locking the client email, client name, and expiration timestamp.
 */
export function generateReplyToken(
  clientEmail: string,
  clientName: string,
  exp: number,
  customSecret?: string
): string {
  const { normEmail, normName } = normalizeInput(clientEmail, clientName)
  const secret = getSigningSecret(customSecret)
  const message = `${normEmail}:${exp}:${normName}`
  return crypto.createHmac('sha256', secret).update(message).digest('hex')
}

/**
 * Validates the HMAC signature and checks timestamp expiration using constant-time comparison.
 */
export function verifyReplyToken(
  params: {
    clientEmail?: string | null
    clientName?: string | null
    exp?: number | string | null
    token?: string | null
  },
  customSecret?: string
): boolean {
  const { clientEmail, clientName, exp, token } = params

  if (!clientEmail || !token || !exp) {
    return false
  }

  const expNum = Number(exp)
  if (Number.isNaN(expNum) || expNum <= 0) {
    return false
  }

  // Check TTL expiration (current epoch in seconds)
  const now = Math.floor(Date.now() / 1000)
  if (now > expNum) {
    return false
  }

  const expectedToken = generateReplyToken(clientEmail, clientName || '', expNum, customSecret)

  // Constant-time comparison to prevent timing side-channel attacks
  try {
    const tokenBuffer = Buffer.from(token, 'hex')
    const expectedBuffer = Buffer.from(expectedToken, 'hex')

    if (tokenBuffer.length !== expectedBuffer.length) {
      return false
    }

    return crypto.timingSafeEqual(tokenBuffer, expectedBuffer)
  } catch {
    return false
  }
}

/**
 * Generates an authenticated magic link for the 1-Click Reply Studio.
 */
export function generateReplyStudioUrl(
  payload: ContactPayload,
  baseUrl: string = 'https://khyrondevs.com',
  customSecret?: string
): string {
  const exp = Math.floor(Date.now() / 1000) + DEFAULT_EXP_SECONDS
  const token = generateReplyToken(payload.email, payload.name, exp, customSecret)

  const params = new URLSearchParams()
  params.set('name', payload.name.trim())
  params.set('email', payload.email.trim())
  if (payload.company?.trim()) params.set('company', payload.company.trim())
  if (payload.budget?.trim()) params.set('budget', payload.budget.trim())
  if (payload.currency?.trim()) params.set('currency', payload.currency.trim())
  if (payload.phone?.trim()) params.set('phone', payload.phone.trim())
  if (payload.message?.trim()) params.set('message', payload.message.trim())
  params.set('exp', String(exp))
  params.set('token', token)

  return `${baseUrl.replace(/\/$/, '')}/reply?${params.toString()}`
}

export const REPLY_SESSION_COOKIE_NAME = 'khyron_reply_session'

export interface ReplySession {
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientCompany?: string
  budget?: string
  currency?: string
  message: string
  exp: number
  issuedAt: number
}

/**
 * Seals an inquiry session into a tamper-proof HMAC-authenticated envelope.
 */
export function sealReplySession(session: ReplySession, customSecret?: string): string {
  const secret = getSigningSecret(customSecret)
  const jsonStr = JSON.stringify(session)
  const payloadB64 = Buffer.from(jsonStr, 'utf-8').toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex')
  return `${payloadB64}.${signature}`
}

/**
 * Unseals and verifies an inquiry session cookie using constant-time comparison and TTL checks.
 */
export function unsealReplySession(
  cookieValue?: string | null,
  customSecret?: string
): ReplySession | null {
  if (!cookieValue || typeof cookieValue !== 'string') {
    return null
  }

  const parts = cookieValue.split('.')
  if (parts.length !== 2) {
    return null
  }

  const [payloadB64, signature] = parts
  if (!payloadB64 || !signature) {
    return null
  }

  const secret = getSigningSecret(customSecret)
  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex')

  try {
    const sigBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (sigBuffer.length !== expectedBuffer.length) {
      return null
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null
    }

    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf-8')
    const session = JSON.parse(jsonStr) as ReplySession

    if (!session || !session.clientEmail || !session.exp) {
      return null
    }

    const now = Math.floor(Date.now() / 1000)
    if (now > session.exp) {
      return null
    }

    return session
  } catch {
    return null
  }
}
