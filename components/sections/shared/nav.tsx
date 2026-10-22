'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/content/site-config'
import { NavMobile } from './nav-mobile'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          scrolled
            ? 'bg-base/90 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container-site">
          <div className="flex h-16 items-center justify-between">
            {/* Wordmark */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 font-mono text-sm tracking-[0.2em] uppercase text-fg hover:text-accent transition-colors focus-visible:outline-none focus-visible:text-accent"
              aria-label={`${siteConfig.name} — home`}
            >
              <div className="relative w-6 h-6 sm:w-6.5 sm:h-6.5 shrink-0 rounded-[6px] overflow-hidden border border-cyan-400/30 bg-[#07090e] shadow-[0_0_10px_rgba(34,211,238,0.2)] group-hover:border-cyan-400/60 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300">
                <Image
                  src="/android-chrome-192x192.png"
                  alt={`${siteConfig.name} logo`}
                  width={26}
                  height={26}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="flex items-center">{siteConfig.name}</span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm transition-colors focus-visible:outline-none focus-visible:text-accent',
                    pathname === link.href
                      ? 'text-accent'
                      : 'text-fg-muted hover:text-fg'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm text-fg hover:border-border-strong hover:bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Start a project
              </Link>

              <button
                className="md:hidden p-2 -mr-2 text-fg-muted hover:text-fg transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <NavMobile
        links={siteConfig.navLinks}
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      />
    </>
  )
}
