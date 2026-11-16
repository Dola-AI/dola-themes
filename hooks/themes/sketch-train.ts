import { palette } from './palette.js'
import type { Pt } from './shapes.js'
import { SKETCH_CSS, pencil, wob } from './sketch.js'
import { dualScene, n, rng, svg } from './util.js'
import type { Theme } from './util.js'

// A nostalgic steam-train journey, sketched. Night: white chalk on slate under a pencilled moon with lit carriage windows. Morning: graphite on paper with the sun rising behind the hills.
// The scenery draws itself and is rubbed out; the train itself runs: wheels turn, rods pump, smoke drifts back, sleepers and telegraph poles slide past.
const { theme, problems } = palette(
  'Sketch Train',
  { accent: '#4a8fe7', danger: '#e5534b', success: '#4caf78', warning: '#e0a43a', pro: '#8a7be0' },
  ['#1b2026', '#222930', '#2a323a', '#323b44', '#f1eee4', '#cfcabd', '#a19c90'],
  ['#f3ecdc', '#f8f2e4', '#fcf8ee', '#fcf8ee', '#2a2620', '#524b3f', '#756d5e'],
)

const CH = '#eeeae0' // chalk by night, graphite by day
const RAY = '#1b2027' // sun and birds: the same colour as the sky at night (so unseen), orange and ink by day
const BIRD = '#1b2028'
const GLOW = '#f2c14e'

