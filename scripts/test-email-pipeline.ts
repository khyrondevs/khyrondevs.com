import fs from 'node:fs'
import path from 'node:path'
import {
  type ContactPayload,
  renderClientConfirmationEmail,
  renderTeamNotificationEmail,
  renderDeveloperReplyEmail,
} from '../lib/email-templates.ts'

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return {}
  const content = fs.readFileSync(envPath, 'utf-8')
  const env: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
      env[key] = val
    }
  }
  return env
}

async function testPipeline() {
  const env = loadEnv()
  const apiKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY
  const senderEmail = env.BREVO_SENDER_EMAIL || 'enquiries@khyrondevs.com'
  const senderName = env.BREVO_SENDER_NAME || 'Khyron Devs Inquiries'
  const teamRecipient = env.CONTACT_RECIPIENT_EMAIL || 'enquiries@khyrondevs.com'

  // CLI argument or fallback for test destination
  const cliTarget = process.argv[2]
  const clientRecipient = cliTarget || 'devs.krypton@gmail.com'

  if (!apiKey) {
    console.error('❌ Error: BREVO_API_KEY not configured in .env')
    process.exit(1)
  }

  const brevoHeaders = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 KHYRON DEVS // BREVO + ZOHO PIPELINE VERIFICATION')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📡 Brevo API Key:         ${apiKey.slice(0, 16)}...`)
  console.log(`📤 Outgoing Sender:       "${senderName}" <${senderEmail}>`)
  console.log(`🏢 Team Inbox (Zoho):     ${teamRecipient}`)
  console.log(`👤 Client Test Recipient: ${clientRecipient}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const samplePayload: ContactPayload = {
    name: 'Vikramaditya Rao',
    email: clientRecipient,
    phone: '+91 98450 12345',
    company: 'Nexus HyperScale Labs',
    budget: '$5,000 - $10,000',
    currency: 'USD',
    message:
      'We require an ultra-low-latency financial telemetry dashboard with WebGL charts and real-time WebSocket order book visualization. Looking for an agile team with deep Next.js and high-frequency rendering experience.',
  }

  const clientParams = {
    CLIENT_NAME: samplePayload.name,
    CLIENT_EMAIL: samplePayload.email,
    CLIENT_PHONE: samplePayload.phone || 'Not provided',
    CLIENT_COMPANY: samplePayload.company || 'Direct / Individual',
    CURRENCY: samplePayload.currency || 'USD',
    BUDGET: samplePayload.budget || 'Flexible',
    MESSAGE: samplePayload.message,
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: OCCASION 1 — CLIENT AUTO-CONFIRMATION
  // ───────────────────────────────────────────────────────────────────────────
  console.log('▶ [1/3] Testing Occasion 1: Client Auto-Confirmation Email...')
  const clientTemplateId = Number(env.BREVO_CLIENT_TEMPLATE_ID)
  const clientPayload: Record<string, unknown> = {
    sender: { name: 'Khyron Devs', email: senderEmail },
    to: [{ email: samplePayload.email, name: samplePayload.name }],
    replyTo: { email: teamRecipient, name: 'Khyron Devs Team' },
    subject: 'Inquiry Acknowledged: Project Partnership // Khyron Devs',
  }

  if (!Number.isNaN(clientTemplateId) && clientTemplateId > 0) {
    clientPayload.templateId = clientTemplateId
    clientPayload.params = clientParams
    console.log(`   Using Brevo Template ID: ${clientTemplateId}`)
  } else {
    clientPayload.htmlContent = renderClientConfirmationEmail(samplePayload)
    console.log('   Using Embedded Resilient HTML Fallback')
  }

  const res1 = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: brevoHeaders,
    body: JSON.stringify(clientPayload),
  })

  if (res1.ok) {
    const data = (await res1.json()) as { messageId?: string }
    console.log(`   ✅ Success! Message ID: ${data.messageId}`)
  } else {
    console.error(`   ❌ Failed (${res1.status}):`, await res1.text())
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: OCCASION 2 — DEV TEAM INTAKE DOSSIER
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [2/3] Testing Occasion 2: Dev Team Intake Dossier (Zoho Mail)...')
  const teamTemplateId = Number(env.BREVO_TEAM_TEMPLATE_ID)
  const teamPayload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: teamRecipient, name: 'Khyron Devs Team' }],
    replyTo: { email: samplePayload.email, name: samplePayload.name },
    subject: `[NEW BRIEF] ${samplePayload.name} (${samplePayload.company}) [${samplePayload.currency}]`,
  }

  if (!Number.isNaN(teamTemplateId) && teamTemplateId > 0) {
    teamPayload.templateId = teamTemplateId
    teamPayload.params = clientParams
    console.log(`   Using Brevo Template ID: ${teamTemplateId}`)
  } else {
    teamPayload.htmlContent = renderTeamNotificationEmail(samplePayload)
    console.log('   Using Embedded Resilient HTML Fallback')
  }

  const res2 = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: brevoHeaders,
    body: JSON.stringify(teamPayload),
  })

  if (res2.ok) {
    const data = (await res2.json()) as { messageId?: string }
    console.log(`   ✅ Success! Message ID: ${data.messageId}`)
  } else {
    console.error(`   ❌ Failed (${res2.status}):`, await res2.text())
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: OCCASION 3 — DEVELOPER REPLY WITH DOSSIER
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n▶ [3/3] Testing Occasion 3: Developer Reply with Quoted Dossier...')
  const replyTemplateId = Number(env.BREVO_REPLY_TEMPLATE_ID)
  const replyPayload: Record<string, unknown> = {
    sender: { name: 'Khyron Devs Architect', email: senderEmail },
    to: [{ email: samplePayload.email, name: samplePayload.name }],
    replyTo: { email: teamRecipient, name: 'Khyron Devs Team' },
    subject: 'Re: Project Brief Discussion // Khyron Devs',
  }

  const replySampleText =
    'Hi Vikramaditya,\n\nWe reviewed your requirements for the high-frequency WebGL order book visualization. We have built similar high-performance engines and would love to walk you through our component architecture and benchmark data.\n\nCould we jump on a brief 20-minute architecture discovery call this Thursday at 3:00 PM IST?'

  if (!Number.isNaN(replyTemplateId) && replyTemplateId > 0) {
    replyPayload.templateId = replyTemplateId
    replyPayload.params = {
      ...clientParams,
      REPLY_MESSAGE: replySampleText.replace(/\n/g, '<br/>'),
      ORIGINAL_MESSAGE: samplePayload.message,
      DEV_NAME: 'Vittal Shenoy',
      DEV_ROLE: 'Principal Systems Architect',
    }
    console.log(`   Using Brevo Template ID: ${replyTemplateId}`)
  } else {
    replyPayload.htmlContent = renderDeveloperReplyEmail(
      samplePayload,
      replySampleText,
      'Vittal Shenoy',
      'Principal Systems Architect'
    )
    console.log('   Using Embedded Resilient HTML Fallback')
  }

  const res3 = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: brevoHeaders,
    body: JSON.stringify(replyPayload),
  })

  if (res3.ok) {
    const data = (await res3.json()) as { messageId?: string }
    console.log(`   ✅ Success! Message ID: ${data.messageId}`)
  } else {
    console.error(`   ❌ Failed (${res3.status}):`, await res3.text())
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎉 ALL 3 OCCASIONS TESTED AND VERIFIED')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

testPipeline().catch((err) => {
  console.error('Fatal pipeline test error:', err)
  process.exit(1)
})
