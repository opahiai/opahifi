/**
 * Card rendering
 * Builds the expanded card HTML for each orb based on musicData.
 */

const escapeHtml = str => String(str || '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function getVersionLabel(song) {
  return song.version || 'Main Version';
}

function displayPlatformName(platform) {
  return platform === 'Other' ? 'YouTube' : platform;
}

function renderMixColorVars(song) {
  const colors = (Array.isArray(song.mixColors) ? song.mixColors : []).filter(Boolean);
  if (!colors.length) return '';
  const vars = colors.map((c, i) => `--mix-color-${i + 1}:${escapeHtml(c)}`);
  if (colors.length === 2) vars.push(`--mix-color-3:${escapeHtml(colors[1])}`);
  vars.push(`--version-glow-bg:linear-gradient(180deg, ${colors.map(escapeHtml).join(', ')})`);
  vars.push('--version-chevron-color:#000');
  return ` style="${vars.join(';')}"`;
}

function renderPlatformIcons(song, platformOrder, platformIcons) {
  const label = getVersionLabel(song);
  return platformOrder.map(platform => {
    const displayName = displayPlatformName(platform);
    const url  = song.links?.[platform] || '';
    const icon = platformIcons[platform];
    const inner = icon
      ? `<img src="${icon}" alt="" aria-hidden="true">`
      : `<i class="fa-solid fa-link" aria-hidden="true"></i>`;
    const attrs = `class="platform-icon${url ? '' : ' is-disabled'}"
      title="${displayName}"
      aria-label="${escapeHtml(url ? `${label} on ${displayName}` : `${displayName} unavailable`)}"`;
    return url
      ? `<a ${attrs} href="${escapeHtml(url)}" target="_blank" rel="noopener">${inner}</a>`
      : `<span ${attrs} aria-disabled="true">${inner}</span>`;
  }).join('');
}

function renderVersionRows(group, singlesById, platformOrder, platformIcons) {
  const songs = (group?.songIds || []).map(id => singlesById[id]).filter(Boolean);
  if (!songs.length) return '<div class="version-empty">No versions yet</div>';

  return songs.map(song => {
    const label = getVersionLabel(song);
    const image = song.image || group.cover || 'img/music/opahifi_album.png';
    return `
      <div class="version-row"${renderMixColorVars(song)}>
        <img class="version-art" src="${escapeHtml(image)}" alt="${escapeHtml(`${song.title || group.title} ${label} cover`)}">
        <div class="version-body">
          <div class="version-name">${escapeHtml(label)}</div>
          <div class="platform-icons">${renderPlatformIcons(song, platformOrder, platformIcons)}</div>
        </div>
        <div class="version-glow-end" aria-hidden="true">
          <span class="version-chevron">&rsaquo;</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Injects the expanded card UI into each orb element.
 * @param {HTMLElement[]} orbs
 * @param {Object} musicData  - window.musicDataGrouped shape
 */
export function buildOrbCards(orbs, musicData = {}) {
  const platformOrder = Array.isArray(musicData.platformOrder) ? musicData.platformOrder : [];
  const platformIcons = musicData.platformIcons || {};
  const singlesById   = musicData.singlesById || {};
  const musicGroups   = Object.fromEntries((musicData.groups || []).map(g => [g.key, g]));

  orbs.forEach(orb => {
    const group        = musicGroups[orb.dataset.groupKey];
    const versionCount = Array.isArray(group?.songIds) ? group.songIds.length : 0;
    const titleRaw     = orb.dataset.title || '';

    orb.insertAdjacentHTML('beforeend', `
      <div class="expanded-ui">
        <div class="card-header">
          <div class="card-title">${titleRaw}</div>
          <div class="card-subtitle">${versionCount} Version${versionCount === 1 ? '' : 's'}</div>
        </div>
        <div class="versions-list">
          ${renderVersionRows(group, singlesById, platformOrder, platformIcons)}
        </div>
      </div>
      <button class="enter-btn">ENTER UNIVERSE</button>
    `);
  });
}
