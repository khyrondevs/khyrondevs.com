import { HeroSection } from '@/components/sections/home/hero'
import { CapabilitySection } from '@/components/sections/home/capability'
import { ServicesSection } from '@/components/sections/home/services'
import { WorkSection } from '@/components/sections/home/work'
import { WhyUsSection } from '@/components/sections/home/why-us'
import { TechStackSection } from '@/components/sections/home/tech-stack'
import { CtaSection } from '@/components/sections/home/cta-section'
import { ProcessSectionDynamic } from '@/components/sections/home/process-section-dynamic'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilitySection />
      <ServicesSection />
      <WorkSection />
      <WhyUsSection />
      <ProcessSectionDynamic />
      <TechStackSection />
      <CtaSection />
    </>
  )
}
