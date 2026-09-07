'use client'

import { useState, useEffect } from 'react'

export function useMousePosition(): { x: number; y: number } | null {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return
    if (navigator.maxTouchPoints > 0) return // Return null on touch devices

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updatePosition)
    return () => window.removeEventListener('mousemove', updatePosition)
  }, [])

  return position
}
