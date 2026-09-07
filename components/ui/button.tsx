'use client'

import { motion } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white rounded-lg hover:bg-accent-light',
        ghost: 'text-fg-muted hover:text-fg hover:bg-elevated rounded-lg',
        outline: 'border border-border text-fg rounded-lg hover:border-border-strong hover:bg-elevated',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-[1rem]',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.button
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...(props as React.ComponentProps<typeof motion.button>)}
    />
  )
}
