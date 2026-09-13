const ohAssets = Object.freeze({
    cover: new URL("./assets/cover.webp", import.meta.url).href,
    art: new URL("./assets/art.webp", import.meta.url).href,
    master: new URL("./assets/master.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
    id: "optimisms-cute",
    slug: "optimisms-cute",
    title: "Optimism's Cute",
    titleLines: Object.freeze(["Optimism's", "Cute"]),
    navLabel: "Optimism's Cute",
    subtitle: "Latest release",
    badge: "Latest release",
    duration: "3:21",
    releaseDate: null,
    status: "development",
    lyricsStatus: "source-provided",
    assets: ohAssets,
    versions: Object.freeze([
        Object.freeze({
            id: "original",
            slug: "original",
            name: "Original",
            duration: "3:21",
            default: true,
            cover: ohAssets.cover,
            art: ohAssets.art,
            audioSrc: new URL("../../../audio/optimisim-optimizmo-preview.m4a", import.meta.url).href,
            platforms: Object.freeze({
                spotify: "https://open.spotify.com/track/14YhDhLgNTzGtLryY86LBM?si=042472492ceb43e6",
                appleMusic: "https://music.apple.com/us/song/optimisms-cute/6811533332",
                youtube: "https://music.youtube.com/watch?v=PiQ3yICJN9s&si=k8Mo4FWkxDOBO-K_",
                amazonMusic: "https://amazon.com/music/player/tracks/B0HJNHQ16M?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_PjqAkYyQqApUu5doIk7yg1rR0",
                other: "https://youtu.be/PiQ3yICJN9s?si=dpKdO8IJ_a0GtHpz"
            })
        })
    ]),
    theme: Object.freeze({
        background: "#071b26",
        primary: "#22d9dd",
        secondary: "#ffd166"
    }),
    opaverse: Object.freeze({
        subtitle: "Good vibes, bad timing",
        summary: "A sharp little anthem about positivity as branding, hope as delusion, and the danger of being told to grin through the wreckage.",
        featuredLine: "Optimism's cute — when it's not about you.",
        animationPreset: "pressure"
    }),
    lyrics: `Optimism, opt-low-blow
Optimism, opt-no-mo'

Everything happens for a reason
"For the best" turns into mental prison
Up on your feet, go get it, don't hesitate
Oh great — good things come to those who wait

Happiness inside — door locked, key's in, you're out
At the end of the tunnel — all you see is doubt
Sun will rise tomorrow — good for it, go, sun, go
No rainbow after rain — there's just a stupid bow

Optimism, opt-low-blow
Optimism, opt-no-mo'

Don't give me lemons — don't tell me what to do
Keep your life lessons — your bull's number two
Put your face on mute — and your pointless view
Optimism's cute — when it's not about you

Optimism, Optimismo
Toxic opti-gizmo
Way past pessi
Waymo? Limo

Keep your chin up — the best slap is yet to come
That too shall pass — the next'll leave your face numb
It all works out — didn't end you, made you strong
Do what's right for you — till you're left with wrong

Destination aside — it's about the ride
The universe's plan — trapping you inside
Endless flight — doors close, none open instead
Broken reading light — silver-lined storms ahead

Optimism, opt-low-blow
Optimism, opt-no-mo'

Don't give me lemons — don't tell me what to do
Keep your life lessons — your bull's number two
Put your face on mute — and your pointless view
Optimism's cute — when it's not about you

Optimism, Optimismo
Toxic opti-gizmo
Way past pessi
Waymo? Limo

Look on the bright side — go watch the sunrise
Keep blind eyes on the prize — dumbness in disguise
Here, glass half full — what's with the frown?
Good vibes got you flipped — now it's upside down

Expectations
Pillows
Fluff up
Let down

Don't give me lemons — don't tell me what to do
Keep your life lessons — your bull's number two
Put your face on mute — and your pointless view
Optimism's cute — when it's not about you

Optimism, Optimismo
Toxic opti-gizmo
Way past pessi
Waymo? Limo

You are you and your blissdom
It's not me — it's you-phemism
You're not mi-smo — no mo' wisdumb
Optimism — nonsensism`,
    developmentNotes: ``,
    share: Object.freeze({
        title: "Optimism's Cute",
        text: null,
        url: null
    })
});
