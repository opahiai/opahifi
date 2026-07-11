class OhSongovisionPlayer {
  constructor() {
    this.player = null;
    this.iframe = null;
    this.openButtons = [];
    this.closeButton = null;
    this.lastFocusedElement = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  mount() {
    this.player = document.querySelector("[data-oh-video-player]");
    this.iframe = document.querySelector("[data-oh-video-iframe]");
    this.openButtons = [...document.querySelectorAll("[data-oh-video-open]")];
    this.closeButton = document.querySelector("[data-oh-video-close]");

    if (!this.player || !this.iframe || this.openButtons.length === 0) return;

    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleClick(event) {
    const openButton = event.target.closest("[data-oh-video-open]");
    if (openButton) {
      this.open(openButton);
      return;
    }

    if (event.target.closest("[data-oh-video-close]")) {
      this.close();
      return;
    }

    if (event.target === this.player) this.close();
  }

  handleKeydown(event) {
    if (event.key === "Escape" && this.player?.classList.contains("is-open")) this.close();
  }

  open(button) {
    const listId = button.dataset.ohVideoList;
    const title = button.dataset.ohVideoTitle || "OpaHiFi video";
    if (!listId) return;

    this.lastFocusedElement = document.activeElement;
    this.iframe.title = title;
    this.iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(listId)}&autoplay=1`;
    this.player.classList.add("is-open");
    this.player.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-video-open");
    this.closeButton?.focus();
  }

  close() {
    this.player.classList.remove("is-open");
    this.player.setAttribute("aria-hidden", "true");
    this.iframe.removeAttribute("src");
    document.body.classList.remove("is-video-open");

    if (this.lastFocusedElement instanceof HTMLElement) {
      this.lastFocusedElement.focus({ preventScroll: true });
    }
  }
}

export const ohSongovisionPlayer = new OhSongovisionPlayer();
