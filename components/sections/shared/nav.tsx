'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Menu, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/content/site-config'
import { NavMobile } from './nav-mobile'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const MotionLink = motion.create(Link)

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const [isCtaHovered, setIsCtaHovered] = useState(false)
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

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
            <MotionLink
              href="/"
              whileTap={reducedMotion ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
            </MotionLink>

            {/* Desktop nav with interactive sliding hover capsule */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-1"
              onMouseLeave={() => setHoveredHref(null)}
            >
              {siteConfig.navLinks.map((link) => {
                const isActive = pathname === link.href
                const isHovered = hoveredHref === link.href

                return (
                  <MotionLink
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredHref(link.href)}
                    whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={cn(
                      'relative px-3.5 py-1.5 text-sm transition-colors duration-200 select-none rounded-lg',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70',
                      isActive
                        ? 'text-cyan-400 font-medium'
                        : isHovered
                          ? 'text-white'
                          : 'text-fg-muted hover:text-fg'
                    )}
                  >
                    {/* Floating sliding hover capsule */}
                    {isHovered && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-lg bg-white/[0.07] border border-cyan-400/25 shadow-[0_0_12px_rgba(34,211,238,0.14)] -z-10"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 380, damping: 28 }
                        }
                      />
                    )}

                    {/* Active route indicator dot */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 380, damping: 28 }
                        }
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>
                  </MotionLink>
                )
              })}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <MagneticButton strength={0.3} className="hidden md:inline-flex">
                <MotionLink
                  href="/contact"
                  onMouseEnter={() => setIsCtaHovered(true)}
                  onMouseLeave={() => setIsCtaHovered(false)}
                  whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={cn(
                    'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300',
                    'border backdrop-blur-sm',
                    isCtaHovered
                      ? 'border-cyan-400/60 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'border-white/15 bg-white/[0.04] text-fg shadow-[0_0_12px_rgba(0,0,0,0.4)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400'
                  )}
                >
                  {/* Interactive light sweep across the button */}
                  <span
                    className={cn(
                      'pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-700 ease-out',
                      isCtaHovered ? 'translate-x-full' : '-translate-x-full'
                    )}
                  />

                  {/* Cyber status pulse indicator */}
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span
                      className={cn(
                        'absolute inline-flex h-full w-full rounded-full bg-cyan-400 transition-opacity duration-300',
                        isCtaHovered ? 'opacity-90 animate-ping' : 'opacity-40'
                      )}
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  </span>

                  <span className="tracking-wide">Start a project</span>

                  {/* Directional micro-arrow with hover translation */}
                  <motion.span
                    animate={
                      reducedMotion
                        ? undefined
                        : {
                            x: isCtaHovered ? 2 : 0,
                            y: isCtaHovered ? -2 : 0,
                          }
                    }
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center"
                  >
                    <ArrowUpRight
                      size={15}
                      className={cn(
                        'transition-colors duration-200',
                        isCtaHovered ? 'text-cyan-400' : 'text-fg-muted'
                      )}
                    />
                  </motion.span>
                </MotionLink>
              </MagneticButton>

              <motion.button
                whileTap={reducedMotion ? undefined : { scale: 0.90 }}
                className="md:hidden p-2 -mr-2 text-fg-muted hover:text-fg hover:bg-white/[0.06] transition-colors rounded-lg border border-transparent hover:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                <Menu size={20} />
              </motion.button>
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
