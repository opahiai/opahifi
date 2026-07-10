class OhAboutCarousel {
  constructor() {
    this.root = null;
    this.track = null;
    this.bars = [];
    this.label = null;
    this.count = null;
    this.index = 0;
    this.touchStartX = 0;
    this.touchDeltaX = 0;
    this.isVisible = false;
    this.labels = [
      "About OpaHiFi",
      "Why it exists",
      "How it works",
      "Who is Opa?",
      "The point of view"
    ];

    this.handleKeydown = this.handleKeydown.bind(this);
  }

  mount() {
    this.root = document.querySelector("[data-opa-about-carousel]");
    if (!this.root) return;

    this.track = this.root.querySelector("[data-opa-about-track]");
    this.bars = [...this.root.querySelectorAll("[data-opa-about-bar]")];
    this.label = this.root.querySelector("[data-opa-about-label]");
    this.count = this.root.querySelector("[data-opa-about-count]");

    this.root.querySelector("[data-opa-about-prev]")?.addEventListener("click", () => this.go(-1));
    this.root.querySelector("[data-opa-about-next]")?.addEventListener("click", () => this.go(1));

    this.bars.forEach((bar, index) => {
      bar.addEventListener("click", () => {
        this.index = index;
        this.render();
      });
    });

    this.track?.addEventListener("touchstart", (event) => {
      this.touchStartX = event.touches[0].clientX;
      this.touchDeltaX = 0;
    }, { passive: true });

    this.track?.addEventListener("touchmove", (event) => {
      this.touchDeltaX = event.touches[0].clientX - this.touchStartX;
    }, { passive: true });

    this.track?.addEventListener("touchend", () => {
      if (Math.abs(this.touchDeltaX) < 45) return;
      this.go(this.touchDeltaX < 0 ? 1 : -1);
    });

    this.observeVisibility();
    document.addEventListener("keydown", this.handleKeydown);
    this.render();
  }

  observeVisibility() {
    if (!("IntersectionObserver" in window)) {
      this.isVisible = true;
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      this.isVisible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.55);
    }, { threshold: [0, 0.55, 1] });

    observer.observe(this.root);
  }

  handleKeydown(event) {
    if (!this.isVisible) return;
    if (event.key === "ArrowLeft") this.go(-1);
    if (event.key === "ArrowRight") this.go(1);
  }

  go(step) {
    this.index = (this.index + step + this.labels.length) % this.labels.length;
    this.render();
  }

  render() {
    if (!this.track) return;

    this.track.style.transform = `translateX(-${this.index * 100}%)`;
    if (this.label) this.label.textContent = this.labels[this.index];
    if (this.count) {
      this.count.textContent = `${String(this.index + 1).padStart(2, "0")} / ${String(this.labels.length).padStart(2, "0")}`;
    }

    this.bars.forEach((bar, index) => {
      bar.setAttribute("aria-current", index === this.index ? "true" : "false");
    });
  }
}

export const ohAboutCarousel = new OhAboutCarousel();
