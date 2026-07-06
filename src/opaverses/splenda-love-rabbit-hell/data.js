const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

const ohVersionAssets = Object.freeze({
  maxMix: new URL("../../../img/music/versions/version-splendaloverabbithell-maxmix.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "splenda-love-rabbit-hell",
  slug: "splenda-love-rabbit-hell",
  title: "Splenda Love Rabbit Hell",
  titleLines: Object.freeze(["Splenda Love", "Rabbit Hell"]),
  navLabel: "Splenda Love",
  subtitle: "Artificial sweetness",
  duration: null,
  releaseDate: null,
  status: "development",
  lyricsStatus: "source-provided",
  assets: ohAssets,
  versions: Object.freeze([
    Object.freeze({
      id: "opa-max-mix",
      slug: "opa-max-mix",
      name: "Opa Max Mix",
      duration: "4:00",
      default: true,
      cover: ohVersionAssets.maxMix,
      art: ohVersionAssets.maxMix,
      stripeColors: Object.freeze(["#60c6e6", "#5c14b5"]),
      platforms: Object.freeze({
        spotify: "https://open.spotify.com/track/0yILa8PArNyh1CJlfq5s2n?si=901f3fbf46fa4842",
        appleMusic: "https://music.apple.com/us/song/splenda-love-rabbit-hell-opa-max-mix/1872205650",
        youtube: "https://music.youtube.com/watch?v=NR3Wcb439DI&si=p0Vz4FfM4yGb8EVE",
        amazonMusic: "https://music.amazon.com/albums/B0GJQZXHNL",
        other: "https://youtu.be/NR3Wcb439DI?si=lXoiHaUDbYfOH40F",
        soundCloud: null
      })
    })
  ]),
  platforms: Object.freeze({
    spotify: "https://open.spotify.com/track/0yILa8PArNyh1CJlfq5s2n?si=901f3fbf46fa4842",
    appleMusic: "https://music.apple.com/us/song/splenda-love-rabbit-hell-opa-max-mix/1872205650",
    youtube: "https://music.youtube.com/watch?v=NR3Wcb439DI&si=p0Vz4FfM4yGb8EVE",
    amazonMusic: "https://music.amazon.com/albums/B0GJQZXHNL",
    other: "https://youtu.be/NR3Wcb439DI?si=lXoiHaUDbYfOH40F",
    soundCloud: null
  }),
  credits: Object.freeze({
    artist: "OpaHiFi",
    writers: Object.freeze([]),
    producers: Object.freeze([]),
    vocalists: Object.freeze([])
  }),
  theme: Object.freeze({
    background: "#200b22",
    primary: "#ff3b2f",
    secondary: "#d946ef"
  }),
  opaverse: Object.freeze({
    subtitle: "Artificial sweetness",
    summary: "Fake love tastes sweet for one second and turns into emotional self-sabotage.",
    featuredLine: "This love is fake—this love is Splenda.",
    animationPreset: "hallucination"
  }),
  lyrics: `Da da da da da da da da

Sweet in disguise, I buy lies I’m sellin’
Regret rise—not wise—my gut's rebelling
Packed with compromise to serve my agenda
This love is fake—this love is Splenda (da da da)

Da da da da da da da da

Your velvet skin makes me flush—sugar rush
Addicted to your sin, I lean into the crush
Are you for real? What you’re doing to my heart
I know it’s artificial—bad choices are my art

I play pretend again—self-convincin’ is my sport
I know it’s coming, but not when, the bitter slap’s gonna hurt

Sweet in disguise, I buy lies I’m sellin’
Regret rise—not wise—my gut’s rebelling
Packed with compromise to serve my agenda
This love is fake—this love is Splenda (da da da)

Da da da da da da da da

You're so kind—rare find—you're designed to please
Am I blind—what signs?—my body's ill at ease
Deadlock, damn block—are you a knock-off trick?
Is it you or my bio clock makin’ me tick (tick tick tick)

I take another sip, I know it's gonna suck
One second on the lip, my stomach says good luck

Sweet in disguise, I buy lies I’m sellin’
Regret rise—not wise—my gut’s rebelling
Packed with compromise to serve my agenda
This love is fake—this love is Splenda (da da da)

Da da da da da da da da

Here I fall — damn hole, new tale, same spell
I’ve seen it all, I know it way too well
Spin and twirl, locked in my cell
On paper I’m whole, but lone as I can tell
Buckle up, soul — again I roll to rabbit hell

Da da da da da da da da
Rabbit hell, rabbit hell — da da da da da da da da
Keep rolling and spinning and tripping and fooling and falling and…
Keep rolling and spinning and tripping and fooling and falling and…
Rabbit hell, rabbit hell — da da da da da da da da
Keep rolling and spinning and tripping and fooling and falling and…

Da da da da da da
Don't want anotha Splenda da da love,
Done with this dumb rabbit hellllll
I got myself to love, this love could never fail
Da da da da da da da`,
  developmentNotes: ``,
  share: Object.freeze({
    title: "Splenda Love Rabbit Hell",
    text: null,
    url: null
  })
});
