import { abyss } from './abyss.js'
import { APPS } from './apps.js'
import { aurora } from './aurora.js'
import { blackHole } from './black-hole.js'
import { candyLand } from './candy-land.js'
import { ember } from './ember.js'
import { glitchCity } from './glitch-city.js'
import { marketNight } from './market-night.js'
import { meteorShower } from './meteor-shower.js'
import { neonRain } from './neon-rain.js'
import { neonRooftop } from './neon-rooftop.js'
import { neutronMerger } from './neutron-merger.js'
import { sakura } from './sakura.js'
import { bloodMoonBamboo } from './blood-moon-bamboo.js'
import { sketchCity } from './sketch-city.js'
import { sketchForest } from './sketch-forest.js'
import { sketchTrain } from './sketch-train.js'
import { skyflock } from './skyflock.js'
import { synthwave } from './synthwave.js'
import { toonPirates } from './toon-pirates.js'
import { universe } from './universe.js'
import { windyBamboo } from './windy-bamboo.js'
import type { Theme } from './util.js'

/** How /themes groups the pack. Add a theme: one file here, one entry below. */
export const GROUPS: readonly { name: string; themes: readonly Theme[] }[] = [
  { name: 'Cyberpunk & neon', themes: [neonRooftop, neonRain, glitchCity, synthwave, marketNight] },
  { name: 'Ink & cartoon', themes: [windyBamboo, bloodMoonBamboo, toonPirates, candyLand, skyflock] },
  { name: 'Cosmos', themes: [blackHole, neutronMerger, meteorShower, universe] },
  { name: 'Sketchbook', themes: [sketchForest, sketchCity, sketchTrain] },
  { name: 'App colors (no backdrop)', themes: APPS },
  { name: 'Calm & nature', themes: [abyss, aurora, sakura, ember] },
]

/** Short nicknames: /dola-samurai and so on. */
export const ALIASES: Readonly<Record<string, string>> = {
  twitter: 'x',
  fb: 'facebook',
  ig: 'instagram',
  insta: 'instagram',
  tg: 'telegram',
  cyberpunk: 'neon-rain',
  train: 'sketch-train',
  bamboo: 'windy-bamboo',
  blackhole: 'black-hole',
  sketch: 'sketch-forest',
}

export const THEMES: readonly Theme[] = GROUPS.flatMap(g => g.themes)
