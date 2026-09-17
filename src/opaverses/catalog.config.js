export const OH_FEATURED_SONG = Object.freeze({
  id: "optimisms-cute",
  label: "LATEST RELEASE"
});

export const OH_SONG_SETTINGS = Object.freeze({
  "full-mindness": Object.freeze({
    enabled: true,
    related: Object.freeze(["optimisms-cute", "hallucinating-dum-dum", "believe-the-truth-fairy"])
  }),
  "hallucinating-dum-dum": Object.freeze({
    enabled: true,
    related: Object.freeze(["full-mindness", "optimisms-cute", "do-the-panicarena"])
  }),
  "yeah-lets-do-brunch": Object.freeze({
    enabled: true,
    related: Object.freeze(["old-love-story", "splenda-love-rabbit-hell", "opa-pa-pa-party"])
  }),
  "splenda-love-rabbit-hell": Object.freeze({
    enabled: true,
    related: Object.freeze(["old-love-story", "yeah-lets-do-brunch", "glittaa-phoenix"])
  }),
  "believe-the-truth-fairy": Object.freeze({
    enabled: true,
    related: Object.freeze(["full-mindness", "hallucinating-dum-dum", "optimisms-cute"])
  }),
  "old-love-story": Object.freeze({
    enabled: true,
    related: Object.freeze(["glittaa-phoenix", "splenda-love-rabbit-hell", "yeah-lets-do-brunch"])
  }),
  "glittaa-phoenix": Object.freeze({
    enabled: true,
    related: Object.freeze(["old-love-story", "wellwolf-howl-lehluya", "splenda-love-rabbit-hell"])
  }),
  "not-your-bot-beep-sleep": Object.freeze({
    enabled: true,
    related: Object.freeze(["do-the-panicarena", "optimisms-cute", "hallucinating-dum-dum"])
  }),
  "do-the-panicarena": Object.freeze({
    enabled: true,
    related: Object.freeze(["not-your-bot-beep-sleep", "wellwolf-howl-lehluya", "hallucinating-dum-dum"])
  }),
  "wellwolf-howl-lehluya": Object.freeze({
    enabled: true,
    related: Object.freeze(["do-the-panicarena", "glittaa-phoenix", "opa-pa-pa-party"])
  }),
  "opa-pa-pa-party": Object.freeze({
    enabled: true,
    related: Object.freeze(["yeah-lets-do-brunch", "wellwolf-howl-lehluya", "do-the-panicarena"])
  }),
  "optimisms-cute": Object.freeze({
    enabled: true,
    related: Object.freeze(["hallucinating-dum-dum", "not-your-bot-beep-sleep", "full-mindness"])
  })
});
