import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const techDomains = [
  {
    domain: 'Frontend',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'WebGL'],
  },
  {
    domain: 'Backend',
    items: ['Node.js', 'PostgreSQL', 'Redis', 'REST', 'GraphQL', 'BullMQ'],
  },
  {
    domain: 'AI & Data',
    items: ['OpenAI', 'LangChain', 'pgvector', 'Pinecone', 'Python', 'Hugging Face'],
  },
  {
    domain: 'Infrastructure',
    items: ['Vercel', 'AWS', 'Docker', 'GitHub Actions', 'Terraform', 'Cloudflare'],
  },
]

export function TechStackSection() {
  return (
    <section className="section-padding bg-base relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="container-site relative z-10">
        <RevealOnScroll>
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                Architecture
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-fg leading-[1.1] tracking-[-0.02em]">
              The technical map.
            </h2>
          </div>
        </RevealOnScroll>

        {/* Unified Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border/40 border border-border/40">
          {techDomains.map((group, idx) => (
            <RevealOnScroll key={group.domain} delay={idx * 0.1}>
              <div className="bg-base h-full p-8 md:p-12 lg:p-16 group relative overflow-hidden flex flex-col transition-colors duration-500 hover:bg-surface/20">
                {/* Subtle corner crosshairs */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-border group-hover:border-accent/50 transition-colors duration-500" />
                <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-border group-hover:border-accent/50 transition-colors duration-500" />
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-border group-hover:border-accent/50 transition-colors duration-500" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-border group-hover:border-accent/50 transition-colors duration-500" />
                
                {/* Connection lines on hover */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-accent/0 group-hover:bg-accent/10 transition-colors duration-700 pointer-events-none" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-accent/0 group-hover:bg-accent/10 transition-colors duration-700 pointer-events-none" />

                {/* Hover gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-16">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-fg-subtle group-hover:text-accent transition-colors duration-300">
                        {group.domain}
                      </h3>
                      <span className="font-mono text-[10px] text-fg-subtle/40 tracking-widest uppercase">
                        System Level // 0{idx + 1}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-accent/40 group-hover:text-accent group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 bg-accent/5 px-2 py-1">
                      [{String(idx + 1).padStart(2, '0')}]
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-auto relative z-10 bg-base/50 p-4 border border-border/30 backdrop-blur-sm group-hover:border-accent/20 transition-colors duration-500">
                    {group.items.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 bg-surface/80 border border-border/50 px-3 py-1.5 text-xs text-fg-muted font-mono hover:border-accent hover:text-fg hover:bg-accent/10 transition-all duration-300 cursor-default"
                      >
                        <span className="w-1.5 h-1.5 bg-accent/40 group-hover:animate-pulse" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
