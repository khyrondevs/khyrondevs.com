'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, MotionValue } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { services } from '@/lib/content/services'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

function FullStackVisual({ scrollYProgress, reducedMotion, forceStatic = false }: { scrollYProgress: MotionValue<number>, reducedMotion: boolean, forceStatic?: boolean }) {
  const spacing = useTransform(scrollYProgress, [0, 0.17], [60, 100])
  const bottomSpacing = useTransform(scrollYProgress, [0, 0.17], [-60, -100])
  const lineSpacingHeight = useTransform(scrollYProgress, [0, 0.17], [120, 200])
  
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
       <motion.div 
         className="relative w-48 h-48 md:w-64 md:h-64"
         style={{ transformStyle: 'preserve-3d', rotateX: 60, rotateZ: -30 }}
       >
         {/* Top UI Layer */}
         <motion.div 
           className="absolute inset-0 border border-cyan-400/40 bg-cyan-950/20 backdrop-blur-sm grid grid-cols-2 grid-rows-2 gap-2 p-3 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
           style={{ translateZ: (reducedMotion || forceStatic) ? 80 : spacing, transformStyle: 'preserve-3d' }}
         >
            <div className="border border-cyan-400/30 bg-cyan-400/10" />
            <div className="border border-cyan-400/30 bg-cyan-400/10" />
            <div className="col-span-2 border border-cyan-400/30 bg-cyan-400/10" />
         </motion.div>

         {/* Middle API Layer */}
         <motion.div 
           className="absolute inset-0 border border-accent/40 bg-accent/5 flex flex-col justify-between p-6"
           style={{ translateZ: 0, transformStyle: 'preserve-3d' }}
         >
            {!(reducedMotion || forceStatic) && (
              <>
                <motion.div className="h-[2px] w-full bg-accent shadow-[0_0_12px_rgba(59,130,246,1)]"
                  animate={{ y: [0, 150, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <motion.div className="h-[1px] w-full bg-accent/50"
                  animate={{ y: [150, 0, 150] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </>
            )}
         </motion.div>

         {/* Bottom DB Layer */}
         <motion.div 
           className="absolute inset-0 border border-accent/20 bg-surface/90 grid grid-cols-4 grid-rows-4"
           style={{ 
             translateZ: (reducedMotion || forceStatic) ? -80 : bottomSpacing,
             boxShadow: '0 0 60px rgba(59,130,246,0.15) inset',
             transformStyle: 'preserve-3d'
           }}
         >
           {Array.from({length: 16}).map((_, i) => (
              <div key={i} className="border border-accent/10 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-accent/40 rounded-full" />
              </div>
           ))}
         </motion.div>

         {/* Connecting vertical line */}
         <motion.div 
           className="absolute left-1/2 top-1/2 w-[2px] bg-gradient-to-b from-cyan-400 to-accent origin-top"
           style={{ 
              height: (reducedMotion || forceStatic) ? 160 : lineSpacingHeight,
              rotateX: 90, 
              translateZ: (reducedMotion || forceStatic) ? -80 : bottomSpacing,
              x: '-50%', y: '-50%',
              transformStyle: 'preserve-3d'
           }}
         />
       </motion.div>
    </div>
  )
}

// Visual 2: AI & RAG
function AiRagVisual({ reducedMotion, forceStatic = false }: { reducedMotion: boolean, forceStatic?: boolean }) {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center pointer-events-none">
       {/* Central Context Core */}
       <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-cyan-400 bg-cyan-950/80 shadow-[0_0_60px_rgba(34,211,238,0.4)_inset,0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center backdrop-blur-md">
          <span className="font-mono text-xs md:text-sm text-cyan-200 tracking-[0.2em] font-medium">CTX.GEN</span>
       </div>
       
       {/* Orbits */}
       <div className="absolute inset-8 md:inset-12 border border-accent/30 rounded-full" />
       <div className="absolute inset-0 border border-accent/20 rounded-full border-dashed" />
       <div className="absolute -inset-8 md:-inset-12 border border-accent/10 rounded-full" />

       {/* Flowing Data Fragments */}
       {!(reducedMotion || forceStatic) && (
         <>
           <motion.div 
             className="absolute top-0 left-1/2 w-10 h-6 border border-cyan-400/60 bg-cyan-950/80 flex items-center justify-center font-mono text-[9px] text-cyan-300 backdrop-blur-sm"
             animate={{ y: [0, 120], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
             transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
             style={{ x: '-50%' }}
           >SRC</motion.div>
           <motion.div 
             className="absolute bottom-0 left-1/2 w-10 h-6 border border-accent/60 bg-base flex items-center justify-center font-mono text-[9px] text-accent backdrop-blur-sm"
             animate={{ y: [0, -120], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
             transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
             style={{ x: '-50%' }}
           >IDX</motion.div>
           <motion.div 
             className="absolute top-1/2 left-0 w-10 h-6 border border-cyan-400/60 bg-cyan-950/80 flex items-center justify-center font-mono text-[9px] text-cyan-300 backdrop-blur-sm"
             animate={{ x: [0, 120], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
             transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
             style={{ y: '-50%' }}
           >VEC</motion.div>
           <motion.div 
             className="absolute top-1/2 right-0 w-10 h-6 border border-accent/60 bg-base flex items-center justify-center font-mono text-[9px] text-accent backdrop-blur-sm"
             animate={{ x: [0, -120], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
             transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
             style={{ y: '-50%' }}
           >RTR</motion.div>
         </>
       )}
    </div>
  )
}

// Visual 3: Workflow Automation
function AutomationVisual({ reducedMotion, forceStatic = false }: { reducedMotion: boolean, forceStatic?: boolean }) {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 pointer-events-none">
       {/* Circuit Paths */}
       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 10,50 L 30,50 L 30,20 L 70,20 L 70,50 L 90,50" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" />
          <path d="M 30,50 L 30,80 L 70,80 L 70,50" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" />
          <path d="M 50,20 L 50,80" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="0.5" strokeDasharray="2 2" />
          
          {!(reducedMotion || forceStatic) && (
            <>
              <motion.path 
                d="M 10,50 L 30,50 L 30,20 L 70,20 L 70,50 L 90,50" 
                fill="none" stroke="rgba(34,211,238,1)" strokeWidth="1.5" 
                strokeDasharray="100"
                animate={{ strokeDashoffset: [100, -100] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.8))' }}
              />
              <motion.path 
                d="M 30,50 L 30,80 L 70,80 L 70,50" 
                fill="none" stroke="rgba(59,130,246,1)" strokeWidth="1.5" 
                strokeDasharray="100"
                animate={{ strokeDashoffset: [100, -100] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 1.75 }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.8))' }}
              />
            </>
          )}
       </svg>
       
       {/* Nodes */}
       <div className="absolute top-[48%] left-[8%] w-5 h-5 border border-cyan-400 bg-cyan-950 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <div className="w-1.5 h-1.5 bg-cyan-400" />
       </div>
       <div className="absolute top-[18%] left-[28%] w-5 h-5 border border-accent bg-base flex items-center justify-center"><div className="w-1 h-1 bg-accent/50" /></div>
       <div className="absolute top-[18%] left-[68%] w-5 h-5 border border-accent bg-base flex items-center justify-center"><div className="w-1 h-1 bg-accent/50" /></div>
       <div className="absolute top-[78%] left-[28%] w-5 h-5 border border-accent bg-base flex items-center justify-center"><div className="w-1 h-1 bg-accent/50" /></div>
       <div className="absolute top-[78%] left-[68%] w-5 h-5 border border-accent bg-base flex items-center justify-center"><div className="w-1 h-1 bg-accent/50" /></div>
       
       <div className="absolute top-[48%] left-[88%] w-5 h-5 border border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.6)] flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-300 rounded-full" />
       </div>
    </div>
  )
}

// Visual 4: Custom Software
function CustomVisual({ scrollYProgress, reducedMotion, forceStatic = false }: { scrollYProgress: MotionValue<number>, reducedMotion: boolean, forceStatic?: boolean }) {
  const rotate = useTransform(scrollYProgress, [0.60, 0.75], [-45, 0])

  const p1X = useTransform(scrollYProgress, [0.60, 0.75], [-80, 0])
  const p1Y = useTransform(scrollYProgress, [0.60, 0.75], [-80, 0])

  const p2X = useTransform(scrollYProgress, [0.60, 0.75], [80, 0])
  const p2Y = useTransform(scrollYProgress, [0.60, 0.75], [-80, 0])

  const p3X = useTransform(scrollYProgress, [0.60, 0.75], [-80, 0])
  const p3Y = useTransform(scrollYProgress, [0.60, 0.75], [80, 0])

  const p4X = useTransform(scrollYProgress, [0.60, 0.75], [80, 0])
  const p4Y = useTransform(scrollYProgress, [0.60, 0.75], [80, 0])

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative w-40 h-40 md:w-48 md:h-48"
        style={{ rotate: (reducedMotion || forceStatic) ? 0 : rotate }}
      >
        {/* Center Core */}
        <div className="absolute inset-0 border-2 border-cyan-400/50 bg-cyan-950/20 backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.15)] flex items-center justify-center">
          <div className="w-1/2 h-1/2 border border-accent/30 rotate-45" />
        </div>

        {/* Fragment 1 */}
        <motion.div
          className="absolute -top-6 -left-6 w-16 h-16 border border-accent/60 bg-accent/10 backdrop-blur-sm"
          style={{ x: (reducedMotion || forceStatic) ? 0 : p1X, y: (reducedMotion || forceStatic) ? 0 : p1Y }}
        />
        {/* Fragment 2 */}
        <motion.div
          className="absolute -top-6 -right-6 w-24 h-12 border border-accent/60 bg-accent/10 backdrop-blur-sm"
          style={{ x: (reducedMotion || forceStatic) ? 0 : p2X, y: (reducedMotion || forceStatic) ? 0 : p2Y }}
        />
        {/* Fragment 3 */}
        <motion.div
          className="absolute -bottom-6 -left-6 w-12 h-24 border border-accent/60 bg-accent/10 backdrop-blur-sm"
          style={{ x: (reducedMotion || forceStatic) ? 0 : p3X, y: (reducedMotion || forceStatic) ? 0 : p3Y }}
        />
        {/* Fragment 4 */}
        <motion.div
          className="absolute -bottom-6 -right-6 w-16 h-16 border border-cyan-400 bg-cyan-400/15 backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center justify-center"
          style={{ x: (reducedMotion || forceStatic) ? 0 : p4X, y: (reducedMotion || forceStatic) ? 0 : p4Y }}
        >
          <div className="w-2 h-2 bg-cyan-300" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// Visual 5: Mobile App Development (iOS & Android)
function MobileVisual({
  scrollYProgress,
  reducedMotion,
  forceStatic = false,
}: {
  scrollYProgress: MotionValue<number>
  reducedMotion: boolean
  forceStatic?: boolean
}) {
  const deviceRotate = useTransform(scrollYProgress, [0.83, 0.96], [-12, 0])
  const deviceScale = useTransform(scrollYProgress, [0.83, 0.96], [0.88, 1])

  return (
    <div className="relative w-72 h-72 md:w-[22rem] md:h-[22rem] flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative w-64 md:w-72 rounded-3xl border border-cyan-400/40 bg-surface/90 backdrop-blur-md p-4 shadow-[0_0_50px_rgba(34,211,238,0.15)] flex flex-col gap-4 overflow-hidden"
        style={{
          rotateY: (reducedMotion || forceStatic) ? 0 : deviceRotate,
          scale: (reducedMotion || forceStatic) ? 1 : deviceScale,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient Top Screen Dynamic Island */}
        <div className="flex items-center justify-between border-b border-border/60 pb-2 px-1">
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-fg-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>120Hz PROMOTION</span>
          </div>
          <div className="w-12 h-3 bg-black rounded-full border border-border/80 flex items-center justify-end pr-1.5">
            <div className="w-1 h-1 rounded-full bg-cyan-400/70" />
          </div>
          <span className="font-mono text-[9px] text-cyan-400 font-semibold tracking-wider">
            DUAL-OS
          </span>
        </div>

        {/* Dual Platform Stage: Android & Apple */}
        <div className="grid grid-cols-2 gap-3 py-1 items-center">
          {/* Left: Android Bot with Animated Wave */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.12)_inset]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 70 70" className="w-full h-full overflow-visible drop-shadow-[0_0_10px_rgba(61,220,132,0.6)]">
                {/* Antennae */}
                <line x1="24" y1="18" x2="19" y2="10" stroke="#3DDC84" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="42" y1="18" x2="47" y2="10" stroke="#3DDC84" strokeWidth="2.5" strokeLinecap="round" />

                {/* Head Dome */}
                <path d="M 17,28 A 16,16 0 0 1 49,28 Z" fill="#3DDC84" />

                {/* Eyes with subtle blink */}
                {!(reducedMotion || forceStatic) ? (
                  <>
                    <motion.circle cx="26" cy="22" r="1.8" fill="#07090e" animate={{ opacity: [1, 1, 0, 1] }} transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.94, 1] }} />
                    <motion.circle cx="40" cy="22" r="1.8" fill="#07090e" animate={{ opacity: [1, 1, 0, 1] }} transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.94, 1] }} />
                  </>
                ) : (
                  <>
                    <circle cx="26" cy="22" r="1.8" fill="#07090e" />
                    <circle cx="40" cy="22" r="1.8" fill="#07090e" />
                  </>
                )}

                {/* Resting Left Arm */}
                <rect x="52.5" y="32" width="4.5" height="16" rx="2.2" fill="#3DDC84" />

                {/* Torso */}
                <rect x="17" y="32" width="32" height="22" rx="4" fill="#3DDC84" />

                {/* Legs */}
                <rect x="23" y="55" width="4.5" height="10" rx="2.2" fill="#3DDC84" />
                <rect x="38" y="55" width="4.5" height="10" rx="2.2" fill="#3DDC84" />

                {/* Right Arm: THE FRIENDLY HIGH-TECH WAVE (Raised Top) */}
                <motion.g
                  style={{ transformOrigin: '11px 35px' }}
                  animate={!(reducedMotion || forceStatic) ? {
                    rotate: [-20, -42, -18, -42, -18, -20],
                  } : { rotate: -30 }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 0.3,
                  }}
                >
                  <rect x="8.5" y="18" width="4.5" height="17" rx="2.2" fill="#3DDC84" />
                  {/* Palm Beacon Dot */}
                  <circle cx="10.7" cy="19" r="1.2" fill="#a7f3d0" />
                </motion.g>
              </svg>
            </div>
            <span className="font-mono text-[9px] font-semibold tracking-wider text-emerald-400 uppercase">
              Android · Kotlin
            </span>
          </div>

          {/* Right: Bitten Apple Logo with Scanning Laser & Haptic Rings */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-cyan-400/30 bg-cyan-950/20 shadow-[0_0_25px_rgba(34,211,238,0.12)_inset] relative overflow-hidden">
            {/* Haptic Wave Rings */}
            {!(reducedMotion || forceStatic) && (
              <>
                <motion.div
                  className="absolute inset-4 rounded-full border border-cyan-400/30 pointer-events-none"
                  animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border border-accent/30 pointer-events-none"
                  animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 1.3 }}
                />
              </>
            )}

            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Vertical Laser Scanline across Apple logo */}
              {!(reducedMotion || forceStatic) && (
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,1)] z-10 pointer-events-none"
                  animate={{
                    top: ['8%', '88%', '8%'],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-fg drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                {/* Apple Leaf with subtle micro-hover */}
                <motion.path
                  d="M15.97 4.37c.62-.75 1.04-1.8 1.01-2.87-.92.04-2.02.62-2.67 1.38-.57.66-.99 1.72-.94 2.76 1.02.08 2.05-.55 2.6-1.27z"
                  animate={!(reducedMotion || forceStatic) ? { y: [0, -1, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Apple Body with Iconic Bite */}
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83" />
              </svg>
            </div>
            <span className="font-mono text-[9px] font-semibold tracking-wider text-cyan-300 uppercase">
              iOS · Swift
            </span>
          </div>
        </div>

        {/* Bottom Platform Conduits & Telemetry */}
        <div className="border-t border-border/60 pt-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[9px] text-fg-muted">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 bg-cyan-400 rounded-full" />
              <span>FLUTTER / REACT NATIVE</span>
            </span>
            <span className="text-cyan-400">PARITY 100%</span>
          </div>
          <div className="w-full h-1 bg-surface rounded-full overflow-hidden border border-border/40">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-accent"
              animate={!(reducedMotion || forceStatic) ? { x: ['-100%', '100%'] } : { width: '100%' }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Crossfade opacities for the 5 visuals across the 500vh container (400vh scrollable)
  // Centers: SYS.01 @ 0.00 | SYS.02 @ 0.25 | SYS.03 @ 0.50 | SYS.04 @ 0.75 | SYS.05 @ 1.00
  // Every range spans strictly [0, ..., 1] to prevent WAAPI implicit keyframe extrapolation
  const v1Op = useTransform(scrollYProgress, [0, 0.08, 0.17, 1], [1, 1, 0, 0])
  const v2Op = useTransform(scrollYProgress, [0, 0.08, 0.17, 0.33, 0.42, 1], [0, 0, 1, 1, 0, 0])
  const v3Op = useTransform(scrollYProgress, [0, 0.33, 0.42, 0.58, 0.67, 1], [0, 0, 1, 1, 0, 0])
  const v4Op = useTransform(scrollYProgress, [0, 0.58, 0.67, 0.83, 0.92, 1], [0, 0, 1, 1, 0, 0])
  const v5Op = useTransform(scrollYProgress, [0, 0.83, 0.92, 1], [0, 0, 1, 1])

  return (
    <section className="bg-base border-y border-border relative">
      {/* Intro Block */}
      <div className="section-padding container-site max-w-5xl relative z-10 border-b border-border/50">
        <RevealOnScroll>
          <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between">
            <div className="max-w-2xl">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-6 block w-fit border border-accent/20 px-4 py-2 bg-accent/5">
                System Architecture
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-fg leading-[1.05] tracking-[-0.02em]">
                What we build.
              </h2>
            </div>
            <p className="text-lg md:text-xl text-fg-muted font-light leading-relaxed max-w-md md:text-right pb-2">
              We design and engineer custom software, mobile apps, AI systems, and automation around real problems. We do not ship templates.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      {/* Desktop Sticky Scroll Experience (Hidden on Mobile) */}
      <div ref={containerRef} className="hidden md:flex relative h-[500vh] bg-base w-full">
        {/* Left: Sticky Visual Worlds */}
        <div className="w-1/2 sticky top-0 h-screen border-r border-border/50 overflow-hidden bg-surface/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: v1Op }}>
            <FullStackVisual scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
          </motion.div>

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: v2Op }}>
            <AiRagVisual reducedMotion={reducedMotion} />
          </motion.div>

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: v3Op }}>
            <AutomationVisual reducedMotion={reducedMotion} />
          </motion.div>

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: v4Op }}>
            <CustomVisual scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
          </motion.div>

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: v5Op }}>
            <MobileVisual scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
          </motion.div>
        </div>

        {/* Right: Scrolling Text Blocks */}
        <div className="w-1/2 flex flex-col">
          {services.map((service, index) => (
            <div key={service.id} className="h-screen flex flex-col justify-center px-12 lg:px-24 xl:px-32 relative">
              <div className="font-mono text-xs text-accent tracking-[0.2em] mb-8 block border border-accent/30 px-3 py-1.5 bg-accent/5 w-fit">
                SYS.0{index + 1}
              </div>
              <h3 className="text-4xl lg:text-5xl font-light text-fg mb-6 leading-[1.1]">
                {service.title}
              </h3>
              <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-8 border-b border-border/50 pb-4 inline-block w-full">
                {service.tagline}
              </div>
              <p className="text-lg lg:text-xl text-fg-muted font-light mb-12 leading-relaxed max-w-xl">
                {service.description}
              </p>
              <div className="flex flex-col gap-5 mb-16">
                {service.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-2 w-1.5 h-1.5 bg-cyan-400 rounded-none shadow-[0_0_8px_rgba(34,211,238,0.8)] shrink-0" />
                    <span className="text-sm md:text-base font-mono text-fg-subtle tracking-wide">{outcome}</span>
                  </div>
                ))}
              </div>
              <Link href={service.href} className="group flex items-center gap-3 text-sm font-mono text-accent hover:text-cyan-300 transition-colors w-fit">
                <span className="border-b border-accent/40 group-hover:border-cyan-300/60 pb-1 transition-colors uppercase tracking-wider">
                  Explore {service.title.split(' ')[0]}
                </span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">{'->'}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stacked Experience (Hidden on Desktop) */}
      <div className="block md:hidden w-full bg-base">
        {services.map((service, index) => (
          <div key={service.id} className="w-full flex flex-col border-b border-border/50 last:border-b-0 pb-16 pt-8">
            {/* Mobile Visual */}
            <div className="w-full h-80 relative overflow-hidden bg-surface/30 mb-8 border-y border-border/50 flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              {index === 0 && <FullStackVisual scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} forceStatic={true} />}
              {index === 1 && <AiRagVisual reducedMotion={reducedMotion} forceStatic={true} />}
              {index === 2 && <AutomationVisual reducedMotion={reducedMotion} forceStatic={true} />}
              {index === 3 && <CustomVisual scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} forceStatic={true} />}
              {index === 4 && <MobileVisual scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} forceStatic={true} />}
            </div>

            {/* Mobile Text */}
            <div className="px-6 relative">
              <div className="font-mono text-[10px] text-accent tracking-[0.2em] mb-6 block border border-accent/30 px-3 py-1.5 bg-accent/5 w-fit">
                SYS.0{index + 1}
              </div>
              <h3 className="text-3xl font-light text-fg mb-4 leading-tight">
                {service.title}
              </h3>
              <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-6 border-b border-border/50 pb-4">
                {service.tagline}
              </div>
              <p className="text-base text-fg-muted font-light mb-8 leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-col gap-4 mb-10">
                {service.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    <span className="text-xs font-mono text-fg-subtle tracking-wide">{outcome}</span>
                  </div>
                ))}
              </div>
              <Link href={service.href} className="group flex items-center gap-2 text-xs font-mono text-accent hover:text-cyan-300 transition-colors w-fit">
                <span className="border-b border-accent/40 group-hover:border-cyan-300/60 pb-1 transition-colors uppercase tracking-wider">
                  Explore {service.title.split(' ')[0]}
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">{'->'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
