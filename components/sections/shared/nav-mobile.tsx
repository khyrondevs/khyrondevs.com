'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { X, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/lib/content/site-config'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const MotionLink = motion.create(Link)

interface NavMobileProps {
  links: NavLink[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NavMobile({ links, open, onOpenChange }: NavMobileProps) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  // Close on route change
  useEffect(() => {
    onOpenChange(false)
  }, [pathname, onOpenChange])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.nav
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[#07090e]/98 backdrop-blur-2xl border-l border-cyan-500/20 p-8 shadow-[-25px_0_70px_rgba(0,0,0,0.95)] overflow-hidden"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                }
                aria-label="Mobile navigation"
              >
                {/* Cybernetic laser line tracing down the left border */}
                <motion.div
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.05 }
                  }
                  style={{
                    transformOrigin: 'top',
                    boxShadow: '0 0 12px rgba(34,211,238,0.7)',
                  }}
                />

                {/* Ambient glowing atmosphere */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/15 blur-[90px] -z-10"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                  className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-600/15 blur-[90px] -z-10"
                />

                {/* Header */}
                <motion.div
                  initial={reducedMotion ? undefined : { opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    </span>
                    <Dialog.Title className="text-fg font-mono text-xs tracking-[0.25em] uppercase text-fg-muted">
                      Navigation // Menu
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <motion.button
                      whileHover={reducedMotion ? undefined : { rotate: 90 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.85, rotate: 180 }}
                      className="text-fg-muted hover:text-white p-2 -mr-2 rounded-lg hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      aria-label="Close navigation"
                    >
                      <X size={20} />
                    </motion.button>
                  </Dialog.Close>
                </motion.div>

                {/* Staggered Nav Links with Masked Slide-Up Horizon */}
                <ul className="flex flex-col gap-2.5 flex-1 justify-center" role="list">
                  {links.map((link, idx) => {
                    const isActive = pathname === link.href
                    const indexNumber = String(idx + 1).padStart(2, '0')

                    return (
                      <li key={link.href} className="overflow-hidden">
                        <motion.div
                          initial={
                            reducedMotion
                              ? undefined
                              : { y: '120%', opacity: 0, skewY: 1.5 }
                          }
                          animate={{ y: '0%', opacity: 1, skewY: 0 }}
                          exit={
                            reducedMotion
                              ? undefined
                              : { y: '80%', opacity: 0 }
                          }
                          transition={{
                            duration: 0.5,
                            delay: reducedMotion ? 0 : 0.18 + idx * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <MotionLink
                            href={link.href}
                            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                            className={cn(
                              'group relative flex items-center justify-between py-3 px-3.5 rounded-xl transition-all duration-300 select-none',
                              'hover:bg-white/[0.05] active:bg-white/[0.08]',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                              isActive
                                ? 'bg-cyan-500/[0.08] border border-cyan-400/30 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                                : 'border border-transparent text-fg-muted hover:text-white'
                            )}
                          >
                            {/* Left indicator bar on active/hover */}
                            <span
                              className={cn(
                                'absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-cyan-400 transition-all duration-300',
                                isActive
                                  ? 'h-6 shadow-[0_0_8px_#22d3ee]'
                                  : 'h-0 group-hover:h-5 shadow-[0_0_6px_#22d3ee]'
                              )}
                            />

                            <div className="flex items-baseline gap-4 pl-1">
                              <span
                                className={cn(
                                  'font-mono text-xs tracking-wider transition-colors duration-200',
                                  isActive
                                    ? 'text-cyan-400 font-bold'
                                    : 'text-fg-subtle group-hover:text-cyan-400'
                                )}
                              >
                                {indexNumber}
                              </span>
                              <span
                                className={cn(
                                  'text-3xl font-light tracking-tight transition-transform duration-300 group-hover:translate-x-1.5',
                                  isActive ? 'text-white font-normal' : ''
                                )}
                              >
                                {link.label}
                              </span>
                            </div>

                            {isActive ? (
                              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/25 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                                Active
                              </span>
                            ) : (
                              <ArrowUpRight
                                size={18}
                                className="opacity-0 -translate-x-2 text-cyan-400 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                              />
                            )}
                          </MotionLink>
                        </motion.div>
                      </li>
                    )
                  })}
                </ul>

                {/* Footer Section */}
                <motion.div
                  initial={reducedMotion ? undefined : { opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: 15 }}
                  transition={{
                    duration: 0.5,
                    delay: reducedMotion ? 0 : 0.18 + links.length * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pt-6 border-t border-white/[0.08]"
                >
                  <MotionLink
                    href="/contact"
                    whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-accent px-6 py-4 text-white font-medium hover:bg-accent-light shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {/* Interactive light sweep */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                    </span>
                    <span className="tracking-wide text-base">Start a project</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </MotionLink>

                  {/* Technical studio status badge */}
                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-fg-subtle uppercase px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      SYSTEM: READY
                    </span>
                    <span className="text-cyan-400/80">KHYRON DEVS</span>
                  </div>
                </motion.div>
              </motion.nav>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
