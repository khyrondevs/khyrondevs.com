import type { Metadata } from 'next'
import Link from 'next/link'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { BentoCard } from '@/components/ui/bento-card'
import InteractiveTerminal from '@/components/ui/interactive-terminal'

export const metadata: Metadata = {
  title: 'About',
  description: 'Engineering-led, founder-built. We build software the way we would want it built.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="container-site">
        <div className="max-w-2xl mb-24 md:mb-32">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">About</span>
          <h1 className="mt-3 text-4xl md:text-6xl font-light text-fg text-balance">
            Engineering-led, problem-first
          </h1>
          <p className="mt-4 text-fg-muted leading-relaxed text-lg">
            We build software the way we would want it built — with clear architecture, honest communication, and production-quality output.
          </p>
        </div>

        <RevealOnScroll className="mb-24 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <BentoCard className="p-8">
              <h3 className="text-lg font-medium text-fg mb-3">Start with the problem</h3>
              <p className="text-fg-muted leading-relaxed text-sm">
                We do not pick a framework and fit the problem to it. We understand the constraint first.
              </p>
            </BentoCard>
            <BentoCard className="p-8">
              <h3 className="text-lg font-medium text-fg mb-3">Production-quality or nothing</h3>
              <p className="text-fg-muted leading-relaxed text-sm">
                Code that ships is code that must be maintained. We treat documentation, tests, and observability as part of the work, not extras.
              </p>
            </BentoCard>
            <BentoCard className="p-8">
              <h3 className="text-lg font-medium text-fg mb-3">No unnecessary complexity</h3>
              <p className="text-fg-muted leading-relaxed text-sm">
                Every dependency, abstraction, and pattern has a cost. We add things when they earn their place.
              </p>
            </BentoCard>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mb-24 md:mb-32">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-light text-fg mb-6">Honest about what we are</h2>
            <div className="space-y-6 text-fg-muted leading-relaxed text-lg">
              <p>
                We are a founder-led engineering team. That means the people scoping the work are the people doing the work. No bait-and-switch from senior to junior. No outsourcing decisions made without telling you.
              </p>
              <p className="text-sm font-mono text-fg-muted mt-4">We are a founding team of two engineers. We learn best by building real projects rather than isolated demos — overseeing everything from database architecture and backend APIs to frontend interfaces, security, and edge deployment.</p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mb-24">
          <InteractiveTerminal />
        </RevealOnScroll>

        <RevealOnScroll>
          <Link href="/contact" className="inline-flex items-center gap-3 text-xl md:text-2xl font-light text-fg hover:text-accent transition-colors group">
            Work with people who care about the details
            <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </Link>
        </RevealOnScroll>
      </div>
    </div>
  )
}
