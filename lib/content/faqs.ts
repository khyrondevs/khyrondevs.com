export type Faq = {
  id: string
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    id: 'engagement-size',
    question: 'What size of project do you typically work on?',
    answer:
      'We work best on projects that have real complexity — whether that is a greenfield application with multiple integrations, an AI system that needs to be grounded in proprietary data, or a workflow that spans several systems. We prefer engagements where the problem is well-defined but the right solution is not yet obvious.',
  },
  {
    id: 'timeline',
    question: 'How long does a typical project take?',
    answer:
      'Scope determines timeline more than anything else. A focused automation or integration project can be complete in 4–8 weeks. A full-stack web application with custom AI features typically takes 3–5 months. We give more specific estimates after the discovery phase, once scope is defined.',
  },
  {
    id: 'process',
    question: 'How do you work with clients during the project?',
    answer:
      'You see working software regularly — not a big reveal at the end. We use short build cycles, written progress updates, and async-first communication. You are involved in decisions that affect scope or direction. You are not required to attend daily standups.',
  },
  {
    id: 'tech-stack',
    question: 'Do you work with a specific technology stack?',
    answer:
      'We have strong opinions about quality and architecture, not about specific tools. Our common stack includes TypeScript, Next.js, PostgreSQL, and cloud infrastructure, but we adapt to the problem and the existing technical context. We document our technology choices and the reasoning behind them.',
  },
  {
    id: 'handoff',
    question: 'What happens when the project is done?',
    answer:
      'We transfer ownership fully. That means code in your repository, infrastructure in your accounts, documented runbooks, and a knowledge-transfer session. We do not build systems that require us to maintain them — unless you want a retained relationship for ongoing work.',
  },
  {
    id: 'pricing',
    question: 'How do you price your work?',
    answer:
      'We typically work on a fixed-scope fixed-price basis after the discovery phase. For longer-term or evolving engagements, we can work on a time-and-materials retainer. We are transparent about what changes scope and what does not.',
  },
]
