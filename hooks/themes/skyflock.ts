import { makeColors } from '../make-colors.js'

import { along, wander } from './motion.js'
import { ridge, tri } from './shapes.js'
import type { Pt } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Cartoon sky: flocks of birds in V formation and a swirling murmuration over a golden-hour (dark) or bright-day (light) landscape.
const { theme, problems } = makeColors({
  label: 'Skyflock',
  roles: { accent: '#ff8a4a', danger: '#ff4d6d', success: '#4ccf8f', warning: '#ffc247', pro: '#a98bff' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6f0fb',
        'surface-1': '#eef5fc',
        'surface-2': '#f6faff',
        'surface-3': '#f6faff',
        'text-primary': '#10213a',
        'text-secondary': '#34506f',
        'text-muted': '#506c8c',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#170f22',
        'surface-1': '#1f1530',
        'surface-2': '#271b3a',
        'surface-3': '#30224a',
        'text-primary': '#fff1e6',
        'text-secondary': '#e0cfd6',
        'text-muted': '#b39fb3',
      },
    },
  },
})

const FLAP = 'M-12,2 Q-6,-8 0,0 Q6,-8 12,2;M-12,-5 Q-6,-1 0,2 Q6,-1 12,-5;M-12,2 Q-6,-8 0,0 Q6,-8 12,2'

/** One bird, wings flapping out of step with its neighbours. */
const bird = (phase: number): string =>
  `<path d="M-12,2 Q-6,-8 0,0 Q6,-8 12,2" fill="none" stroke="#1a0f24" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">` +
  `<animate attributeName="d" values="${FLAP}" dur="0.9s" begin="-${n(phase)}s" repeatCount="indefinite"/></path>`

/** A V of birds gliding along a winding route. */
function vee(seed: number, dir: 1 | -1, lo: number, hi: number, dur: number, lead: number, wings: number, scale: number): string {
  const r = rng(seed)
  const path = wander(seed, dir, lo, hi, 6)
  const members: string[] = [`<g>${bird(r())}</g>`]
  for (let i = 1; i <= wings; i++) {
    for (const side of [-1, 1]) {
      members.push(`<g transform="translate(${n(-dir * i * 30)},${n(side * i * 22 + (r() - 0.5) * 6)})">${bird(r())}</g>`)
    }
  }

  return `<g>${along(path, dur, lead, false)}<g transform="scale(${scale})">${members.join('')}</g></g>`
}

/** A murmuration: a loose cloud of birds that stretches, squeezes and swirls as it travels. */
function murmur(seed: number, dur: number, lead: number, count: number): string {
  const r = rng(seed)
  const path = wander(seed, 1, 220, 520, 9)
  const birds: string[] = []
  for (let i = 0; i < count; i++) {
    const dx = (r() - 0.5) * 70
    const dy = (r() - 0.5) * 50
    const d = 3 + r() * 4
    birds.push(
      `<g><animateTransform attributeName="transform" type="translate" values="0,0;${n(dx)},${n(dy)};0,0" dur="${n(d)}s" begin="-${n(r() * d)}s" repeatCount="indefinite"/>` +
        `<g transform="translate(${n((r() - 0.5) * 260)},${n((r() - 0.5) * 120)}) scale(${n(0.5 + r() * 0.35)})">${bird(r())}</g></g>`,
    )
  }

  return (
    `<g>${along(path, dur, lead, false)}<g>` +
    `<animateTransform attributeName="transform" type="scale" values="1,1;1.35,0.7;0.8,1.3;1.15,0.9;1,1" dur="11s" repeatCount="indefinite"/>` +
    `${birds.join('')}</g></g>`
  )
}

function lone(seed: number, dir: 1 | -1, y: number, dur: number, lead: number, scale: number): string {
  const path = wander(seed, dir, y - 60, y + 60, 5)

  return `<g>${along(path, dur, lead, false)}<g transform="scale(${scale})">${bird(seed % 5)}</g></g>`
}

