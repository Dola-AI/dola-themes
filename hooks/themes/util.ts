import type { ThemeColors, ThemeSetArgs } from 'claude-code'

export type Theme = {
  id: string
  label: string
  blurb: string
  theme: ThemeColors
  problems: string[]
  scenes: { dark: string; light: string }
  /** A photo in the mod's folder used as a still backdrop instead of an animated scene. */
  photo?: string
  photoMode?: 'dark' | 'light'
  /** Colors only: no backdrop at all. */
  plain?: boolean
  /** A raw backdrop ground (gradient, color, image) used as is. */
  ground?: ThemeSetArgs['backdrop']
}

/** Small seeded random, so every scene draws the same on each load. */
export function rng(seed: number): () => number {
  let s = seed >>> 0

  return () => {
    s = (s * 1664525 + 1013904223) >>> 0

    return s / 4294967296
  }
}

const REDUCED = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'

/** Wraps a scene: full-bleed 1600x1000 canvas, cropped to any screen, motion off when asked. */
export function svg(css: string, body: string): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">` +
    `<style>${css}${REDUCED}</style>${body}</svg>`
  )
}

export const n = (v: number): string => v.toFixed(1)

/** The light scene is the dark one with its hex colors swapped through a small map. */
export function dualScene(dark: string, light: Record<string, string>): { dark: string; light: string } {
  return { dark, light: dark.replace(/#[0-9a-fA-F]{6}/g, hex => light[hex.toLowerCase()] ?? hex) }
}
