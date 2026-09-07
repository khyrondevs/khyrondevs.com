'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'motion/react'

// ══════════════════════════════════════════════════════════════════════════════
// THE CONCEPT: THE DECONSTRUCTION (THE ORIGIN)
//
// The user has spent the entire page looking at massive, complex systems.
// Process showed how a signal builds into a system.
// Now, About shows the reverse.
//
// We start with the absolute peak of visual complexity — a glowing, rotating,
// incredibly dense architecture.
// As the user scrolls, the camera doesn't zoom. The system DECONSTRUCTS.
// The orbits un-draw. The structural rays retract. The data particles vanish.
// The core collapses into a single dot.
// Then the dot vanishes.
//
// The machine stops speaking.
// What is left behind is the human choice that started it all.
// ══════════════════════════════════════════════════════════════════════════════

const CX = 500
const CY = 500

// ── DETERMINISTIC GEOMETRY ────────────────────────────────────────────────────
// Generated outside the component to avoid SSR hydration mismatches

const round = (val: number, precision = 6) => Number(val.toFixed(precision))

const ORBITS = [460, 400, 340, 280, 220, 160]

const RAYS = Array.from({ length: 48 }).map((_, i) => {
  const angle = (i * 7.5 * Math.PI) / 180
  const isMajor = i % 4 === 0
  const r1 = isMajor ? 520 : 440
  const r2 = 60
  return {
    x1: round(CX + r1 * Math.cos(angle)),
    y1: round(CY + r1 * Math.sin(angle)),
    x2: round(CX + r2 * Math.cos(angle)),
    y2: round(CY + r2 * Math.sin(angle)),
    op: isMajor ? 0.4 : 0.15,
    width: isMajor ? 1 : 0.5,
  }
})

const PARTICLES = Array.from({ length: 180 }).map((_, i) => {
  const r = 80 + ((i * 47) % 400)
  const angle = ((i * 17) % 360) * (Math.PI / 180)
  return {
    cx: round(CX + r * Math.cos(angle)),
    cy: round(CY + r * Math.sin(angle)),
    r: round(((i * 11) % 3) * 0.5 + 0.5),
    op: round(((i * 13) % 50) / 100 + 0.1, 4), // 0.1 to 0.6
  }
})

// ── DECONSTRUCTING SYSTEM COMPONENT ───────────────────────────────────────────

function DeconstructingSystem({ p }: { p: MotionValue<number> }) {
  // Map scroll progress (0 to 0.6) to the systematic breakdown of the machine

  // 1. Orbits un-draw circumferentially
  const orbitOffset = useTransform(p, [0.05, 0.25], [0, 1])
  
  // 2. Rays retract toward the center
  const rayOffset = useTransform(p, [0.15, 0.35], [0, 1])
  
  // 3. Particles are sucked into the core
  const particlesScale = useTransform(p, [0.25, 0.45], [1, 0])
  const particlesOp = useTransform(p, [0.25, 0.40], [1, 0])
  
  // 4. The Core itself collapses
  const coreScale = useTransform(p, [0.40, 0.55], [1, 0])
  const coreOp = useTransform(p, [0.50, 0.60], [1, 0])

  // Slow ambient rotation to make the machine feel "alive" before it dies
  const rotateSlow = useTransform(p, [0, 1], [0, 90])
  const rotateFastRev = useTransform(p, [0, 1], [0, -120])

  return (
    <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      
      {/* ORBITS */}
      <motion.g style={{ rotate: rotateSlow, transformOrigin: '500px 500px' }}>
        {ORBITS.map((r, i) => (
          <motion.circle
            key={`orbit-${i}`}
            cx={CX} cy={CY} r={r}
            stroke="rgba(59,130,246,0.25)"
            strokeWidth={i % 2 === 0 ? 1 : 0.5}
            fill="none"
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: orbitOffset }}
          />
        ))}
      </motion.g>

      {/* RAYS */}
      <motion.g style={{ rotate: rotateFastRev, transformOrigin: '500px 500px' }}>
        {RAYS.map((ray, i) => (
          <motion.line
            key={`ray-${i}`}
            x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2}
            stroke={`rgba(34,211,238,${ray.op})`}
            strokeWidth={ray.width}
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: rayOffset }}
          />
        ))}
      </motion.g>

      {/* PARTICLES */}
      <motion.g style={{ scale: particlesScale, opacity: particlesOp, transformOrigin: '500px 500px' }}>
        {PARTICLES.map((pt, i) => (
          <circle key={`pt-${i}`} cx={pt.cx} cy={pt.cy} r={pt.r} fill={`rgba(255,255,255,${pt.op})`} />
        ))}
      </motion.g>

      {/* CORE */}
      <motion.g style={{ scale: coreScale, opacity: coreOp, transformOrigin: '500px 500px' }}>
        <circle cx={CX} cy={CY} r={40} stroke="rgba(34,211,238,0.4)" strokeWidth={1} fill="none" />
        <circle cx={CX} cy={CY} r={20} stroke="rgba(34,211,238,0.7)" strokeWidth={2} fill="none" strokeDasharray="4 4" />
        <circle cx={CX} cy={CY} r={5} fill="rgba(255,255,255,1)" style={{ filter: 'drop-shadow(0 0 10px rgba(34,211,238,1))' }} />
      </motion.g>

    </svg>
  )
}

