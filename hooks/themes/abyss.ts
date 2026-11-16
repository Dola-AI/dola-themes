import { makeColors } from '../make-colors.js'

import { along, wander } from './motion.js'
import { ridge, tri } from './shapes.js'
import type { Pt } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Low-poly ocean habitat: faceted seabed, rocks, coral and kelp, schools of fish, a distant whale, jellyfish. Calm, slow motion.
const { theme, problems } = makeColors({
  label: 'Abyss',
  roles: { accent: '#38bdf8', danger: '#f0616d', success: '#34c58a', warning: '#e5a93c', pro: '#8f86f5' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#dcedf4',
        'surface-1': '#e8f3f8',
        'surface-2': '#f3f9fc',
        'surface-3': '#f3f9fc',
        'text-primary': '#0a2433',
        'text-secondary': '#25495c',
        'text-muted': '#43687b',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#06121c',
        'surface-1': '#0a1a27',
        'surface-2': '#0d2131',
        'surface-3': '#102838',
        'text-primary': '#e6f3fa',
        'text-secondary': '#b9d3e0',
        'text-muted': '#8fb0c1',
      },
    },
  },
})

/** Faceted water: a jittered triangle mesh of faint light and dark shards over the gradient. */
function mesh(): string {
  const r = rng(11)
  const cols = 14
  const rows = 9
  const w = 1600 / cols
  const h = 1000 / rows
  const g = Array.from({ length: rows + 1 }, (_, j) =>
    Array.from({ length: cols + 1 }, (_, i): Pt => [
      i * w + (i > 0 && i < cols ? (r() - 0.5) * w * 0.6 : 0),
      j * h + (j > 0 && j < rows ? (r() - 0.5) * h * 0.6 : 0),
    ]),
  )
  const out: string[] = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const [a, b, c, d] = [g[j]![i]!, g[j]![i + 1]!, g[j + 1]![i]!, g[j + 1]![i + 1]!]
      out.push(
        tri([a, b, c], r() > 0.5 ? '#ffffff' : '#000000', ` opacity="${n(r() * 0.07)}"`),
        tri([b, d, c], r() > 0.5 ? '#ffffff' : '#000000', ` opacity="${n(r() * 0.07)}"`),
      )
    }
  }

  return out.join('')
}

const ROCK = ['#2c5f78', '#23506a', '#1b4259']
const rock = (x: number, y: number, s: number): string =>
  `<g transform="translate(${x},${y}) scale(${s})">` +
  tri([[-40, 0], [-14, -40], [0, 0]], ROCK[0]!) +
  tri([[-14, -40], [18, -32], [0, 0]], ROCK[1]!) +
  tri([[18, -32], [44, 0], [0, 0]], ROCK[2]!) +
  `</g>`

const KELP = ['#2f8f6b', '#3aa67c', '#277a5a']
function kelp(x: number, height: number, delay: number): string {
  const steps = 8
  const step = height / steps
  const L = (k: number): Pt => [-7 * (1 - (k / steps) * 0.6) + (k % 2 ? 4 : -4), -k * step]
  const R = (k: number): Pt => [7 * (1 - (k / steps) * 0.6) + (k % 2 ? 4 : -4), -k * step]
  const out: string[] = []
  for (let k = 0; k < steps; k++) {
    out.push(tri([L(k), R(k), L(k + 1)], KELP[k % 3]!), tri([R(k), R(k + 1), L(k + 1)], KELP[(k + 1) % 3]!))
  }

  return `<g transform="translate(${x},1010)"><g class="k" style="animation-delay:-${delay}s">${out.join('')}</g></g>`
}

const CORAL = ['#ff7f6b', '#ff9fb0', '#e8627f']
function coral(x: number, y: number, s: number, seed: number): string {
  const r = rng(seed)
  const out: string[] = []
  for (let k = 0; k < 6; k++) {
    const cx = (k - 2.5) * 13
    out.push(tri([[cx - 9, 0], [cx + (k - 2.5) * 4, -(34 + r() * 46)], [cx + 9, 0]], CORAL[k % 3]!))
  }

  return `<g transform="translate(${x},${y}) scale(${s})"><g class="k" style="animation-duration:10s">${out.join('')}</g></g>`
}

const SMALL = ['#a6e8ff', '#6fc7e8', '#8fdcf5', '#58b2d4', '#4aa3c6']
const BIG = ['#4aa8d8', '#2f87b8', '#3c98c8', '#25759f', '#1f6a92']
const GOLD = ['#ffb454', '#f08a3c', '#ffa14a', '#e07a30', '#d46d28']

