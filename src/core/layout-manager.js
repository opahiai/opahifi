import { OH_APP_CONFIG } from "./config.js";

class OhLayoutManager {
  constructor() {
    this.root = document.documentElement;
    this.frame = null;
    this.handleResize = this.handleResize.bind(this);
  }

  mount() {
    this.root.style.setProperty("--oh-nav-height", `${OH_APP_CONFIG.navHeightPx}px`);
    this.update();

    window.addEventListener("resize", this.handleResize, { passive: true });
    window.visualViewport?.addEventListener("resize", this.handleResize, { passive: true });
  }

  handleResize() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.update());
  }

  update() {
    const viewportHeight = Math.round(window.visualViewport?.height ?? window.innerHeight);

    this.root.style.setProperty("--oh-viewport-height", `${viewportHeight}px`);
  }

  getNavHeight() {
    return Number.parseFloat(getComputedStyle(this.root).getPropertyValue("--oh-nav-height")) || OH_APP_CONFIG.navHeightPx;
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.handleResize);
    window.visualViewport?.removeEventListener("resize", this.handleResize);
  }
}

export const ohLayoutManager = new OhLayoutManager();
