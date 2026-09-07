export type ProcessStep = {
  step: number
  id: string
  title: string
  subtitle: string
  description: string
  details: string[]
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    id: 'discover',
    title: 'Discover',
    subtitle: 'Understand before we propose.',
    description:
      'We spend real time understanding the problem, the constraints, and the people involved before suggesting a solution. Most engagement problems start here.',
    details: [
      'Stakeholder interviews and workflow mapping',
      'Technical constraint and existing system audit',
      'Scope definition with explicit out-of-scope boundaries',
      'Risk identification and mitigation planning',
    ],
  },
  {
    step: 2,
    id: 'design',
    title: 'Design',
    subtitle: 'Architecture first, then aesthetics.',
    description:
      'System design, data models, API contracts, and component architecture happen before a line of production code is written. This is where expensive mistakes are caught cheaply.',
    details: [
      'System architecture and data modelling',
      'API and interface contract design',
      'Technology selection with documented rationale',
      'UI/UX wireframes and interaction design',
    ],
  },
  {
    step: 3,
    id: 'build',
    title: 'Build',
    subtitle: 'Disciplined iteration, visible progress.',
    description:
      'We build in short cycles with frequent checkpoints. You see real working software regularly, not a big reveal at the end. Code review, tests, and observability are not optional.',
    details: [
      'Iterative delivery with weekly working builds',
      'Code review, automated testing, and CI from the start',
      'Structured logging, error tracking, and monitoring',
      'Regular written progress updates',
    ],
  },
  {
    step: 4,
    id: 'ship',
    title: 'Ship',
    subtitle: 'Launch is a milestone, not an ending.',
    description:
      'Deployment is planned, not improvised. We handle production setup, load testing where relevant, and knowledge transfer so your team owns what we built.',
    details: [
      'Staging environment and pre-launch testing checklist',
      'Zero-downtime deployment strategy',
      'Runbook, documentation, and knowledge transfer',
      'Post-launch monitoring window and support plan',
    ],
  },
]
