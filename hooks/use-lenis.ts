'use client'

import { useContext } from 'react'
import { LenisContext } from '@/components/providers/lenis-provider'
import type Lenis from 'lenis'

/**
 * Returns a React ref containing the active Lenis instance (or null).
 * Access the instance imperatively in event handlers or effects via `.current`.
 *
 * @example
 * const lenisRef = useLenis()
 * function scrollToTop() { lenisRef.current?.scrollTo(0) }
 */
export function useLenis(): React.RefObject<Lenis | null> {
  return useContext(LenisContext)
}
