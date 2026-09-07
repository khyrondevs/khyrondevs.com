'use client'

import Link from 'next/link'
import { Globe, Brain, Workflow, Code2 } from 'lucide-react'
import { services } from '@/lib/content/services'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Globe,
  Brain,
  Workflow,
  Code2,
}

function VisualWorld({ id }: { id: string }) {
  const reducedMotion = useReducedMotion()
  
  if (reducedMotion) return null

  switch(id) {
    case 'web-applications': // Full-Stack
      return (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden bg-surface/80 flex items-center justify-center">
          <motion.div 
            className="w-full h-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Abstract architecture layers */}
            <div className="absolute inset-10 border border-accent/20 flex flex-col gap-px bg-accent/5">
              <motion.div animate={{ height: ['20%', '30%', '20%'] }} transition={{ duration: 4, repeat: Infinity }} className="w-full bg-accent/10 border-b border-accent/20" />
              <div className="flex-1 flex gap-px">
                <div className="flex-1 bg-accent/5 border-r border-accent/20 flex flex-col gap-4 p-4">
                  {Array.from({length: 4}).map((_, i) => (
                    <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} className="h-2 w-3/4 bg-accent/20" />
                  ))}
                </div>
                <div className="w-1/3 bg-accent/10 relative overflow-hidden">
                  <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    case 'ai-rag': // AI & RAG
      return (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden bg-surface/80 flex items-center justify-center">
          <motion.div 
            className="w-full h-full relative"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="absolute top-1/2 left-1/4 w-32 h-32 -translate-y-1/2 border border-accent/30 rounded-full flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="w-24 h-24 border border-dashed border-accent/40 rounded-full" />
            </div>
            
            <div className="absolute top-1/2 right-1/4 w-32 h-32 -translate-y-1/2 border border-accent/30 flex items-center justify-center bg-accent/5">
              <motion.div animate={{ scale: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity }} className="w-16 h-16 bg-accent/10 flex items-center justify-center">
                 <div className="w-8 h-8 bg-accent/20" />
              </motion.div>
            </div>
            
            {/* Flowing particles/data */}
            {Array.from({length: 5}).map((_, i) => (
              <motion.div 
                key={i}
                className="absolute top-1/2 left-[calc(25%+4rem)] h-[1px] bg-accent/60 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                animate={{ width: ['0px', '200px', '0px'], left: ['calc(25%+4rem)', 'calc(25%+4rem)', 'calc(75%-4rem)'] }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ top: `calc(50% + ${(i - 2) * 12}px)` }}
              />
            ))}
          </motion.div>
        </div>
      )
    case 'workflow-automation': // Automation
      return (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden bg-surface/80 flex items-center justify-center">
          <motion.div className="w-full h-full relative p-12 flex flex-col justify-between">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <motion.div animate={{ backgroundColor: ['rgba(59,130,246,0.1)', 'rgba(59,130,246,0.4)', 'rgba(59,130,246,0.1)'] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} className="w-12 h-12 border border-accent/30 rotate-45 flex items-center justify-center" />
                <motion.div animate={{ width: ['0%', '100%'], opacity: [0, 1, 0] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} className="h-[1px] bg-accent flex-1 origin-left" />
                <div className="w-12 h-12 border border-accent/30 rounded-full" />
              </div>
            ))}
          </motion.div>
        </div>
      )
    case 'custom-software': // Custom
      return (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden bg-surface/80 flex items-center justify-center">
          <motion.div className="w-[150%] h-[150%] absolute" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(17,19,24,1)_70%)] z-10" />
            <div className="absolute inset-0 bg-grid-pattern opacity-40 mix-blend-overlay" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-accent/30 rotate-45 flex flex-wrap">
              {Array.from({length: 16}).map((_, i) => (
                <motion.div key={i} animate={{ opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 2 + (i % 3) * 0.5, repeat: Infinity, delay: (i * 0.15) % 1 }} className="w-1/4 h-1/4 border border-accent/10 bg-accent/5" />
              ))}
            </div>
          </motion.div>
        </div>
      )
    default:
      return null
  }
}

export function ServicesSection() {
  return (
    <section className="section-padding bg-base border-y border-border relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="container-site relative z-10">
        <RevealOnScroll>
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-[1px] w-12 bg-accent" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                  System Architecture
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-fg leading-[1.05] tracking-[-0.02em]">
                Built around the outcome.
              </h2>
            </div>
            <p className="text-lg text-fg-muted font-light leading-relaxed max-w-sm md:text-right">
              We engineer the optimal technical architecture to deliver exactly what your system needs to accomplish.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
          {services.map((service, idx) => {
            const IconComponent = iconMap[service.icon] || Code2
            return (
              <RevealOnScroll key={service.id} delay={idx * 0.1} className="h-full">
                <Link href={`/services#${service.id}`} className="block h-full group">
                  <div className="h-full relative overflow-hidden flex flex-col p-8 lg:p-14 border border-border/50 bg-surface/20 transition-all duration-700 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)]">
                    
                    {/* The Visual World Background */}
                    <VisualWorld id={service.id} />

                    {/* Content (Sits above the visual world) */}
                    <div className="relative z-10 flex flex-col h-full pointer-events-none">
                      <div className="flex justify-between items-start mb-24">
                        <span className="font-mono text-[10px] text-fg-subtle tracking-[0.2em] uppercase border border-border/50 px-3 py-1 bg-base/50 backdrop-blur-sm group-hover:border-accent/40 group-hover:text-accent transition-colors duration-500">
                          SYS.0{idx + 1}
                        </span>
                        <div className="w-12 h-12 flex items-center justify-center border border-border/50 bg-base/50 backdrop-blur-sm group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-500">
                          <IconComponent size={20} className="text-fg-subtle group-hover:text-accent transition-colors duration-500" strokeWidth={1.5} />
                        </div>
                      </div>

                      <div className="mt-auto bg-base/80 backdrop-blur-md p-6 border border-border/50 group-hover:border-accent/30 transition-colors duration-500">
                        <h3 className="text-2xl lg:text-3xl font-light text-fg mb-3 group-hover:text-accent transition-colors duration-300">
                          {service.title}
                        </h3>
                        <div className="font-mono text-[10px] text-accent/70 mb-4 uppercase tracking-[0.2em]">
                          {service.tagline}
                        </div>
                        <p className="text-sm lg:text-base text-fg-muted font-light leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Corner architectural accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-accent/30 transition-all duration-700 z-10" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-accent/30 transition-all duration-700 z-10" />
                  </div>
                </Link>
              </RevealOnScroll>
            )
          })}
        </div>

        <RevealOnScroll delay={0.4} className="mt-24 flex justify-center">
          <Link href="/services" className="group flex items-center gap-3 text-sm font-medium text-fg-muted hover:text-fg transition-colors">
            <span className="border-b border-transparent group-hover:border-fg transition-colors">View full technical specs</span>
            <span className="font-mono text-accent opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-300">{'->'}</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  )
}
