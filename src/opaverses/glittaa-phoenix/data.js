const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

const ohVersionAssets = Object.freeze({
  sunriseMaxMix: new URL("../../../img/music/versions/version-glittaaphoenix-sunrisemaxmix.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "glittaa-phoenix",
  slug: "glittaa-phoenix",
  title: "GLITTAA Phoenix",
  titleLines: Object.freeze(["Glittaa", "Phoenix"]),
  navLabel: "GLITTAA Phoenix",
  subtitle: "Reborn in rhythm and glitter",
  duration: null,
  releaseDate: null,
  status: "development",
  lyricsStatus: "source-provided",
  assets: ohAssets,
  versions: Object.freeze([
    Object.freeze({
      id: "original",
      slug: "original",
      name: "Original",
      default: true,
      platforms: Object.freeze({
        spotify: "https://open.spotify.com/track/7d6kFt6vOlkTPIn4gqozy6",
        appleMusic: "https://music.apple.com/us/album/glittaa-phoenix-single/1853214791",
        youtube: "https://music.youtube.com/watch?v=4Enfe7y6RVo&si=gjMhajy0cR3VPQ17",
        amazonMusic: "https://music.amazon.com/albums/B0G1N1Y83C",
        other: "https://youtu.be/4Enfe7y6RVo?si=s1UpWS4WCZy6XujX",
        soundCloud: null
      })
    }),
    Object.freeze({
      id: "opa-sunrize-max-mix",
      slug: "opa-sunrize-max-mix",
      name: "Opa Sunrize Max Mix",
      cover: ohVersionAssets.sunriseMaxMix,
      art: ohVersionAssets.sunriseMaxMix,
      platforms: Object.freeze({
        spotify: "https://open.spotify.com/artist/1WD2qPlo13H0gWENdreAsP",
        appleMusic: "https://music.apple.com/us/album/glittaa-phoenix-opa-sunrise-max-mix-single/1868781659",
        youtube: "https://music.youtube.com/watch?v=LOywm64SGCY&si=iWf3mTJqF7wzVBwP",
        amazonMusic: "https://music.amazon.com/tracks/B0GGHZ6L2F",
        other: "https://www.youtube.com/watch?v=LOywm64SGCY",
        soundCloud: null
      })
    })
  ]),
  platforms: Object.freeze({
    spotify: "https://open.spotify.com/track/7d6kFt6vOlkTPIn4gqozy6",
    appleMusic: "https://music.apple.com/us/album/glittaa-phoenix-single/1853214791",
    youtube: "https://music.youtube.com/watch?v=4Enfe7y6RVo&si=gjMhajy0cR3VPQ17",
    amazonMusic: "https://music.amazon.com/albums/B0G1N1Y83C",
    other: "https://youtu.be/4Enfe7y6RVo?si=s1UpWS4WCZy6XujX",
    soundCloud: null
  }),
  credits: Object.freeze({
    artist: "OpaHiFi",
    writers: Object.freeze([]),
    producers: Object.freeze([]),
    vocalists: Object.freeze([])
  }),
  theme: Object.freeze({
    background: "#210b17",
    primary: "#ff3b2f",
    secondary: "#ffd166"
  }),
  opaverse: Object.freeze({
    subtitle: "Reborn in rhythm and glitter",
    summary: "Destruction turns into rebirth; pain becomes glitter, rhythm, fire, and dance.",
    featuredLine: "Tried to end me. You failed. Let’s dance.",
    animationPreset: "pressure"
  }),
  lyrics: `Tried to end me. 
You failed. 
Let’s dance. 
¡GLITTAA!

You destroyed me, then broke, then ground, then burned. 
From ashes — a glitter-phoenix reborn. 
Not with bitter flames — my fire burns thicker. 
Hurricane, Cat-5 — of rhythm and glitter.

Me rompiste, quemaste, borraste mi ser. 
Del polvo regreso — renazco con poder. 
No con llamas amargas, mi fuego grita, 
Huracán Cat-5 — de ritmo y glitta.

You hit hard — no sound — now my fuego flips the beat
Legs chained to ground — firebirds don't need no feet
Throne game, no shame — boom! GLITTAA-bomb outplay
Came for my name — caught my flame; burn away, burn away

No more tears. Just rhythm. 
Let’s dance through the ashes of love. 
¡GLITTAA!

You cloned my voice — and still couldn’t win. 
Tried to remix my hurt, but I danced through your sin. 
You swayed for control — played me on repeat. 
Now your spotlight is out — and I own the beat.

Tus mentiras suenan como pistas viejas. 
Ni remix, ni alma, ni letras complejas. 
Creíste que brillabas — eras puro cartón. 
Yo traigo ritmo, tú ya sin canción.

You hit hard — no sound — now my fuego flips the beat
Legs chained to ground — firebirds don't need no feet
Throne game, no shame boom! GLITTAA bomb outplay
Came for my name — caught my flame; burn away, burn away

Let’s dance through the ashes of love. 
¡GLITTAA!`,
  developmentNotes: ``,
  share: Object.freeze({
    title: "GLITTAA Phoenix",
    text: null,
    url: null
  })
});
