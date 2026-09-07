import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const whyReasons = [
  {
    num: '01',
    title: 'ENGINEERING FIRST',
    body: 'Architecture and technical decisions come before tools and aesthetics. We design systems that are correct before they are impressive.',
  },
  {
    num: '02',
    title: 'BUILT AROUND THE PROBLEM',
    body: 'No template starts. We map the actual workflow, constraints, and edge cases before proposing a solution.',
  },
  {
    num: '03',
    title: 'PRODUCTION MINDED',
    body: 'What you get is production-quality code — tested, observed, documented, and owned by your team.',
  },
  {
    num: '04',
    title: 'NO UNNECESSARY COMPLEXITY',
    body: 'You do not pay for features you will not use or libraries that add weight without adding value.',
  },
]

export function WhyUsSection() {
  return (
    <section className="bg-base relative overflow-hidden py-32 md:py-48 border-t border-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_100%)] pointer-events-none mix-blend-screen" />
      
      <div className="container-site relative z-10 max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="mb-48 md:mb-64">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent mb-12 block">
                [ Manifesto ]
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] font-light text-fg leading-[0.95] tracking-[-0.04em]">
                Engineering-first <br />
                <span className="text-fg-muted italic">means something</span> <br />
                different here.
              </h2>
            </div>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col gap-32 md:gap-48">
          {whyReasons.map((reason) => (
            <RevealOnScroll key={reason.num} delay={0.1} className="w-full">
              <div className="relative group">
                
                {/* Structural Connecting Line */}
                <div className="absolute left-4 md:left-[8.5rem] top-0 bottom-[-12rem] w-[1px] bg-border/30 hidden md:block" />

                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                  
                  {/* Giant Numbering */}
                  <div className="w-full md:w-48 shrink-0 flex items-start pt-2">
                    <span className="font-mono text-5xl md:text-7xl lg:text-8xl text-accent/20 group-hover:text-accent transition-colors duration-1000 select-none">
                      {reason.num}
                    </span>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 max-w-4xl pt-4">
                    <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-fg mb-8 group-hover:text-white transition-colors duration-500 tracking-[-0.03em] leading-tight">
                      {reason.title}
                    </h3>
                    <div className="w-12 h-[1px] bg-accent/50 mb-12 group-hover:w-full transition-all duration-1000 ease-in-out" />
                    <p className="text-xl md:text-3xl text-fg-muted font-light leading-relaxed max-w-3xl">
                      {reason.body}
                    </p>
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
