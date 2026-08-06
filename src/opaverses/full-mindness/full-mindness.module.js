export const ohFullMindnessModule = Object.freeze({
  data: {
    id: "full-mindness",
    number: "01",
    title: "Full-Mindness",
    navLabel: "Full-Mindness",
    subtitle: "Pressure becomes rhythm",
    summary: "Calm is not the goal. Survive the chaos fabulously.",
    featuredLine: "Pressure is the rhythm. Anxiety is the beat.",
    duration: "TBD",
    versions: ["Original"],
    assets: {
      cover: "./assets/images/full-mindness.webp",
      audio: "./assets/audio/full-mindness.mp3"
    },
    platforms: {},
    theme: {
      background: "#07152f",
      primary: "#22d9dd",
      secondary: "#5b2cff"
    }
  },
  animation: {
    preset: "pressure"
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
          <div class="oh-song-cover oh-opaverse__visual" data-oh-scene-visual aria-hidden="true">
            <span>${this.data.number}</span>
          </div>
          <div class="oh-shell oh-opaverse__content">
            <p class="oh-opaverse__number">Opaverse ${this.data.number}</p>
            <h3 class="oh-opaverse__title" data-oh-scene-title>${this.data.title}</h3>
            <div class="oh-opaverse__accent" data-oh-scene-accent></div>
            <p class="oh-opaverse__copy" data-oh-scene-copy>${this.data.summary}</p>
            <blockquote class="oh-opaverse__quote" data-oh-scene-quote>${this.data.featuredLine}</blockquote>
          </div>
        </div>
      </section>
    `;
  }
});
