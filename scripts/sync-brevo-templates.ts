import fs from 'node:fs'
import path from 'node:path'
import { BREVO_TEMPLATE_DEFINITIONS } from '../lib/email-templates.ts'

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

async function syncTemplates() {
  const env = loadEnv()
  const apiKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY
  const senderEmail = env.BREVO_SENDER_EMAIL || 'enquiries@khyrondevs.com'
  const senderName = env.BREVO_SENDER_NAME || 'Khyron Devs Inquiries'

  if (!apiKey) {
    console.error('❌ Error: BREVO_API_KEY not found in .env or environment variables.')
    process.exit(1)
  }

  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  console.log('🔍 Detecting verified senders from Brevo...')
  let verifiedSenderEmail = senderEmail
  let verifiedSenderName = senderName
  try {
    const sendersRes = await fetch('https://api.brevo.com/v3/senders', { headers })
    if (sendersRes.ok) {
      const sendersData = (await sendersRes.json()) as { senders?: Array<{ id: number; name: string; email: string; active: boolean }> }
      const activeSender = sendersData.senders?.find((s) => s.active) || sendersData.senders?.[0]
      if (activeSender) {
        verifiedSenderEmail = activeSender.email
        verifiedSenderName = activeSender.name || senderName
        console.log(`✅ Using Brevo verified sender: "${verifiedSenderName}" <${verifiedSenderEmail}>`)
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not query senders endpoint, falling back to configured sender email:', err)
  }

  console.log('🔄 Fetching existing templates from Brevo...')
  const listRes = await fetch('https://api.brevo.com/v3/smtp/templates?limit=50', { headers })
  if (!listRes.ok) {
    const err = await listRes.text()
    console.error(`❌ Failed to list templates: ${listRes.status}`, err)
    process.exit(1)
  }

  const listData = (await listRes.json()) as { templates?: Array<{ id: number; name: string }> }
  const existingTemplates = listData.templates || []
  console.log(`📋 Found ${existingTemplates.length} existing templates in Brevo.\n`)

  const results: Record<string, number> = {}

  const templatesToSync = [
    { def: BREVO_TEMPLATE_DEFINITIONS.clientConfirmation, envVar: 'BREVO_CLIENT_TEMPLATE_ID' },
    { def: BREVO_TEMPLATE_DEFINITIONS.teamNotification, envVar: 'BREVO_TEAM_TEMPLATE_ID' },
    { def: BREVO_TEMPLATE_DEFINITIONS.developerReply, envVar: 'BREVO_REPLY_TEMPLATE_ID' },
  ]

  for (const { def, envVar } of templatesToSync) {
    const existing = existingTemplates.find((t) => t.name === def.name)

    const payload = {
      templateName: def.name,
      sender: { name: verifiedSenderName, email: verifiedSenderEmail },
      subject: def.subject,
      htmlContent: def.htmlContent,
      isActive: true,
    }

    if (existing) {
      console.log(`⚡ Updating existing template "${def.name}" (ID: ${existing.id})...`)
      const updateRes = await fetch(`https://api.brevo.com/v3/smtp/templates/${existing.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      })

      if (!updateRes.ok) {
        const err = await updateRes.text()
        console.error(`❌ Failed to update template ${existing.id}:`, err)
      } else {
        console.log(`✅ Template ${existing.id} updated successfully.`)
        results[envVar] = existing.id
      }
    } else {
      console.log(`✨ Creating new template "${def.name}"...`)
      const createRes = await fetch('https://api.brevo.com/v3/smtp/templates', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      if (!createRes.ok) {
        const err = await createRes.text()
        console.error(`❌ Failed to create template "${def.name}":`, err)
      } else {
        const createdData = (await createRes.json()) as { id: number }
        console.log(`✅ Created template "${def.name}" with ID: ${createdData.id}`)
        results[envVar] = createdData.id
      }
    }
  }

  console.log('\n=============================================================')
  console.log('🎉 BREVO TEMPLATE SYNCHRONIZATION COMPLETE')
  console.log('=============================================================')
  for (const [envVar, id] of Object.entries(results)) {
    console.log(`${envVar}=${id}`)
  }
  console.log('=============================================================\n')
  console.log('To activate Brevo Dashboard Template IDs, add the above variables to your .env file.')
  console.log('(If omitted, the site automatically uses the embedded high-fidelity HTML templates as fallback).\n')
}

syncTemplates().catch((err) => {
  console.error('Fatal error during template sync:', err)
  process.exit(1)
})
