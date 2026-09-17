import { OH_SONG_SETTINGS } from "../opaverses/catalog.config.js";
import { ohSongographyManager } from "./songography-manager.js";

if (!document.querySelector("link[data-ohg-recs-style]")) {
  const recsStyles = document.createElement("link");
  recsStyles.rel = "stylesheet";
  recsStyles.href = new URL("../styles/songography-recs.css", import.meta.url).href;
  recsStyles.dataset.ohgRecsStyle = "true";
  document.head.append(recsStyles);
}

const OHG_SEEN_STORAGE_KEY = "ohg-seen-songs";
const OHG_RECOMMENDATION_COUNT = 3;
const OHG_VISIBLE_MIX_STRIPES = 2;

function ohgEscapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function ohgStripeBackground(version) {
  const colors = Array.isArray(version?.stripeColors) ? version.stripeColors.filter(Boolean) : [];
  if (colors.length >= 2) return `linear-gradient(90deg, ${colors.join(", ")})`;
  if (colors.length === 1) return String(colors[0]);
  return "linear-gradient(90deg, #ffffff 0%, #f8fafc 52%, #ffffff 100%)";
}

function ohgReadSeenSongIds() {
  try {
    const raw = window.localStorage.getItem(OHG_SEEN_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

function ohgWriteSeenSongIds(seenIds) {
  try {
    window.localStorage.setItem(OHG_SEEN_STORAGE_KEY, JSON.stringify([...seenIds]));
  } catch {
    // Ignore private-mode / blocked storage.
  }
}

function ohgEnsureSeenSet(manager) {
  if (!(manager.seenSongIds instanceof Set)) {
    manager.seenSongIds = ohgReadSeenSongIds();
  }
  return manager.seenSongIds;
}

const proto = Object.getPrototypeOf(ohSongographyManager);
const originalMount = proto.mount;
const originalOpenSong = proto.openSong;
const originalChangeSong = proto.changeSong;
const originalRenderVersions = proto.renderVersions;
const originalHandleClick = proto.handleClick;

proto.mount = function mount() {
  const result = originalMount.call(this);

  if (this.detail && !this.detail.querySelector(".ohg-detail__back")) {
    this.detail.insertAdjacentHTML("afterbegin", `
      <button class="ohg-detail__back" type="button" data-ohg-action="close" aria-label="Back to Songography">
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        <span>Back</span>
      </button>
    `);
  }

  const versionNav = this.detail?.querySelector(".ohg-version-nav");
  const hero = this.detail?.querySelector(".ohg-detail__hero");
  if (versionNav && hero && versionNav.previousElementSibling !== hero) {
    hero.before(versionNav);
  }

  if (this.rail) {
    this.rail.setAttribute("aria-label", "Also spin");
    this.rail.querySelectorAll(".ohg-rail__button, .ohg-rail__close").forEach((element) => element.remove());
    if (!this.rail.querySelector(".ohg-rail__label")) {
      this.rail.insertAdjacentHTML("afterbegin", '<p class="ohg-rail__label">Also spin</p>');
    }
  }

  return result;
};

proto.renderVersionStripes = function renderVersionStripes(song, activeIndex) {
  if (!this.versionPills || !song) return;

  const versions = Array.isArray(song.versions) ? song.versions : [];
  const expanded = Boolean(this.versionListExpanded);
  const ordered = versions
    .map((version, index) => ({ version, index }))
    .sort((entryA, entryB) => {
      if (entryA.index === activeIndex) return -1;
      if (entryB.index === activeIndex) return 1;
      return entryA.index - entryB.index;
    });

  const visibleLimit = expanded ? ordered.length : Math.min(OHG_VISIBLE_MIX_STRIPES, ordered.length);
  const visible = ordered.slice(0, visibleLimit);
  const hiddenCount = Math.max(0, ordered.length - visibleLimit);

  const stripes = visible.map(({ version, index }) => {
    const isActive = index === activeIndex;
    const tag = isActive ? "div" : "button";
    const typeAttr = isActive ? "" : " type=\"button\"";
    return `
      <${tag}
        class="ohg-version-pill${isActive ? " is-active" : ""}"
        ${typeAttr}
        data-ohg-version-index="${index}"
        role="button"
        tabindex="0"
        aria-pressed="${isActive ? "true" : "false"}"
        style="--ohg-version-stripe: ${ohgEscapeHtml(ohgStripeBackground(version))}"
      >
        <span class="ohg-version-pill__name">${ohgEscapeHtml(version.name)}</span>
        <span class="ohg-version-pill__duration">${ohgEscapeHtml(version.duration)}</span>
      </${tag}>
    `;
  }).join("");

  const overflow = hiddenCount > 0
    ? `<button class="ohg-version-others" type="button" data-ohg-action="toggle-version-others">+${hiddenCount} mix${hiddenCount === 1 ? "" : "es"}</button>`
    : expanded && versions.length > OHG_VISIBLE_MIX_STRIPES
      ? `<button class="ohg-version-others" type="button" data-ohg-action="toggle-version-others">Show less</button>`
      : "";

  this.versionPills.innerHTML = `${stripes}${overflow}`;
  this.versionPills.classList.remove("is-collapsed");

  const rowCount = visible.length + (overflow ? 1 : 0);
  this.detail?.querySelector(".ohg-detail__body")?.style.setProperty(
    "--ohg-stripe-count",
    String(Math.max(rowCount, 1))
  );
};

proto.renderVersions = function renderVersions(song, activeIndex) {
  const result = originalRenderVersions.call(this, song, activeIndex);
  this.renderVersionStripes(song, activeIndex);
  return result;
};

proto.handleClick = function handleClick(event) {
  const overflowButton = event.target.closest("[data-ohg-action=\"toggle-version-others\"]");
  if (overflowButton) {
    this.versionListExpanded = !this.versionListExpanded;
    const song = this.getSong();
    if (song) this.renderVersionStripes(song, this.activeVersionIndex);
    return;
  }
  return originalHandleClick.call(this, event);
};

proto.markSongSeen = function markSongSeen(songId) {
  if (!songId) return;
  const seen = ohgEnsureSeenSet(this);
  seen.add(songId);
  ohgWriteSeenSongIds(seen);
};

proto.getRecommendationSongs = function getRecommendationSongs(songId = this.activeSongId) {
  const available = this.songs.filter((song) => song.id !== songId);
  const availableIds = new Set(available.map((song) => song.id));
  const seen = ohgEnsureSeenSet(this);
  const picked = [];

  const pick = (id) => {
    if (!availableIds.has(id) || picked.includes(id)) return;
    picked.push(id);
  };

  const related = OH_SONG_SETTINGS[songId]?.related ?? [];
  const unseenRelated = [];
  const seenRelated = [];
  for (const id of related) {
    if (!availableIds.has(id)) continue;
    if (seen.has(id)) seenRelated.push(id);
    else unseenRelated.push(id);
  }
  unseenRelated.concat(seenRelated).forEach(pick);

  if (picked.length < OHG_RECOMMENDATION_COUNT) {
    available
      .map((song) => song.id)
      .filter((id) => !picked.includes(id))
      .sort((idA, idB) => Number(seen.has(idA)) - Number(seen.has(idB)))
      .forEach(pick);
  }

  return picked
    .slice(0, OHG_RECOMMENDATION_COUNT)
    .map((id) => this.getSong(id))
    .filter(Boolean);
};

proto.arrangeRailAroundSong = function arrangeRailAroundSong(songId) {
  if (!this.railTrack || this.songs.length === 0) return;

  const recommended = this.getRecommendationSongs(songId);
  const recommendedIds = new Set(recommended.map((song) => song.id));

  recommended.forEach((song) => {
    const railSlot = document.querySelector(`#ohg-rail-slot-${song.id}`);
    if (railSlot) this.railTrack.append(railSlot);
  });

  this.songs.forEach((song) => {
    if (recommendedIds.has(song.id)) return;
    const railSlot = document.querySelector(`#ohg-rail-slot-${song.id}`);
    if (railSlot) this.railTrack.append(railSlot);
  });
};

proto.setCurrentRailSlot = function setCurrentRailSlot(songId) {
  this.arrangeRailAroundSong(songId);

  const recommendedIds = new Set(this.getRecommendationSongs(songId).map((song) => song.id));

  this.songs.forEach((song) => {
    const railSlot = document.querySelector(`#ohg-rail-slot-${song.id}`);
    if (!railSlot) return;
    const isCurrent = song.id === songId;
    const isRecommendation = recommendedIds.has(song.id);
    railSlot.classList.toggle("is-current", isCurrent);
    railSlot.classList.toggle("is-recommendation", isRecommendation);
    railSlot.hidden = !isRecommendation;
  });

  this.positionRailTray(songId);
};

proto.positionRailTray = function positionRailTray() {
  this.railTrack?.style.setProperty("--ohg-rail-offset", "0px");
};

proto.openSong = function openSong(songId, options = {}) {
  this.versionListExpanded = false;
  this.markSongSeen(songId);
  return originalOpenSong.call(this, songId, options);
};

proto.changeSong = function changeSong(songId, options = {}) {
  this.versionListExpanded = false;
  this.markSongSeen(songId);
  return originalChangeSong.call(this, songId, options);
};

export { ohSongographyManager as ohSongographyRecs };
