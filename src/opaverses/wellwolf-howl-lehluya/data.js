const ohAssets = Object.freeze({
  cover: new URL("./assets/cover.webp", import.meta.url).href,
  art: new URL("./assets/art.webp", import.meta.url).href,
  master: new URL("./assets/master.png", import.meta.url).href
});

export const ohSongData = Object.freeze({
  id: "wellwolf-howl-lehluya",
  slug: "wellwolf-howl-lehluya",
  title: "Wellwolf Howl-Leh-Lu-Ya",
  titleLines: Object.freeze(["Wellwolf", "Howl-Lehluya"]),
  navLabel: "Wellwolf",
  subtitle: "Kindness is the power move",
  duration: "3:34",
  releaseDate: null,
  status: "development",
  lyricsStatus: "source-provided",
  assets: ohAssets,
  versions: Object.freeze([
    Object.freeze({
      id: "original",
      slug: "original",
      name: "Original",
      duration: "3:34",
      default: true,
      cover: ohAssets.cover,
      art: ohAssets.art,
      platforms: Object.freeze({
        spotify: "https://open.spotify.com/track/4OHlXoJFuPhfm4plY7Coop?si=86049caec0384f95",
        appleMusic: "https://music.apple.com/us/album/wellwolf-howl-lehluya-single/1894120765",
        youtube: "https://music.youtube.com/playlist?list=OLAK5uy_k3iThKSj0H5nDqf-dpU5EMM-ccRcglZaY&si=d2V3JFEBlqkSJi55",
        amazonMusic: "https://music.amazon.com/tracks/B0GXHSFW83?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_YaZDAKqp0vQwgwM7y8yENc9Zw",
        other: "https://youtu.be/bjecZnXbXBc?si=Llwj6s7pyO2fRMmY"
      })
    })
  ]),
  theme: Object.freeze({
    background: "#081a18",
    primary: "#22d9dd",
    secondary: "#ffd166"
  }),
  opaverse: Object.freeze({
    subtitle: "Kindness is the power move",
    summary: "The monster is redefined through kindness, restraint, and refusing to become the predator.",
    featuredLine: "Bite with kindness, not to hurt.",
    animationPreset: "pressure"
  }),
  lyrics: `Howl-leh-lu-ya

Everyone’s wearing wolf couture
Though some are sheep in a fur suit self-sure
Lone-wolf of Wall Street on the alpha tour
Good wolf stays Loo-pihn-from-the-block

La luna è piena la notte è chiara
Il lupo buono accende le stelle

Moonlight strikes
Is it a curse or a spell
Keep your silver bullets
Wellwolf’s heaven not hell

Wellwolf no bloodlust no fame thirst
Run on love not to be first
Bite with kindness not to hurt
Beat with heart not for sport

Howl-leh-lu-ya
Howl-leh-lu-ya

Lost wolves follow a North Star long gone south
Claw their way up the ruthless route
A losing-game hunt wears Armani wolf out
Good wolf screams Opa and starts a dance circle

La luna è piena la notte è chiara
Il lupo buono accende le stelle

Moonlight strikes
Is it a curse or a spell
Keep your silver bullets
Wellwolf’s heaven not hell

Wellwolf no bloodlust no fame thirst
Run on love not to be first
Bite with kindness not to hurt
Beat with heart not for sport

Howl-leh-lu-ya

Mix wolf with ego get a bloody mess
Mix with care there you go Michelin finesse
One’s bringin pack-sy back one tears you to filth
Good werewolf’s too boring for the myth

Wellwolf no bloodlust no fame thirst hey
Run on love not to be first not to be first
Bite with kindness not to hurt not to hurt
Beat with heart not for sport

Howl if your diet's grandma-free
And you let them piggies be
Howl-leh-lu-ya
Howl if you don’t make boys cry
Or doors-lurkin on standby
Howl-leh-lu-ya
Howl if you leave Peh-ter stuck with his duck
Howl-leh-lu-ya
Howl-leh-lu-ya`,
  developmentNotes: ``,
  share: Object.freeze({
    title: "Wellwolf Howl-Leh-Lu-Ya",
    text: null,
    url: null
  })
});
