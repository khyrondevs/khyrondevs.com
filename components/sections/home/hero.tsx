'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { AnimatedText } from '@/components/ui/animated-text'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useMousePosition } from '@/hooks/use-mouse-position'

function SystemCore() {
  // A vast, slow-moving architectural geometric core that sits behind the typography
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-20 md:opacity-30 mix-blend-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
        className="relative w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] max-w-[1200px] max-h-[1200px] flex items-center justify-center"
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-[1px] border-accent/20 border-dashed" />
        
        {/* Middle complex rings */}
        <div className="absolute w-[80%] h-[80%] rounded-full border-[1px] border-accent/30" />
        <div className="absolute w-[80%] h-[80%] rounded-full border-[1px] border-accent/40 scale-[0.98] rotate-45 border-dashed" />
        
        {/* Radiating lines (simulate 3D wireframe volume) */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-[100%] h-[1px] bg-accent/10"
            style={{ transform: `rotate(${i * 15}deg)` }}
          />
        ))}

        {/* Inner Core */}
        <div className="absolute w-[40%] h-[40%] rounded-full border-[1px] border-accent/50 shadow-[0_0_80px_rgba(59,130,246,0.1)] flex items-center justify-center">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="w-[80%] h-[80%] rounded-full border-[1px] border-accent/60 border-dotted"
          />
        </div>
      </motion.div>
    </div>
  )
}

export function HeroSection() {
  const reducedMotion = useReducedMotion()
  const mouse = useMousePosition()
  const containerRef = useRef<HTMLDivElement>(null)

  // Subtle interactive light field that follows the mouse
  const mouseBg = mouse 
    ? `radial-gradient(1000px circle at ${mouse.x}px ${mouse.y}px, rgba(59, 130, 246, 0.06), transparent 60%)`
    : `radial-gradient(1000px circle at 50% 50%, rgba(59, 130, 246, 0.03), transparent 60%)`

  return (
    <section 
      ref={containerRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-base bg-grid-pattern bg-noise pt-24 md:pt-32 border-b border-border"
    >
      <SystemCore />

      {/* Interactive Light Field */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000"
        animate={reducedMotion ? {} : { background: mouseBg }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
      />
      
      {/* Top Ambient Glow */}
      <div 
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 0%, transparent 100%)',
        }}
      />

      {/* Architectural Corner Crosshairs (Global wrapper level) */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-accent/40 pointer-events-none hidden md:block" />

      <div className="container-site w-full relative z-10 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          
          {/* Main Typography Column */}
          <div className="lg:col-span-9 flex flex-col items-start mix-blend-normal">
            {/* Metadata eyebrow */}
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="mb-12 flex items-center gap-4"
            >
              <span className="w-12 h-[1px] bg-accent" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-accent">
                System Engineering
              </span>
            </motion.div>

            {/* Monumental H1 */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-light leading-[0.95] tracking-[-0.04em] text-fg mb-12 relative z-10 drop-shadow-2xl">
              <AnimatedText text="COMPLEX" className="block" delay={0.2} />
              <AnimatedText text="PROBLEMS." className="block" delay={0.3} />
              <AnimatedText text="CLEAN" className="block text-accent/80" delay={0.4} />
              <AnimatedText text="SYSTEMS." className="block" delay={0.5} />
            </h1>
          </div>

          {/* Supporting Details Column */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end text-left lg:text-right pb-6">
            <motion.p
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="text-lg md:text-xl font-light text-fg-muted leading-relaxed mb-10 max-w-md lg:max-w-none backdrop-blur-sm"
            >
              We engineer full-stack web applications, AI integration pipelines, and workflow automation systems that run flawlessly in production.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.2, 0.65, 0.3, 0.9] }}
              className="flex flex-col sm:flex-row items-start lg:items-center gap-6 w-full lg:justify-end"
            >
              <Link href="/work" className="group flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg transition-colors">
                <span className="font-mono text-accent opacity-50 group-hover:opacity-100 transition-opacity">{'//'}</span>
                <span className="border-b border-transparent group-hover:border-fg transition-colors">View systems</span>
              </Link>
              <MagneticButton>
                <Link href="/contact" tabIndex={-1}>
                  <Button variant="primary" size="lg" className="h-14 px-8 text-[1rem] shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    Initiate
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Technical Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-0 left-8 md:left-12 flex flex-col items-start gap-4 pb-12"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-subtle rotate-90 origin-left translate-y-8">
          Initialize
        </span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-accent/50 via-border to-transparent ml-1 mt-4" />
      </motion.div>
    </section>
  )
}