/** A reef fish facing right: two-tone body, forked tail that wags, dorsal / pelvic / pectoral fins, gill line, eye with a highlight. */
const fish = (c: string[]): string =>
  `<g class="bb"><path class="tl" d="M-13,0 L-36,-14 Q-28,0 -36,14Z" fill="${c[4]}"/>` +
  `<path d="M14,-11 Q6,-28 -9,-8Z" fill="${c[2]}"/><path d="M6,11 Q0,22 -7,9Z" fill="${c[2]}"/>` +
  `<path d="M42,0 C37,-9 23,-14 8,-12 C-2,-10 -10,-5 -15,-3 L-15,0Z" fill="${c[0]}"/>` +
  `<path d="M42,0 C37,9 23,14 8,12 C-2,10 -10,5 -15,3 L-15,0Z" fill="${c[1]}"/>` +
  `<path d="M16,-12 Q21,0 16,12" fill="none" stroke="${c[3]}" stroke-width="3.5" opacity=".7"/>` +
  `<path d="M26,4 Q18,13 10,7Z" fill="${c[2]}"/><path d="M27,-8 Q30,0 27,8" fill="none" stroke="#04121a" stroke-opacity=".35" stroke-width="1.6"/>` +
  `<circle cx="34" cy="-3" r="3.2" fill="#ffffff"/><circle cx="35" cy="-3" r="1.7" fill="#04121a"/></g>`

/** A shark: torpedo body, tall dorsal fin, swept pectoral fin, crescent tail, gills and a toothy grin. */
const shark = (): string =>
  `<g class="bb"><path class="tl" d="M-108,0 L-152,-46 Q-134,-2 -150,42Z" fill="#5e8297"/>` +
  `<path d="M70,0 C60,-14 30,-24 -20,-20 C-60,-16 -90,-6 -110,0Z" fill="#7f9fb4"/>` +
  `<path d="M70,0 C60,12 30,22 -20,18 C-60,14 -90,6 -110,0Z" fill="#d6e4ee"/>` +
  `<path d="M-4,-21 L-34,-66 L-44,-18Z" fill="#6c8ca1"/><path d="M-60,16 L-76,38 L-48,16Z" fill="#6c8ca1"/>` +
  `<path d="M22,10 L-14,50 L-4,12Z" fill="#6c8ca1"/>` +
  `<path d="M30,-10 Q26,0 30,10 M24,-10 Q20,0 24,10 M18,-10 Q14,0 18,10" fill="none" stroke="#2f4d60" stroke-width="2" opacity=".6"/>` +
  `<path d="M70,2 Q52,8 34,4" fill="none" stroke="#2f4d60" stroke-width="2.5"/><path d="M62,3 l3,6 l3,-5 M52,5 l3,6 l3,-5" fill="#ffffff" stroke="#ffffff"/>` +
  `<circle cx="50" cy="-6" r="3.4" fill="#04121a"/><circle cx="51" cy="-7" r="1.2" fill="#ffffff"/></g>`

const SHARK = ['#8fb0c4', '#6f93a8', '#7fa2b6', '#5e8297', '#506f82']

/** A fish swimming a route. The flip keeps it upright when the route runs right to left. */
function crew(path: string, dur: number, lead: number, size: number, dir: 1 | -1, c: string[], off: Pt = [0, 0], extra = ''): string {
  return `<g>${along(path, dur, lead, true)}${extra}<g transform="translate(${n(off[0])},${n(off[1])}) scale(${n(size)},${n(size * dir)})">${c === SHARK ? shark() : fish(c)}</g></g>`
}

/** One predator chasing one school along a winding route; a straggler is caught mid-way and a new one swims in later. */
function hunt(seed: number, dir: 1 | -1, lo: number, hi: number, dur: number, preyCount: number, prey: string[], preySize: number, hunter: string[], hunterSize: number): string {
  const path = wander(seed, dir, lo, hi)
  const r = rng(seed * 7)
  const lag = 3.2
  const out: string[] = []
  for (let i = 0; i < preyCount; i++) {
    out.push(crew(path, dur, lag + 5 + i * 0.4 + r() * 0.4, preySize * (0.85 + r() * 0.3), dir, prey, [(r() - 0.5) * 36, (r() - 0.5) * 70]))
  }
  const eaten = `<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.5;0.52;0.97;1" dur="${n(dur)}s" begin="-${n(lag + 0.5)}s" repeatCount="indefinite"/>`
  out.push(crew(path, dur, lag + 0.5, preySize * 1.15, dir, prey, [0, 0], eaten))
  out.push(crew(path, dur, lag, hunterSize, dir, hunter))

  return out.join('')
}

/** A school with no hunter, cruising its own route. */
function drift(seed: number, dir: 1 | -1, lo: number, hi: number, dur: number, count: number, c: string[], size: number): string {
  const path = wander(seed, dir, lo, hi)
  const r = rng(seed * 5)

  return Array.from({ length: count }, (_, i) =>
    crew(path, dur, 4 + i * 0.45 + r() * 0.5, size * (0.8 + r() * 0.4), dir, c, [(r() - 0.5) * 44, (r() - 0.5) * 80]),
  ).join('')
}