const line = (d: string, w = 2.4, color = CH, op = 0.92): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`
const poly = (pts: Pt[], seed: number, w = 2.4, amt = 1.4): string => line(wob(pts, seed, amt), w)

function ring(cx: number, cy: number, r: number, seed: number, w = 2.2): string {
  const rr = rng(seed)
  const pts: Pt[] = Array.from({ length: 16 }, (_, i): Pt => {
    const a = (i / 15) * Math.PI * 2

    return [cx + Math.cos(a) * r * (1 + (rr() - 0.5) * 0.1), cy + Math.sin(a) * r * (1 + (rr() - 0.5) * 0.1)]
  })

  return line(wob(pts, seed, 1.2), w)
}

const wheel = (cx: number, cy: number, r: number, seed: number): string =>
  `<g transform="translate(${cx},${cy})"><g class="wh">${ring(0, 0, r, seed)}${ring(0, 0, r * 0.18, seed + 1, 2)}` +
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2

    return line(`M${n(Math.cos(a) * r * 0.2)},${n(Math.sin(a) * r * 0.2)} L${n(Math.cos(a) * r * 0.92)},${n(Math.sin(a) * r * 0.92)}`, 1.6, CH, 0.8)
  }).join('') +
  `</g></g>`

const windows = (x0: number, y0: number, count: number, w: number, h: number, gap: number, seed: number): string =>
  Array.from({ length: count }, (_, i) => {
    const x = x0 + i * (w + gap)

    return `<rect class="lt" x="${x}" y="${y0}" width="${w}" height="${h}" rx="4" fill="${GLOW}" opacity=".35" style="animation-delay:-${i * 0.7}s"/>` + poly([[x, y0], [x + w, y0], [x + w, y0 + h], [x, y0 + h], [x, y0]], seed + i, 2, 1)
  }).join('')

// the train, drawn with its rails at y=0 and the engine's nose at x=+300
const TRAIN =
  // locomotive: boiler, smokebox, chimney, domes, cab with a lit window, cowcatcher and lamp
  poly([[-120, -70], [-120, -170], [200, -170], [232, -150], [232, -90], [200, -70], [-120, -70]], 1, 2.8) +
  ring(232, -120, 28, 3) +
  poly([[150, -170], [158, -252], [186, -252], [194, -170]], 4) + poly([[142, -252], [202, -252], [198, -268], [146, -268], [142, -252]], 5) +
  line('M30,-170 Q62,-218 94,-170', 2.4) + line('M-34,-170 Q-14,-198 6,-170', 2.4) +
  poly([[-232, -70], [-232, -232], [-100, -232], [-100, -70]], 6, 2.8) + poly([[-248, -232], [-86, -232]], 7) +
  `<rect class="lt" x="-208" y="-206" width="72" height="54" rx="5" fill="${GLOW}" opacity=".4"/>` + poly([[-208, -206], [-136, -206], [-136, -152], [-208, -152], [-208, -206]], 8) +
  poly([[232, -34], [296, 0], [232, -8]], 9) + `<circle cx="226" cy="-186" r="9" fill="${GLOW}" opacity=".7"/>` + line('M-120,-120 L200,-120', 1.6, CH, 0.5) +
  // tender with a heap of coal
  poly([[-440, -70], [-440, -160], [-250, -160], [-250, -70]], 10, 2.6) + line('M-436,-160 l16,-22 l14,16 l18,-26 l16,22 l18,-20 l16,24 l16,-22 l20,24 l18,-16 l16,20 l14,-8', 2.2) +
  // carriages with rows of lit windows
  poly([[-860, -70], [-860, -190], [-470, -190], [-470, -70], [-860, -70]], 11, 2.6) + line('M-872,-190 Q-665,-222 -458,-190', 2.4) + windows(-836, -166, 5, 52, 56, 18, 20) +
  poly([[-1280, -70], [-1280, -190], [-890, -190], [-890, -70], [-1280, -70]], 12, 2.6) + line('M-1292,-190 Q-1085,-222 -878,-190', 2.4) + windows(-1256, -166, 5, 52, 56, 18, 30) +
  line('M-470,-92 L-440,-92 M-890,-92 L-860,-92', 3) +
  // wheels, and the rod that drives them
  wheel(-170, -44, 44, 40) + wheel(-60, -44, 44, 44) + wheel(60, -44, 44, 48) + wheel(160, -44, 26, 52) +
  wheel(-400, -30, 26, 56) + wheel(-310, -30, 26, 60) + wheel(-800, -30, 26, 64) + wheel(-520, -30, 26, 68) + wheel(-1220, -30, 26, 72) + wheel(-940, -30, 26, 76) +
  `<g class="rod">${line('M-170,-44 L60,-44', 5, CH, 0.9)}</g>`

function smoke(): string {
  return Array.from({ length: 6 }, (_, i) => `<g transform="translate(1394,532)"><g class="sm" style="animation-delay:-${i * 1.4}s">${ring(0, 0, 30 + (i % 3) * 8, 90 + i, 2.6)}</g></g>`).join('')
}

function poles(): string {
  const out: string[] = []
  for (let k = 0; k < 7; k++) {
    const x = k * 360
    out.push(line(`M${x},800 L${x},520`, 4), line(`M${x - 44},548 L${x + 44},548 M${x - 30},574 L${x + 30},574`, 3), `<circle cx="${x - 40}" cy="546" r="4" fill="${CH}"/><circle cx="${x + 40}" cy="546" r="4" fill="${CH}"/>`)
    for (const dy of [548, 574]) {
      out.push(line(`M${x + 40},${dy - 2} Q${x + 180},${dy + 54} ${x + 320},${dy - 2}`, 1.6, CH, 0.7))
    }
  }

  return `<g class="po">${out.join('')}</g>`
}

function sleepers(): string {
  return `<g class="sl">${Array.from({ length: 34 }, (_, i) => line(`M${i * 60},796 L${i * 60 - 14},826`, 3, CH, 0.65)).join('')}</g>`
}

function stars(): string {
  const r = rng(9)

  return Array.from({ length: 30 }, (_, i) => {
    const x = r() * 1560
    const y = 30 + r() * 300

    return pencil(`M${n(x - 6)},${n(y)} l12,0 M${n(x)},${n(y - 6)} l0,12`, 0.2 + i * 0.06, 1.6, undefined, 0.7)
  }).join('')
}

const rays = Array.from({ length: 11 }, (_, i) => {
  const a = Math.PI + (i / 10) * Math.PI

  return line(`M${n(420 + Math.cos(a) * 150)},${n(640 + Math.sin(a) * 150)} L${n(420 + Math.cos(a) * 210)},${n(640 + Math.sin(a) * 210)}`, 3.4, RAY, 0.9)
}).join('')

const BIRDS = [0, 1, 2].map(i => `<g transform="translate(${360 + i * 70},${250 + (i % 2) * 36})"><g class="bd" style="animation-delay:-${i * 0.8}s">${line('M-12,2 Q-6,-8 0,0 Q6,-8 12,2', 2.6, BIRD, 0.9)}</g></g>`).join('')

const CSS = `
${SKETCH_CSS}
.wh{transform-box:fill-box;transform-origin:center;animation:wh .9s linear infinite}
@keyframes wh{to{transform:rotate(360deg)}}
.rod{animation:rod .9s ease-in-out infinite alternate}
@keyframes rod{from{transform:translateY(-8px)}to{transform:translateY(8px)}}
.tr{animation:tr .22s ease-in-out infinite alternate}
@keyframes tr{from{transform:translateY(0)}to{transform:translateY(-2px)}}
.sl{animation:sl .7s linear infinite}
@keyframes sl{to{transform:translateX(-60px)}}
.po{animation:po 4.2s linear infinite}
@keyframes po{to{transform:translateX(-360px)}}
.sm{opacity:0;transform-box:fill-box;transform-origin:center;animation:sm 8s ease-out infinite}
@keyframes sm{0%{transform:translate(0,0) scale(.4);opacity:0}12%{opacity:.8}100%{transform:translate(-420px,-250px) scale(3);opacity:0}}
.bd{animation:bd 7s ease-in-out infinite alternate}
@keyframes bd{from{transform:translate(0,0)}to{transform:translate(120px,-30px)}}
`

const BODY = `
<rect width="1600" height="1000" fill="#1b2026"/>
${stars()}
${pencil('M1226,200 C1226,130 1290,100 1352,120 C1300,130 1280,176 1300,226 C1266,250 1226,236 1226,200Z', 0.2, 3)}
${ring(1290, 170, 7, 3)}
<circle cx="420" cy="640" r="86" fill="none" stroke="${RAY}" stroke-width="4"/>${rays}
${BIRDS}
${pencil(wob([[0, 640], [180, 600], [380, 622], [600, 570], [820, 610], [1040, 560], [1280, 604], [1600, 580]], 31, 3), 0.4, 2.6)}
${pencil(wob([[0, 720], [260, 690], [520, 716], [820, 676], [1100, 712], [1380, 690], [1600, 706]], 32, 3), 0.9, 2.4, undefined, 0.8)}
${Array.from({ length: 9 }, (_, i) => pencil(wob([[120 + i * 170, 700], [120 + i * 170, 668], [100 + i * 170, 668], [120 + i * 170, 620], [140 + i * 170, 668], [120 + i * 170, 668]], 40 + i, 1.4), 1.2 + i * 0.25, 2)).join('')}
${poles()}
${pencil(wob([[0, 800], [1600, 800]], 51, 2), 0, 3.4)}
${pencil(wob([[0, 814], [1600, 814]], 52, 2), 0.3, 3.4)}
${sleepers()}
<g transform="translate(1100,800)"><g class="tr">${TRAIN}</g></g>
${smoke()}
`

export const sketchTrain: Theme = {
  id: 'sketch-train',
  label: 'Sketch Train',
  blurb: 'A sketched steam-train journey: chalk and moonlight at night, graphite and sunrise in the morning',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), { '#1b2026': '#f3ecdc', '#eeeae0': '#3b3b3b', [RAY]: '#f2a93b', [BIRD]: '#3b3b3b', [GLOW]: '#f6d88a' }),
}
