import { OH_OPAVERSE_MODULES } from "../opaverses/opaverse.registry.js";
import { FeaturedAudioPlayer } from "./featured-audio-player.js";

const OHG_LYRICS_PATHS = Object.freeze({
  "believe-the-truth-fairy": "lyrics/believe-the-truth-fairy.txt",
  "full-mindness": "lyrics/full-mindness.txt",
  "glittaa-phoenix": "lyrics/glittaa-pheonix.txt",
  "hallucinating-dum-dum": "lyrics/hallucinating-dum-dum.txt",
  "old-love-story": "lyrics/old-love-story.txt",
  "opa-pa-pa-party": "lyrics/opa-pa-pa-party.txt",
  "splenda-love-rabbit-hell": "lyrics/splenda-love-rabbit-hell.txt",
  "wellwolf-howl-lehluya": "lyrics/wellwolf-hoawlehluya.txt",
  "yeah-lets-do-brunch": "lyrics/yeah-lets-do-brunch.txt"
});

const OHG_VERSION_LYRICS_PATHS = Object.freeze({
  "glittaa-phoenix/opa-sunrize-max-mix": "lyrics/glittaa-pheonix-sunrise-mix.txt"
});

const OHG_SHARE_ORIGIN = "https://opahifi.com";
const OHG_FEATURED_GRID_SONG_ID = "do-the-panicarena";
const OHG_FEATURED_AUDIO_SRC = "audio/audio_panicarena.m4a";
const OHG_FEATURED_AUDIO_TITLE = "Do the Panicarena";

