import { along, wander } from './motion.js'
import { palette } from './palette.js'
import type { Pt } from './shapes.js'
import { SKETCH_CSS, loop, pencil, shade, wob } from './sketch.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Chalk-on-slate (dark) or graphite-on-paper (light): a forest sketched stroke by stroke, then rubbed out and redrawn.
const { theme, problems } = palette(
  'Sketch Forest',
  { accent: '#4caf78', danger: '#e5534b', success: '#4caf78', warning: '#e0a43a', pro: '#8a7be0' },
  ['#1b2026', '#222930', '#2a323a', '#323b44', '#f1eee4', '#cfcabd', '#a19c90'],
  ['#f3ecdc', '#f8f2e4', '#fcf8ee', '#fcf8ee', '#2a2620', '#524b3f', '#756d5e'],
)

const GREEN = '#4caf78'
const SUN = '#f2c14e'

function trees(): string {
  const r = rng(12)
  const out: string[] = []
  let t = 1.5
  for (let i = 0; i < 9; i++) {
    const x = 90 + i * 180 + r() * 60
    const h = 200 + r() * 160
    const big = 56 + r() * 40
    out.push(
      pencil(wob([[x - 12, 800], [x - 8, 800 - h], [x - 4, 800 - h - 30]], i * 3 + 1, 1.5), t, 2.6),
      pencil(wob([[x + 12, 800], [x + 8, 800 - h], [x + 4, 800 - h - 30]], i * 3 + 2, 1.5), t + 0.2, 2.6),
      loop(x, 800 - h - 50, big, big * 0.85, 100 + i, t + 0.5, undefined, 2.6),
      loop(x - 20, 800 - h - 30, big * 0.6, big * 0.5, 200 + i, t + 0.9, GREEN, 2),
      shade(x, 800 - h - 50, big, 9, 300 + i, t + 1.2, GREEN),
    )
    t += 0.8
  }

  return out.join('')
}

function grass(): string {
  const r = rng(5)
  const out: string[] = []
  for (let i = 0; i < 36; i++) {
    const x = r() * 1600
    const y = 800 + r() * 150
    out.push(pencil(wob([[x, y], [x + (r() - 0.5) * 14, y - 18 - r() * 16]], i, 0.8), 0.5 + i * 0.12, 1.8, GREEN, 0.8))
  }

  return out.join('')
}

function clouds(): string {
  return [[300, 190, 1], [900, 120, 1.3], [1380, 260, 0.9]]
    .map(([x, y, s], i) => {
      const pts: Pt[] = [[x! - 90 * s!, y! + 24], [x! - 90 * s!, y! - 6], [x! - 44 * s!, y! - 30 * s!], [x!, y! - 14], [x! + 40 * s!, y! - 36 * s!], [x! + 96 * s!, y! - 6], [x! + 96 * s!, y! + 24], [x! - 90 * s!, y! + 24]]

      return pencil(wob(pts, 60 + i, 2), 0.3 + i * 0.7, 2.4)
    })
    .join('')
}

function birds(): string {
  return [71, 72, 73]
    .map((s, i) => `<g>${along(wander(s, i % 2 ? 1 : -1, 100, 380, 5), 22 + i * 6, i * 7, false)}<path d="M-14,2 Q-7,-9 0,0 Q7,-9 14,2" fill="none" stroke="#eeeae0" stroke-width="3" stroke-linecap="round"><animate attributeName="d" values="M-14,2 Q-7,-9 0,0 Q7,-9 14,2;M-14,-4 Q-7,-1 0,2 Q7,-1 14,-4;M-14,2 Q-7,-9 0,0 Q7,-9 14,2" dur="0.9s" repeatCount="indefinite"/></path></g>`)
    .join('')
}

const rays = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2

  return pencil(`M${n(1260 + Math.cos(a) * 100)},${n(230 + Math.sin(a) * 100)} L${n(1260 + Math.cos(a) * 140)},${n(230 + Math.sin(a) * 140)}`, 0.2 + i * 0.1, 3, SUN)
}).join('')

const BODY = `
<rect width="1600" height="1000" fill="#1b2026"/>
${loop(1260, 230, 78, 78, 9, 0.1, SUN, 3.2)}${rays}
${clouds()}
${pencil(wob([[0, 800], [400, 790], [800, 805], [1200, 792], [1600, 800]], 44, 3), 0, 3)}
${pencil(wob([[0, 860], [500, 850], [1000, 866], [1600, 856]], 45, 3), 0.4, 2, undefined, 0.5)}
${trees()}
${grass()}
${birds()}
`

export const sketchForest: Theme = {
  id: 'sketch-forest',
  label: 'Sketch Forest',
  blurb: 'A forest drawn stroke by stroke in chalk or pencil, rubbed out and redrawn',
  theme,
  problems,
  scenes: dualScene(svg(SKETCH_CSS, BODY), { '#1b2026': '#f3ecdc', '#eeeae0': '#3b3b3b' }),
}
