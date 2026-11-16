import { makeColors } from '../make-colors.js'

type Roles = { accent: string; danger: string; success: string; warning: string; pro: string }

// Seven colors per mode, in this order: page, card, panel, menu, text, secondary text, muted text.
const anchors = (c: string[]) => ({
  'surface-0': c[0]!,
  'surface-1': c[1]!,
  'surface-2': c[2]!,
  'surface-3': c[3]!,
  'text-primary': c[4]!,
  'text-secondary': c[5]!,
  'text-muted': c[6]!,
})

/** A whole two-mode palette from a handful of colors. */
export const palette = (label: string, roles: Roles, dark: string[], light: string[]) =>
  makeColors({ label, roles, dark: { gray: { anchors: anchors(dark) } }, light: { gray: { anchors: anchors(light) } } })
