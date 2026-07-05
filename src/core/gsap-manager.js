import { ohLayoutManager } from "./layout-manager.js";

const OH_PRESETS = {
  pressure: ({ timeline, title, copy, quote, visual, accent }) => {
    timeline
      .fromTo(visual, { scale: 0.72, rotate: -10 }, { scale: 1.18, rotate: 8 }, 0)
      .fromTo(title, { yPercent: 35, opacity: 0.2 }, { yPercent: -20, opacity: 1 }, 0)
      .fromTo(copy, { y: 45, opacity: 0 }, { y: -20, opacity: 1 }, 0.12)
      .fromTo(quote, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1 }, 0.25)
      .fromTo(accent, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center" }, 0.08);
  },
  hallucination: ({ timeline, title, copy, quote, visual, accent }) => {
    timeline
      .fromTo(visual, { scale: 0.65, filter: "blur(18px)" }, { scale: 1.22, filter: "blur(0px)" }, 0)
      .fromTo(title, { letterSpacing: "0.22em", opacity: 0.1 }, { letterSpacing: "-0.04em", opacity: 1 }, 0)
      .fromTo(copy, { xPercent: -15, opacity: 0 }, { xPercent: 8, opacity: 1 }, 0.12)
      .fromTo(quote, { xPercent: 18, opacity: 0 }, { xPercent: -4, opacity: 1 }, 0.24)
      .fromTo(accent, { scaleX: 0 }, { scaleX: 1, transformOrigin: "center center" }, 0.05);
  },
  avoidance: ({ timeline, title, copy, quote, visual, accent }) => {
    timeline
      .fromTo(visual, { xPercent: 40, rotate: 12, scale: 0.78 }, { xPercent: -18, rotate: -7, scale: 1.12 }, 0)
      .fromTo(title, { xPercent: -22, opacity: 0 }, { xPercent: 5, opacity: 1 }, 0)
      .fromTo(copy, { y: 55, opacity: 0 }, { y: -14, opacity: 1 }, 0.12)
      .fromTo(quote, { rotate: -3, scale: 0.86, opacity: 0 }, { rotate: 2, scale: 1, opacity: 1 }, 0.23)
      .fromTo(accent, { scaleX: 0 }, { scaleX: 1, transformOrigin: "right center" }, 0.06);
  }
};

class OhGsapManager {
  constructor() {
    this.context = null;
    this.matchMedia = null;
    this.refreshFrame = null;
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  mount() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const ScrollToPlugin = window.ScrollToPlugin;

    if (!gsap || !ScrollTrigger || !ScrollToPlugin) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    this.matchMedia = gsap.matchMedia();

    this.matchMedia.add("(prefers-reduced-motion: no-preference)", () => {
      this.context = gsap.context(() => {
        this.createHeroAnimation(gsap);
        this.createEntranceAnimation(gsap, ScrollTrigger);
        this.createOpaverseAnimations(gsap, ScrollTrigger);
        this.createSectionReveals(gsap, ScrollTrigger);
      });

      return () => this.context?.revert();
    });

    document.fonts?.ready.then(this.handleRefresh);
    window.addEventListener("load", this.handleRefresh, { once: true });
  }

  createHeroAnimation(gsap) {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".oh-opa", { scale: 0.7, opacity: 0, duration: 0.8 })
      .from(".oh-hero .oh-eyebrow", { y: 20, opacity: 0, duration: 0.45 }, "-=0.35")
      .from(".oh-hero__title", { y: 38, opacity: 0, duration: 0.65 }, "-=0.25")
      .from(".oh-hero__copy", { y: 24, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(".oh-hero .oh-button", { y: 18, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.2");
  }

  createEntranceAnimation(gsap, ScrollTrigger) {
    gsap.from(".oh-journey-entrance .oh-split > *", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".oh-journey-entrance",
        start: "top 70%",
        once: true
      }
    });
  }

  createOpaverseAnimations(gsap, ScrollTrigger) {
    document.querySelectorAll("[data-oh-opaverse]").forEach((scene) => {
      const presetName = scene.dataset.ohPreset;
      const preset = OH_PRESETS[presetName] ?? OH_PRESETS.pressure;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: () => `top top+=${ohLayoutManager.getNavHeight()}`,
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      });

      preset({
        timeline,
        title: scene.querySelector("[data-oh-scene-title]"),
        copy: scene.querySelector("[data-oh-scene-copy]"),
        quote: scene.querySelector("[data-oh-scene-quote]"),
        visual: scene.querySelector("[data-oh-scene-visual]"),
        accent: scene.querySelector("[data-oh-scene-accent]")
      });
    });
  }

  createSectionReveals(gsap, ScrollTrigger) {
    document.querySelectorAll(".oh-home, .oh-gallery, .oh-connect, .oh-videos, .oh-about").forEach((section) => {
      gsap.from(section.querySelectorAll(".oh-eyebrow, .oh-section-title, .oh-section-copy, .oh-sitemap, .oh-gallery__grid, .oh-link-row, .oh-video-card, .oh-button"), {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 68%",
          once: true
        }
      });
    });
  }

  handleRefresh() {
    cancelAnimationFrame(this.refreshFrame);
    this.refreshFrame = requestAnimationFrame(() => window.ScrollTrigger?.refresh());
  }

  destroy() {
    cancelAnimationFrame(this.refreshFrame);
    this.matchMedia?.revert();
    this.context?.revert();
  }
}

export const ohGsapManager = new OhGsapManager();
