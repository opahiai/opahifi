import { OH_APP_CONFIG } from "./config.js";
import { ohLayoutManager } from "./layout-manager.js";

class OhNavigationManager {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  mount() {
    document.addEventListener("click", this.handleClick);
  }

  handleClick(event) {
    const link = event.target.closest("[data-oh-scroll]");
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash?.startsWith("#")) return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    this.scrollTo(target, hash);
  }

  scrollTo(target, hash) {
    const gsap = window.gsap;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!gsap || reduceMotion) {
      window.scrollTo({
        top: Math.max(0, target.offsetTop - ohLayoutManager.getNavHeight()),
        behavior: reduceMotion ? "auto" : "smooth"
      });
      history.replaceState(null, "", hash);
      return;
    }

    gsap.to(window, {
      duration: OH_APP_CONFIG.scrollDuration,
      ease: OH_APP_CONFIG.scrollEase,
      scrollTo: {
        y: target,
        offsetY: ohLayoutManager.getNavHeight(),
        autoKill: true
      },
      onComplete: () => history.replaceState(null, "", hash)
    });
  }

  destroy() {
    document.removeEventListener("click", this.handleClick);
  }
}

export const ohNavigationManager = new OhNavigationManager();
