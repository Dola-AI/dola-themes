import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { ALIASES, GROUPS, THEMES } from './themes/index.js'
import { retime } from './themes/shapes.js'
import type { Theme } from './themes/util.js'

const PREFIX = 'dola' // commands read /dola-aurora, /dola-mode; change this one word to rebrand
const cmd = (t: Theme) => `${PREFIX}-${t.id}`
type Mode = 'dark' | 'light'
type Glass = false | { blur: number; opacity: number } | undefined
const isMode = (v: unknown): v is Mode => v === 'dark' || v === 'light'

// Options from the plugin's userConfig (set in the config menu): speed, glass, startMode.
const SPEED: Record<string, number> = { calm: 1, normal: 0.55, lively: 0.35 }
const GLASS: Record<string, Glass> = { default: undefined, off: false, clear: { blur: 0, opacity: 0.55 }, light: { blur: 8, opacity: 0.35 }, strong: { blur: 22, opacity: 0.65 } }

const NAMES: [string, Theme][] = [
  ...THEMES.map((t): [string, Theme] => [cmd(t), t]),
  ...Object.entries(ALIASES).map(([a, id]): [string, Theme] => [`${PREFIX}-${a}`, THEMES.find(t => t.id === id)!]),
]

/** `/themes sakura`, `/themes 3`, `/themes Sakura Dusk` all resolve to one theme. */
function find(query: string): Theme | undefined {
  const q = query.trim().toLowerCase()

  return THEMES.find(t => t.id === q || t.label.toLowerCase() === q) ?? THEMES.find(t => t.id === ALIASES[q]) ?? THEMES[Number(q) - 1]
}

async function modeOf($: EngineInterface, start: Mode): Promise<Mode> {
  const m = await $.store.get('mode')

  return isMode(m) ? m : start
}

async function current($: EngineInterface): Promise<Theme> {
  return find(String((await $.store.get('theme')) ?? '')) ?? THEMES[0]!
}

async function apply($: EngineInterface, t: Theme, mode: Mode, glass: Glass): Promise<string> {
  await $.store.set('theme', t.id)
  if (t.photoMode === undefined) {
    await $.store.set('mode', mode)
  }
  const shown: Mode = t.photoMode ?? mode
  const scene = `${t.id}-${shown}`
  const args: ThemeSetArgs = { colors: t.theme, overrideColorScheme: shown }
  if (t.plain !== true) {
    args.backdrop = t.ground ?? (t.photo !== undefined ? { image: { source: t.photo } } : glass === undefined ? { scene } : { scene, glass })
  }
  const set = await $.theme.set(args)

  return set.isDrawn ? `${t.label}, ${shown}.` : `Saved ${t.label} (${shown}), but this screen draws no themes: ${set.reason}`
}

export const register: Register = (on, options) => {
  const speed = SPEED[String(options.speed ?? 'normal')] ?? 1
  const glass = GLASS[String(options.glass ?? 'clear')]
  const start: Mode = options.startMode === 'light' ? 'light' : 'dark'

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'themes', description: 'List the Dola themes, or switch / turn off', argumentHint: '[name | number | off]' })
    await $.command.register({ name: `${PREFIX}-mode`, description: 'Dola theme: switch light / dark', argumentHint: '[light | dark]' })
    for (const [name, t] of NAMES) {
      await $.command.register({ name, description: `Dola theme: ${t.blurb}`, argumentHint: '[light | dark]' })
    }
    if ((await $.store.get('theme')) !== 'off') {
      await apply($, await current($), await modeOf($, start), glass)
    }

    return next(e)
  })

  // One command per theme: /dola-aurora, /dola-aurora light, ...
  for (const [name, t] of NAMES) {
    on('command.run', { command: name }, async ($, e) => {
      const arg = e.args.trim().toLowerCase()

      return { text: await apply($, t, isMode(arg) ? arg : await modeOf($, start), glass) }
    })
  }

  on('command.run', { command: `${PREFIX}-mode` }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    const mode: Mode = isMode(arg) ? arg : (await modeOf($, start)) === 'dark' ? 'light' : 'dark'

    return { text: await apply($, await current($), mode, glass) }
  })

  on('command.run', { command: 'themes' }, async ($, e) => {
    const arg = e.args.trim()

    if (arg.toLowerCase() === 'off') {
      await $.store.set('theme', 'off')
      await $.theme.clear()

      return { text: `Themes off. Back to the default look. /${PREFIX}-<name> turns one on again.` }
    }
    if (arg !== '' && arg.toLowerCase() !== 'list') {
      const t = find(arg)

      return { text: t === undefined ? `No theme called "${arg}". Run /themes to see the list.` : await apply($, t, await modeOf($, start), glass) }
    }
    const now = String((await $.store.get('theme')) ?? THEMES[0]!.id)
    const lines = GROUPS.flatMap(g => [
      '',
      g.name,
      ...g.themes.map(t => `${t.id === now ? '▸' : ' '} /${cmd(t).padEnd(24)} ${t.label} — ${t.blurb}`),
    ])

    return {
      text: [
        `Dola themes (${await modeOf($, start)})`,
        ...lines,
        '',
        `Light / dark: /${PREFIX}-mode  or  /${PREFIX}-<name> light|dark   ·   Default look: /themes off`,
        `Nicknames: ${Object.keys(ALIASES).map(a => `/${PREFIX}-${a}`).join('  ')}`,
        'Speed, frosted glass and start mode: /config, dola-themes',
      ].join('\n'),
    }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const mode: Mode = e.props.scene.endsWith('-light') ? 'light' : 'dark'
    const t = THEMES.find(one => `${one.id}-${mode}` === e.props.scene)
    if (t === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    // Drawn as an image (no isInteractive): the sandboxed frame did not play the CSS animation.
    return <Svg source={retime(t.scenes[mode], speed)} alt={`${t.label} (${mode}): ${t.blurb}`} />
  })
}
