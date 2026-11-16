import { palette } from './palette.js'
import type { Pt } from './shapes.js'
import { SKETCH_CSS, loop, pencil, wob } from './sketch.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A skyline sketched stroke by stroke under a pencilled moon, windows lighting up in coloured pencil. Chalk (dark) or graphite (light).
const { theme, problems } = palette(
  'Sketch City',
  { accent: '#4a8fe7', danger: '#e5534b', success: '#4caf78', warning: '#e0a43a', pro: '#8a7be0' },
  ['#1b2026', '#222930', '#2a323a', '#323b44', '#f1eee4', '#cfcabd', '#a19c90'],
  ['#f3ecdc', '#f8f2e4', '#fcf8ee', '#fcf8ee', '#2a2620', '#524b3f', '#756d5e'],
)

const YELLOW = '#f2c14e'

function city(): string {
  const r = rng(21)
  const out: string[] = []
  let x = 40
  let t = 0.6
  let seed = 1
  while (x < 1540) {
    const w = 90 + r() * 80
    const h = 160 + r() * 360
    const top = 860 - h
    const pts: Pt[] = [[x, 860], [x, top], [x + w, top], [x + w, 860]]
    out.push(pencil(wob(pts, seed++, 2.4), t, 2.8))
    if (r() > 0.55) {
      out.push(pencil(wob([[x + w / 2, top], [x + w / 2, top - 50 - r() * 40]], seed++, 1), t + 0.5, 2.2))
    }
    const cols = Math.max(2, Math.floor(w / 28))
    const rows = Math.floor(h / 66)
    for (let cx = 0; cx < cols; cx++) {
      for (let cy = 0; cy < rows; cy++) {
        const wx = x + 12 + cx * ((w - 24) / cols)
        const wy = top + 16 + cy * 66
        out.push(pencil(wob([[wx, wy], [wx + 12, wy], [wx + 12, wy + 18], [wx, wy + 18], [wx, wy]], seed++, 0.8), t + 0.6 + (cx + cy) * 0.05, 1.5, undefined, 0.7))
        if (r() > 0.78) {
          out.push(`<rect class="lt" x="${n(wx + 2)}" y="${n(wy + 2)}" width="8" height="14" fill="${YELLOW}" opacity=".6" style="animation-delay:-${n(r() * 3)}s"/>`)
        }
      }
    }
    // a few hatch strokes down one side of the tower for shading
    for (let k = 0; k < Math.floor(h / 45); k++) {
      out.push(pencil(`M${n(x + w - 16)},${n(top + 8 + k * 45)} l12,-8`, t + 1 + k * 0.04, 1.2, undefined, 0.45))
    }
    x += w + 16 + r() * 8
    t += 0.55
  }

  return out.join('')
}

function stars(): string {
  const r = rng(9)

  return Array.from({ length: 26 }, (_, i) => {
    const x = r() * 1500
    const y = r() * 360

    return pencil(`M${n(x - 6)},${n(y)} l12,0 M${n(x)},${n(y - 6)} l0,12`, 0.2 + i * 0.08, 1.6, undefined, 0.7)
  }).join('')
}

const BODY = `
<rect width="1600" height="1000" fill="#1b2026"/>
${stars()}
${loop(1280, 220, 90, 90, 3, 0.2, undefined, 3)}${loop(1250, 200, 14, 12, 4, 0.9, undefined, 2)}${loop(1310, 250, 10, 9, 5, 1.1, undefined, 2)}
${pencil(wob([[0, 860], [800, 866], [1600, 858]], 90, 3), 0, 3)}
${pencil(wob([[0, 900], [800, 906], [1600, 898]], 91, 3), 0.5, 2, undefined, 0.5)}
${city()}
`

export const sketchCity: Theme = {
  id: 'sketch-city',
  label: 'Sketch City',
  blurb: 'A skyline sketched stroke by stroke under a pencilled moon, windows glowing in coloured pencil',
  theme,
  problems,
  scenes: dualScene(svg(SKETCH_CSS, BODY), { '#1b2026': '#f3ecdc', '#eeeae0': '#3b3b3b' }),
}
