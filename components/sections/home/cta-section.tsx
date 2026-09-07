'use client'

import Link from 'next/link'
import { siteConfig } from '@/lib/content/site-config'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

// ══════════════════════════════════════════════════════════════════════════════
// THE CONCEPT: THE BLANK FIELD
//
// The entire website has been building toward ONE simple thing: a decision.
// The previous section (About) stripped the complexity of the machine away,
// leaving only the human choice: "Before it is a system, it is a human decision."
//
// Now, the CTA hands that decision to the visitor.
// There is no marketing copy. No bouncing buttons. No particles.
// The system is ready. The cursor is waiting.
// 
// WHAT SHOULD WE BUILD?
// ══════════════════════════════════════════════════════════════════════════════

export function CtaSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-base overflow-hidden">
      
      {/* Subtle connection to the rest of the architecture above */}
      <div className="absolute top-0 left-1/2 w-[1px] h-32 bg-gradient-to-b from-fg-subtle/10 to-transparent -translate-x-1/2 pointer-events-none" />

      <div className="container-site relative z-10 w-full pt-16 pb-32">
        <RevealOnScroll>
          <div className="flex flex-col items-center text-center w-full max-w-4xl mx-auto px-4 md:px-8">
            
            {/* The Final Question */}
            <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-light text-fg leading-[0.85] tracking-tighter uppercase mb-10">
              What should<br/>
              <span className="text-cyan-400">we build?</span>
            </h2>

            <p className="text-xl md:text-2xl text-fg-muted font-light mb-24 max-w-lg">
              The system is ready. Bring us the problem.
            </p>

            {/* The Final Action (The Input Metaphor) */}
            <Link 
              href={siteConfig.primaryCta.href} 
              className="group relative flex flex-col w-full max-w-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-8 focus-visible:ring-offset-base"
              aria-label={siteConfig.primaryCta.label}
            >
              
              {/* Status Header */}
              <div className="flex justify-between items-end mb-4 px-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-fg-subtle uppercase transition-colors duration-500 group-hover:text-cyan-400/80">
                  [ Input Required ]
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100 uppercase">
                  System Active
                </span>
              </div>

              {/* Input Field Area */}
              <div className="relative flex justify-between items-end pb-4 px-2 border-b border-fg-subtle/30 group-hover:border-transparent transition-colors duration-500">
                
                <span className="text-2xl md:text-4xl font-light text-fg-muted group-hover:text-fg transition-colors duration-500 tracking-tight">
                  {siteConfig.primaryCta.label}
                </span>
                
                {/* The Blinking Terminal Cursor */}
                <div className="flex items-center">
                  <span className="inline-block w-4 h-6 md:h-8 bg-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                </div>
              </div>
              
              {/* Expanding Underline (The Path Forward) */}
              <div className="absolute bottom-0 left-1/2 right-1/2 h-[1px] bg-cyan-400 group-hover:left-0 group-hover:right-0 transition-all duration-700 ease-out" />
            
            </Link>

          </div>
        </RevealOnScroll>
      </div>

    </section>
  )
}
