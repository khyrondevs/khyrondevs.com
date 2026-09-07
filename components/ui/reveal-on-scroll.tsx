'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const isInView = useInView(ref, { once, margin: '-5% 0px' })

  const variants = {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: reducedMotion
      ? { opacity: 1, transition: { duration: 0.2, delay } }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.65,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
            delay,
          },
        },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants={variants as any}
    >
      {children}
    </motion.div>
  )
}
