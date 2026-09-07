import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const whyReasons = [
  {
    num: '01',
    title: 'Engineering-first',
    body: 'Architecture and technical decisions come before tools and aesthetics. We design systems that are correct before they are impressive.',
  },
  {
    num: '02',
    title: 'Built around the problem',
    body: 'No template starts. We map the actual workflow, constraint, and edge cases before proposing a solution.',
  },
  {
    num: '03',
    title: 'Production-minded',
    body: 'What you get is production-quality code — tested, observed, documented, and owned by your team.',
  },
  {
    num: '04',
    title: 'No unnecessary complexity',
    body: 'You do not pay for features you will not use or libraries that add weight without adding value.',
  },
]

export function WhyUsSection() {
  return (
    <section className="section-padding bg-base relative">
      <div className="container-site relative z-10">
        <RevealOnScroll>
          <div className="mb-24 md:mb-32 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
                Manifesto
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-fg leading-[1.05] tracking-[-0.02em]">
              Engineering-first means something different here.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col">
          {whyReasons.map((reason, idx) => (
            <RevealOnScroll key={reason.num} delay={idx * 0.1} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start py-16 md:py-24 border-t border-border group hover:border-accent/40 transition-colors duration-700 relative overflow-hidden">
                
                {/* Structural Background Number */}
                <div className="absolute -left-4 -top-8 font-mono text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-accent/[0.02] group-hover:text-accent/[0.04] transition-colors duration-700 pointer-events-none select-none z-0">
                  {reason.num}
                </div>

                <div className="md:col-span-3 relative z-10 flex flex-col justify-between h-full">
                  <div className="font-mono text-xs tracking-[0.2em] uppercase text-accent/50 group-hover:text-accent transition-colors mb-4 md:mb-0">
                    Principle // {reason.num}
                  </div>
                </div>
                
                <div className="md:col-span-9 relative z-10">
                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-light text-fg mb-8 group-hover:text-accent transition-colors duration-500 tracking-[-0.02em]">
                    {reason.title}.
                  </h3>
                  <p className="text-xl md:text-2xl text-fg-muted font-light leading-relaxed max-w-4xl">
                    {reason.body}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
