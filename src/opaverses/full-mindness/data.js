const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

const ohVersionAssets = Object.freeze({
  mayhemMix: new URL("../../../img/music/versions/version-fullmindness-mayhemmix.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "full-mindness",
  slug: "full-mindness",
  title: "Full-Mindness",
  titleLines: Object.freeze(["Full-", "Mindness"]),
  navLabel: "Full-Mindness",
  subtitle: "Namastay in Mayhem",
  duration: null,
  releaseDate: null,
  status: "development",
  lyricsStatus: "source-provided",
  assets: ohAssets,
  versions: Object.freeze([
    Object.freeze({
      id: "opa-mayhem-mix",
      slug: "opa-mayhem-mix",
      name: "Opa Mayhem Mix",
      default: true,
      cover: ohVersionAssets.mayhemMix,
      art: ohVersionAssets.mayhemMix,
      platforms: Object.freeze({
        spotify: "https://open.spotify.com/track/6lp1u1WV8q0Aqfej1YeF8v?si=35f35519ca434960",
        appleMusic: "https://music.apple.com/ng/song/full-mindness-opa-mayhem-mix/1879704886",
        youtube: "https://music.youtube.com/watch?v=lE193jDewd4&si=D9lyKQ-KrLwWuZ0Z",
        amazonMusic: "https://music.amazon.com/albums/B0GPL4Q4R5?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_sac7n1RtCHUgR8GuzWLD1fZ7D&trackAsin=B0GPLBB653",
        other: "https://youtu.be/lE193jDewd4?si=YywLQUMDj7DPgCwh",
        soundCloud: null
      })
    })
  ]),
  platforms: Object.freeze({
    spotify: "https://open.spotify.com/track/6lp1u1WV8q0Aqfej1YeF8v?si=35f35519ca434960",
    appleMusic: "https://music.apple.com/ng/song/full-mindness-opa-mayhem-mix/1879704886",
    youtube: "https://music.youtube.com/watch?v=lE193jDewd4&si=D9lyKQ-KrLwWuZ0Z",
    amazonMusic: "https://music.amazon.com/albums/B0GPL4Q4R5?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_sac7n1RtCHUgR8GuzWLD1fZ7D&trackAsin=B0GPLBB653",
    other: "https://youtu.be/lE193jDewd4?si=YywLQUMDj7DPgCwh",
    soundCloud: null
  }),
  credits: Object.freeze({
    artist: "OpaHiFi",
    writers: Object.freeze([]),
    producers: Object.freeze([]),
    vocalists: Object.freeze([])
  }),
  theme: Object.freeze({
    background: "#07152f",
    primary: "#22d9dd",
    secondary: "#5b2cff"
  }),
  opaverse: Object.freeze({
    subtitle: "Namastay in Mayhem",
    summary: "Everyday chaos takes over. Calm is not the goal; surviving fabulously is.",
    featuredLine: "Pressure is the rhythm. Anxiety is the beat.",
    animationPreset: "pressure"
  }),
  lyrics: `Forget about a moment of release.
It’ll get better... with Full-mindness surrender.

Bills, bills, bills — they love to stack.
Spoons for days, but a knife you lack.
No WiFi, no signal, now that’s a delight.
Lost power, cold night — but hey — candlelight! 

Breathe in the chaos, exhale with flair. (Breathe)
You’re way out of control — but at least you're aware.
Life’s a spinning class — on a bike with no seat.
Don’t chase the calm—just keep movin’ your feet.
Breathe Breathe Breathe

Close your eyes — your thoughts wave hello. (Hiiieii)
They’re not clouds, they’re a storm.
They’re not seeking freedom — they’re moving in.
Accept them or not, they bought a karaoke machine.
Full-mindness is when you say: Fine. Chaos, whatever.

Breathe in the chaos, exhale with flair. (Breathe)
You’re way out of control — but not out of air.
Life’s a drivin' test — on repeat — down Elm Street.
Don’t chase the calm — be cute in the backseat.  
Breathe Breathe Breathe

Being present isn't simple, it's tense. (Ha!)
Are you Dumbledore — chanting for defense?
Embrace the noise, the now is gone. (now is gone.)
Floor is lava — keep dancing on. (and on and on )

Repeat after me:
Pressure… is the rhythm.
Anxiety… is the beat.

Breathe in the chaos, exhale with flair. (Breathe)
You’re way out of control — but act like you care.
Life’s a marathon — summer heat — shade’s obsolete.
Don’t chase the calm — meet the anthem of incomp—
Breathe Breathe Breathe

You’re doing… not great. But doing it fabulously.
You serve meltdown like it’s Prada.
Namastay… in Mayhem.`,
  developmentNotes: ``,
  share: Object.freeze({
    title: "Full-Mindness",
    text: null,
    url: null
  })
});
