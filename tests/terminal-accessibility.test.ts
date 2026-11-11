import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

describe('Interactive Terminal WCAG 2.2 AA & Accessibility Suite', () => {
  const terminalFilePath = path.resolve(process.cwd(), 'components/ui/interactive-terminal.tsx')
  const content = fs.readFileSync(terminalFilePath, 'utf8')

  it('implements tabIndex={0} on the log container for keyboard scrollability', () => {
    assert.match(
      content,
      /tabIndex=\{0\}/,
      'Terminal log container must have tabIndex={0} so keyboard users can scroll through log buffer'
    )
  })

  it('declares semantic region role and descriptive ARIA label for screen readers', () => {
    assert.match(
      content,
      /role="region"/,
      'Log container must declare role="region" to identify as a scrollable landmark'
    )
    assert.match(
      content,
      /aria-label="Terminal command history"/,
      'Log container must declare aria-label="Terminal command history"'
    )
    assert.match(
      content,
      /aria-live="polite"/,
      'Log container must announce updates politely without interrupting user focus'
    )
  })

  it('provides visible focus-visible ring indicators for keyboard navigation', () => {
    assert.match(
      content,
      /focus-visible:ring-1/,
      'Log container must have a clear visible focus indicator when active'
    )
    assert.match(
      content,
      /focus-visible:ring-accent/,
      'Focus indicator must use the accent design token'
    )
  })

  it('ensures input command field is properly labeled and bounded', () => {
    assert.match(
      content,
      /<label className="sr-only" htmlFor="terminal-command">Terminal command<\/label>/,
      'Input field must have an explicit accessible screen reader label'
    )
    assert.match(
      content,
      /maxLength=\{200\}/,
      'Input field must strictly enforce 200 char bound to prevent DOM memory exhaustion'
    )
  })

  it('ensures nested scroll lock attributes remain absent for natural document scroll', () => {
    assert.doesNotMatch(
      content,
      /data-lenis-prevent/,
      'Terminal must not contain data-lenis-prevent to preserve smooth page scroll'
    )
    assert.doesNotMatch(
      content,
      /overscroll-contain/,
      'Terminal must not contain overscroll-contain to allow seamless wheel scroll chaining'
    )
  })
})