const OHG_PLATFORM_CONFIG = Object.freeze({
  spotify: Object.freeze({ label: "Spotify", icon: '<i class="fa-brands fa-spotify" aria-hidden="true"></i>' }),
  appleMusic: Object.freeze({ label: "Apple Music", icon: '<i class="fa-brands fa-apple" aria-hidden="true"></i>' }),
  youtube: Object.freeze({
    label: "YouTube Music",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1.5 8.5v-5l4.5 2.5-4.5 2.5z"></path>
    </svg>`
  }),
  amazonMusic: Object.freeze({ label: "Amazon Music", icon: '<i class="fa-brands fa-amazon" aria-hidden="true"></i>' }),
  other: Object.freeze({ label: "YouTube", icon: '<i class="fa-brands fa-youtube" aria-hidden="true"></i>' })
});

const OHG_PLAYLIST_LINKS = Object.freeze({
  spotify: "https://open.spotify.com/playlist/5rAMYPsUmFoq3yoBnIGYQR?si=qw3P1s6eT7OLxatM2zUb3w",
  youtube: "https://music.youtube.com/playlist?list=PLtGnlTqdsNV2QBkI-_1QFuidj3alcuLHF&si=S9qhguENixnuD3Ps",
  other: "https://www.youtube.com/playlist?list=PLtGnlTqdsNV2QBkI-_1QFuidj3alcuLHF"
});

function ohgEscapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ohgCleanShareText(value = "") {
  return String(value)
    .replaceAll("â€™", "’")
    .replaceAll("â€˜", "‘")
    .replaceAll("â€œ", "“")
    .replaceAll("â€", "”")
    .replaceAll("â€”", "—")
    .replaceAll("â€“", "–")
    .replaceAll("Â¡", "¡")
    .replaceAll("Â¿", "¿")
    .replaceAll("Ã¡", "á")
    .replaceAll("Ã©", "é")
    .replaceAll("Ã­", "í")
    .replaceAll("Ã³", "ó")
    .replaceAll("Ãº", "ú")
    .replaceAll("Ã±", "ñ")
    .replaceAll("Ã¨", "è");
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

function ohgGetReleaseTime(releaseDate) {
  if (!releaseDate) return null;

  const releaseTime = Date.parse(releaseDate);
  return Number.isNaN(releaseTime) ? null : releaseTime;
}

function ohgCompareByReleaseDate(songA, songB) {
  if (songA.id === OHG_FEATURED_GRID_SONG_ID && songB.id !== OHG_FEATURED_GRID_SONG_ID) return -1;
  if (songB.id === OHG_FEATURED_GRID_SONG_ID && songA.id !== OHG_FEATURED_GRID_SONG_ID) return 1;

  const releaseTimeA = ohgGetReleaseTime(songA.releaseDate);
  const releaseTimeB = ohgGetReleaseTime(songB.releaseDate);

  if (releaseTimeA !== null && releaseTimeB !== null) return releaseTimeA - releaseTimeB;
  if (releaseTimeA !== null) return -1;
  if (releaseTimeB !== null) return 1;
  return songA.order - songB.order;
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
    audioSrc: version?.audioSrc ?? version?.audio ?? version?.previewSrc ?? null,
    lyrics: version?.lyrics || song.lyrics || "",
    lyricsPath: version?.lyricsPath
      ?? OHG_VERSION_LYRICS_PATHS[`${song.slug ?? song.id}/${version?.slug ?? id}`]
      ?? song.lyricsPath
      ?? OHG_LYRICS_PATHS[song.slug ?? song.id]
      ?? null,
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
    releaseDate: data.releaseDate ?? null,
    art: data.assets?.art ?? data.assets?.cover ?? "",
    cover: data.assets?.cover ?? data.assets?.art ?? "",
    subtitle: data.subtitle ?? data.opaverse?.subtitle ?? "",
    badge: data.badge ?? data.releaseBadge ?? "",
    share: data.share ?? {},
    theme: data.theme,
    defaultVersionIndex: markedDefaultIndex >= 0
      ? markedDefaultIndex
      : Math.max(requestedDefaultIndex, 0),
    versions
  });
}

class OhSongographyManager {
  constructor() {
    this.songs = OH_OPAVERSE_MODULES
      .map(ohgNormalizeSong)
      .sort(ohgCompareByReleaseDate);
    this.activeSongId = null;
    this.activeVersionIndex = 0;
    this.isAnimating = false;
    this.versionPillsExpanded = false;
    this.lyricsCache = new Map();
    this.lyricsRequestId = 0;
    this.lastFocusedElement = null;
    this.grid = null;
    this.detail = null;
    this.detailScroll = null;
    this.heroSlot = null;
    this.rail = null;
    this.railTrack = null;
    this.versionPills = null;
    this.platforms = null;
    this.playlistLinks = null;
    this.lyricsPanel = null;
    this.lyricsText = null;
    this.featuredAudioPlayer = new FeaturedAudioPlayer({
      src: OHG_FEATURED_AUDIO_SRC,
      title: OHG_FEATURED_AUDIO_TITLE
    });
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  mount() {
    this.songography = document.querySelector("#songography");
    this.grid = document.querySelector("#oh-songography-grid");
    this.detail = document.querySelector("#ohg-detail");
    this.detailScroll = document.querySelector("#ohg-detail-scroll");
    this.heroSlot = document.querySelector("#ohg-hero-slot");
    this.rail = document.querySelector("#ohg-rail");
    this.railTrack = document.querySelector("#ohg-rail-track");
    this.versionPills = document.querySelector("#ohg-version-pills");
    this.platforms = document.querySelector("#ohg-platforms");
    this.playlistLinks = document.querySelector("#ohg-playlist-links");
    this.lyricsPanel = document.querySelector("#ohg-lyrics");
    this.lyricsText = document.querySelector("#ohg-lyrics-text");

    if (!this.grid || !this.detail || !this.railTrack) return;

    this.songography?.append(this.detail, this.rail);
    this.featuredAudioPlayer.mount();

    this.renderSongography();
    this.renderPlaylistLinks();
    this.renderRailSlots();
    const count = document.querySelector(".ohg-heading__count");
    if (count) count.textContent = `${this.songs.length} songs`;
    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("hashchange", this.handleLocationChange);
    window.addEventListener("popstate", this.handleLocationChange);
    window.addEventListener("resize", this.handleResize);

    this.cleanLegacyHash();
    window.requestAnimationFrame(() => this.handleLocationChange());
  }

  renderSongography() {
    this.grid.innerHTML = this.songs.map((song) => {
      const releaseCard = song.badge
        ? `<span class="ohg-release-card" aria-hidden="true"><span>${ohgEscapeHtml(song.badge)}</span></span>`
        : "";
      const featuredControls = song.id === OHG_FEATURED_GRID_SONG_ID
        ? this.featuredAudioPlayer.renderControls()
        : "";
      const itemClass = [
        "ohg-grid__item",
        song.id === OHG_FEATURED_GRID_SONG_ID ? "ohg-grid__item--featured" : "",
        song.badge ? "ohg-grid__item--release" : ""
      ].filter(Boolean).join(" ");

      return `
        <div class="${itemClass}" id="ohg-grid-slot-${song.id}">
          ${releaseCard}
          ${featuredControls}
          <button
            class="oh-song-cover ohg-cover ohg-cover--circle"
            id="ohg-cover-${song.id}"
            type="button"
            data-ohg-song-id="${ohgEscapeHtml(song.id)}"
            aria-label="Open ${ohgEscapeHtml(song.title)}"
          >
            <img
              class="ohg-cover__image"
              id="ohg-cover-image-${song.id}"
              src="${ohgEscapeHtml(song.cover)}"
              alt="${ohgEscapeHtml(song.title)} cover"
              width="900"
              height="900"
              loading="lazy"
            >
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

    if (action) {
      const actions = {
        close: () => this.closeSong(),
        share: () => this.shareSong(),
        "previous-song": () => this.navigateSong(-1),
        "next-song": () => this.navigateSong(1),
        "version-audio-play": () => this.playVersionAudio(),
        ...this.featuredAudioPlayer.getActionHandlers()
      };

      if (actions[action.dataset.ohgAction]) {
        actions[action.dataset.ohgAction]();
        return;
      }
    }

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
  }

  handleKeydown(event) {
    if (this.activeSongId === null) return;

    if (event.key === "Escape") this.closeSong();
    if (event.key === "ArrowLeft") this.changeVersion(this.activeVersionIndex - 1);
    if (event.key === "ArrowRight") this.changeVersion(this.activeVersionIndex + 1);
  }

  handleResize() {
    if (this.activeSongId !== null) this.positionRailTray();
  }

  getSong(songId = this.activeSongId) {
    return this.songs.find((song) => song.id === songId) ?? null;
  }

  getSongIndex(songId = this.activeSongId) {
    return this.songs.findIndex((song) => song.id === songId);
  }

  navigateSong(offset) {
    if (this.isAnimating || this.songs.length === 0) return;

    const activeIndex = this.getSongIndex();
    const currentIndex = activeIndex >= 0 ? activeIndex : 0;
    const nextIndex = (currentIndex + offset + this.songs.length) % this.songs.length;
    const nextSong = this.songs[nextIndex];

    if (!nextSong) return;
    if (this.activeSongId === null) {
      this.openSong(nextSong.id);
      return;
    }

    this.changeSong(nextSong.id);
  }

  getVersion(song = this.getSong(), index = this.activeVersionIndex) {
    return song?.versions[index] ?? null;
  }

  setCoverImage(song, imageUrl) {
    const coverImage = document.querySelector(`#ohg-cover-image-${song?.id}`);
    if (coverImage && imageUrl) coverImage.src = imageUrl;
  }

  setCoverToSongArt(song) {
    this.setCoverImage(song, song?.cover);
  }

  setCoverToVersionArt(song, version) {
    this.setCoverImage(song, version?.cover ?? version?.art ?? song?.cover ?? song?.art);
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
    if (!song) return "#songography";

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

    if (!rawSongSlug || rawSongSlug === "songography") return null;

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
    if (window.location.hash === "#oh-songography") {
      this.setLocationHash("#songography", "replace");
      return;
    }

    if (window.location.hash.startsWith("#oh-songography/")) {
      this.setLocationHash(`#${window.location.hash.slice("#oh-songography/".length)}`, "replace");
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

      document.querySelector("#songography")?.scrollIntoView({ block: "start" });

      if (this.activeSongId === null) {
        this.openSong(route.songId, { updateUrl: false, versionIndex: route.versionIndex });
      } else if (this.activeSongId !== route.songId) {
        this.changeSong(route.songId, { updateUrl: false, versionIndex: route.versionIndex });
      } else if (this.activeVersionIndex !== route.versionIndex) {
        this.changeVersion(route.versionIndex, { updateUrl: false });
      }
      return;
    }

    if (window.location.hash === "#songography" && this.activeSongId !== null) {
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
    this.renderLyrics(version);
  }

  renderVersions(song, activeIndex) {
    this.versionPills.classList.toggle("is-collapsed", !this.versionPillsExpanded);
    const activeVersion = this.getVersion(song, activeIndex) ?? this.getVersion(song, 0);
    const activeAudioSrc = activeVersion?.audioSrc ?? (song.id === OHG_FEATURED_GRID_SONG_ID ? OHG_FEATURED_AUDIO_SRC : null);
    const activeAudioButton = activeAudioSrc ? `
      <button
        class="ohg-version-pill__play"
        type="button"
        data-ohg-action="version-audio-play"
        aria-label="Listen to ${ohgEscapeHtml(song.title)}"
      >
        <i class="fa-solid fa-play" aria-hidden="true"></i>
      </button>
    ` : "";
    const secondaryVersions = song.versions
      .map((version, index) => ({ version, index }))
      .filter((entry) => entry.index !== activeIndex)
      .slice(0, 2);
    const activeButton = activeVersion ? `
      <div
        class="ohg-version-pill is-active${activeAudioSrc ? " has-audio" : ""}"
        data-ohg-version-index="${activeIndex}"
        role="button"
        tabindex="0"
        aria-pressed="true"
        style="--ohg-version-stripe: ${ohgEscapeHtml(ohgGetStripeBackground(activeVersion))}"
      >
        <span class="ohg-version-pill__name">${ohgEscapeHtml(activeVersion.name)}</span>
        <span class="ohg-version-pill__duration">${ohgEscapeHtml(activeVersion.duration)}</span>
        ${activeAudioButton}
      </div>
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

  }

  async playVersionAudio() {
    const song = this.getSong();
    const version = this.getVersion(song, this.activeVersionIndex);
    const audioSrc = version?.audioSrc ?? (song?.id === OHG_FEATURED_GRID_SONG_ID ? OHG_FEATURED_AUDIO_SRC : null);
    if (!song || !audioSrc) return;

    await this.featuredAudioPlayer.restart();
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

  getLateContentElements() {
    return [this.platforms, this.lyricsPanel].filter(Boolean);
  }

  hideLateContent(onComplete = null, immediate = false) {
    const gsap = window.gsap;
    const elements = this.getLateContentElements();
    this.detail?.classList.remove("is-content-ready");

    if (!gsap || elements.length === 0 || immediate) {
      gsap?.set(elements, { opacity: 0, y: 8 });
      onComplete?.();
      return;
    }

    gsap.to(elements, {
      opacity: 0,
      y: 8,
      duration: 0.16,
      ease: "power2.in",
      stagger: -0.025,
      onComplete
    });
  }

  showLateContent(onComplete = null) {
    const gsap = window.gsap;
    const elements = this.getLateContentElements();
    this.detail?.classList.add("is-content-ready");

    if (!gsap || elements.length === 0) {
      onComplete?.();
      return;
    }

    gsap.fromTo(elements, {
      opacity: 0,
      y: 10
    }, {
      opacity: 1,
      y: 0,
      duration: 0.26,
      ease: "power2.out",
      stagger: 0.045,
      onComplete
    });
  }

  renderPlatforms(platforms) {
    const platformLinks = Object.entries(OHG_PLATFORM_CONFIG).map(([key, config]) => {
      const url = platforms[key];
      if (!url) {
        return `
          <span
            class="ohg-platform is-disabled"
            aria-label="${config.label} link pending"
            title="${config.label} link pending"
          >
            ${config.icon}
          </span>
        `;
      }

      return `
        <a
          class="ohg-platform"
          href="${ohgEscapeHtml(url)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Listen on ${config.label}"
        >
          ${config.icon}
        </a>
      `;
    }).join("");

    this.platforms.innerHTML = `
      ${platformLinks}
      <span class="ohg-platform-separator" aria-hidden="true"></span>
      <button
        class="ohg-platform ohg-platform--share"
        type="button"
        data-ohg-action="share"
        aria-label="Share song"
      >
        <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
      </button>
    `;
  }

  renderPlaylistLinks() {
    if (!this.playlistLinks) return;

    this.playlistLinks.innerHTML = Object.entries(OHG_PLAYLIST_LINKS).map(([key, url]) => {
      const config = OHG_PLATFORM_CONFIG[key];
      if (!config) return "";

      return `
        <a
          class="ohg-playlist-bar__link"
          href="${ohgEscapeHtml(url)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="OpaHiFi playlist on ${config.label}"
        >
          ${config.icon}
        </a>
      `;
    }).join("");
  }

  async getLyrics(version) {
    if (!version?.lyricsPath) return version?.lyrics || "Lyrics pending";
    if (this.lyricsCache.has(version.lyricsPath)) return this.lyricsCache.get(version.lyricsPath);

    try {
      const lyricsUrl = new URL(version.lyricsPath, window.location.href).href;
      const response = await fetch(lyricsUrl);
      if (!response.ok) throw new Error(`Unable to load ${version.lyricsPath}`);

      const lyricsBuffer = await response.arrayBuffer();
      const lyrics = new TextDecoder("utf-8").decode(lyricsBuffer);
      this.lyricsCache.set(version.lyricsPath, lyrics);
      return lyrics;
    } catch {
      return version?.lyrics || "Lyrics pending";
    }
  }

  async renderLyrics(version) {
    const requestId = ++this.lyricsRequestId;
    this.lyricsText.textContent = "Loading lyrics...";

    const lyrics = await this.getLyrics(version);
    if (requestId !== this.lyricsRequestId) return;

    this.lyricsText.textContent = lyrics;
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
    this.hideLateContent(null, true);
    const state = Flip.getState(".ohg-cover");
    this.detail.classList.add("is-open");
    this.detail.setAttribute("aria-hidden", "false");
    this.songography?.classList.add("is-song-open");
    this.rail.classList.add("is-open");
    this.setRailControlsReady(false);
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
        this.setRailControlsReady(true);
        this.animateVersionPillsIn(() => {
          this.showLateContent(() => {
            this.isAnimating = false;
          });
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

  setRailControlsReady(isReady) {
    this.rail?.classList.toggle("is-controls-ready", isReady);
  }

  setCurrentRailSlot(songId) {
    this.arrangeRailAroundSong(songId);

    this.songs.forEach((song) => {
      const railSlot = document.querySelector(`#ohg-rail-slot-${song.id}`);
      if (!railSlot) return;
      railSlot.classList.toggle("is-current", song.id === songId);
      railSlot.hidden = false;
    });

    this.positionRailTray(songId);
  }

  arrangeRailAroundSong(songId) {
    if (!this.railTrack || this.songs.length === 0) return;

    const activeIndex = this.getSongIndex(songId);
    const centerIndex = Math.floor(this.songs.length / 2);
    const startIndex = (Math.max(activeIndex, 0) - centerIndex + this.songs.length) % this.songs.length;

    for (let index = 0; index < this.songs.length; index += 1) {
      const song = this.songs[(startIndex + index) % this.songs.length];
      const railSlot = document.querySelector(`#ohg-rail-slot-${song.id}`);
      if (railSlot) this.railTrack.append(railSlot);
    }
  }

  positionRailTray(songId = this.activeSongId) {
    const railSlot = document.querySelector(`#ohg-rail-slot-${songId}`);
    if (!this.rail || !this.railTrack || !railSlot) return;

    const railCenter = this.rail.clientWidth / 2;
    const slotCenter = railSlot.offsetLeft + (railSlot.offsetWidth / 2);
    this.railTrack.style.setProperty("--ohg-rail-offset", `${railCenter - slotCenter}px`);
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
      } else {
        this.setCoverToSongArt(song);
        railSlot.append(cover);
      }
    });

    this.setCurrentRailSlot(activeSongId);
  }

  closeSong(options = {}) {
    if (this.isAnimating || this.activeSongId === null) return;

    const gsap = window.gsap;
    const Flip = window.Flip;
    if (!gsap || !Flip) return;

    this.isAnimating = true;
    this.setRailControlsReady(false);
    if (options.updateUrl !== false) this.setLocationHash("#songography", "replace");
    this.detail.classList.add("is-leaving");
    this.hideLateContent(() => this.animateVersionPillsOut(() => {
      this.disableRailClipping();
      const travellingCovers = document.querySelectorAll(".ohg-cover");
      travellingCovers.forEach((cover) => cover.classList.add("ohg-cover--travelling"));
      const state = Flip.getState(".ohg-cover");
      this.songography?.classList.remove("is-song-open");

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
        railSlot.classList.remove("is-current");
      });

      this.railTrack?.style.removeProperty("--ohg-rail-offset");

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
          this.detail.classList.remove("is-open", "is-leaving", "is-content-ready");
          this.detail.setAttribute("aria-hidden", "true");
          this.rail.classList.remove("is-open");
          this.activeSongId = null;
          this.activeVersionIndex = 0;
          this.isAnimating = false;
          this.lastFocusedElement?.focus?.({ preventScroll: true });
        }
      });
    }));
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
    this.hideLateContent(() => this.animateVersionPillsOut(() => {
      this.disableRailClipping();
      const travellingCovers = document.querySelectorAll(".ohg-cover");
      travellingCovers.forEach((cover) => cover.classList.add("ohg-cover--travelling"));
      const state = Flip.getState(".ohg-cover");
      const oldCover = document.querySelector(`#ohg-cover-${oldSong.id}`);
      const newCover = document.querySelector(`#ohg-cover-${newSong.id}`);
      const oldRailSlot = document.querySelector(`#ohg-rail-slot-${oldSong.id}`);
      const newRailSlot = document.querySelector(`#ohg-rail-slot-${newSong.id}`);

      oldRailSlot.hidden = false;
      oldRailSlot.classList.remove("is-current");
      oldRailSlot.append(oldCover);
      oldCover.classList.remove("ohg-cover--detail");
      oldCover.classList.add("ohg-cover--circle");
      this.setCoverToSongArt(oldSong);

      this.heroSlot.append(newCover);
      newCover.classList.remove("ohg-cover--circle");
      newCover.classList.add("ohg-cover--detail");
      this.setCoverToVersionArt(newSong, this.getVersion(newSong, versionIndex));
      newRailSlot.hidden = false;

      this.activeSongId = songId;
      this.activeVersionIndex = versionIndex;
      this.versionPillsExpanded = false;
      this.setCurrentRailSlot(songId);
      if (options.updateUrl !== false) this.setLocationHash(this.getSongHash(songId, versionIndex));

      this.updateDetail(newSong, versionIndex, false);

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
            this.showLateContent(() => {
              this.isAnimating = false;
            });
          });
        }
      });
    }));
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

  getSharePageUrl(song, version) {
    const songSlug = song?.slug ?? ohgSlugify(song?.title) ?? song?.id;
    const defaultVersion = this.getVersion(song, this.getDefaultVersionIndex(song));
    const isDefaultVersion = !version || version === defaultVersion || version.isDefault;
    const versionToken = isDefaultVersion ? null : ohgSlugify(version?.name ?? version?.slug ?? version?.id);
    const sharePath = versionToken ? `/s/${songSlug}/${versionToken}` : `/s/${songSlug}`;

    return new URL(sharePath, OHG_SHARE_ORIGIN).toString();
  }

  async shareSong() {
    const song = this.getSong();
    if (!song) return;

    const version = this.getVersion(song, this.activeVersionIndex);
    const isDefaultVersion = this.activeVersionIndex === this.getDefaultVersionIndex(song);
    const shareUrl = song.share.url ?? this.getSharePageUrl(song, version);
    const shareTitle = song.share.title
      ?? (version && !isDefaultVersion && !ohgIsOriginalVersion(version) ? `${song.title} - ${version.name}` : song.title);
    const shareData = {
      title: ohgCleanShareText(shareTitle),
      text: ohgCleanShareText(song.share.text ?? `Listen to ${song.title} by OpaHiFi`),
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
    const shareButton = document.querySelector('[data-ohg-action="share"]');
    if (!shareButton) return;

    const previousLabel = shareButton.getAttribute("aria-label") ?? "Share song";
    shareButton.setAttribute("aria-label", message);
    shareButton.title = message;
    window.setTimeout(() => {
      shareButton.setAttribute("aria-label", previousLabel);
      shareButton.removeAttribute("title");
    }, 1400);
  }

  destroy() {
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("hashchange", this.handleLocationChange);
    window.removeEventListener("popstate", this.handleLocationChange);
    this.featuredAudioPlayer.destroy();
  }
}

export const ohSongographyManager = new OhSongographyManager();
