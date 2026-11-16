import { palette } from './palette.js'
import { ridge } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Polar night: tall curtains of green, teal and violet light that ripple like a wave along their length, over snowy peaks and a still lake that mirrors them.
const { theme, problems } = palette(
  'Aurora',
  { accent: '#4fd1b5', danger: '#ef5f6b', success: '#3fb98a', warning: '#e9a93f', pro: '#a78bfa' },
  ['#0b0f1e', '#10152a', '#151b34', '#1a213d', '#eaeefc', '#c3cbe6', '#9aa5c9'],
  ['#e6eaf8', '#eef1fb', '#f6f7fd', '#f6f7fd', '#141a36', '#34406a', '#505b86'],
)

function stars(): string {
  const r = rng(7)

  return Array.from({ length: 150 }, () => `<circle class="s" cx="${n(r() * 1600)}" cy="${n(r() * 700)}" r="${n(0.7 + r() * 1.6)}" fill="#dfe8ff" style="animation-duration:${n(2 + r() * 4)}s;animation-delay:-${n(r() * 6)}s"/>`).join('')
}

/** A curtain: many tall translucent strips whose heights follow a slow wave, shimmering one after another. */
function curtain(seed: number, base: number, grad: string, lift: number, count = 44): string {
  const r = rng(seed)
  const w = 1600 / count
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const h = 230 + lift + 150 * Math.sin(i * 0.28 + seed) + 70 * Math.sin(i * 0.71 + seed * 2) + r() * 30
    out.push(`<rect class="cs" x="${n(i * w - 1)}" y="${n(base - h)}" width="${n(w + 2)}" height="${n(h)}" fill="url(#${grad})" style="animation-delay:-${n((i * 0.22) % 7)}s;animation-duration:${n(5 + r() * 3)}s"/>`)
  }

  return out.join('')
}

const CSS = `
.s{opacity:.2;animation:tw 3s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1}to{opacity:.95}}
.cs{transform-box:fill-box;transform-origin:50% 100%;animation:cs 6s ease-in-out infinite alternate}
@keyframes cs{0%{opacity:.35;transform:scaleY(.9)}50%{opacity:1;transform:scaleY(1.06)}100%{opacity:.5;transform:scaleY(.94)}}
.glow{animation:gl 12s ease-in-out infinite alternate}
@keyframes gl{from{opacity:.5}to{opacity:1}}
.sway{animation:sw 22s ease-in-out infinite alternate}
@keyframes sw{from{transform:translateX(-50px)}to{transform:translateX(50px)}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060f"/><stop offset=".6" stop-color="#0b1430"/><stop offset="1" stop-color="#16264a"/></linearGradient>
<linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fffb0" stop-opacity="0"/><stop offset=".25" stop-color="#4fffb0" stop-opacity=".55"/><stop offset=".7" stop-color="#2fd0a8" stop-opacity=".35"/><stop offset="1" stop-color="#2fd0a8" stop-opacity="0"/></linearGradient>
<linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ad8ff" stop-opacity="0"/><stop offset=".3" stop-color="#4fb8ff" stop-opacity=".42"/><stop offset="1" stop-color="#4f7bff" stop-opacity="0"/></linearGradient>
<linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c79bff" stop-opacity="0"/><stop offset=".3" stop-color="#b07bff" stop-opacity=".4"/><stop offset=".8" stop-color="#ff6bd0" stop-opacity=".2"/><stop offset="1" stop-color="#ff6bd0" stop-opacity="0"/></linearGradient>
<linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1a38"/><stop offset="1" stop-color="#050a18"/></linearGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#4fffc0" stop-opacity=".18"/><stop offset="1" stop-color="#4fffc0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${stars()}
<ellipse class="glow" cx="900" cy="480" rx="900" ry="300" fill="url(#halo)"/>
<g class="sway">${curtain(3, 800, 'gB', 40)}${curtain(5, 800, 'gC', 0)}${curtain(1, 800, 'gA', 70)}</g>
${ridge(790, 70, 4, ['#1a2744', '#16213c', '#1f2d4d'], 100)}
<polygon points="0,870 1600,870 1600,1000 0,1000" fill="url(#lake)"/>
<g opacity=".28" transform="translate(0,1740) scale(1,-1)"><g class="sway">${curtain(1, 800, 'gA', 70, 30)}</g></g>
<path d="M0,870 L1600,870" stroke="#4fffc0" stroke-opacity=".25" stroke-width="2"/>
`

export const aurora: Theme = {
  id: 'aurora',
  label: 'Aurora',
  blurb: 'Rippling curtains of green, teal and violet light over snowy peaks and a mirror lake',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#04060f': '#cfd9f5', '#0b1430': '#e0e6fa', '#16264a': '#f0ecfb', '#dfe8ff': '#6f7fd0',
    '#4fffb0': '#12b080', '#2fd0a8': '#12a08a', '#4fb8ff': '#3a78e0', '#4f7bff': '#4a62e0', '#b07bff': '#7a50e0', '#ff6bd0': '#d050b0',
    '#1a2744': '#93a0d0', '#16213c': '#8290c4', '#1f2d4d': '#a3b0dc', '#0d1a38': '#b9c4ea', '#050a18': '#9aa8d8',
  }),
}
