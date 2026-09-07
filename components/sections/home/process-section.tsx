'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'motion/react'

// ══════════════════════════════════════════════════════════════════════════════
// THE CONCEPT: ONE SIGNAL THAT BECOMES A SYSTEM.
//
// A single horizontal line is the protagonist. It starts whole, fragments into
// noise (the unknown problem), gets pulled back into focus (discover), then
// multiplies into precise parallel structure (architect), pulses with data
// (build), gets struck by a rogue signal that causes turbulence (validate),
// then all lines except one fade away — the center line alone, luminous,
// certain — and it drops out the bottom of the viewport (ship).
//
// The same element appears in every phase. The visitor subconsciously
// recognizes it. By the end, they've watched something survive its own
// transformation.
// ══════════════════════════════════════════════════════════════════════════════

const N     = 18       // number of lines in the system
const VW    = 1000     // SVG coordinate width
const VH    = 900      // SVG coordinate height
const GT    = 195      // grid top Y
const GB    = 705      // grid bottom Y
const GS    = (GB - GT) / (N - 1)
const MID   = Math.floor(N / 2)   // 9 — the protagonist line
const ROGUE = MID - 2             // 7 — the line that gets hit during validate

// Deterministic scatter positions — no Math.random()
const CHAOS: number[] = Array.from({ length: N }, (_, i) => ((i * 137 + 71) % (VH - 40)) + 20)
const GRID:  number[] = Array.from({ length: N }, (_, i) => GT + i * GS)

// ── SCROLL TIMING ─────────────────────────────────────────────────────────────
//
//  0.00 – 0.03  lines materialise from nothing (chaos positions)
//  0.03 – 0.18  DISCOVER: scattered lines converge to a precise grid
//  0.18 – 0.35  ARCHITECT: grid breathes — guide rails appear, structure sets
//  0.35 – 0.55  BUILD: a wave of light pulses left→right through every line
//  0.55 – 0.75  VALIDATE: a rogue signal strikes, turbulence, then recovery
//  0.75 – 0.93  SHIP: all lines except MID collapse to center and vanish
//  0.93 – 1.00  EXIT: center line alone, glowing, drops out the bottom
//
const D2 = 0.03; const D3 = 0.18   // chaos → grid
const B0 = 0.35; const B1 = 0.55   // build pulses
const V0 = 0.55; const V1 = 0.75   // validate
const S0 = 0.75; const S1 = 0.93   // ship

// ══════════════════════════════════════════════════════════════════════════════
// LINE ACTOR  — one line, its complete life story in one useTransform per axis
// ══════════════════════════════════════════════════════════════════════════════

