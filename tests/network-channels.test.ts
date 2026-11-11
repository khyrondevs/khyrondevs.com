import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { siteConfig } from '../lib/content/site-config.ts'

describe('Data-Driven Network Channels Registry Suite', () => {
  const footerFilePath = path.resolve(process.cwd(), 'components/sections/shared/footer.tsx')
  const footerContent = fs.readFileSync(footerFilePath, 'utf8')

  it('declares strongly-typed networkChannels with complete metadata', () => {
    assert.ok(Array.isArray(siteConfig.networkChannels), 'networkChannels must be an array')
    assert.ok(siteConfig.networkChannels.length >= 4, 'Must define at least 4 core channels')

    for (const channel of siteConfig.networkChannels) {
      assert.ok(channel.id && typeof channel.id === 'string', 'Channel missing valid id')
      assert.ok(channel.label && typeof channel.label === 'string', 'Channel missing valid label')
      assert.ok(channel.href && typeof channel.href === 'string', 'Channel missing valid href')
      assert.equal(typeof channel.active, 'boolean', `Channel ${channel.id} active must be boolean`)
      assert.equal(typeof channel.external, 'boolean', `Channel ${channel.id} external must be boolean`)
    }
  })

  it('activates verified channels and safely deactivates uncreated channels', () => {
    const activeChannels = siteConfig.networkChannels.filter((c) => c.active)
    const activeIds = activeChannels.map((c) => c.id)

    // Active channels
    assert.ok(activeIds.includes('email'), 'Direct Email channel must be active')
    assert.ok(activeIds.includes('github'), 'GitHub channel must be active')
    assert.equal(activeChannels.length, 2, 'Only Email and GitHub should be currently active')

    // Inactive channels awaiting official handle registration
    const inactiveChannels = siteConfig.networkChannels.filter((c) => !c.active)
    const inactiveIds = inactiveChannels.map((c) => c.id)
    assert.ok(inactiveIds.includes('twitter'), 'Twitter channel must be inactive until registered')
    assert.ok(inactiveIds.includes('linkedin'), 'LinkedIn channel must be inactive until registered')
  })

  it('correctly assigns external attribute semantics', () => {
    const emailChannel = siteConfig.networkChannels.find((c) => c.id === 'email')!
    assert.equal(emailChannel.external, false, 'Email channel should not be marked external target _blank')

    const githubChannel = siteConfig.networkChannels.find((c) => c.id === 'github')!
    assert.equal(githubChannel.external, true, 'GitHub channel must be marked external')

    const twitterChannel = siteConfig.networkChannels.find((c) => c.id === 'twitter')!
    assert.equal(twitterChannel.external, true, 'Twitter channel must be marked external')

    const linkedinChannel = siteConfig.networkChannels.find((c) => c.id === 'linkedin')!
    assert.equal(linkedinChannel.external, true, 'LinkedIn channel must be marked external')
  })

  it('footer.tsx utilizes dynamic filtering and assigns security attributes on external links', () => {
    assert.match(
      footerContent,
      /siteConfig\.networkChannels/,
      'footer.tsx must reference siteConfig.networkChannels'
    )
    assert.match(
      footerContent,
      /\.filter\(\s*\(channel\)\s*=>\s*channel\.active\)/,
      'footer.tsx must filter for active channels'
    )
    assert.match(
      footerContent,
      /rel=\{channel\.external \? 'noopener noreferrer' : undefined\}/,
      'footer.tsx must enforce noopener noreferrer on external channels'
    )
  })
})
