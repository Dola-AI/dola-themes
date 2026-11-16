import { palette } from './palette.js'
import { ridge, tri } from './shapes.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A clear night on a ridge: the Milky Way, twinkling stars and meteors tearing across the sky.
const { theme, problems } = palette(
  'Meteor Shower',
  { accent: '#8ab4ff', danger: '#ff6b7a', success: '#4fd69c', warning: '#ffc857', pro: '#b69cff' },
  ['#070914', '#0d1022', '#13172d', '#1a1f38', '#eef2ff', '#c4cbe8', '#97a0c8'],
  ['#e8ebfa', '#f0f2fc', '#f8f9fe', '#f8f9fe', '#12163a', '#363c68', '#555c88'],
)

function stars(): string {
  const r = rng(5)
  const out: string[] = []
  for (let i = 0; i < 130; i++) {
    out.push(
      `<circle class="s" cx="${n(r() * 1600)}" cy="${n(r() * 800)}" r="${n(0.6 + r() * 1.6)}" fill="#ffffff" style="animation-duration:${n(2 + r() * 4)}s;animation-delay:-${n(r() * 6)}s"/>`,
    )
  }

  return out.join('')
}

function meteors(): string {
  const r = rng(17)
  const out: string[] = []
  for (let i = 0; i < 16; i++) {
    const dur = 4 + r() * 6
    const big = i % 5 === 0
    const len = big ? 260 : 90 + r() * 90
    const w = big ? 3.6 : 1.6 + r() * 1.2
    out.push(
      `<g transform="translate(${n(300 + r() * 1500)},${n(r() * 420)})"><g class="mt" style="animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s">` +
        `<line x1="0" y1="0" x2="${n(len)}" y2="${n(-len * 0.6)}" stroke="url(#tail)" stroke-width="${n(w)}" stroke-linecap="round"/>` +
        `<circle r="${n(w * 1.2)}" fill="${big ? '#ffe2b0' : '#ffffff'}"/></g></g>`,
    )
  }

  return out.join('')
}

const CSS = `
.s{opacity:.25;animation:tw 4s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1}to{opacity:1}}
.mt{opacity:0;animation:shoot 8s linear infinite}
@keyframes shoot{0%{transform:translate(0,0);opacity:0}2%{opacity:1}12%{transform:translate(-780px,468px);opacity:0}100%{transform:translate(-780px,468px);opacity:0}}
.fire{animation:fire .5s ease-in-out infinite alternate}
@keyframes fire{from{opacity:.55}to{opacity:1}}
.band{animation:bd 16s ease-in-out infinite alternate}
@keyframes bd{from{opacity:.65}to{opacity:1}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03040d"/><stop offset=".6" stop-color="#0b1030"/><stop offset="1" stop-color="#1a1840"/></linearGradient>
<linearGradient id="tail" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="milky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ab4ff" stop-opacity="0"/><stop offset=".5" stop-color="#b8c8ff" stop-opacity=".22"/><stop offset="1" stop-color="#8ab4ff" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<g transform="rotate(-28 800 400)"><rect class="band" x="-300" y="270" width="2200" height="280" fill="url(#milky)"/></g>
${stars()}
${meteors()}
${ridge(870, 55, 5, ['#080b1c', '#0a0e22', '#0c1228'], 90)}
${tri([[380, 960], [430, 892], [480, 960]], '#14183a')}
<ellipse class="fire" cx="560" cy="962" rx="26" ry="10" fill="#ff9a3a" opacity=".5"/>
<polygon class="fire" points="546,962 560,930 574,962" fill="#ffb347"/>
`

export const meteorShower: Theme = {
  id: 'meteor-shower',
  label: 'Meteor Shower',
  blurb: 'Clear night on a ridge: Milky Way, twinkling stars, meteors tearing across the sky',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#03040d': '#cdd5f5', '#0b1030': '#dfe3fa', '#1a1840': '#f1ecfb', '#8ab4ff': '#8aa4ee', '#b8c8ff': '#a4b8f4',
    '#ffffff': '#4a5aa8', '#ffe2b0': '#d9822a', '#080b1c': '#8f9ad0', '#0a0e22': '#7f8ac4', '#0c1228': '#6f7abb', '#14183a': '#5a64a8',
  }),
}
