# Gallery Page Spec

## Ownership
- Route: `#gallery`
- Files:
  - `src/pages/gallery/GalleryPage.js`
  - `src/pages/gallery/gallery.css`
  - `src/pages/gallery/GalleryRoute.js`
  - `src/pages/gallery/spec.md`

## Scope
- Own the gallery screen only.
- Do not modify videos or song-detail behavior unless the shell contract changes.

## Responsibilities
- Render the 3x3 journey map.
- Render and update the spiral path.
- Own the latest/play-all promo interactions.
- Own all `.ophf-gallery*`, `.ophf-promo*`, `.ophf-songField`, `.ophf-mapGrid`, `.ophf-songNode*`, and `.ophf-spiral*` selectors.

## Route Contract
- `matches(route)` accepts empty route and `gallery`.
- `buildHash()` returns `#gallery`.
- `apply(app)` must activate the gallery screen without mutating unrelated screen state directly.

## Acceptance
- Clicking `Gallery` opens the map and updates URL to `#gallery`.
- Reload on `#gallery` returns to the gallery screen.
- Latest and Play All promo actions are owned by the gallery page module.
- Spiral sizing updates with resize without shell-specific map code.
