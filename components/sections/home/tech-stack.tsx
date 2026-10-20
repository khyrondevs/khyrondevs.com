'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'motion/react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

// ══════════════════════════════════════════════════════════════════════════════
// THE CONCEPT: THE INTERROGATION
//
// Five questions. Five answers. One experience.
//
// Instead of showing technologies as objects (rings, cards, logos, diagrams),
// we ask the five questions that justify every technology in the system.
// Each question appears alone in the black — enormous, centered, undeniable.
// The specific technologies that answer it emerge as a sparse constellation:
// pinpoints with thin lines radiating from the center. No icons. No logos.
// Just names positioned precisely in space.
//
// THE HOLY SHIT MOMENT:
// Phase 4: "HOW DOES IT THINK?" — four AI/RAG technologies materialize at the
// cardinal points (top/left/bottom/right). Faint dashed connector lines appear
// between them forming a diamond. The visitor realizes they are looking at a
// real RAG pipeline architecture. The structure was always in the question.
//
// Five phases. One black space. No cuts. No cards. No collection.
// ══════════════════════════════════════════════════════════════════════════════

const CX = 500  // SVG center X (viewBox "0 0 1000 900")
const CY = 450  // SVG center Y

// ── PHASE DEFINITIONS ─────────────────────────────────────────────────────────

type TechNode = { px: number; py: number; name: string }
type PhaseData = {
  question: string
  nodes: TechNode[]
  t0: number
  t1: number
  rag?: boolean   // special: show RAG diamond connector
}

// Overlapping phase windows create crossfades rather than hard cuts
const PHASES: PhaseData[] = [
  {
    question: 'HOW IS IT\nEXPRESSED?',
    nodes: [
      { px: 162, py: 224, name: 'TypeScript' },
      { px: 838, py: 676, name: 'Python' },
    ],
    t0: 0.08, t1: 0.27,
  },
  {
    question: 'HOW IS IT\nSTRUCTURED?',
    nodes: [
      { px: 118, py: 218, name: 'Next.js' },
      { px: 882, py: 218, name: 'React' },
      { px: 88,  py: 450, name: 'Node.js' },
      { px: 912, py: 450, name: 'GraphQL' },
      { px: 500, py: 738, name: 'REST' },
    ],
    t0: 0.24, t1: 0.45,
  },
  {
    question: 'HOW DOES IT\nREMEMBER?',
    nodes: [
      { px: 132, py: 238, name: 'PostgreSQL' },
      { px: 868, py: 238, name: 'Redis' },
      { px: 152, py: 662, name: 'pgvector' },
      { px: 848, py: 662, name: 'BullMQ' },
    ],
    t0: 0.42, t1: 0.63,
  },
  {
    question: 'HOW DOES IT\nTHINK?',
    nodes: [
      { px: 500, py: 148, name: 'OpenAI' },
      { px: 92,  py: 450, name: 'LangChain' },
      { px: 500, py: 752, name: 'Pinecone' },
      { px: 908, py: 450, name: 'Hugging Face' },
    ],
    t0: 0.60, t1: 0.81,
    rag: true,
  },
  {
    question: 'HOW DOES IT\nEXIST?',
    nodes: [
      { px: 148, py: 218, name: 'Vercel' },
      { px: 852, py: 218, name: 'AWS' },
      { px: 88,  py: 450, name: 'Docker' },
      { px: 912, py: 450, name: 'GitHub Actions' },
      { px: 152, py: 682, name: 'Terraform' },
      { px: 848, py: 682, name: 'Cloudflare' },
    ],
    t0: 0.78, t1: 0.93,
  },
]

// ── TEXT ANCHOR HELPER ────────────────────────────────────────────────────────

function getTextProps(px: number, py: number): {
  tx: number; ty: number; anchor: 'start' | 'end' | 'middle'
} {
  const dx = Math.abs(px - CX)
  const dy = Math.abs(py - CY)
  if (py < CY && dy >= dx) return { tx: px,      ty: py - 12, anchor: 'middle' }
  if (py > CY && dy >= dx) return { tx: px,      ty: py + 18, anchor: 'middle' }
  if (px < CX)             return { tx: px - 12, ty: py + 4,  anchor: 'end'    }
  return                          { tx: px + 12, ty: py + 4,  anchor: 'start'  }
}

