import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, getProjectBySlug } from '@/lib/content/projects'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { Badge } from '@/components/ui/badge'
import { BentoCard } from '@/components/ui/bento-card'
import { ArrowLeft } from 'lucide-react'
import { Gallery } from '@/components/ui/gallery'

import CyphrProjectExperience from '@/components/sections/CyphrProjectExperience'
import JobPilotProjectExperience from '@/components/sections/JobPilotProjectExperience'
import EazyShopProjectExperience from '@/components/sections/EazyShopProjectExperience'
import HousePriceProjectExperience from '@/components/sections/HousePriceProjectExperience'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const project = getProjectBySlug(slug)
  return {
    title: project?.title ?? 'Project',
    description: project?.problem ?? '',
  }
}

export default async function CaseStudyPage(props: PageProps<'/work/[slug]'>) {
  const { slug } = await props.params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  // Hybrid Routing Intercepts
  if (slug === 'cyphr') {
    return (
      <CyphrProjectExperience project={project}>
        <div className="pt-24 md:pt-32 px-6 container-site max-w-4xl pb-12">
          <Link className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors mb-12" href="/work">
            <ArrowLeft size={16} /> All work
          </Link>
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Badge variant="muted">{project.statusLabel}</Badge>
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-fg mb-6">{project.title}</h1>
          <p className="text-xl text-fg-muted mb-12">{project.coverDescription}</p>
        </div>
      </CyphrProjectExperience>
    )
  }

  if (slug === 'jobpilot') {
    return (
      <JobPilotProjectExperience project={project}>
        <div className="pt-24 md:pt-32 px-6 container-site max-w-4xl pb-12">
          <Link className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors mb-12" href="/work">
            <ArrowLeft size={16} /> All work
          </Link>
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Badge variant="muted">{project.statusLabel}</Badge>
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-fg mb-6">{project.title}</h1>
          <p className="text-xl text-fg-muted mb-12">{project.coverDescription}</p>
        </div>
      </JobPilotProjectExperience>
    )
  }

  if (slug === 'eazyshop') {
    return (
      <EazyShopProjectExperience project={project}>
        <div className="pt-24 md:pt-32 px-6 container-site max-w-4xl pb-12">
          <Link className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors mb-12" href="/work">
            <ArrowLeft size={16} /> All work
          </Link>
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Badge variant="muted">{project.statusLabel}</Badge>
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-fg mb-6">{project.title}</h1>
          <p className="text-xl text-fg-muted mb-12">{project.coverDescription}</p>
        </div>
      </EazyShopProjectExperience>
    )
  }

  if (slug === 'ai-house-price-estimator') {
    return (
      <HousePriceProjectExperience project={project}>
        <div className="pt-24 md:pt-32 px-6 container-site max-w-4xl pb-12">
          <Link className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors mb-12" href="/work">
            <ArrowLeft size={16} /> All work
          </Link>
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Badge variant="muted">{project.statusLabel}</Badge>
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-fg mb-6">{project.title}</h1>
          <p className="text-xl text-fg-muted mb-12">{project.coverDescription}</p>
        </div>
      </HousePriceProjectExperience>
    )
  }

  // Generic Fallback Layout
  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="container-site max-w-4xl">
        <RevealOnScroll>
          <Link className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors mb-12" href="/work">
            <ArrowLeft size={16} /> All work
          </Link>

          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Badge variant="muted">{project.statusLabel}</Badge>
            <Badge variant="outline">{project.category}</Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-light text-fg mb-6 text-balance">
            {project.title}
          </h1>

          <div className="flex items-center gap-4 text-sm font-mono text-fg-subtle mb-16 border-b border-border pb-8">
            <span>{project.year}</span>
            <span className="text-border-strong">|</span>
            <span className="truncate">{project.stack.join(', ')}</span>
          </div>
        </RevealOnScroll>

        <div className="space-y-16 md:space-y-24">

          {project.gallery && project.gallery.length > 0 && (
            <RevealOnScroll>
              <Gallery items={project.gallery} name={project.title} />
            </RevealOnScroll>
          )}

          <RevealOnScroll>
            <h2 className="text-xl font-mono text-fg-subtle mb-4">The Problem</h2>
            <div className="text-lg md:text-2xl font-light text-fg leading-relaxed">
              {project.problem}
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <h2 className="text-xl font-mono text-fg-subtle mb-4">The Solution</h2>
            <div className="text-fg-muted leading-relaxed text-base md:text-lg space-y-4">
              {project.solution}
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <h2 className="text-xl font-mono text-fg-subtle mb-4">Key Decisions</h2>
            <ul className="space-y-6">
              {project.keyDecisions.map((decision: string, i: number) => (
                <li key={i} className="pl-6 border-l-2 border-accent/20 text-fg-muted leading-relaxed relative">
                  <span className="absolute -left-[11px] top-1 bg-bg-base text-accent font-mono text-xs w-5 h-5 flex items-center justify-center border border-border rounded-full">{i + 1}</span>
                  {decision}
                </li>
              ))}
            </ul>
          </RevealOnScroll>

          {project.result && (
            <RevealOnScroll>
              <h2 className="text-xl font-mono text-fg-subtle mb-4">Outcome</h2>
              <div className="text-fg-muted leading-relaxed text-base md:text-lg">
                {project.result}
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll>
            <h2 className="text-xl font-mono text-fg-subtle mb-4">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech: string) => (
                <span key={tech} className="font-mono text-sm px-3 py-1.5 bg-surface border border-border rounded-md text-fg-muted">
                  {tech}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mt-24 md:mt-32" delay={0.2}>
          <BentoCard className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-12 text-center md:text-left">
            <div>
              <h2 className="text-xl md:text-2xl font-light text-fg mb-2">Start a similar project</h2>
              <p className="text-fg-muted">Tell us about your constraints and goals.</p>
            </div>
            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <Link className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-accent text-white hover:bg-accent-light transition-colors whitespace-nowrap" href="/contact">
                Contact us
              </Link>
            </div>
          </BentoCard>
        </RevealOnScroll>
      </div>
    </div>
  )
}
