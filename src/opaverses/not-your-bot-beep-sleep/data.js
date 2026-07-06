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
  duration: null,
  releaseDate: null,
  status: "development",
  lyricsStatus: "partial-draft",
  assets: ohAssets,
  versions: Object.freeze([]),
  platforms: Object.freeze({
    spotify: null,
    appleMusic: null,
    youtube: null,
    soundCloud: null
  }),
  credits: Object.freeze({
    artist: "OpaHiFi",
    writers: Object.freeze([]),
    producers: Object.freeze([]),
    vocalists: Object.freeze([])
  }),
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
