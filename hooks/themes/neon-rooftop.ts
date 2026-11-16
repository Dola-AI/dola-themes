import { palette } from './palette.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A rain-slick cyberpunk rooftop under a striped neon sun, the megacity glowing behind.
const { theme, problems } = palette(
  'Neon Rooftop',
  { accent: '#ff2e97', danger: '#ff4d5e', success: '#2ee6a6', warning: '#ffd23f', pro: '#b36bff' },
  ['#0a0612', '#130a20', '#1a0f2c', '#221538', '#f4ecff', '#d3c4ea', '#a595c6'],
  ['#efe6f6', '#f6eff9', '#fcf8fe', '#fcf8fe', '#24103c', '#4d3470', '#6b5290'],
)

function city(seed: number, base: number, lo: number, hi: number, fill: string, lit: boolean): string {
  const r = rng(seed)
  const out: string[] = []
  let x = -30
  while (x < 1630) {
    const w = 70 + r() * 120
    const h = lo + r() * (hi - lo)
    out.push(`<rect x="${n(x)}" y="${n(base - h)}" width="${n(w)}" height="${n(h + 300)}" fill="${fill}"/>`)
    if (lit) {
      out.push(`<rect x="${n(x)}" y="${n(base - h)}" width="${n(w)}" height="3" fill="${r() > 0.5 ? '#00e5ff' : '#ff2e97'}" opacity=".8"/>`)
      for (let k = 0; k < Math.floor((w * h) / 3600); k++) {
        out.push(`<rect class="wd" x="${n(x + 6 + r() * (w - 16))}" y="${n(base - h + 12 + r() * (h - 24))}" width="5" height="7" fill="#ffd23f" style="animation-delay:-${n(r() * 6)}s;animation-duration:${n(2 + r() * 4)}s"/>`)
      }
    }
    x += w + r() * 6
  }

  return out.join('')
}

function rain(): string {
  const r = rng(61)
  const out: string[] = []
  for (let i = 0; i < 120; i++) {
    const d = 0.7 + r() * 0.7
    out.push(`<g transform="translate(${n(r() * 1700)},-60)"><line class="dr" x1="0" y1="0" x2="-8" y2="34" stroke="#9fb8ff" stroke-width="1.4" style="animation-duration:${n(d)}s;animation-delay:-${n(r() * d)}s"/></g>`)
  }

  return out.join('')
}

const STRIPES = [[330, 6], [372, 9], [410, 12], [446, 15], [480, 18], [512, 22]]
  .map(([y, h], i) => `<rect class="st" x="780" y="${y}" width="620" height="${h}" fill="#000000" style="animation-delay:-${i * 0.4}s"/>`)
  .join('')

const CSS = `
.wd{opacity:.2;animation:wd 4s ease-in-out infinite alternate}
@keyframes wd{from{opacity:.1}to{opacity:.95}}
.dr{opacity:.5;animation:dr 1s linear infinite}
@keyframes dr{from{transform:translate(0,0)}to{transform:translate(-80px,1100px)}}
.st{animation:sl 3s ease-in-out infinite alternate}
@keyframes sl{from{transform:translateY(0)}to{transform:translateY(10px)}}
.ring{transform-box:fill-box;transform-origin:center;animation:rg 24s linear infinite}
@keyframes rg{to{transform:rotate(360deg)}}
.nf{animation:nf 5s linear infinite}
@keyframes nf{0%,100%{opacity:1}90%{opacity:1}92%{opacity:.2}94%{opacity:1}96%{opacity:.35}98%{opacity:1}}
.cape{transform-box:fill-box;transform-origin:100% 20%;animation:cp 1.8s ease-in-out infinite alternate}
@keyframes cp{from{transform:skewY(-5deg) scaleX(1)}to{transform:skewY(6deg) scaleX(1.12)}}
.stm{opacity:0;animation:stm 5s ease-out infinite}
@keyframes stm{0%{transform:translateY(0) scale(.6);opacity:0}20%{opacity:.35}100%{transform:translateY(-160px) scale(1.8);opacity:0}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0612"/><stop offset=".55" stop-color="#2a0f45"/><stop offset="1" stop-color="#5a1a5c"/></linearGradient>
<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd23f"/><stop offset=".5" stop-color="#ff5a8a"/><stop offset="1" stop-color="#b3267a"/></linearGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff2e97" stop-opacity=".45"/><stop offset="1" stop-color="#ff2e97" stop-opacity="0"/></radialGradient>
<mask id="cut"><rect width="1600" height="1000" fill="#ffffff"/>${STRIPES}</mask>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle cx="1090" cy="430" r="400" fill="url(#halo)"/>
<circle cx="1090" cy="430" r="215" fill="url(#sun)" mask="url(#cut)"/>
<g transform="translate(1090,430)"><g class="ring"><circle r="290" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-dasharray="14 22" opacity=".7"/></g></g>
${city(5, 800, 160, 420, '#1a0f33', false)}
${city(9, 860, 120, 340, '#0f0820', true)}
<g class="nf"><rect x="190" y="360" width="64" height="210" rx="6" fill="none" stroke="#00e5ff" stroke-width="3"/><line x1="206" y1="410" x2="238" y2="410" stroke="#00e5ff" stroke-width="3"/><line x1="206" y1="460" x2="238" y2="460" stroke="#00e5ff" stroke-width="3"/></g>
<polygon points="0,840 1600,810 1600,1000 0,1000" fill="#07040f"/>
<rect x="120" y="790" width="130" height="60" fill="#0e0820"/><rect x="1300" y="770" width="170" height="70" fill="#0e0820"/>
<circle class="stm" cx="180" cy="780" r="26" fill="#9fb8ff" opacity=".3"/><circle class="stm" cx="1380" cy="760" r="30" fill="#9fb8ff" opacity=".3" style="animation-delay:-2s"/>
${rain()}
`

export const neonRooftop: Theme = {
  id: 'neon-rooftop',
  label: 'Neon Rooftop',
  blurb: 'Cyberpunk rooftop in the rain under a striped neon sun, the megacity glowing behind',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#0a0612': '#f1e8fb', '#2a0f45': '#e6d6f6', '#5a1a5c': '#d9bff0', '#1a0f33': '#b59fd6', '#0f0820': '#8f78b8', '#07040f': '#5a4580', '#0e0820': '#6f5a98',
    '#9fb8ff': '#5f78d0', '#04020a': '#1a0d33',
  }),
}
