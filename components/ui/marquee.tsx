'use client'

import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: number // pixels per second, default 40
  gap?: number // gap between items in px, default 48
  direction?: 'left' | 'right'
}

export function Marquee({
  children,
  className,
  speed = 40,
  gap = 48,
  direction = 'left',
}: MarqueeProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return (
      <div className={cn('flex items-center gap-12 overflow-hidden', className)}>
        {children}
      </div>
    )
  }

  // Duration in seconds: assume content width ~1000px / speed
  // We duplicate children so the loop is seamless
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className={cn('flex overflow-hidden', className)} aria-hidden>
      <div
        className={cn('flex shrink-0 items-center', animClass)}
        style={{ gap: `${gap}px`, animationDuration: `${2000 / speed}s` }}
      >
        {children}
      </div>
      <div
        className={cn('flex shrink-0 items-center', animClass)}
        aria-hidden
        style={{ gap: `${gap}px`, animationDuration: `${2000 / speed}s` }}
      >
        {children}
      </div>
    </div>
  )
}
