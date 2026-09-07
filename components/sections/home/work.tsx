'use client'

import Link from 'next/link'
import { getFeaturedProjects } from '@/lib/content/projects'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function WorkSection() {
  const projects = getFeaturedProjects()
  const primaryProject = projects[0]
  const secondaryProjects = projects.slice(1, 3)
  const reducedMotion = useReducedMotion()

  return (
    <section className="section-padding bg-base relative overflow-hidden">
      {/* Background Architectural Noise */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="container-site relative z-10 max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-b border-border/40 pb-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-[1px] w-12 bg-accent" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent">
                  Production Engineering
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-8xl font-light text-fg leading-[1.0] tracking-[-0.03em]">
                Deployed Systems.
              </h2>
            </div>
            <p className="text-lg text-fg-muted font-light leading-relaxed max-w-md md:text-right">
              We do not build speculative prototypes. These are real architectural systems operating in production.
            </p>
          </div>
        </RevealOnScroll>

        {primaryProject && (
          <RevealOnScroll delay={0.1}>
            <Link href={`/work/${primaryProject.slug}`} className="block group">
              <div className="relative overflow-hidden bg-surface border border-border group-hover:border-accent/40 transition-colors duration-1000 shadow-[0_0_0_rgba(59,130,246,0)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.05)]">
                
                {/* Immersive Background / Product Visual */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Subtle Grid Base */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 mix-blend-overlay" />
                  
                  {/* Glowing core representing the product/system */}
                  {!reducedMotion && (
                    <motion.div 
                      className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px]"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                  )}
                  
                  {/* Architectural overlays on hover */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="absolute top-10 right-10 bottom-10 left-[60%] border border-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-surface/50 backdrop-blur-sm hidden lg:block">
                     {/* Data vis abstract representation */}
                     <div className="w-full h-full p-8 flex flex-col justify-between opacity-30 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="flex justify-between items-center border-b border-accent/20 pb-4">
                          <span className="font-mono text-[8px] text-accent uppercase tracking-widest">Sys.Status</span>
                          <div className="flex gap-1">
                            <span className="w-1 h-3 bg-accent" />
                            <span className="w-1 h-4 bg-accent" />
                            <span className="w-1 h-2 bg-accent" />
                          </div>
                        </div>
                        <div className="flex-1 border-x border-accent/10 mx-8 my-8 flex items-center justify-center relative overflow-hidden">
                          {!reducedMotion && (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="w-[120%] h-[120%] border border-accent/20 rounded-full border-dashed" />
                          )}
                        </div>
                        <div className="font-mono text-[8px] text-accent/50 uppercase tracking-widest text-right">Live metrics connected</div>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10 min-h-[600px] lg:min-h-[800px]">
                  
                  {/* Left Column: Title & Architecture */}
                  <div className="col-span-1 lg:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-r from-base via-base to-transparent">
                    
                    {/* Top: Status & Title */}
                    <div>
                      <div className="flex items-center gap-4 mb-10">
                        <div className="relative flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                          {!reducedMotion && (
                            <motion.span animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full border border-accent" />
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-[0.2em] bg-surface/50 border border-border/50 px-3 py-1">
                          {primaryProject.statusLabel}
                        </span>
                      </div>
                      
                      <h3 className="text-4xl md:text-5xl lg:text-7xl font-light text-fg mb-8 leading-[1.05] tracking-[-0.02em] group-hover:text-accent transition-colors duration-700">
                        {primaryProject.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-16">
                        {primaryProject.stack.map((tech) => (
                          <span key={tech} className="px-3 py-1.5 border border-border/50 bg-surface/80 backdrop-blur-sm text-[10px] font-mono text-fg-subtle uppercase tracking-wider group-hover:border-accent/30 transition-colors duration-500">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Editorial Data Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 pt-12 border-t border-border/50">
                      <div>
                        <span className="font-mono text-[10px] text-accent/70 tracking-[0.2em] uppercase block mb-4 border-l-2 border-accent/50 pl-3">
                          Problem Statement
                        </span>
                        <p className="text-sm text-fg-muted leading-relaxed font-light">
                          {primaryProject.problem}
                        </p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-accent/70 tracking-[0.2em] uppercase block mb-4 border-l-2 border-accent/50 pl-3">
                          System Architecture
                        </span>
                        <p className="text-sm text-fg-muted leading-relaxed font-light">
                          {primaryProject.solution}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: CTA & Space */}
                  <div className="col-span-1 lg:col-span-6 flex flex-col justify-end p-8 md:p-12 lg:p-16 items-start lg:items-end text-left lg:text-right">
                    
                    {/* Scanning Line overlay for right col */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
                      {!reducedMotion && (
                        <motion.div 
                          className="absolute top-0 left-0 right-0 h-[1px] bg-accent/40 shadow-[0_0_15px_rgba(59,130,246,1)]"
                          initial={{ top: '0%' }}
                          whileInView={{ top: '100%' }}
                          transition={{ duration: 3, ease: 'linear', repeat: Infinity, delay: 1 }}
                        />
                      )}
                    </div>

                    <div className="mt-12 lg:mt-0 flex items-center justify-between lg:justify-end gap-6 border border-border/50 bg-base/80 backdrop-blur-md px-8 py-6 group-hover:border-accent/40 group-hover:bg-accent/5 transition-colors duration-500 w-full lg:w-auto relative z-20">
                      <span className="text-sm font-medium text-fg uppercase tracking-widest font-mono">
                        Initialize Case Study
                      </span>
                      <span className="font-mono text-accent transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/40 border border-border/40 mt-px">
          {secondaryProjects.map((project, idx) => (
            <RevealOnScroll key={project.slug} delay={0.2 + idx * 0.1} className="h-full">
              <Link href={`/work/${project.slug}`} className="block h-full group bg-base">
                <div className="h-full relative overflow-hidden bg-surface/20 hover:bg-surface/50 transition-colors duration-500 flex flex-col p-8 md:p-12 lg:p-16">
                  
                  {/* Background Grid Hover */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-1.5 h-1.5 bg-fg-subtle group-hover:bg-accent transition-colors" />
                      <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest border border-border/50 px-2 py-1 group-hover:border-accent/30 transition-colors">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-light text-fg mb-6 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-base text-fg-muted leading-relaxed mb-12 font-light max-w-sm">
                      {project.coverDescription}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-16">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-1 border border-border/50 bg-base/50 text-[10px] font-mono text-fg-subtle uppercase tracking-wider group-hover:border-accent/30 transition-colors">
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 4 && (
                        <span className="px-2 py-1 border border-border/50 bg-base/50 text-[10px] font-mono text-fg-subtle">
                          +{project.stack.length - 4}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-8 group-hover:border-accent/30 transition-colors">
                      <span className="text-sm font-medium text-fg uppercase tracking-widest font-mono text-[10px]">
                        Review Architecture
                      </span>
                      <span className="font-mono text-accent transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                        {'->'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.4} className="mt-24 flex justify-center">
          <Link href="/work" className="group flex items-center gap-3 text-sm font-medium text-fg-muted hover:text-fg transition-colors">
            <span className="border-b border-transparent group-hover:border-fg transition-colors">View production log</span>
            <span className="font-mono text-accent opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-300">{'->'}</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  )
}
