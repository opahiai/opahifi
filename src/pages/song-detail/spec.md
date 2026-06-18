# Song Detail Page Spec

## Ownership
- Route: `#song-id` and `#song-id/vN`
- Files:
  - `src/pages/song-detail/DetailPage.js`
  - `src/pages/song-detail/detail.css`
  - `src/pages/song-detail/DetailRoute.js`
  - `src/pages/song-detail/spec.md`

## Scope
- Own the song detail screen only.
- Do not modify gallery or videos behavior unless the shell contract changes.

## Responsibilities
- Render the selected song/version cover, version metadata, links, share button, lyrics, and mini rail.
- Fetch and cache lyrics per version.
- Own version switching UI inside the detail screen.
- Own all `.ophf-detail*`, `.ophf-track*`, `.ophf-version*`, `.ophf-listen*`, `.ophf-share*`, `.ophf-miniRail`, and `.ophf-rail*` selectors.

## Route Contract
- `matches(route, app)` accepts a valid song id with optional `/vN`.
- `buildHash(state)` returns `#song-id` or `#song-id/vN`.
- `apply(app, route)` must activate the detail screen without mutating unrelated screen state directly.

## Shell Contract
- Shell passes songs, platform metadata, and the `openSong(songId, versionIndex)` callback.
- Shell remains responsible for global state, cover hero updates, and bottom-nav transitions.

## Acceptance
- Reload on a song hash returns to that song/version.
- Version jump buttons update both UI and URL.
- Mini rail remains visible only in detail mode and highlights the current song.
- Lyrics loading/caching is local to the detail page module.
