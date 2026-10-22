'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'motion/react'
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
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.nav
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-surface p-8 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between mb-12">
              <Dialog.Title className="text-fg font-mono text-sm tracking-widest uppercase">
                Navigation
              </Dialog.Title>
              <Dialog.Close asChild>
                <motion.button
                  whileTap={reducedMotion ? undefined : { scale: 0.90 }}
                  className="text-fg-muted hover:text-fg transition-colors p-2 -mr-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </motion.button>
              </Dialog.Close>
            </div>

            <ul className="flex flex-col gap-2 flex-1" role="list">
              {links.map((link) => {
                const isActive = pathname === link.href

                return (
                  <li key={link.href}>
                    <MotionLink
                      href={link.href}
                      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                      className={cn(
                        'flex items-center justify-between py-3 text-3xl font-light transition-colors focus-visible:outline-none focus-visible:text-accent',
                        isActive ? 'text-accent font-normal' : 'text-fg-muted hover:text-fg'
                      )}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                      )}
                    </MotionLink>
                  </li>
                )
              })}
            </ul>

            <div className="pt-8 border-t border-border">
              <MotionLink
                href="/contact"
                whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-white font-medium hover:bg-accent-light shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                </span>
                <span>Start a project</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </MotionLink>
            </div>
          </motion.nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
