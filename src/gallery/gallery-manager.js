import { OH_OPAVERSE_MODULES } from "../opaverses/opaverse.registry.js";

const OHG_PLATFORM_CONFIG = Object.freeze({
  spotify: Object.freeze({ label: "Spotify", icon: "fa-brands fa-spotify" }),
  appleMusic: Object.freeze({ label: "Apple Music", icon: "fa-brands fa-apple" }),
  youtube: Object.freeze({ label: "YouTube", icon: "fa-brands fa-youtube" }),
  amazonMusic: Object.freeze({ label: "Amazon Music", icon: "fa-brands fa-amazon" }),
  other: Object.freeze({ label: "YouTube", icon: "fa-brands fa-youtube" })
});

function ohgEscapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ohgNormalizePlatforms(platforms) {
  if (Array.isArray(platforms)) {
    return Object.fromEntries(platforms.map((platform) => [platform, null]));
  }

  return platforms && typeof platforms === "object" ? platforms : {};
}

function ohgNormalizeStripeColors(colors) {
  return Array.isArray(colors) ? colors.filter(Boolean).map(String) : [];
}

function ohgSlugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ohgIsOriginalVersion(version) {
  return ohgSlugify(version?.name ?? version?.id ?? version?.slug) === "original";
}

function ohgGetStripeBackground(version) {
  if (!version || ohgIsOriginalVersion(version)) {
    return "linear-gradient(90deg, #ffffff 0%, #f8fafc 52%, #ffffff 100%)";
  }

  const colors = version.stripeColors ?? [];
  if (colors.length === 0) return "#ffffff";
  if (colors.length === 1) return colors[0];

  return `linear-gradient(90deg, ${colors.join(", ")})`;
}

function ohgFormatDuration(duration) {
  return duration && duration !== "Duration pending" ? duration : "0:00";
}

function ohgNormalizeVersion(song, version, index) {
  const isStringVersion = typeof version === "string";
  const versionAssets = version?.assets ?? {};
  const fallbackName = index === 0 ? "Original" : `Version ${index + 1}`;
  const name = isStringVersion
    ? version
    : version?.name ?? version?.title ?? fallbackName;
  const id = isStringVersion
    ? ohgSlugify(version) || `${song.id}-version-${index + 1}`
    : version?.id ?? version?.slug ?? ohgSlugify(name) ?? `${song.id}-version-${index + 1}`;

  return Object.freeze({
    id,
    slug: version?.slug ?? ohgSlugify(name) ?? id,
    name,
    isDefault: Boolean(version?.default ?? version?.isDefault ?? version?.defaultVersion),
    cover: version?.cover ?? versionAssets.cover ?? song.assets.cover,
    art: version?.art ?? versionAssets.art ?? song.assets.art ?? version?.cover ?? versionAssets.cover ?? song.assets.cover,
    stripeColors: Object.freeze(ohgNormalizeStripeColors(version?.stripeColors ?? version?.mixColors)),
    duration: ohgFormatDuration(version?.duration ?? version?.length),
    lyrics: version?.lyrics || song.lyrics || "Lyrics pending",
    platforms: Object.freeze(ohgNormalizePlatforms(version?.platforms))
  });
}

function ohgNormalizeSong(module, index) {
  const { data } = module;
  const sourceVersions = Array.isArray(data.versions) ? data.versions : [];
  const versions = Object.freeze(sourceVersions.map((version, versionIndex) => (
    ohgNormalizeVersion(data, version, versionIndex)
  )));
  const requestedDefaultVersion = data.defaultVersion ?? data.defaultVersionId ?? data.defaultVersionSlug;
  const requestedDefaultSlug = requestedDefaultVersion ? ohgSlugify(requestedDefaultVersion) : null;
  const markedDefaultIndex = versions.findIndex((version) => version.isDefault);
  const requestedDefaultIndex = requestedDefaultSlug
    ? versions.findIndex((version) => version.id === requestedDefaultVersion || version.slug === requestedDefaultSlug)
    : -1;

  return Object.freeze({
    id: data.id,
    slug: data.slug ?? ohgSlugify(data.title) ?? data.id,
    order: index + 1,
    title: data.title,
    titleLines: Object.freeze(Array.isArray(data.titleLines) && data.titleLines.length > 0
      ? data.titleLines.slice(0, 2)
      : [data.title]),
    art: data.assets?.art ?? data.assets?.cover ?? "",
    cover: data.assets?.cover ?? data.assets?.art ?? "",
    subtitle: data.subtitle ?? data.opaverse?.subtitle ?? "",
    share: data.share ?? {},
    theme: data.theme,
    defaultVersionIndex: markedDefaultIndex >= 0
      ? markedDefaultIndex
      : Math.max(requestedDefaultIndex, 0),
    versions
  });
}

