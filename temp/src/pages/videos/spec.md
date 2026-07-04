# Videos Page Spec

## Ownership
- Route: `#videos`
- Files:
  - `src/pages/videos/VideosPage.js`
  - `src/pages/videos/videos.css`
  - `src/pages/videos/spec.md`

## Scope
- Own the videos screen only.
- Do not modify gallery map behavior, song detail behavior, or global app shell unless the page contract changes.

## Responsibilities
- Render and manage the 3-column accordion video UI.
- Own the guide copy below the accordion.
- Own video playback, open/close behavior, and videos route matching/building.
- Own all `.ophf-video*` selectors and `.ophf-videos*` layout rules.

## Route Contract
- `matches(route)` accepts `videos`.
- `buildHash()` returns `#videos`.
- `apply(app)` must activate the videos screen without directly mutating unrelated screen state.

## Acceptance
- Clicking `Videos` opens the videos screen and updates URL to `#videos`.
- Reload on `#videos` returns to the videos screen.
- Back/forward between `#gallery`, `#videos`, and song detail works.
- Videos page changes stay isolated to `src/pages/videos/*` unless the shell contract changes.
