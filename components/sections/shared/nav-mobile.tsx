'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'motion/react'
import Link from 'next/link'
import { X } from 'lucide-react'
import type { NavLink } from '@/lib/content/site-config'

interface NavMobileProps {
  links: NavLink[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NavMobile({ links, open, onOpenChange }: NavMobileProps) {
  const pathname = usePathname()

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
                <button
                  className="text-fg-muted hover:text-fg transition-colors p-2 -mr-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            <ul className="flex flex-col gap-2 flex-1" role="list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 text-3xl font-light text-fg-muted hover:text-fg transition-colors focus-visible:outline-none focus-visible:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-8 border-t border-border">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 text-white font-medium hover:bg-accent-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Start a project
              </Link>
            </div>
          </motion.nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
