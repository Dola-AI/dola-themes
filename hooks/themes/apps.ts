import { makeColors } from '../make-colors.js'

import type { Theme } from './util.js'

// Colors only, no backdrop: familiar app palettes that recolor the whole Code tab, sidebar included.
// Inspired by well-known app palettes; no logos, artwork or fonts. Palettes by the Dola themes mod, ported into this pack.
type Def = Parameters<typeof makeColors>[0]

function app(id: string, label: string, blurb: string, def: Def, forced?: 'dark' | 'light'): Theme {
  const { theme, problems } = makeColors(def)

  return { id, label, blurb, theme, problems, scenes: { dark: '', light: '' }, plain: true, ...(forced ? { photoMode: forced } : {}) }
}

export const APPS: readonly Theme[] = [
  app('discord', 'Blurple (Discord-style)', 'Colors only: graphite and blurple, dark', {
    label: 'Dola Blurple',
    only: 'dark',
    roles: { accent: '#5865f2', danger: '#f23f43', success: '#23a55a', warning: '#f0b232', pro: '#eb459e' },
    dark: {
      gray: {
        anchors: {
          'surface-0': '#1e1f22',
          'surface-1': '#2b2d31',
          'surface-2': '#313338',
          'surface-3': '#35373c',
          'text-primary': '#f2f3f5',
          'text-secondary': '#c4c9ce',
          'text-muted': '#9ba1aa',
        },
      },
    },
  }, 'dark'),
  app('telegram', 'Sky Chat (Telegram-style)', 'Colors only: airy blue, light and dark', {
    label: 'Dola Sky Chat',
    roles: { accent: '#3390ec', danger: '#e53935', success: '#4fae4e', warning: '#e8a020', pro: '#8e6cd8' },
    light: {
      gray: {
        anchors: {
          'surface-0': '#e7edf3',
          'surface-1': '#f1f5f9',
          'surface-2': '#ffffff',
          'text-primary': '#0f1419',
          'text-secondary': '#3c4a57',
          'text-muted': '#5b6772',
        },
      },
    },
    dark: {
      gray: {
        anchors: {
          'surface-0': '#0e1621',
          'surface-1': '#17212b',
          'surface-2': '#1d2833',
          'surface-3': '#212d3a',
          'text-primary': '#f5f7f9',
          'text-secondary': '#c4cdd5',
          'text-muted': '#93a1ae',
        },
      },
      roles: { accent: '#5eaaf0' },
    },
  }),
  app('x', 'Lights Out (X-style)', 'Colors only: pure black with a bright blue accent, dark', {
    label: 'Dola Lights Out',
    only: 'dark',
    roles: { accent: '#1d9bf0', danger: '#f4212e', success: '#00ba7c', warning: '#ffd400', pro: '#7856ff' },
    dark: {
      gray: {
        anchors: {
          'surface-0': '#000000',
          'surface-1': '#0b0c0e',
          'surface-2': '#16181c',
          'surface-3': '#1a1c20',
          'text-primary': '#e7e9ea',
          'text-secondary': '#c2c6ca',
          'text-muted': '#8b9095',
        },
      },
    },
  }, 'dark'),
  app('facebook', 'Social Blue (Facebook-style)', 'Colors only: friendly blue, light and dark', {
    label: 'Dola Social Blue',
    roles: { accent: '#0866ff', danger: '#e41e3f', success: '#31a24c', warning: '#e6a01e', pro: '#8a5cf6' },
    light: {
      gray: {
        anchors: {
          'surface-0': '#eceff3',
          'surface-1': '#f5f6f8',
          'surface-2': '#ffffff',
          'text-primary': '#050505',
          'text-secondary': '#3a3b3c',
          'text-muted': '#5d6066',
        },
      },
    },
    dark: {
      gray: {
        anchors: {
          'surface-0': '#18191a',
          'surface-1': '#212223',
          'surface-2': '#242526',
          'surface-3': '#28292b',
          'text-primary': '#e4e6eb',
          'text-secondary': '#c8cbd0',
          'text-muted': '#a3a7ae',
        },
      },
      roles: { accent: '#2d88ff' },
    },
  }),
  app('instagram', 'Gradient Pop (Instagram-style)', 'Colors only: clean neutrals with a magenta accent, light and dark', {
    label: 'Dola Gradient Pop',
    roles: { accent: '#d62976', danger: '#ed4956', success: '#3fa83a', warning: '#f77737', pro: '#962fbf' },
    light: {
      gray: {
        anchors: {
          'surface-0': '#f2f2f4',
          'surface-1': '#f8f8f9',
          'surface-2': '#ffffff',
          'text-primary': '#0c1014',
          'text-secondary': '#3d4247',
          'text-muted': '#61666b',
        },
      },
    },
    dark: {
      gray: {
        anchors: {
          'surface-0': '#000000',
          'surface-1': '#0c0c0d',
          'surface-2': '#121213',
          'surface-3': '#161617',
          'text-primary': '#f5f5f5',
          'text-secondary': '#c9c9c9',
          'text-muted': '#9a9a9a',
        },
      },
      roles: { accent: '#e1306c' },
    },
  }),
]
