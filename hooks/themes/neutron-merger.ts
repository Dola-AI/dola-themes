import { smooth } from './motion.js'
import { palette } from './palette.js'
import type { Pt } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Two neutron stars spiral together, faster and faster, shedding gravitational waves, then merge in a kilonova flash. Loops.
const { theme, problems } = palette(
  'Neutron Merger',
  { accent: '#6fa8ff', danger: '#ff6b7a', success: '#4fd69c', warning: '#ffc857', pro: '#b69cff' },
  ['#060a18', '#0b1124', '#111830', '#171f3a', '#eaf0ff', '#bfcaec', '#93a0cb'],
  ['#e6ecff', '#eef2ff', '#f6f8ff', '#f6f8ff', '#10163a', '#323a6c', '#515a8c'],
)

const LOOP = 12
const CX = 1130
const CY = 430

// The inspiral: one turn per ~1/6 of the path, radius shrinking to nothing.
const SPIRAL = smooth(
  Array.from({ length: 71 }, (_, i): Pt => {
    const t = i / 70
    const r = 330 * Math.pow(1 - t, 0.85) + 4
    const a = Math.PI * 2 * 6 * t

    return [Math.cos(a) * r, Math.sin(a) * r]
  }),
)

const star = (core: string): string =>
  `<circle r="64" fill="url(#glow)" opacity=".8"/><circle r="19" fill="${core}"/><circle r="7" fill="#ffffff"/>`

const orbit = (core: string): string =>
  `<g><animateMotion path="${SPIRAL}" dur="${LOOP}s" repeatCount="indefinite"/>${star(core)}</g>`

function stars(): string {
  const r = rng(9)
  const out: string[] = []
  for (let i = 0; i < 90; i++) {
    out.push(
      `<circle class="s" cx="${n(r() * 1600)}" cy="${n(r() * 1000)}" r="${n(0.6 + r() * 1.5)}" fill="#cfe0ff" style="animation-duration:${n(2 + r() * 4)}s;animation-delay:-${n(r() * 6)}s"/>`,
    )
  }

  return out.join('')
}

const rings = Array.from({ length: 6 }, (_, i) => `<circle class="rp" r="120" fill="none" stroke="#8ab4ff" stroke-width="2.5" style="animation-delay:-${n(i * 0.8)}s"/>`).join('')

const flash = (attr: string, values: string): string =>
  `<animate attributeName="${attr}" values="${values}" keyTimes="0;.9;.915;.97;1" dur="${LOOP}s" repeatCount="indefinite"/>`

const CSS = `
.s{opacity:.25;animation:tw 4s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1}to{opacity:1}}
.rp{transform-box:fill-box;transform-origin:center;opacity:0;animation:rp 4.8s ease-out infinite}
@keyframes rp{0%{transform:scale(.15);opacity:.7}100%{transform:scale(3.4);opacity:0}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02030a"/><stop offset=".6" stop-color="#070b22"/><stop offset="1" stop-color="#0b1334"/></linearGradient>
<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#bfe3ff" stop-opacity=".9"/><stop offset="1" stop-color="#6fa8ff" stop-opacity="0"/></radialGradient>
<radialGradient id="burst" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#9fd0ff" stop-opacity=".9"/><stop offset=".7" stop-color="#ff9a5a" stop-opacity=".5"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${stars()}
<g transform="translate(${CX},${CY})">
${rings}
<path d="${SPIRAL}" fill="none" stroke="#7fb8ff" stroke-opacity=".28" stroke-width="2.5" stroke-dasharray="3 7"/>
<g transform="rotate(180)"><path d="${SPIRAL}" fill="none" stroke="#7fb8ff" stroke-opacity=".28" stroke-width="2.5" stroke-dasharray="3 7"/></g>
${orbit('#9fd0ff')}
<g transform="rotate(180)">${orbit('#ffd9a0')}</g>
<circle r="0" fill="url(#burst)" opacity="0">${flash('r', '0;0;40;420;520')}${flash('opacity', '0;0;1;.5;0')}</circle>
</g>
`

export const neutronMerger: Theme = {
  id: 'neutron-merger',
  label: 'Neutron Merger',
  blurb: 'Two neutron stars spiral together, send out gravitational waves, then merge in a kilonova flash',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#02030a': '#e9eeff', '#070b22': '#d9e2ff', '#0b1334': '#c6d4fb', '#8ab4ff': '#3a64d0', '#7fb8ff': '#3a64d0', '#cfe0ff': '#6a7ccc',
  }),
}
