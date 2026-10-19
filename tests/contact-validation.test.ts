import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  checkRateLimit,
  resetRateLimits,
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_WINDOW,
  formatCooldownTime,
} from '../lib/rate-limiter.ts'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateContactPayload(body: {
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  budget?: string
  currency?: string
  hp_source?: string
}): { valid: boolean; error?: string; isHoneypot?: boolean } {
  if (body.hp_source && body.hp_source.trim().length > 0) {
    return { valid: true, isHoneypot: true }
  }
  if (!body.name || body.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' }
  }
  if (body.name.trim().length > 100) {
    return { valid: false, error: 'Name cannot exceed 100 characters.' }
  }
  if (!body.email || !isValidEmail(body.email.trim())) {
    return { valid: false, error: 'A valid email address is required.' }
  }
  if (body.email.trim().length > 100) {
    return { valid: false, error: 'Email address cannot exceed 100 characters.' }
  }
  if (!body.message || body.message.trim().length < 20) {
    return { valid: false, error: 'Please describe your project in at least 20 characters.' }
  }
  if (body.message.trim().length > 3000) {
    return { valid: false, error: 'Project description cannot exceed 3,000 characters.' }
  }
  if (body.company && body.company.trim().length > 100) {
    return { valid: false, error: 'Company name cannot exceed 100 characters.' }
  }
  if (body.budget && body.budget.trim().length > 50) {
    return { valid: false, error: 'Budget specification cannot exceed 50 characters.' }
  }
  if (body.phone && body.phone.trim().length > 0) {
    const trimmedPhone = body.phone.trim()
    if (trimmedPhone.length > 25) {
      return { valid: false, error: 'Phone number cannot exceed 25 characters.' }
    }
    const cleanDigits = trimmedPhone.replace(/\D/g, '')
    if (trimmedPhone.startsWith('+91')) {
      if (cleanDigits.length !== 12) {
        return {
          valid: false,
          error: 'Indian phone number (+91) must be exactly 10 digits excluding country code.',
        }
      }
    } else if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      return {
        valid: false,
        error: 'Please enter a valid phone number (7 to 15 digits).',
      }
    }
  }
  return { valid: true }
}

