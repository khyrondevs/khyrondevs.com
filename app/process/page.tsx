import type { Metadata } from 'next'
import Link from 'next/link'
import { processSteps } from '@/lib/content/process-steps'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { BentoCard } from '@/components/ui/bento-card'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Process',
  description: 'How we work — discover, design, build, ship. A disciplined process for building software that does what it needs to do.',
}

export default function ProcessPage() {
  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="container-site">
        <div className="max-w-2xl mb-24 md:mb-32">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">How we work</span>
          <h1 className="mt-3 text-4xl md:text-6xl font-light text-fg text-balance">
            A process built around clarity
          </h1>
          <p className="mt-4 text-fg-muted leading-relaxed text-lg">
            Most project failures are communication failures. We design our process to prevent them.
          </p>
        </div>

        <div className="space-y-0">
          {processSteps.map((step, index) => (
            <RevealOnScroll key={step.id} delay={index * 0.1}>
              <section id={step.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t border-border py-12 md:py-24">
                <div className="md:col-span-4">
                  <div className="font-mono text-accent text-sm mb-4">0{index + 1} — {step.id}</div>
                  <h2 className="text-2xl md:text-4xl font-light text-fg mb-2">{step.title}</h2>
                  <p className="text-fg-muted font-mono text-sm">{step.subtitle}</p>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <p className="text-fg-muted leading-relaxed text-lg mb-8">{step.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {step.details.map((detail: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <ArrowRight className="text-accent shrink-0 mt-1" size={16} />
                        <span className="text-fg-muted">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </RevealOnScroll>
          ))}
          <div className="border-t border-border"></div>
        </div>

        <RevealOnScroll delay={0.2} className="mt-24 md:mt-32">
          <BentoCard className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-12 text-center md:text-left">
            <div>
              <h2 className="text-xl md:text-2xl font-light text-fg mb-2">Ready to start?</h2>
              <p className="text-fg-muted">Tell us about your project.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-accent text-white hover:bg-accent-light transition-colors whitespace-nowrap">
              Tell us about your project
            </Link>
          </BentoCard>
        </RevealOnScroll>
      </div>
    </div>
  )
}
