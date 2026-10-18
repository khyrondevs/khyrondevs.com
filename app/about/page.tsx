import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { BentoCard } from '@/components/ui/bento-card'
import InteractiveTerminal from '@/components/ui/interactive-terminal'
import { teamMembers } from '@/lib/content/team'

function GithubIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

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

        <RevealOnScroll className="mb-16 md:mb-20">
          <div className="max-w-3xl">
            <span className="font-mono text-xs tracking-widest uppercase text-accent">The Team</span>
            <h2 className="text-2xl md:text-4xl font-light text-fg mt-2 mb-6">Founding Engineering Triad</h2>
            <div className="space-y-4 text-fg-muted leading-relaxed text-lg">
              <p>
                We are a founder-led engineering and data studio. The people scoping your architecture are the craftspeople writing the code, modeling the data, and shipping to production. No junior handoffs. No outsourced surprises.
              </p>
              <p className="text-sm font-mono text-fg-muted">
                Our triad bridges full-stack interface engineering, distributed compute systems, and commercial data analytics — engineering digital products that are technically resilient and commercially viable.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mb-24 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((member) => (
              <BentoCard
                key={member.id}
                className="p-6 md:p-8 flex flex-col justify-between group hover:border-accent/40 transition-colors duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded">
                      {member.credentials}
                    </span>
                    {member.portfolioStatus === 'live' ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-fg-subtle">
                        <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle/50" />
                        Deploying
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-light text-fg group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-fg-muted mt-1 uppercase tracking-wide">
                    {member.role}
                  </p>

                  <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                    {member.tagline}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {member.focus.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] text-fg-muted bg-surface border border-border px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60 flex flex-col gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted hover:text-accent transition-colors"
                    title={`Email ${member.name} directly`}
                  >
                    <Mail size={13} className="text-accent shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </a>

                  {member.portfolioUrl ? (
                    <a
                      href={member.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between font-mono text-xs text-fg bg-surface hover:bg-surface/80 border border-border hover:border-accent/50 px-3 py-2 rounded transition-all group/link"
                    >
                      <span className="text-accent flex items-center gap-1.5">
                        <span>↗</span> View Portfolio
                      </span>
                      <span className="text-[10px] text-fg-muted font-mono truncate max-w-[140px]">
                        vittal-dev.vercel.app
                      </span>
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-between font-mono text-xs text-fg-subtle bg-surface/50 border border-border/50 px-3 py-2 rounded select-none">
                      <span className="flex items-center gap-1.5">
                        <span className="text-fg-subtle">⏳</span> Portfolio Launching
                      </span>
                      <span className="text-[10px] text-fg-subtle font-mono">Soon</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    {member.socials.github && (
                      <a
                        href={member.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-muted hover:text-fg transition-colors"
                        aria-label={`${member.name} on GitHub`}
                      >
                        <GithubIcon />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-muted hover:text-fg transition-colors"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-muted hover:text-fg transition-colors"
                        aria-label={`${member.name} on Instagram`}
                      >
                        <InstagramIcon />
                      </a>
                    )}
                  </div>
                </div>
              </BentoCard>
            ))}
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