// ── CINEMATIC SEQUENCE ────────────────────────────────────────────────────────

function AboutCinematic() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Atmospheric glow that dies with the system
  const glowOp = useTransform(p, [0.0, 0.4], [1, 0])

  // Text 1: Curiosity / Context
  // Appears just after the system vanishes
  const t1Op = useTransform(p, [0.60, 0.65, 0.75, 0.80], [0, 1, 1, 0])
  const t1Y = useTransform(p, [0.60, 0.80], [10, -10])

  // Text 2: The Human Reveal
  const t2Op = useTransform(p, [0.78, 0.85], [0, 1])
  const t2Y = useTransform(p, [0.78, 0.85], [10, 0])

  return (
    <div ref={ref} className="relative h-[250vh] bg-base">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        <motion.div
          style={{ opacity: glowOp }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08)_0%,transparent_50%)] pointer-events-none"
        />

        {/* The Machine */}
        <div className="absolute inset-0 pointer-events-none">
          <DeconstructingSystem p={p} />
        </div>

        {/* The Human Sequence */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-20 px-8">
          
          <motion.div style={{ opacity: t1Op, y: t1Y }} className="absolute">
            <p className="font-mono text-xs text-fg-muted tracking-[0.2em] uppercase text-center">
              The machine makes no choices.
            </p>
          </motion.div>

          <motion.div style={{ opacity: t2Op, y: t2Y }} className="absolute">
            <h3 className="text-[clamp(1.5rem,4vw,3rem)] font-light text-fg tracking-tighter uppercase text-center leading-[1.1]">
              Before it is a system,<br/>
              <span className="text-cyan-400">it is a human decision.</span>
            </h3>
          </motion.div>

        </div>

      </div>
    </div>
  )
}

// ── STATIC FALLBACK ───────────────────────────────────────────────────────────

function AboutStatic() {
  return (
    <div className="bg-base border-t border-border/30 py-32 px-8 md:px-16 text-center overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-16 relative">
        
        {/* Static geometric core hint */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)]" />
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
            <circle cx="50" cy="50" r="40" stroke="rgba(34,211,238,0.3)" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="rgba(34,211,238,0.6)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="4" fill="rgba(255,255,255,1)" />
          </svg>
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          <p className="font-mono text-[10px] text-fg-muted tracking-[0.3em] uppercase">
            The machine makes no choices.
          </p>
          <h3 className="text-3xl md:text-5xl font-light text-fg tracking-tighter uppercase leading-tight">
            Before it is a system,<br/>
            <span className="text-cyan-400">it is a human decision.</span>
          </h3>
        </div>
        
      </div>
    </div>
  )
}

// ── EXPORT ────────────────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <>
      <div className="hidden md:block md:motion-reduce:hidden">
        <AboutCinematic />
      </div>
      <div className="block md:hidden md:motion-reduce:block">
        <AboutStatic />
      </div>
    </>
  )
}
