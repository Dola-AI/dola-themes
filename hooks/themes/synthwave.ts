import { makeColors } from '../make-colors.js'

import { n, rng, dualScene, svg } from './util.js'
import type { Theme } from './util.js'

// Retro neon: striped sun on the horizon, a perspective grid rushing toward you. Dark and light.
const { theme, problems } = makeColors({
  label: 'Synthwave',
  roles: { accent: '#ff4fa3', danger: '#ff5a5f', success: '#3ddc97', warning: '#ffb454', pro: '#9d7bff' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f6e6f4',
        'surface-1': '#fbeefa',
        'surface-2': '#fff7fe',
        'surface-3': '#fff7fe',
        'text-primary': '#2a1146',
        'text-secondary': '#4d2f72',
        'text-muted': '#6a4d90',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#140a24',
        'surface-1': '#1b0f30',
        'surface-2': '#22143b',
        'surface-3': '#2a1a46',
        'text-primary': '#f6ecff',
        'text-secondary': '#d4c3ee',
        'text-muted': '#a995cc',
      },
    },
  },
})

const HORIZON = 640

function stars(): string {
  const r = rng(21)
  const out: string[] = []
  for (let i = 0; i < 60; i++) {
    out.push(
      `<circle class="s" cx="${n(r() * 1600)}" cy="${n(r() * 480)}" r="${n(0.7 + r() * 1.4)}" fill="#fffffe" style="animation-delay:-${n(r() * 5)}s"/>`,
    )
  }

  return out.join('')
}

function floor(): string {
  const out: string[] = []
  for (let k = -9; k <= 9; k++) {
    out.push(`<line x1="800" y1="${HORIZON}" x2="${800 + k * 260}" y2="1000" stroke="#b84dff" stroke-width="1.5" opacity=".45"/>`)
  }
  for (let i = 0; i < 9; i++) {
    out.push(
      `<line class="h" x1="0" x2="1600" y1="${HORIZON}" y2="${HORIZON}" stroke="#ff4fa3" stroke-width="2" style="animation-delay:-${n(i * 0.7)}s"/>`,
    )
  }

  return out.join('')
}

const STRIPES = [
  [452, 5],
  [490, 8],
  [524, 11],
  [556, 14],
  [586, 17],
  [614, 20],
]
  .map(([y, h], i) => `<rect class="st" x="900" y="${y}" width="600" height="${h}" fill="#000" style="animation-delay:-${i * 0.5}s"/>`)
  .join('')

const CSS = `
.s{opacity:.3;animation:tw 3.5s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1}to{opacity:.9}}
.h{animation:fall 6.3s cubic-bezier(.55,0,1,.6) infinite;opacity:0}
@keyframes fall{0%{transform:translateY(0);opacity:0}12%{opacity:.8}100%{transform:translateY(360px);opacity:.9}}
.st{animation:slide 4s ease-in-out infinite alternate}
@keyframes slide{from{transform:translateY(0)}to{transform:translateY(10px)}}
.sun{animation:pulse 6s ease-in-out infinite alternate}
@keyframes pulse{from{opacity:.75}to{opacity:1}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0622"/><stop offset=".55" stop-color="#2b0f55"/><stop offset=".85" stop-color="#8a1f7a"/><stop offset="1" stop-color="#ff5f8f"/></linearGradient>
<linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0d4e"/><stop offset="1" stop-color="#0d0422"/></linearGradient>
<linearGradient id="sunfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset=".55" stop-color="#ff7b54"/><stop offset="1" stop-color="#ff2f92"/></linearGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff4fa3" stop-opacity=".5"/><stop offset="1" stop-color="#ff4fa3" stop-opacity="0"/></radialGradient>
<mask id="cut"><rect width="1600" height="1000" fill="#fff"/>${STRIPES}</mask>
</defs>
<rect width="1600" height="${HORIZON}" fill="url(#sky)"/>
${stars()}
<circle class="sun" cx="1200" cy="470" r="330" fill="url(#halo)"/>
<circle class="sun" cx="1200" cy="470" r="170" fill="url(#sunfill)" mask="url(#cut)"/>
<rect y="${HORIZON}" width="1600" height="${1000 - HORIZON}" fill="url(#fl)"/>
<ellipse cx="800" cy="${HORIZON}" rx="900" ry="40" fill="url(#halo)"/>
<line x1="0" x2="1600" y1="${HORIZON}" y2="${HORIZON}" stroke="#ff4fa3" stroke-width="2.5"/>
${floor()}
`

export const synthwave: Theme = {
  id: 'synthwave',
  label: 'Synthwave',
  blurb: 'Neon sunset with a striped sun and a grid rushing at you',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), { '#0d0622': '#ffe3f2', '#2b0f55': '#ffc4e0', '#8a1f7a': '#ffa8cc', '#ff5f8f': '#ffd9a8', '#2a0d4e': '#f1c9ff', '#0d0422': '#dca0ff', '#fffffe': '#c04fd8' }),
}
