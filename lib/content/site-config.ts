export type NavLink = { label: string; href: string }

export type SiteConfig = {
  name: string
  tagline: string
  description: string
  url: string // [PLACEHOLDER]
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  navLinks: NavLink[]
  footerLinks: NavLink[]
  contact: {
    email: string
    twitter: string // [PLACEHOLDER]
    github: string // [PLACEHOLDER]
    linkedin: string // [PLACEHOLDER]
  }
}

export const siteConfig: SiteConfig = {
  name: 'KRYPTON',
  tagline: 'Engineering-led digital products.',
  description:
    'We build full-stack web applications, AI systems, and workflow automation — engineered around the problem, not around a template.',
  url: 'https://krypton.dev', // [PLACEHOLDER — update when domain is confirmed]
  primaryCta: { label: 'Start a project', href: '/contact' },
  secondaryCta: { label: 'See our work', href: '/work' },
  navLinks: [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'Process', href: '/process' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footerLinks: [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'Process', href: '/process' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  contact: {
    email: 'hello@krypton.dev', // [PLACEHOLDER]
    twitter: 'https://twitter.com/kryptondev', // [PLACEHOLDER]
    github: 'https://github.com/kryptondev', // [PLACEHOLDER]
    linkedin: 'https://linkedin.com/company/kryptondev', // [PLACEHOLDER]
  },
}
