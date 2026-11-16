import { palette } from './palette.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A blood-red moon over bamboo in the wind: silhouetted stalks bending with travelling gusts through drifting fog, red leaves falling.
const { theme, problems } = palette(
  'Blood Moon Bamboo',
  { accent: '#e63946', danger: '#ff4d5e', success: '#4fc48a', warning: '#f2b441', pro: '#a98bff' },
  ['#0d0405', '#150709', '#1d0a0d', '#260d11', '#f6ecea', '#d6c4c1', '#a99694'],
  ['#efe3cf', '#f5ecdb', '#fbf6ea', '#fbf6ea', '#1c0f0c', '#4a3028', '#6a4e44'],
)

function bamboo(): string {
  const r = rng(14)
  const out: string[] = []
  for (let i = 0; i < 16; i++) {
    const x = 20 + i * 108 + r() * 50
    const w = 12 + r() * 12
    const nodes = Array.from({ length: 8 }, (_, k) => `<rect x="${n(-w / 2 - 3)}" y="${-120 - k * 130}" width="${n(w + 6)}" height="7" fill="#050203"/>`).join('')
    out.push(`<g transform="translate(${n(x)},1000)"><g class="bm" style="--a:${n(2.4 + r() * 2.6)}deg;animation-delay:-${n(r() * 6)}s;animation-duration:${n(5 + r() * 4)}s"><rect x="${n(-w / 2)}" y="-1200" width="${n(w)}" height="1250" fill="#070304"/>${nodes}</g></g>`)
  }

  return out.join('')
}

const FOG = [[300, 760, 700], [1000, 820, 800], [640, 900, 900]]
  .map(([x, y, rx], i) => `<ellipse class="fg" cx="${x}" cy="${y}" rx="${rx}" ry="60" fill="#ffffff" opacity=".07" style="animation-delay:-${i * 9}s"/>`)
  .join('')

const CSS = `
.bm{transform-box:fill-box;transform-origin:50% 100%;animation:bm 6s ease-in-out infinite alternate}
@keyframes bm{0%{transform:rotate(calc(var(--a) * -.2))}30%{transform:rotate(calc(var(--a) * .75))}50%{transform:rotate(calc(var(--a) * .25))}78%{transform:rotate(var(--a))}100%{transform:rotate(calc(var(--a) * .1))}}
.fg{animation:fg 40s ease-in-out infinite alternate}
@keyframes fg{from{transform:translateX(-160px)}to{transform:translateX(160px)}}
.sun{animation:sn 7s ease-in-out infinite alternate}
@keyframes sn{from{opacity:.75}to{opacity:1}}
.lf{opacity:0;animation:lf 14s linear infinite}
@keyframes lf{0%{transform:translate(0,-40px) rotate(0);opacity:0}8%{opacity:.8}100%{transform:translate(-300px,1060px) rotate(540deg);opacity:0}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0305"/><stop offset=".6" stop-color="#3a0a0f"/><stop offset="1" stop-color="#1a0508"/></linearGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e63946" stop-opacity=".55"/><stop offset="1" stop-color="#e63946" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle class="sun" cx="760" cy="380" r="460" fill="url(#halo)"/>
<circle class="sun" cx="760" cy="380" r="210" fill="#c1121f"/>
<circle cx="760" cy="380" r="150" fill="none" stroke="#e63946" stroke-opacity=".45" stroke-width="3"/>
${bamboo()}
${FOG}
<polygon points="0,880 1600,860 1600,1000 0,1000" fill="#050203"/>
<path class="lf" d="M0,0 C6,-9 17,-7 20,0 C15,9 4,9 0,0Z" fill="#c1121f" transform="translate(1100,0)"/><path class="lf" d="M0,0 C6,-9 17,-7 20,0 C15,9 4,9 0,0Z" fill="#c1121f" transform="translate(500,0)" style="animation-delay:-6s"/><path class="lf" d="M0,0 C6,-9 17,-7 20,0 C15,9 4,9 0,0Z" fill="#c1121f" transform="translate(1400,0)" style="animation-delay:-10s"/>
`

export const bloodMoonBamboo: Theme = {
  id: 'blood-moon-bamboo',
  label: 'Blood Moon Bamboo',
  blurb: 'A blood-red moon over a bamboo forest in a gale: every stalk bending with the gusts',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#0b0305': '#f3e7d2', '#3a0a0f': '#ecd9bd', '#1a0508': '#e2cba8', '#050203': '#1a0d0a', '#070304': '#241410', '#ffffff': '#fffaf0',
  }),
}
