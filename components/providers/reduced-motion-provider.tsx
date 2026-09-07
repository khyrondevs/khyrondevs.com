'use client'

import { createContext, useContext } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export const ReducedMotionContext = createContext<boolean>(false)

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  )
}

export function useReducedMotionContext() {
  return useContext(ReducedMotionContext)
}
