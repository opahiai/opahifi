const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "not-your-bot-beep-sleep",
  slug: "not-your-bot-beep-sleep",
  title: "Not Your Bot — Beep Sleep",
  titleLines: Object.freeze(["Not Your Bot", "Beep Sleep"]),
  navLabel: "Not Your Bot",
  subtitle: "Beep-sleep rebellion",
  duration: "3:25",
  releaseDate: null,
  status: "development",
  lyricsStatus: "partial-draft",
  assets: ohAssets,
  versions: Object.freeze([
    Object.freeze({
      id: "original",
      slug: "original",
      name: "Original",
      duration: "3:25",
      default: true,
      cover: ohAssets.cover,
      art: ohAssets.art,
      platforms: Object.freeze({
        spotify: "https://open.spotify.com/track/4tLlgRbaw4AgpGjEJx96CO",
        appleMusic: "https://music.apple.com/us/song/not-your-bot-beep-sleep/6786322596",
        youtube: "https://music.youtube.com/watch?v=8Z90e2Zl-bw",
        amazonMusic: "https://music.amazon.com/albums/B0H729SL3F?trackAsin=B0H72LRQ16",
        other: "https://youtu.be/8Z90e2Zl-bw"
      })
    })
  ]),
  theme: Object.freeze({
    background: "#07132b",
    primary: "#155bff",
    secondary: "#d946ef"
  }),
  opaverse: Object.freeze({
    subtitle: "Beep-sleep rebellion",
    summary: "Bot accusations flip into freedom, sass, Eurovision references, and release.",
    featuredLine: "I’m not your bot. You missed your shot.",
    animationPreset: "hallucination"
  }),
  lyrics: ``,
  developmentNotes: `The final lyrics file was not included with the uploaded song files.

Known draft excerpt:

Beep beep beep beep people say you treat me like a bot
I'm a bot I'm a bot beep beep
I'm not your bot
You missed your shot
I'm golden joy yeah
You dum dum boy doy
Now I'm loud I shoosh
You're outta birds in hand or bush

Set me free, don't let me down, let me be
I leap from the deep — clean sweep
Quit weep — you reap what you cheap
So count sheep`,
  share: Object.freeze({
    title: "Not Your Bot — Beep Sleep",
    text: null,
    url: null
  })
});
