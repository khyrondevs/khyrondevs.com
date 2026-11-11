export type NavLink = { label: string; href: string }

export interface NetworkChannel {
  id: string
  label: string
  href: string
  active: boolean
  external: boolean
}

export type SiteConfig = {
  name: string
  tagline: string
  description: string
  url: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  navLinks: NavLink[]
  footerLinks: NavLink[]
  networkChannels: NetworkChannel[]
  contact: {
    email: string
    github: string
    twitter?: string
    linkedin?: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'KHYRON DEVS',
  tagline: 'Engineering-led digital products.',
  description:
    'We build full-stack web applications, AI systems, and workflow automation — engineered around the problem, not around a template.',
  url: 'https://khyrondevs.com',
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
  networkChannels: [
    {
      id: 'email',
      label: 'Direct / Email',
      href: 'mailto:enquiries@khyrondevs.com',
      active: true,
      external: false,
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/khyrondevs',
      active: true,
      external: true,
    },
    {
      id: 'twitter',
      label: 'X (Twitter)',
      href: 'https://twitter.com/khyrondevs',
      active: false,
      external: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/khyrondevs',
      active: false,
      external: true,
    },
  ],
  contact: {
    email: 'enquiries@khyrondevs.com',
    github: 'https://github.com/khyrondevs',
    // Twitter and LinkedIn official accounts will activate in networkChannels when registered
  },
}