function LineActor({ i, p }: { i: number; p: MotionValue<number> }) {
  const isMid = i === MID

  // Turbulence amplitude: lines nearest the rogue hit feel the most
  const amp = Math.max(0, 26 - Math.abs(i - ROGUE) * 3.0)

  // ── COMPLETE Y JOURNEY (single useTransform — one element, one story) ──────
  // Phase sequence: chaos → grid (architect/build hold) → turbulence → collapse
  // V0+0.185 = 0.735, just before S0=0.75 — turbulence settles at ship start
  const y = useTransform(p,
    [D2, D3,     V0, V0+0.04, V0+0.09, V0+0.14, V0+0.185, S0,      S0+0.13],
    [CHAOS[i], GRID[i], GRID[i], GRID[i]+amp, GRID[i]-amp*0.55, GRID[i]+amp*0.22, GRID[i]-amp*0.08, GRID[i], GRID[MID]]
  )

  // ── OPACITY ───────────────────────────────────────────────────────────────
  const opacity = useTransform(p,
    isMid ? [0, D2 + 0.03]               : [0, D2 + 0.03, S0, S0 + 0.11],
    isMid ? [0, 1]                       : [0, 1,          1,  0]
  )

  // ── STROKE COLOR — evolves through all five phases ────────────────────────
  // Keyframe sequence must be strictly monotonically increasing.
  // V0+0.185 = 0.735 < S0 = 0.75 ✓
  const stroke = useTransform(p, [
    D2,   D3,
    B0,   B0+0.03, B1,
    V0,   V0+0.04, V0+0.185,
    S0,   S0+0.13,
  ], [
    'rgba(255,255,255,0.04)',                                          // chaos: almost invisible
    'rgba(255,255,255,0.16)',                                          // grid set: soft white
    'rgba(255,255,255,0.16)',
    isMid ? 'rgba(59,130,246,0.95)' : 'rgba(59,130,246,0.42)',        // build activates: blue
    'rgba(59,130,246,0.25)',                                           // build tail
    'rgba(59,130,246,0.25)',
    i === ROGUE ? 'rgba(239,68,68,0.95)' : 'rgba(34,211,238,0.52)',   // validate: rogue turns red
    i === ROGUE ? 'rgba(34,211,238,0.52)' : 'rgba(34,211,238,0.38)',  // recovery
    'rgba(255,255,255,0.14)',                                          // ship calm
    isMid ? 'rgba(34,211,238,1.0)' : 'rgba(255,255,255,0.14)',        // center line becomes luminous
  ])

  // ── STROKE WIDTH — center line grows during ship phase ───────────────────
  const sw = useTransform(p,
    isMid ? [S0+0.11, S0+0.22] : [0, 1],
    isMid ? [1, 2.5]           : [1, 1]
  )

  // ── BUILD PULSE — each line fires in sequence (staggered wave) ───────────
  const pS      = B0 + (i / N) * 0.12
  const pE      = Math.min(pS + 0.12, B1)
  const pulseX  = useTransform(p, [pS, pE], [-90, VW + 90])
  const pulseOp = useTransform(p, [B0, B0+0.02, B1-0.02, B1], [0, 1, 1, 0])

  // ── CENTER LINE BLOOM — ship phase glow ──────────────────────────────────
  const midGlow = useTransform(p,
    isMid ? [S0+0.09, S0+0.20] : [0, 1],
    isMid ? [0, 1]             : [0, 0]
  )

  return (
    <motion.g style={{ y, opacity }}>
      {/* The line itself */}
      <motion.line
        x1={0} y1={0} x2={VW} y2={0}
        style={{ stroke, strokeWidth: sw }}
      />
      {/* Build pulse particle */}
      <motion.rect
        y={-1} width={90} height={2} rx={1}
        fill="rgba(34,211,238,0.95)"
        style={{
          x: pulseX,
          opacity: pulseOp,
          filter: 'drop-shadow(0 0 5px rgba(34,211,238,0.8))',
        }}
      />
      {/* Center line ship-phase bloom overlay */}
      {isMid && (
        <motion.line
          x1={0} y1={0} x2={VW} y2={0}
          stroke="rgba(34,211,238,0.55)"
          strokeWidth={2}
          style={{
            opacity: midGlow,
            filter: 'drop-shadow(0 0 12px rgba(34,211,238,1))',
          }}
        />
      )}
    </motion.g>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROGUE SIGNAL — the unexpected input that tests the system during VALIDATE
// ══════════════════════════════════════════════════════════════════════════════

function RogueSignal({ p }: { p: MotionValue<number> }) {
  const op = useTransform(p, [V0, V0+0.015, V0+0.085, V0+0.10], [0, 1, 1, 0])
  const rx = useTransform(p, [V0, V0+0.085], [-70, VW + 70])
  // Travels from top of grid to the rogue line's position — a diagonal trajectory
  const ry = useTransform(p, [V0, V0+0.085], [GRID[0] - 40, GRID[ROGUE]])
  return (
    <motion.g style={{ opacity: op }}>
      <motion.circle
        r={5}
        fill="rgba(239,68,68,1)"
        style={{
          x: rx, y: ry,
          filter: 'drop-shadow(0 0 10px rgba(239,68,68,1))',
        }}
      />
      {/* Trail */}
      <motion.line
        x1={-32} y1={0} x2={0} y2={0}
        stroke="rgba(239,68,68,0.45)"
        strokeWidth={1.5}
        style={{ x: rx, y: ry }}
      />
    </motion.g>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ARCHITECT GUIDE RAILS — precision markers that appear during the grid phase
// These make the moment of ORDER feel intentional, not accidental
// ══════════════════════════════════════════════════════════════════════════════

function ArchitectGuides({ p }: { p: MotionValue<number> }) {
  const op = useTransform(p, [0.20, 0.26, 0.31, 0.35], [0, 0.35, 0.35, 0])
  return (
    <motion.g style={{ opacity: op }}>
      {/* Vertical measurement guides */}
      {[200, 400, 500, 600, 800].map(x => (
        <line key={x}
          x1={x} y1={GT - 20} x2={x} y2={GB + 20}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 10"
        />
      ))}
      {/* Horizontal boundary rails */}
      <line x1={0} y1={GT - 20} x2={VW} y2={GT - 20} stroke="rgba(255,255,255,0.05)" />
      <line x1={0} y1={GB + 20} x2={VW} y2={GB + 20} stroke="rgba(255,255,255,0.05)" />
    </motion.g>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SHIP EXIT BEAM — the center line drops out the bottom of the viewport
// This is the literal handoff to the next section
// ══════════════════════════════════════════════════════════════════════════════

function ShipBeam({ p }: { p: MotionValue<number> }) {
  const op     = useTransform(p, [S0+0.15, S0+0.22], [0, 1])
  const scaleY = useTransform(p, [S0+0.15, S1], [0, 1])
  // Top of beam is at the center line's Y position, scaled downward
  const topPct = `${((GRID[MID] / VH) * 100).toFixed(2)}%`
  return (
    <motion.div
      className="absolute w-[2px] bg-cyan-400"
      style={{
        opacity: op,
        scaleY,
        transformOrigin: 'top center',
        top: topPct,
        left: 'calc(50% - 1px)',
        bottom: 0,
        boxShadow: '0 0 24px 5px rgba(34,211,238,0.45)',
      }}
    />
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ATMOSPHERE — environmental light that responds to phase energy
// ══════════════════════════════════════════════════════════════════════════════

function Atmosphere({ p }: { p: MotionValue<number> }) {
  // BUILD: gentle blue bloom as system activates
  const blueOp = useTransform(p, [B0, B0+0.06, B1, V0], [0, 1, 1, 0])
  // VALIDATE: brief red blush as the rogue signal causes distress
  // V0+0.185 < V1 = 0.75 ✓
  const redOp  = useTransform(p, [V0, V0+0.04, V0+0.185, V1], [0, 1, 1, 0])
  return (
    <>
      <motion.div style={{ opacity: blueOp }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(59,130,246,0.07)_0%,transparent_72%)]"
      />
      <motion.div style={{ opacity: redOp }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(239,68,68,0.06)_0%,transparent_72%)]"
      />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE TEXT — the typography that names each transformation
// Positioned to change the spatial composition per phase:
//   DISCOVER: bottom-left (intimate, ground-level)
//   ARCHITECT: bottom-right (structured, opposite corner)
//   BUILD: top-center (elevated, above the action)
//   VALIDATE: bottom-left again (same as discover — tension mirror)
//   SHIP: centered (absolute stillness)
// ══════════════════════════════════════════════════════════════════════════════

function PhaseText({ p }: { p: MotionValue<number> }) {
  const intro = useTransform(p, [0, 0.01, 0.05, 0.09], [0, 1, 1, 0])
  const disc  = useTransform(p, [0.09, 0.13, 0.16, 0.20], [0, 1, 1, 0])
  const arch  = useTransform(p, [0.20, 0.24, 0.31, 0.35], [0, 1, 1, 0])
  const build = useTransform(p, [0.35, 0.39, 0.51, 0.55], [0, 1, 1, 0])
  const val   = useTransform(p, [0.56, 0.60, 0.71, 0.75], [0, 1, 1, 0])
  const ship  = useTransform(p, [0.76, 0.81, 0.91, 0.95], [0, 1, 1, 0])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 select-none">

      {/* ─── INTRO ─── */}
      <motion.div style={{ opacity: intro }}
        className="absolute flex flex-col items-center text-center px-8">
        <span className="font-mono text-[10px] text-accent tracking-[0.4em] uppercase mb-10 block">
          [ Process ]
        </span>
        <h2 className="text-[clamp(3.5rem,10vw,8rem)] font-light text-fg tracking-tighter uppercase leading-none">
          HOW WE<br/>BUILD.
        </h2>
        <p className="text-[10px] text-fg-subtle font-light mt-10 tracking-[0.5em] uppercase">
          scroll
        </p>
      </motion.div>

      {/* ─── DISCOVER — bottom left ─── */}
      <motion.div style={{ opacity: disc }}
        className="absolute bottom-12 left-8 md:left-20 max-w-xs md:max-w-md">
        <div className="font-mono text-[10px] text-accent tracking-[0.3em] mb-5 uppercase">
          01 / Discover
        </div>
        <h3 className="text-[clamp(2.2rem,7vw,5rem)] font-light text-fg tracking-tighter mb-5 uppercase leading-[0.9]">
          THE<br/>PROBLEM.
        </h3>
        <p className="text-sm md:text-base text-fg-muted font-light leading-relaxed">
          Understand the real problem before defining the solution. This is
          where expensive mistakes are caught cheaply.
        </p>
      </motion.div>

      {/* ─── ARCHITECT — bottom right ─── */}
      <motion.div style={{ opacity: arch }}
        className="absolute bottom-12 right-8 md:right-20 max-w-xs md:max-w-md text-right">
        <div className="font-mono text-[10px] text-accent tracking-[0.3em] mb-5 uppercase">
          02 / Architect
        </div>
        <h3 className="text-[clamp(2.2rem,7vw,5rem)] font-light text-fg tracking-tighter mb-5 uppercase leading-[0.9]">
          THE<br/>SHAPE.
        </h3>
        <p className="text-sm md:text-base text-fg-muted font-light leading-relaxed">
          System design, data models, and API contracts before a single line
          of production code is written.
        </p>
      </motion.div>

      {/* ─── BUILD — top center ─── */}
      <motion.div style={{ opacity: build }}
        className="absolute top-12 left-1/2 -translate-x-1/2 text-center w-full max-w-lg px-6">
        <div className="font-mono text-[10px] text-accent tracking-[0.3em] mb-5 uppercase">
          03 / Build
        </div>
        <h3 className="text-[clamp(2.2rem,7vw,5rem)] font-light text-fg tracking-tighter mb-5 uppercase leading-[0.9]">
          MAKE IT REAL.
        </h3>
        <p className="text-sm md:text-base text-fg-muted font-light leading-relaxed">
          Architecture becomes production-quality software. Weekly builds,
          code review, observability from day one.
        </p>
      </motion.div>

      {/* ─── VALIDATE — bottom left (mirrors Discover, creates tension) ─── */}
      <motion.div style={{ opacity: val }}
        className="absolute bottom-12 left-8 md:left-20 max-w-xs md:max-w-md">
        <div className="font-mono text-[10px] text-red-400 tracking-[0.3em] mb-5 uppercase">
          04 / Validate
        </div>
        <h3 className="text-[clamp(2.2rem,7vw,5rem)] font-light text-fg tracking-tighter mb-5 uppercase leading-[0.9]">
          FIND<br/>OUT.
        </h3>
        <p className="text-sm md:text-base text-fg-muted font-light leading-relaxed">
          We don&apos;t assume it works. We introduce real pressure and observe
          how the system responds to things that shouldn&apos;t happen.
        </p>
      </motion.div>

      {/* ─── SHIP — centered (stillness after all the motion) ─── */}
      <motion.div style={{ opacity: ship }}
        className="absolute flex flex-col items-center text-center px-8">
        <div className="font-mono text-[10px] text-accent tracking-[0.3em] mb-5 uppercase">
          05 / Ship
        </div>
        <h3 className="text-[clamp(2.2rem,7vw,5rem)] font-light text-fg tracking-tighter mb-5 uppercase leading-[0.9]">
          PUT IT<br/>TO WORK.
        </h3>
        <p className="text-sm md:text-base text-fg-muted font-light leading-relaxed max-w-sm">
          Deployment is planned, not improvised. Real users. Real environment.
          The system is ready.
        </p>
      </motion.div>

    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PROCESS CINEMATIC  — the desktop scroll experience
// ══════════════════════════════════════════════════════════════════════════════

function ProcessCinematic() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={ref} className="relative h-[650vh] bg-base">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Atmosphere p={p} />
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <ArchitectGuides p={p} />
          {Array.from({ length: N }, (_, i) => (
            <LineActor key={i} i={i} p={p} />
          ))}
          <RogueSignal p={p} />
        </svg>
        {/* ShipBeam is a div outside SVG — avoids SVG filter animation complexity */}
        <ShipBeam p={p} />
        <PhaseText p={p} />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STATIC VERSION — mobile and prefers-reduced-motion
// Each phase shows a static SVG snapshot of what the line system looks like
// in that state, so the visual language still comes through without animation
// ══════════════════════════════════════════════════════════════════════════════

type LinePattern = 'scattered' | 'grid' | 'active' | 'turbulent' | 'single'

const STATIC_PHASES: {
  num: string
  phase: string
  title: string
  isValidate: boolean
  desc: string
  pattern: LinePattern
}[] = [
  {
    num: '01', phase: 'Discover', title: 'THE PROBLEM.', isValidate: false,
    desc: 'Understand the real problem before defining the solution. This is where expensive mistakes are caught cheaply.',
    pattern: 'scattered',
  },
  {
    num: '02', phase: 'Architect', title: 'THE SHAPE.', isValidate: false,
    desc: 'System design, data models, and API contracts before a line of production code is written.',
    pattern: 'grid',
  },
  {
    num: '03', phase: 'Build', title: 'MAKE IT REAL.', isValidate: false,
    desc: 'Turn architecture into production-quality software. Weekly builds, code review, observability from day one.',
    pattern: 'active',
  },
  {
    num: '04', phase: 'Validate', title: 'FIND OUT.', isValidate: true,
    desc: "We don't assume it works. We introduce real pressure and observe how the system responds.",
    pattern: 'turbulent',
  },
  {
    num: '05', phase: 'Ship', title: 'PUT IT TO WORK.', isValidate: false,
    desc: 'Deployment is planned, not improvised. Real users. Real environment. The system is ready.',
    pattern: 'single',
  },
]

const SCATTER_Y = [8, 22, 35, 48, 56, 64, 72, 80, 89, 15, 42, 67, 30, 58, 75, 20, 45, 93]
const EVEN_Y    = Array.from({ length: 18 }, (_, i) => 12 + i * 4.4)

function MiniLines({ pattern }: { pattern: LinePattern }) {
  const positions = pattern === 'scattered' ? SCATTER_Y
    : pattern === 'single' ? [50]
    : EVEN_Y.slice(0, 14)

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      {positions.map((y, li) => {
        const isRogue  = pattern === 'turbulent' && li === 6
        const turbDy   = isRogue ? 3 : 0
        const isSingle = pattern === 'single'
        const strokeC = isRogue
          ? 'rgba(239,68,68,0.8)'
          : pattern === 'active'
            ? 'rgba(59,130,246,0.48)'
            : isSingle
              ? 'rgba(34,211,238,1)'
              : pattern === 'turbulent'
                ? 'rgba(34,211,238,0.35)'
                : 'rgba(255,255,255,0.15)'
        return (
          <line key={li}
            x1={0} y1={y + turbDy} x2={100} y2={y + turbDy}
            stroke={strokeC}
            strokeWidth={isSingle ? 0.6 : 0.22}
          />
        )
      })}
    </svg>
  )
}

function ProcessStatic() {
  return (
    <div className="bg-base">
      {STATIC_PHASES.map(ph => (
        <div
          key={ph.num}
          className={`relative min-h-[65vh] flex flex-col justify-end overflow-hidden border-b ${
            ph.isValidate ? 'border-red-500/20' : 'border-border/30'
          }`}
        >
          {/* Phase-state line snapshot */}
          <div className="absolute inset-0 pointer-events-none opacity-55">
            <MiniLines pattern={ph.pattern} />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-16">
            <div className={`font-mono text-[10px] tracking-[0.3em] mb-5 uppercase ${ph.isValidate ? 'text-red-400' : 'text-accent'}`}>
              {ph.num} / {ph.phase}
            </div>
            <h3 className="text-4xl md:text-5xl font-light text-fg tracking-tighter mb-5 uppercase">
              {ph.title}
            </h3>
            <p className="text-base text-fg-muted font-light leading-relaxed max-w-xl">
              {ph.desc}
            </p>
          </div>
        </div>
      ))}

      {/* Exit beam */}
      <div className="h-32 flex justify-center bg-base border-t border-border/30">
        <div className="w-[2px] h-full bg-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export function ProcessSection() {
  return (
    <>
      <div className="hidden md:block md:motion-reduce:hidden">
        <ProcessCinematic />
      </div>
      <div className="block md:hidden md:motion-reduce:block">
        <ProcessStatic />
      </div>
    </>
  )
}
