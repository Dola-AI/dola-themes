import { makeColors } from '../make-colors.js'

import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Cyberpunk: a rain-soaked megacity at night, flickering neon signs, blinking towers. Original art.
const { theme, problems } = makeColors({
  label: 'Neon Rain',
  roles: { accent: '#00d9ff', danger: '#ff2e63', success: '#2ee6a6', warning: '#ffd23f', pro: '#b36bff' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6eaf8',
        'surface-1': '#eef1fb',
        'surface-2': '#f6f8fd',
        'surface-3': '#f6f8fd',
        'text-primary': '#10142c',
        'text-secondary': '#34406e',
        'text-muted': '#505c8a',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b0716',
        'surface-1': '#120b22',
        'surface-2': '#190f2d',
        'surface-3': '#201438',
        'text-primary': '#eaf4ff',
        'text-secondary': '#c0cde6',
        'text-muted': '#93a2c4',
      },
    },
  },
})

function skyline(seed: number, baseY: number, minH: number, maxH: number, fill: string, lit: boolean): string {
  const r = rng(seed)
  const out: string[] = []
  let x = -20
  while (x < 1620) {
    const w = 60 + r() * 110
    const h = minH + r() * (maxH - minH)
    out.push(`<rect x="${n(x)}" y="${n(baseY - h)}" width="${n(w)}" height="${n(h + 260)}" fill="${fill}"/>`)
    if (lit) {
      for (let k = 0; k < Math.floor((w * h) / 2800); k++) {
        out.push(
          `<rect class="wd" x="${n(x + 6 + r() * (w - 16))}" y="${n(baseY - h + 8 + r() * (h - 20))}" width="5" height="7" fill="${r() > 0.5 ? '#ffd23f' : '#00d9ff'}" style="animation-delay:-${n(r() * 8)}s;animation-duration:${n(3 + r() * 6)}s"/>`,
        )
      }
      if (r() > 0.7) {
        out.push(`<line x1="${n(x + w / 2)}" x2="${n(x + w / 2)}" y1="${n(baseY - h)}" y2="${n(baseY - h - 50)}" stroke="#3a2a5a" stroke-width="2"/><circle class="bl" cx="${n(x + w / 2)}" cy="${n(baseY - h - 52)}" r="3.5" fill="#ff2e63"/>`)
      }
    }
    x += w + r() * 8
  }

  return out.join('')
}

function sign(x: number, y: number, w: number, h: number, color: string, delay: number): string {
  return (
    `<g class="nf" style="animation-delay:-${delay}s">` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${color}" stroke-width="9" stroke-opacity=".22"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${color}" stroke-width="3"/>` +
    `<line x1="${x + 14}" x2="${x + w - 14}" y1="${y + h * 0.35}" y2="${y + h * 0.35}" stroke="${color}" stroke-width="3"/>` +
    `<line x1="${x + 14}" x2="${x + w * 0.6}" y1="${y + h * 0.65}" y2="${y + h * 0.65}" stroke="${color}" stroke-width="3"/></g>`
  )
}

function rain(): string {
  const r = rng(77)
  const out: string[] = []
  for (let i = 0; i < 110; i++) {
    const dur = 0.9 + r() * 0.8
    out.push(
      `<g transform="translate(${n(r() * 1700)},-60)"><line class="dr" x1="0" y1="0" x2="-7" y2="30" stroke="#8fb4ff" stroke-width="1.4" style="animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s"/></g>`,
    )
  }

  return out.join('')
}

const CSS = `
.wd{opacity:.15;animation:wd 5s ease-in-out infinite alternate}
@keyframes wd{from{opacity:.1}to{opacity:.9}}
.bl{animation:bl 2.4s steps(1) infinite}
@keyframes bl{0%{opacity:1}50%{opacity:.1}}
.nf{animation:nf 6s linear infinite}
@keyframes nf{0%,100%{opacity:1}90%{opacity:1}92%{opacity:.25}94%{opacity:1}96%{opacity:.4}98%{opacity:1}}
.dr{opacity:.45;animation:dr 1.2s linear infinite}
@keyframes dr{from{transform:translate(0,0)}to{transform:translate(-70px,1100px)}}
.hz{animation:hz 9s ease-in-out infinite alternate}
@keyframes hz{from{opacity:.6}to{opacity:1}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0614"/><stop offset=".55" stop-color="#1a0b33"/><stop offset="1" stop-color="#0b1230"/></linearGradient>
<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2e63" stop-opacity="0"/><stop offset="1" stop-color="#ff2e63" stop-opacity=".35"/></linearGradient>
<linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00d9ff" stop-opacity="0"/><stop offset="1" stop-color="#00d9ff" stop-opacity=".25"/></linearGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<rect class="hz" y="560" width="1600" height="300" fill="url(#gl)"/>
${skyline(5, 760, 140, 380, '#160c2c', false)}
${skyline(9, 840, 120, 330, '#0f0a1f', true)}
${sign(1180, 360, 150, 200, '#ff2e63', 0)}${sign(210, 300, 120, 170, '#00d9ff', 3)}${sign(820, 430, 110, 140, '#b36bff', 5)}
<rect class="hz" x="0" y="840" width="1600" height="160" fill="url(#gc)"/>
<rect y="925" width="1600" height="75" fill="#07040f"/>
${rain()}
`

export const neonRain: Theme = {
  id: 'neon-rain',
  label: 'Neon Rain',
  blurb: 'Cyberpunk megacity in the rain: flickering neon, blinking towers',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#0a0614': '#dfe6fb', '#1a0b33': '#ece8fb', '#0b1230': '#cfdcf5', '#160c2c': '#a7b2da', '#0f0a1f': '#8a96c4', '#07040f': '#6f7bab', '#3a2a5a': '#6a76a8', '#8fb4ff': '#4f6fd0',
  }),
}
