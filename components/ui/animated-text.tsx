'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  once?: boolean
}

export function AnimatedText({
  text,
  className,
  as: Tag = 'p',
  delay = 0,
  once = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  // Cast ref to satisfy motion's stricter generic — HTMLElement covers all heading/paragraph types
  const isInView = useInView(ref as React.RefObject<Element>, { once, margin: '-5% 0px' })
  const words = text.split(' ')

  if (reducedMotion) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const StaticTag = Tag as any
    return (
      <StaticTag ref={ref} className={className}>
        {text}
      </StaticTag>
    )
  }

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  }

  const wordVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  }

  // motion[Tag] supports h1, h2, h3, p, span natively
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionTag = (motion as any)[Tag]

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={container}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em] last:mr-0"
          variants={wordVariant}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  )
}
