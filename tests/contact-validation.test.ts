import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

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
}): { valid: boolean; error?: string } {
  if (!body.name || body.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' }
  }
  if (!body.email || !isValidEmail(body.email.trim())) {
    return { valid: false, error: 'A valid email address is required.' }
  }
  if (!body.message || body.message.trim().length < 20) {
    return { valid: false, error: 'Please describe your project in at least 20 characters.' }
  }
  if (body.phone && body.phone.trim().length > 0) {
    const trimmedPhone = body.phone.trim()
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
  formData: { name: string; email: string; phone: string; message: string },
  countryCode: string
): { valid: boolean; error?: string } {
  if (formData.name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' }
  }
  if (!isValidEmail(formData.email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' }
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
        'vittal.shenoy@khyrondevs.com',
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
        name: 'Vittal Shenoy',
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
})
