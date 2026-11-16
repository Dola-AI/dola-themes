import { smooth } from './motion.js'
import { palette } from './palette.js'
import type { Pt } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A black hole simulation: a glowing accretion disk, light bent over and under the horizon, matter spiralling in.
const { theme, problems } = palette(
  'Black Hole',
  { accent: '#ffa94d', danger: '#ff5a5f', success: '#4fd69c', warning: '#ffc857', pro: '#b69cff' },
  ['#05060b', '#0b0d15', '#11141f', '#171b29', '#f4efe6', '#d2cabd', '#a39a8b'],
  ['#efe6d4', '#f6efe0', '#fcf8ee', '#fcf8ee', '#241a0c', '#4d3d26', '#6d5a3e'],
)

const CX = 1100
const CY = 470
const DISK = ['#fff4d0', '#ffd98a', '#ffb347', '#ff8a2a', '#e0561a', '#a83a12', '#5a1e0c']

const disk = DISK.map((c, k) => {
  const rx = 100 + k * 40
  const dash = `${34 + k * 14} ${18 + k * 7}`

  return `<ellipse class="fw" cx="0" cy="0" rx="${rx}" ry="${n(rx * 0.24)}" fill="none" stroke="${c}" stroke-width="${n(8 - k * 0.7)}" stroke-dasharray="${dash}" style="animation-duration:${n(5 + k * 2.2)}s"/>`
}).join('')

function infall(): string {
  const r = rng(33)
  const out: string[] = []
  for (let i = 0; i < 34; i++) {
    const r0 = 380 + r() * 520
    const a0 = r() * Math.PI * 2
    const pts: Pt[] = Array.from({ length: 22 }, (_, j): Pt => {
      const t = j / 21
      const rad = r0 * Math.pow(1 - t, 1.1) + 70
      const a = a0 + t * Math.PI * 2 * 2.4

      return [Math.cos(a) * rad, Math.sin(a) * rad * 0.55]
    })
    const dur = 6 + r() * 6
    out.push(
      `<circle r="${n(1.6 + r() * 2.2)}" fill="${r() > 0.35 ? '#ffd98a' : '#9ad0ff'}"><animateMotion path="${smooth(pts)}" dur="${n(dur)}s" begin="-${n(r() * dur)}s" repeatCount="indefinite"/>` +
        `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="${n(dur)}s" begin="-${n(r() * dur)}s" repeatCount="indefinite"/></circle>`,
    )
  }

  return out.join('')
}

function stars(): string {
  const r = rng(2)
  const out: string[] = []
  for (let i = 0; i < 110; i++) {
    out.push(
      `<circle class="s" cx="${n(r() * 1600)}" cy="${n(r() * 1000)}" r="${n(0.5 + r() * 1.5)}" fill="#ffffff" style="animation-duration:${n(2 + r() * 4)}s;animation-delay:-${n(r() * 6)}s"/>`,
    )
  }

  return out.join('')
}

const CSS = `
.s{opacity:.25;animation:tw 4s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1}to{opacity:.9}}
.fw{animation:fw 8s linear infinite}
@keyframes fw{to{stroke-dashoffset:-300}}
.glow{animation:gl 5s ease-in-out infinite alternate}
@keyframes gl{from{opacity:.5}to{opacity:1}}
.warp{transform-box:fill-box;transform-origin:center;animation:wp 14s ease-in-out infinite alternate}
@keyframes wp{from{transform:scale(1)}to{transform:scale(1.04)}}
`

const BODY = `
<defs>
<radialGradient id="bg" cx="69%" cy="47%" r="80%"><stop offset="0" stop-color="#1b0f08"/><stop offset=".4" stop-color="#0a0a12"/><stop offset="1" stop-color="#030409"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff9a3a" stop-opacity=".5"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
${stars()}
<g transform="translate(${CX},${CY})">
<ellipse class="glow" rx="460" ry="260" fill="url(#halo)"/>
<g class="warp" transform="rotate(-14)">
<path d="M-250,0 C-150,-280 150,-280 250,0" fill="none" stroke="#ffd98a" stroke-opacity=".4" stroke-width="6"/>
<path d="M-250,0 C-150,250 150,250 250,0" fill="none" stroke="#ff8a2a" stroke-opacity=".28" stroke-width="6"/>
${disk}
</g>
<circle r="64" fill="#000000"/>
<circle r="68" fill="none" stroke="#ff9a3a" stroke-opacity=".3" stroke-width="12"/>
<circle r="66" fill="none" stroke="#ffe9b0" stroke-width="3"/>
${infall()}
</g>
`

export const blackHole: Theme = {
  id: 'black-hole',
  label: 'Black Hole',
  blurb: 'Black hole simulation: glowing accretion disk, bent light, matter spiralling past the horizon',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#1b0f08': '#f6ecd8', '#0a0a12': '#ece0c8', '#030409': '#dccfb2', '#ffffff': '#7a6848',
    '#fff4d0': '#c46a10', '#ffd98a': '#e68a1c', '#ffe9b0': '#b8650d', '#9ad0ff': '#2f6fd0',
  }),
}
