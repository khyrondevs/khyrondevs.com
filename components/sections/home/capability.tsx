'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue, useMotionTemplate } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const phases = [
  {
    id: '01 // IDEA',
    title: 'Raw intent.',
    desc: 'Translating business logic and abstract requirements into sound engineering primitives. Scattered signals begin to organize.',
  },
  {
    id: '02 // ARCHITECTURE',
    title: 'System design.',
    desc: 'Nodes organize into a rigorous infrastructure. Constraints are mapped, data topologies are defined, and the foundation is set.',
  },
  {
    id: '03 // IMPLEMENTATION',
    title: 'Full-stack execution.',
    desc: 'Components connect. Data flows. We engineer the layers for performance, correctness, and absolute typesafety.',
  },
  {
    id: '04 // SYSTEM',
    title: 'Runtime activation.',
    desc: 'The architecture activates simultaneously. Integrating retrieval-augmented generation and async workflows into a unified engine.',
  },
  {
    id: '05 // OUTCOME',
    title: 'Production state.',
    desc: 'Shipped to scale with deep observability, CI/CD, and edge deployment. Complexity resolved into clarity.',
  },
]

type Phase = typeof phases[0]

function PhaseText({ phase, index, total, scrollYProgress }: { phase: Phase, index: number, total: number, scrollYProgress: MotionValue<number> }) {
  const startFadeIn = Math.max(0, index * 0.2 - 0.05)
  const endFadeIn = Math.max(startFadeIn, index * 0.2 + 0.05)
  const startFadeOut = index === total - 1
    ? 0.95
    : Math.max(endFadeIn, (index + 1) * 0.2 - 0.05)
  const endFadeOut = index === total - 1
    ? 1
    : Math.min(1, Math.max(startFadeOut, (index + 1) * 0.2 + 0.05))

  const opacity = useTransform(
    scrollYProgress,
    [startFadeIn, endFadeIn, startFadeOut, endFadeOut],
    [0, 1, 1, 0]
  )
  const y = useTransform(
    scrollYProgress,
    [startFadeIn, endFadeIn, startFadeOut, endFadeOut],
    [20, 0, 0, -20]
  )

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-start"
      style={{ opacity, y }}
    >
      <span className="font-mono text-xs text-accent/70 tracking-widest uppercase mb-4 px-2 py-1 bg-accent/10 border border-accent/20">
        {phase.id}
      </span>
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-fg mb-4">{phase.title}</h3>
      <p className="text-fg-muted font-light leading-relaxed max-w-md text-sm md:text-base">
        {phase.desc}
      </p>
    </motion.div>
  )
}

