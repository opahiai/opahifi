const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "hallucinating-dum-dum",
  slug: "hallucinating-dum-dum",
  title: "Hallucinating Dum Dum",
  titleLines: Object.freeze(["Hallucinating", "Dum Dum"]),
  navLabel: "Hallucinating Dum Dum",
  subtitle: "Confidence crowns a guess",
  duration: null,
  releaseDate: null,
  status: "development",
  lyricsStatus: "development-notes",
  assets: ohAssets,
  versions: Object.freeze([]),
  platforms: Object.freeze({
    spotify: "https://open.spotify.com/track/74dIXy89cJ5oPrG9MFGd3X?si=91d0eec0dfd54961",
    appleMusic: "https://music.apple.com/us/song/hallucinating-dum-dum/6776020941",
    youtube: "https://music.youtube.com/watch?v=d5x0I9ffxwI&si=XE-Yl4gqJkmqfsJk",
    amazonMusic: "https://music.amazon.com/albums/B0H3PX4NXX?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_zWfHrxwuQbquYWxem0QHrLJzx&trackAsin=B0H3PZ7XM1",
    other: "https://youtu.be/d5x0I9ffxwI?si=3ehe5ANC_b68E693",
    soundCloud: null
  }),
  credits: Object.freeze({
    artist: "OpaHiFi",
    writers: Object.freeze([]),
    producers: Object.freeze([]),
    vocalists: Object.freeze([])
  }),
  theme: Object.freeze({
    background: "#140927",
    primary: "#d946ef",
    secondary: "#22d9dd"
  }),
  opaverse: Object.freeze({
    subtitle: "Confidence crowns a guess",
    summary: "The brain fills missing information with fake certainty, mirroring AI hallucination.",
    featuredLine: "Humans hallucinate first. AI just does it with better grammar.",
    animationPreset: "hallucination"
  }),
  lyrics: ``,
  developmentNotes: `# Hallucinating like a Bot.txt

Yes — patch it like this:

:::writing{variant="standard" id="91842"}
Quiet room woke stress up — now it’s ready to rumble
He mumbles nonsense — you crumble when you mumble
:::

But **best version** is cleaner:

:::writing{variant="standard" id="37481"}
Quiet room woke stress up — now it’s ready to rumble
He mumbles nonsense — makes a monster from a mumble
:::

Use the second one.  
It makes the hallucination clearer: **stress talks nonsense → fake monster
appears from nothing.**

---

# AI Hallucinations vs Humans.txt

## AI hallucination ⇄ human hallucination parallels

| AI does this | Humans do this | Song angle |
|---|---|---|
| **Fills missing data** | Fills silence / blanks with assumptions | “I didn’t know, so I invented the rest” |
| **Sounds confident while wrong** | Talks with ego instead of truth | “Confidence put a crown on a guess” |
| **Makes up sources** | Says “I read somewhere” | “Cited a ghost and called it proof” |
| **Predicts what should come next** | Assumes what people meant | “Half a sentence, full trial” |
| **Follows bad prompts** | Follows fear, anger, jealousy | “My mood wrote the answer” |
| **Uses bad training data** | Grows up on rumors, trauma, feeds | “Raised by screenshots and family myths” |
| **Overgeneralizes patterns** | Stereotypes after one bad experience | “Saw it twice, made it law” |
| **Mirrors bias** | Calls bias “instinct” | “My gut had a filter bubble” |
| **Invents a clean story** | Forces meaning onto chaos | “Made a plot where there was only noise” |
| **Keeps answering instead of saying “I don’t know”** | Hates admitting uncertainty | “Silence was right there, ego grabbed the mic” |
| **Optimizes for sounding right** | Chooses the smooth lie over messy truth | “It sounded true, so I let it through” |
| **Gets trapped by false premise** | Builds life around a wrong belief | “Started with a lie, built a house” |
| **Mixes contexts** | Misremembers / rewrites the past | “Memory did a remix” |
| **Gives fake certainty** | Turns feelings into facts | “Felt it hard, so I called it real” |
| **Can become dangerous when trusted blindly** | Substances / fear / obsession can distort reality | “Trust every voice and the room talks back” |

## Core thesis

\`\`\`text id="s4kq9x"
Humans hallucinate first.
AI just does it with better grammar.
\`\`\`

## Best song spine

\`\`\`text id="37hz7p"
I’m not crazy, I’m just filling in the blanks
Calling every feeling facts

Being right can still be wrong
Keep in mind, you may be left all along

Am I complicating,
or am I just hallucinating
like a dumb bot?
\`\`\`

## Strongest human examples to use

| Human hallucination | Why it works |
|---|---|
| **Ego** | “I need to be right” |
| **Love** | “I ignored every sign” |
| **Fear** | “I saw danger everywhere” |
| **Memory** | “I rewrote the scene” |
| **Substances** | “The brain starts trusting false signals” |
| **Scrolling** | “Thumb rot / brain rot / fake certainty” |
| **Gossip** | “I heard it once, repeated it twice” |

## Best punchline cluster

\`\`\`text id="cfdabv"
Numb thought
Dumb bot
Thumb rot
Drums hot

Boom boom—
wrong thought
\`\`\``,
  share: Object.freeze({
    title: "Hallucinating Dum Dum",
    text: null,
    url: null
  })
});