function cloud(x: number, y: number, s: number, delay: number): string {
  return (
    `<g transform="translate(${x},${y}) scale(${s})"><g class="cl" style="animation-delay:-${delay}s">` +
    `<g fill="#ffb3a1" stroke="#2b1240" stroke-width="5" stroke-linejoin="round">` +
    `<ellipse cx="0" cy="0" rx="120" ry="34"/><circle cx="-50" cy="-26" r="40"/><circle cx="10" cy="-44" r="50"/><circle cx="66" cy="-22" r="36"/></g>` +
    `<ellipse cx="0" cy="8" rx="112" ry="26" fill="#ffb3a1"/></g></g>`
  )
}

function balloon(): string {
  return (
    `<g transform="translate(1250,430)"><g class="bln">` +
    `<g stroke="#2b1240" stroke-width="5" stroke-linejoin="round"><ellipse cx="0" cy="0" rx="62" ry="74" fill="#ff6b6b"/>` +
    `<path d="M-30,60 L-16,104 L16,104 L30,60 Z" fill="#ffc247"/></g>` +
    `<path d="M-40,-4 Q0,70 40,-4" fill="none" stroke="#ffe27a" stroke-width="10" stroke-linecap="round"/>` +
    `<rect x="-14" y="112" width="28" height="20" rx="3" fill="#8a5a3a" stroke="#2b1240" stroke-width="4"/>` +
    `<line x1="-12" y1="104" x2="-10" y2="112" stroke="#2b1240" stroke-width="3"/><line x1="12" y1="104" x2="10" y2="112" stroke="#2b1240" stroke-width="3"/></g></g>`
  )
}

const CSS = `
.cl{animation:cl 90s ease-in-out infinite alternate}
@keyframes cl{from{transform:translateX(-200px)}to{transform:translateX(200px)}}
.bln{animation:bln 12s ease-in-out infinite alternate}
@keyframes bln{from{transform:translate(-40px,18px) rotate(-3deg)}to{transform:translate(40px,-22px) rotate(3deg)}}
.sun{animation:sun 8s ease-in-out infinite alternate}
@keyframes sun{from{opacity:.7}to{opacity:1}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1030"/><stop offset=".5" stop-color="#6a2a5a"/><stop offset="1" stop-color="#ff8a4a"/></linearGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle class="sun" cx="560" cy="720" r="420" fill="url(#halo)"/>
<circle cx="560" cy="720" r="130" fill="#ffd27a" stroke="#2b1240" stroke-width="6"/>
${ridge(760, 60, 4, ['#3a1a52', '#331547', '#44205e'], 110)}
${cloud(300, 220, 1, 0)}${cloud(980, 150, 1.3, 30)}${cloud(1400, 330, 0.9, 55)}
${balloon()}
${ridge(860, 34, 8, ['#241038', '#1d0c2e', '#2b1342'], 90)}
${vee(3, 1, 160, 420, 58, 12, 4, 1.2)}
${vee(7, -1, 300, 560, 74, 40, 3, 0.8)}
${vee(11, 1, 120, 300, 90, 70, 5, 0.65)}
${murmur(5, 70, 30, 64)}
${lone(21, -1, 520, 46, 10, 1.6)}${lone(22, 1, 640, 52, 25, 1.2)}${lone(23, -1, 380, 64, 8, 0.9)}
${ridge(935, 18, 12, ['#160a24', '#120820', '#1b0c2c'], 80)}
`

export const skyflock: Theme = {
  id: 'skyflock',
  label: 'Skyflock',
  blurb: 'Cartoon sky: V-formation flocks, a swirling murmuration, drifting clouds and a balloon',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#1b1030': '#7ec8ff', '#6a2a5a': '#b8e4ff', '#ff8a4a': '#fff1c9', '#ffd27a': '#fff3a8',
    '#3a1a52': '#8fc8b8', '#331547': '#7fbcae', '#44205e': '#9fd4c4', '#241038': '#5fa896', '#1d0c2e': '#4f9886', '#2b1342': '#6ab4a2',
    '#160a24': '#3f8a78', '#120820': '#357c6b', '#1b0c2c': '#488f7d',
    '#ffb3a1': '#ffffff', '#2b1240': '#3f6fa0', '#1a0f24': '#243a5c',
  }),
}
