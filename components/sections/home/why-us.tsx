'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

function WhyUsCinematic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ['start start', 'end end'] 
  })
  
  // INTRO (0.0 -> 0.15)
  const introOp = useTransform(scrollYProgress, [0.0, 0.05, 0.1, 0.15], [0, 1, 1, 0])
  const introY = useTransform(scrollYProgress, [0.0, 0.15], [20, -50])

  // 01 ENGINEERING-FIRST (0.15 -> 0.35)
  const s1Op = useTransform(scrollYProgress, [0.15, 0.2, 0.3, 0.35], [0, 1, 1, 0])
  const s1Y = useTransform(scrollYProgress, [0.15, 0.2, 0.3, 0.35], [50, 0, 0, -50])

  // 02 BUILT AROUND THE PROBLEM (0.35 -> 0.55)
  const s2Op = useTransform(scrollYProgress, [0.35, 0.4, 0.5, 0.55], [0, 1, 1, 0])
  const s2X = useTransform(scrollYProgress, [0.35, 0.4, 0.5, 0.55], [100, 0, 0, -100])
  const s2LineW = useTransform(scrollYProgress, [0.35, 0.45], ["0%", "100%"])

  // 03 PRODUCTION-MINDED (0.55 -> 0.75)
  const s3Op = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0])
  const s3Scale = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [1.2, 1, 1, 0.9])
  const s3GlowOp = useTransform(scrollYProgress, [0.55, 0.6, 0.7], [0, 1, 0])

  // 04 NO UNNECESSARY COMPLEXITY (0.75 -> 0.95)
  const s4Op = useTransform(scrollYProgress, [0.75, 0.8, 0.9, 0.95], [0, 1, 1, 0])
  const s4Scale = useTransform(scrollYProgress, [0.75, 0.8, 0.9, 0.95], [0.8, 1, 1, 1.1])
  const s4Z = useTransform(scrollYProgress, [0.75, 0.8, 0.9, 0.95], [-200, 0, 0, 100])

  // OUTRO TRANSITION (0.95 -> 1.0)
  const outroOp = useTransform(scrollYProgress, [0.93, 0.98], [0, 1])
  const outroLineH = useTransform(scrollYProgress, [0.95, 1], ["0%", "100%"])

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-base">
       <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* INTRO SCENE */}
          <motion.div style={{ opacity: introOp, y: introY }} className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none">
             <span className="font-mono text-xs text-accent tracking-[0.4em] uppercase mb-12 block border border-accent/20 px-4 py-2 bg-accent/5">
                [ Manifesto ]
             </span>
             <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-light text-fg leading-[1.05] tracking-[-0.04em]">
                THE TECHNOLOGY<br/>
                ISN&apos;T THE HARD PART.<br/><br/>
                <span className="text-fg-muted italic">THE RIGHT DECISIONS ARE.</span>
             </h2>
          </motion.div>

          {/* SCENE 01: ENGINEERING-FIRST */}
          <motion.div style={{ opacity: s1Op, y: s1Y }} className="absolute inset-0 flex flex-col items-start justify-center p-12 lg:p-32 z-20 pointer-events-none">
             <div className="absolute right-0 top-0 bottom-0 text-[35vw] font-light text-fg/[0.02] leading-none flex items-center select-none pointer-events-none -mr-12">
               01
             </div>
             <div className="relative z-10 w-full max-w-5xl">
                <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-12 flex items-center gap-4">
                   <span className="w-12 h-px bg-accent/50" />
                   Principle 01 / 04
                </div>
                <h3 className="text-7xl md:text-[8rem] lg:text-[10rem] font-light text-fg mb-16 tracking-tighter leading-none">
                   ENGINEERING-<br/>FIRST.
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 border-t border-border/50 pt-12">
                   <p className="text-3xl lg:text-4xl font-light text-fg-muted leading-tight text-balance">
                     We think in systems,<br/>not isolated screens.
                   </p>
                   <p className="text-lg lg:text-xl font-light text-fg-subtle leading-relaxed text-balance">
                     Architecture and technical decisions come before tools and aesthetics. We design systems that are correct before they are impressive.
                   </p>
                </div>
             </div>
          </motion.div>

          {/* SCENE 02: BUILT AROUND THE PROBLEM */}
          <motion.div style={{ opacity: s2Op, x: s2X }} className="absolute inset-0 flex flex-col items-center justify-center p-12 lg:p-32 text-center z-30 pointer-events-none">
             <motion.div style={{ width: s2LineW }} className="absolute top-1/2 left-0 h-px bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-0 origin-left" />
             <div className="relative z-10 bg-base p-12 md:p-20 border border-border/50 max-w-6xl shadow-2xl">
                <div className="font-mono text-[10px] text-fg-subtle tracking-[0.2em] uppercase mb-8 block">
                   Principle 02
                </div>
                <h3 className="text-6xl md:text-8xl lg:text-9xl font-light text-fg mb-12 tracking-tighter uppercase leading-[0.9]">
                   BUILT AROUND<br/>THE PROBLEM.
                </h3>
                <p className="text-2xl lg:text-3xl font-light text-fg-muted max-w-3xl mx-auto leading-relaxed text-balance">
                   The technology serves the problem — not the other way around. No template starts. We map the actual workflow, constraints, and edge cases before proposing a solution.
                </p>
             </div>
          </motion.div>

          {/* SCENE 03: PRODUCTION-MINDED */}
          <motion.div style={{ opacity: s3Op, scale: s3Scale }} className="absolute inset-0 flex flex-col items-end justify-center p-12 lg:p-32 text-right z-40 pointer-events-none">
             <motion.div style={{ opacity: s3GlowOp }} className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] z-0" />
             <div className="relative z-10 max-w-5xl">
                <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-10 inline-flex items-center gap-4">
                   Principle 03 <span className="w-12 h-px bg-accent/50" />
                </div>
                <h3 className="text-7xl md:text-[8rem] lg:text-[10rem] font-light text-fg mb-16 tracking-tighter leading-none">
                   PRODUCTION-<br/>MINDED.
                </h3>
                <p className="text-3xl lg:text-5xl font-light text-fg mb-10 leading-[1.1] text-balance">
                   A prototype that never survives contact with reality is not the finish line.
                </p>
                <p className="text-xl lg:text-2xl font-light text-fg-muted leading-relaxed ml-auto max-w-2xl text-balance">
                   What you get is production-quality code — tested, observed, documented, and owned by your team.
                </p>
             </div>
          </motion.div>

          {/* SCENE 04: NO UNNECESSARY COMPLEXITY */}
          <motion.div style={{ opacity: s4Op, scale: s4Scale, translateZ: s4Z, perspective: '1200px' }} className="absolute inset-0 flex flex-col items-center justify-center p-12 lg:p-32 z-50 pointer-events-none transform-style-3d">
             <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center gap-16 md:gap-32">
                <div className="flex-1 text-left flex justify-end">
                   <h3 className="text-[15rem] md:text-[20rem] lg:text-[25rem] font-light text-fg leading-none tracking-tighter">
                      NO.
                   </h3>
                </div>
                <div className="flex-1 text-left border-l border-border/50 pl-12 md:pl-20 py-8">
                   <div className="space-y-6 mb-16 font-mono text-sm lg:text-base text-cyan-400 uppercase tracking-[0.2em] leading-loose">
                      <div className="flex items-center gap-4"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> NO EXTRA LAYERS.</div>
                      <div className="flex items-center gap-4"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> NO EXTRA ABSTRACTIONS.</div>
                      <div className="flex items-center gap-4"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> NO TECH FOR ITS OWN SAKE.</div>
                   </div>
                   <div className="font-mono text-[10px] text-fg-subtle tracking-[0.2em] uppercase mb-6">
                      Principle 04
                   </div>
                   <h4 className="text-4xl lg:text-5xl font-light text-fg mb-8">
                      No unnecessary complexity.
                   </h4>
                   <p className="text-xl lg:text-2xl font-light text-fg-muted leading-relaxed text-balance">
                      Complexity should solve a problem. Never exist for its own sake. You do not pay for features you will not use or libraries that add weight without adding value.
                   </p>
                </div>
             </div>
          </motion.div>

          {/* OUTRO TRANSITION TO PROCESS */}
          <motion.div style={{ opacity: outroOp }} className="absolute inset-0 flex flex-col items-center justify-end z-0 pointer-events-none">
             <motion.div className="w-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] origin-top" style={{ height: outroLineH }} />
          </motion.div>

       </div>
    </div>
  )
}

