export interface TeamMember {
  id: string
  name: string
  role: string
  credentials: string
  tagline: string
  focus: string[]
  email: string
  portfolioUrl?: string
  portfolioStatus: 'live' | 'deploying'
  socials: {
    github?: string
    linkedin?: string
    instagram?: string
  }
}

export const teamMembers: TeamMember[] = [
  {
    id: 'vittal',
    name: 'Vittal',
    role: 'Lead Systems & Full-Stack Architect',
    credentials: 'BCA',
    tagline:
      'Engineering interactive platforms, scalable edge runtimes, and design systems with mathematical precision.',
    focus: ['React / Next.js', 'Interactive 3D / GSAP', 'Edge Architecture', 'Design Systems'],
    email: 'vittal@khyrondevs.com',
    portfolioUrl: 'https://vittal-dev.vercel.app/',
    portfolioStatus: 'live',
    socials: {
      github: 'https://github.com/Vittal-17',
      linkedin: 'https://www.linkedin.com/in/vittal-dev/',
      instagram: 'https://www.instagram.com/it.is._v/',
    },
  },
  {
    id: 'gowtham',
    name: 'Gowtham R',
    role: 'Compute & Distributed Backend Engineer',
    credentials: 'BCA · MCA Candidate',
    tagline:
      'Architecting high-throughput distributed APIs, database persistence layers, and fault-tolerant cloud backends.',
    focus: ['Distributed APIs', 'Database Internals', 'System Reliability', 'Cloud Infrastructure'],
    email: 'gowtham@khyrondevs.com',
    portfolioStatus: 'deploying',
    socials: {
      github: 'https://github.com/Gowthamr1',
      linkedin: 'https://www.linkedin.com/in/gowtham-r-8a1450410/',
      instagram: 'https://www.instagram.com/gtham4708/',
    },
  },
  {
    id: 'gurupavan',
    name: 'Gurupavan BR',
    role: 'Business Intelligence & Data Strategist',
    credentials: 'B.Com · Big Data Analytics',
    tagline:
      'Translating commercial business models, financial logic, and big data intelligence into software that drives measurable ROI.',
    focus: ['Commercial Logic & ROI', 'Financial Systems', 'Big Data Modeling', 'Analytics Pipelines'],
    email: 'gurupavan@khyrondevs.com',
    portfolioStatus: 'deploying',
    socials: {
      instagram: 'https://www.instagram.com/gurupavan_22/',
    },
  },
]
