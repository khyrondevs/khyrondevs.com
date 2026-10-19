export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
export const MAX_REQUESTS_PER_WINDOW = 3

/**
 * Formats seconds into a human-readable countdown string (e.g., "45 sec", "2 min 5 sec", "10 min").
 */
export function formatCooldownTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 sec'
  const seconds = Math.floor(totalSeconds)
  const minutes = Math.floor(seconds / 60)
  const remainingSecs = seconds % 60

  if (minutes === 0) {
    return `${remainingSecs} sec`
  }
  if (remainingSecs === 0) {
    return `${minutes} min`
  }
  return `${minutes} min ${remainingSecs} sec`
}

// In-memory sliding window IP store
const ipRequestTimestamps = new Map<string, number[]>()

export function checkRateLimit(
  ip: string,
  maxRequests: number = MAX_REQUESTS_PER_WINDOW,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
  now: number = Date.now()
): { allowed: boolean; retryAfter?: number } {
  const windowStart = now - windowMs
  const timestamps = (ipRequestTimestamps.get(ip) || []).filter((t) => t > windowStart)

  if (timestamps.length >= maxRequests) {
    const oldestInWindow = timestamps[0]
    const retryAfter = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000))
    ipRequestTimestamps.set(ip, timestamps)
    return { allowed: false, retryAfter }
  }

  timestamps.push(now)
  ipRequestTimestamps.set(ip, timestamps)

  // Periodic pruning of stale IPs if map grows large
  if (ipRequestTimestamps.size > 10000) {
    for (const [key, times] of ipRequestTimestamps.entries()) {
      const active = times.filter((t) => t > windowStart)
      if (active.length === 0) {
        ipRequestTimestamps.delete(key)
      } else {
        ipRequestTimestamps.set(key, active)
      }
    }
  }

  return { allowed: true }
}

export function resetRateLimits(): void {
  ipRequestTimestamps.clear()
}
