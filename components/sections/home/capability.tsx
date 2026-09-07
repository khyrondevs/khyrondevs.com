import { Code2, Layers, Brain, Workflow } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const pillars = [
  {
    icon: Code2,
    title: 'Frontend Engineering',
    body: 'React, Next.js, TypeScript — built for performance, accessibility, and long-term maintainability.',
  },
  {
    icon: Layers,
    title: 'Backend & API',
    body: 'Node.js, PostgreSQL, REST and GraphQL APIs — designed for correctness and observability from the start.',
  },
  {
    icon: Brain,
    title: 'AI & Language Models',
    body: 'RAG pipelines, embedding systems, LLM integration — grounded in your data, not hallucinations.',
  },
  {
    icon: Workflow,
    title: 'Automation & Integration',
    body: 'Event-driven pipelines, cross-system sync, process automation — built to be reliable and monitored.',
  },
]

export function CapabilitySection() {
  return (
    <section className="section-padding bg-base relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="container-site relative z-10">
        
        {/* Massive Section Anchor */}
        <RevealOnScroll>
          <div className="mb-24 md:mb-32">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                Core Capability
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-fg leading-[1.05] tracking-[-0.02em] max-w-4xl">
              End-to-end technical depth.
            </h2>
          </div>
        </RevealOnScroll>

        {/* Pipeline Architecture Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
          {pillars.map((pillar, idx) => (
            <RevealOnScroll key={pillar.title} delay={idx * 0.1}>
              <div className="bg-base h-full p-8 lg:p-10 flex flex-col group relative overflow-hidden hover:bg-surface/50 transition-colors duration-500">
                {/* Subtle corner crosshairs */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/0 group-hover:border-accent/40 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/0 group-hover:border-accent/40 transition-colors duration-500" />

                <div className="mb-12">
                  <span className="font-mono text-[10px] text-accent/50 group-hover:text-accent tracking-[0.2em] uppercase transition-colors">
                    SYS.{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-light text-fg mb-4 group-hover:text-accent transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed font-light">
                    {pillar.body}
                  </p>
                </div>

                <div className="mt-12 pt-6 border-t border-border/50">
                  <pillar.icon className="text-fg-subtle opacity-50 group-hover:opacity-100 group-hover:text-accent transition-all duration-300" size={24} strokeWidth={1} />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        
        {/* System Pipeline Hint */}
        <RevealOnScroll delay={0.4}>
          <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono text-fg-subtle uppercase tracking-widest px-4 border border-border/40 bg-surface/20 py-4 gap-4">
            <span>[01] Architecture</span>
            <span className="hidden md:block opacity-30">{'->'}</span>
            <span>[02] Implementation</span>
            <span className="hidden md:block opacity-30">{'->'}</span>
            <span>[03] Infrastructure</span>
            <span className="hidden md:block opacity-30">{'->'}</span>
            <span>[04] Deployment</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
