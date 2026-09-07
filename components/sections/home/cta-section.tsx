'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'


export function CtaSection() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-base overflow-hidden border-t border-border">
      {/* Deep atmospheric glow from center */}
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
        }}
      />
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0 mix-blend-screen" />
      
      {/* Animated concentric rings */}
      {!reducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute w-[300px] h-[300px] rounded-full border border-accent/30" />
          <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 4, delay: 2, repeat: Infinity, ease: 'linear' }} className="absolute w-[300px] h-[300px] rounded-full border border-accent/30" />
        </div>
      )}

      {/* Architectural Corner Crosshairs (Bookending the Hero) */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-accent/40 pointer-events-none hidden md:block" />

      <div className="container-site relative z-10 w-full">
        <RevealOnScroll>
          <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center">
            
            <div className="flex items-center gap-3 mb-12">
              <span className="h-[1px] w-12 bg-accent" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
                System Finalization
              </span>
              <span className="h-[1px] w-12 bg-accent" />
            </div>

            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-light text-fg leading-[0.95] tracking-[-0.04em] mb-12 mix-blend-plus-lighter">
              <span className="block text-fg-muted/50 mb-4 text-3xl sm:text-5xl md:text-7xl">HAVE A HARD PROBLEM?</span>
              <span className="block text-accent mb-4">GOOD.</span>
              <span className="block">LET&apos;S BUILD IT.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 mt-12">
              <MagneticButton>
                <Link href="/contact" tabIndex={-1}>
                  <Button variant="primary" size="lg" className="h-16 px-12 text-[1rem] shadow-[0_0_50px_rgba(59,130,246,0.2)] bg-accent text-white hover:bg-accent-light transition-all duration-300">
                    Initialize Project
                  </Button>
                </Link>
              </MagneticButton>
              <Link
                href="/work"
                className="group flex items-center gap-3 text-sm font-medium text-fg-muted hover:text-fg transition-colors"
              >
                <span className="border-b border-transparent group-hover:border-fg transition-colors">Review production systems</span>
                <span className="font-mono text-accent opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">{'->'}</span>
              </Link>
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
