import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
  sealReplySession,
  unsealReplySession,
  verifyReplyToken,
  REPLY_SESSION_COOKIE_NAME,
  type ReplySession,
} from '@/lib/crypto'
import { ReplyClient } from './reply-client'

export const metadata: Metadata = {
  title: 'Response Studio | KHYRON DEVS',
  robots: {
    index: false,
    follow: false,
  },
}

interface ReplyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ReplyPage({ searchParams }: ReplyPageProps) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(REPLY_SESSION_COOKIE_NAME)?.value
  let session: ReplySession | null = unsealReplySession(sessionCookie)

  // Defense-in-depth: If cookie was suppressed by browser cross-site navigation policies,
  // verify HMAC token directly from searchParams
  if (!session) {
    const sp = await searchParams
    const email = typeof sp.email === 'string' ? sp.email : (typeof sp['amp;email'] === 'string' ? sp['amp;email'] : undefined)
    const name = typeof sp.name === 'string' ? sp.name : (typeof sp['amp;name'] === 'string' ? sp['amp;name'] : undefined)
    const exp = typeof sp.exp === 'string' ? sp.exp : (typeof sp['amp;exp'] === 'string' ? sp['amp;exp'] : undefined)
    const token = typeof sp.token === 'string' ? sp.token : (typeof sp['amp;token'] === 'string' ? sp['amp;token'] : undefined)
    const phone = typeof sp.phone === 'string' ? sp.phone : (typeof sp['amp;phone'] === 'string' ? sp['amp;phone'] : undefined)
    const company = typeof sp.company === 'string' ? sp.company : (typeof sp['amp;company'] === 'string' ? sp['amp;company'] : undefined)
    const budget = typeof sp.budget === 'string' ? sp.budget : (typeof sp['amp;budget'] === 'string' ? sp['amp;budget'] : undefined)
    const currency = typeof sp.currency === 'string' ? sp.currency : (typeof sp['amp;currency'] === 'string' ? sp['amp;currency'] : undefined)
    const message = typeof sp.message === 'string' ? sp.message : (typeof sp['amp;message'] === 'string' ? sp['amp;message'] : undefined)

    if (verifyReplyToken({ clientEmail: email, clientName: name, exp, token })) {
      const expNum = Number(exp)
      session = {
        clientName: (name || 'Valued Client').trim(),
        clientEmail: email!.trim(),
        clientPhone: phone?.trim(),
        clientCompany: company?.trim(),
        budget: budget?.trim(),
        currency: currency?.trim() || 'INR',
        message: message?.trim() || '',
        exp: expNum,
        issuedAt: expNum - 14 * 24 * 60 * 60,
      }
    }
  }

  // Cloak route if neither valid session cookie nor verified HMAC token is present
  if (!session) {
    notFound()
  }

  const sessionToken = sealReplySession(session)

  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="container-site">
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto py-24 text-center">
              <div className="font-mono text-sm text-accent animate-pulse">
                INITIALIZING RESPONSE STUDIO...
              </div>
            </div>
          }
        >
          <ReplyClient session={session} sessionToken={sessionToken} />
        </Suspense>
      </div>
    </div>
  )
}
