export const OH_DEFAULT_LOCALE = "en";

export const OH_I18N = Object.freeze({
  en: Object.freeze({
    nav: Object.freeze({
      menuOpen: "Open menu",
      menuClose: "Close menu",
      menuLabel: "OpaHiFi menu",
      sectionsLabel: "OpaHiFi sections",
      homeSitemapLabel: "OpaHiFi sitemap",
      groups: Object.freeze({
        explore: "Explore",
        opahifi: "OpaHiFi"
      })
    }),
    hero: Object.freeze({
      imageAlt: "Opa surrounded by blue water and orange fire",
      titleImageAlt: "Blues On Fire",
      tagline: "DANCE FROM THE PYRE",
      copyTop: "Scroll down for the full experience",
      copyBeforeSkip: "or click",
      copyAfterSkip: "to go home.",
      homeCta: "Skip",
      scrollLabel: "Scroll down for the full experience"
    }),
    journeyExit: Object.freeze({
      eyebrow: "Three worlds later",
      title: "The ride ends. OpaHiFi opens.",
      copy: "Explore every section without leaving the continuous page.",
      cta: "Enter Home"
    }),
    home: Object.freeze({
      eyebrow: "OpaHiFi",
      title: "Now what?!",
      copy: "The songs, the lyrics, the story, and everything OpaHiFi."
    }),
    sections: Object.freeze({
      songology: Object.freeze({
        title: "Songology",
        eyebrow: "Scroll between the lines",
        copy: "Keep scrolling. Each song opens its own world, then hands you directly to the next one.",
        href: "#oh-journey",
        icon: "fa-magnifying-glass",
        group: "explore",
        primary: true
      }),
      songography: Object.freeze({
        title: "Songography",
        eyebrow: "Versions, links & lyrics",
        href: "#songography",
        icon: "fa-record-vinyl",
        group: "explore",
        primary: true
      }),
      songovision: Object.freeze({
        title: "Songovision",
        eyebrow: "Videos, clips & lyrics",
        href: "#oh-videos",
        icon: "fa-tv",
        group: "explore",
        primary: true
      }),
      about: Object.freeze({
        title: "About OpaHiFi",
        eyebrow: "What, why, and how?",
        copy: "OpaHiFi turns songs into visual, scroll-driven experiences built for mobile first.",
        href: "#oh-about",
        icon: "fa-circle-info",
        group: "opahifi"
      }),
      follow: Object.freeze({
        title: "Follow / Contact",
        eyebrow: "Streaming &  socials links",
        href: "#oh-connect",
        icon: "fa-bolt",
        group: "opahifi"
      }),
      shop: Object.freeze({
        title: "Shop OpaHiFi",
        eyebrow: "Merch much?",
        href: "https://shop.opahifi.com/",
        icon: "fa-bag-shopping",
        group: "opahifi"
      })
    }),
    songography: Object.freeze({
      ariaLabel: "OpaHiFi songography",
      backLabel: "Back to Songography",
      shareLabel: "Share song",
      previousSongLabel: "Previous song",
      nextSongLabel: "Next song",
      lyricsTitle: "Lyrics"
    }),
    footer: Object.freeze({
      terms: "Terms"
    })
  })
});

export const OH_NAV_SECTION_KEYS = Object.freeze([
  "songology",
  "songography",
  "songovision",
  "about",
  "follow",
  "shop"
]);

export function ohGetLocale() {
  const htmlLocale = document.documentElement.lang;
  return OH_I18N[htmlLocale] ? htmlLocale : OH_DEFAULT_LOCALE;
}

export function ohGetMessages(locale = ohGetLocale()) {
  return OH_I18N[locale] ?? OH_I18N[OH_DEFAULT_LOCALE];
}
