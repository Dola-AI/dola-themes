import { palette } from './palette.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A bamboo forest in a gale: every stalk bends with a travelling gust, leaf clusters whip about, leaves and streaks of wind stream across, moonlit and misty.
const { theme, problems } = palette(
  'Windy Bamboo',
  { accent: '#2fbf9a', danger: '#e5484d', success: '#3fae78', warning: '#e8a33d', pro: '#8a7be0' },
  ['#0a1311', '#0f1b18', '#142320', '#1a2c28', '#e8f3ef', '#bfd1ca', '#93aaa2'],
  ['#e4eee9', '#edf4f0', '#f6faf8', '#f6faf8', '#10201b', '#34504a', '#52706a'],
)

const LEAF = '#2a6a54'

function cluster(r: () => number, x: number, y: number, dir: 1 | -1): string {
  const out: string[] = []
  for (let k = 0; k < 4; k++) {
    const a = dir === 1 ? 8 + k * 24 : 172 - k * 24
    const len = 34 + r() * 24
    out.push(`<path d="M0,0 C${n(len * 0.2)},-7 ${n(len * 0.7)},-8 ${n(len)},0 C${n(len * 0.7)},8 ${n(len * 0.2)},6 0,0Z" transform="rotate(${n(a + (r() - 0.5) * 12)})" fill="${LEAF}"/>`)
  }

  return `<g transform="translate(${n(x)},${n(y)})"><g class="fl" style="animation-delay:-${n(r() * 2)}s">${out.join('')}</g></g>`
}

/** A row of stalks that bend together as gusts travel through them: each has its own phase from where it stands. */
function stalks(seed: number, count: number, wMin: number, wMax: number, fill: string, ring: string, opacity: number, amp: number, leafy: boolean): string {
  const r = rng(seed)
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const x = (i + r() * 0.8) * (1700 / count) - 40
    const w = wMin + r() * (wMax - wMin)
    const rings = Array.from({ length: 9 }, (_, k) => `<rect x="${n(-w / 2 - 2)}" y="${-110 - k * 128 - Math.round(r() * 20)}" width="${n(w + 4)}" height="${n(Math.max(3, w * 0.22))}" fill="${ring}"/>`).join('')
    const leaves = leafy
      ? Array.from({ length: w > 30 ? 5 : 4 }, (_, j) => cluster(r, (j % 2 ? w : -w) / 2, -(300 + j * 150 + r() * 50), j % 2 ? 1 : -1)).join('')
      : ''
    out.push(
      `<g transform="translate(${n(x)},1000)" opacity="${opacity}"><g class="bm" style="--a:${n(amp * (0.8 + r() * 0.4))}deg;animation-duration:${n(5 + r() * 3)}s;animation-delay:-${n((x / 1700) * 4 + r())}s"><rect x="${n(-w / 2)}" y="-1100" width="${n(w)}" height="1150" fill="${fill}"/>${rings}${leaves}</g></g>`,
    )
  }

  return out.join('')
}

function gusts(): string {
  const r = rng(4)

  return Array.from({ length: 16 }, () => {
    const dur = 2 + r() * 2.5

    return `<line class="gu" x1="0" x2="${n(160 + r() * 200)}" y1="${n(80 + r() * 800)}" y2="${n(80 + r() * 800)}" stroke="#e8f3ef" stroke-width="${n(1.5 + r() * 1.5)}" stroke-linecap="round" style="animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s"/>`
  }).join('')
}

function blownLeaves(): string {
  const r = rng(22)

  return Array.from({ length: 34 }, () => {
    const dur = 4 + r() * 5
    const s = 0.7 + r() * 1.1

    return `<g transform="translate(0,${n(r() * 900)}) scale(${n(s)})"><g class="wl" style="animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s"><path class="sp" d="M0,0 C6,-9 24,-6 34,0 C24,6 6,9 0,0Z" fill="${LEAF}" style="animation-duration:${n(1.5 + r() * 2)}s"/></g></g>`
  }).join('')
}

function fireflies(): string {
  const r = rng(12)

  return Array.from({ length: 16 }, () => `<circle class="ff" cx="${n(r() * 1600)}" cy="${n(380 + r() * 520)}" r="${n(2 + r() * 2)}" fill="#d8ff7a" style="animation-duration:${n(4 + r() * 5)}s;animation-delay:-${n(r() * 8)}s"/>`).join('')
}

