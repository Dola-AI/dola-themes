import type { Pt } from './shapes.js'
import { n, rng } from './util.js'

/** A smooth path through points (Catmull-Rom turned into cubic Beziers). */
export function smooth(pts: Pt[]): string {
  let d = `M${n(pts[0]![0])},${n(pts[0]![1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!
    d += ` C${n(p1[0] + (p2[0] - p0[0]) / 6)},${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)},${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])},${n(p2[1])}`
  }

  return d
}

/** A winding route across the scene: dir 1 runs left to right, -1 right to left; y wanders inside [lo, hi]. */
export function wander(seed: number, dir: 1 | -1, lo: number, hi: number, steps = 8): string {
  const r = rng(seed)
  const x0 = dir === 1 ? -260 : 1860
  const x1 = dir === 1 ? 1860 : -260
  let y = lo + r() * (hi - lo)
  const pts: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    y = Math.min(hi, Math.max(lo, y + (r() - 0.5) * (hi - lo) * 0.8))
    pts.push([x0 + ((x1 - x0) * i) / steps, y])
  }

  return smooth(pts)
}

/** SMIL motion along a path. `lead` is how many seconds the trip is already underway, so members of a group spread out along the route. */
export const along = (path: string, dur: number, lead: number, rotate: boolean): string =>
  `<animateMotion path="${path}" dur="${n(dur)}s" begin="-${n(lead)}s" repeatCount="indefinite"${rotate ? ' rotate="auto"' : ''}/>`