function validateClientForm(
  formData: { name: string; email: string; phone: string; message: string; company?: string },
  countryCode: string
): { valid: boolean; error?: string } {
  if (formData.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' }
  }
  if (formData.name.trim().length > 100) {
    return { valid: false, error: 'Name cannot exceed 100 characters.' }
  }
  if (!isValidEmail(formData.email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' }
  }
  if (formData.email.trim().length > 100) {
    return { valid: false, error: 'Email address cannot exceed 100 characters.' }
  }
  if (formData.company && formData.company.trim().length > 100) {
    return { valid: false, error: 'Company name cannot exceed 100 characters.' }
  }
  if (formData.phone.trim().length > 0) {
    if (countryCode === '+91' && formData.phone.trim().length !== 10) {
      return { valid: false, error: 'Indian phone numbers (+91) must be exactly 10 digits.' }
    }
    if (
      countryCode !== '+91' &&
      (formData.phone.trim().length < 7 || formData.phone.trim().length > 15)
    ) {
      return { valid: false, error: 'Please enter a valid phone number (7 to 15 digits).' }
    }
  }
  if (formData.message.trim().length < 20) {
    return { valid: false, error: 'Please describe your project in at least 20 characters.' }
  }
  if (formData.message.trim().length > 3000) {
    return { valid: false, error: 'Project description cannot exceed 3,000 characters.' }
  }
  return { valid: true }
}

function validateReplyPayload(
  clientEmail?: string,
  replyMessage?: string
): { valid: boolean; error?: string } {
  if (!clientEmail || !isValidEmail(clientEmail.trim())) {
    return { valid: false, error: 'Valid client email is required.' }
  }
  if (!replyMessage || replyMessage.trim().length < 5) {
    return { valid: false, error: 'Please enter a reply message of at least 5 characters.' }
  }
  return { valid: true }
}

describe('Contact Form & Input Validation Suite', () => {
  describe('Email RFC Validation', () => {
    it('accepts standard compliant emails', () => {
      const validEmails = [
        'contact@khyrondevs.com',
        'vittal.s@khyrondevs.com',
        'lead+project@client.co.uk',
        'info@subdomain.enterprise.org',
        'user_name@domain.tech',
      ]
      for (const email of validEmails) {
        assert.equal(isValidEmail(email), true, `Expected "${email}" to be valid`)
      }
    })

    it('rejects malformed email formats', () => {
      const invalidEmails = [
        '',
        '   ',
        'khyrondevs.com',
        '@khyrondevs.com',
        'contact@',
        'contact@khyrondevs',
        'contact @khyrondevs.com',
        'contact@ khyrondevs.com',
        'contact@@khyrondevs.com',
        'contact@.com',
      ]
      for (const email of invalidEmails) {
        assert.equal(isValidEmail(email), false, `Expected "${email}" to be invalid`)
      }
    })
  })

  describe('Indian Phone Validation (+91)', () => {
    it('accepts valid 10-digit Indian phone numbers with country code', () => {
      const validNumbers = [
        '+91 9876543210',
        '+919876543210',
        '+91 98765 43210',
        '+91-98765-43210',
      ]
      for (const phone of validNumbers) {
        const result = validateContactPayload({
          name: 'Priya Sharma',
          email: 'priya@example.in',
          message: 'We require a customized enterprise dashboard.',
          phone,
        })
        assert.equal(result.valid, true, `Expected "${phone}" to pass Indian phone validation`)
      }
    })

    it('rejects Indian phone numbers with fewer than 10 digits', () => {
      const shortPhones = ['+91 98765', '+91 987654321']
      for (const phone of shortPhones) {
        const result = validateContactPayload({
          name: 'Priya Sharma',
          email: 'priya@example.in',
          message: 'We require a customized enterprise dashboard.',
          phone,
        })
        assert.equal(result.valid, false)
        assert.match(result.error || '', /Indian phone number/i)
      }
    })

    it('rejects Indian phone numbers with more than 10 digits', () => {
      const longPhones = ['+91 98765432101', '+91 9876543210123']
      for (const phone of longPhones) {
        const result = validateContactPayload({
          name: 'Priya Sharma',
          email: 'priya@example.in',
          message: 'We require a customized enterprise dashboard.',
          phone,
        })
        assert.equal(result.valid, false)
        assert.match(result.error || '', /Indian phone number/i)
      }
    })

    it('validates client-side 10-digit input constraint for +91', () => {
      const validClient = validateClientForm(
        {
          name: 'Priya Sharma',
          email: 'priya@example.in',
          phone: '9876543210',
          message: 'We require a customized enterprise dashboard.',
        },
        '+91'
      )
      assert.equal(validClient.valid, true)

      const invalidClient = validateClientForm(
        {
          name: 'Priya Sharma',
          email: 'priya@example.in',
          phone: '987654321',
          message: 'We require a customized enterprise dashboard.',
        },
        '+91'
      )
      assert.equal(invalidClient.valid, false)
      assert.match(invalidClient.error || '', /must be exactly 10 digits/i)
    })
  })

  describe('International Phone Validation (Non-+91)', () => {
    it('accepts valid international numbers between 7 and 15 digits', () => {
      const validIntl = [
        '+1 415 555 2671', // US 11 digits
        '+44 20 7946 0958', // UK 12 digits
        '+65 6789 0123', // Singapore 10 digits
        '+971 50 123 4567', // UAE 12 digits
        '+49 30 123456', // Germany 8 digits
      ]
      for (const phone of validIntl) {
        const result = validateContactPayload({
          name: 'Arthur Dent',
          email: 'arthur@example.co.uk',
          message: 'Building a hyperspace travel booking engine.',
          phone,
        })
        assert.equal(result.valid, true, `Expected "${phone}" to pass international phone validation`)
      }
    })

    it('rejects international numbers with fewer than 7 digits', () => {
      const result = validateContactPayload({
        name: 'Arthur Dent',
        email: 'arthur@example.co.uk',
        message: 'Building a hyperspace travel booking engine.',
        phone: '+1 12345',
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /7 to 15 digits/i)
    })

    it('rejects international numbers exceeding 15 digits', () => {
      const result = validateContactPayload({
        name: 'Arthur Dent',
        email: 'arthur@example.co.uk',
        message: 'Building a hyperspace travel booking engine.',
        phone: '+1 1234567890123456',
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /7 to 15 digits/i)
    })
  })

  describe('Name & Message Boundaries', () => {
    it('rejects names shorter than 2 trimmed characters', () => {
      const shortNames = ['', ' ', '   ', 'A', ' X ']
      for (const name of shortNames) {
        const result = validateContactPayload({
          name,
          email: 'client@example.com',
          message: 'We require a customized enterprise dashboard.',
        })
        assert.equal(result.valid, false)
        assert.match(result.error || '', /Name must be at least 2 characters/i)
      }
    })

    it('accepts names with 2 or more characters', () => {
      const validNames = ['Al', 'Bo', '  Lin  ', 'Alexander Hamilton']
      for (const name of validNames) {
        const result = validateContactPayload({
          name,
          email: 'client@example.com',
          message: 'We require a customized enterprise dashboard.',
        })
        assert.equal(result.valid, true, `Expected name "${name}" to be accepted`)
      }
    })

    it('rejects messages shorter than 20 trimmed characters', () => {
      const shortMessages = [
        '',
        '   ',
        'Need a website',
        'Help build app',
        '1234567890123456789', // 19 chars
      ]
      for (const message of shortMessages) {
        const result = validateContactPayload({
          name: 'Sarah Connor',
          email: 'sarah@skynet-defense.org',
          message,
        })
        assert.equal(result.valid, false)
        assert.match(result.error || '', /at least 20 characters/i)
      }
    })

    it('accepts messages of exactly 20 characters and above', () => {
      const validMessages = [
        '12345678901234567890', // exactly 20 chars
        'We need a full rebuild of our real-time auction platform.',
      ]
      for (const message of validMessages) {
        const result = validateContactPayload({
          name: 'Sarah Connor',
          email: 'sarah@skynet-defense.org',
          message,
        })
        assert.equal(result.valid, true)
      }
    })
  })

  describe('Full Payload & Developer Reply Validation', () => {
    it('accepts valid complete contact payload with all optional fields', () => {
      const result = validateContactPayload({
        name: 'Vittal',
        email: 'vittal@khyrondevs.com',
        phone: '+91 9876543210',
        company: 'Khyron Devs',
        budget: '$15k - $30k',
        currency: 'USD',
        message: 'Architecting an ultra-secure client portal with zero-trust cookies.',
      })
      assert.equal(result.valid, true)
      assert.equal(result.error, undefined)
    })

    it('accepts valid minimal contact payload with optional fields omitted', () => {
      const result = validateContactPayload({
        name: 'Jane Doe',
        email: 'jane@startup.io',
        message: 'Looking for expert Next.js and Tailwind consultation.',
      })
      assert.equal(result.valid, true)
      assert.equal(result.error, undefined)
    })

    it('validates developer reply studio payload', () => {
      const validReply = validateReplyPayload(
        'client@example.com',
        'Hello, we have reviewed your specifications and are ready to schedule a kickoff call.'
      )
      assert.equal(validReply.valid, true)

      const invalidEmail = validateReplyPayload('notanemail', 'Valid reply message here')
      assert.equal(invalidEmail.valid, false)
      assert.match(invalidEmail.error || '', /Valid client email/i)

      const shortMessage = validateReplyPayload('client@example.com', 'hi')
      assert.equal(shortMessage.valid, false)
      assert.match(shortMessage.error || '', /at least 5 characters/i)
    })
  })

  describe('Invisible Honeypot Bot Trap', () => {
    it('silently traps bot when hp_source is filled', () => {
      const result = validateContactPayload({
        name: 'Spam Bot',
        email: 'spambot@automated.xyz',
        message: 'Cheap SEO services buy now discount code 1234567890',
        hp_source: 'automated_lead_generation_script',
      })
      assert.equal(result.valid, true)
      assert.equal(result.isHoneypot, true)
    })

    it('passes normal submission through when hp_source is absent or empty', () => {
      const resultEmpty = validateContactPayload({
        name: 'Real Human',
        email: 'human@corp.com',
        message: 'Looking for a bespoke cloud platform with high reliability.',
        hp_source: '',
      })
      assert.equal(resultEmpty.valid, true)
      assert.equal(resultEmpty.isHoneypot, undefined)
    })
  })

  describe('Payload Upper Bound Limits (Anti-DoS)', () => {
    it('rejects name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101)
      const result = validateContactPayload({
        name: longName,
        email: 'client@example.com',
        message: 'Valid project description that meets min length requirement.',
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /Name cannot exceed 100 characters/i)
    })

    it('rejects email exceeding 100 characters', () => {
      const longEmail = `${'a'.repeat(90)}@example.com` // > 100 chars
      const result = validateContactPayload({
        name: 'Valid Name',
        email: longEmail,
        message: 'Valid project description that meets min length requirement.',
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /Email address cannot exceed 100 characters/i)
    })

    it('rejects company name exceeding 100 characters', () => {
      const longCompany = 'C'.repeat(101)
      const result = validateContactPayload({
        name: 'Valid Name',
        email: 'client@example.com',
        company: longCompany,
        message: 'Valid project description that meets min length requirement.',
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /Company name cannot exceed 100 characters/i)
    })

    it('rejects budget description exceeding 50 characters', () => {
      const longBudget = 'B'.repeat(51)
      const result = validateContactPayload({
        name: 'Valid Name',
        email: 'client@example.com',
        budget: longBudget,
        message: 'Valid project description that meets min length requirement.',
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /Budget specification cannot exceed 50 characters/i)
    })

    it('rejects phone number exceeding 25 characters', () => {
      const longPhone = '+1 1234567890123456789012345'
      const result = validateContactPayload({
        name: 'Valid Name',
        email: 'client@example.com',
        phone: longPhone,
        message: 'Valid project description that meets min length requirement.',
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /Phone number cannot exceed 25 characters/i)
    })

    it('rejects message exceeding 3,000 characters', () => {
      const massiveMessage = 'M'.repeat(3001)
      const result = validateContactPayload({
        name: 'Valid Name',
        email: 'client@example.com',
        message: massiveMessage,
      })
      assert.equal(result.valid, false)
      assert.match(result.error || '', /cannot exceed 3,000 characters/i)
    })

    it('accepts message of exactly 3,000 characters', () => {
      const boundaryMessage = 'M'.repeat(3000)
      const result = validateContactPayload({
        name: 'Valid Name',
        email: 'client@example.com',
        message: boundaryMessage,
      })
      assert.equal(result.valid, true)
    })
  })

  describe('Sliding-Window IP Rate Limiter', () => {
    beforeEach(() => {
      resetRateLimits()
    })

    it('allows up to 3 requests within the sliding window', () => {
      const testIp = '198.51.100.42'
      const baseTime = 1700000000000

      assert.equal(MAX_REQUESTS_PER_WINDOW, 3)

      for (let i = 1; i <= MAX_REQUESTS_PER_WINDOW; i++) {
        const check = checkRateLimit(testIp, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, baseTime + i * 1000)
        assert.equal(check.allowed, true, `Request #${i} should be allowed`)
        assert.equal(check.retryAfter, undefined)
      }
    })

    it('blocks the 4th request within window with HTTP 429 Retry-After', () => {
      const testIp = '198.51.100.42'
      const baseTime = 1700000000000

      for (let i = 1; i <= MAX_REQUESTS_PER_WINDOW; i++) {
        checkRateLimit(testIp, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, baseTime + i * 1000)
      }

      // 4th request at +4 seconds
      const blocked = checkRateLimit(testIp, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, baseTime + 4000)
      assert.equal(blocked.allowed, false)
      assert.ok(blocked.retryAfter && blocked.retryAfter > 0)
    })

    it('allows requests again once the oldest request expires outside the window', () => {
      const testIp = '198.51.100.42'
      const baseTime = 1700000000000

      for (let i = 1; i <= MAX_REQUESTS_PER_WINDOW; i++) {
        checkRateLimit(testIp, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, baseTime + i * 1000)
      }

      // After 10 minutes + 2 seconds, the 1st request has expired
      const postWindowTime = baseTime + RATE_LIMIT_WINDOW_MS + 2000
      const allowedAfterWindow = checkRateLimit(testIp, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, postWindowTime)
      assert.equal(allowedAfterWindow.allowed, true)
    })

    it('isolates rate limits between distinct IP addresses', () => {
      const ip1 = '192.0.2.1'
      const ip2 = '192.0.2.2'
      const baseTime = 1700000000000

      // Exhaust limit for IP 1
      for (let i = 1; i <= MAX_REQUESTS_PER_WINDOW; i++) {
        checkRateLimit(ip1, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, baseTime + i * 1000)
      }
      assert.equal(checkRateLimit(ip1, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, baseTime + 4000).allowed, false)

      // IP 2 is unaffected
      const ip2Check = checkRateLimit(ip2, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS, baseTime + 4000)
      assert.equal(ip2Check.allowed, true)
    })
  })

  describe('Human-Readable Cooldown Time Formatter', () => {
    it('formats seconds into clean countdown strings', () => {
      assert.equal(formatCooldownTime(0), '0 sec')
      assert.equal(formatCooldownTime(-5), '0 sec')
      assert.equal(formatCooldownTime(10), '10 sec')
      assert.equal(formatCooldownTime(45), '45 sec')
      assert.equal(formatCooldownTime(60), '1 min')
      assert.equal(formatCooldownTime(125), '2 min 5 sec')
      assert.equal(formatCooldownTime(180), '3 min')
      assert.equal(formatCooldownTime(600), '10 min')
    })
  })
})
