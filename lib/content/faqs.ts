export type Faq = {
  id: string
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    id: 'project-types',
    question: 'What kind of projects do you take on?',
    answer:
      'We build web and mobile apps, AI tools, and workflow automations. We also help improve existing software and connect it to other tools.',
  },
  {
    id: 'message',
    question: 'What should I include in my message?',
    answer:
      'Tell us what you’re trying to build or improve, who it’s for, and whether you have a deadline. A few sentences are enough to get started.',
  },
  {
    id: 'budget',
    question: 'Do I need a budget before reaching out?',
    answer:
      'You can leave the budget field blank. If you have a range in mind, sharing it helps us suggest what’s realistic.',
  },
  {
    id: 'timeline',
    question: 'How long will my project take?',
    answer:
      'A focused automation or integration can take 4–8 weeks. A custom web app with AI features typically takes 3–5 months. We’ll give you a clearer estimate once we understand the scope.',
  },
  {
    id: 'next-step',
    question: 'What happens after I send a message?',
    answer:
      'We’ll review what you shared, let you know if we’re a good fit, and suggest a next step.',
  },
  {
    id: 'handoff',
    question: 'Will I own the code after launch?',
    answer:
      'Yes. We hand over the code, infrastructure, and documentation so your team can run the project.',
  },
]
