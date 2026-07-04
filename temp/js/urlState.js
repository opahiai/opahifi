/**
 * URL utilities for song view state
 * Syncs the current song to URL params without full page reloads.
 */

const PARAM_GROUP   = 'pl3';
const PARAM_VERSION = 'pl3s';
const PARAM_LEGACY  = 'song';

/** Returns the song group key from the current URL, or empty string. */
export function getSongKeyFromUrl() {
  const url = new URL(window.location.href);
  const param = url.searchParams.get(PARAM_GROUP) || url.searchParams.get(PARAM_LEGACY);
  if (param) return param;

  const parts = url.pathname.split('/').filter(Boolean);
  const idx = parts.indexOf('s');
  return idx >= 0 ? decodeURIComponent(parts[idx + 1] || '') : '';
}

/** Returns the orb index matching the URL key, or -1. */
export function getSongIndexFromUrl(orbs) {
  const key = getSongKeyFromUrl();
  if (!key) return -1;
  return orbs.findIndex(orb => orb.dataset.groupKey === key);
}

/** Pushes (or replaces) a song URL state. */
export function setSongUrl(orbs, index, { replace = false } = {}) {
  if (!window.history?.pushState) return;
  const groupKey = orbs[index]?.dataset.groupKey;
  if (!groupKey) return;

  const url = new URL(window.location.href);
  url.searchParams.set(PARAM_GROUP, groupKey);
  url.searchParams.delete(PARAM_VERSION);
  url.searchParams.delete(PARAM_LEGACY);
  url.hash = '';

  const state = { view: 'song', groupKey, index };
  if (url.href === window.location.href) { window.history.replaceState(state, '', url); return; }
  window.history[replace ? 'replaceState' : 'pushState'](state, '', url);
}

/** Clears song params from the URL. */
export function clearSongUrl({ replace = false } = {}) {
  if (!window.history?.pushState) return;

  const url = new URL(window.location.href);
  const hadParam = [PARAM_GROUP, PARAM_VERSION, PARAM_LEGACY].some(p => url.searchParams.has(p));
  [PARAM_GROUP, PARAM_VERSION, PARAM_LEGACY].forEach(p => url.searchParams.delete(p));
  url.hash = '';

  if (!hadParam || url.href === window.location.href) return;
  window.history[replace ? 'replaceState' : 'pushState']({ view: 'gallery' }, '', url);
}
