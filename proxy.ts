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
    const email = searchParams.get('email')
    const name = searchParams.get('name')
    const exp = searchParams.get('exp')
    const token = searchParams.get('token')

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
        clientPhone: searchParams.get('phone')?.trim() || undefined,
        clientCompany: searchParams.get('company')?.trim() || undefined,
        budget: searchParams.get('budget')?.trim() || undefined,
        currency: searchParams.get('currency')?.trim() || 'INR',
        message: searchParams.get('message')?.trim() || '',
        exp: expNum,
        issuedAt: Math.floor(Date.now() / 1000),
      }

      const sealedCookie = sealReplySession(session)
      const cleanUrl = new URL('/reply', request.url)
      cleanUrl.search = '' // Strip all parameters and tokens from address bar & history

      // HTTP 303 (See Other) informs browser to switch to clean GET without query string
      const response = NextResponse.redirect(cleanUrl, 303)
      const isProduction = process.env.NODE_ENV === 'production'

      response.cookies.set(REPLY_SESSION_COOKIE_NAME, sealedCookie, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
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