function WhyUsStatic() {
  return (
    <div className="bg-base border-t border-border/50 flex flex-col">
       
       {/* INTRO */}
       <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 md:p-12 border-b border-border/30">
          <RevealOnScroll>
            <span className="font-mono text-[10px] md:text-xs text-accent tracking-[0.4em] uppercase mb-12 block border border-accent/20 px-4 py-2 bg-accent/5 mx-auto w-fit">
               [ Manifesto ]
            </span>
            <h2 className="text-4xl md:text-6xl font-light text-fg leading-[1.05] tracking-[-0.04em]">
               THE TECHNOLOGY<br/>
               ISN&apos;T THE HARD PART.<br/><br/>
               <span className="text-fg-muted italic">THE RIGHT DECISIONS ARE.</span>
            </h2>
          </RevealOnScroll>
       </div>

       {/* SCENE 01 */}
       <div className="relative flex flex-col items-start justify-center p-8 md:p-24 border-b border-border/30 min-h-[90vh] overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[40vw] font-light text-fg/[0.03] leading-none pointer-events-none select-none">
            01
          </div>
          <div className="relative z-10 w-full max-w-4xl">
             <RevealOnScroll>
               <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-10 flex items-center gap-4">
                  <span className="w-8 h-px bg-accent/50" />
                  Principle 01 / 04
               </div>
               <h3 className="text-6xl md:text-8xl font-light text-fg mb-12 tracking-tighter leading-none">
                  ENGINEERING-<br/>FIRST.
               </h3>
               <div className="flex flex-col gap-8 border-t border-border/50 pt-10">
                  <p className="text-2xl md:text-4xl font-light text-fg-muted leading-tight">
                    We think in systems,<br/>not isolated screens.
                  </p>
                  <p className="text-base md:text-xl font-light text-fg-subtle leading-relaxed">
                    Architecture and technical decisions come before tools and aesthetics. We design systems that are correct before they are impressive.
                  </p>
               </div>
             </RevealOnScroll>
          </div>
       </div>

       {/* SCENE 02 */}
       <div className="relative flex flex-col items-start justify-center p-8 md:p-24 border-b border-border/30 min-h-[90vh] bg-surface/10">
          <div className="relative z-10 w-full max-w-5xl">
             <RevealOnScroll>
               <div className="font-mono text-[10px] text-fg-subtle tracking-[0.2em] uppercase mb-8 block">
                  Principle 02
               </div>
               <h3 className="text-5xl md:text-7xl font-light text-fg mb-10 tracking-tighter uppercase leading-[1.0]">
                  BUILT AROUND<br/>THE PROBLEM.
               </h3>
               <div className="w-full max-w-2xl h-px bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] mb-10" />
               <p className="text-xl md:text-3xl font-light text-fg-muted leading-relaxed">
                  The technology serves the problem — not the other way around. No template starts. We map the actual workflow, constraints, and edge cases before proposing a solution.
               </p>
             </RevealOnScroll>
          </div>
       </div>

       {/* SCENE 03 */}
       <div className="relative flex flex-col items-start md:items-end justify-center p-8 md:p-24 border-b border-border/30 min-h-[90vh] text-left md:text-right overflow-hidden">
          <div className="absolute right-0 md:right-1/4 top-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-accent/10 rounded-full blur-[80px] md:blur-[120px] z-0 pointer-events-none" />
          <div className="relative z-10 w-full max-w-4xl">
             <RevealOnScroll>
               <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-8 flex items-center md:justify-end gap-4">
                  Principle 03 <span className="w-8 h-px bg-accent/50 hidden md:block" />
               </div>
               <h3 className="text-6xl md:text-8xl font-light text-fg mb-12 tracking-tighter leading-none">
                  PRODUCTION-<br/>MINDED.
               </h3>
               <p className="text-3xl md:text-4xl font-light text-fg mb-8 leading-[1.1]">
                  A prototype that never survives contact with reality is not the finish line.
               </p>
               <p className="text-lg md:text-xl font-light text-fg-muted leading-relaxed md:ml-auto max-w-2xl">
                  What you get is production-quality code — tested, observed, documented, and owned by your team.
               </p>
             </RevealOnScroll>
          </div>
       </div>

       {/* SCENE 04 */}
       <div className="relative flex flex-col items-center justify-center p-8 md:p-24 min-h-screen bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.03)_0%,transparent_100%)]">
          <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-24">
             <div className="flex-none">
                <h3 className="text-[10rem] md:text-[14rem] font-light text-fg leading-none tracking-tighter">
                   NO.
                </h3>
             </div>
             <div className="flex-1 md:border-l md:border-border/50 md:pl-16">
                <RevealOnScroll>
                  <div className="space-y-4 mb-12 font-mono text-[10px] md:text-xs text-cyan-400 uppercase tracking-[0.2em] leading-loose">
                     <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> NO EXTRA LAYERS.</div>
                     <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> NO EXTRA ABSTRACTIONS.</div>
                     <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> NO TECH FOR ITS OWN SAKE.</div>
                  </div>
                  <div className="font-mono text-[10px] text-fg-subtle tracking-[0.2em] uppercase mb-4">
                     Principle 04
                  </div>
                  <h4 className="text-3xl md:text-4xl font-light text-fg mb-6">
                     No unnecessary complexity.
                  </h4>
                  <p className="text-lg md:text-xl font-light text-fg-muted leading-relaxed">
                     Complexity should solve a problem. Never exist for its own sake. You do not pay for features you will not use or libraries that add weight without adding value.
                  </p>
                </RevealOnScroll>
             </div>
          </div>
       </div>
       
       {/* OUTRO LINE FOR MOBILE/STATIC */}
       <div className="h-32 w-full flex justify-center border-t border-border/30">
          <motion.div
            className="w-[1px] h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
       </div>
    </div>
  )
}

export function WhyUsSection() {
  return (
    <>
      <div className="hidden md:block md:motion-reduce:hidden">
         <WhyUsCinematic />
      </div>
      <div className="block md:hidden md:motion-reduce:block">
         <WhyUsStatic />
      </div>
    </>
  )
}
