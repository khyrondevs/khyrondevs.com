import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const techDomains = [
  {
    domain: 'Frontend & Edge',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'WebGL'],
  },
  {
    domain: 'Backend Services',
    items: ['Node.js', 'PostgreSQL', 'Redis', 'REST', 'GraphQL', 'BullMQ'],
  },
  {
    domain: 'Data & Intelligence',
    items: ['OpenAI', 'LangChain', 'pgvector', 'Pinecone', 'Python', 'Hugging Face'],
  },
  {
    domain: 'Infrastructure',
    items: ['Vercel', 'AWS', 'Docker', 'GitHub Actions', 'Terraform', 'Cloudflare'],
  },
]

export function TechStackSection() {
  return (
    <section className="section-padding bg-base relative overflow-hidden py-32 border-y border-border/40">
      {/* Deep Technical Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.03)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="container-site relative z-10 max-w-5xl mx-auto">
        <RevealOnScroll>
          <div className="mb-32 text-center flex flex-col items-center">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent mb-6 block border border-accent/20 bg-accent/5 px-4 py-2">
              System Topography
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-fg leading-[1.05] tracking-[-0.03em] max-w-3xl">
              The technical map.
            </h2>
          </div>
        </RevealOnScroll>

        {/* Unified Map Pipeline */}
        <div className="relative">
          {/* Main vertical trunk line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-border/50 md:-translate-x-1/2" />
          
          <div className="flex flex-col gap-0 relative">
            {techDomains.map((group, idx) => {
              const isEven = idx % 2 === 0
              return (
                <RevealOnScroll key={group.domain} delay={0.1}>
                  <div className={`relative flex flex-col md:flex-row items-start md:items-center w-full py-12 md:py-16 group ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* The Node Center Point */}
                    <div className="absolute left-4 md:left-1/2 top-12 md:top-1/2 w-3 h-3 bg-base border border-accent/40 rounded-full md:-translate-x-1/2 md:-translate-y-1/2 group-hover:bg-accent group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-500 z-20" />
                    <div className="absolute left-4 md:left-1/2 top-12 md:top-1/2 w-8 h-8 border border-accent/0 rounded-full md:-translate-x-1/2 md:-translate-y-1/2 group-hover:border-accent/30 transition-all duration-700 z-10 group-hover:scale-150" />
                    
                    {/* Connecting Branch Line */}
                    <div className={`absolute top-12 md:top-1/2 h-[1px] bg-border/50 w-8 md:w-32 hidden md:block ${isEven ? 'right-1/2' : 'left-1/2'}`} />

                    {/* Content Half */}
                    <div className={`w-full md:w-1/2 pl-12 md:px-16 lg:px-24 flex flex-col ${isEven ? 'md:items-start text-left' : 'md:items-end text-left md:text-right'}`}>
                      <div className="flex flex-col mb-8">
                        <span className="font-mono text-[10px] text-accent/50 tracking-[0.2em] uppercase mb-3">
                          Layer {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-light text-fg group-hover:text-white transition-colors duration-300">
                          {group.domain}
                        </h3>
                      </div>
                      
                      <div className={`flex flex-wrap gap-2 ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
                        {group.items.map((tech) => (
                          <span
                            key={tech}
                            className="bg-surface/30 border border-border/40 px-3 py-1.5 text-[10px] sm:text-xs text-fg-muted font-mono uppercase tracking-wider group-hover:border-accent/30 group-hover:text-fg group-hover:bg-accent/5 transition-all duration-500 cursor-default"
                          >
                            <span className="inline-block w-1 h-1 bg-accent/40 mr-2 rounded-full group-hover:bg-accent transition-colors" />
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Empty Half for Balance */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </RevealOnScroll>
              )
            })}
          </div>
          
          {/* Animated data packet traveling down the trunk */}
          <div className="absolute left-4 md:left-1/2 top-0 w-[1px] h-32 bg-gradient-to-b from-transparent via-accent to-transparent md:-translate-x-1/2 animate-[scale-x_4s_linear_infinite_alternate]" style={{ transform: 'translateY(-100%)' }} />
        </div>
      </div>
    </section>
  )
}
