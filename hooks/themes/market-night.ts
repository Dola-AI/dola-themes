import { makeColors } from '../make-colors.js'

import { dualScene, svg } from './util.js'
import type { Theme } from './util.js'

// Night trading desk: ink-teal surfaces, market green accent, a candlestick chart drawing itself. Dark and light.
const { theme, problems } = makeColors({
  label: 'Market Night',
  roles: { accent: '#2fbf8a', danger: '#e5484d', success: '#30a46c', warning: '#e8a33d', pro: '#8b7cf6' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e4f0ed',
        'surface-1': '#edf6f3',
        'surface-2': '#f5faf8',
        'surface-3': '#f5faf8',
        'text-primary': '#0d2326',
        'text-secondary': '#2e4a4d',
        'text-muted': '#4a6568',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a1315',
        'surface-1': '#0f1b1e',
        'surface-2': '#132327',
        'surface-3': '#172a2e',
        'text-primary': '#e8f1ef',
        'text-secondary': '#bccdc9',
        'text-muted': '#93a8a3',
      },
    },
  },
})

const CLOSES = [100, 104, 102, 108, 106, 112, 110, 116, 113, 119, 123, 120, 127, 131]
const LOOP = 16
const y = (p: number) => 400 - (p - 92) * 7.5
const x = (i: number) => 900 + i * 34

function chart(): string {
  let open = 98
  const parts: string[] = []
  const points: string[] = []
  CLOSES.forEach((close, i) => {
    const isUp = close >= open
    const top = y(Math.max(open, close))
    const bottom = y(Math.min(open, close))
    const color = isUp ? '#2fbf8a' : '#e5484d'
    const cx = x(i) + 8
    parts.push(
      `<g class="c" style="animation-delay:${(i * 0.32).toFixed(2)}s">` +
        `<line x1="${cx}" x2="${cx}" y1="${top - 14}" y2="${bottom + 12}" stroke="${color}" stroke-width="2"/>` +
        `<rect x="${x(i)}" y="${top}" width="16" height="${Math.max(3, bottom - top)}" rx="2" fill="${color}"/></g>`,
    )
    points.push(`${cx},${y(close)}`)
    open = close
  })
  const [lx, ly] = (points[points.length - 1] ?? '0,0').split(',')

  return (
    `<g class="chart"><g opacity=".6">${parts.join('')}</g>` +
    `<polyline class="line" points="${points.join(' ')}" fill="none" stroke="#7ff0c2" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<circle class="ring" cx="${lx}" cy="${ly}" r="7" fill="none" stroke="#7ff0c2" stroke-width="2"/>` +
    `<circle cx="${lx}" cy="${ly}" r="4.5" fill="#7ff0c2"/></g>`
  )
}

function motes(): string {
  const spots = [
    [140, 260, 0], [320, 140, 3], [520, 330, 6], [220, 520, 9], [430, 610, 2], [90, 700, 11],
    [1460, 620, 5], [1300, 760, 8], [1520, 480, 13], [700, 90, 4], [1180, 560, 10], [610, 720, 7],
  ]

  return spots
    .map(([cx, cy, d]) => `<circle class="m" cx="${cx}" cy="${cy}" r="2" fill="#2fbf8a" style="animation-delay:-${d}s"/>`)
    .join('')
}

const CSS = `
.c{opacity:0;transform-box:fill-box;transform-origin:50% 100%;animation:rise ${LOOP}s ease-out infinite}
@keyframes rise{0%{opacity:0;transform:scaleY(.15)}5%{opacity:1;transform:scaleY(1)}88%{opacity:1}100%{opacity:0}}
.line{stroke-dasharray:1400;stroke-dashoffset:1400;animation:draw ${LOOP}s linear infinite}
@keyframes draw{0%{stroke-dashoffset:1400;opacity:1}32%{stroke-dashoffset:0}88%{stroke-dashoffset:0;opacity:1}100%{opacity:0}}
.ring{transform-box:fill-box;transform-origin:center;animation:pulse 2s ease-out infinite}
@keyframes pulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(3.2);opacity:0}}
.m{opacity:0;animation:drift 14s linear infinite}
@keyframes drift{0%{opacity:0;transform:translateY(0)}20%{opacity:.5}80%{opacity:.35}100%{opacity:0;transform:translateY(-120px)}}
.glow{animation:breathe 9s ease-in-out infinite alternate}
@keyframes breathe{from{opacity:.55}to{opacity:1}}
@media (max-aspect-ratio:1/1){.chart{transform:translate(-158px,56px) scale(.85)}}
@media (prefers-reduced-motion:reduce){.c,.line{opacity:1;stroke-dashoffset:0}}
`

const BODY = `
<defs>
<radialGradient id="bg" cx="70%" cy="20%" r="90%"><stop offset="0" stop-color="#10262a"/><stop offset=".55" stop-color="#0b1719"/><stop offset="1" stop-color="#070e10"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2fbf8a" stop-opacity=".16"/><stop offset="1" stop-color="#2fbf8a" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#1d3439" stroke-width="1"/></pattern>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".7" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="gridmask"><rect width="1600" height="1000" fill="url(#fade)"/></mask>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<rect width="1600" height="1000" fill="url(#grid)" opacity=".45" mask="url(#gridmask)"/>
<ellipse class="glow" cx="1130" cy="240" rx="420" ry="260" fill="url(#halo)"/>
${motes()}
<g transform="translate(-1590,0) scale(1.9)">${chart()}</g>
`

export const marketNight: Theme = {
  id: 'market-night',
  label: 'Market Night',
  blurb: 'Dark teal trading desk with a candlestick chart that draws itself',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), { '#10262a': '#eaf5f1', '#0b1719': '#dcebe6', '#070e10': '#cfe3dc', '#1d3439': '#bcd6cd', '#7ff0c2': '#0f8f62', '#2fbf8a': '#1f9d6e' }),
}
