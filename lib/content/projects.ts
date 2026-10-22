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
      { label: 'Live Platform', href: 'https://cyphr-rag.vercel.app/', kind: 'live' },
      { label: 'Source Code', href: 'https://github.com/Vittal-17/CYPHR-RAG', kind: 'github' }
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
    slug: 'cinemora',
    title: 'Cinemora',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'Distributed Systems & Real-Time',
    problem: 'High-demand ticket booking systems suffer from race conditions, double-booked seats under concurrency, and stale seat map synchronization across multiple client sessions.',
    solution: 'An enterprise-grade movie booking architecture powered by Django Channels WebSockets, Redis pub/sub, and PostgreSQL row-level locks (SELECT ... FOR UPDATE). Pushes instant seat state deltas to connected clients and secures physical entry with cryptographic, unguessable QR codes.',
    summary: 'Real-time movie ticket reservation engine with WebSocket-synchronized seating maps, ACID transaction guarantees, unguessable ticket verification codes, and an analytics command center.',
    highlights: [
      'WebSocket seat synchronization over Django Channels & Redis channel layers',
      'ACID concurrency control via PostgreSQL SELECT ... FOR UPDATE row-exclusive locks',
      'Cryptographic door check-in system with unguessable secrets codes & in-app camera QR scanner',
      'Automated tiered refund engine with instant wallet ledger credit'
    ],
    keyDecisions: [
      'Derived seat state pushed via transaction.on_commit to eliminate stale delta drift upon client reconnection',
      'PostgreSQL SELECT ... FOR UPDATE row locking on showtimes to guarantee zero double-booking under burst traffic',
      'Secrets-generated 10-character unguessable alphanumeric ticket credentials excluding ambiguous characters (I, O, 0, 1)',
      'Compound database indexes matching production query access patterns for O(1) gate check-in and seat availability sweeps'
    ],
    stack: ['Django Channels', 'WebSockets', 'PostgreSQL', 'React 19', 'Redis', 'Daphne', 'Tailwind CSS'],
    metrics: [
      { label: 'Seat Concurrency', value: '0 Double-Bookings' },
      { label: 'Hold Expiration TTL', value: '15 Minutes' },
      { label: 'Gate Lookup Speed', value: '<5ms Indexed' }
    ],
    links: [
      { label: 'Live Platform', href: 'https://cinemora-alpha.vercel.app/', kind: 'live' },
      { label: 'Source Code', href: 'https://github.com/Gowthamr1/Cinemora', kind: 'github' },
      { label: 'API Backend', href: 'https://cinemora-6r4q.onrender.com/api/', kind: 'api' }
    ],
    gallery: [
      { src: '/images/cinemora/Screenshot_2026-10-17_185403.png', label: 'Real-Time Interactive Seat Grid (WebSockets)' },
      { src: '/images/cinemora/Screenshot_2026-10-17_184922.png', label: 'Movie Catalog & Premiere Discovery' },
      { src: '/images/cinemora/Screenshot_2026-10-17_184942.png', label: 'Digital Bookings Ledger & Ticket Wallet' },
      { src: '/images/cinemora/Screenshot_2026-10-17_185116.png', label: 'Admin Command Center & Revenue Ledger' },
      { src: '/images/cinemora/Screenshot_2026-10-17_185206.png', label: 'Multi-Tier Auditorium Seating & Pricing Matrix' },
      { src: '/images/cinemora/Screenshot_2026-10-17_185247.png', label: 'Demand Forecasting & Real-Time Analytics' }
    ],
    featured: true,
    coverDescription: 'A high-concurrency movie booking platform featuring WebSocket seat synchronization and ACID-guaranteed reservations.',
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
      { label: 'Live Platform', href: 'https://jobpilot.cfd/', kind: 'live' },
      { label: 'Source Code', href: 'https://github.com/Vittal-17/Jobpilot', kind: 'github' }
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
      { label: 'Live Storefront', href: 'https://eazyshop-store.vercel.app/', kind: 'live' },
      { label: 'Source Code', href: 'https://github.com/Vittal-17/EazyShop', kind: 'github' }
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
      { label: 'Live Predictor', href: 'https://aihouseprice.vercel.app/', kind: 'live' },
      { label: 'Source Code', href: 'https://github.com/Vittal-17/ai-house-price-estimator', kind: 'github' },
      { label: 'API docs', href: 'https://aihouseprice.onrender.com/docs', kind: 'docs' }
    ],
    gallery: [
      { src: '/images/aihouseprice/home.png', label: 'Home' },
      { src: '/images/aihouseprice/predicted_price.png', label: 'Prediction Result' }
    ],
    featured: true,
    coverDescription: 'A tuned Random Forest regression model deployed via a FastAPI backend and React frontend.',
    year: 2026,
  },
  {
    slug: 'online-lms',
    title: 'Online LMS',
    status: 'self-initiated',
    statusLabel: 'Self-initiated technical build',
    category: 'Full-Stack EdTech Platform',
    problem: 'Modern online education systems require rigid role isolation across students, instructors, and administrators, accompanied by verifiable proof of course completion that cannot be forged.',
    solution: 'A production-ready LMS platform built on Django REST Framework and React. Features granular three-tier RBAC, structured multi-module curriculum authoring, in-platform automated quiz grading, simulated checkout, and automated ReportLab PDF certificate generation with cryptographic UUID verification and QR codes.',
    summary: 'A full-stack learning management system featuring 3-tier RBAC, curriculum lesson streaming, progress tracking gates, and automated PDF certificate generation with scannable QR verification.',
    highlights: [
      'Granular 3-tier Role-Based Access Control (Student, Instructor, Administrator)',
      'Automated vector PDF certificate generation via ReportLab with embedded verification QR',
      'Curriculum authoring engine with lesson sequencing and progress tracking gates',
      'In-platform automated MCQ quiz engine for skill evaluation and course completion gating'
    ],
    keyDecisions: [
      'Isolated permission boundaries in DRF custom middleware preventing cross-role privilege escalation',
      'In-memory ReportLab canvas PDF generation with dynamic text fitting and QR verification payloads',
      'Atomic enrollment locking with simulated transaction ledger receipts before unlocking course materials',
      'Automated event-driven email service layer for enrollment confirmations and completion certificates'
    ],
    stack: ['Django REST Framework', 'React 18', 'ReportLab PDF', 'JWT Auth', 'Tailwind CSS', 'Recharts'],
    metrics: [
      { label: 'Role Isolation', value: '3-Tier RBAC' },
      { label: 'Certificate Engine', value: 'ReportLab Vector' },
      { label: 'Curriculum Tracking', value: '100% Progress Gate' }
    ],
    links: [
      { label: 'Live Portal', href: 'https://lms-django-react-one.vercel.app/', kind: 'live' },
      { label: 'Source Code', href: 'https://github.com/Gowthamr1/LMS-django-react', kind: 'github' }
    ],
    gallery: [
      { src: '/images/online_lms/Screenshot_2026-10-17_184130.png', label: 'Course Catalog & Interactive Learning Portal' },
      { src: '/images/online_lms/Screenshot_2026-10-17_184140.png', label: 'Platform Administration & Governance Console' },
      { src: '/images/online_lms/Screenshot_2026-10-17_184337.png', label: 'Curriculum & Course Management System' },
      { src: '/images/online_lms/Screenshot_2026-10-17_184500.png', label: 'RBAC User Access & Permission Controller' },
      { src: '/images/online_lms/Screenshot_2026-10-17_184656.png', label: 'Payment Ledger & Transaction Receipt History' },
      { src: '/images/online_lms/Screenshot_2026-10-17_184735.png', label: 'Student Dashboard & Progress Telemetry' }
    ],
    featured: true,
    coverDescription: 'A full-stack learning platform with granular RBAC, lesson progress gating, and dynamic ReportLab PDF certificate generation.',
    year: 2026,
  }
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}
