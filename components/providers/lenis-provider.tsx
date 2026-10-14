'use client'

import { createContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { registerGsap, gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export const LenisContext = createContext<React.RefObject<Lenis | null>>({ current: null })

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reducedMotion = useReducedMotion()
  const pathname = usePathname()

  useEffect(() => {
    registerGsap()

    if (reducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      return
    }

    const lenisInstance = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    })

    lenisRef.current = lenisInstance

    // 1. Sync Lenis scroll with ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update)

    // 2. Drive Lenis through GSAP ticker for frame-synchronized animations
    const tick = (time: number) => {
      lenisInstance.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // 3. Recalculate Lenis dimensions whenever ScrollTrigger recalculates pins & layout
    const onScrollTriggerRefresh = () => {
      lenisInstance.resize()
    }
    ScrollTrigger.addEventListener('refresh', onScrollTriggerRefresh)

    // 4. Observe main content resizing (dynamic DOM additions, images loading, etc.)
    let refreshTimer: ReturnType<typeof setTimeout>
    const handleDomResize = () => {
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => {
        lenisInstance.resize()
        ScrollTrigger.refresh()
      }, 80)
    }

    const resizeObserver = new ResizeObserver(handleDomResize)
    const targetEl = document.getElementById('main-content') || document.body
    if (targetEl) {
      resizeObserver.observe(targetEl)
    }

    window.addEventListener('load', handleDomResize)
    document.fonts?.ready.then(handleDomResize).catch(() => {})

    return () => {
      clearTimeout(refreshTimer)
      resizeObserver.disconnect()
      window.removeEventListener('load', handleDomResize)
      ScrollTrigger.removeEventListener('refresh', onScrollTriggerRefresh)
      gsap.ticker.remove(tick)
      lenisInstance.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  // Recalculate dimensions and reset scroll on Next.js client-side navigation
  useEffect(() => {
    if (!lenisRef.current) return

    lenisRef.current.scrollTo(0, { immediate: true })

    const timer1 = setTimeout(() => {
      lenisRef.current?.resize()
      ScrollTrigger.refresh()
    }, 100)

    const timer2 = setTimeout(() => {
      lenisRef.current?.resize()
      ScrollTrigger.refresh()
    }, 400)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [pathname])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
