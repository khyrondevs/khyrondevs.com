export type ProjectStatus = 'self-initiated' | 'client' | 'concept' | 'open-source'

export type Project = {
  slug: string
  title: string
  status: ProjectStatus
  statusLabel: string // Human readable: 'Self-initiated build', 'Client project', etc.
  category: string
  problem: string
  solution: string
  keyDecisions: string[]
  stack: string[]
  result?: string // Only include if real and supportable
  featured: boolean
  coverDescription: string // Short description for card
  year: number
}

export const projects: Project[] = [
  // [PLACEHOLDER — Replace with a real project. Fill in all fields accurately.]
  {
    slug: 'rag-knowledge-platform',
    title: 'RAG Knowledge Platform',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'AI / RAG',
    problem:
      'Internal knowledge bases become stale and unsearchable as teams grow. Standard search returns documents, not answers.',
    solution:
      'Built a retrieval-augmented generation system that indexes structured and unstructured documents, maintains source traceability, and answers natural-language queries with grounded responses.',
    keyDecisions: [
      'Chose pgvector over a dedicated vector store to keep the stack footprint minimal',
      'Implemented chunking strategy with contextual overlap to preserve semantic coherence across section boundaries',
      'Used streaming responses to reduce perceived latency on longer answers',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'pgvector', 'OpenAI', 'LangChain', 'Vercel'],
    // result: undefined — no fabricated metrics
    featured: true,
    coverDescription: 'A self-initiated RAG system for structured knowledge retrieval with grounded, source-traceable answers.',
    year: 2025,
  },
  // [PLACEHOLDER — Replace with a real project.]
  {
    slug: 'workflow-automation-engine',
    title: 'Workflow Automation Engine',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'Automation',
    problem:
      'Business teams were manually copying data between three systems and creating errors. No API integration existed.',
    solution:
      'Designed and built an event-driven integration layer with retry logic, schema validation, and a monitoring dashboard — eliminating the manual hand-off entirely.',
    keyDecisions: [
      'Event-driven over polling to reduce latency and unnecessary compute',
      'Schema validation at ingestion boundary to catch mismatches before they propagate',
      'Observable by default: structured logs and alerting from day one',
    ],
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'BullMQ', 'Redis', 'React', 'Docker'],
    featured: true,
    coverDescription: 'An event-driven workflow engine that replaced a multi-step manual process with a validated, observable pipeline.',
    year: 2025,
  },
  // [PLACEHOLDER — Replace with a real project.]
  {
    slug: 'developer-dashboard',
    title: 'Internal Developer Dashboard',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'Full-Stack / Tooling',
    problem:
      'Engineering teams using multiple tools (CI, deployments, error tracking, databases) have no unified operational view.',
    solution:
      'Built a composable internal dashboard that aggregates signals from multiple sources — deployments, error rates, queue depths — into a single, permission-aware view.',
    keyDecisions: [
      'Plugin architecture so each data source is independently configurable',
      'Permission model at the data-source level, not just the UI level',
      'Server-side rendering for initial load; real-time updates via WebSocket',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'WebSocket', 'Docker'],
    featured: true,
    coverDescription: 'A composable internal dashboard that unifies deployment, error, and infrastructure signals into one operational view.',
    year: 2024,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
