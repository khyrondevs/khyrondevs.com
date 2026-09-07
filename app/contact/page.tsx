import type { Metadata } from 'next'
import { ContactForm } from './contact-form'
import { faqs } from '@/lib/content/faqs'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project or ask a question. We respond to every serious enquiry.',
}

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="container-site">
        <div className="max-w-2xl mb-16 md:mb-24">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">Contact</span>
          <h1 className="mt-3 text-4xl md:text-6xl font-light text-fg text-balance">
            Let’s talk about your project
          </h1>
          <p className="mt-4 text-fg-muted leading-relaxed text-lg">
            Tell us what you are trying to accomplish. We will be direct about whether we are the right fit and what a realistic engagement looks like.
          </p>
        </div>
        <ContactForm faqs={faqs} />
      </div>
    </div>
  )
}
