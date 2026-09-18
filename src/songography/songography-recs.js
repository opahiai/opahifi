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

  if (this.rail) {
    this.rail.setAttribute("aria-label", "Also spin");
    this.rail.querySelectorAll(".ohg-rail__button, .ohg-rail__close").forEach((element) => element.remove());
    if (!this.rail.querySelector(".ohg-rail__label")) {
      this.rail.insertAdjacentHTML("afterbegin", '<p class="ohg-rail__label">Also spin</p>');
    }
  }

  return result;
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
  this.markSongSeen(songId);
  return originalOpenSong.call(this, songId, options);
};

proto.changeSong = function changeSong(songId, options = {}) {
  this.markSongSeen(songId);
  return originalChangeSong.call(this, songId, options);
};

export { ohSongographyManager as ohSongographyRecs };
