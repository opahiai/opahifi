const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "yeah-lets-do-brunch",
  slug: "yeah-lets-do-brunch",
  title: "Yeah, Let’s Do Brunch",
  titleLines: Object.freeze(["Yeah, Let's", "Do Brunch"]),
  navLabel: "Let’s Do Brunch",
  subtitle: "So sad we lost touch",
  duration: null,
  releaseDate: null,
  status: "development",
  lyricsStatus: "source-provided",
  assets: ohAssets,
  versions: Object.freeze([]),
  platforms: Object.freeze({
    spotify: "https://open.spotify.com/track/10pJOBA2Krl8QiAi7XUGE7?si=66f1ed7937454034",
    appleMusic: "https://music.apple.com/us/album/lets-do-brunch-single/1883970912",
    youtube: "https://music.youtube.com/watch?v=nlRw2m9_Qh4&si=G1BKK_61Wf_EIast",
    amazonMusic: "https://music.amazon.com/albums/B0GS2JC8QD?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_CGFq3eGi1CLBa46vBJBJNB3oc&trackAsin=B0GS23XMP6",
    other: "https://youtu.be/nlRw2m9_Qh4?si=Xe-ZF1Ogg2ynabpj",
    soundCloud: null
  }),
  credits: Object.freeze({
    artist: "OpaHiFi",
    writers: Object.freeze([]),
    producers: Object.freeze([]),
    vocalists: Object.freeze([])
  }),
  theme: Object.freeze({
    background: "#241018",
    primary: "#ff6a00",
    secondary: "#d946ef"
  }),
  opaverse: Object.freeze({
    subtitle: "So sad we lost touch",
    summary: "Fake warmth and fake friendship collapse into excuses, ghosting, and no follow-through.",
    featuredLine: "Hit me up or I hit you whenever.",
    animationPreset: "avoidance"
  }),
  lyrics: `I was so worried about you
Just didn't want to bug
I swear it's true boo boo
Can't wait to give you a hug

I'm here if you need me
Don't you ever hesitate to call
Unless it's weekday or a holiday
Or a weekend or at all

Yeah let's do brunch
So sad we lost touch
I miss you so so much
I just need to finish my memoir
You don’t even finish your texts

My plate's full up to here
Tried to DM didn't go through damn
Let's play pencil in by ear
Catch up tomorrow tentative AM

Saw your story liked it twice
How's your fam hope you're doing well
I'll call you later or next week
Or next year or in hell

Yeah let's do brunch
So sad we lost touch
I miss you so so much
Meet after my cousin’s quinceañera
Your cousin is eleven and a boy

I'll be there for you
Unless rain starts to fall
Never gonna give you up
Never say never lol
Every breath you take
Do you believe yourself

Hit me up or I hit you whenever
Anything you need sure whatever
But please don't be a stranger
What's your name again

Yeah let's do brunch brunch brunch
So sad we lost touch touch touch
I miss you so so much much much
Link after my Paris trip
You have a travel ban not a passport
Why do you know everything`,
  developmentNotes: ``,
  share: Object.freeze({
    title: "Yeah, Let’s Do Brunch",
    text: null,
    url: null
  })
});
