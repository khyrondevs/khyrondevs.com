export type ProjectStatus = 'self-initiated' | 'client' | 'concept' | 'open-source'

export type GalleryItem = {
  src: string
  label: string
  theme?: "Light" | "Dark"
}

export type ProjectLink = {
  label: string
  href: string
  kind: "live" | "github" | "api" | "docs"
}

export type Metric = {
  label: string
  value: string
}

export type Project = {
  slug: string
  title: string
  status: ProjectStatus
  statusLabel: string
  category: string
  badge?: string
  problem: string
  solution: string
  summary?: string
  highlights?: string[]
  keyDecisions: string[]
  stack: string[]
  metrics?: Metric[]
  links?: ProjectLink[]
  gallery?: GalleryItem[]
  result?: string
  featured: boolean
  coverDescription: string
  year: number
}

export const projects: Project[] = [
  {
    slug: 'cyphr',
    title: 'CYPHR',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'AI / RAG',
    problem: 'Standard search returns documents, not answers. Answers needed to be strictly grounded in user-uploaded documents with verifiable provenance.',
    solution: 'A document-grounded RAG platform where PDFs are extracted, chunked, embedded via Jina Embeddings v3, and indexed in MongoDB Atlas Vector Search. Answers cite the exact source file and page.',
    summary: 'A retrieval-augmented chat platform that answers strictly from documents you upload. PDFs are extracted, chunked and embedded into MongoDB Atlas vector search; every answer cites the source file and page it came from.',
    highlights: [
      'MongoDB Atlas Vector Search over Jina Embeddings v3',
      'Configurable LLM providers with runtime model selection',
      'FastAPI service layer with Google OAuth and CSRF boundaries'
    ],
    keyDecisions: [
      'MongoDB Atlas Vector Search over dedicated vector stores for stack consolidation',
      'Runtime model selection across 6 dynamic LLM providers',
      'Per-user tenant isolation with strict OAuth 2.0 and CSRF boundaries'
    ],
    stack: ['FastAPI', 'React', 'MongoDB Atlas', 'Vector Search', 'Jina Embeddings'],
    metrics: [
      { label: 'Security & Regression', value: '125 tests' }
    ],
    links: [
      { label: 'Open CYPHR', href: 'https://cyphr-rag.vercel.app/', kind: 'live' },
      { label: 'View source', href: 'https://github.com/Vittal-17/CYPHR-RAG', kind: 'github' }
    ],
    gallery: [
      { src: '/images/cyphr/dark/6_chat_response.png', label: 'Grounded answer with citation', theme: 'Dark' },
      { src: '/images/cyphr/dark/7_new_chat.png', label: 'Workspace with indexed document', theme: 'Dark' },
      { src: '/images/cyphr/dark/5_knowledge_base.png', label: 'Knowledge base — PDF ingestion', theme: 'Dark' }
    ],
    featured: true,
    coverDescription: 'A document-grounded RAG platform that answers strictly from uploaded PDFs, providing exact file and page citations.',
    year: 2026,
  },
  {
    slug: 'jobpilot',
    title: 'JobPilot',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'Automation Systems',
    problem: 'Business teams were manually copying data between systems. Provider noise needed to be turned into a daily, fresher-friendly stream without manual intervention.',
    solution: 'A fully autonomous job-hunt platform deployed on Oracle Cloud. FastAPI and PostgreSQL own provider ingestion, canonical deduplication, enrichment, fresher eligibility, and match scoring.',
    summary: 'JobPilot turns provider noise into a daily, fresher-friendly stream without asking the operator to manually search every source.',
    keyDecisions: [
      'Multi-provider job discovery with source-level and canonical deduplication',
      'Deterministic eligibility and preference-based matching',
      'Exact-SHA ARM64 deployment with pre-migration backup and restore verification'
    ],
    stack: ['FastAPI', 'PostgreSQL 16', 'React 19', 'Docker', 'n8n'],
    metrics: [
      { label: 'Automated tests', value: '590 tests' }
    ],
    links: [
      { label: 'Live Platform', href: 'https://jobpilot.cfd', kind: 'live' }
    ],
    gallery: [
      { src: '/images/jobpilot/Today.png', label: 'Today / live recommendations' },
      { src: '/images/jobpilot/Jobs.png', label: 'Jobs / normalized archive' },
      { src: '/images/jobpilot/Search_Vectors.png', label: 'Search vectors / operator intent' }
    ],
    featured: true,
    coverDescription: 'An autonomous job intelligence platform featuring multi-provider discovery and deterministic matching.',
    year: 2026,
  },
  {
    slug: 'eazyshop',
    title: 'EazyShop',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'Production Full-Stack',
    problem: 'E-commerce platforms require robust lifecycle management spanning authentication, payments, and administrative oversight without compromising performance.',
    solution: 'A database-backed Django REST and React commerce platform covering the complete shopping lifecycle alongside comprehensive administrative workflows and audit logging.',
    summary: 'A database-backed Django REST + React commerce platform covering the full shopping lifecycle — authentication, catalogue, cart, wishlist, checkout, payments, and reviews.',
    keyDecisions: [
      'Isolated application boundaries separating customer storefronts from admin workflows',
      'Comprehensive audit logging for all transactional states'
    ],
    stack: ['Django', 'React', 'SQL', 'REST API'],
    links: [
      { label: 'Open live app', href: 'https://django-react-ecommerce-platform.vercel.app', kind: 'live' },
      { label: 'View source', href: 'https://github.com/Vittal-17/django-react-ecommerce-platform', kind: 'github' }
    ],
    gallery: [
      { src: '/images/eazyshop/eazyshop_home.png', label: 'Home' },
      { src: '/images/eazyshop/products.png', label: 'Products' },
      { src: '/images/eazyshop/checkout1.png', label: 'Checkout' }
    ],
    featured: true,
    coverDescription: 'A production-grade e-commerce platform covering the full shopping lifecycle and administrative workflows.',
    year: 2026,
  },
  {
    slug: 'ai-house-price-estimator',
    title: 'AI House Price Estimator',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'Applied Machine Learning',
    problem: 'Machine learning models are often trapped in notebooks. This required an end-to-end deployment of an evaluated model through a functional API and interface.',
    solution: 'An end-to-end machine learning application predicting California house prices. Tuned Random Forest model deployed via FastAPI and React.',
    summary: 'Random Forest + FastAPI + React, tuned with GridSearchCV and deployed on Render and Vercel.',
    keyDecisions: [
      'GridSearchCV hyperparameter tuning resulting in an R² of 0.8062',
      'Axios API communication with animated prediction results and toast notifications'
    ],
    stack: ['Python', 'Scikit-learn', 'FastAPI', 'React'],
    metrics: [
      { label: 'Accuracy', value: 'R² 0.8062' }
    ],
    links: [
      { label: 'Open live app', href: 'https://aihouseprice.vercel.app', kind: 'live' },
      { label: 'View source', href: 'https://github.com/Vittal-17/ai-house-price-estimator', kind: 'github' },
      { label: 'API docs', href: 'https://aihouseprice.onrender.com/docs', kind: 'docs' }
    ],
    gallery: [
      { src: '/images/aihouseprice/home.png', label: 'Home' },
      { src: '/images/aihouseprice/predicted_price.png', label: 'Prediction Result' }
    ],
    featured: true,
    coverDescription: 'A tuned Random Forest regression model deployed via a FastAPI backend and React frontend.',
    year: 2026,
  }
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
