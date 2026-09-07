'use client'

import { createContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// We expose a ref object so consumers can imperatively access the Lenis instance
// without needing React state (which would cause cascading re-renders).
export const LenisContext = createContext<React.RefObject<Lenis | null>>({ current: null })

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      return
    }

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenisInstance

    let rafId: number
    function raf(time: number) {
      lenisInstance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