export function CapabilitySection() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Global 3D rotation
  const globalRotateX = useTransform(scrollYProgress, [0, 0.7, 0.9, 1], [60, 60, 0, 0])
  const globalRotateZ = useTransform(scrollYProgress, [0, 0.7, 0.9, 1], [45, 45, 0, 0])
  const globalScale = useTransform(scrollYProgress, [0, 0.7, 0.9, 1], [1, 1, 1.2, 1.5])

  // Phase 1 -> 2: Architecture forms (Planes align, Z spacing normalizes)
  const p1Z = useTransform(scrollYProgress, [0, 0.2, 0.7, 0.9], [-600, -200, -200, 0])
  const p1RotX = useTransform(scrollYProgress, [0, 0.2], [45, 0])
  const p1RotY = useTransform(scrollYProgress, [0, 0.2], [-30, 0])

  const p2Z = useTransform(scrollYProgress, [0, 0.2, 0.7, 0.9], [0, 0, 0, 0])
  const p2RotX = useTransform(scrollYProgress, [0, 0.2], [-20, 0])
  const p2RotY = useTransform(scrollYProgress, [0, 0.2], [40, 0])

  const p3Z = useTransform(scrollYProgress, [0, 0.2, 0.7, 0.9], [600, 200, 200, 0])
  const p3RotX = useTransform(scrollYProgress, [0, 0.2], [60, 0])
  const p3RotY = useTransform(scrollYProgress, [0, 0.2], [20, 0])

  // Phase 2 -> 3: Implementation (Connections form)
  const linesOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])
  const linesScale = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])

  // Phase 3 -> 4: System (Glow/activation)
  const systemGlow = useTransform(scrollYProgress, [0.45, 0.55], [0, 1])
  const coreOpacity = useTransform(scrollYProgress, [0.45, 0.55], [0, 1])

  // Phase 4 -> 5: Outcome (Resolution/Beam)
  const outcomeBeam = useTransform(scrollYProgress, [0.75, 0.9], [0, 1])
  const planesOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0])

  // Motion templates for complex box-shadow strings
  // We use useMotionTemplate so we don't violate hook rules by calling useTransform inside the JSX
  const p1GlowV = useTransform(systemGlow, (v) => v * 50)
  const p1GlowO = useTransform(systemGlow, (v) => v * 0.2)
  const p1Shadow = useMotionTemplate`0 0 ${p1GlowV}px rgba(59,130,246,${p1GlowO}) inset`

  const p2GlowV1 = useTransform(systemGlow, (v) => v * 80)
  const p2GlowO1 = useTransform(systemGlow, (v) => v * 0.3)
  const p2GlowV2 = useTransform(systemGlow, (v) => v * 40)
  const p2GlowO2 = useTransform(systemGlow, (v) => v * 0.4)
  const p2Shadow = useMotionTemplate`0 0 ${p2GlowV1}px rgba(59,130,246,${p2GlowO1}) inset, 0 0 ${p2GlowV2}px rgba(59,130,246,${p2GlowO2})`

  const p3GlowV = useTransform(systemGlow, (v) => v * 60)
  const p3GlowO = useTransform(systemGlow, (v) => v * 0.2)
  const p3Shadow = useMotionTemplate`0 0 ${p3GlowV}px rgba(34,211,238,${p3GlowO}) inset`

  if (reducedMotion) {
    return (
      <section className="section-padding bg-base relative overflow-hidden">
        {/* Static reduced motion fallback */}
        <div className="container-site max-w-5xl mx-auto relative z-10">
          <div className="mb-24">
             <h2 className="text-4xl md:text-6xl font-light text-fg leading-tight">
               We turn complexity<br/><span className="text-accent">into clarity.</span>
             </h2>
          </div>
          <div className="flex flex-col gap-16 border-l border-border/50 pl-8 md:pl-16 relative">
            {phases.map((phase) => (
              <div key={phase.id} className="relative">
                <div className="absolute -left-8 md:-left-16 top-2 w-4 h-[1px] bg-accent" />
                <span className="font-mono text-[10px] tracking-widest text-accent uppercase block mb-2">{phase.id}</span>
                <h3 className="text-2xl text-fg font-light mb-3">{phase.title}</h3>
                <p className="text-fg-muted max-w-lg">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-base">
      <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row overflow-hidden">
        
        {/* Background Atmospheric Glow */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none"
          style={{ opacity: systemGlow }}
        />

        {/* Left Column: Typography */}
        <div className="w-full lg:w-1/2 h-1/3 lg:h-full relative z-20 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="mb-8 lg:mb-16">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-6 block">
              Engineering Capability
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-fg leading-[1.1] tracking-[-0.02em]">
              We turn complexity<br />
              <span className="text-accent">into structure.</span>
            </h2>
          </div>

          <div className="relative h-48 lg:h-64 w-full">
            {phases.map((phase, i) => (
              <PhaseText key={phase.id} phase={phase} index={i} total={phases.length} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>

        {/* Right Column: 3D Visual System */}
        <div className="w-full lg:w-1/2 h-2/3 lg:h-full relative flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
          <motion.div 
            className="relative w-[250px] h-[250px] md:w-[350px] md:h-[350px]"
            style={{ 
              transformStyle: 'preserve-3d',
              rotateX: globalRotateX, 
              rotateZ: globalRotateZ,
              scale: globalScale 
            }}
          >
            {/* Plane 1: Bottom Layer */}
            <motion.div 
              className="absolute inset-0 border border-accent/20 bg-surface/40 backdrop-blur-sm grid grid-cols-3 grid-rows-3 shadow-[0_0_50px_rgba(59,130,246,0)]"
              style={{ 
                transformStyle: 'preserve-3d',
                translateZ: p1Z, rotateX: p1RotX, rotateY: p1RotY,
                opacity: planesOpacity,
                boxShadow: p1Shadow
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={`p1-${i}`} className="border border-accent/10 flex items-center justify-center">
                  <motion.div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent/30 rounded-full" style={{ opacity: coreOpacity }} />
                </div>
              ))}
            </motion.div>

            {/* Plane 2: Middle Layer */}
            <motion.div 
              className="absolute inset-0 border border-accent/30 bg-accent/5 backdrop-blur-sm grid grid-cols-3 grid-rows-3"
              style={{ 
                transformStyle: 'preserve-3d',
                translateZ: p2Z, rotateX: p2RotX, rotateY: p2RotY,
                opacity: planesOpacity,
                boxShadow: p2Shadow
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={`p2-${i}`} className="border border-accent/20 relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Vertical Connection Lines down to Plane 1 */}
                  <motion.div 
                    className="absolute w-[1px] bg-gradient-to-b from-accent to-accent/10 origin-top"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      height: '200px', 
                      rotateX: 90, 
                      translateZ: '0px', 
                      opacity: linesOpacity,
                      scaleY: linesScale
                    }}
                  />
                  <motion.div className="w-3 h-3 md:w-4 md:h-4 border border-accent bg-base shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ opacity: coreOpacity }} />
                </div>
              ))}
            </motion.div>

            {/* Plane 3: Top Layer */}
            <motion.div 
              className="absolute inset-0 border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-sm grid grid-cols-3 grid-rows-3"
              style={{ 
                transformStyle: 'preserve-3d',
                translateZ: p3Z, rotateX: p3RotX, rotateY: p3RotY,
                opacity: planesOpacity,
                boxShadow: p3Shadow
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={`p3-${i}`} className="border border-cyan-400/10 flex items-center justify-center relative" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Vertical Connection Lines down to Plane 2 */}
                  <motion.div 
                    className="absolute w-[1px] bg-gradient-to-b from-cyan-400 to-accent/10 origin-top"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      height: '200px', 
                      rotateX: 90, 
                      translateZ: '0px',
                      opacity: linesOpacity,
                      scaleY: linesScale
                    }}
                  />
                  <motion.div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400/50" style={{ opacity: coreOpacity }} />
                </div>
              ))}
            </motion.div>

            {/* Final Outcome Beam */}
            <motion.div 
              className="absolute left-1/2 top-1/2 w-32 h-[1000px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent blur-xl pointer-events-none"
              style={{ 
                opacity: outcomeBeam,
                rotateX: 90 
              }}
            />
            <motion.div 
              className="absolute left-1/2 top-1/2 w-[2px] h-[1000px] -translate-x-1/2 -translate-y-1/2 bg-cyan-300 pointer-events-none"
              style={{ 
                opacity: outcomeBeam,
                rotateX: 90 
              }}
            />
            
            {/* The Resolved Artifact */}
            <motion.div
              className="absolute inset-0 border border-cyan-400 bg-cyan-950/90 shadow-[0_0_100px_rgba(34,211,238,0.4)] flex items-center justify-center"
              style={{ opacity: outcomeBeam }}
            >
              <div className="font-mono text-cyan-400 text-xs md:text-sm tracking-widest">SYSTEM.ONLINE</div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  )
}
