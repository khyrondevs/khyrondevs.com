import Link from 'next/link'
import { siteConfig } from '@/lib/content/site-config'

// ══════════════════════════════════════════════════════════════════════════════
// THE CONCEPT: THE SIGNATURE
//
// The credits. The final physical element of the homepage.
// Not a standard generic grid. An asymmetrical, meticulously composed archive.
//
// The CTA ended the conceptual journey. The footer exists purely to anchor
// the brand. The massive edge-to-edge KHYRON DEVS SVG creates an undeniable
// final baseline, resolving in a single tiny cyan point.
//
// Silence.
// ══════════════════════════════════════════════════════════════════════════════

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-base relative overflow-hidden w-full flex flex-col pt-32 md:pt-48 pb-8 px-6 md:px-12 border-t border-fg-subtle/10 text-fg">
      
      <div className="w-full flex flex-col md:flex-row justify-between items-end mb-24 md:mb-32 max-w-[1800px] mx-auto">
        
        {/* ── LEFT: SYSTEM INDICATOR ── */}
        <div className="hidden md:flex flex-col items-start gap-4 mb-8 md:mb-0">
          <div className="w-px h-32 bg-gradient-to-b from-cyan-400/50 to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-cyan-400">
            [ End of System ]
          </span>
        </div>

        {/* ── RIGHT: THE ARCHIVE ── */}
        <div className="flex flex-col md:flex-row gap-16 md:gap-32 w-full md:w-auto border-t border-fg-subtle/20 pt-12 md:border-none md:pt-0">
          
          {/* Index / Navigation */}
          <div className="flex flex-col gap-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-fg-subtle">
              System Index
            </span>
            <ul className="flex flex-col gap-3">
              {siteConfig.footerLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-fg-muted hover:text-fg transition-colors duration-300 flex items-center group py-1 outline-none focus-visible:text-cyan-400"
                  >
                    <span className="w-0 h-px bg-cyan-400 transition-all duration-300 ease-out mr-0 group-hover:w-3 group-hover:mr-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network / Contact */}
          <div className="flex flex-col gap-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-fg-subtle">
              Network
            </span>
            <ul className="flex flex-col gap-3">
              <li>
                <a 
                  href={`mailto:${siteConfig.contact.email}`} 
                  className="text-sm text-fg-muted hover:text-fg transition-colors duration-300 flex items-center group py-1 outline-none focus-visible:text-cyan-400"
                >
                  <span className="w-0 h-px bg-cyan-400 transition-all duration-300 ease-out mr-0 group-hover:w-3 group-hover:mr-3" />
                  Direct / Email
                </a>
              </li>
              <li>
                <a 
                  href={siteConfig.contact.github} 
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-fg-muted hover:text-fg transition-colors duration-300 flex items-center group py-1 outline-none focus-visible:text-cyan-400"
                >
                  <span className="w-0 h-px bg-cyan-400 transition-all duration-300 ease-out mr-0 group-hover:w-3 group-hover:mr-3" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href={siteConfig.contact.twitter} 
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-fg-muted hover:text-fg transition-colors duration-300 flex items-center group py-1 outline-none focus-visible:text-cyan-400"
                >
                  <span className="w-0 h-px bg-cyan-400 transition-all duration-300 ease-out mr-0 group-hover:w-3 group-hover:mr-3" />
                  X (Twitter)
                </a>
              </li>
              <li>
                <a 
                  href={siteConfig.contact.linkedin} 
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-fg-muted hover:text-fg transition-colors duration-300 flex items-center group py-1 outline-none focus-visible:text-cyan-400"
                >
                  <span className="w-0 h-px bg-cyan-400 transition-all duration-300 ease-out mr-0 group-hover:w-3 group-hover:mr-3" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── THE SIGNATURE ── */}
      <div className="w-full flex flex-col items-center max-w-[1800px] mx-auto">
        <div className="w-full h-px bg-fg-subtle/10 mb-8" />
        
        {/* Massive edge-to-edge SVG Wordmark guarantees perfect scaling on all devices */}
        <div className="w-full select-none" aria-hidden="true">
          <svg viewBox="0 0 1200 160" className="w-full h-auto block" preserveAspectRatio="xMidYMid meet">
            <text
              x="600"
              y="135"
              textAnchor="middle"
              className="text-[132px] font-light tracking-[-0.03em] uppercase fill-fg"
            >
              {siteConfig.name}
            </text>
          </svg>
        </div>
        
        {/* ── THE FINAL METADATA ── */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mt-8 md:mt-12 px-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted uppercase text-center md:text-left">
            © {year} {siteConfig.name} Digital Systems
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-fg-muted uppercase flex items-center justify-center gap-3">
            Engineered with precision
            {/* The final cyan point */}
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </span>
        </div>
      </div>

    </footer>
  )
}
