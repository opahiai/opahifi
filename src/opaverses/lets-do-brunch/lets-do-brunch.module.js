export const ohLetsDoBrunchModule = Object.freeze({
  data: {
    id: "lets-do-brunch",
    number: "03",
    title: "Yeah, Let’s Do Brunch",
    navLabel: "Brunch",
    subtitle: "Warm words. Zero follow-through.",
    summary: "Fake closeness collapses into excuses, ghosting, and plans that were never meant to happen.",
    featuredLine: "I’m here if you need me — unless it’s weekday, holiday, weekend, or at all.",
    duration: "TBD",
    versions: ["Original"],
    assets: {
      cover: "./assets/images/lets-do-brunch.webp",
      audio: "./assets/audio/lets-do-brunch.mp3"
    },
    platforms: {},
    theme: {
      background: "#231109",
      primary: "#ff6a00",
      secondary: "#ffd166"
    }
  },
  animation: {
    preset: "avoidance"
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
          <div class="oh-opaverse__visual oh-opaverse__visual--ring" data-oh-scene-visual aria-hidden="true">
            <span>03</span>
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
