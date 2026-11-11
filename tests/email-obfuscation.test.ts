import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { teamMembers } from '../lib/content/team.ts'

describe('Anti-Scraping Team Email Obfuscation Suite', () => {
  const componentPath = path.resolve(process.cwd(), 'components/ui/obfuscated-email.tsx')
  const aboutPagePath = path.resolve(process.cwd(), 'app/about/page.tsx')

  const componentSource = fs.readFileSync(componentPath, 'utf8')
  const aboutSource = fs.readFileSync(aboutPagePath, 'utf8')

  it('eliminates static raw mailto links from app/about/page.tsx', () => {
    assert.doesNotMatch(
      aboutSource,
      /href=\{`mailto:\$\{member\.email\}`\}/,
      'About page must not expose raw mailto links to static web scrapers'
    )
    assert.match(
      aboutSource,
      /<ObfuscatedEmail\s+email=\{member\.email\}\s+name=\{member\.name\}\s*\/>/,
      'About page must render ObfuscatedEmail for all team members'
    )
  })

  it('obfuscates email components and avoids static href="mailto:..." in ObfuscatedEmail', () => {
    assert.doesNotMatch(
      componentSource,
      /href=['"]mailto:/,
      'ObfuscatedEmail component must not contain static href="mailto:" tags'
    )
    assert.match(
      componentSource,
      /email\.split\('@'\)/,
      'Email must be segmented into user and domain parts'
    )
    assert.match(
      componentSource,
      /data-user=\{user\}\s+data-domain=\{domain\}/,
      'Component must encode user and domain in data attributes'
    )
    assert.match(
      componentSource,
      /\{user\}&#64;\{domain\}/,
      'Component must use HTML entity encoding for the @ separator'
    )
  })

  it('provides accessible ARIA labels and one-tap clipboard copy action', () => {
    assert.match(
      componentSource,
      /aria-label=\{`Email \$\{name\} directly`\}/,
      'Must declare accessible email launch label'
    )
    assert.match(
      componentSource,
      /aria-label=\{`Copy \$\{name\}'s email to clipboard`\}/,
      'Must declare accessible copy button label'
    )
    assert.match(
      componentSource,
      /sound\.playChime\(\)/,
      'Must trigger audio feedback on successful copy'
    )
  })

  it('verifies all team member emails are valid RFC addresses capable of segmentation', () => {
    for (const member of teamMembers) {
      assert.ok(member.email.includes('@'), `Team member ${member.name} email missing @`)
      const [user, domain] = member.email.split('@')
      assert.ok(user && user.length > 0, `User part missing for ${member.name}`)
      assert.ok(domain && domain.includes('.'), `Domain part missing TLD for ${member.name}`)
    }
  })
})
