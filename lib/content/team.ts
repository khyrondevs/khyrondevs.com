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
    role: 'Lead Cloud, DevOps & AI Engineer',
    credentials: 'BCA',
    tagline:
      'Engineering secure, resilient software systems through cloud infrastructure, automated delivery pipelines, rigorous testing, and intelligent AI & RAG solutions.',
    focus: [
      'Cloud Infrastructure',
      'DevSecOps / CI-CD',
      'QA & Security',
      'Version Control',
      'AI & RAG Systems',
    ],
    email: 'vittal@khyrondevs.com',
    portfolioUrl: 'https://vittal.khyrondevs.com',
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
    role: 'Lead Full-Stack & Mobile Engineer',
    credentials: 'BCA · MCA Candidate',
    tagline:
      'Architecting intuitive digital products through refined UI/UX design, responsive frontend systems, scalable backend architectures, and cross-platform mobile applications.',
    focus: [
      'Frontend Engineering',
      'UI/UX Design',
      'Backend Architecture',
      'API Development',
      'Mobile Engineering',
    ],
    email: 'gowtham@khyrondevs.com',
    portfolioUrl: 'https://gowtham.khyrondevs.com',
    portfolioStatus: 'live',
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
    portfolioUrl: 'https://gurupavan.khyrondevs.com',
    portfolioStatus: 'live',
    socials: {
      linkedin: 'https://www.linkedin.com/in/gurupavan-b-r-88741b351',
      instagram: 'https://www.instagram.com/gurupavan_22/',
    },
  },
]
