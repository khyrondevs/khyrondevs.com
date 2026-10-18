export type Service = {
  id: string
  icon: string // lucide-react icon name as string, e.g. 'Globe'
  title: string
  tagline: string
  description: string
  outcomes: string[] // 3 outcome statements
  href: string
}

export const services: Service[] = [
  {
    id: 'web',
    icon: 'Globe',
    title: 'Full-Stack Web Applications',
    tagline: 'From architecture to deployment.',
    description:
      'We design and build production web applications end-to-end — database schema, API design, frontend, infrastructure, and CI/CD. Opinionated where it matters, pragmatic everywhere else.',
    outcomes: [
      'Ship faster with a codebase you can actually maintain',
      'Performance budgets enforced from day one',
      'Scalable architecture that does not outgrow the team',
    ],
    href: '/services#web',
  },
  {
    id: 'ai',
    icon: 'Brain',
    title: 'AI & RAG Systems',
    tagline: 'Knowledge bases that think in your domain.',
    description:
      'We build retrieval-augmented generation pipelines, fine-tuned language model integrations, and AI-powered workflows — grounded in your data, not in hallucinations.',
    outcomes: [
      'AI that reasons about your actual business context',
      'Explainable answers with traceable sources',
      'Integrated with your existing systems without replatforming',
    ],
    href: '/services#ai',
  },
  {
    id: 'automation',
    icon: 'Workflow',
    title: 'Workflow Automation',
    tagline: 'Systems that run so your team does not have to.',
    description:
      'We map, automate, and monitor the repetitive business processes consuming engineering and operational time — from data pipelines to document processing to cross-system synchronisation.',
    outcomes: [
      'Eliminate manual hand-offs that introduce errors',
      'Observable pipelines with clear failure modes',
      'Built on tools you already own where possible',
    ],
    href: '/services#automation',
  },
  {
    id: 'custom',
    icon: 'Code2',
    title: 'Custom Software',
    tagline: 'Built around the problem, not around a template.',
    description:
      'When off-the-shelf does not fit the actual problem, we build the right tool — internal tools, developer platforms, data dashboards, integrations, and anything that falls between categories.',
    outcomes: [
      'Purpose-built tools that fit the exact workflow',
      'No licensing constraints or vendor lock-in',
      'Delivered with documentation and transfer knowledge',
    ],
    href: '/services#custom',
  },
  {
    id: 'mobile',
    icon: 'Smartphone',
    title: 'Mobile App Development',
    tagline: 'High-performance native & cross-platform apps for iOS & Android.',
    description:
      'We engineer polished, responsive mobile applications for iOS and Android — from native Swift/Kotlin performance to universal Flutter and React Native architectures. Fluid 120Hz gesture interactions, offline-first sync, and rock-solid App Store deployment.',
    outcomes: [
      'Universal iOS & Android parity with a unified, clean codebase',
      'Fluid 120fps gesture-driven animations and native UX responsiveness',
      'End-to-end App Store & Google Play submission with zero release friction',
    ],
    href: '/services#mobile',
  },
]
