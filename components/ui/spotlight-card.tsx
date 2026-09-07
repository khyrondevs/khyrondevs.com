'use client'

import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useMediaQuery } from '@/hooks/use-media-query'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = useReducedMotion()
  const isTouch = useMediaQuery('(hover: none)')

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const spotlightStyle: React.CSSProperties =
    isHovered && !reducedMotion && !isTouch
      ? {
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.07), transparent 70%)`,
        }
      : {}

  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-lg border border-border bg-surface overflow-hidden transition-colors duration-300',
        isHovered && !reducedMotion && !isTouch && 'border-border-strong',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={spotlightStyle}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
