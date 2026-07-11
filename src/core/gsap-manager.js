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
    const Flip = window.Flip;

    if (!gsap || !ScrollTrigger || !ScrollToPlugin || !Flip) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);
    this.matchMedia = gsap.matchMedia();

    this.matchMedia.add("(prefers-reduced-motion: no-preference)", () => {
      this.context = gsap.context(() => {
        this.prepareInitialStates(gsap);
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

  prepareInitialStates(gsap) {
    this.prepareHeroTaglineWords();

    gsap.set(".oh-hero__art, .oh-hero__title-stack, .oh-actions--hero .oh-button", {
      autoAlpha: 0
    });

    gsap.set(".oh-hero__tagline-word", {
      autoAlpha: 0
    });

    if (!document.querySelector("#oh-journey[hidden]")) {
      gsap.set(".oh-journey-entrance__content > *", {
        autoAlpha: 0
      });
    }

    document.querySelectorAll(".oh-home, .oh-songography, .oh-connect, .oh-videos, .oh-about").forEach((section) => {
      const revealItems = this.getSectionRevealItems(section);
      if (revealItems.length === 0) return;
      gsap.set(revealItems, {
        x: (_index, element) => this.getRevealStart(element).x,
        y: (_index, element) => this.getRevealStart(element).y,
        scale: (_index, element) => this.getRevealStart(element).scale,
        autoAlpha: 0,
        willChange: "transform, opacity"
      });
    });
  }

  createHeroAnimation(gsap) {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".oh-hero__art",
        { y: 28, scale: 0.96, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 1.15, clearProps: "transform,opacity,visibility" })
      .fromTo(".oh-hero__title-stack",
        { y: 42, scale: 0.96, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, clearProps: "transform,opacity,visibility" },
        "-=0.48")
      .fromTo(".oh-hero__tagline-word",
        { yPercent: 80, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.48, stagger: 0.075, clearProps: "transform,opacity,visibility" },
        "-=0.46")
      .fromTo(".oh-actions--hero .oh-button",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.58, stagger: 0.1, clearProps: "transform,opacity,visibility" },
        "-=0.36");
  }

  prepareHeroTaglineWords() {
    const tagline = document.querySelector(".oh-hero__tagline");
    if (!tagline || tagline.dataset.ohTaglineSplit === "true") return;

    const words = tagline.textContent.trim().split(/\s+/).filter(Boolean);
    tagline.innerHTML = words
      .map((word) => `<span class="oh-hero__tagline-word">${this.escapeHtml(word)}</span>`)
      .join(" ");
    tagline.dataset.ohTaglineSplit = "true";
  }

  escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  createEntranceAnimation(gsap, ScrollTrigger) {
    if (document.querySelector("#oh-journey[hidden]")) return;

    gsap.from(".oh-journey-entrance__content > *", {
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
    if (document.querySelector("#oh-journey[hidden]")) return;

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
    document.querySelectorAll(".oh-home, .oh-songography, .oh-connect, .oh-videos, .oh-about").forEach((section) => {
      const revealItems = this.getSectionRevealItems(section);

      if (revealItems.length === 0) return;

      gsap.fromTo(revealItems,
        {
          x: (_index, element) => this.getRevealStart(element).x,
          y: (_index, element) => this.getRevealStart(element).y,
          scale: (_index, element) => this.getRevealStart(element).scale,
          autoAlpha: 0,
          willChange: "transform, opacity"
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.95,
          stagger: { each: 0.075, from: "start" },
          ease: "power3.out",
          clearProps: "transform,opacity,visibility,willChange",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true,
            invalidateOnRefresh: true
          }
        });
    });
  }

  getSectionRevealItems(section) {
    const revealSelectors = [
      ".oh-eyebrow",
      ".oh-section-title",
      ".oh-section-copy",
      ".oh-home__copy",
      ".oh-sitemap__group",
      ".ohg-heading",
      ".ohg-grid__item",
      ".oh-follow__profile",
      ".oh-follow__image",
      ".oh-socials__group",
      ".oh-link-row",
      ".oh-video-card",
      ".opa-about-header",
      ".opa-about-kicker",
      ".opa-about-heading",
      ".opa-about-media",
      ".opa-about-copy",
      ".opa-about-controls",
      ".oh-button"
    ].join(", ");

    return [...section.querySelectorAll(revealSelectors)]
      .filter((element) => !element.closest("[aria-hidden='true']"));
  }

  getRevealStart(element) {
    if (element.matches(".oh-eyebrow, .oh-section-title, .ohg-heading, .opa-about-header, .opa-about-kicker, .opa-about-heading")) {
      return { x: -34, y: 0, scale: 1 };
    }

    if (element.matches(".ohg-grid__item, .oh-video-card, .oh-socials__group")) {
      return { x: 28, y: 14, scale: 0.975 };
    }

    if (element.matches(".oh-follow__image, .opa-about-media")) {
      return { x: 44, y: 0, scale: 0.96 };
    }

    if (element.matches(".oh-sitemap__group, .oh-link-row, .opa-about-controls, .oh-button")) {
      return { x: 0, y: 30, scale: 0.985 };
    }

    return { x: 0, y: 36, scale: 0.985 };
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
