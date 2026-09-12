export class FeaturedAudioPlayer {
  constructor({
    src,
    title,
    actionPrefix = "featured-audio",
    onBeforePlay = null,
    onStateChange = null
  }) {
    this.src = src;
    this.title = title;
    this.actionPrefix = actionPrefix;
    this.onBeforePlay = onBeforePlay;
    this.onStateChange = onStateChange;
    this.audio = null;
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  mount() {
    if (this.audio && this.audio.src === this.src) return;
    this.setSource(this.src, this.title);
  }

  setSource(src, title = this.title) {
    if (!src) return;

    const nextSource = String(src);
    const wasPlaying = Boolean(this.audio && !this.audio.paused);

    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener("play", this.handleStateChange);
      this.audio.removeEventListener("pause", this.handleStateChange);
      this.audio.removeEventListener("ended", this.handleStateChange);
      this.audio = null;
    }

    this.src = nextSource;
    this.title = title;
    this.audio = new Audio(this.src);
    this.audio.preload = "metadata";
    this.audio.addEventListener("play", this.handleStateChange);
    this.audio.addEventListener("pause", this.handleStateChange);
    this.audio.addEventListener("ended", this.handleStateChange);

    if (wasPlaying) {
      this.audio.play().catch(() => this.handleStateChange());
    }
  }

  renderControls() {
    return `
      <div class="ohg-featured-audio">
        <button
          class="ohg-audio-button"
          type="button"
          data-ohg-action="${this.actionPrefix}-toggle"
          aria-label="Play ${this.title}"
        >
          <i class="fa-solid fa-play" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }

  getActionHandlers() {
    return {
      [`${this.actionPrefix}-toggle`]: () => this.toggle()
    };
  }

  async toggle() {
    if (!this.audio) return;

    if (this.audio.paused) {
      try {
        await this.onBeforePlay?.(this);
        await this.audio.play();
      } catch {
        this.handleStateChange();
      }
      return;
    }

    this.audio.pause();
  }

  isPlaying() {
    return Boolean(this.audio && !this.audio.paused);
  }

  getMediaElement() {
    return this.audio;
  }

  handleStateChange() {
    const playButton = document.querySelector(`[data-ohg-action="${this.actionPrefix}-toggle"]`);

    if (playButton) {
      const isPlaying = Boolean(this.audio && !this.audio.paused);
      playButton.classList.toggle("is-active", isPlaying);
      playButton.setAttribute("aria-label", isPlaying ? `Pause ${this.title}` : `Play ${this.title}`);
      playButton.innerHTML = `<i class="fa-solid fa-${isPlaying ? "pause" : "play"}" aria-hidden="true"></i>`;
    }

    this.onStateChange?.(this);
  }

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.handleStateChange();
  }

  destroy() {
    if (!this.audio) return;

    this.audio.pause();
    this.audio.removeEventListener("play", this.handleStateChange);
    this.audio.removeEventListener("pause", this.handleStateChange);
    this.audio.removeEventListener("ended", this.handleStateChange);
    this.audio = null;
  }
}
