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
  duration: "3:29",
  releaseDate: null,
  status: "development",
  lyricsStatus: "source-provided",
  lyricsPath: "lyrics/do-the-panicarena.txt",
  assets: ohAssets,
  versions: Object.freeze([
    Object.freeze({
      id: "original",
      slug: "original",
      name: "Original",
      duration: "3:29",
      default: true,
      cover: ohAssets.cover,
      art: ohAssets.art,
      platforms: Object.freeze({
        spotify: "https://open.spotify.com/track/5wyNX1gUMECDxwHbHCDVcz?si=5b39639f9cc54914",
        appleMusic: "https://music.apple.com/us/album/do-the-panicarena-single/6793343589",
        amazonMusic: "https://music.amazon.com/albums/B0H9WLXV1Y?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_ZikPpmHfoy7WHzWPNppGQtQQV&trackAsin=B0H9VVVKYC"
      })
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
  lyrics: "",
  developmentNotes: "",
  share: Object.freeze({
    title: "Do The Panicarena",
    text: null,
    url: null
  })
});
