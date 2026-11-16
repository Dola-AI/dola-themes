import type { Pt } from './shapes.js'
import { wob } from './sketch.js'
import { n, rng } from './util.js'

/** Shared by Sakura Dusk: a great blossoming limb, soft canopy masses, twigs with blossom, and falling petals. */
export const INK = '#16161a'

export const PINKS = ['#e0545c', '#f08090', '#c93a4a', '#f4a0ac', '#d6485a']

// the great limb arching across the top from the trunk on the right
const LIMB: Pt[] = [[1700, 960], [1590, 660], [1500, 440], [1380, 260], [1170, 176], [900, 160], [640, 204], [380, 252], [90, 236]]

// A smooth tapering limb: the control points run through a Catmull-Rom spline, drawn as short round-capped strokes that thin toward the tip.
export function limb(): string {
  const out: string[] = []
  const N = 70
  const pts: Pt[] = Array.from({ length: N + 1 }, (_, k) => {
    const f = (k / N) * (LIMB.length - 1)
    const i = Math.min(LIMB.length - 2, Math.floor(f))
    const t = f - i
    const p0 = LIMB[Math.max(0, i - 1)]!
    const p1 = LIMB[i]!
    const p2 = LIMB[i + 1]!
    const p3 = LIMB[Math.min(LIMB.length - 1, i + 2)]!
    const cr = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t)

    return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]
  })
  for (let k = 0; k < N; k++) {
    const w = 62 * Math.pow(1 - k / N, 1.25) + 4
    out.push(`<line x1="${Math.round(pts[k]![0])}" y1="${Math.round(pts[k]![1])}" x2="${Math.round(pts[k + 1]![0])}" y2="${Math.round(pts[k + 1]![1])}" stroke="${INK}" stroke-width="${Math.round(w)}" stroke-linecap="round"/>`)
  }

  return out.join('')
}

// Soft translucent masses of blossom, so the canopy reads full before the single petals are added.
export function canopy(): string {
  const r = rng(31)
  const out: string[] = []
  for (let i = 1; i < LIMB.length; i++) {
    for (let k = 0; k < 7; k++) {
      out.push(`<circle cx="${Math.round(LIMB[i]![0] + (r() - 0.5) * 220)}" cy="${Math.round(LIMB[i]![1] + 10 + r() * 150)}" r="${Math.round(16 + r() * 30)}" fill="${PINKS[Math.floor(r() * PINKS.length)]}" opacity=".${Math.round(16 + r() * 14)}"/>`)
    }
  }

  return `<g class="bl">${out.join('')}</g>`
}

export function twigsAndBlossom(): string {
  const r = rng(8)
  const out: string[] = []
  const clusters: string[] = []
  const bloom = (x: number, y: number, count: number, spread: number) => {
    for (let k = 0; k < count; k++) {
      const a = r() * Math.PI * 2
      const d = Math.sqrt(r()) * spread
      clusters.push(`<circle cx="${Math.round(x + Math.cos(a) * d)}" cy="${Math.round(y + Math.sin(a) * d * 0.8)}" r="${Math.round(2.6 + r() * 4.6)}" fill="${PINKS[Math.floor(r() * PINKS.length)]}" opacity=".${Math.round(55 + r() * 40)}"/>`)
    }
  }
  for (let b = 0; b < 15; b++) {
    const [sx, sy] = LIMB[1 + Math.floor(r() * 7)]!
    const dir = r() > 0.35 ? -1 : 1
    const pts: Pt[] = [[sx, sy], [sx + dir * (50 + r() * 80), sy + 40 + r() * 90], [sx + dir * (120 + r() * 160), sy + 90 + r() * 160]]
    out.push(`<path d="${wob(pts, b + 3, 4)}" fill="none" stroke="${INK}" stroke-width="${n(3 + r() * 3)}" stroke-linecap="round" opacity=".92"/>`)
    for (let t = 0; t < 4; t++) {
      const [tx, ty] = pts[1 + (t % 2)]!
      const tw: Pt[] = [[tx, ty], [tx + dir * (30 + r() * 60), ty + 10 + r() * 60]]
      out.push(`<path d="${wob(tw, b * 7 + t, 3)}" fill="none" stroke="${INK}" stroke-width="${n(1.4 + r() * 1.4)}" stroke-linecap="round" opacity=".85"/>`)
      bloom(tw[1]![0], tw[1]![1], 7, 46)
    }
    bloom(pts[2]![0], pts[2]![1], 16, 64)
    bloom(pts[1]![0], pts[1]![1], 10, 54)
  }
  for (let i = 1; i < LIMB.length; i++) {
    bloom(LIMB[i]![0], LIMB[i]![1] - 10, 20, 90)
  }

  return out.join('') + `<g class="bl">${clusters.join('')}</g>`
}

export function petals(): string {
  const r = rng(77)
  const out: string[] = []
  for (let i = 0; i < 70; i++) {
    const dur = 11 + r() * 12
    const s = 0.7 + r() * 1.9
    out.push(
      `<g transform="translate(${n(r() * 1900)},0) scale(${n(s)})"><g class="f" style="animation-duration:${n(dur)}s;animation-delay:-${n(r() * dur)}s"><g class="sw" style="animation-duration:${n(2.6 + r() * 2.8)}s;animation-delay:-${n(r() * 4)}s">` +
        `<path class="sn" d="M0,0 C3,-6 9,-4 8,2 C6,7 -1,6 0,0Z" fill="${PINKS[Math.floor(r() * PINKS.length)]}" style="animation-duration:${n(4 + r() * 4)}s"/></g></g></g>`,
    )
  }

  return out.join('')
}