const WHALE = ['#14597a', '#0f4a67', '#1a6890']
function whale(): string {
  const ring: Pt[] = [[140, 12], [80, -32], [10, -42], [-70, -22], [-120, -4], [-60, 26], [20, 38], [90, 34], [140, 12]]
  const body = ring.slice(0, -1).map((p, i) => tri([p, ring[i + 1]!, [10, 0]], WHALE[i % 3]!))
  const extras = [
    tri([[-120, -4], [-165, -38], [-140, -2]], WHALE[2]!),
    tri([[-120, -4], [-165, 34], [-138, 2]], WHALE[1]!),
    tri([[40, 30], [10, 62], [70, 34]], WHALE[1]!),
  ]

  return `<g opacity=".5">${along(wander(41, 1, 150, 420, 5), 140, 40, true)}<g transform="scale(1.5)"><g class="bb">${[...body, ...extras].join('')}</g></g></g>`
}

function fishes(): string {
  return [
    hunt(3, 1, 200, 700, 48, 12, SMALL, 0.5, SHARK, 1.15), // a shark runs down a school, left to right
    hunt(8, -1, 260, 820, 56, 9, GOLD, 0.45, BIG, 2.1), // a big blue fish chases gold fish, right to left
    drift(14, 1, 560, 900, 44, 8, SMALL, 0.5),
    drift(19, -1, 160, 480, 52, 7, BIG, 0.6),
    crew(wander(25, 1, 380, 760), 70, 20, 2.8, 1, BIG),
    crew(wander(26, -1, 300, 700), 82, 50, 1.7, -1, GOLD),
  ].join('')
}

function jelly(x: number, y: number, s: number, delay: number): string {
  const rim: Pt[] = [[-56, 0], [-44, -34], [-18, -54], [18, -54], [44, -34], [56, 0]]
  const dome = rim.slice(0, -1).map((p, i) => tri([p, rim[i + 1]!, [0, -18]], i % 2 ? '#c79bff' : '#d8b4ff', ' fill-opacity=".8"'))
  const tentacles = [-40, -20, 0, 20, 40]
    .map((dx, i) => {
      const a = i % 2 ? 8 : -8

      return `<path class="t" d="M${dx},4 l${a},34 l${-a},34 l${a},34" fill="none" stroke="#e0c2ff" stroke-opacity=".6" stroke-width="3" style="animation-delay:-${n(i * 0.7)}s"/>`
    })
    .join('')

  return `<g transform="translate(${x},${y}) scale(${s})"><g class="j" style="animation-delay:-${delay}s"><g class="dome">${dome.join('')}</g>${tentacles}</g></g>`
}

function bubbles(): string {
  const r = rng(99)
  const out: string[] = []
  for (let i = 0; i < 18; i++) {
    const s = 3 + r() * 6
    const hex = Array.from({ length: 6 }, (_, k) => `${n(Math.cos((k * Math.PI) / 3) * s)},${n(Math.sin((k * Math.PI) / 3) * s)}`).join(' ')
    const dur = 20 + r() * 12
    out.push(
      `<g transform="translate(${n(r() * 1600)},1040)"><g class="sw" style="animation-duration:${n(5 + r() * 4)}s;animation-delay:-${n(r() * 6)}s">` +
        `<polygon class="b" points="${hex}" fill="#8fd8ff" fill-opacity=".1" stroke="#9fe0ff" stroke-opacity=".7" style="animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s"/></g></g>`,
    )
  }

  return out.join('')
}

