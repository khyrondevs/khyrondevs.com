'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'


export function CtaSection() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-base overflow-hidden border-t border-border">
      {/* Deep atmospheric glow from bottom */}
      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] z-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 100%)',
        }}
      />
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0 mix-blend-overlay" />

      {/* Architectural Corner Crosshairs (Bookending the Hero) */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-accent/40 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-accent/40 pointer-events-none hidden md:block" />

      <div className="container-site relative z-10 w-full">
        <RevealOnScroll>
          <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center">
            
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                System Initiation
              </span>
              <span className="h-[1px] w-8 bg-accent" />
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-8xl font-light text-fg leading-[1.05] tracking-[-0.03em] mb-10">
              Let&apos;s solve the <br className="hidden md:block" />
              actual problem.
            </h2>
            
            <p className="text-xl md:text-2xl font-light text-fg-muted mb-14 max-w-2xl mx-auto leading-relaxed">
              Tell us what you are trying to accomplish. We will design the technical architecture to deliver it.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <MagneticButton>
                <Link href="/contact" tabIndex={-1}>
                  <Button variant="primary" size="lg" className="h-16 px-10 text-lg shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    Initiate a project
                  </Button>
                </Link>
              </MagneticButton>
              <Link
                href="/process"
                className="group flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg transition-colors"
              >
                <span className="border-b border-transparent group-hover:border-fg transition-colors">Review technical process</span>
                <span className="font-mono text-accent opacity-50 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
