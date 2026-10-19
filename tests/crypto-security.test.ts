import { test, describe } from 'node:test'
import assert from 'node:assert'
import {
  getSigningSecret,
  generateReplyToken,
  verifyReplyToken,
  generateReplyStudioUrl,
  sealReplySession,
  unsealReplySession,
  type ReplySession,
} from '../lib/crypto.ts'

describe('Cryptographic Security & Token Integrity', () => {
  const secret = 'test-secret-key-for-unit-testing-32b'
  const email = 'client.partner@company.com'
  const name = 'Partner Director'
  const futureExp = Math.floor(Date.now() / 1000) + 3600

  test('generates deterministic 64-character SHA256 hex token', () => {
    const token1 = generateReplyToken(email, name, futureExp, secret)
    const token2 = generateReplyToken(email, name, futureExp, secret)
    assert.strictEqual(token1.length, 64)
    assert.strictEqual(token1, token2)
  })

  test('normalizes email casing and whitespace before hashing', () => {
    const tokenUpper = generateReplyToken('  CLIENT.PARTNER@COMPANY.COM  ', 'Partner Director', futureExp, secret)
    const tokenLower = generateReplyToken('client.partner@company.com', 'Partner Director', futureExp, secret)
    assert.strictEqual(tokenUpper, tokenLower)
  })

  test('verifies valid HMAC token and unexpired timestamp', () => {
    const token = generateReplyToken(email, name, futureExp, secret)
    const isValid = verifyReplyToken({ clientEmail: email, clientName: name, exp: futureExp, token }, secret)
    assert.strictEqual(isValid, true)
  })

  test('rejects tampered email', () => {
    const token = generateReplyToken(email, name, futureExp, secret)
    const isValid = verifyReplyToken({ clientEmail: 'attacker@evil.com', clientName: name, exp: futureExp, token }, secret)
    assert.strictEqual(isValid, false)
  })

  test('rejects tampered client name', () => {
    const token = generateReplyToken(email, name, futureExp, secret)
    const isValid = verifyReplyToken({ clientEmail: email, clientName: 'Different Name', exp: futureExp, token }, secret)
    assert.strictEqual(isValid, false)
  })

  test('rejects tampered signature / bit-flipped token', () => {
    const token = generateReplyToken(email, name, futureExp, secret)
    const tampered = (token[0] === '0' ? '1' : '0') + token.slice(1)
    const isValid = verifyReplyToken({ clientEmail: email, clientName: name, exp: futureExp, token: tampered }, secret)
    assert.strictEqual(isValid, false)
  })

  test('rejects expired tokens (TTL past)', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 60
    const token = generateReplyToken(email, name, pastExp, secret)
    const isValid = verifyReplyToken({ clientEmail: email, clientName: name, exp: pastExp, token }, secret)
    assert.strictEqual(isValid, false)
  })

  test('rejects non-numeric or negative expiration epochs', () => {
    const token = generateReplyToken(email, name, futureExp, secret)
    assert.strictEqual(verifyReplyToken({ clientEmail: email, clientName: name, exp: -500, token }, secret), false)
    assert.strictEqual(verifyReplyToken({ clientEmail: email, clientName: name, exp: 'not-a-number', token }, secret), false)
    assert.strictEqual(verifyReplyToken({ clientEmail: email, clientName: name, exp: null, token }, secret), false)
  })

  test('handles malformed hex strings without throwing unhandled exceptions', () => {
    assert.strictEqual(verifyReplyToken({ clientEmail: email, clientName: name, exp: futureExp, token: 'odd-length-xyz' }, secret), false)
    assert.strictEqual(verifyReplyToken({ clientEmail: email, clientName: name, exp: futureExp, token: '' }, secret), false)
    assert.strictEqual(verifyReplyToken({ clientEmail: email, clientName: name, exp: futureExp, token: null }, secret), false)
  })

  test('generates authenticated reply studio URL compatible with verifyReplyToken', () => {
    const urlStr = generateReplyStudioUrl({
      name: 'Alice Cooper',
      email: 'alice@rock.com',
      company: 'Rock LLC',
      budget: '₹5,00,000+',
      currency: 'INR',
      message: 'Need high-scale streaming platform',
    }, 'https://khyrondevs.com', secret)

    const url = new URL(urlStr)
    assert.strictEqual(url.pathname, '/reply')
    const extractedEmail = url.searchParams.get('email')
    const extractedName = url.searchParams.get('name')
    const extractedExp = url.searchParams.get('exp')
    const extractedToken = url.searchParams.get('token')

    assert.strictEqual(extractedEmail, 'alice@rock.com')
    assert.strictEqual(extractedName, 'Alice Cooper')
    assert.ok(extractedExp && Number(extractedExp) > Math.floor(Date.now() / 1000))

    const isVerified = verifyReplyToken({
      clientEmail: extractedEmail,
      clientName: extractedName,
      exp: extractedExp,
      token: extractedToken,
    }, secret)
    assert.strictEqual(isVerified, true)
  })

  test('enforces REPLY_SIGNING_SECRET requirement strictly in production', () => {
    const originalEnv = process.env.NODE_ENV
    const originalSecret = process.env.REPLY_SIGNING_SECRET
    const originalBrevo = process.env.BREVO_API_KEY

    const envRecord = process.env as Record<string, string | undefined>
    try {
      delete process.env.REPLY_SIGNING_SECRET
      delete process.env.BREVO_API_KEY
      envRecord.NODE_ENV = 'production'

      assert.throws(
        () => getSigningSecret(),
        /CRITICAL SECURITY CONFIGURATION ERROR: REPLY_SIGNING_SECRET is not configured in production/
      )

      envRecord.NODE_ENV = 'development'
      assert.strictEqual(getSigningSecret(), 'khyron-devs-airgap-internal-fallback-secret')

      process.env.REPLY_SIGNING_SECRET = 'configured-secret-value'
      assert.strictEqual(getSigningSecret(), 'configured-secret-value')
    } finally {
      envRecord.NODE_ENV = originalEnv
      if (originalSecret) process.env.REPLY_SIGNING_SECRET = originalSecret
      else delete process.env.REPLY_SIGNING_SECRET
      if (originalBrevo) process.env.BREVO_API_KEY = originalBrevo
      else delete process.env.BREVO_API_KEY
    }
  })

  test('bounds query parameter lengths to prevent HTTP 414 URI Too Long DoS (< 1,200 bytes)', () => {
    const massiveMessage = 'Z'.repeat(5000)
    const longName = 'N'.repeat(200)
    const longCompany = 'C'.repeat(200)

    const urlStr = generateReplyStudioUrl({
      name: longName,
      email: 'client@example.com',
      company: longCompany,
      budget: '₹50,00,000+',
      currency: 'INR',
      message: massiveMessage,
    }, 'https://khyrondevs.com', secret)

    const url = new URL(urlStr)
    const messageParam = url.searchParams.get('message') || ''
    const nameParam = url.searchParams.get('name') || ''
    const companyParam = url.searchParams.get('company') || ''

    assert.ok(urlStr.length < 1200, `Expected URL length < 1200 bytes, got ${urlStr.length}`)
    assert.strictEqual(messageParam.length, 500)
    assert.ok(messageParam.endsWith('...'))
    assert.strictEqual(nameParam.length, 100)
    assert.strictEqual(companyParam.length, 100)
  })
})