const CSS = `
.sr{animation:swr 40s linear infinite}.sl{animation:swl 40s linear infinite}
@keyframes swr{from{transform:translateX(-300px)}to{transform:translateX(1950px)}}
@keyframes swl{from{transform:translateX(1950px)}to{transform:translateX(-300px)}}
.bb{animation:fb 5s ease-in-out infinite alternate}
@keyframes fb{from{transform:translateY(-6px)}to{transform:translateY(6px)}}
.tl{transform-box:fill-box;transform-origin:100% 50%;animation:wag 1.1s ease-in-out infinite alternate}
@keyframes wag{from{transform:scaleX(1)}to{transform:scaleX(.6)}}
.b{animation:rise 22s linear infinite;opacity:0}
@keyframes rise{0%{transform:translateY(0);opacity:0}10%{opacity:.9}90%{opacity:.7}100%{transform:translateY(-1100px);opacity:0}}
.sw{animation:swx 6s ease-in-out infinite alternate}
@keyframes swx{from{transform:translateX(-16px)}to{transform:translateX(16px)}}
.beam{transform-box:fill-box;transform-origin:50% 0;animation:beam 20s ease-in-out infinite alternate}
.beam2{animation-duration:27s;animation-delay:-6s}
@keyframes beam{from{transform:rotate(-2.5deg);opacity:.5}to{transform:rotate(2.5deg);opacity:1}}
.j{animation:bob 14s ease-in-out infinite alternate}
@keyframes bob{from{transform:translateY(-22px)}to{transform:translateY(22px)}}
.dome{transform-box:fill-box;transform-origin:50% 0;animation:pump 4.5s ease-in-out infinite}
@keyframes pump{0%,100%{transform:scale(1,1)}50%{transform:scale(1.06,.9)}}
.t{transform-box:fill-box;transform-origin:50% 0;animation:wave 4.5s ease-in-out infinite}
@keyframes wave{0%,100%{transform:skewX(-4deg)}50%{transform:skewX(4deg)}}
.k{transform-box:fill-box;transform-origin:50% 100%;animation:kelp 8s ease-in-out infinite alternate}
@keyframes kelp{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}
`

const BODY = `
<defs>
<linearGradient id="deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b3350"/><stop offset=".45" stop-color="#07202f"/><stop offset="1" stop-color="#040b12"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfeaff" stop-opacity=".22"/><stop offset="1" stop-color="#bfeaff" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1600" height="1000" fill="url(#deep)"/>
${mesh()}
<polygon class="beam" points="520,0 640,0 980,1000 520,1000" fill="url(#ray)"/>
<polygon class="beam beam2" points="980,0 1060,0 1500,1000 1020,1000" fill="url(#ray)"/>
<polygon class="beam" points="140,0 200,0 360,1000 80,1000" fill="url(#ray)" style="animation-delay:-8s"/>
${whale()}
${ridge(860, 22, 3, ['#0c3a52', '#0a3149', '#0e4260'])}
${kelp(140, 260, 0)}${kelp(1460, 300, 3)}${kelp(700, 190, 5)}${kelp(1040, 230, 2)}
${fishes()}
${jelly(1330, 360, 1.1, 0)}${jelly(260, 250, 0.7, 4)}${jelly(1150, 760, 0.55, 7)}${jelly(760, 520, 0.8, 2)}${jelly(520, 140, 0.45, 5)}${jelly(960, 200, 0.6, 9)}
${bubbles()}
${ridge(925, 16, 8, ['#09293c', '#07202f', '#0b3045'])}
${rock(70, 960, 1.4)}${rock(560, 975, 1)}${rock(1330, 965, 1.6)}
${coral(430, 945, 1.1, 5)}${coral(1180, 950, 1.3, 9)}${coral(900, 975, 0.8, 2)}
${kelp(270, 200, 4)}${kelp(1390, 170, 1)}
`

export const abyss: Theme = {
  id: 'abyss',
  label: 'Abyss',
  blurb: 'Calm low-poly ocean habitat: kelp, coral, schools of fish, a whale, jellyfish',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#0b3350': '#c9ecf7', '#07202f': '#8fd3e8', '#040b12': '#4aa9c9', '#bfeaff': '#ffffff',
    '#8fd8ff': '#ffffff', '#9fe0ff': '#ffffff',
    '#0c3a52': '#4fa6c4', '#0a3149': '#3f93b2', '#0e4260': '#5ab2cf', '#09293c': '#2f86a6', '#0b3045': '#3a93b3',
    '#2c5f78': '#5aa0bd', '#23506a': '#4890ad', '#1b4259': '#3a7f9c',
    '#2f8f6b': '#1f8a62', '#3aa67c': '#2aa070', '#277a5a': '#1a7552',
    '#a6e8ff': '#2f9bc4', '#6fc7e8': '#1d7fa8', '#8fdcf5': '#2790b8', '#58b2d4': '#17719a', '#4aa3c6': '#146890',
    '#4aa8d8': '#1f6f9c', '#2f87b8': '#0f5a85', '#3c98c8': '#186690', '#25759f': '#0a4c74', '#1f6a92': '#084468',
    '#14597a': '#4aa0c0', '#0f4a67': '#3a90b0', '#1a6890': '#5cb0d0',
    '#8fb0c4': '#4d7f99', '#7f9fb4': '#3f7592', '#d6e4ee': '#9cc4d8', '#6c8ca1': '#356a86', '#2f4d60': '#1f3f52', '#6f93a8': '#3b6e8a', '#7fa2b6': '#456f87', '#5e8297': '#2f5f7a', '#506f82': '#27536c',
    '#d8b4ff': '#ff9bd2', '#c79bff': '#ff7fc0', '#e0c2ff': '#ff8fc8',
  }),
}