class OhGalleryManager {
  constructor() {
    this.songs = OH_OPAVERSE_MODULES.map(ohgNormalizeSong);
    this.activeSongId = null;
    this.activeVersionIndex = 0;
    this.isAnimating = false;
    this.isLyricsExpanded = false;
    this.versionPillsExpanded = false;
    this.lastFocusedElement = null;
    this.grid = null;
    this.detail = null;
    this.detailScroll = null;
    this.heroSlot = null;
    this.rail = null;
    this.railTrack = null;
    this.versionPills = null;
    this.platforms = null;
    this.lyricsText = null;
    this.lyricsToggle = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  mount() {
    this.gallery = document.querySelector("#gallery");
    this.grid = document.querySelector("#oh-gallery-grid");
    this.detail = document.querySelector("#ohg-detail");
    this.detailScroll = document.querySelector("#ohg-detail-scroll");
    this.heroSlot = document.querySelector("#ohg-hero-slot");
    this.rail = document.querySelector("#ohg-rail");
    this.railTrack = document.querySelector("#ohg-rail-track");
    this.versionPills = document.querySelector("#ohg-version-pills");
    this.platforms = document.querySelector("#ohg-platforms");
    this.lyricsText = document.querySelector("#ohg-lyrics-text");
    this.lyricsToggle = document.querySelector("#ohg-lyrics-toggle");

    if (!this.grid || !this.detail || !this.railTrack) return;

    this.gallery?.append(this.detail, this.rail);

    this.renderGallery();
    this.renderRailSlots();
    const count = document.querySelector(".ohg-heading__count");
    if (count) count.textContent = `${this.songs.length} songs`;
    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("hashchange", this.handleLocationChange);
    window.addEventListener("popstate", this.handleLocationChange);

    this.cleanLegacyHash();
    window.requestAnimationFrame(() => this.handleLocationChange());
  }

  renderGallery() {
    this.grid.innerHTML = this.songs.map((song) => {
      const version = this.getVersion(song, this.getDefaultVersionIndex(song));
      const stripeBackground = ohgGetStripeBackground(version);
      const titleLines = song.titleLines.map((line) => (
        `<span>${ohgEscapeHtml(line)}</span>`
      )).join("");

      return `
        <div class="ohg-grid__item" id="ohg-grid-slot-${song.id}">
          <button
            class="ohg-cover ohg-cover--circle"
            id="ohg-cover-${song.id}"
            type="button"
            data-ohg-song-id="${ohgEscapeHtml(song.id)}"
            aria-label="Open ${ohgEscapeHtml(song.title)}"
          >
            <img
              class="ohg-cover__image"
              id="ohg-cover-image-${song.id}"
              src="${ohgEscapeHtml(song.art)}"
              alt="${ohgEscapeHtml(song.title)} art"
              width="900"
              height="900"
              loading="lazy"
            >
            <span
              class="ohg-cover__stripe"
              style="--ohg-cover-stripe: ${ohgEscapeHtml(stripeBackground)}"
              aria-hidden="true"
            ></span>
            <span class="ohg-cover__title">${titleLines}</span>
          </button>
        </div>
      `;
    }).join("");
  }

  renderRailSlots() {
    this.railTrack.innerHTML = this.songs.map((song) => `
      <div
        class="ohg-rail__slot"
        id="ohg-rail-slot-${song.id}"
        data-ohg-rail-song-id="${ohgEscapeHtml(song.id)}"
      ></div>
    `).join("");
  }

  handleClick(event) {
    const songCover = event.target.closest("[data-ohg-song-id]");
    const action = event.target.closest("[data-ohg-action]");
    const versionButton = event.target.closest("[data-ohg-version-index]");

    if (songCover) {
      const songId = songCover.dataset.ohgSongId;

      if (this.activeSongId === null) {
        this.openSong(songId);
      } else if (this.activeSongId === songId) {
        this.closeSong();
      } else if (this.activeSongId !== songId) {
        this.changeSong(songId);
      }
      return;
    }

    if (versionButton) {
      this.changeVersion(Number(versionButton.dataset.ohgVersionIndex));
      return;
    }

    if (!action) return;

    const actions = {
      close: () => this.closeSong(),
      share: () => this.shareSong(),
      previousVersion: () => this.changeVersion(this.activeVersionIndex - 1),
      nextVersion: () => this.changeVersion(this.activeVersionIndex + 1),
      toggleLyrics: () => this.toggleLyrics()
    };

    actions[action.dataset.ohgAction]?.();
  }

  handleKeydown(event) {
    if (this.activeSongId === null) return;

    if (event.key === "Escape") this.closeSong();
    if (event.key === "ArrowLeft") this.changeVersion(this.activeVersionIndex - 1);
    if (event.key === "ArrowRight") this.changeVersion(this.activeVersionIndex + 1);
  }

  getSong(songId = this.activeSongId) {
    return this.songs.find((song) => song.id === songId) ?? null;
  }

  getVersion(song = this.getSong(), index = this.activeVersionIndex) {
    return song?.versions[index] ?? null;
  }

  setCoverImage(song, imageUrl) {
    const coverImage = document.querySelector(`#ohg-cover-image-${song?.id}`);
    if (coverImage && imageUrl) coverImage.src = imageUrl;
  }

  setCoverStripe(song, version) {
    const coverStripe = document.querySelector(`#ohg-cover-${song?.id} .ohg-cover__stripe`);
    if (coverStripe) coverStripe.style.setProperty("--ohg-cover-stripe", ohgGetStripeBackground(version));
  }

  setCoverToSongArt(song) {
    this.setCoverImage(song, song?.art);
    this.setCoverStripe(song, this.getVersion(song, this.getDefaultVersionIndex(song)));
  }

  setCoverToVersionArt(song, version) {
    this.setCoverImage(song, version?.cover ?? version?.art ?? song?.cover ?? song?.art);
    this.setCoverStripe(song, version);
  }

  getDefaultVersionIndex(song) {
    return song?.defaultVersionIndex ?? 0;
  }

  getVersionIndexFromSlug(song, versionSlug) {
    if (!song || !versionSlug) return this.getDefaultVersionIndex(song);

    const decodedSlug = ohgSlugify(versionSlug);
    const versionIndex = song.versions.findIndex((version) => (
      version.id === versionSlug || version.slug === decodedSlug
    ));

    return versionIndex >= 0 ? versionIndex : this.getDefaultVersionIndex(song);
  }

  getSongUrl(songId, versionIndex = null) {
    const { origin, pathname, search } = window.location;
    return `${origin}${pathname}${search}${this.getSongHash(songId, versionIndex)}`;
  }

  getSongHash(songId, versionIndex = null) {
    const song = this.getSong(songId);
    if (!song) return "#gallery";

    const resolvedVersionIndex = versionIndex ?? this.getDefaultVersionIndex(song);
    const songSlug = song.slug ?? ohgSlugify(song.title) ?? song.id;
    if (resolvedVersionIndex === this.getDefaultVersionIndex(song)) {
      return `#${encodeURIComponent(songSlug)}`;
    }

    const version = this.getVersion(song, resolvedVersionIndex) ?? this.getVersion(song, 0);
    const versionSlug = version?.slug ?? ohgSlugify(version?.name) ?? "original";

    return `#${encodeURIComponent(songSlug)}/${encodeURIComponent(versionSlug)}`;
  }

  getRouteFromHash(hash = window.location.hash) {
    const route = hash.replace(/^#/, "");
    const [rawSongSlug, rawVersionSlug] = route.split("/");

    if (!rawSongSlug || rawSongSlug === "gallery") return null;

    try {
      const songSlug = decodeURIComponent(rawSongSlug);
      const versionSlug = rawVersionSlug ? decodeURIComponent(rawVersionSlug) : null;
      const normalizedSongSlug = ohgSlugify(songSlug);
      const song = this.songs.find((entry) => (
        entry.id === songSlug || entry.slug === normalizedSongSlug
      ));

      if (!song) return null;

      return Object.freeze({
        songId: song.id,
        versionIndex: this.getVersionIndexFromSlug(song, versionSlug)
      });
    } catch {
      return null;
    }
  }

  cleanLegacyHash() {
    if (window.location.hash === "#oh-gallery") {
      this.setLocationHash("#gallery", "replace");
      return;
    }

    if (window.location.hash.startsWith("#oh-gallery/")) {
      this.setLocationHash(`#${window.location.hash.slice("#oh-gallery/".length)}`, "replace");
    }
  }

  setLocationHash(hash, mode = "push") {
    if (window.location.hash === hash) return;

    const nextUrl = `${window.location.pathname}${window.location.search}${hash}`;
    const historyMethod = mode === "replace" ? "replaceState" : "pushState";
    window.history[historyMethod](null, "", nextUrl);
  }

  handleLocationChange() {
    const route = this.getRouteFromHash();

    if (route) {
      if (!this.getSong(route.songId)) return;

      document.querySelector("#gallery")?.scrollIntoView({ block: "start" });

      if (this.activeSongId === null) {
        this.openSong(route.songId, { updateUrl: false, versionIndex: route.versionIndex });
      } else if (this.activeSongId !== route.songId) {
        this.changeSong(route.songId, { updateUrl: false, versionIndex: route.versionIndex });
      } else if (this.activeVersionIndex !== route.versionIndex) {
        this.changeVersion(route.versionIndex, { updateUrl: false });
      }
      return;
    }

    if (window.location.hash === "#gallery" && this.activeSongId !== null) {
      this.closeSong({ updateUrl: false });
    }
  }

  updateDetail(song, versionIndex, updateCover = true) {
    const version = this.getVersion(song, versionIndex);
    if (!song || !version) return;

    const title = document.querySelector("#ohg-detail-title");
    const subtitle = document.querySelector("#ohg-detail-subtitle");
    const duration = document.querySelector("#ohg-detail-duration");

    title.textContent = song.title;
    subtitle.textContent = song.subtitle;
    subtitle.hidden = !song.subtitle;
    duration.textContent = version.duration;

    if (updateCover) this.setCoverToVersionArt(song, version);

    this.renderVersions(song, versionIndex);
    this.renderPlatforms(version.platforms);
    this.renderLyrics(version.lyrics);
  }

  renderVersions(song, activeIndex) {
    this.versionPills.classList.toggle("is-collapsed", !this.versionPillsExpanded);
    const activeVersion = this.getVersion(song, activeIndex) ?? this.getVersion(song, 0);
    const secondaryVersions = song.versions
      .map((version, index) => ({ version, index }))
      .filter((entry) => entry.index !== activeIndex)
      .slice(0, 2);
    const activeButton = activeVersion ? `
      <button
        class="ohg-version-pill is-active"
        type="button"
        data-ohg-version-index="${activeIndex}"
        aria-pressed="true"
        style="--ohg-version-stripe: ${ohgEscapeHtml(ohgGetStripeBackground(activeVersion))}"
      >
        <span class="ohg-version-pill__name">${ohgEscapeHtml(activeVersion.name)}</span>
        <span class="ohg-version-pill__duration">${ohgEscapeHtml(activeVersion.duration)}</span>
      </button>
    ` : "";
    const secondaryButtons = secondaryVersions.map(({ version, index }) => `
      <button
        class="ohg-version-pill"
        type="button"
        data-ohg-version-index="${index}"
        aria-pressed="false"
        style="--ohg-version-stripe: ${ohgEscapeHtml(ohgGetStripeBackground(version))}"
      >
        <span class="ohg-version-pill__name">${ohgEscapeHtml(version.name)}</span>
        <span class="ohg-version-pill__duration">${ohgEscapeHtml(version.duration)}</span>
      </button>
    `).join("");
    const ghostCount = Math.max(0, 3 - 1 - secondaryVersions.length);
    const ghostRibbons = Array.from({ length: ghostCount }, () => (
      `<span class="ohg-version-pill ohg-version-pill--ghost" aria-hidden="true"></span>`
    )).join("");

    this.versionPills.innerHTML = `${activeButton}${secondaryButtons}${ghostRibbons}`;
    this.setVersionPillsExpanded(this.versionPillsExpanded);

    const previousButton = document.querySelector('[data-ohg-action="previousVersion"]');
    const nextButton = document.querySelector('[data-ohg-action="nextVersion"]');
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === song.versions.length - 1;
  }

  getVersionPillElements() {
    return Array.from(this.versionPills?.querySelectorAll(".ohg-version-pill") ?? []);
  }

  setVersionPillsExpanded(isExpanded) {
    this.versionPillsExpanded = isExpanded;
    this.versionPills?.classList.toggle("is-collapsed", !isExpanded);
    const gsap = window.gsap;
    const pills = this.getVersionPillElements();
    if (!gsap || pills.length === 0) return;

    gsap.set(pills, {
      scaleX: isExpanded ? 1 : 0,
      transformOrigin: "left center"
    });
    if (isExpanded) gsap.set(pills, { clearProps: "transform,transformOrigin" });
  }

  animateVersionPillsIn(onComplete = null) {
    const gsap = window.gsap;
    const pills = this.getVersionPillElements();
    this.versionPillsExpanded = true;
    this.versionPills?.classList.remove("is-collapsed");
    if (!gsap || pills.length === 0) {
      onComplete?.();
      return;
    }

    gsap.fromTo(pills, {
      scaleX: 0,
      transformOrigin: "left center"
    }, {
      scaleX: 1,
      duration: 0.34,
      ease: "power3.out",
      stagger: 0.045,
      onComplete: () => {
        gsap.set(pills, { clearProps: "transform,transformOrigin" });
        onComplete?.();
      }
    });
  }

  animateVersionPillsOut(onComplete = null) {
    const gsap = window.gsap;
    const pills = this.getVersionPillElements();
    this.versionPillsExpanded = false;
    if (!gsap || pills.length === 0) {
      onComplete?.();
      return;
    }

    gsap.to(pills, {
      scaleX: 0,
      duration: 0.28,
      ease: "power3.inOut",
      stagger: -0.035,
      transformOrigin: "left center",
      onComplete: () => {
        this.versionPills?.classList.add("is-collapsed");
        gsap.set(pills, { scaleX: 0, transformOrigin: "left center" });
        gsap.delayedCall(0.08, () => onComplete?.());
      }
    });
  }

  renderPlatforms(platforms) {
    this.platforms.innerHTML = Object.entries(OHG_PLATFORM_CONFIG).map(([key, config]) => {
      const url = platforms[key];

      if (!url) {
        return `
          <span
            class="ohg-platform ohg-platform--${key} is-disabled"
            aria-label="${config.label} link pending"
            title="${config.label} link pending"
          >
            <i class="${config.icon}" aria-hidden="true"></i>
          </span>
        `;
      }

      return `
        <a
          class="ohg-platform ohg-platform--${key}"
          href="${ohgEscapeHtml(url)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Listen on ${config.label}"
        >
          <i class="${config.icon}" aria-hidden="true"></i>
        </a>
      `;
    }).join("");
  }

  renderLyrics(lyrics) {
    this.lyricsText.textContent = lyrics;
    this.isLyricsExpanded = false;
    this.lyricsText.classList.remove("is-expanded");
    this.lyricsToggle.textContent = "Show more";

    requestAnimationFrame(() => {
      const canExpand = this.lyricsText.scrollHeight > this.lyricsText.clientHeight + 4;
      this.lyricsToggle.hidden = !canExpand;
    });
  }

  openSong(songId, options = {}) {
    if (this.isAnimating) return;

    const song = this.getSong(songId);
    const gsap = window.gsap;
    const Flip = window.Flip;
    if (!song || !gsap || !Flip) return;
    const versionIndex = options.versionIndex ?? this.getDefaultVersionIndex(song);

    this.isAnimating = true;
    this.lastFocusedElement = document.activeElement;
    this.activeSongId = songId;
    this.activeVersionIndex = versionIndex;
    this.versionPillsExpanded = false;
    if (options.updateUrl !== false) this.setLocationHash(this.getSongHash(songId, versionIndex));
    this.disableRailClipping();
    const state = Flip.getState(".ohg-cover");
    this.detail.classList.add("is-open");
    this.detail.setAttribute("aria-hidden", "false");
    this.rail.classList.add("is-open");
    this.moveCoversToDetail(songId, versionIndex);
    this.updateDetail(song, versionIndex);

    const travellingCovers = document.querySelectorAll(".ohg-cover");
    travellingCovers.forEach((cover) => cover.classList.add("ohg-cover--travelling"));

    Flip.from(state, {
      duration: 0.78,
      ease: "back.out(1.05)",
      absolute: true,
      nested: true,
      zIndex: 9999,
      stagger: 0.018,
      onComplete: () => {
        travellingCovers.forEach((cover) => cover.classList.remove("ohg-cover--travelling"));
        this.enableRailClipping();
        this.animateVersionPillsIn(() => {
          this.isAnimating = false;
        });
      }
    });
  }

  disableRailClipping() {
    this.railTrack?.classList.remove("ohg-rail__track--clip");
    this.railTrack?.classList.add("ohg-rail__track--unclip");
  }

  enableRailClipping() {
    this.railTrack?.classList.remove("ohg-rail__track--unclip");
    this.railTrack?.classList.add("ohg-rail__track--clip");
  }

  moveCoversToDetail(activeSongId, activeVersionIndex = null) {
    this.songs.forEach((song) => {
      const cover = document.querySelector(`#ohg-cover-${song.id}`);
      const railSlot = document.querySelector(`#ohg-rail-slot-${song.id}`);
      if (!cover || !railSlot) return;

      cover.classList.remove("ohg-cover--detail");
      cover.classList.add("ohg-cover--circle");
      railSlot.hidden = false;

      if (song.id === activeSongId) {
        this.heroSlot.append(cover);
        cover.classList.remove("ohg-cover--circle");
        cover.classList.add("ohg-cover--detail");
        this.setCoverToVersionArt(song, this.getVersion(song, activeVersionIndex ?? this.getDefaultVersionIndex(song)));
        railSlot.hidden = true;
      } else {
        this.setCoverToSongArt(song);
        railSlot.append(cover);
      }
    });
  }

  closeSong(options = {}) {
    if (this.isAnimating || this.activeSongId === null) return;

    const gsap = window.gsap;
    const Flip = window.Flip;
    if (!gsap || !Flip) return;

    this.isAnimating = true;
    if (options.updateUrl !== false) this.setLocationHash("#gallery", "replace");
    this.detail.classList.add("is-leaving");
    this.animateVersionPillsOut(() => {
      this.disableRailClipping();
      const travellingCovers = document.querySelectorAll(".ohg-cover");
      travellingCovers.forEach((cover) => cover.classList.add("ohg-cover--travelling"));
      const state = Flip.getState(".ohg-cover");

      this.songs.forEach((song) => {
        const cover = document.querySelector(`#ohg-cover-${song.id}`);
        const gridSlot = document.querySelector(`#ohg-grid-slot-${song.id}`);
        const railSlot = document.querySelector(`#ohg-rail-slot-${song.id}`);
        if (!cover || !gridSlot || !railSlot) return;

        gridSlot.append(cover);
        cover.classList.remove("ohg-cover--detail");
        cover.classList.add("ohg-cover--circle");
        this.setCoverToSongArt(song);
        railSlot.hidden = false;
      });

      Flip.from(state, {
        duration: 0.68,
        ease: "power3.inOut",
        absolute: true,
        nested: true,
        zIndex: 9999,
        stagger: -0.012,
        onComplete: () => {
          travellingCovers.forEach((cover) => cover.classList.remove("ohg-cover--travelling"));
          this.enableRailClipping();
          this.detail.classList.remove("is-open", "is-leaving");
          this.detail.setAttribute("aria-hidden", "true");
          this.rail.classList.remove("is-open");
          this.activeSongId = null;
          this.activeVersionIndex = 0;
          this.isAnimating = false;
          this.lastFocusedElement?.focus?.({ preventScroll: true });
        }
      });
    });
  }

  changeSong(songId, options = {}) {
    if (this.isAnimating || songId === this.activeSongId) return;

    const newSong = this.getSong(songId);
    const oldSong = this.getSong();
    const gsap = window.gsap;
    const Flip = window.Flip;
    if (!newSong || !oldSong || !gsap || !Flip) return;
    const versionIndex = options.versionIndex ?? this.getDefaultVersionIndex(newSong);

    this.isAnimating = true;
    this.detailScroll.scrollTop = 0;
    this.animateVersionPillsOut(() => {
      this.disableRailClipping();
      const travellingCovers = document.querySelectorAll(".ohg-cover");
      travellingCovers.forEach((cover) => cover.classList.add("ohg-cover--travelling"));
      const state = Flip.getState(".ohg-cover");
      const oldCover = document.querySelector(`#ohg-cover-${oldSong.id}`);
      const newCover = document.querySelector(`#ohg-cover-${newSong.id}`);
      const oldRailSlot = document.querySelector(`#ohg-rail-slot-${oldSong.id}`);
      const newRailSlot = document.querySelector(`#ohg-rail-slot-${newSong.id}`);

      oldRailSlot.hidden = false;
      oldRailSlot.append(oldCover);
      oldCover.classList.remove("ohg-cover--detail");
      oldCover.classList.add("ohg-cover--circle");
      this.setCoverToSongArt(oldSong);

      this.heroSlot.append(newCover);
      newCover.classList.remove("ohg-cover--circle");
      newCover.classList.add("ohg-cover--detail");
      this.setCoverToVersionArt(newSong, this.getVersion(newSong, versionIndex));
      newRailSlot.hidden = true;

      this.activeSongId = songId;
      this.activeVersionIndex = versionIndex;
      this.versionPillsExpanded = false;
      if (options.updateUrl !== false) this.setLocationHash(this.getSongHash(songId, versionIndex));

      const changingContent = ["#ohg-detail-info", "#ohg-platforms", "#ohg-lyrics"];

      gsap.to(changingContent, {
        opacity: 0,
        y: 8,
        duration: 0.18,
        onComplete: () => {
          this.updateDetail(newSong, versionIndex, false);
          gsap.to(changingContent, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }
      });

      Flip.from(state, {
        duration: 0.72,
        ease: "back.out(1.02)",
        absolute: true,
        nested: true,
        zIndex: 9999,
        onComplete: () => {
          travellingCovers.forEach((cover) => cover.classList.remove("ohg-cover--travelling"));
          this.enableRailClipping();
          this.animateVersionPillsIn(() => {
            this.isAnimating = false;
            oldRailSlot.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          });
        }
      });
    });
  }

  changeVersion(index, options = {}) {
    if (this.activeSongId === null || this.isAnimating) return;

    const song = this.getSong();
    const nextVersion = this.getVersion(song, index);
    const activeCoverImage = document.querySelector(`#ohg-cover-image-${song.id}`);
    const changingContent = ["#ohg-detail-info", "#ohg-platforms", "#ohg-lyrics"];
    const gsap = window.gsap;

    if (!nextVersion || index === this.activeVersionIndex || !gsap) return;

    this.isAnimating = true;
    this.activeVersionIndex = index;
    if (options.updateUrl !== false) this.setLocationHash(this.getSongHash(song.id, index));

    gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    })
      .to(changingContent, { opacity: 0, y: 6, duration: 0.16 }, 0)
      .to(activeCoverImage, {
        opacity: 0.2,
        scale: 0.96,
        duration: 0.16,
        onComplete: () => {
          this.setCoverToVersionArt(song, nextVersion);
          this.updateDetail(song, index, false);
        }
      }, 0)
      .to(changingContent, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, 0.18)
      .to(activeCoverImage, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.18);
  }

  toggleLyrics() {
    this.isLyricsExpanded = !this.isLyricsExpanded;
    this.lyricsText.classList.toggle("is-expanded", this.isLyricsExpanded);
    this.lyricsToggle.textContent = this.isLyricsExpanded ? "Show less" : "Show more";
  }

  async shareSong() {
    const song = this.getSong();
    if (!song) return;

    const shareUrl = song.share.url ?? this.getSongUrl(song.id, this.activeVersionIndex);
    const shareData = {
      title: song.share.title ?? song.title,
      text: song.share.text ?? `Listen to ${song.title} by OpaHiFi`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        this.showShareFeedback("Link copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") this.showShareFeedback("Unable to share");
    }
  }

  showShareFeedback(message) {
    const label = document.querySelector("#ohg-now-playing-label");
    const previousText = label.textContent;
    label.textContent = message;
    window.setTimeout(() => {
      label.textContent = previousText;
    }, 1400);
  }

  destroy() {
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("hashchange", this.handleLocationChange);
    window.removeEventListener("popstate", this.handleLocationChange);
  }
}

export const ohGalleryManager = new OhGalleryManager();
