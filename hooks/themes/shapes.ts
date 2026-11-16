import { n, rng } from './util.js'

export type Pt = [number, number]

/** A flat-colored triangle (or any polygon): the building block of the low-poly look. */
export const tri = (pts: Pt[], fill: string, extra = ''): string =>
  `<polygon points="${pts.map(p => `${n(p[0])},${n(p[1])}`).join(' ')}" fill="${fill}"${extra}/>`

/** A faceted ridge: triangles from a jagged skyline down to the bottom edge. */
export function ridge(baseY: number, amp: number, seed: number, shades: string[], step = 100): string {
  const r = rng(seed)
  const count = Math.ceil(1600 / step)
  const top: Pt[] = Array.from({ length: count + 1 }, (_, i) => [i * step, baseY + (r() - 0.5) * amp * 2])
  const pick = () => shades[Math.floor(r() * shades.length)]!
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    out.push(tri([top[i]!, top[i + 1]!, [i * step, 1000]], pick()), tri([top[i + 1]!, [(i + 1) * step, 1000], [i * step, 1000]], pick()))
  }

  return out.join('')
}

/** Scales every animation time in a scene: 1.6 is calmer, 0.65 livelier. */
export const retime = (scene: string, k: number): string =>
  k === 1 ? scene : scene.replace(/(-?\d*\.?\d+)s(?![\w-])/g, (_, v: string) => `${(parseFloat(v) * k).toFixed(2)}s`)
