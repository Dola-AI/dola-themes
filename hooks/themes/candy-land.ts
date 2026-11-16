import { smooth } from './motion.js'
import { palette } from './palette.js'
import { ridge } from './shapes.js'
import type { Pt } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Cartoon candy land: a breathing rainbow, swaying lollipops, gumdrops, cotton-candy clouds and bouncing jelly critters.
const { theme, problems } = palette(
  'Candy Land',
  { accent: '#ff5fa8', danger: '#ff5a5f', success: '#3ccf8f', warning: '#ffb23f', pro: '#a07bff' },
  ['#1f1245', '#291a58', '#33226b', '#3f2b7e', '#fff0fa', '#e3cdee', '#b9a0cf'],
  ['#ffeaf5', '#fff2f9', '#fff9fc', '#fff9fc', '#3a1450', '#6a3a80', '#8a5aa0'],
)

const OL = '#3a1a55'
const SPIRAL = smooth(Array.from({ length: 40 }, (_, i): Pt => {
  const t = i / 39
  const a = t * Math.PI * 6

  return [Math.cos(a) * t * 32, Math.sin(a) * t * 32]
}))

const lolly = (x: number, y: number, s: number, color: string, delay: number): string =>
  `<g transform="translate(${x},${y}) scale(${s})"><g class="k" style="animation-delay:-${delay}s"><rect x="-5" y="0" width="10" height="130" fill="#fff3e6" stroke="${OL}" stroke-width="4"/>` +
  `<circle cx="0" cy="0" r="40" fill="${color}" stroke="${OL}" stroke-width="5"/><path d="${SPIRAL}" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/></g></g>`

const gumdrop = (x: number, y: number, s: number, color: string): string =>
  `<g transform="translate(${x},${y}) scale(${s})"><path d="M-30,0 Q-30,-46 0,-50 Q30,-46 30,0Z" fill="${color}" stroke="${OL}" stroke-width="5"/><circle cx="-10" cy="-26" r="3" fill="#ffffff" opacity=".8"/><circle cx="8" cy="-16" r="3" fill="#ffffff" opacity=".8"/><circle cx="12" cy="-34" r="3" fill="#ffffff" opacity=".8"/></g>`

const blob = (x: number, y: number, s: number, color: string, delay: number): string =>
  `<g transform="translate(${x},${y}) scale(${s})"><g class="hp" style="animation-delay:-${delay}s"><path d="M-36,0 Q-40,-56 0,-58 Q40,-56 36,0Z" fill="${color}" stroke="${OL}" stroke-width="5"/><circle cx="-13" cy="-30" r="6" fill="${OL}"/><circle cx="13" cy="-30" r="6" fill="${OL}"/><circle cx="-11" cy="-32" r="2" fill="#ffffff"/><circle cx="15" cy="-32" r="2" fill="#ffffff"/><path d="M-9,-16 Q0,-8 9,-16" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/></g></g>`

const rainbow = ['#ff5d73', '#ffa34d', '#ffe14d', '#5fd68a', '#4aa8ff', '#a07bff']
  .map((c, i) => `<path d="M${800 - (560 - i * 28)},840 A${560 - i * 28},${560 - i * 28} 0 0 1 ${800 + (560 - i * 28)},840" fill="none" stroke="${c}" stroke-width="26" opacity=".8"/>`)
  .join('')

const cloud = (x: number, y: number, s: number, c: string, delay: number): string =>
  `<g transform="translate(${x},${y}) scale(${s})"><g class="cl" style="animation-delay:-${delay}s"><g fill="${c}" stroke="${OL}" stroke-width="5"><ellipse rx="110" ry="30"/><circle cx="-44" cy="-22" r="38"/><circle cx="10" cy="-40" r="46"/><circle cx="62" cy="-20" r="34"/></g><ellipse cy="8" rx="102" ry="22" fill="${c}"/></g></g>`

function sparkles(): string {
  const r = rng(7)

  return Array.from({ length: 24 }, () => {
    const s = 3 + r() * 4

    return `<g transform="translate(${n(r() * 1600)},${n(r() * 620)})"><polygon class="tw" points="0,${-s * 2} ${s * 0.5},${-s * 0.5} ${s * 2},0 ${s * 0.5},${s * 0.5} 0,${s * 2} ${-s * 0.5},${s * 0.5} ${-s * 2},0 ${-s * 0.5},${-s * 0.5}" fill="#fff6c0" style="animation-duration:${n(2 + r() * 3)}s;animation-delay:-${n(r() * 4)}s"/></g>`
  }).join('')
}

const CSS = `
.rb{animation:rb 6s ease-in-out infinite alternate}
@keyframes rb{from{opacity:.6}to{opacity:1}}
.k{transform-box:fill-box;transform-origin:50% 100%;animation:k 3.5s ease-in-out infinite alternate}
@keyframes k{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
.hp{transform-box:fill-box;transform-origin:50% 100%;animation:hp 1.6s ease-in-out infinite}
@keyframes hp{0%,100%{transform:translateY(0) scale(1.08,.9)}40%{transform:translateY(-60px) scale(.94,1.1)}75%{transform:translateY(0) scale(1.08,.9)}}
.cl{animation:cl 40s ease-in-out infinite alternate}
@keyframes cl{from{transform:translateX(-140px)}to{transform:translateX(140px)}}
.tw{opacity:.2;animation:tw 2.5s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1;transform:scale(.7)}to{opacity:1;transform:scale(1.1)}}
`

const BODY = `
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a55"/><stop offset=".55" stop-color="#6a3a9a"/><stop offset="1" stop-color="#ff9ac8"/></linearGradient></defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${sparkles()}
<g class="rb">${rainbow}</g>
${cloud(280, 200, 1, '#ffd1ea', 0)}${cloud(1300, 140, 1.2, '#cfe9ff', 20)}${cloud(860, 300, 0.8, '#ffd1ea', 10)}
${ridge(760, 40, 3, ['#ff9ac8', '#ff86bd', '#ffadd3'], 110)}
${lolly(180, 650, 1.1, '#ff5fa8', 0)}${lolly(1420, 640, 1.3, '#4aa8ff', 1.5)}${lolly(1160, 690, 0.8, '#ffb23f', 3)}
${ridge(850, 30, 7, ['#8fe3c0', '#7fd9b4', '#9aeccb'], 100)}
${gumdrop(420, 850, 1.3, '#ff5d73')}${gumdrop(980, 870, 1, '#a07bff')}${gumdrop(1330, 860, 1.4, '#ffe14d')}
${blob(700, 880, 1.1, '#9ad7ff', 0)}${blob(1130, 920, 0.9, '#ffe27a', 0.8)}
${ridge(935, 18, 11, ['#c9a7ff', '#bb97f5', '#d6b8ff'], 80)}
${gumdrop(240, 960, 1.2, '#5fd68a')}${gumdrop(900, 975, 0.9, '#ff9ac8')}
`

export const candyLand: Theme = {
  id: 'candy-land',
  label: 'Candy Land',
  blurb: 'Cartoon candy world: breathing rainbow, swaying lollipops, gumdrops, bouncing jelly critters',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#2a1a55': '#bfe9ff', '#6a3a9a': '#e4f2ff', '#ff9ac8': '#ffe4f4', '#3a1a55': '#7a4a8a', '#fff6c0': '#ffffff',
  }),
}
