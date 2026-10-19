import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { projects } from '../lib/content/projects.ts'
import { siteConfig } from '../lib/content/site-config.ts'

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

async function checkServerReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(1500) })
    return res.status >= 200 && res.status < 500
  } catch {
    return false
  }
}

function extractInternalLinks(html: string): string[] {
  const matches = html.matchAll(/href="([^"#?]+)(?:[#?][^"]*)?"/g)
  const links: string[] = []
  for (const match of matches) {
    const rawHref = match[1]
    if (!rawHref) continue
    if (
      rawHref.startsWith('http://') ||
      rawHref.startsWith('https://') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:')
    ) {
      continue
    }
    if (
      rawHref.startsWith('/_next') ||
      rawHref.startsWith('/favicon') ||
      rawHref.endsWith('.ico') ||
      rawHref.endsWith('.png') ||
      rawHref.endsWith('.jpg') ||
      rawHref.endsWith('.svg') ||
      rawHref.endsWith('.css') ||
      rawHref.endsWith('.js')
    ) {
      continue
    }
    if (rawHref.startsWith('/')) {
      links.push(rawHref)
    }
  }
  return [...new Set(links)]
}

describe('Zero-Dead-Link Route Crawler & Security Cloaking Suite', async () => {
  const isOnline = await checkServerReachable(BASE_URL)

  describe('Static Route Catalog & Architecture Invariants', () => {
    it('contains all 6 required production case studies with complete metadata', () => {
      const expectedSlugs = [
        'cyphr',
        'cinemora',
        'jobpilot',
        'eazyshop',
        'ai-house-price-estimator',
        'online-lms',
      ]
      const actualSlugs = projects.map((p) => p.slug)

      for (const expected of expectedSlugs) {
        assert.ok(
          actualSlugs.includes(expected),
          `Missing required case study: "${expected}"`
        )
      }

      for (const project of projects) {
        assert.ok(project.title && project.title.length > 0, `Project ${project.slug} missing title`)
        assert.ok(project.problem && project.problem.length > 20, `Project ${project.slug} missing problem`)
        assert.ok(project.solution && project.solution.length > 20, `Project ${project.slug} missing solution`)
        assert.ok(Array.isArray(project.stack) && project.stack.length > 0, `Project ${project.slug} missing stack`)
      }
    })

    it('siteConfig defines clean navigation and contact points', () => {
      assert.ok(siteConfig.name === 'KHYRON DEVS')
      assert.ok(siteConfig.navLinks.length >= 4)
      assert.ok(siteConfig.footerLinks.length >= 4)
      for (const link of siteConfig.navLinks) {
        assert.ok(link.href.startsWith('/'), `Nav link ${link.label} must be relative: ${link.href}`)
      }
    })
  })

  if (!isOnline) {
    it('skips live HTTP network crawl when server is offline', (t) => {
      t.skip(`Live Next.js server not running at ${BASE_URL}. Run 'npm run dev' to perform live crawler assertions.`)
    })
    return
  }

  describe('Live Route Status Verification (HTTP 200 OK)', () => {
    const staticRoutes = ['/', '/about', '/services', '/process', '/contact', '/work']

    for (const route of staticRoutes) {
      it(`route "${route}" responds with HTTP 200 OK`, async () => {
        const res = await fetch(`${BASE_URL}${route}`)
        assert.equal(res.status, 200, `Expected 200 OK for ${route}, got ${res.status}`)
        const contentType = res.headers.get('content-type') || ''
        assert.ok(contentType.includes('text/html'), `Expected HTML content-type for ${route}`)
      })
    }

    for (const project of projects) {
      const route = `/work/${project.slug}`
      it(`case study "${route}" responds with HTTP 200 OK`, async () => {
        const res = await fetch(`${BASE_URL}${route}`)
        assert.equal(res.status, 200, `Expected 200 OK for ${route}, got ${res.status}`)
        const html = await res.text()
        assert.ok(html.includes(project.title), `HTML missing project title for ${project.slug}`)
      })
    }

    it('robots.txt responds with HTTP 200 and valid directives', async () => {
      const res = await fetch(`${BASE_URL}/robots.txt`)
      assert.equal(res.status, 200)
      const text = await res.text()
      assert.match(text, /User-Agent:\s*\*/i)
      assert.match(text, /Allow:\s*\//i)
      assert.match(text, /Sitemap:\s*https:\/\/khyrondevs\.com\/sitemap\.xml/i)
    })

    it('sitemap.xml responds with HTTP 200 and lists all core routes', async () => {
      const res = await fetch(`${BASE_URL}/sitemap.xml`)
      assert.equal(res.status, 200)
      const xml = await res.text()
      assert.match(xml, /<urlset/i)
      assert.match(xml, /<loc>https:\/\/khyrondevs\.com\/?<\/loc>/i)
      assert.match(xml, /<loc>https:\/\/khyrondevs\.com\/services<\/loc>/i)
      assert.match(xml, /<loc>https:\/\/khyrondevs\.com\/work<\/loc>/i)
      for (const p of projects) {
        assert.match(xml, new RegExp(`<loc>https:\\/\\/khyrondevs\\.com\\/work\\/${p.slug}<\\/loc>`))
      }
    })
  })

  describe('Stealth 404 & Cloaking Security Invariants', () => {
    it('GET /reply responds with stealth HTTP 404 when unauthenticated', async () => {
      const res = await fetch(`${BASE_URL}/reply`)
      assert.equal(res.status, 404, `Unauthenticated /reply must return 404, got ${res.status}`)
    })

    it('GET /api/reply responds with stealth HTTP 404', async () => {
      const res = await fetch(`${BASE_URL}/api/reply`)
      assert.equal(res.status, 404, `GET /api/reply must return 404, got ${res.status}`)
    })

    it('HEAD /api/reply responds with stealth HTTP 404', async () => {
      const res = await fetch(`${BASE_URL}/api/reply`, { method: 'HEAD' })
      assert.equal(res.status, 404, `HEAD /api/reply must return 404, got ${res.status}`)
    })

    it('POST /api/reply responds with stealth HTTP 404 when missing session cookie', async () => {
      const res = await fetch(`${BASE_URL}/api/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyMessage: 'Test reply unauthorized' }),
      })
      assert.equal(res.status, 404, `Unauthorized POST /api/reply must return 404, got ${res.status}`)
    })
  })

  describe('Enterprise HTTP Security Headers Invariants', () => {
    it('enforces strict HSTS and Content-Security-Policy headers on responses', async () => {
      const res = await fetch(`${BASE_URL}/`)
      assert.equal(res.status, 200)

      const hsts = res.headers.get('strict-transport-security') || ''
      assert.ok(hsts.includes('max-age=63072000'), 'HSTS missing 2-year max-age')
      assert.ok(hsts.includes('includeSubDomains'), 'HSTS missing includeSubDomains')
      assert.ok(hsts.includes('preload'), 'HSTS missing preload')

      const csp = res.headers.get('content-security-policy') || ''
      assert.ok(csp.includes("default-src 'self'"), "CSP missing default-src 'self'")
      assert.ok(csp.includes('https://challenges.cloudflare.com'), 'CSP missing Turnstile domain')
      assert.ok(csp.includes("frame-src 'self' https://challenges.cloudflare.com"), 'CSP missing Turnstile iframe permission')

      assert.equal(res.headers.get('x-frame-options'), 'DENY')
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff')
      assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin')
    })
  })

  describe('API Hardening & Finite Numeric Guard Invariants', () => {
    it('POST /api/predict rejects non-finite values (NaN / Infinity / strings) with HTTP 400', async () => {
      const payloads = [
        { medInc: 'invalid' },
        { medInc: null },
      ]

      for (const payload of payloads) {
        const res = await fetch(`${BASE_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        assert.equal(res.status, 400, `Expected 400 for payload: ${JSON.stringify(payload)}`)
        const data = await res.json()
        assert.ok(data.error)
      }
    })

    it('POST /api/predict accepts valid features and returns calibrated prediction', async () => {
      const res = await fetch(`${BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medInc: 8.32,
          houseAge: 41.0,
          aveRooms: 6.98,
          latitude: 37.88,
          longitude: -122.23,
        }),
      })

      assert.equal(res.status, 200)
      const data = await res.json()
      assert.equal(data.status, 'success')
      assert.ok(typeof data.predicted_price === 'number')
      assert.ok(data.predicted_price >= 50000 && data.predicted_price <= 750000)
      assert.equal(data.currency, 'USD')
    })

    it('POST /api/contact neutralizes bots via honeypot without dispatching emails', async () => {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Automated Scraper',
          email: 'scraper@botnet.org',
          message: 'Buy high quality leads today only 99 dollars per thousand',
          hp_source: 'bot-injected-field',
        }),
      })

      assert.equal(res.status, 200)
      const data = await res.json()
      assert.equal(data.success, true)
      assert.equal(data.telemetry?.teamDispatched, false)
      assert.equal(data.telemetry?.clientDispatched, false)
    })
  })

  describe('Recursive Zero-Dead-Link Crawler', () => {
    it('crawls all internal links across the site and detects 0 broken links', async () => {
      const queue = ['/', '/about', '/services', '/process', '/contact', '/work']
      const visited = new Set<string>()
      const deadLinks: { url: string; from: string; status: number }[] = []

      while (queue.length > 0) {
        const currentPath = queue.shift()!
        if (visited.has(currentPath)) continue
        visited.add(currentPath)

        if (currentPath === '/reply' || currentPath.startsWith('/api/')) {
          continue
        }

        const res = await fetch(`${BASE_URL}${currentPath}`)
        if (!res.ok) {
          deadLinks.push({ url: currentPath, from: 'crawler-queue', status: res.status })
          continue
        }

        const html = await res.text()
        const discovered = extractInternalLinks(html)

        for (const link of discovered) {
          if (!visited.has(link) && !queue.includes(link)) {
            queue.push(link)
          }
        }
      }

      assert.equal(
        deadLinks.length,
        0,
        `Found broken links: ${JSON.stringify(deadLinks, null, 2)}`
      )
      assert.ok(visited.size >= 12, `Expected at least 12 unique routes crawled, visited ${visited.size}`)
    })
  })
})
