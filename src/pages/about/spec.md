# About Page Spec

## Ownership
- Route: `#about`
- Files:
  - `src/pages/about/AboutPage.js`
  - `src/pages/about/AboutRoute.js`
  - `src/pages/about/about.css`
  - `src/pages/about/spec.md`

## Scope
- Own the about screen only.
- Keep all copy, layout, and scrolling behavior local to the about page module.

## Responsibilities
- Render the OPAHiFi about content.
- Fit long-form copy inside the current app viewport with internal scrolling.
- Use accordion sections so the page stays readable on mobile.

## Route Contract
- `matches(route)` accepts `about`.
- `buildHash()` returns `#about`.
- `apply(app)` must activate the about screen without mutating unrelated screen state directly.

## Acceptance
- Clicking `About` opens the about page and updates URL to `#about`.
- Reload on `#about` returns to the about page.
- Content scrolls inside the page body, not the whole app shell.