const CSS = `
.bm{transform-box:fill-box;transform-origin:50% 100%;animation:bm 6s ease-in-out infinite alternate}
@keyframes bm{0%{transform:rotate(calc(var(--a) * -.2))}30%{transform:rotate(calc(var(--a) * .75))}50%{transform:rotate(calc(var(--a) * .25))}78%{transform:rotate(var(--a))}100%{transform:rotate(calc(var(--a) * .1))}}
.fl{transform-box:fill-box;transform-origin:0 50%;animation:fl .9s ease-in-out infinite alternate}
@keyframes fl{from{transform:rotate(-9deg) scale(.96)}to{transform:rotate(11deg) scale(1.05)}}
.gu{opacity:0;animation:gu 3s linear infinite}
@keyframes gu{0%{transform:translateX(-400px);opacity:0}15%{opacity:.18}85%{opacity:.18}100%{transform:translateX(1900px);opacity:0}}
.wl{animation:wl 6s linear infinite}
@keyframes wl{from{transform:translate(-200px,0) rotate(0)}to{transform:translate(1900px,140px) rotate(180deg)}}
.sp{transform-box:fill-box;transform-origin:center;animation:spin 2s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.fg{animation:fg 14s ease-in-out infinite alternate}
@keyframes fg{from{transform:translateX(-220px)}to{transform:translateX(220px)}}
.ff{opacity:0;animation:ff 6s ease-in-out infinite alternate}
@keyframes ff{0%{opacity:0;transform:translate(0,0)}50%{opacity:1}100%{opacity:.1;transform:translate(60px,-30px)}}
.moon{animation:moon 9s ease-in-out infinite alternate}
@keyframes moon{from{opacity:.75}to{opacity:1}}
.ray{transform-box:fill-box;transform-origin:50% 0;animation:ray 16s ease-in-out infinite alternate}
@keyframes ray{from{transform:rotate(-2deg);opacity:.5}to{transform:rotate(2deg);opacity:1}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050b0a"/><stop offset=".6" stop-color="#0d1f1b"/><stop offset="1" stop-color="#17332c"/></linearGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e8f1ee" stop-opacity=".5"/><stop offset="1" stop-color="#e8f1ee" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f1ee" stop-opacity=".22"/><stop offset="1" stop-color="#e8f1ee" stop-opacity="0"/></linearGradient>
<radialGradient id="mist" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#cfe6dc" stop-opacity=".5"/><stop offset="1" stop-color="#cfe6dc" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle class="moon" cx="1170" cy="240" r="320" fill="url(#halo)"/><circle cx="1170" cy="240" r="84" fill="#e8f1ee"/>
<polygon class="ray" points="1090,0 1250,0 1000,1000 560,1000" fill="url(#beam)"/><polygon class="ray" points="1180,0 1300,0 1500,1000 1100,1000" fill="url(#beam)" style="animation-delay:-7s"/>
${stalks(3, 26, 7, 12, '#1d3a33', '#2c5247', 0.55, 1.6, false)}
<ellipse class="fg" cx="800" cy="760" rx="900" ry="90" fill="url(#mist)"/>
${stalks(8, 15, 15, 22, '#0c1f1b', '#173630', 0.95, 3.6, true)}
<polygon points="0,872 1600,860 1600,1000 0,1000" fill="#050a09"/>
${stalks(21, 6, 40, 58, '#040908', '#0b1715', 0.97, 5, true)}
<ellipse class="fg" cx="500" cy="930" rx="900" ry="70" fill="url(#mist)" style="animation-delay:-8s"/>
${gusts()}
${fireflies()}
${blownLeaves()}
`

export const windyBamboo: Theme = {
  id: 'windy-bamboo',
  label: 'Windy Bamboo',
  blurb: 'A moonlit bamboo forest in a gale: stalks bending with each gust, leaves whipping past',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#050b0a': '#cfe0d8', '#0d1f1b': '#dcebe3', '#17332c': '#eaf4ee', '#e8f1ee': '#fffbe6', '#1d3a33': '#9fc2b4', '#2c5247': '#b6d2c6',
    '#0c1f1b': '#4a7a68', '#173630': '#5b8c78', '#050a09': '#27483c', '#040908': '#1c382e', '#0b1715': '#2a4c40', '#cfe6dc': '#ffffff',
    '#2a6a54': '#5a9a7e', '#d8ff7a': '#f2b432', '#e8f3ef': '#ffffff',
  }),
}
