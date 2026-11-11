import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isSafeHttpUrl, getCleanDomain } from '../lib/url.ts'

describe('Zero-Trust URL Normalization & Protocol Firewall Suite', () => {
  describe('Protocol Firewall (isSafeHttpUrl)', () => {
    it('accepts standard HTTPS and HTTP URLs', () => {
      assert.equal(isSafeHttpUrl('https://khyrondevs.com'), true)
      assert.equal(isSafeHttpUrl('https://vittal.khyrondevs.com'), true)
      assert.equal(isSafeHttpUrl('https://gowtham.khyrondevs.com'), true)
      assert.equal(isSafeHttpUrl('https://gurupavan.khyrondevs.com'), true)
      assert.equal(isSafeHttpUrl('http://localhost:3000'), true)
      assert.equal(isSafeHttpUrl('https://sub.domain.co.uk/path/to/resource?q=1#frag'), true)
    })

    it('handles leading and trailing whitespace safely', () => {
      assert.equal(isSafeHttpUrl('   https://khyrondevs.com   '), true)
      assert.equal(isSafeHttpUrl('\thttps://example.com\n'), true)
    })

    it('strictly blocks client-side code execution vectors (XSS / Smuggling)', () => {
      assert.equal(isSafeHttpUrl('javascript:alert(1)'), false)
      assert.equal(isSafeHttpUrl('javascript:void(0)'), false)
      assert.equal(isSafeHttpUrl('JAVASCRIPT:alert(document.cookie)'), false)
      assert.equal(isSafeHttpUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='), false)
      assert.equal(isSafeHttpUrl('vbscript:msgbox("XSS")'), false)
      assert.equal(isSafeHttpUrl('file:///etc/passwd'), false)
      assert.equal(isSafeHttpUrl('blob:https://khyrondevs.com/uuid'), false)
    })

    it('rejects non-web protocols, relative paths, and malformed inputs', () => {
      assert.equal(isSafeHttpUrl('mailto:enquiries@khyrondevs.com'), false)
      assert.equal(isSafeHttpUrl('tel:+919876543210'), false)
      assert.equal(isSafeHttpUrl('ftp://ftp.example.com'), false)
      assert.equal(isSafeHttpUrl('/about'), false)
      assert.equal(isSafeHttpUrl('//khyrondevs.com'), false)
      assert.equal(isSafeHttpUrl(''), false)
      assert.equal(isSafeHttpUrl('   '), false)
      assert.equal(isSafeHttpUrl('not-a-url'), false)
      assert.equal(isSafeHttpUrl(null), false)
      assert.equal(isSafeHttpUrl(undefined), false)
      assert.equal(isSafeHttpUrl(12345), false)
      assert.equal(isSafeHttpUrl({ url: 'https://example.com' }), false)
    })
  })
  describe('Domain Normalization for UI Badges (getCleanDomain)', () => {
    it('normalizes standard URLs into clean hostnames', () => {
      assert.equal(
        getCleanDomain('https://vittal.khyrondevs.com'),
        'vittal.khyrondevs.com'
      )
      assert.equal(
        getCleanDomain('https://gurupavan.khyrondevs.com'),
        'gurupavan.khyrondevs.com'
      )
      assert.equal(
        getCleanDomain('https://gowtham.khyrondevs.com'),
        'gowtham.khyrondevs.com'
      )
    })

    it('strips www. prefixes cleanly', () => {
      assert.equal(getCleanDomain('https://www.khyrondevs.com'), 'khyrondevs.com')
      assert.equal(getCleanDomain('http://www.example.org/'), 'example.org')
    })

    it('strips deep paths, query strings, and fragments', () => {
      assert.equal(
        getCleanDomain('https://khyrondevs.com/services/web-systems?ref=banner#pricing'),
        'khyrondevs.com'
      )
    })

    it('strips ports and embedded credentials', () => {
      assert.equal(getCleanDomain('http://localhost:8080/dashboard'), 'localhost')
      assert.equal(getCleanDomain('https://user:secret@api.khyrondevs.com:8443/ping'), 'api.khyrondevs.com')
    })

    it('gracefully handles non-standard or raw domain strings without throwing', () => {
      assert.equal(getCleanDomain('khyrondevs.com'), 'khyrondevs.com')
      assert.equal(getCleanDomain('www.khyrondevs.com/path'), 'khyrondevs.com')
      assert.equal(getCleanDomain(''), '')
      assert.equal(getCleanDomain('   '), '')
      // @ts-expect-error test non-string inputs
      assert.equal(getCleanDomain(null), '')
      // @ts-expect-error test non-string inputs
      assert.equal(getCleanDomain(undefined), '')
    })
  })
})
