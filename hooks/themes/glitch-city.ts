import { palette } from './palette.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// Cyberpunk terminal: falling code rain, a wireframe megacity, a spinning targeting ring and glitch tears.
const { theme, problems } = palette(
  'Glitch City',
  { accent: '#00e5ff', danger: '#ff2e63', success: '#00ffa3', warning: '#ffd23f', pro: '#b36bff' },
  ['#030b0e', '#08141a', '#0d1c24', '#13262f', '#e6fbff', '#b8d6de', '#8aa9b3'],
  ['#e4f3f2', '#edf8f7', '#f6fcfb', '#f6fcfb', '#0a2a30', '#2c5a62', '#4a7b84'],
)

function codeRain(): string {
  const r = rng(3)
  const out: string[] = []
  for (let c = 0; c < 38; c++) {
    const len = 6 + Math.floor(r() * 9)
    const glyphs = Array.from({ length: len }, (_, i) => `<rect x="${n(r() * 3)}" y="${i * 22}" width="${n(7 + r() * 8)}" height="${n(10 + r() * 6)}" fill="#00ffa3" opacity="${n(1 - i / len)}"/>`).join('')
    const dur = 3 + r() * 5
    out.push(`<g transform="translate(${c * 44 + 10},0)"><g class="cr" style="animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s">${glyphs}</g></g>`)
  }

  return out.join('')
}

function wire(): string {
  const r = rng(8)
  const out: string[] = []
  let x = 20
  while (x < 1600) {
    const w = 80 + r() * 110
    const h = 140 + r() * 380
    out.push(`<rect x="${n(x)}" y="${n(820 - h)}" width="${n(w)}" height="${n(h)}" fill="#030b0e" fill-opacity=".85" stroke="#00e5ff" stroke-width="2" stroke-opacity=".7"/>`)
    for (let k = 1; k < Math.floor(h / 46); k++) {
      out.push(`<line x1="${n(x)}" x2="${n(x + w)}" y1="${n(820 - h + k * 46)}" y2="${n(820 - h + k * 46)}" stroke="#00e5ff" stroke-opacity=".18"/>`)
    }
    x += w + 14
  }

  return out.join('')
}

const ticks = Array.from({ length: 36 }, (_, i) => `<line x1="0" y1="-206" x2="0" y2="${i % 3 ? -196 : -190}" stroke="#00e5ff" stroke-width="2" transform="rotate(${i * 10})"/>`).join('')

const GLITCH = Array.from({ length: 9 }, (_, i) => {
  const r = rng(40 + i)

  return `<rect class="gl" x="${n(r() * 1200)}" y="${n(60 + r() * 800)}" width="${n(180 + r() * 380)}" height="${n(6 + r() * 14)}" fill="${i % 2 ? '#ff2e63' : '#00e5ff'}" style="animation-delay:-${n(r() * 7)}s;animation-duration:${n(4 + r() * 4)}s"/>`
}).join('')

const CSS = `
.cr{animation:cr 5s linear infinite}
@keyframes cr{from{transform:translateY(-400px)}to{transform:translateY(1100px)}}
.r1{transform-box:fill-box;transform-origin:center;animation:rg 18s linear infinite}
.r2{transform-box:fill-box;transform-origin:center;animation:rg 12s linear infinite reverse}
@keyframes rg{to{transform:rotate(360deg)}}
.gl{opacity:0;animation:gl 6s steps(1) infinite}
@keyframes gl{0%,86%{opacity:0;transform:translateX(0)}87%{opacity:.8;transform:translateX(50px)}89%{opacity:.6;transform:translateX(-70px)}91%{opacity:.8;transform:translateX(20px)}93%,100%{opacity:0}}
.sc{animation:sc 6s linear infinite}
@keyframes sc{from{transform:translateY(0)}to{transform:translateY(60px)}}
`

const BODY = `
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020809"/><stop offset="1" stop-color="#05161c"/></linearGradient>
<pattern id="scan" width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="2" fill="#000000"/></pattern>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<g opacity=".55">${codeRain()}</g>
${wire()}
<g transform="translate(1180,360)"><g class="r1"><circle r="200" fill="none" stroke="#00e5ff" stroke-width="3" stroke-dasharray="90 30" opacity=".8"/>${ticks}</g><g class="r2"><circle r="150" fill="none" stroke="#ff2e63" stroke-width="2.5" stroke-dasharray="30 18" opacity=".8"/></g><circle r="10" fill="#00ffa3"/><line x1="-230" x2="230" y1="0" y2="0" stroke="#00e5ff" stroke-opacity=".35"/><line y1="-230" y2="230" x1="0" x2="0" stroke="#00e5ff" stroke-opacity=".35"/></g>
${GLITCH}
<rect class="sc" width="1600" height="1060" y="-60" fill="url(#scan)" opacity=".12"/>
`

export const glitchCity: Theme = {
  id: 'glitch-city',
  label: 'Glitch City',
  blurb: 'Cyberpunk terminal: code rain, wireframe skyline, targeting ring, glitch tears',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#020809': '#eaf6f5', '#05161c': '#d6ecea', '#030b0e': '#f6fcfb', '#00ffa3': '#0a8f6a', '#00e5ff': '#0a7fa0', '#000000': '#7aa5a8',
  }),
}
