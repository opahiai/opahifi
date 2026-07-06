# OpaHiFi — All Song Modules

This package extends the modular starter with all **10** songs found in the supplied cover package.

## Core rule

Each song is a self-contained folder:

```text
src/opaverses/<song-slug>/
├── assets/
│   ├── art.webp
│   ├── cover.webp
│   └── master.png
├── content/
│   ├── lyrics.txt
│   └── development-notes.md
├── data.js
├── animation.js
├── view.js
└── index.js
```

- `data.js` owns all song metadata, lyrics, platform placeholders, versions, credits, theme and local asset URLs.
- `animation.js` selects a GSAP preset but does not create individual ScrollTriggers.
- `view.js` owns the standalone Opaverse markup.
- `index.js` exposes one standard module interface.
- `opaverse.registry.js` controls only page order. Reorder the imports in its array to move complete Opaverses.
- Opaverse numbering is calculated from registry position, so numbers update automatically after reordering.
- The centralized GSAP manager creates and controls the timelines for every rendered module.

## Song status

| Order | Slug | Song | Lyrics status |
|---:|---|---|---|
| 01 | `full-mindness` | Full-Mindness | `source-provided` |
| 02 | `hallucinating-dum-dum` | Hallucinating Dum Dum | `development-notes` |
| 03 | `yeah-lets-do-brunch` | Yeah, Let’s Do Brunch | `source-provided` |
| 04 | `splenda-love-rabbit-hell` | Splenda Love Rabbit Hell | `source-provided` |
| 05 | `believe-the-truth-fairy` | Believe the Truth Fairy | `source-provided` |
| 06 | `old-love-story` | Old Love Story | `source-provided` |
| 07 | `glittaa-phoenix` | GLITTAA Phoenix | `source-provided` |
| 08 | `not-your-bot-beep-sleep` | Not Your Bot — Beep Sleep | `partial-draft` |
| 09 | `wellwolf-howl-lehluya` | Wellwolf Howl-Leh-Lu-Ya | `source-provided` |
| 10 | `opa-pa-pa-party` | Opa Pa Pa Pa Party | `source-with-alternate-draft` |

`Hallucinating Dum Dum` includes the supplied concept and lyric-development notes.

`Not Your Bot — Beep Sleep` includes the known draft excerpt, but its final lyrics source file was not included in the uploaded files.

## Run

Serve the folder through a local web server because the project uses native ES modules.

```bash
npx serve .
```

## Gallery interaction

The Gallery now follows the supplied OpaHiFi gallery prototype:

- all song circles fit inside one mobile viewport
- clicking a circle uses GSAP Flip to move that exact cover into the detail view
- every other cover moves into the bottom rail
- clicking a rail cover switches the active song without closing the detail view
- the detail view includes version navigation, duration, platform links, share, and expandable lyrics
- closing the detail view flips every cover back to its original grid position

The Gallery does not maintain a separate song list. It imports `OH_OPAVERSE_MODULES` from:

```text
src/opaverses/opaverse.registry.js
```

The Gallery controller is:

```text
src/gallery/gallery-manager.js
```

The Gallery styles are:

```text
src/styles/gallery.css
```

Each module can define versions like this:

```js
versions: Object.freeze([
  Object.freeze({
    id: "original",
    name: "Original",
    duration: "3:42",
    assets: Object.freeze({
      cover: new URL("./assets/cover.webp", import.meta.url).href
    }),
    platforms: Object.freeze({
      spotify: "",
      appleMusic: "",
      youtube: "",
      soundCloud: ""
    }),
    lyrics: ""
  })
])
```

When `versions` is empty, the Gallery automatically creates one `Original` version using the module's base cover, lyrics, duration, and platform fields.

## Registry scopes

`OH_OPAVERSE_MODULES` contains all 10 songs and feeds the Gallery.

`OH_JOURNEY_MODULES` currently selects the first three modules and feeds the initial scroll Journey. Reorder the full registry to change song order; change the Journey selector when a different three-song experience is needed.


## Gallery intro

The Gallery has no heading, count, subtitle, or replay link. The song-circle grid uses the complete available viewport.



## Gallery animation fix

- Removed the colored ring/background around song circles.
- Replaced the close-only icon with a labeled Back button.
- The detail backdrop and rail background appear after the cover travel animation, so every circle remains visible while moving.

## Gallery layering fix

- The Back to Gallery button is visible immediately in the song detail header.
- The detail and rail backgrounds appear immediately.
- Every moving song cover is explicitly layered above those backgrounds during GSAP Flip transitions.
