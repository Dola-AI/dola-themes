import { palette } from './palette.js'
import { tri } from './shapes.js'
import type { Pt } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A campfire in the pines: layered flames that flicker, sparks spiralling up into the dark, smoke, firelight on the ground and the trunks.
const { theme, problems } = palette(
  'Ember',
  { accent: '#ff8a3d', danger: '#f2545b', success: '#5fbf7d', warning: '#f2b441', pro: '#c08bf0' },
  ['#120c0a', '#1a1210', '#221815', '#2a1d19', '#f6ece6', '#d6c3b9', '#ab9588'],
  ['#f6ebe2', '#fbf2ea', '#fff9f3', '#fff9f3', '#2b1a13', '#573a2d', '#76574a'],
)

function pines(): string {
  const r = rng(9)
  const out: string[] = []
  for (let i = 0; i < 16; i++) {
    const x = (i + r() * 0.6) * 112 - 30
    const s = 0.8 + r() * 1.1
    const base = 880 - r() * 40
    const tier = (k: number): Pt[] => [[x - 52 * s * (1 - k * 0.2), base - k * 70 * s], [x, base - 120 * s - k * 70 * s], [x + 52 * s * (1 - k * 0.2), base - k * 70 * s]]
    out.push(tri(tier(0), '#0b0807'), tri(tier(1), '#0b0807'), tri(tier(2), '#0b0807'), tri(tier(3), '#0b0807'))
  }

  return out.join('')
}

function sparks(): string {
  const r = rng(3)
  const out: string[] = []
  for (let i = 0; i < 70; i++) {
    const dur = 3 + r() * 5
    const dx = (r() - 0.5) * 260
    out.push(`<g transform="translate(${n(780 + (r() - 0.5) * 80)},840)"><circle class="sk" r="${n(1.3 + r() * 2.6)}" fill="${r() > 0.5 ? '#ffb347' : '#ff6a1f'}" style="--dx:${n(dx)}px;animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s"/></g>`)
  }

  return out.join('')
}

function smoke(): string {
  const r = rng(14)

  return Array.from({ length: 7 }, (_, i) => `<g transform="translate(${n(770 + (r() - 0.5) * 60)},700)"><ellipse class="sm" rx="${n(40 + r() * 40)}" ry="${n(24 + r() * 20)}" fill="#a89890" style="animation-delay:-${n(i * 1.6)}s"/></g>`).join('')
}

const flame = (cx: number, h: number, w: number, fill: string, delay: number, dur: number): string =>
  `<g transform="translate(${cx},850)"><path class="fl" d="M${-w},0 C${-w * 1.1},${-h * 0.3} ${-w * 0.4},${-h * 0.5} ${-w * 0.2},${-h * 0.75} C${w * 0.1},${-h * 0.95} ${w * 0.05},${-h} 0,${-h} C${w * 0.3},${-h * 0.7} ${w * 1.1},${-h * 0.45} ${w},0Z" fill="${fill}" style="animation-delay:-${delay}s;animation-duration:${dur}s"/></g>`

const CSS = `
.s{opacity:.2;animation:tw 3.5s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1}to{opacity:.9}}
.fl{transform-box:fill-box;transform-origin:50% 100%;animation:fl .9s ease-in-out infinite alternate}
@keyframes fl{from{transform:scale(.94,.9) skewX(-3deg)}to{transform:scale(1.06,1.12) skewX(4deg)}}
.sk{opacity:0;animation:sk 5s ease-out infinite}
@keyframes sk{0%{transform:translate(0,0);opacity:0}8%{opacity:1}100%{transform:translate(var(--dx),-780px);opacity:0}}
.sm{opacity:0;animation:sm 11s ease-out infinite}
@keyframes sm{0%{transform:translate(0,0) scale(.5);opacity:0}15%{opacity:.14}100%{transform:translate(60px,-420px) scale(2.6);opacity:0}}
.gl{animation:gl 1.6s ease-in-out infinite alternate}
@keyframes gl{from{opacity:.6}to{opacity:1}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050304"/><stop offset=".7" stop-color="#150b08"/><stop offset="1" stop-color="#3a1608"/></linearGradient>
<radialGradient id="light" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff9a3a" stop-opacity=".75"/><stop offset=".5" stop-color="#ff6a1f" stop-opacity=".25"/><stop offset="1" stop-color="#ff6a1f" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${Array.from({ length: 70 }, (_, i) => `<circle class="s" cx="${(i * 233) % 1600}" cy="${(i * 97) % 520}" r="${1 + (i % 3) * 0.6}" fill="#ffe9d0" style="animation-delay:-${(i % 7) * 0.8}s"/>`).join('')}
${pines()}
<ellipse class="gl" cx="780" cy="840" rx="760" ry="420" fill="url(#light)"/>
<polygon points="0,880 1600,870 1600,1000 0,1000" fill="#0a0605"/>
<ellipse class="gl" cx="780" cy="900" rx="420" ry="50" fill="#ff7a1f" opacity=".35"/>
${smoke()}
<g transform="translate(780,860) rotate(-12)"><rect x="-120" y="-14" width="240" height="30" rx="14" fill="#2a1a12"/></g>
<g transform="translate(780,860) rotate(14)"><rect x="-120" y="-14" width="240" height="30" rx="14" fill="#33200f"/></g>
${flame(780, 300, 78, '#ff5a14', 0, 1.0)}${flame(742, 230, 52, '#ff7a1f', 0.3, 0.8)}${flame(820, 250, 56, '#ff8a2a', 0.5, 0.9)}
${flame(780, 220, 50, '#ffb347', 0.2, 0.7)}${flame(780, 150, 34, '#fff1b0', 0.4, 0.6)}
${sparks()}
`

export const ember: Theme = {
  id: 'ember',
  label: 'Ember',
  blurb: 'A campfire among the pines: flickering flames, rising sparks, smoke and firelight',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#050304': '#ffe9cf', '#150b08': '#ffd9b2', '#3a1608': '#ffc58a', '#0b0807': '#5a3a28', '#0a0605': '#7a4c34',
    '#ffe9d0': '#c98a4a', '#2a1a12': '#4a2a18', '#33200f': '#5a3418', '#a89890': '#6a5a52',
  }),
}
