import Link from 'next/link'
import { getFeaturedProjects } from '@/lib/content/projects'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

export function WorkSection() {
  const projects = getFeaturedProjects()
  const primaryProject = projects[0]
  const secondaryProjects = projects.slice(1)

  return (
    <section className="section-padding bg-base">
      <div className="container-site">
        <RevealOnScroll>
          <div className="mb-20 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                System Engineering
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-fg leading-[1.1] tracking-[-0.02em] mb-6">
              What we have built.
            </h2>
            <p className="text-lg md:text-xl text-fg-muted font-light leading-relaxed max-w-2xl">
              Engineered systems, not portfolio filler. Real problems solved with disciplined architecture.
            </p>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col gap-8">
          {/* Primary Project */}
          {primaryProject && (
            <RevealOnScroll delay={0.1}>
              <Link href={`/work/${primaryProject.slug}`} className="block group">
                <div className="relative overflow-hidden bg-surface/30 border border-border group-hover:border-accent/40 transition-colors duration-500">
                  
                  {/* Subtle grid background */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border bg-base/50 backdrop-blur-sm group-hover:bg-base/30 transition-colors duration-700">
                      <div>
                        <div className="flex items-center gap-3 mb-8">
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                          <span className="font-mono text-xs text-fg-subtle uppercase tracking-[0.2em]">
                            {primaryProject.statusLabel}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-light text-fg mb-6 group-hover:text-accent transition-colors duration-500">
                          {primaryProject.title}
                        </h3>
                        <p className="text-lg text-fg-muted font-light leading-relaxed mb-12">
                          {primaryProject.coverDescription}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {primaryProject.stack.map((tech) => (
                          <span key={tech} className="px-3 py-1.5 rounded-full border border-border/60 bg-surface/50 text-xs font-mono text-fg-subtle group-hover:border-accent/30 transition-colors duration-500">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-surface/10 group-hover:bg-accent/[0.02] backdrop-blur-md transition-colors duration-700 relative overflow-hidden">
                      
                      {/* Scanning Line */}
                      <div className="absolute left-0 right-0 h-[1px] bg-accent/20 -translate-y-[100%] group-hover:translate-y-[800%] transition-transform duration-[2s] ease-linear pointer-events-none" />

                      <div className="mb-12 relative z-10">
                        <span className="font-mono text-[10px] text-accent/50 tracking-[0.2em] uppercase block mb-4 group-hover:text-accent transition-colors">Problem</span>
                        <p className="text-sm text-fg-muted leading-relaxed font-light">{primaryProject.problem}</p>
                      </div>
                      <div className="mb-16 relative z-10">
                        <span className="font-mono text-[10px] text-accent/50 tracking-[0.2em] uppercase block mb-4 group-hover:text-accent transition-colors">Architecture</span>
                        <p className="text-sm text-fg-muted leading-relaxed font-light">{primaryProject.solution}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-8 relative z-10">
                        <span className="text-sm font-medium text-fg group-hover:text-accent transition-colors duration-300">
                          View full architectural review
                        </span>
                        <span className="font-mono text-accent transform translate-x-0 group-hover:translate-x-3 transition-transform duration-500">
                          {'->'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          )}

          {/* Secondary Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryProjects.map((project, idx) => (
              <RevealOnScroll key={project.slug} delay={0.2 + idx * 0.1}>
                <Link href={`/work/${project.slug}`} className="block h-full group">
                  <div className="h-full relative overflow-hidden bg-surface/30 border border-border group-hover:border-accent/40 transition-colors duration-500 flex flex-col p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle group-hover:bg-accent transition-colors" />
                      <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-light text-fg mb-4 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-fg-muted leading-relaxed mb-8 flex-grow">
                      {project.coverDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-1 rounded border border-border/50 bg-base/50 text-[10px] font-mono text-fg-subtle">
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 4 && (
                        <span className="px-2 py-1 rounded border border-border/50 bg-base/50 text-[10px] font-mono text-fg-subtle">
                          +{project.stack.length - 4}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-6">
                      <span className="text-sm font-medium text-fg group-hover:text-accent transition-colors">
                        View case study
                      </span>
                      <span className="font-mono text-accent transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <RevealOnScroll delay={0.4} className="mt-20 flex justify-center">
          <Link href="/work" className="group flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg transition-colors">
            <span className="border-b border-transparent group-hover:border-fg transition-colors">View all engineering work</span>
            <span className="font-mono text-accent opacity-50 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  )
}
