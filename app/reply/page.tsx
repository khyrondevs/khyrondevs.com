import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { unsealReplySession, REPLY_SESSION_COOKIE_NAME } from '@/lib/crypto'
import { ReplyClient } from './reply-client'

export const metadata: Metadata = {
  title: 'Response Studio | KHYRON DEVS',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ReplyPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(REPLY_SESSION_COOKIE_NAME)?.value
  const session = unsealReplySession(sessionCookie)

  // Defense-in-depth: If accessed without an active sealed session, cloak the route
  if (!session) {
    notFound()
  }

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
          <ReplyClient session={session} />
        </Suspense>
      </div>
    </div>
  )
}
