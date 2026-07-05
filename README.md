# OpaHiFi modular starter

## Run

Serve the folder through Live Server or another local HTTP server.

```bash
python -m http.server 5502
```

Open `http://127.0.0.1:5502`.

## Reorder Opaverses

Edit only:

`src/opaverses/opaverse.registry.js`

Move modules inside `OH_OPAVERSE_MODULES`. The journey and gallery update from the same order.

## Add an Opaverse

1. Duplicate one folder inside `src/opaverses/`.
2. Rename its exported module, song data, IDs, theme, and animation preset.
3. Import it into `opaverse.registry.js`.
4. Add it to `OH_OPAVERSE_MODULES`.

Each module owns:

- Song identity and copy
- Duration and versions
- Cover and audio paths
- Platform links
- Theme colors
- Animation preset
- Standalone markup

## Central managers

- `layout-manager.js` owns viewport and navbar measurements.
- `navigation-manager.js` owns all smooth anchor navigation and navbar offsets.
- `gsap-manager.js` owns animation creation, ScrollTriggers, refreshes, and cleanup.

## Responsive rule

The base CSS starts at 320px. Every breakpoint uses `min-width`; there are no `max-width` media queries.

## Assets

Place final files in:

- `assets/images/`
- `assets/audio/`

The current starter uses generated CSS visuals, so missing assets do not break the page.
