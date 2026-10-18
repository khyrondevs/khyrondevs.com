import type { Metadata } from 'next'
import Link from 'next/link'
import { services } from '@/lib/content/services'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { BentoCard } from '@/components/ui/bento-card'
import { Globe, Brain, Workflow, Code2, Smartphone, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Full-stack web development, mobile apps (iOS & Android), AI systems, workflow automation, and custom software — engineered around your problem.',
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe,
  Brain,
  Workflow,
  Code2,
  Smartphone,
}

export default function ServicesPage() {
  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="container-site">
        {/* Hero */}
        <div className="max-w-2xl mb-24 md:mb-32">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">What we do</span>
          <h1 className="mt-3 text-4xl md:text-6xl font-light text-fg text-balance">
            Built around the outcome
          </h1>
          <p className="mt-4 text-fg-muted leading-relaxed text-lg">
            We lead with the problem you need to solve, then choose the right tools and architecture.
          </p>
        </div>

        {/* Services grid */}
        <div className="space-y-24 md:space-y-32">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <RevealOnScroll key={service.id} delay={index * 0.1}>
                <section id={service.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t border-border pt-12 md:pt-24">
                  <div className="md:col-span-5 flex flex-col items-start">
                    <div className="p-3 bg-surface rounded-lg border border-border mb-6">
                      <Icon className="text-accent" size={24} />
                    </div>
                    <span className="font-mono text-sm text-accent mb-2">{service.tagline}</span>
                    <h2 className="text-2xl md:text-3xl font-light text-fg mb-4">{service.title}</h2>
                    <p className="text-fg-muted leading-relaxed">{service.description}</p>
                  </div>
                  <div className="md:col-span-6 md:col-start-7 pt-4 md:pt-0">
                    <h3 className="text-sm font-mono text-fg-subtle mb-6 uppercase tracking-wider">Outcomes</h3>
                    <ul className="space-y-4">
                      {service.outcomes.map((outcome: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={18} />
                          <span className="text-fg-muted">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <RevealOnScroll delay={0.2} className="mt-24 md:mt-32">
          <BentoCard className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-12 text-center md:text-left">
            <div>
              <h2 className="text-xl md:text-2xl font-light text-fg mb-2">Not sure which service fits?</h2>
              <p className="text-fg-muted">Tell us the problem. We will help you figure out the solution.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-accent text-white hover:bg-accent-light transition-colors whitespace-nowrap">
              Tell us the problem
            </Link>
          </BentoCard>
        </RevealOnScroll>
      </div>
    </div>
  )
}
