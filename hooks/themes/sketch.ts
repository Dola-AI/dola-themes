import type { Pt } from './shapes.js'
import { n, rng } from './util.js'

/** A hand-drawn polyline: the points wobbled a little and joined by short segments. */
export function wob(pts: Pt[], seed: number, amt = 2): string {
  const r = rng(seed)
  const out: string[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!
    const [x1, y1] = pts[i + 1]!
    const k = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 22))
    for (let j = i === 0 ? 0 : 1; j <= k; j++) {
      const t = j / k
      out.push(`${n(x0 + (x1 - x0) * t + (r() - 0.5) * amt * 2)},${n(y0 + (y1 - y0) * t + (r() - 0.5) * amt * 2)}`)
    }
  }

  return `M${out.join(' L')}`
}

/** A pencil line that draws itself on, holds, then rubs out; `delay` staggers the strokes. */
export const pencil = (d: string, delay: number, w = 2.4, color = '#eeeae0', op = 0.92): string =>
  `<path class="dr" pathLength="1" d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}" style="animation-delay:${n(delay)}s"/>`

/** A loose scribbled loop, drawn twice for the sketchy look. */
export function loop(cx: number, cy: number, rx: number, ry: number, seed: number, delay: number, color?: string, w?: number): string {
  const r = rng(seed)
  const one = (): string => {
    const pts: Pt[] = Array.from({ length: 22 }, (_, i): Pt => {
      const a = (i / 21) * Math.PI * 2 + 0.2
      const j = 1 + (r() - 0.5) * 0.12

      return [cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]
    })

    return wob(pts, Math.floor(r() * 1000), 1.2)
  }

  return pencil(one(), delay, w, color) + pencil(one(), delay + 0.3, w, color, 0.6)
}

/** Parallel pencil strokes shading a circle on its lower right. */
export function shade(cx: number, cy: number, R: number, gap: number, seed: number, delay: number, color?: string): string {
  const r = rng(seed)
  const out: string[] = []
  for (let y = -R * 0.2; y < R * 0.9; y += gap) {
    const half = Math.sqrt(Math.max(0, R * R - y * y))
    out.push(pencil(wob([[cx - half * 0.1 + (r() - 0.5) * 6, cy + y], [cx + half * 0.92, cy + y - 10]], Math.floor(r() * 1000), 1), delay + out.length * 0.05, 1.4, color, 0.55))
  }

  return out.join('')
}

export const SKETCH_CSS = `
.dr{stroke-dasharray:1;stroke-dashoffset:1;animation:dr 18s ease-in-out infinite both}
@keyframes dr{0%{stroke-dashoffset:1}28%{stroke-dashoffset:0}84%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
.lt{animation:lt 3s ease-in-out infinite alternate}
@keyframes lt{from{opacity:.2}to{opacity:.95}}
.bd{animation:bd 20s linear infinite}
`
