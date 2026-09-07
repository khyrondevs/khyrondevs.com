import type { Variants, Transition } from 'motion/react'

export const fadeUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } 
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const fadeUpSlow: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } 
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 0.5 } 
  },
}

export const slideInLeft: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.6 } 
  },
}

export const slideInRight: Variants = {
  hidden: { x: 30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.6 } 
  },
}

export const DEFAULT_TRANSITION: Transition = {
  ease: [0.4, 0, 0.2, 1],
  duration: 0.6,
}

export function getReducedVariants(): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  }
}