// ── CONSTELLATION NODE ────────────────────────────────────────────────────────
// One technology in the constellation. Its own component so hooks are
// called unconditionally at the top level of the function.

function ConstellationNode({
  node, p, t0, t1, rag,
}: {
  node: TechNode
  p: MotionValue<number>
  t0: number
  t1: number
  rag: boolean
}) {
  const { px, py, name } = node
  const len = Math.hypot(px - CX, py - CY)
  const { tx, ty, anchor } = getTextProps(px, py)

  // Strict monotone checks performed in design:
  // phaseOp: [t0, t0+0.04, t1-0.04, t1] — gap = t1-t0-0.08 ≥ 0.11 for all phases ✓
  // dashOffset: [t0+0.01, t0+0.07] ✓
  // elOp: [t0+0.05, t0+0.10, t1-0.04, t1] — gap = t1-t0-0.14 ≥ 0.05 for all phases ✓
  const phaseOp   = useTransform(p, [t0, t0 + 0.04, t1 - 0.04, t1], [0, 1, 1, 0])
  const dashOffset = useTransform(p, [t0 + 0.01, t0 + 0.07], [len, 0])
  const elOp       = useTransform(p, [t0 + 0.05, t0 + 0.10, t1 - 0.04, t1], [0, 1, 1, 0])

  const lineColor = rag ? 'rgba(34,211,238,0.55)' : 'rgba(59,130,246,0.5)'
  const dotFill   = rag ? 'rgba(34,211,238,1)'    : 'rgba(59,130,246,0.9)'
  const dotGlow   = rag
    ? 'drop-shadow(0 0 6px rgba(34,211,238,0.9))'
    : 'drop-shadow(0 0 4px rgba(59,130,246,0.6))'

  return (
    <motion.g style={{ opacity: phaseOp }}>
      {/* Line grows from center toward node */}
      <motion.line
        x1={CX} y1={CY} x2={px} y2={py}
        stroke={lineColor}
        strokeWidth={0.6}
        strokeDasharray={len}
        style={{ strokeDashoffset: dashOffset }}
      />
      {/* Dot + label appear after line has partially drawn */}
      <motion.g style={{ opacity: elOp }}>
        <circle
          cx={px} cy={py} r={3}
          fill={dotFill}
          style={{ filter: dotGlow }}
        />
        <text
          x={tx} y={ty}
          fill="rgba(255,255,255,0.65)"
          fontSize={9}
          fontFamily="monospace"
          letterSpacing={1.5}
          textAnchor={anchor}
        >
          {name}
        </text>
      </motion.g>
    </motion.g>
  )
}

// ── RAG DIAMOND ───────────────────────────────────────────────────────────────
// The holy shit moment: faint dashed connectors between the four intelligence
// nodes form a diamond — a real RAG pipeline architecture diagram.
// This only appears during Phase 4 ("HOW DOES IT THINK?").

function RagDiamond({ p }: { p: MotionValue<number> }) {
  // Phase 4: t0=0.60, t1=0.81
  // Diamond appears after the nodes are established, then fades with the phase
  // [0.69, 0.74, 0.77, 0.81] — all strictly increasing ✓
  const op = useTransform(p, [0.69, 0.74, 0.77, 0.81], [0, 0.42, 0.42, 0])

  return (
    <motion.g style={{ opacity: op }}>
      <line x1={92}  y1={450} x2={500} y2={148} stroke="rgba(34,211,238,1)" strokeWidth={0.4} strokeDasharray="4 9" />
      <line x1={500} y1={148} x2={908} y2={450} stroke="rgba(34,211,238,1)" strokeWidth={0.4} strokeDasharray="4 9" />
      <line x1={908} y1={450} x2={500} y2={752} stroke="rgba(34,211,238,1)" strokeWidth={0.4} strokeDasharray="4 9" />
      <line x1={500} y1={752} x2={92}  y2={450} stroke="rgba(34,211,238,1)" strokeWidth={0.4} strokeDasharray="4 9" />
    </motion.g>
  )
}

// ── QUESTION TEXT ─────────────────────────────────────────────────────────────

