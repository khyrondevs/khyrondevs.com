/**
 * Enterprise URL Security & Normalization Utility
 *
 * Provides defense-in-depth against protocol smuggling (e.g. javascript:, data:)
 * and delivers clean, resilient hostname formatting for external badges.
 */

/**
 * Validates that a string is a valid, absolute HTTP or HTTPS URL.
 * Strictly blocks protocol smuggling vectors: javascript:, data:, vbscript:, file:, etc.
 */
export function isSafeHttpUrl(urlString: unknown): boolean {
  if (typeof urlString !== 'string') return false
  const trimmed = urlString.trim()
  if (!trimmed) return false

  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Extracts a clean, normalized domain hostname for UI presentation badges.
 * Strips protocols, credentials, port numbers, query strings, hashes, and leading 'www.'.
 *
 * Examples:
 *   "https://gowtham-portfolio-mauve.vercel.app/work?ref=khyron" -> "gowtham-portfolio-mauve.vercel.app"
 *   "https://www.gurupavanbr.vercel.app:443/" -> "gurupavanbr.vercel.app"
 *   "invalid-url" -> "invalid-url"
 */
export function getCleanDomain(urlString: string): string {
  if (!urlString || typeof urlString !== 'string') return ''
  const trimmed = urlString.trim()

  try {
    const parsed = new URL(trimmed)
    return parsed.hostname.replace(/^www\./i, '')
  } catch {
    // Resilient fallback for raw domain strings or unusual shapes
    return trimmed
      .replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '') // strip any protocol
      .split(/[\/?#:]/)[0] // take host part before path, query, hash, or port
      .replace(/^www\./i, '')
  }
}
