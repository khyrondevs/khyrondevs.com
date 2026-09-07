'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { processSteps } from '@/lib/content/process-steps'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Deterministic refs
  const textStepRefs = useRef<(HTMLDivElement | null)[]>([])
  const detailRefs = useRef<(HTMLLIElement | null)[][]>([])
  const illStepRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const reducedMotion = useReducedMotion()

  // Initialize the 2D array for detail refs
  if (detailRefs.current.length === 0) {
    detailRefs.current = processSteps.map(() => [])
  }

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !containerRef.current || typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      // 1. Initial State Setup
      textStepRefs.current.forEach((step, i) => {
        if (!step) return
        gsap.set(step, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 })
      })
      
      illStepRefs.current.forEach((ill, i) => {
        if (!ill) return
        gsap.set(ill, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0.95 })
      })

      detailRefs.current.forEach((details, i) => {
        details.forEach((detail) => {
          if (!detail) return
          gsap.set(detail, { autoAlpha: i === 0 ? 1 : 0, x: i === 0 ? 0 : -15 })
        })
      })

      // 2. Timeline construction
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${processSteps.length * 100}%`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
        }
      })

      // 3. Sequence
      for (let i = 0; i < processSteps.length; i++) {
        const step = textStepRefs.current[i]
        const ill = illStepRefs.current[i]
        
        // HOLD phase
        tl.to(step, { duration: 1 }) // Empty tween to hold duration
        
        // TRANSITION phase to next step
        if (i < processSteps.length - 1) {
          const nextStep = textStepRefs.current[i + 1]
          const nextIll = illStepRefs.current[i + 1]
          const nextDetails = detailRefs.current[i + 1].filter(Boolean)
          
          // Outgoing Text & Illustration
          tl.to(step, { autoAlpha: 0, y: -30, duration: 1 }, `transition-${i}`)
          tl.to(ill, { autoAlpha: 0, scale: 1.05, duration: 1 }, `transition-${i}`)
          
          // Incoming Text & Illustration
          tl.to(nextStep, { autoAlpha: 1, y: 0, duration: 1 }, `transition-${i}`)
          tl.to(nextIll, { autoAlpha: 1, scale: 1, duration: 1 }, `transition-${i}`)
          
          // Incoming Details Stagger
          if (nextDetails.length > 0) {
            tl.to(nextDetails, {
              autoAlpha: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.15
            }, `transition-${i}+=0.3`)
          }
        }
      }
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  // Reduced motion: static stack
  if (reducedMotion) {
    return (
      <section className="section-padding border-t border-border bg-base">
        <div className="container-site">
          <div className="mb-16">
            <span className="font-mono text-xs tracking-widest uppercase text-accent">Methodology</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-light text-fg">How we work.</h2>
          </div>
          <div className="flex flex-col gap-24">
            {processSteps.map((step) => (
              <div key={step.id} className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                <div>
                  <span className="font-mono text-xs text-accent tracking-[0.2em] uppercase block mb-4">
                    Phase 0{step.step} — {step.id}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-light text-fg mb-4">{step.title}</h3>
                  <p className="text-lg text-fg-muted leading-relaxed mb-8">{step.description}</p>
                  <ul className="flex flex-col gap-4">
                    {step.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm md:text-[1rem] text-fg-muted font-light">
                        <span className="font-mono text-accent mt-1 opacity-50 shrink-0">{'->'}</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-64 md:h-96 w-full bg-surface/30 border border-border/50">
                  <ProcessIllustration stepId={step.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  function ProcessIllustration({ stepId }: { stepId: string }) {
    switch (stepId.toLowerCase()) {
      case 'discover':
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Radar/Scanning Field */}
              <div className="absolute w-[80%] h-[80%] border border-accent/10 rounded-full" />
              <div className="absolute w-[60%] h-[60%] border border-accent/20 rounded-full" />
              <div className="absolute w-[40%] h-[40%] border border-accent/30 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
              
              {/* Scanning Beam */}
              <div className="absolute w-[40%] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-accent right-[10%] top-1/2 origin-left animate-[spin_4s_linear_infinite]" />
              
              {/* Focal Nodes */}
              <div className="absolute top-[30%] left-[30%] w-2 h-2 bg-accent/50 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
              <div className="absolute bottom-[40%] right-[30%] w-1.5 h-1.5 bg-accent/40 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
          </div>
        )
      case 'design':
        return (
          <div className="absolute inset-0 p-8 flex items-center justify-center">
            <div className="w-full h-full relative perspective-[1000px]">
              {/* Architecture Grid forming */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 opacity-60 rotate-x-[20deg] rotate-y-[-10deg] transform-style-3d">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="relative border border-accent/10 bg-accent/[0.02]">
                    <div className="absolute inset-0 border border-accent/30 scale-0 group-data-[active=true]:animate-[ping_2s_ease-out_forwards]" style={{ animationDelay: `${(i % 4) * 100}ms` }} />
                    {(i === 5 || i === 10 || i === 15) && (
                      <div className="absolute inset-0 bg-accent/10 border border-accent/40 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'build':
        return (
          <div className="absolute inset-0 p-8 flex flex-col justify-between overflow-hidden font-mono text-[10px] text-accent/60">
            {/* System Execution View */}
            <div className="w-full h-full border border-accent/20 bg-surface/80 backdrop-blur-md p-6 relative flex flex-col">
              <div className="flex justify-between items-center border-b border-accent/20 pb-4 mb-4">
                <span className="uppercase tracking-widest text-accent/80">KRYPTON.SYS // BUILD</span>
                <span className="animate-pulse bg-accent w-2 h-2" />
              </div>
              <div className="flex-1 space-y-2 opacity-80">
                <div className="animate-[fade-in_0.5s_ease-out_forwards]">❯ allocating architectural primitives</div>
                <div className="animate-[fade-in_0.5s_ease-out_0.2s_forwards] text-accent/40">  [success] memory mapped</div>
                <div className="animate-[fade-in_0.5s_ease-out_0.4s_forwards]">❯ compiling production assets</div>
                <div className="animate-[fade-in_0.5s_ease-out_0.6s_forwards] text-accent/40">  [success] tree shaken</div>
                <div className="animate-[fade-in_0.5s_ease-out_0.8s_forwards]">❯ establishing async connections</div>
                <div className="animate-[pulse_1s_ease-in-out_infinite] pt-4 text-accent">❯ execution loop active_</div>
              </div>
              <div className="mt-auto h-[1px] w-full bg-accent/20 relative">
                <div className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-[scale-x_2s_ease-out_infinite_alternate]" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        )
      case 'ship':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Deployment Signal / Artifact */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 border border-accent/30 rounded-full animate-[ping_3s_ease-out_infinite]" />
              <div className="absolute inset-4 border border-accent/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
              <div className="absolute inset-10 border border-accent/10 rounded-full" />
              
              <div className="relative z-10 w-16 h-16 bg-accent border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.6)] rotate-45 flex items-center justify-center">
                <div className="w-8 h-8 border border-white/40 bg-white/10" />
              </div>
            </div>
            {/* Vertical locking beams */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-accent/20" />
            <div className="absolute left-0 right-0 h-[1px] bg-accent/20" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section className="relative bg-base border-t border-border" ref={containerRef}>
      <div className="min-h-screen flex items-center py-24">
        <div className="container-site w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-stretch">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Persistent Header */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[1px] w-8 bg-accent" />
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                    Methodology
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-fg leading-[1.1] tracking-[-0.02em]">
                  How we work.
                </h2>
              </div>
              
              {/* Steps Crossfade Container */}
              <div className="relative grid grid-cols-1 grid-rows-1">
                {processSteps.map((step, i) => (
                  <div
                    key={step.id}
                    ref={(el) => {
                      textStepRefs.current[i] = el
                    }}
                    className="col-start-1 row-start-1 flex flex-col"
                    style={{ zIndex: processSteps.length - i }}
                  >
                    <span className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-4 block">
                      Phase 0{step.step} — {step.id}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-light text-fg leading-[1.1] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-fg-muted font-light leading-relaxed mb-10">
                      {step.description}
                    </p>
                    
                    <ul className="flex flex-col gap-4">
                      {step.details.map((detail, j) => (
                        <li 
                          key={j} 
                          ref={(el) => {
                            if (detailRefs.current[i]) {
                              detailRefs.current[i][j] = el
                            }
                          }}
                          className="flex items-start gap-4 text-sm md:text-[1rem] text-fg-muted font-light"
                        >
                          <span className="font-mono text-accent mt-1 opacity-50 shrink-0">
                            {'->'}
                          </span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column: Illustration Window */}
            <div className="lg:col-span-7 relative min-h-[400px] lg:min-h-[600px] w-full">
              <div className="absolute inset-0 bg-surface/30 border border-border/50 backdrop-blur-sm overflow-hidden flex items-center justify-center">
                {/* Crosshairs & Accents */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent/30" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-accent/30" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-accent/30" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent/30" />
                
                {processSteps.map((step, i) => (
                  <div
                    key={`ill-${step.id}`}
                    ref={(el) => {
                      illStepRefs.current[i] = el
                    }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center p-8 lg:p-16 pointer-events-none"
                    style={{ zIndex: processSteps.length - i }}
                  >
                    <ProcessIllustration stepId={step.id} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
