import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <span className="font-mono text-xs tracking-widest uppercase text-accent mb-4">404</span>
      <h1 className="text-4xl md:text-6xl font-light text-fg mb-4">Page not found</h1>
      <p className="text-fg-muted mb-8 max-w-sm">
        This page does not exist or has been moved.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm text-white hover:bg-accent-light transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="text-sm text-fg-muted hover:text-fg transition-colors"
        >
          Contact us
        </Link>
      </div>
    </div>
  )
}