describe('Zero-Trace Session Cookie Sealing & Unsealing', () => {
  const secret = 'cookie-session-key-for-test-32b'
  const futureExp = Math.floor(Date.now() / 1000) + 7200
  const sampleSession: ReplySession = {
    clientName: 'Sarah Connor',
    clientEmail: 'sarah@skynet-defense.org',
    clientPhone: '+91 9123456789',
    clientCompany: 'Cyberdyne Systems',
    budget: '₹10,00,000+',
    currency: 'INR',
    message: 'Architecture consultation for autonomous neural network',
    exp: futureExp,
    issuedAt: Math.floor(Date.now() / 1000),
  }

  test('seals session into base64url.signature envelope format', () => {
    const sealed = sealReplySession(sampleSession, secret)
    assert.ok(sealed.includes('.'))
    const [payloadB64, signature] = sealed.split('.')
    assert.ok(payloadB64.length > 20)
    assert.strictEqual(signature.length, 64)
  })

  test('unseals valid session cookie with complete payload fidelity', () => {
    const sealed = sealReplySession(sampleSession, secret)
    const unsealed = unsealReplySession(sealed, secret)
    assert.notStrictEqual(unsealed, null)
    assert.strictEqual(unsealed?.clientEmail, sampleSession.clientEmail)
    assert.strictEqual(unsealed?.clientName, sampleSession.clientName)
    assert.strictEqual(unsealed?.clientCompany, sampleSession.clientCompany)
    assert.strictEqual(unsealed?.budget, sampleSession.budget)
    assert.strictEqual(unsealed?.message, sampleSession.message)
    assert.strictEqual(unsealed?.exp, sampleSession.exp)
  })

  test('rejects tampered base64url payload with original signature', () => {
    const sealed = sealReplySession(sampleSession, secret)
    const [, signature] = sealed.split('.')
    const tamperedPayload = Buffer.from(JSON.stringify({ ...sampleSession, clientEmail: 'hacker@evil.com' })).toString('base64url')
    const tamperedCookie = `${tamperedPayload}.${signature}`
    const result = unsealReplySession(tamperedCookie, secret)
    assert.strictEqual(result, null)
  })

  test('rejects tampered signature with original payload', () => {
    const sealed = sealReplySession(sampleSession, secret)
    const [payloadB64] = sealed.split('.')
    const forgedSig = '0000000000000000000000000000000000000000000000000000000000000000'
    const result = unsealReplySession(`${payloadB64}.${forgedSig}`, secret)
    assert.strictEqual(result, null)
  })

  test('rejects expired session cookies', () => {
    const expiredSession: ReplySession = {
      ...sampleSession,
      exp: Math.floor(Date.now() / 1000) - 10,
    }
    const sealedExpired = sealReplySession(expiredSession, secret)
    const result = unsealReplySession(sealedExpired, secret)
    assert.strictEqual(result, null)
  })

  test('gracefully rejects malformed cookie strings without throwing', () => {
    assert.strictEqual(unsealReplySession('not-a-valid-cookie', secret), null)
    assert.strictEqual(unsealReplySession('missing-dot', secret), null)
    assert.strictEqual(unsealReplySession('.signature-only', secret), null)
    assert.strictEqual(unsealReplySession('payload-only.', secret), null)
    assert.strictEqual(unsealReplySession('', secret), null)
    assert.strictEqual(unsealReplySession(null, secret), null)
    assert.strictEqual(unsealReplySession(undefined, secret), null)
  })
})