function QuestionPhase({
  phase, p,
}: {
  phase: PhaseData
  p: MotionValue<number>
}) {
  const op = useTransform(p, [phase.t0, phase.t0 + 0.04, phase.t1 - 0.04, phase.t1], [0, 1, 1, 0])
  const y  = useTransform(p, [phase.t0, phase.t0 + 0.06], [22, 0])

  return (
    <motion.div
      style={{ opacity: op, y }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
    >
      <h3
        className={`
          text-[clamp(2rem,8vw,6.5rem)] font-light tracking-tighter uppercase
          text-center leading-[0.9] px-8 whitespace-pre-line
          ${phase.rag ? 'text-cyan-300/90' : 'text-fg'}
        `}
      >
        {phase.question}
      </h3>
    </motion.div>
  )
}

// ── ENTRY BEAM ────────────────────────────────────────────────────────────────
// Continues visually from the Process section's exit beam

function EntryBeam({ p }: { p: MotionValue<number> }) {
  const scaleY = useTransform(p, [0.00, 0.07], [0, 1])
  const op     = useTransform(p, [0.00, 0.01, 0.07, 0.11], [0, 1, 1, 0])
  return (
    <motion.div
      className="absolute w-[2px] bg-cyan-400"
      style={{
        scaleY,
        transformOrigin: 'top center',
        opacity: op,
        top: 0,
        left: 'calc(50% - 1px)',
        height: '50%',
        boxShadow: '0 0 22px 5px rgba(34,211,238,0.45)',
      }}
    />
  )
}

// ── ATMOSPHERE ────────────────────────────────────────────────────────────────

function Atmosphere({ p }: { p: MotionValue<number> }) {
  // Standard blue glow during non-RAG phases
  const blueOp = useTransform(p, [0.08, 0.14, 0.58, 0.62], [0, 1, 1, 0])
  // Cyan glow intensifies during the intelligence phase
  const cyanOp = useTransform(p, [0.62, 0.67, 0.79, 0.83], [0, 1, 1, 0])
  return (
    <>
      <motion.div style={{ opacity: blueOp }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(59,130,246,0.055)_0%,transparent_68%)]"
      />
      <motion.div style={{ opacity: cyanOp }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(34,211,238,0.055)_0%,transparent_68%)]"
      />
    </>
  )
}

// ── SECTION LABEL ─────────────────────────────────────────────────────────────

function SectionLabel({ p }: { p: MotionValue<number> }) {
  const op = useTransform(p, [0.00, 0.02, 0.06, 0.11], [0, 1, 1, 0])
  return (
    <motion.div style={{ opacity: op }}
      className="absolute top-12 left-8 md:left-20 pointer-events-none select-none z-20">
      <span className="font-mono text-[10px] text-accent tracking-[0.4em] uppercase">
        [ Technology ]
      </span>
    </motion.div>
  )
}

// ── RESOLUTION ────────────────────────────────────────────────────────────────

