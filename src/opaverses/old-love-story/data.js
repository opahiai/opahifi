const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "old-love-story",
  slug: "old-love-story",
  title: "Old Love Story",
  navLabel: "Old Love Story",
  subtitle: "Bring back the beat",
  duration: null,
  releaseDate: null,
  status: "development",
  lyricsStatus: "source-provided",
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
    background: "#201014",
    primary: "#ff6a00",
    secondary: "#ffd166"
  }),
  opaverse: Object.freeze({
    subtitle: "Bring back the beat",
    summary: "A look back at slower, messier, more human romance before disposable swipe-fast connection.",
    featuredLine: "More moonlight dance, less bot-romance.",
    animationPreset: "avoidance"
  }),
  lyrics: `Back then, you'd meet at the store,
Same town, street, building, or next door.
You'd wait phone-bound, wired to the wall,
For stood-up dates, landlines took fall.

New flakes need no reason at all,
They're home TikTok screening your call.
Swipe left, left, left, swiped right checkmate.
Roomba knock-off is your date.

We want more "Hi", less quick pic texts
More summer lovin', less winter mess.
More moonlight dance, less bot-romance!

Old love story, are you dead?
Now we cherish what we had.
When love was a full baseball game.
Not start home run, then ask for name.
Oh love story, make us feel real.
Not deep-fake love, not faking feel.
Break hearts, mend, ignite and repeat.
Rhythm of love — bring back the beat.
(beat beat beat beat)

Old love, that stomach butterfly,
Time dragged apart, then blinked close by.
You'd ask for a name, then a dance,
Years passed, one hand — oh sweet romance.

New fast food love —  wham bam thanks bye.
"My cat — cry face" — sell fishy lie.
Promiscuous prox-imity apps,
Replacing love with swiping traps.

More dirty dance, less rat race.
More Patrick Swayze, less ghost-chase!
More dance lifts, less falls from grace!

Old love story, are you dead?
Now we cherish what we had.
When love was a full baseball game.
Not start home run, then ask for name.
Oh love story, make us feel real.
Not deep-fake love, not faking feel.
Break hearts, mend, ignite and repeat.
Rhythm of love —  bring back the beeeeeeeat.

Ghosting had charm unlike today,
Swayze-back-hug spinning wet clay.
Arms spread on deck—before jack drawn
My heart'll go on yelled Miss Dion
Must’ve been love with a Roxette track,
Call-girl Roberts, still no big mistake.
Brokeback Mountain — one tent and hay!
Or fifty shady play, called gray 
Whitney sang to her body boo,
And I… I-I-I-I-I will… Always love… youuuuu

Old love story take us way back
Before junk feed turned love to snack
Real love story with flaws and soul,
No bot can fake you — steal your role.
Warm love story, melt hearts forlorn,
Netflix-chill without you — just popcorn.
Old love story — none can compete
Please come back — our heart needs your beat.`,
  developmentNotes: ``,
  share: Object.freeze({
    title: "Old Love Story",
    text: null,
    url: null
  })
});
