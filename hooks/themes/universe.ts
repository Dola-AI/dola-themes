import { along, wander } from './motion.js'
import { palette } from './palette.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// The universe: a slowly turning spiral galaxy, drifting nebulae, a ringed planet and comets.
const { theme, problems } = palette(
  'Universe',
  { accent: '#9d8cff', danger: '#ff6b8a', success: '#4fd69c', warning: '#ffc857', pro: '#c79bff' },
  ['#07061a', '#0d0b26', '#141134', '#1b1740', '#f1eeff', '#cdc7ee', '#9d97c8'],
  ['#ece9fb', '#f4f2fd', '#faf9fe', '#faf9fe', '#1a1440', '#40377a', '#5f579a'],
)

function arms(): string {
  const r = rng(12)
  const out: string[] = []
  for (let arm = 0; arm < 3; arm++) {
    for (let i = 0; i < 90; i++) {
      const t = i / 90
      const rad = 24 + 300 * t + (r() - 0.5) * 36
      const a = (arm * Math.PI * 2) / 3 + t * Math.PI * 3.1 + (r() - 0.5) * 0.25
      const c = t < 0.25 ? '#fff2c4' : t < 0.6 ? '#ffb36b' : '#9ab4ff'
      out.push(`<circle cx="${n(Math.cos(a) * rad)}" cy="${n(Math.sin(a) * rad)}" r="${n(3.2 - t * 2 + r() * 1.2)}" fill="${c}" opacity="${n(0.9 - t * 0.5)}"/>`)
    }
  }

  return out.join('')
}

function field(): string {
  const r = rng(4)
  const out: string[] = []
  for (let i = 0; i < 120; i++) {
    out.push(
      `<circle class="s" cx="${n(r() * 1600)}" cy="${n(r() * 1000)}" r="${n(0.5 + r() * 1.4)}" fill="#ffffff" style="animation-duration:${n(2 + r() * 4)}s;animation-delay:-${n(r() * 6)}s"/>`,
    )
  }
  for (let i = 0; i < 7; i++) {
    out.push(`<ellipse cx="${n(r() * 1600)}" cy="${n(r() * 700)}" rx="${n(10 + r() * 16)}" ry="${n(4 + r() * 6)}" fill="#c9b8ff" opacity=".5" transform="rotate(${n(r() * 180)} 0 0)"/>`)
  }

  return out.join('')
}

function comet(seed: number, dur: number, lead: number): string {
  const path = wander(seed, seed % 2 ? 1 : -1, 80, 600, 5)

  return (
    `<g>${along(path, dur, lead, false)}` +
    `<line x1="0" y1="0" x2="${seed % 2 ? -90 : 90}" y2="-12" stroke="#bfe3ff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>` +
    `<circle r="4.5" fill="#ffffff"/></g>`
  )
}

const CSS = `
.s{opacity:.25;animation:tw 4s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.1}to{opacity:1}}
.gal{animation:rot 70s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}
.nb{animation:nb 18s ease-in-out infinite alternate}
@keyframes nb{from{transform:translate(-40px,10px) scale(1)}to{transform:translate(50px,-20px) scale(1.12)}}
.core{animation:core 6s ease-in-out infinite alternate}
@keyframes core{from{opacity:.65}to{opacity:1}}
.pl{animation:pl 24s ease-in-out infinite alternate}
@keyframes pl{from{transform:translateY(-12px)}to{transform:translateY(12px)}}
`

const BODY = `
<defs>
<radialGradient id="bg" cx="62%" cy="42%" r="85%"><stop offset="0" stop-color="#1a1240"/><stop offset=".5" stop-color="#0a0820"/><stop offset="1" stop-color="#04030d"/></radialGradient>
<radialGradient id="n1" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7a4fd8" stop-opacity=".45"/><stop offset="1" stop-color="#7a4fd8" stop-opacity="0"/></radialGradient>
<radialGradient id="n2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2aa7b8" stop-opacity=".32"/><stop offset="1" stop-color="#2aa7b8" stop-opacity="0"/></radialGradient>
<radialGradient id="cr" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff2c4" stop-opacity="1"/><stop offset="1" stop-color="#ffb36b" stop-opacity="0"/></radialGradient>
<radialGradient id="pg" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffcf8a"/><stop offset="1" stop-color="#9a4a2a"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
${field()}
<ellipse class="nb" cx="420" cy="260" rx="440" ry="240" fill="url(#n1)"/>
<ellipse class="nb" cx="1300" cy="760" rx="420" ry="220" fill="url(#n2)" style="animation-delay:-9s"/>
<g transform="translate(1030,420) rotate(-22) scale(1,.5)"><g class="gal">${arms()}</g></g>
<ellipse class="core" cx="1030" cy="420" rx="120" ry="70" fill="url(#cr)" transform="rotate(-22 1030 420)"/>
<g class="pl"><g transform="translate(230,800) rotate(-18)"><ellipse rx="190" ry="40" fill="none" stroke="#e8c98a" stroke-opacity=".6" stroke-width="14"/><circle r="104" fill="url(#pg)"/><ellipse rx="190" ry="40" fill="none" stroke="#e8c98a" stroke-opacity=".75" stroke-width="14" stroke-dasharray="300 600" stroke-dashoffset="-80"/></g></g>
${comet(31, 16, 3)}${comet(32, 22, 11)}
`

export const universe: Theme = {
  id: 'universe',
  label: 'Universe',
  blurb: 'A turning spiral galaxy, drifting nebulae, a ringed planet and comets',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#1a1240': '#f6f2ff', '#0a0820': '#e8e2fb', '#04030d': '#d7cff4', '#ffffff': '#5a4fa8', '#c9b8ff': '#8a7ad0', '#bfe3ff': '#4a78c8',
    '#fff2c4': '#e0900f', '#9ab4ff': '#4a6ad8',
  }),
}
