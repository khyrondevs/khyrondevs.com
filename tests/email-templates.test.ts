import { test, describe } from 'node:test'
import assert from 'node:assert'
import {
  escapeHtml,
  renderClientConfirmationEmail,
  renderTeamNotificationEmail,
  renderDeveloperReplyEmail,
  BREVO_TEMPLATE_DEFINITIONS,
  type ContactPayload,
} from '../lib/email-templates.ts'

describe('Email Template Engine & Sanitization Security', () => {
  const basePayload: ContactPayload = {
    name: 'Ada Lovelace',
    email: 'ada@computing.org',
    phone: '+91 9876543210',
    company: 'Analytical Engines Ltd',
    budget: '₹5,00,000 - ₹10,00,000',
    currency: 'INR',
    message: 'We require a fault-tolerant arithmetic processing pipeline with high throughput.',
  }

  test('escapeHtml neutralizes XSS vectors, quotes, and HTML special characters', () => {
    const malicious = '<script>alert("XSS & theft")</script>\'test\'>'
    const escaped = escapeHtml(malicious)
    assert.ok(!escaped.includes('<script>'))
    assert.ok(!escaped.includes('</script>'))
    assert.ok(escaped.includes('&lt;script&gt;'))
    assert.ok(escaped.includes('&amp;'))
    assert.ok(escaped.includes('&quot;'))
    assert.ok(escaped.includes('&#039;'))
  })

  test('Template 1 (Client Auto-Confirmation) renders branded header, dossier, and SLA roadmap', () => {
    const html = renderClientConfirmationEmail(basePayload)
    assert.ok(html.includes('Ada Lovelace'))
    assert.ok(html.includes('ada@computing.org'))
    assert.ok(html.includes('Analytical Engines Ltd'))
    assert.ok(html.includes('₹5,00,000 - ₹10,00,000 (INR)'))
    assert.ok(html.includes('+91 9876543210'))
    assert.ok(html.includes('Inquiry Received &amp; Acknowledged'))
    assert.ok(html.includes('STEP 01 // Technical Feasibility Review'))
    assert.ok(html.includes('STEP 02 // Direct Engineering Alignment'))
    assert.ok(html.includes('STEP 03 // Sprint Execution'))
  })

  test('Template 1 handles optional phone correctly when omitted', () => {
    const payloadWithoutPhone = { ...basePayload, phone: undefined }
    const html = renderClientConfirmationEmail(payloadWithoutPhone)
    assert.ok(!html.includes('Phone / WhatsApp:'))
    assert.ok(html.includes('Ada Lovelace'))
  })

  test('Template 2 (Dev Team Intake Dossier) includes bulletproof Zoho-safe dark header', () => {
    const html = renderTeamNotificationEmail(basePayload)
    assert.ok(html.includes('bgcolor="#090e17"'))
    assert.ok(html.includes('Client Project Brief: Ada Lovelace'))
    assert.ok(html.includes('Analytical Engines Ltd'))
    assert.ok(html.includes('tel:+919876543210'))
  })

  test('Template 2 generates correct WhatsApp deep-link from phone number', () => {
    const html = renderTeamNotificationEmail(basePayload)
    assert.ok(html.includes('https://wa.me/919876543210'))
  })

  test('Template 2 generates Reply Studio URL with signed HMAC token', () => {
    const html = renderTeamNotificationEmail(basePayload)
    assert.ok(html.includes('/reply?'))
    assert.ok(html.includes('token='))
    assert.ok(html.includes('exp='))
  })

  test('Template 3 (Developer Reply) displays custom message, engineer signature, and quoted dossier', () => {
    const replyMessage = 'Thank you Ada. We have scheduled an architectural review for Friday.'
    const devName = 'Vittal Shenoy'
    const devRole = 'Principal Systems Architect'
    const html = renderDeveloperReplyEmail(basePayload, replyMessage, devName, devRole)

    assert.ok(html.includes('Following Up on Your Project Brief'))
    assert.ok(html.includes('Thank you Ada. We have scheduled an architectural review for Friday.'))
    assert.ok(html.includes('Vittal Shenoy'))
    assert.ok(html.includes('Principal Systems Architect &bull; Khyron Devs'))
    assert.ok(html.includes('ORIGINAL INQUIRY ARCHIVE // CONTEXT'))
    assert.ok(html.includes('Analytical Engines Ltd'))
  })

  test('Template 3 converts newline characters to HTML break tags', () => {
    const multiLineMessage = 'Line 1\nLine 2\nLine 3'
    const html = renderDeveloperReplyEmail(basePayload, multiLineMessage)
    assert.ok(html.includes('Line 1<br/>Line 2<br/>Line 3'))
  })

  test('BREVO_TEMPLATE_DEFINITIONS contain valid Jinja parameter placeholders with | safe', () => {
    const { clientConfirmation, teamNotification, developerReply } = BREVO_TEMPLATE_DEFINITIONS
    assert.ok(clientConfirmation.htmlContent.includes('{{ params.CLIENT_NAME }}'))
    assert.ok(clientConfirmation.htmlContent.includes('{{ params.CLIENT_EMAIL }}'))
    assert.ok(clientConfirmation.htmlContent.includes('{{ params.MESSAGE | safe }}'))
    assert.ok(teamNotification.htmlContent.includes('{{ params.REPLY_STUDIO_URL }}'))
    assert.ok(teamNotification.htmlContent.includes('{{ params.MESSAGE | safe }}'))
    assert.ok(developerReply.htmlContent.includes('{{ params.REPLY_MESSAGE | safe }}'))
    assert.ok(developerReply.htmlContent.includes('{{ params.ORIGINAL_MESSAGE | safe }}'))
    assert.ok(developerReply.htmlContent.includes('{{ params.DEV_NAME }}'))
  })
})
