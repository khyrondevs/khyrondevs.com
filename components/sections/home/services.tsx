'use client'

import Link from 'next/link'
import { Globe, Brain, Workflow, Code2 } from 'lucide-react'
import { services } from '@/lib/content/services'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Globe,
  Brain,
  Workflow,
  Code2,
}

export function ServicesSection() {
  return (
    <section className="section-padding bg-base border-y border-border relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="container-site relative z-10">
        <RevealOnScroll>
          <div className="mb-20 max-w-3xl flex flex-col items-start md:items-center text-left md:text-center mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="hidden md:block h-[1px] w-8 bg-accent" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                Systems & Architecture
              </span>
              <span className="h-[1px] w-8 bg-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-fg leading-[1.1] tracking-[-0.02em] mb-6">
              Built around the outcome.
            </h2>
            <p className="text-lg md:text-xl text-fg-muted font-light leading-relaxed max-w-2xl">
              We lead with what your system needs to accomplish, then engineer the optimal technical architecture to deliver it.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/40 border border-border/40">
          {services.map((service, idx) => {
            const IconComponent = iconMap[service.icon] || Code2
            return (
              <RevealOnScroll key={service.id} delay={idx * 0.1} className="h-full">
                <Link href={`/services#${service.id}`} className="block h-full group bg-base">
                  <div className="h-full relative overflow-hidden flex flex-col p-8 lg:p-12 hover:bg-surface/30 transition-colors duration-500">
                    
                    {/* Signal scanning line on hover */}
                    <div className="absolute left-0 top-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-700 ease-out z-20 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                    {/* Top Status Bar */}
                    <div className="flex items-center justify-between mb-16 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-accent/40 group-hover:bg-accent group-hover:shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-300" />
                          <div className="absolute inset-0 rounded-full border border-accent/20 group-hover:scale-[2.5] group-hover:opacity-0 transition-all duration-700" />
                        </div>
                        <span className="font-mono text-[10px] text-fg-subtle tracking-[0.2em] uppercase">
                          SVC.{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <IconComponent size={24} className="text-fg-subtle group-hover:text-accent transition-colors duration-500" strokeWidth={1} />
                    </div>

                    <div className="flex-grow relative z-10">
                      <h3 className="text-3xl font-light text-fg mb-4 group-hover:text-accent transition-colors duration-300">
                        {service.title}
                      </h3>
                      <div className="font-mono text-xs text-accent/60 mb-6 uppercase tracking-[0.2em]">
                        {service.tagline}
                      </div>
                      <p className="text-lg text-fg-muted font-light leading-relaxed mb-10 max-w-md">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Data Readout List */}
                    <div className="border-t border-border/40 pt-8 mt-auto relative z-10">
                      <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-[0.2em] block mb-6">
                        System Outcomes
                      </span>
                      <ul className="flex flex-col gap-4">
                        {service.outcomes.map((outcome: string, i: number) => (
                          <li key={i} className="flex items-start gap-4 text-sm text-fg-muted font-light group/item">
                            <span className="font-mono text-[10px] text-accent/50 mt-1 shrink-0 group-hover/item:text-accent group-hover/item:translate-x-1 transition-all duration-300">
                              {'//'}
                            </span>
                            <span className="group-hover/item:text-fg transition-colors duration-300">
                              {outcome}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Subtle corner crosshairs */}
                    <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-border group-hover:border-accent/40 transition-colors duration-500 z-10" />
                    <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-border group-hover:border-accent/40 transition-colors duration-500 z-10" />
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-border group-hover:border-accent/40 transition-colors duration-500 z-10" />
                    <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-border group-hover:border-accent/40 transition-colors duration-500 z-10" />
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
