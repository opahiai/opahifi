# OpaHiFi Songography + Song Detail

## Core Idea

A continuous music world:

**Songography → song detail → version switch → next song**

The user never feels sent to another page. The selected cover moves from the
songography into focus while the rest of the collection becomes the song rail.

---

## Art Direction

**Glossy blue-and-fire pop surrealism over white.**

The website uses a dark, quiet frame so the white cover art and vivid blue-red
forms remain the loudest elements.

Avoid a colorful dashboard. The artwork provides the spectacle; the interface
provides contrast and control.

---

## Web Palette

| Color | Value | Job |
|---|---:|---|
| Deep ink black | `#05060D` | Main page background |
| Midnight navy | `#0B1024` | Panels, menus, and raised surfaces |
| Electric blue | `#155BFF` | Primary actions, links, and selected states |
| Deep violet | `#5B2CFF` | Bridge between the blue and fire sides |
| Fiery red | `#FF3B2F` | Play state and strongest active moments |
| Molten orange | `#FF6A00` | Small fire highlights only |
| Fire gold | `#FFD166` | Rare celebratory highlights only |
| White | `#F7F8FF` | Titles and main text |
| Muted blue-gray | `#AAB3D6` | Metadata and secondary text |
| Natural gray | `#9A9AA3` | Eyebrows and section kickers |

### Balance

- 80% dark background and surfaces
- 15% blue and violet interaction color
- 5% red, orange, and gold impact color

Do not use cyan.

---

## 1. Songography

### Mobile

All song covers fit inside one mobile screen.

- Compact OpaHiFi header
- **Play All** action
- Dense circular cover grid
- Cover image only inside each circle
- Small stacked-ring badge when a song has multiple versions
- No descriptions, platform icons, or card backgrounds

### Desktop

Use the same compact circle system with more columns. Keep the songography centered
and visually unified. Do not convert it into rectangular album cards.

---

## 2. Clicking a Song

The selected cover remains the same visible object throughout the transition.

1. The selected circle lifts above the grid
2. The other circles compress into a horizontal rail
3. The selected circle moves into the main artwork position
4. The title, version, play control, and metadata appear
5. Version and platform controls appear below

Use **GSAP Flip** for the cover and grid-to-rail movement.

Do not fade to a separate page or replace the selected cover with a duplicate.

---

## 3. Song Detail

### Top Controls

- Back to songography
- OpaHiFi logo
- Share

### Main Focus

- Large circular cover
- Song title
- Active version name
- Track length
- Play / pause

The cover remains the visual center. Controls must not compete with it.

### Version Picker

Show only when the song has multiple versions.

- Display the version count
- Use compact labeled pills or small cover thumbnails
- Make the active version unmistakable with electric blue
- Update audio, artwork, length, lyrics, and platform links in place

Changing version must feel faster than changing songs.

### Platform Links

Show one compact row beneath the main controls.

Only display platforms available for the active version.

### Lyrics

- Collapsed by default on mobile
- Opens inline below the controls
- No modal
- No separate page
- Large readable text with strong line spacing

---

## 4. Song Rail

The remaining song groups become a horizontal rail.

- Active song is larger or receives an electric-blue ring
- Neighboring songs remain partially visible
- Swipe on mobile
- Drag, wheel, or arrows on desktop
- Selecting a rail item moves that same cover into focus with GSAP Flip

The rail keeps the full Opaverses collection present and prevents a dead end.

---

## 5. Visual States

### Songography State

Every song circle is visible together.

### Song State

One song is in focus and every other song remains available in the rail.

The URL may update for sharing and browser history, but the interface remains one
continuous experience without a full reload.

---

## 6. Mobile First Screen

The first song-detail screen should contain:

1. Back and share controls
2. Main circular artwork
3. Song title and version
4. Play control and track length
5. Version picker
6. Platform links
7. Beginning of the song rail

Lyrics continue below the fold.

Only the version picker and song rail may scroll horizontally.

---

## 7. Color Usage

### Deep Ink Black

Use for the full browser background. It creates separation from the white cover
art and makes the artwork appear illuminated.

### Midnight Navy

Use for panels and controls that need to rise above the background without
looking like separate cards.

### Electric Blue

Use for primary buttons, selected versions, active rail rings, links, and focus
states.

### Deep Violet

Use sparingly in gradients and transitions between blue UI and red artwork.
Never use it as the dominant page color.

### Fiery Red

Use for play, live, or strongest active moments. It should feel meaningful, not
constant.

### Orange and Gold

Use only for tiny sparks, celebratory states, or special song moments. Never use
them for ordinary navigation.

### White, Muted Blue-Gray, and Natural Gray

Use white for titles and essential text. Use blue-gray for version names,
lengths, platform labels, and secondary information. Use natural gray for
eyebrows and section kickers.

---

## 8. Animation

- Use GSAP Flip for songography, rail, and main-cover movement
- Use short fades and vertical reveals for text and controls
- Keep song changes smooth and version changes quick
- Animate in a clear sequence, not all at once
- Respect `prefers-reduced-motion`

### Sequence

1. Selected cover lifts
2. Grid compresses into rail
3. Cover moves into focus
4. Song information appears
5. Controls and links appear
6. Lyrics control becomes available

---

## 9. Interaction Rules

- Clicking the active cover does nothing
- Clicking another song changes the focused song
- Clicking a version changes only the version
- Back reverses the transition into the full songography
- Share copies the exact song and version URL
- Play All starts with the active song when one is selected
- Swipe gestures must not trigger browser navigation accidentally

---

## 10. Tokens

```css
:root {
  --ohf-bg: #05060d;
  --ohf-surface: #0b1024;
  --ohf-blue: #155bff;
  --ohf-violet: #5b2cff;
  --ohf-red: #ff3b2f;
  --ohf-orange: #ff6a00;
  --ohf-gold: #ffd166;
  --ohf-text: #f7f8ff;
  --ohf-text-muted: #aab3d6;
  --ohf-eyebrow: #9a9aa3;
}
```

Use the `ohf-` prefix for every page-specific class, ID, custom property, and
JavaScript hook.

---

## Required Components

- `ohf-songography`
- `ohf-song-circle`
- `ohf-song-detail`
- `ohf-main-artwork`
- `ohf-song-rail`
- `ohf-version-picker`
- `ohf-platform-links`
- `ohf-lyrics-panel`
- `ohf-share-button`
- `ohf-play-all-button`

---

## Final Design Statement

The page is a dark songography built to frame bright white, blue, and fire artwork.
The selected cover physically moves into focus, while the rest of the collection
stays visible and ready to continue the ride.
