/**
 * Khyron Devs — Transactional Email Template Suite
 *
 * 3 Bespoke Templates for 3 Dedicated Occasions:
 *   1. Client Auto-Confirmation: Immediate reassurance sent to client with inquiry recap & SLA roadmap.
 *   2. Dev Team Intake Dossier: High-density engineering brief delivered to Zoho Mail (enquiries@khyrondevs.com).
 *   3. Developer Reply with Dossier: High-touch response template wrapping dev's message + preserving original brief.
 *
 * Fully inline-styled, dark-mode cyberpunk luxury, cross-client compatible (Gmail, Apple Mail, Zoho, Outlook).
 */

import { generateReplyStudioUrl } from './crypto.ts'

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  budget?: string
  currency?: string
  hp_source?: string
  turnstileToken?: string
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatTimestamps(date: Date = new Date()): { istTime: string; gmtTime: string } {
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const istTime = `${istFormatter.format(date)} IST`

  const gmtFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const gmtTime = `${gmtFormatter.format(date)} GMT`

  return { istTime, gmtTime }
}

// ─────────────────────────────────────────────────────────────────────────────
// OCCASION 1: CLIENT AUTO-CONFIRMATION TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────
export function renderClientConfirmationEmail(payload: ContactPayload): string {
  const safeName = escapeHtml(payload.name.trim())
  const safeEmail = escapeHtml(payload.email.trim())
  const rawPhone = payload.phone?.trim()
  const safePhone = rawPhone ? escapeHtml(rawPhone) : null
  const safeCompany = payload.company?.trim() ? escapeHtml(payload.company.trim()) : 'Direct / Individual'
  const safeBudget = payload.budget?.trim() ? escapeHtml(payload.budget.trim()) : 'Flexible / TBD'
  const safeCurrency = payload.currency?.trim() ? escapeHtml(payload.currency.trim()) : 'INR'
  const safeMessage = escapeHtml(payload.message.trim()).replace(/\n/g, '<br/>')
  const { istTime, gmtTime } = formatTimestamps()

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Acknowledged // Khyron Devs</title>
</head>
<body style="margin: 0; padding: 28px 14px; background-color: #05070c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 620px; margin: 0 auto; background: #0c0f1a; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);">

    <!-- Holographic Brand Header -->
    <div style="background: linear-gradient(135deg, #090d16 0%, #0369a1 50%, #0f172a 100%); padding: 32px 36px; border-bottom: 1px solid rgba(255, 255, 255, 0.12); text-align: left;">
      <div style="display: inline-block; font-family: monospace; font-size: 11px; font-weight: 700; background: rgba(56, 189, 248, 0.18); color: #38bdf8; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(56, 189, 248, 0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px;">
        KHYRON DEVS &bull; CLIENT ADMISSIONS
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; line-height: 1.25;">
        Inquiry Received &amp; Acknowledged
      </h1>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #bae6fd; font-family: monospace;">
        Status: Under Architectural Review &bull; SLA: 24–48 Hours
      </p>
    </div>

    <!-- Main Message Body -->
    <div style="padding: 32px 36px; background-color: #0c0f1a;">
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #f8fafc;">
        Hi <strong style="color: #38bdf8;">${safeName}</strong>,
      </p>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.65; color: #cbd5e1;">
        Thank you for visiting <strong style="color: #ffffff;">Khyron Devs</strong> and submitting your project inquiry. This email confirms that our engineering team has safely received your brief and has queued it for technical evaluation.
      </p>

      <!-- Glassmorphic Blueprint Card -->
      <div style="background: #060810; border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 22px 24px; margin-bottom: 28px; box-shadow: inset 0 0 20px rgba(56, 189, 248, 0.04);">
        <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px;">
          RECORDED INQUIRY DOSSIER
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 7px 0; color: #94a3b8; font-family: monospace; text-transform: uppercase; font-size: 11px; width: 140px;">Entity:</td>
            <td style="padding: 7px 0; color: #e2e8f0; font-weight: 600;">${safeCompany}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8; font-family: monospace; text-transform: uppercase; font-size: 11px;">Primary Email:</td>
            <td style="padding: 7px 0; color: #38bdf8; font-family: monospace;">${safeEmail}</td>
          </tr>
          ${safePhone ? `
          <tr>
            <td style="padding: 7px 0; color: #94a3b8; font-family: monospace; text-transform: uppercase; font-size: 11px;">Phone / WhatsApp:</td>
            <td style="padding: 7px 0; color: #e2e8f0; font-family: monospace;">${safePhone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 7px 0; color: #94a3b8; font-family: monospace; text-transform: uppercase; font-size: 11px;">Selected Budget:</td>
            <td style="padding: 7px 0; color: #38bdf8; font-weight: 700; font-family: monospace;">${safeBudget} (${safeCurrency})</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8; font-family: monospace; text-transform: uppercase; font-size: 11px;">Logged At:</td>
            <td style="padding: 7px 0; color: #cbd5e1; font-family: monospace; font-size: 12px;">${istTime} (${gmtTime})</td>
          </tr>
        </table>

        <!-- Message Quote -->
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(255, 255, 255, 0.1);">
          <div style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Your Project Scope:</div>
          <div style="font-size: 13px; line-height: 1.6; color: #e2e8f0; font-style: italic; background: rgba(255, 255, 255, 0.02); padding: 10px 14px; border-radius: 6px; border-left: 2px solid #38bdf8;">
            &ldquo;${safeMessage}&rdquo;
          </div>
        </div>
      </div>

      <!-- What to Expect Next (SLA Roadmap) -->
      <div style="margin-bottom: 28px;">
        <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
          WHAT HAPPENS NEXT:
        </div>
        <div style="padding: 14px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px;">
          <div style="margin-bottom: 10px;">
            <div style="font-family: monospace; font-size: 12px; color: #38bdf8; font-weight: 700; margin-bottom: 2px;">STEP 01 // Technical Feasibility Review</div>
            <div style="font-size: 13px; color: #cbd5e1; line-height: 1.4;">Our core engineers review your requirements against our architecture benchmarks within 24 hours.</div>
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-family: monospace; font-size: 12px; color: #818cf8; font-weight: 700; margin-bottom: 2px;">STEP 02 // Direct Engineering Alignment</div>
            <div style="font-size: 13px; color: #cbd5e1; line-height: 1.4;">A Khyron Devs lead responds with tailored architectural recommendations, timeline, and preliminary milestones.</div>
          </div>
          <div>
            <div style="font-family: monospace; font-size: 12px; color: #10b981; font-weight: 700; margin-bottom: 2px;">STEP 03 // Sprint Execution &amp; Kickoff</div>
            <div style="font-size: 13px; color: #cbd5e1; line-height: 1.4;">Once aligned, we provision private repository access, telemetry pipelines, and begin Sprint 0.</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="text-align: center; margin: 32px 0 10px 0;">
        <a href="https://khyrondevs.com/work" target="_blank" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 24px; border-radius: 8px; margin-right: 8px; margin-bottom: 8px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
          Explore Our Case Studies &rarr;
        </a>
        <a href="https://khyrondevs.com" target="_blank" style="display: inline-block; background: rgba(255, 255, 255, 0.05); color: #e2e8f0; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 24px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15); margin-bottom: 8px;">
          Visit Khyron Devs
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 20px 36px; background: #060810; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #64748b; font-family: monospace; line-height: 1.6;">
      <div style="margin-bottom: 6px;">
        Khyron Devs &bull; High-Performance Web &amp; Distributed Systems Studio &bull; Bengaluru, India
      </div>
      <div>
        Questions? Simply reply to this email or reach us directly at <a href="mailto:enquiries@khyrondevs.com" style="color: #38bdf8; text-decoration: none;">enquiries@khyrondevs.com</a>.
      </div>
    </div>
  </div>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────────────
// OCCASION 2: DEV TEAM INTAKE DOSSIER (ZOHO MAIL GROUP)
// ─────────────────────────────────────────────────────────────────────────────
function makeStudioUrl(p: ContactPayload): string {
  if (p.name.includes('{{')) {
    return '{{ params.REPLY_STUDIO_URL }}'
  }
  return generateReplyStudioUrl(p)
}

export function renderTeamNotificationEmail(payload: ContactPayload): string {
  const safeName = escapeHtml(payload.name.trim())
  const safeEmail = escapeHtml(payload.email.trim())
  const rawPhone = payload.phone?.trim()
  const safePhone = rawPhone ? escapeHtml(rawPhone) : null
  const cleanPhone = rawPhone ? rawPhone.replace(/[^0-9+]/g, '') : ''
  const waNumber = cleanPhone.replace(/^\+/, '')
  const safeCompany = payload.company?.trim() ? escapeHtml(payload.company.trim()) : 'Direct / Individual'
  const safeBudget = payload.budget?.trim() ? escapeHtml(payload.budget.trim()) : 'Not specified'
  const safeCurrency = payload.currency?.trim() ? escapeHtml(payload.currency.trim()) : 'INR'
  const safeMessage = escapeHtml(payload.message.trim()).replace(/\n/g, '<br/>')
  const { istTime, gmtTime } = formatTimestamps()
  const replyStudioUrl = makeStudioUrl(payload)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Inquiry // Khyron Devs Internal</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #07080d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 620px; margin: 0 auto; background: #0f121d; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);">

    <!-- Header: Solid, high-contrast, bulletproof across all email clients including Zoho Mail -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#090e17" style="background-color: #090e17 !important; border-bottom: 2px solid #0284c7;">
      <tr>
        <td style="padding: 26px 32px; background-color: #090e17 !important;">
          <div style="margin-bottom: 8px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: 700; background-color: #0284c7 !important; color: #ffffff !important; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.08em; display: inline-block;">
              KHYRON DEVS &bull; CLIENT ADMISSIONS
            </span>
          </div>
          <h1 style="margin: 6px 0 0 0; font-size: 21px; font-weight: 700; line-height: 1.3;">
            <span style="color: #ffffff !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              Client Project Brief: ${safeName}
            </span>
          </h1>
          <div style="margin-top: 6px; font-size: 13px; font-family: monospace;">
            <span style="color: #38bdf8 !important;">
              Entity: ${safeCompany} &bull; Budget: ${safeBudget} (${safeCurrency})
            </span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Content Table -->
    <div style="padding: 28px 32px; background-color: #0f121d;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; width: 140px;">Client Name:</td>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 15px; color: #38bdf8; font-weight: 600;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Email Address:</td>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 14px; color: #ffffff;">
            <a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: underline; font-weight: 600;">${safeEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Phone / Contact:</td>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 14px; color: #ffffff;">
            ${safePhone ? `<a href="tel:${cleanPhone}" style="color: #38bdf8; text-decoration: underline; font-weight: 600;">${safePhone}</a>` : '<span style="color: #64748b;">Not provided</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Company / Entity:</td>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 14px; color: #e2e8f0;">${safeCompany}</td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Currency &amp; Budget:</td>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 14px; color: #38bdf8; font-weight: 700; font-family: monospace;">
            ${safeBudget} (${safeCurrency})
          </td>
        </tr>
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8;">Intake Timestamp:</td>
          <td style="padding: 9px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 13px; font-family: monospace; color: #ffffff;">
            <strong>${istTime}</strong> <span style="color: #94a3b8; font-size: 11px;">(${gmtTime})</span>
          </td>
        </tr>
      </table>

      <!-- Project Scope Section -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 8px;">
          Submitted Project Scope &amp; Brief:
        </div>
        <div style="background-color: #07090e; border: 1px solid rgba(255, 255, 255, 0.1); border-left: 3px solid #38bdf8; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e2e8f0;">
          ${safeMessage}
        </div>
      </div>

      <!-- Developer Actions: 1-Click Template 3 Studio -->
      <div style="background-color: #060912; border: 1px solid rgba(56, 189, 248, 0.28); border-radius: 10px; padding: 20px; text-align: center; margin-top: 24px;">
        <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
          ⚡ KHYRON DEVS &bull; DISPATCH ACTIONS
        </div>
        <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 16px; line-height: 1.5;">
          Dispatch an official response wrapped in <strong>Template 3</strong> with the inquiry dossier attached:
        </div>
        <div>
          <a href="${replyStudioUrl}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
            ⚡ Open 1-Click Reply Studio (Template 3) &rarr;
          </a>
        </div>
        ${safePhone ? `
        <div style="margin-top: 14px; font-size: 12px;">
          <a href="https://wa.me/${waNumber}" target="_blank" style="color: #22c55e; text-decoration: underline; font-family: monospace;">
            💬 Or Chat on WhatsApp with ${safeName} &rarr;
          </a>
        </div>` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 18px 32px; background-color: #060810; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #64748b; font-family: monospace; text-align: center;">
      Khyron Devs &bull; High-Performance Web &amp; Distributed Systems Studio &bull; <a href="https://khyrondevs.com" style="color: #38bdf8; text-decoration: none;">khyrondevs.com</a>
    </div>
  </div>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────────────
// OCCASION 3: DEVELOPER REPLY TEMPLATE (WITH EMBEDDED INQUIRY DOSSIER)
// ─────────────────────────────────────────────────────────────────────────────
export function renderDeveloperReplyEmail(
  payload: ContactPayload,
  replyMessage: string,
  devName: string = 'Khyron Devs Lead',
  devRole: string = 'Principal Software Architect'
): string {
  const safeClientName = escapeHtml(payload.name.trim())
  const safeDevName = escapeHtml(devName.trim())
  const safeDevRole = escapeHtml(devRole.trim())
  const safeReplyMessage = escapeHtml(replyMessage.trim()).replace(/\n/g, '<br/>')
  const safeCompany = payload.company?.trim() ? escapeHtml(payload.company.trim()) : 'Direct / Individual'
  const safeBudget = payload.budget?.trim() ? escapeHtml(payload.budget.trim()) : 'Flexible'
  const safeCurrency = payload.currency?.trim() ? escapeHtml(payload.currency.trim()) : 'INR'
  const safeOriginalMessage = escapeHtml(payload.message.trim()).replace(/\n/g, '<br/>')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Response to Your Inquiry // Khyron Devs</title>
</head>
<body style="margin: 0; padding: 28px 14px; background-color: #05070c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 620px; margin: 0 auto; background: #0c0f1a; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0369a1 100%); padding: 28px 36px; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
      <div style="display: inline-block; font-family: monospace; font-size: 11px; font-weight: 700; background: rgba(129, 140, 248, 0.2); color: #818cf8; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(129, 140, 248, 0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">
        KHYRON DEVS &bull; ENGINEERING RESPONSE
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
        Following Up on Your Project Brief
      </h1>
    </div>

    <!-- Reply Body -->
    <div style="padding: 32px 36px; background-color: #0c0f1a;">
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #f8fafc;">
        Hi <strong style="color: #38bdf8;">${safeClientName}</strong>,
      </p>

      <!-- Engineer's Response Text -->
      <div style="font-size: 14px; line-height: 1.7; color: #e2e8f0; margin-bottom: 28px;">
        ${safeReplyMessage}
      </div>

      <!-- Engineer Signature Card -->
      <div style="padding: 16px 20px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; margin-bottom: 32px;">
        <div style="font-weight: 700; color: #ffffff; font-size: 14px;">${safeDevName}</div>
        <div style="font-size: 12px; color: #818cf8; font-family: monospace; margin-top: 2px;">${safeDevRole} &bull; Khyron Devs</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 8px; font-family: monospace;">
          Web: <a href="https://khyrondevs.com" style="color: #38bdf8; text-decoration: none;">khyrondevs.com</a> &bull; Email: <a href="mailto:enquiries@khyrondevs.com" style="color: #38bdf8; text-decoration: none;">enquiries@khyrondevs.com</a>
        </div>
      </div>

      <!-- Dedicated Original Inquiry Dossier -->
      <div style="background: #060810; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; margin-bottom: 12px;">
          <span style="font-family: monospace; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em;">
            ORIGINAL INQUIRY ARCHIVE // CONTEXT
          </span>
          <span style="font-family: monospace; font-size: 10px; color: #64748b; margin-left: auto;">
            VERIFIED TRANSMISSION
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-family: monospace; width: 110px;">Entity:</td>
            <td style="padding: 4px 0; color: #cbd5e1;">${safeCompany}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-family: monospace;">Budget:</td>
            <td style="padding: 4px 0; color: #38bdf8; font-family: monospace; font-weight: 600;">${safeBudget} (${safeCurrency})</td>
          </tr>
        </table>

        <div>
          <div style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Original Scope:</div>
          <div style="font-size: 13px; line-height: 1.55; color: #94a3b8; font-style: italic; border-left: 2px solid rgba(56, 189, 248, 0.4); padding-left: 10px;">
            &ldquo;${safeOriginalMessage}&rdquo;
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 18px 36px; background: #060810; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #64748b; font-family: monospace;">
      Delivered directly via Khyron Devs Communication Relay &bull; Reply to this email to continue the conversation.
    </div>
  </div>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────────────
// BREVO JINJA PARAMETER TEMPLATE DEFINITIONS (FOR SYNC SCRIPT)
// ─────────────────────────────────────────────────────────────────────────────
export const BREVO_TEMPLATE_DEFINITIONS = {
  clientConfirmation: {
    name: 'Khyron Devs - Client Confirmation (Template 1)',
    subject: 'Inquiry Acknowledged: Project Partnership // Khyron Devs',
    htmlContent: renderClientConfirmationEmail({
      name: '{{ params.CLIENT_NAME }}',
      email: '{{ params.CLIENT_EMAIL }}',
      phone: '{{ params.CLIENT_PHONE }}',
      company: '{{ params.CLIENT_COMPANY }}',
      budget: '{{ params.BUDGET }}',
      currency: '{{ params.CURRENCY }}',
      message: '{{ params.MESSAGE | safe }}',
    }),
  },
  teamNotification: {
    name: 'Khyron Devs - Dev Team Alert (Template 2)',
    subject: '[NEW BRIEF] {{ params.CLIENT_NAME }} ({{ params.CLIENT_COMPANY }}) [{{ params.CURRENCY }}]',
    htmlContent: renderTeamNotificationEmail({
      name: '{{ params.CLIENT_NAME }}',
      email: '{{ params.CLIENT_EMAIL }}',
      phone: '{{ params.CLIENT_PHONE }}',
      company: '{{ params.CLIENT_COMPANY }}',
      budget: '{{ params.BUDGET }}',
      currency: '{{ params.CURRENCY }}',
      message: '{{ params.MESSAGE | safe }}',
    }),
  },
  developerReply: {
    name: 'Khyron Devs - Developer Reply with Dossier (Template 3)',
    subject: 'Re: Project Brief Discussion // Khyron Devs',
    htmlContent: renderDeveloperReplyEmail(
      {
        name: '{{ params.CLIENT_NAME }}',
        email: '{{ params.CLIENT_EMAIL }}',
        phone: '{{ params.CLIENT_PHONE }}',
        company: '{{ params.CLIENT_COMPANY }}',
        budget: '{{ params.BUDGET }}',
        currency: '{{ params.CURRENCY }}',
        message: '{{ params.ORIGINAL_MESSAGE | safe }}',
      },
      '{{ params.REPLY_MESSAGE | safe }}',
      '{{ params.DEV_NAME }}',
      '{{ params.DEV_ROLE }}'
    ),
  },
}
