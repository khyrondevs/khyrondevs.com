'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, MotionValue } from 'motion/react'
import { getFeaturedProjects, Project } from '@/lib/content/projects'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

// ----------------------------------------------------------------------------
// SCENE 1: RAG KNOWLEDGE PLATFORM (CINEMATIC SCROLL ENVIRONMENT)
// ----------------------------------------------------------------------------
// Component to safely call useTransform per document
function FloatingDocument({ pos, i, progress, reducedMotion }: { pos: { x: number, y: number, zOffset: number }, i: number, progress: MotionValue<number>, reducedMotion: boolean }) {
  const z = useTransform(progress, [0, 0.4], [-2000 + pos.zOffset, 1500 + pos.zOffset])
  return (
    <motion.div className="absolute w-48 h-64 bg-surface/20 border border-accent/20 p-5 flex flex-col backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.05)]"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transformStyle: 'preserve-3d',
        translateZ: reducedMotion ? pos.zOffset - 500 : z,
        rotateX: i % 2 === 0 ? 15 : -15,
        rotateY: i % 3 === 0 ? 20 : -20,
        filter: 'blur(2px)'
      }}>
      <span className="font-mono text-[8px] text-accent/60 uppercase tracking-widest mb-4">DOC_NODE_{i * 1024}</span>
      <div className="w-full h-1 bg-accent/20 mb-3" />
      <div className="w-4/5 h-1 bg-accent/20 mb-3" />
      <div className="w-full h-1 bg-accent/20 mb-3" />
      <div className="w-2/3 h-1 bg-accent/20 mb-3" />
      <div className="mt-auto flex justify-between">
         <div className="w-3 h-3 border border-accent/30" />
         <div className="w-8 h-1 bg-cyan-400/20" />
      </div>
    </motion.div>
  )
}