function Resolution({ p }: { p: MotionValue<number> }) {
  // [0.93, 0.97, 0.995, 1.0] — strictly increasing ✓
  const op = useTransform(p, [0.93, 0.97, 0.995, 1.0], [0, 1, 1, 0])
  return (
    <motion.div style={{ opacity: op }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
      <div className="text-center px-8">
        <div className="w-20 h-px bg-fg-subtle/25 mx-auto mb-10" />
        <p className="text-[clamp(1.5rem,4vw,3.2rem)] font-light text-fg tracking-tighter uppercase leading-tight mb-4">
          THE STACK IS NOT<br/>THE PRODUCT.
        </p>
        <p className="text-[clamp(1.5rem,4vw,3.2rem)] font-light text-cyan-400 tracking-tighter uppercase leading-tight">
          THE SYSTEM IS.
        </p>
      </div>
    </motion.div>
  )
}

// ── TECH CINEMATIC ────────────────────────────────────────────────────────────

function TechCinematic() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={ref} className="relative h-[600vh] bg-base">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Atmosphere p={p} />
        <EntryBeam p={p} />

        {/* SVG constellation layer: lines, dots, labels */}
        <svg
          viewBox="0 0 1000 900"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {PHASES.map((phase) =>
            phase.nodes.map((node, ni) => (
              <ConstellationNode
                key={`${phase.t0}-${ni}`}
                node={node}
                p={p}
                t0={phase.t0}
                t1={phase.t1}
                rag={phase.rag ?? false}
              />
            ))
          )}
          <RagDiamond p={p} />
        </svg>

        {/* HTML overlay: question text per phase */}
        {PHASES.map((phase) => (
          <QuestionPhase key={phase.t0} phase={phase} p={p} />
        ))}

        <SectionLabel p={p} />
        <Resolution p={p} />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STATIC VERSION — mobile and prefers-reduced-motion
// Same five questions, answered as editorial text blocks. The visual language
// is preserved: question-first, technology-subordinate, darkness dominant.
// ══════════════════════════════════════════════════════════════════════════════

const STATIC_PHASES = [
  {
    q: 'HOW IS IT EXPRESSED?',
    techs: ['TypeScript', 'Python'],
    rag: false,
  },
  {
    q: 'HOW IS IT STRUCTURED?',
    techs: ['Next.js', 'React', 'Node.js', 'REST', 'GraphQL'],
    rag: false,
  },
  {
    q: 'HOW DOES IT REMEMBER?',
    techs: ['PostgreSQL', 'Redis', 'pgvector', 'BullMQ'],
    rag: false,
  },
  {
    q: 'HOW DOES IT THINK?',
    techs: ['OpenAI', 'LangChain', 'Pinecone', 'Hugging Face'],
    rag: true,
  },
  {
    q: 'HOW DOES IT EXIST?',
    techs: ['Vercel', 'AWS', 'Docker', 'GitHub Actions', 'Terraform', 'Cloudflare'],
    rag: false,
  },
]

function TechStatic() {
  return (
    <div className="bg-base border-t border-border/30">
      <div className="px-8 md:px-20 pt-16 pb-6">
        <RevealOnScroll>
          <span className="font-mono text-[10px] text-accent tracking-[0.4em] uppercase border border-accent/20 px-3 py-1 bg-accent/5">
            [ Technology ]
          </span>
        </RevealOnScroll>
      </div>

      {STATIC_PHASES.map((ph, i) => (
        <div
          key={i}
          className={`px-8 md:px-20 py-14 border-t relative overflow-hidden ${
            ph.rag
              ? 'border-cyan-400/30 bg-gradient-to-b from-cyan-950/10 to-transparent'
              : 'border-border/20'
          }`}
        >
          <RevealOnScroll delay={0.08 * (i % 3)}>
            {ph.rag && (
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase font-semibold">
                  NEURAL RAG PIPELINE
                </span>
              </div>
            )}
            <h3
              className={`text-3xl md:text-5xl font-light tracking-tighter uppercase leading-tight mb-8 ${
                ph.rag ? 'text-cyan-300/90' : 'text-fg'
              }`}
            >
              {ph.q}
            </h3>
            <div className="flex flex-wrap gap-3">
              {ph.techs.map(t => (
                <span
                  key={t}
                  className={`font-mono text-[10px] tracking-widest uppercase border px-3 py-1.5 transition-all duration-300 active:scale-95 ${
                    ph.rag
                      ? 'text-cyan-300 bg-cyan-950/30 border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.15)] active:border-cyan-300 active:bg-cyan-900/50'
                      : 'text-fg-muted bg-surface/30 border-border/40 hover:border-fg-subtle active:border-cyan-400/60 active:text-fg'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      ))}

      <div className="px-8 md:px-20 py-20 border-t border-border/30 text-center flex flex-col items-center gap-4">
        <RevealOnScroll>
          <div className="w-16 h-[2px] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] mb-6 mx-auto" />
          <p className="text-3xl md:text-5xl font-light text-fg tracking-tighter uppercase leading-tight">
            THE STACK IS NOT THE PRODUCT.
          </p>
          <p className="text-3xl md:text-5xl font-light text-cyan-400 tracking-tighter uppercase leading-tight mt-2">
            THE SYSTEM IS.
          </p>
        </RevealOnScroll>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export function TechStackSection() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <>
      <div className="hidden md:block md:motion-reduce:hidden">
        {isDesktop && <TechCinematic />}
      </div>
      <div className="block md:hidden md:motion-reduce:block">
        <TechStatic />
      </div>
    </>
  )
}
