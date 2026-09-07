'use client'

import { Code2, Layers, Brain, Workflow } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const phases = [
  {
    id: 'IDEA',
    title: 'Conceptual Architecture',
    desc: 'Translating business logic into sound engineering primitives.',
    icon: Brain,
    details: ['Data Modeling', 'System Topology', 'Interface Contracts'],
  },
  {
    id: 'IMPLEMENTATION',
    title: 'Full-Stack Execution',
    desc: 'React, Node.js, PostgreSQL. Built for performance and correctness.',
    icon: Code2,
    details: ['Typesafe APIs', 'Component Systems', 'State Management'],
  },
  {
    id: 'SYSTEM',
    title: 'AI & Data Pipelines',
    desc: 'Integrating retrieval-augmented generation and async workflows.',
    icon: Workflow,
    details: ['Vector Stores', 'Event Queues', 'LLM Orchestration'],
  },
  {
    id: 'OUTCOME',
    title: 'Production Infrastructure',
    desc: 'Shipped to scale with deep observability and CI/CD.',
    icon: Layers,
    details: ['Docker/K8s', 'Edge Caching', 'Telemetry'],
  },
]

export function CapabilitySection() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="section-padding bg-base relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <div className="w-[1px] h-full bg-fg" />
        <div className="absolute w-full h-[1px] bg-fg" />
        <div className="absolute w-full h-[1px] bg-fg rotate-45" />
        <div className="absolute w-full h-[1px] bg-fg -rotate-45" />
        <div className="w-[60vw] h-[60vw] rounded-full border border-fg absolute" />
      </div>

      <div className="container-site relative z-10 max-w-5xl mx-auto">
        <RevealOnScroll>
          <div className="mb-32 text-center md:text-left flex flex-col items-center md:items-start">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-6 block border border-accent/20 px-4 py-2 bg-accent/5">
              Engineering Capability
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-fg leading-[1.05] tracking-[-0.03em]">
              The entire stack.
              <br />
              <span className="text-fg-muted">From concept to production.</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="relative">
          {/* Central Connecting Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-border/50 -translate-x-1/2 hidden md:block" />
          
          <div className="flex flex-col gap-16 md:gap-24 relative">
            {phases.map((phase, idx) => {
              const isEven = idx % 2 === 0
              return (
                <RevealOnScroll key={phase.id} delay={0.1}>
                  <div className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    
                    {/* Visual Node */}
                    <div className="w-full md:w-1/2 flex justify-start md:justify-center relative">
                      {/* Connection to center line */}
                      <div className={`absolute top-1/2 h-[1px] bg-border/50 hidden md:block w-32 ${isEven ? '-right-16' : '-left-16'}`} />
                      
                      <div className="relative w-48 h-48 group">
                        <div className="absolute inset-0 border border-border/50 bg-surface/30 backdrop-blur-sm flex items-center justify-center transition-all duration-700 group-hover:border-accent/40 group-hover:bg-accent/5">
                          <phase.icon className="w-8 h-8 text-fg-subtle group-hover:text-accent transition-colors duration-500" strokeWidth={1} />
                        </div>
                        {/* Decorative corners */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-accent/40" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-accent/40" />
                        
                        {/* Animated Scanning Line */}
                        {!reducedMotion && (
                          <motion.div 
                            className="absolute left-0 top-0 w-full h-[1px] bg-accent/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, ease: 'linear', repeat: Infinity, delay: idx * 0.5 }}
                          />
                        )}
                        
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 font-mono text-[10px] text-accent/50 uppercase tracking-widest whitespace-nowrap">
                          Node: {phase.id}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2 flex flex-col items-start md:items-start text-left">
                      <span className="font-mono text-xs text-accent tracking-widest uppercase mb-4 opacity-70">
                        0{idx + 1}
                      </span>
                      <h3 className="text-3xl font-light text-fg mb-4">{phase.title}</h3>
                      <p className="text-fg-muted font-light leading-relaxed mb-6">
                        {phase.desc}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        {phase.details.map((detail) => (
                          <span key={detail} className="font-mono text-[10px] text-fg-subtle border border-border/50 px-3 py-1.5 uppercase tracking-wider bg-surface/20">
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
