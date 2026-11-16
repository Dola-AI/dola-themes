import { expect, test } from 'claude-code/testing'
import { ALIASES, GROUPS, THEMES } from './hooks/themes/index.js'

// The CLI test harness has no $.theme (desktop only), so the pack is verified as data.
test('every theme is well-formed', () => {
  expect(THEMES.length).toBe(26)
  expect(new Set(THEMES.map(t => t.id)).size).toBe(THEMES.length)
  for (const t of THEMES) {
    // near-miss control-contrast notes are advisory; anything else is a real defect
    expect(t.problems.filter(p => !/it needs [0-9]/.test(p))).toEqual([])
    if (t.plain !== true) {
      for (const mode of ['dark', 'light'] as const) {
        const s = t.scenes[mode]
        expect(s.startsWith('<svg')).toBe(true)
        expect(s.length).toBeLessThan(131072)
        expect(s.includes('<script')).toBe(false)
      }
    }
  }
})

test('groups and aliases point at real themes', () => {
  expect(GROUPS.flatMap(g => g.themes).length).toBe(THEMES.length)
  for (const id of Object.values(ALIASES)) expect(THEMES.some(t => t.id === id)).toBe(true)
})
