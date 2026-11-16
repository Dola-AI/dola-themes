import { along, wander } from './motion.js'
import { palette } from './palette.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Cartoon pirate seas: a smiling moon (sun by day), a rocking pirate ship, rolling outlined waves and gulls.
const { theme, problems } = palette(
  'Toon Pirates',
  { accent: '#ffb347', danger: '#ff5a5f', success: '#4ccf8f', warning: '#ffd23f', pro: '#a98bff' },
  ['#0c1233', '#121a44', '#192254', '#212c66', '#f4f1ff', '#cfd2f0', '#9fa5d0'],
  ['#e2f2ff', '#ecf7ff', '#f6fbff', '#f6fbff', '#0e2240', '#2f4f78', '#4d6f9a'],
)

const OL = '#14183a'

const wave = (y: number, amp: number, fill: string, cls: string): string => {
  let d = `M0,${y}`
  for (let x = 0; x < 3200; x += 200) {
    d += ` q50,${-amp} 100,0 t100,0`
  }

  return `<path class="${cls}" d="${d} L3200,1000 L0,1000Z" fill="${fill}" stroke="${OL}" stroke-width="4"/>`
}

function gulls(): string {
  return [51, 52, 53, 54]
    .map(
      (s, i) =>
        `<g>${along(wander(s, i % 2 ? 1 : -1, 120, 420, 5), 26 + i * 6, i * 5, false)}<path d="M-16,2 Q-8,-12 0,0 Q8,-12 16,2" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"><animate attributeName="d" values="M-16,2 Q-8,-12 0,0 Q8,-12 16,2;M-16,-6 Q-8,-2 0,2 Q8,-2 16,-6;M-16,2 Q-8,-12 0,0 Q8,-12 16,2" dur=".8s" repeatCount="indefinite"/></path></g>`,
    )
    .join('')
}

function sparkles(): string {
  const r = rng(6)

  return Array.from({ length: 22 }, () => {
    const s = 3 + r() * 4

    return `<g transform="translate(${n(r() * 1600)},${n(r() * 420)})"><polygon class="tw" points="0,${-s * 2} ${s * 0.5},${-s * 0.5} ${s * 2},0 ${s * 0.5},${s * 0.5} 0,${s * 2} ${-s * 0.5},${s * 0.5} ${-s * 2},0 ${-s * 0.5},${-s * 0.5}" fill="#fff6c0" style="animation-duration:${n(2 + r() * 3)}s;animation-delay:-${n(r() * 4)}s"/></g>`
  }).join('')
}

const SHIP = `
<g transform="translate(820,700)"><g class="ship">
<rect x="-7" y="-310" width="14" height="320" fill="#6b4226" stroke="${OL}" stroke-width="5"/>
<path d="M-9,-296 Q-170,-220 -130,-70 L-9,-92Z" fill="#fff3d6" stroke="${OL}" stroke-width="5"/>
<path d="M9,-296 Q170,-220 130,-70 L9,-92Z" fill="#fff3d6" stroke="${OL}" stroke-width="5"/>
<circle cx="70" cy="-176" r="24" fill="#ffffff" stroke="${OL}" stroke-width="4"/><circle cx="62" cy="-180" r="5" fill="${OL}"/><circle cx="79" cy="-180" r="5" fill="${OL}"/><path d="M60,-166 L80,-166" stroke="${OL}" stroke-width="4"/>
<line x1="40" y1="-132" x2="100" y2="-112" stroke="${OL}" stroke-width="5"/><line x1="100" y1="-132" x2="40" y2="-112" stroke="${OL}" stroke-width="5"/>
<polygon class="fl" points="9,-308 84,-326 9,-344" fill="#ff5a5f" stroke="${OL}" stroke-width="5"/>
<path d="M-200,0 L200,0 Q180,84 124,96 L-124,96 Q-180,84 -200,0Z" fill="#8a5a3a" stroke="${OL}" stroke-width="6"/>
<path d="M-186,30 L186,30 M-170,60 L170,60" stroke="${OL}" stroke-width="4" opacity=".6"/>
<circle cx="-90" cy="46" r="11" fill="#ffd23f" stroke="${OL}" stroke-width="4"/><circle cx="0" cy="46" r="11" fill="#ffd23f" stroke="${OL}" stroke-width="4"/><circle cx="90" cy="46" r="11" fill="#ffd23f" stroke="${OL}" stroke-width="4"/>
<path d="M196,-4 L290,-52" stroke="#6b4226" stroke-width="10" stroke-linecap="round"/>
</g></g>`

const CSS = `
.w1{animation:w 11s linear infinite}
.w2{animation:w 7s linear infinite reverse}
.w3{animation:w 5s linear infinite}
@keyframes w{to{transform:translateX(-1600px)}}
.ship{transform-box:fill-box;transform-origin:50% 100%;animation:rk 3.6s ease-in-out infinite alternate}
@keyframes rk{from{transform:translateY(-10px) rotate(-4deg)}to{transform:translateY(10px) rotate(4deg)}}
.fl{transform-box:fill-box;transform-origin:0 50%;animation:fl .7s ease-in-out infinite alternate}
@keyframes fl{from{transform:scaleX(1) skewY(-4deg)}to{transform:scaleX(.8) skewY(5deg)}}
.tw{opacity:.2;animation:tw 3s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1;transform:scale(.7)}to{opacity:1;transform:scale(1.1)}}
.mn{animation:mn 8s ease-in-out infinite alternate}
@keyframes mn{from{transform:translateY(-8px)}to{transform:translateY(8px)}}
`

const BODY = `
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1b4d"/><stop offset=".6" stop-color="#2b3f8f"/><stop offset="1" stop-color="#5b6fc0"/></linearGradient></defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${sparkles()}
<g class="mn"><g transform="translate(270,210)"><circle r="96" fill="#fff6c8" stroke="${OL}" stroke-width="6"/><circle cx="-34" cy="-14" r="9" fill="${OL}"/><circle cx="34" cy="-14" r="9" fill="${OL}"/><path d="M-36,22 Q0,56 36,22" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><circle cx="-62" cy="26" r="12" fill="#ffb3a1" opacity=".7"/><circle cx="62" cy="26" r="12" fill="#ffb3a1" opacity=".7"/></g></g>
${wave(760, 26, '#1d4a9a', 'w1')}
${SHIP}
${wave(820, 22, '#2a5fb8', 'w2')}
${gulls()}
${wave(890, 18, '#3a78d4', 'w3')}
`

export const toonPirates: Theme = {
  id: 'toon-pirates',
  label: 'Toon Pirates',
  blurb: 'Cartoon seas: a smiling moon, a rocking pirate ship, rolling waves and gulls',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#0f1b4d': '#6ec6ff', '#2b3f8f': '#a7dcff', '#5b6fc0': '#d6f0ff', '#fff6c8': '#ffd84a', '#1d4a9a': '#2f8fe0', '#2a5fb8': '#3fa4ee', '#3a78d4': '#58bcf6',
    '#fff3d6': '#ffffff', '#14183a': '#1c3a66', '#fff6c0': '#ffffff',
  }),
}
