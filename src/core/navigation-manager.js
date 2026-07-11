import { OH_APP_CONFIG } from "./config.js";
import { ohLayoutManager } from "./layout-manager.js";

class OhNavigationManager {
  constructor() {
    this.menu = null;
    this.menuButton = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  mount() {
    this.menu = document.querySelector("#oh-menu");
    this.menuButton = document.querySelector("[data-oh-menu-open]");
    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleClick(event) {
    const openMenuButton = event.target.closest("[data-oh-menu-open]");
    if (openMenuButton) {
      this.toggleMenu();
      return;
    }

    const closeMenuButton = event.target.closest("[data-oh-menu-close]");
    if (closeMenuButton) {
      this.closeMenu();
      return;
    }

    const menuLink = event.target.closest("[data-oh-menu-link]");
    if (menuLink) this.closeMenu();

    const link = event.target.closest("[data-oh-scroll]");
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash?.startsWith("#")) return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    this.scrollTo(target, hash);
  }

  handleKeydown(event) {
    if (event.key === "Escape") this.closeMenu();
  }

  toggleMenu() {
    if (this.menu?.classList.contains("is-open")) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  openMenu() {
    document.body.classList.add("is-menu-open");
    this.menu?.classList.add("is-open");
    this.menu?.setAttribute("aria-hidden", "false");
    this.menuButton?.setAttribute("aria-expanded", "true");
    this.setMenuButtonState(true);
  }

  closeMenu() {
    document.body.classList.remove("is-menu-open");
    this.menu?.classList.remove("is-open");
    this.menu?.setAttribute("aria-hidden", "true");
    this.menuButton?.setAttribute("aria-expanded", "false");
    this.setMenuButtonState(false);
  }

  setMenuButtonState(isOpen) {
    const icon = this.menuButton?.querySelector("i");
    if (!this.menuButton || !icon) return;

    icon.classList.toggle("fa-bars", !isOpen);
    icon.classList.toggle("fa-xmark", isOpen);
    this.menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
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
    document.removeEventListener("keydown", this.handleKeydown);
  }
}

export const ohNavigationManager = new OhNavigationManager();
