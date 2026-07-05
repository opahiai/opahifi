export const ohHallucinatingLikeABotModule = Object.freeze({
  data: {
    id: "hallucinating-like-a-bot",
    number: "02",
    title: "Hallucinating Like a Bot",
    navLabel: "Hallucinating",
    subtitle: "Confidence crowns a guess",
    summary: "The mind fills missing data, mistakes feelings for facts, and keeps answering instead of saying I don’t know.",
    featuredLine: "He mumbles nonsense — makes a monster from a mumble.",
    duration: "TBD",
    versions: ["Original"],
    assets: {
      cover: "./assets/images/hallucinating-like-a-bot.webp",
      audio: "./assets/audio/hallucinating-like-a-bot.mp3"
    },
    platforms: {},
    theme: {
      background: "#160820",
      primary: "#d946ef",
      secondary: "#155bff"
    }
  },
  animation: {
    preset: "hallucination"
  },
  render() {
    return `
      <section
        class="oh-opaverse"
        id="oh-opaverse-${this.data.id}"
        data-oh-opaverse
        data-oh-preset="${this.animation.preset}"
        style="--oh-scene-bg:${this.data.theme.background};--oh-scene-primary:${this.data.theme.primary};--oh-scene-secondary:${this.data.theme.secondary}"
      >
        <div class="oh-opaverse__stage">
          <div class="oh-opaverse__ambient" aria-hidden="true"></div>
          <div class="oh-opaverse__visual oh-opaverse__visual--split" data-oh-scene-visual aria-hidden="true">
            <span>?</span>
          </div>
          <div class="oh-shell oh-opaverse__content">
            <p class="oh-opaverse__number">Opaverse ${this.data.number}</p>
            <h3 class="oh-opaverse__title" data-oh-scene-title>${this.data.title}</h3>
            <div class="oh-opaverse__accent" data-oh-scene-accent></div>
            <p class="oh-opaverse__copy" data-oh-scene-copy>${this.data.summary}</p>
            <blockquote class="oh-opaverse__quote" data-oh-scene-quote>${this.data.featuredLine}</blockquote>
            <div class="oh-opaverse__meta"><span>${this.data.duration}</span><span>${this.data.versions.length} version</span></div>
          </div>
        </div>
      </section>
    `;
  }
});
