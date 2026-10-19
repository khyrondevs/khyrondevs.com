import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReplyClient } from './reply-client'

export const metadata: Metadata = {
  title: 'Quick Reply Studio // Khyron Devs',
  description: 'Dispatch branded developer replies to prospective client inquiries.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ReplyPage() {
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
          <ReplyClient />
        </Suspense>
      </div>
    </div>
  )
}
