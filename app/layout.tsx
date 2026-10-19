import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import './cyphr-case-study.css'
import './jobpilot-case-study.css'
import './eazyshop-case-study.css'
import './houseprice-case-study.css'
import './cinemora-case-study.css'
import './lms-case-study.css'
import { Nav } from '@/components/sections/shared/nav'
import { Footer } from '@/components/sections/shared/footer'
import { LenisProvider } from '@/components/providers/lenis-provider'
import { ReducedMotionProvider } from '@/components/providers/reduced-motion-provider'
import { siteConfig } from '@/lib/content/site-config'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-base text-fg">
        <ReducedMotionProvider>
          <LenisProvider>
            <Nav />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </LenisProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  )
}
