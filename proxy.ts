import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  verifyReplyToken,
  sealReplySession,
  unsealReplySession,
  REPLY_SESSION_COOKIE_NAME,
  type ReplySession,
} from '@/lib/crypto'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/reply') {
    // 1. Check if user already holds a cryptographically sealed, valid session cookie
    const sessionCookie = request.cookies.get(REPLY_SESSION_COOKIE_NAME)?.value
    const activeSession = unsealReplySession(sessionCookie)

    if (activeSession) {
      return NextResponse.next()
    }

    // 2. If no valid cookie, inspect incoming query params for a 1-Time Magic Link
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email') || searchParams.get('amp;email')
    const name = searchParams.get('name') || searchParams.get('amp;name')
    const exp = searchParams.get('exp') || searchParams.get('amp;exp')
    const token = searchParams.get('token') || searchParams.get('amp;token')

    const isValidToken = verifyReplyToken({
      clientEmail: email,
      clientName: name,
      exp,
      token,
    })

    if (isValidToken && email && exp) {
      const expNum = Number(exp)
      const session: ReplySession = {
        clientName: (name || 'Valued Client').trim(),
        clientEmail: email.trim(),
        clientPhone: (searchParams.get('phone') || searchParams.get('amp;phone'))?.trim() || undefined,
        clientCompany: (searchParams.get('company') || searchParams.get('amp;company'))?.trim() || undefined,
        budget: (searchParams.get('budget') || searchParams.get('amp;budget'))?.trim() || undefined,
        currency: (searchParams.get('currency') || searchParams.get('amp;currency'))?.trim() || 'INR',
        message: (searchParams.get('message') || searchParams.get('amp;message'))?.trim() || '',
        exp: expNum,
        issuedAt: Math.floor(Date.now() / 1000),
      }

      const sealedCookie = sealReplySession(session)
      const isProduction = process.env.NODE_ENV === 'production'

      const response = NextResponse.next()
      response.cookies.set(REPLY_SESSION_COOKIE_NAME, sealedCookie, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: Math.max(0, expNum - Math.floor(Date.now() / 1000)),
      })

      return response
    }

    // 3. Neither valid cookie nor valid token: Stealth 404 Rewrite
    return NextResponse.rewrite(new URL('/_not-found', request.url), {
      status: 404,
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/reply'],
}
