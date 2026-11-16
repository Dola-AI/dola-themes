import { INK, canopy, limb, petals, twigsAndBlossom } from './blossom-parts.js'
import { palette } from './palette.js'
import { ridge } from './shapes.js'
import { dualScene, svg } from './util.js'
import type { Theme } from './util.js'

// Sakura dusk: a pale moon behind a great blossoming limb, petals tumbling through plum twilight over far hills.
const { theme, problems } = palette(
  'Sakura Dusk',
  { accent: '#f08fb4', danger: '#ef5b6a', success: '#5cc08a', warning: '#e8a64a', pro: '#b394f0' },
  ['#150d16', '#1c1220', '#241728', '#2c1c30', '#f7eaf1', '#d8c2cf', '#ad93a3'],
  ['#f8e8ee', '#fcf0f4', '#fff8fa', '#fff8fa', '#2c1621', '#573444', '#765565'],
)

const CSS = `
.f{animation:fall 16s linear infinite}
@keyframes fall{from{transform:translate(0,-60px)}to{transform:translate(-420px,1080px)}}
.sw{animation:swx 3.4s ease-in-out infinite alternate}
@keyframes swx{from{transform:translateX(-34px)}to{transform:translateX(34px)}}
.sn{transform-box:fill-box;transform-origin:center;animation:spin 6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.bl{animation:bl 7s ease-in-out infinite alternate}
@keyframes bl{from{transform:translate(-4px,2px)}to{transform:translate(5px,-3px)}}
.moon{animation:mn 9s ease-in-out infinite alternate}
@keyframes mn{from{opacity:.65}to{opacity:1}}
`

const BODY = `
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140b18"/><stop offset=".55" stop-color="#3c1f3f"/><stop offset="1" stop-color="#9a4a6a"/></linearGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd9e6" stop-opacity=".45"/><stop offset="1" stop-color="#ffd9e6" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle class="moon" cx="520" cy="330" r="360" fill="url(#halo)"/><circle cx="520" cy="330" r="104" fill="#fbe9f0"/>
${ridge(760, 60, 5, ['#2a1630', '#331a3a', '#3a1f42'], 110)}
${limb()}
${canopy()}
${twigsAndBlossom()}
${ridge(905, 24, 9, ['#12091a', '#180c20', '#1d0f26'], 80)}
${petals()}
`

export const sakura: Theme = {
  id: 'sakura',
  label: 'Sakura Dusk',
  blurb: 'A pale moon behind a great blossoming limb, petals tumbling through plum twilight',
  theme,
  problems,
  scenes: dualScene(svg(CSS, BODY), {
    '#140b18': '#fff3f7', '#3c1f3f': '#ffe1ec', '#9a4a6a': '#ffc3d4', '#fbe9f0': '#fff6d6', '#ffd9e6': '#fff1c2',
    '#2a1630': '#e8b8cc', '#331a3a': '#e0a8c0', '#3a1f42': '#d99ab4', '#12091a': '#c98aa4', '#180c20': '#bb7d98', '#1d0f26': '#a8708a',
    [INK]: '#5a2d4e',
  }),
}
