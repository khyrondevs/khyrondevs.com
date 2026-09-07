import { HeroSection } from '@/components/sections/home/hero'
import { CapabilitySection } from '@/components/sections/home/capability'
import { ServicesSection } from '@/components/sections/home/services'
import { WorkSection } from '@/components/sections/home/work'
import { WhyUsSection } from '@/components/sections/home/why-us'
import { TechStackSection } from '@/components/sections/home/tech-stack'
import { AboutSection } from '@/components/sections/home/about-section'
import { CtaSection } from '@/components/sections/home/cta-section'
import { ProcessSectionDynamic } from '@/components/sections/home/process-section-dynamic'
import { SceneTransition } from '@/components/ui/scene-transition'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SceneTransition type="line-drop" />
      <CapabilitySection />
      <SceneTransition type="grid-fade" />
      <ServicesSection />
      <SceneTransition type="line-drop" />
      <WorkSection />
      <SceneTransition type="signal-cross" />
      <WhyUsSection />
      <SceneTransition type="grid-fade" />
      <ProcessSectionDynamic />
      <SceneTransition type="line-drop" />
      <TechStackSection />
      <SceneTransition type="grid-fade" />
      <AboutSection />
      <CtaSection />
    </>
  )
}
