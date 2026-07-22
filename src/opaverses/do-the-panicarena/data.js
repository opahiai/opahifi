const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "do-the-panicarena",
  slug: "do-the-panicarena",
  title: "Do The Panicarena",
  titleLines: Object.freeze(["Do The", "Panicarena"]),
  navLabel: "Do The Panicarena",
  subtitle: "Coming soon",
  duration: "Duration pending",
  releaseDate: null,
  status: "development",
  lyricsStatus: "pending",
  assets: ohAssets,
  versions: Object.freeze([
    Object.freeze({
      id: "original",
      slug: "original",
      name: "Original",
      duration: "Duration pending",
      default: true,
      cover: ohAssets.cover,
      art: ohAssets.art,
      platforms: Object.freeze({})
    })
  ]),
  theme: Object.freeze({
    background: "#17112b",
    primary: "#8b5cf6",
    secondary: "#e75b5b"
  }),
  opaverse: Object.freeze({
    subtitle: "Coming soon",
    summary: "A new OpaHiFi song is on the way.",
    featuredLine: "Do The Panicarena.",
    animationPreset: "hallucination"
  }),
  lyrics: "Lyrics pending",
  developmentNotes: "",
  share: Object.freeze({
    title: "Do The Panicarena",
    text: null,
    url: null
  })
});
