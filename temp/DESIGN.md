# OpaHiFi Design Notes

## Core Ideas

OpaHiFi should feel like a high-energy music interface, not a generic landing page. The interactive song sections are **Opaverses**. The gallery is a simpler browsing surface for tracks.

Use direct labels in navigation and gallery surfaces. Save heavier lore language for the immersive Opaverse sections.

## Main Colors

The active CSS tokens live in `css/opaverse/tokens.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `--opa-navy` | `#050510` | Page background, deep negative space |
| `--opa-cobalt` | `#1d2b53` | Secondary dark surfaces, gradients |
| `--opa-violet` | `#4d2279` | Brand purple, scrollbar, glass accents |
| `--opa-cyan` | `#4e19ba` | Primary accent currently reads as electric violet |
| `--opa-orange` | `#ff3c00` | Hot action/hover accent |
| `--opa-gold` | `#ffb800` | Warm highlight |

Keep the page mostly navy/black with sharp violet/orange highlights. Avoid adding new dominant colors unless they are song-specific.

## Typography

| Token | Font | Use |
| --- | --- | --- |
| `--font-heavy` | Anton | Big display titles and song card text |
| `--font-display` | Oswald | Nav, labels, short UI text |
| `--font-sans` | Inter | Body copy |

Titles should be loud and compressed. Body copy should stay readable and restrained.

## Navigation

The top nav is fixed and compact. Anchor scrolling is controlled by shared CSS tokens and `js/opaverse/ScrollManager.js`.

Anchor scrolling must account for the fixed nav globally. Native scroll uses `--anchor-offset`, `scroll-padding-top`, and `scroll-margin-top` in `css/opaverse/base.css`. Lenis uses the same offset logic by caching `navbar.offsetHeight + --anchor-clearance` on init, viewport resize, and navbar resize.

Do not read layout or computed styles on every nav click. Do not add one-off JavaScript offsets for individual nav buttons; fix the shared offset token or the section spacing.

## Gallery

Visible gallery language should stay simple:

- Small label: `THE TRACKS`
- Current heading: `SONG GALLERY`

The gallery cards are compact track selectors. On click, the selected card moves into a detail hero area and the other cards arrange into a bottom rail.

## Naming

- **Opaverse**: one interactive song world.
- **OpaHiFi**: the overall project/site.
- **Gallery / playlist / tracks**: browsing surfaces.

Avoid introducing extra world names unless the UI needs them.
