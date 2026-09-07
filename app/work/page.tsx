import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/lib/content/projects'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects — engineered systems, self-initiated builds, and technical explorations.',
}

export default function WorkPage() {
  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="container-site">
        <div className="max-w-2xl mb-16 md:mb-24">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">Selected work</span>
          <h1 className="mt-3 text-4xl md:text-6xl font-light text-fg text-balance">
            What we have built
          </h1>
          <p className="mt-4 text-fg-muted leading-relaxed text-lg">
            Each project is labelled for what it actually is. No inflated client claims.
          </p>
        </div>

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <RevealOnScroll key={project.slug} delay={index * 0.1}>
              <Link href={`/work/${project.slug}`} className="group block border-b border-border py-10 md:py-16 hover:bg-surface/50 transition-colors px-4 -mx-4 md:px-6 md:-mx-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 justify-between mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="muted">{project.statusLabel}</Badge>
                    <Badge variant="outline">{project.category}</Badge>
                    <span className="font-mono text-sm text-fg-subtle">{project.year}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mt-6">
                  <div className="md:col-span-5">
                    <h2 className="text-2xl md:text-3xl font-light text-fg group-hover:text-accent transition-colors mb-4">{project.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech: string) => (
                        <span key={tech} className="font-mono text-xs px-2 py-1 bg-surface border border-border rounded text-fg-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <p className="text-fg-muted text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none mb-6">
                      {project.problem}
                    </p>
                    <div className="text-accent font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      View case study <span aria-hidden="true">&rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.2} className="mt-24 md:mt-32 text-center">
          <p className="text-xl font-light text-fg mb-6">Have a project in mind?</p>
          <Link href="/contact" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-accent text-white hover:bg-accent-light transition-colors text-lg">
            Start a conversation &rarr;
          </Link>
        </RevealOnScroll>
      </div>
    </div>
  )
}
