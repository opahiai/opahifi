export class FeaturedAudioPlayer {
  constructor({
    src,
    title,
    actionPrefix = "featured-audio"
  }) {
    this.src = src;
    this.title = title;
    this.actionPrefix = actionPrefix;
    this.audio = null;
    this.isMuted = false;
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  mount() {
    if (this.audio) return;

    this.audio = new Audio(this.src);
    this.audio.preload = "metadata";
    this.audio.addEventListener("play", this.handleStateChange);
    this.audio.addEventListener("pause", this.handleStateChange);
    this.audio.addEventListener("ended", this.handleStateChange);
  }

  renderControls() {
    return `
      <div class="ohg-featured-audio" aria-label="${this.title} audio controls">
        <button
          class="ohg-featured-audio__button"
          type="button"
          data-ohg-action="${this.actionPrefix}-toggle"
          aria-label="Play ${this.title}"
        >
          <i class="fa-solid fa-play" aria-hidden="true"></i>
        </button>
        <button
          class="ohg-featured-audio__button"
          type="button"
          data-ohg-action="${this.actionPrefix}-restart"
          aria-label="Restart ${this.title}"
        >
          <i class="fa-solid fa-backward-step" aria-hidden="true"></i>
        </button>
        <button
          class="ohg-featured-audio__button"
          type="button"
          data-ohg-action="${this.actionPrefix}-mute"
          aria-label="Mute ${this.title}"
        >
          <i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }

  getActionHandlers() {
    return {
      [`${this.actionPrefix}-toggle`]: () => this.toggle(),
      [`${this.actionPrefix}-restart`]: () => this.restart(),
      [`${this.actionPrefix}-mute`]: () => this.toggleMute()
    };
  }

  async toggle() {
    if (!this.audio) return;

    if (this.audio.paused) {
      try {
        await this.audio.play();
      } catch {
        this.handleStateChange();
      }
      return;
    }

    this.audio.pause();
  }

  async restart() {
    if (!this.audio) return;

    this.audio.currentTime = 0;
    try {
      await this.audio.play();
    } catch {
      this.handleStateChange();
    }
  }

  toggleMute() {
    if (!this.audio) return;

    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.handleStateChange();
  }

  handleStateChange() {
    const playButton = document.querySelector(`[data-ohg-action="${this.actionPrefix}-toggle"]`);
    const muteButton = document.querySelector(`[data-ohg-action="${this.actionPrefix}-mute"]`);

    if (playButton) {
      const isPlaying = Boolean(this.audio && !this.audio.paused);
      playButton.classList.toggle("is-active", isPlaying);
      playButton.setAttribute("aria-label", isPlaying ? `Pause ${this.title}` : `Play ${this.title}`);
      playButton.innerHTML = `<i class="fa-solid fa-${isPlaying ? "pause" : "play"}" aria-hidden="true"></i>`;
    }

    if (muteButton) {
      muteButton.classList.toggle("is-active", this.isMuted);
      muteButton.setAttribute("aria-label", this.isMuted ? `Unmute ${this.title}` : `Mute ${this.title}`);
      muteButton.innerHTML = `<i class="fa-solid fa-${this.isMuted ? "volume-high" : "volume-xmark"}" aria-hidden="true"></i>`;
    }
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