function RAGCinematicWorld({ progress, project, reducedMotion }: { progress: MotionValue<number>, project: Project, reducedMotion: boolean }) {
  // Timeline Opacities
  const titleOp = useTransform(progress, [0.0, 0.1, 0.15, 0.2], [0, 1, 1, 0])
  const problemOp = useTransform(progress, [0.2, 0.25, 0.35, 0.4], [0, 1, 1, 0])
  const archOp = useTransform(progress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0])
  const stackOp = useTransform(progress, [0.75, 0.8, 1.0], [0, 1, 1])

  // Visual Environment Layers
  const docOpacity = useTransform(progress, [0.0, 0.1, 0.35, 0.4], [0, 0.6, 0.6, 0])
  const graphOpacity = useTransform(progress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0])
  const graphScale = useTransform(progress, [0.3, 0.7], [0.8, 1.2])
  const uiOpacity = useTransform(progress, [0.55, 0.65, 1.0], [0, 1, 1])
  const uiY = useTransform(progress, [0.55, 0.65], [100, 0])
  const uiYCalc = useTransform(uiY, v => `calc(-50% + ${v}px)`)
  const uiScale = useTransform(progress, [0.55, 0.65], [0.95, 1])

  // Deterministic positions for documents
  const docPositions = [
    { x: 10, y: 15, zOffset: 0 },
    { x: 70, y: 20, zOffset: 200 },
    { x: 25, y: 60, zOffset: 400 },
    { x: 80, y: 75, zOffset: 600 },
    { x: 40, y: 10, zOffset: 800 },
    { x: 15, y: 80, zOffset: 1000 },
    { x: 85, y: 40, zOffset: 1200 },
    { x: 50, y: 85, zOffset: 1400 },
    { x: 30, y: 35, zOffset: 1600 },
    { x: 65, y: 65, zOffset: 1800 },
  ]

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-base" style={{ perspective: '1200px' }}>

      {/* ---------------- VISUAL LAYERS ---------------- */}

      {/* 1. The Knowledge Field (Floating Documents) */}
      <motion.div className="absolute inset-0 transform-style-3d pointer-events-none" style={{ opacity: docOpacity }}>
        {docPositions.map((pos, i) => (
          <FloatingDocument key={i} pos={pos} i={i} progress={progress} reducedMotion={reducedMotion} />
        ))}
      </motion.div>

      {/* 2. The Retrieval Architecture (Vector Graph) */}
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: graphOpacity, scale: reducedMotion ? 1 : graphScale }}>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08)_0%,transparent_60%)]" />
         <svg className="w-full h-full max-w-[1200px] max-h-[800px] opacity-80" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
           {/* Complex web of connections */}
           <path d="M 100,100 L 300,250 L 500,150 L 700,350 L 900,200 M 300,250 L 400,450 L 700,350 M 500,150 L 600,100 L 900,200" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="4 6" />
           <path d="M 200,500 L 400,450 L 600,550 L 700,350" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />

           {!reducedMotion && (
             <>
               <motion.path d="M 100,100 L 300,250 L 500,150 L 700,350" fill="none" stroke="rgba(34,211,238,0.8)" strokeWidth="2" strokeDasharray="150"
                  animate={{ strokeDashoffset: [150, -150] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ filter: 'drop-shadow(0 0 12px rgba(34,211,238,1))' }}
               />
               <motion.path d="M 200,500 L 400,450 L 700,350 L 900,200" fill="none" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeDasharray="200"
                  animate={{ strokeDashoffset: [200, -200] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }}
                  style={{ filter: 'drop-shadow(0 0 12px rgba(59,130,246,1))' }}
               />
             </>
           )}
           {/* Nodes */}
           {[
             {x: 100, y: 100, r: 4, c: 'rgba(59,130,246,0.5)'},
             {x: 300, y: 250, r: 8, c: 'rgba(34,211,238,0.9)', glow: true},
             {x: 500, y: 150, r: 5, c: 'rgba(59,130,246,0.8)'},
             {x: 700, y: 350, r: 10, c: 'rgba(34,211,238,1)', glow: true},
             {x: 900, y: 200, r: 4, c: 'rgba(59,130,246,0.5)'},
             {x: 400, y: 450, r: 6, c: 'rgba(34,211,238,0.7)'},
             {x: 200, y: 500, r: 3, c: 'rgba(59,130,246,0.5)'},
             {x: 600, y: 550, r: 4, c: 'rgba(59,130,246,0.5)'},
             {x: 600, y: 100, r: 3, c: 'rgba(34,211,238,0.4)'},
           ].map((n, i) => (
             <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.c} className={n.glow ? "shadow-[0_0_30px_rgba(34,211,238,1)]" : ""} />
           ))}
         </svg>
      </motion.div>

      {/* 3. The Product Interface (Foreground) */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-4xl z-30 pointer-events-auto"
        style={{ opacity: uiOpacity, y: reducedMotion ? '-50%' : uiYCalc, scale: reducedMotion ? 1 : uiScale }}
      >
        <div className="w-full bg-base/80 border border-border/60 shadow-[0_40px_100px_rgba(0,0,0,0.9),0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-2xl rounded-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-surface/80">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-border/80" />
                <div className="w-3 h-3 rounded-full bg-border/80" />
                <div className="w-3 h-3 rounded-full bg-border/80" />
              </div>
              <div className="w-px h-4 bg-border/50 mx-2" />
              <span className="font-mono text-[10px] text-fg-subtle tracking-widest uppercase">System Execution / RAG Workspace</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-cyan-400 tracking-widest uppercase">Telemetry Online</span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse" />
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 lg:p-16">
            <div className="mb-12">
              <div className="font-mono text-[11px] text-cyan-400 mb-4 uppercase tracking-widest flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                 Query Input
              </div>
              <div className="border border-border/50 bg-surface/30 px-6 py-5 text-base md:text-lg text-fg font-light">
                Extract all risk factors from the Q3 compliance documents and summarize the regulatory impact on current active deployments.
              </div>
            </div>

            <div className="pl-6 md:pl-10 border-l border-accent/30 relative">
              <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              <div className="font-mono text-[11px] text-accent mb-6 uppercase tracking-widest">Semantic Context Resolved [k=3]</div>
              <div className="flex flex-col gap-3 mb-14">
                <div className="flex items-center gap-4 border border-border/40 bg-surface/40 p-3">
                   <span className="text-[10px] font-mono text-fg-subtle w-24">0.89 MATCH</span>
                   <span className="text-xs font-mono text-fg-muted">DOC_Q3_RISK_ASSESSMENT_V2</span>
                </div>
                <div className="flex items-center gap-4 border border-cyan-400/30 bg-cyan-950/40 p-3 relative overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                   {!reducedMotion && <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" animate={{ x: ['-200%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />}
                   <span className="text-[10px] font-mono text-cyan-400 w-24">0.96 MATCH</span>
                   <span className="text-xs font-mono text-cyan-200 relative z-10">DOC_Q3_COMPLIANCE_AUDIT_FINAL</span>
                </div>
              </div>

              <div className="absolute left-[-5px] top-[180px] w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,1)]" />
              <div className="font-mono text-[11px] text-cyan-400 mb-6 uppercase tracking-widest mt-6">Generated Contextual Response</div>
              <div className="text-lg md:text-xl text-fg font-light leading-relaxed">
                Based on the active compliance audit <span className="text-cyan-300 font-normal">[DOC_Q3_COMPLIANCE_AUDIT_FINAL]</span>, the primary regulatory impact involves Section 4(a) requirements. All active external data access nodes must undergo immediate architectural review to maintain compliance posture.
                {!reducedMotion && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="inline-block w-2.5 h-5 bg-cyan-400 ml-2 translate-y-[2px]" />}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------------- NARRATIVE OVERLAYS ---------------- */}

      {/* 1. Title Sequence */}
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center z-40 pointer-events-none p-6" style={{ opacity: titleOp }}>
         <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase mb-8 block border border-accent/30 px-4 py-2 bg-base/80 backdrop-blur-sm">
           Featured System / 01
         </span>
         <h3 className="text-6xl md:text-8xl lg:text-9xl font-light text-fg tracking-tighter drop-shadow-2xl">
           {project.title}
         </h3>
         <p className="mt-8 font-mono text-sm text-cyan-400 tracking-[0.2em] uppercase bg-base/50 px-4 py-2 backdrop-blur-sm border border-border/50">
           {project.category} {'//'} {project.statusLabel}
         </p>
      </motion.div>

      {/* 2. The Problem */}
      <motion.div className="absolute left-0 top-1/4 w-full md:w-1/2 p-12 md:p-24 z-40 pointer-events-none" style={{ opacity: problemOp }}>
         <div className="border-l-2 border-cyan-400 pl-8 md:pl-12 bg-gradient-to-r from-base via-base/80 to-transparent py-12">
           <h4 className="text-4xl md:text-5xl font-light text-fg mb-8 leading-tight drop-shadow-lg">
             Knowledge existed.<br/>
             <span className="text-fg-muted">Finding the right knowledge was the problem.</span>
           </h4>
           <p className="text-lg text-fg-muted max-w-md leading-relaxed font-light">
             {project.problem}
           </p>
         </div>
      </motion.div>

      {/* 3. The Architecture */}
      <motion.div className="absolute right-0 top-1/3 w-full md:w-1/2 p-12 md:p-24 flex flex-col items-end text-right z-40 pointer-events-none" style={{ opacity: archOp }}>
         <div className="border-r-2 border-accent pr-8 md:pr-12 bg-gradient-to-l from-base via-base/80 to-transparent py-12 flex flex-col items-end">
           <div className="font-mono text-xs text-cyan-400 mb-8 uppercase tracking-[0.2em] flex flex-wrap justify-end gap-3 max-w-md leading-loose">
             <span className="bg-cyan-950/50 px-2 py-1 border border-cyan-400/30">INDEX</span> →
             <span className="bg-cyan-950/50 px-2 py-1 border border-cyan-400/30">RETRIEVE</span> →
             <span className="bg-cyan-950/50 px-2 py-1 border border-cyan-400/30">CONTEXT</span> →
             <span className="bg-cyan-950/50 px-2 py-1 border border-cyan-400/30 text-cyan-200">GENERATE</span>
           </div>
           <h4 className="text-3xl font-light text-fg mb-6">Semantic architecture.</h4>
           <p className="text-lg text-fg-muted max-w-md leading-relaxed font-light">
             {project.solution}
           </p>
         </div>
      </motion.div>

      {/* 4. Resolution & CTA */}
      <motion.div className="absolute bottom-0 left-0 w-full p-12 md:p-24 z-50 pointer-events-none flex flex-col items-center justify-end h-full" style={{ opacity: stackOp }}>
         <div className="flex flex-col items-center bg-gradient-to-t from-base via-base to-transparent w-full pt-32 pb-8">
           <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-3xl">
              {project.stack.map(tech => (
                 <span key={tech} className="px-4 py-2 border border-border/50 bg-surface/80 backdrop-blur-md text-xs font-mono text-fg-subtle uppercase tracking-widest shadow-xl">
                   {tech}
                 </span>
              ))}
           </div>
           <Link href={`/work/${project.slug}`} className="pointer-events-auto group flex items-center gap-4 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-400/30 px-8 py-4 bg-cyan-950/20 hover:bg-cyan-950/40 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <span className="uppercase tracking-[0.2em]">Explore System Configuration</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">{'->'}</span>
           </Link>
         </div>
      </motion.div>

    </div>
  )
}

// ----------------------------------------------------------------------------
// SECONDARY WORLDS
// ----------------------------------------------------------------------------
function AutomationWorld({ project, reducedMotion }: { project: Project, reducedMotion: boolean }) {
  return (
    <div className="w-full h-full relative flex flex-col group">
      {/* Visual Environment */}
      <div className="absolute inset-0 bg-surface/20 pointer-events-none overflow-hidden">
        {/* Isometric Grid Base */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:rotateX(60deg)_rotateZ(-45deg)_scale(2)] origin-center opacity-50" />

        {/* Pipeline graphic */}
        <div className="absolute inset-0 flex items-center justify-center opacity-80 md:opacity-40 md:group-hover:opacity-100 transition-opacity duration-1000">
           <svg className="w-full h-full max-w-2xl" viewBox="0 0 800 600">
              <path d="M 100,300 L 300,300 L 300,150 L 600,150 L 600,450 L 700,450" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />
              <path d="M 300,300 L 300,450 L 500,450" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="2" strokeDasharray="4 4" />
              {!reducedMotion && (
                <motion.path d="M 100,300 L 300,300 L 300,150 L 600,150 L 600,450 L 700,450" fill="none" stroke="rgba(34,211,238,1)" strokeWidth="3"
                  strokeDasharray="200" animate={{ strokeDashoffset: [200, -1200] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ filter: 'drop-shadow(0 0 12px rgba(34,211,238,1))' }}
                />
              )}
              <rect x="280" y="280" width="40" height="40" fill="rgba(17,19,24,1)" stroke="rgba(59,130,246,0.8)" strokeWidth="2" />
              <rect x="290" y="290" width="20" height="20" fill="rgba(59,130,246,0.3)" />

              <rect x="580" y="130" width="40" height="40" fill="rgba(17,19,24,1)" stroke="rgba(59,130,246,0.8)" strokeWidth="2" />
              <rect x="580" y="430" width="40" height="40" fill="rgba(17,19,24,1)" stroke="rgba(34,211,238,0.8)" strokeWidth="2" className="shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
           </svg>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/60 to-transparent pointer-events-none z-10" />

      <div className="relative z-20 mt-auto p-10 md:p-16 lg:p-20 flex flex-col pointer-events-auto">
        <span className="font-mono text-[10px] text-fg-subtle tracking-widest uppercase mb-6 block w-fit border border-border/50 px-3 py-1 bg-surface/50 backdrop-blur-md">
          {project.category}
        </span>
        <h4 className="text-4xl md:text-5xl font-light text-fg mb-6 group-hover:text-cyan-300 transition-colors duration-500">
          {project.title}
        </h4>
        <p className="text-base text-fg-muted font-light max-w-md leading-relaxed mb-10">
          {project.coverDescription}
        </p>
        <Link href={`/work/${project.slug}`} className="group/btn flex items-center gap-3 text-xs font-mono text-accent hover:text-cyan-400 transition-colors uppercase tracking-widest w-fit pb-1 border-b border-accent/40 hover:border-cyan-400">
          <span>Review Execution Graph</span>
          <span className="group-hover/btn:translate-x-2 transition-transform duration-300">{'->'}</span>
        </Link>
      </div>
    </div>
  )
}

function DashboardWorld({ project, reducedMotion }: { project: Project, reducedMotion: boolean }) {
  return (
    <div className="w-full h-full relative flex flex-col group">
      {/* Visual Environment */}
      <div className="absolute inset-0 bg-surface/30 pointer-events-none overflow-hidden flex items-start justify-end p-8 lg:p-16">
        <div className="w-full max-w-lg aspect-square relative opacity-80 md:opacity-50 md:group-hover:opacity-100 transition-opacity duration-1000 flex flex-col gap-4 perspective-[1000px]">
           {/* Telemetry Pane */}
           <div className="w-full h-1/2 border border-border/30 bg-base/80 backdrop-blur-md p-6 flex flex-col justify-end gap-2 shadow-2xl" style={{ transform: 'rotateY(-15deg)' }}>
              <div className="font-mono text-[9px] text-accent uppercase tracking-widest absolute top-4 left-4 border border-accent/30 px-2 py-0.5">Live Metrics</div>
              <div className="flex items-end gap-2 h-full pt-8">
                 {Array.from({length: 12}).map((_, i) => (
                    <motion.div key={i} className="flex-1 bg-cyan-900/50 border-t border-cyan-400/50"
                      initial={{ height: `${20 + ((i * 37) % 60)}%` }}
                      animate={!reducedMotion ? { height: [`${20 + ((i * 37) % 60)}%`, `${20 + ((i * 83) % 60)}%`] } : {}}
                      transition={{ duration: 2 + ((i * 11) % 3), repeat: Infinity, repeatType: 'mirror' }}
                    />
                 ))}
              </div>
           </div>
           {/* Event Stream Pane */}
           <div className="w-full h-1/2 border border-border/30 bg-base/80 backdrop-blur-md p-6 flex flex-col justify-start gap-3 shadow-2xl overflow-hidden" style={{ transform: 'rotateY(-15deg)' }}>
              <div className="font-mono text-[9px] text-accent uppercase tracking-widest mb-2 border border-accent/30 px-2 py-0.5 w-fit">Event Stream</div>
              {Array.from({length: 5}).map((_, i) => (
                 <div key={i} className="flex gap-4 items-center">
                    <span className="text-[8px] font-mono text-fg-subtle">10:4{i}:{12 + i * 7}</span>
                    <div className={`h-1.5 w-full ${i === 2 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-border/50'}`} />
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent pointer-events-none z-10" />

      <div className="relative z-20 mt-auto p-10 md:p-16 lg:p-20 flex flex-col pointer-events-auto">
        <span className="font-mono text-[10px] text-fg-subtle tracking-widest uppercase mb-6 block w-fit border border-border/50 px-3 py-1 bg-surface/50 backdrop-blur-md">
          {project.category}
        </span>
        <h4 className="text-4xl md:text-5xl font-light text-fg mb-6 group-hover:text-cyan-300 transition-colors duration-500">
          {project.title}
        </h4>
        <p className="text-base text-fg-muted font-light max-w-md leading-relaxed mb-10">
          {project.coverDescription}
        </p>
        <Link href={`/work/${project.slug}`} className="group/btn flex items-center gap-3 text-xs font-mono text-accent hover:text-cyan-400 transition-colors uppercase tracking-widest w-fit pb-1 border-b border-accent/40 hover:border-cyan-400">
          <span>Review Telemetry Architecture</span>
          <span className="group-hover/btn:translate-x-2 transition-transform duration-300">{'->'}</span>
        </Link>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------------
// MAIN SECTION EXPORT
// ----------------------------------------------------------------------------
export function WorkSection() {
  const projects = getFeaturedProjects()
  const reducedMotion = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end']
  })

  // Outro transition line
  const outroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: outroProgress } = useScroll({
    target: outroRef,
    offset: ['start end', 'end start']
  })
  const lineScale = useTransform(outroProgress, [0.3, 0.7], [0, 1])
  const textOp = useTransform(outroProgress, [0.6, 0.8], [0, 1])

  if (!projects || projects.length < 1) return null

  const primaryProject = projects.find((p) => p.slug === 'cyphr') ?? projects[0]
  const automationProject = projects.find((p) => p.slug === 'jobpilot') ?? projects[1]
  const dashboardProject = projects.find((p) => p.slug === 'eazyshop') ?? projects[2]

  return (
    <section className="bg-base border-y border-border">

      {/* Intro Sequence */}
      <div className="container-site pt-32 pb-16 md:pb-32">
        <RevealOnScroll>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-12 block w-fit border border-accent/20 px-5 py-2.5 bg-accent/5">
            Selected Builds
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-fg leading-[1.05] tracking-[-0.02em] max-w-5xl">
            REAL SYSTEMS.<br/>
            <span className="text-fg-muted">BUILT FOR REAL PROBLEMS.</span>
          </h2>
        </RevealOnScroll>
      </div>

      {/* Cinematic Featured Project (Desktop: Sticky Scroll | Mobile: Stacked) */}
      <div className="hidden lg:block relative h-[500vh] bg-base w-full" ref={scrollRef}>
         <div className="sticky top-0 h-screen w-full">
            <RAGCinematicWorld progress={scrollYProgress} project={primaryProject} reducedMotion={reducedMotion} />
         </div>
      </div>

      {/* Mobile Fallback for Featured Project */}
      <div className="block lg:hidden w-full relative border-y border-border/50 bg-surface/20">
         {/* Living visual representation for mobile */}
         <div className="w-full h-[60vh] relative overflow-hidden flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06)_0%,rgba(17,19,24,1)_70%)] border-b border-border/50">
            {/* Ambient Background Node Identifiers */}
            <div className="absolute top-6 left-6 font-mono text-[8px] text-cyan-400/30 tracking-widest pointer-events-none select-none">
              VECTOR_SPACE_01 // ACTIVE
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[8px] text-accent/30 tracking-widest pointer-events-none select-none">
              COSINE_SIM: 0.942
            </div>

            {/* Living Interactive RAG Terminal Box */}
            <div className="w-full max-w-sm bg-base/95 border border-cyan-400/30 shadow-[0_0_35px_rgba(34,211,238,0.12)] rounded-sm relative overflow-hidden">
               {/* Animated Scanning Beam */}
               {!reducedMotion && (
                 <motion.div
                   className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
                   animate={{ top: ['0%', '100%', '0%'] }}
                   transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                 />
               )}
               <div className="border-b border-border/50 p-3 flex items-center gap-2 bg-surface/40">
                 <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                 <div className="w-2 h-2 rounded-full bg-border/80" />
                 <span className="font-mono text-[9px] text-cyan-300 tracking-wider ml-auto uppercase font-semibold">
                   RAG INFERENCE CORE
                 </span>
               </div>
               <div className="p-6">
                 <div className="font-mono text-[9px] text-cyan-400 mb-2 uppercase tracking-widest flex items-center justify-between">
                   <span>Query Input</span>
                   <span className="text-fg-subtle text-[8px]">TOKEN_COUNT: 14</span>
                 </div>
                 <div className="border border-border/50 bg-surface/30 px-4 py-3 text-sm text-fg font-light mb-5">
                   Extract risk factors and summarize impact.
                 </div>
                 <div className="font-mono text-[9px] text-accent mb-2 uppercase tracking-widest">
                   Semantic Context Retrieved
                 </div>
                 <div className="border border-cyan-400/40 bg-cyan-950/40 p-2.5 text-[10px] font-mono text-cyan-200 mb-5 shadow-[0_0_15px_rgba(34,211,238,0.15)] flex items-center justify-between">
                   <span>DOC_Q3_COMPLIANCE_AUDIT</span>
                   <span className="text-[8px] text-cyan-400 font-bold">98.4% MATCH</span>
                 </div>
                 <div className="font-mono text-[9px] text-cyan-400 mb-2 uppercase tracking-widest">
                   Synthesized Response
                 </div>
                 <div className="text-sm text-fg-muted font-light leading-relaxed">
                   Based on [DOC_Q3_COMPLIANCE_AUDIT], the primary regulatory impact involves...
                   <span className="inline-block w-1.5 h-3.5 bg-cyan-400 animate-pulse ml-1.5 align-middle" />
                 </div>
               </div>
            </div>
         </div>
         {/* Mobile Text Content */}
         <div className="p-8 md:p-12 flex flex-col gap-10">
            <div>
               <span className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase block mb-4 border border-accent/30 px-3 py-1 bg-surface/50 w-fit">Featured System / 01</span>
               <h3 className="text-4xl font-light text-fg mb-4">{primaryProject.title}</h3>
               <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest pb-4 border-b border-border/30">{primaryProject.category} {'//'} {primaryProject.statusLabel}</div>
            </div>
            <div>
               <span className="font-mono text-[10px] text-cyan-400 tracking-[0.2em] uppercase block mb-4 border-l border-cyan-400 pl-3">The Problem</span>
               <p className="text-base text-fg-muted leading-relaxed font-light">{primaryProject.problem}</p>
            </div>
            <div>
               <span className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase block mb-4 border-l border-accent pl-3">Architecture</span>
               <p className="text-base text-fg-muted leading-relaxed font-light mb-8">{primaryProject.solution}</p>
               <div className="flex flex-wrap gap-2 mb-8">
                 {primaryProject.stack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 border border-border/50 bg-base/50 text-[9px] font-mono text-fg-subtle uppercase">{tech}</span>
                 ))}
               </div>
               <Link href={`/work/${primaryProject.slug}`} className="block w-fit font-mono text-xs text-cyan-400 border-b border-cyan-400/30 pb-1 uppercase tracking-widest">Explore System -{'>'}</Link>
            </div>
         </div>
      </div>

      {/* Secondary Worlds (Cinematic Split Layout) */}
      <div className="flex flex-col xl:flex-row min-h-screen border-y border-border/50">
         {/* World 1 (Automation - 60%) */}
         <div className="w-full xl:w-[60%] border-b xl:border-b-0 xl:border-r border-border/50 h-[80vh] xl:h-auto">
           {automationProject && (
             <AutomationWorld project={automationProject} reducedMotion={reducedMotion} />
           )}
         </div>
         {/* World 2 (Dashboard - 40%) */}
         <div className="w-full xl:w-[40%] h-[80vh] xl:h-auto">
           {dashboardProject && (
             <DashboardWorld project={dashboardProject} reducedMotion={reducedMotion} />
           )}
         </div>
      </div>

      {/* Outro Transition block leading to Why Us */}
      <div className="h-[50vh] md:h-[80vh] relative w-full flex flex-col items-center justify-end pb-32" ref={outroRef}>
         <motion.div className="w-[1px] bg-cyan-400 origin-top absolute top-0" style={{ height: '70%', scaleY: reducedMotion ? 1 : lineScale }} />
         <motion.div style={{ opacity: reducedMotion ? 1 : textOp }} className="flex flex-col items-center text-center mt-auto z-10">
            <span className="font-mono text-9xl text-fg/[0.03] tracking-tighter -mb-6 pointer-events-none">01</span>
            <span className="font-mono text-[10px] text-cyan-400 tracking-[0.3em] uppercase bg-base px-6">System Initialized</span>
         </motion.div>
      </div>

    </section>
  )
}
