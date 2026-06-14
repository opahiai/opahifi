/**
 * main.js
 * Bootstraps the OpaHiFi journey map.
 * Imports are resolved by a bundler (e.g. Vite/esbuild) or replaced with
 * inline <script type="module"> imports in the HTML.
 */

import { BottomNavController } from './BottomNavController.js';
import { SongPillNav }         from './SongPillNav.js';
import { buildOrbCards }       from './cardRenderer.js';
import { drawPath, initSettingsPanel } from './svgPath.js';
import { getSongIndexFromUrl, setSongUrl, clearSongUrl } from './urlState.js';

// ─────────────────────────────────────────────
// DOM references
// ─────────────────────────────────────────────
const layoutWrapper = document.getElementById('layout-wrapper');
const nodesWrapper  = document.getElementById('nodes-wrapper');
const crispArt      = document.getElementById('universe-crisp-art');
const underlayImg   = document.getElementById('universe-underlay-img');
const songNodeRow   = document.getElementById('song-node-row');

const orbs = Array.from(document.querySelectorAll('.journey-orb'));

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────
let currentSongIndex    = -1;
let currentUniverseIndex = -1;

const MAX_SLIDES = 2;

// ─────────────────────────────────────────────
// popIn → .animated handoff
// Fires once per orb after its CSS animation ends.
// ─────────────────────────────────────────────
orbs.forEach(orb => {
  orb.addEventListener('animationend', () => orb.classList.add('animated'), { once: true });
});

// ─────────────────────────────────────────────
// SVG path
// ─────────────────────────────────────────────
const redraw = () => drawPath(orbs);
window.addEventListener('load', () => setTimeout(redraw, 2100)); // after last popIn
window.addEventListener('resize', redraw);

// ─────────────────────────────────────────────
// Settings panel
// ─────────────────────────────────────────────
const settings = initSettingsPanel(orbs, redraw);

// ─────────────────────────────────────────────
// Bottom nav
// ─────────────────────────────────────────────
const bottomNav = new BottomNavController({
  backButton: document.getElementById('nav-back'),
  homeButton: document.getElementById('nav-home'),
  nextButton: document.getElementById('nav-next'),
  backText:   document.getElementById('nav-back-text'),
  nextText:   document.getElementById('nav-next-text'),
  dots:       document.querySelectorAll('.carousel-dot'),
  modes: {
    gallery: {
      count: 1,
      labels: { back: 'PREV', next: 'NEXT' },
      onHome: () => closeSongView(),
    },
    universe: {
      count: MAX_SLIDES + 1,
      labels: {
        back: index => index === 0 ? 'HUB' : 'BACK',
        next: 'NEXT',
      },
      wrap: false,
      onHome: () => closeUniverse(),
      onChange: index => document.documentElement.style.setProperty('--slide-index', index),
      onPrev: index => {
        if (index === 0) {
          layoutWrapper.classList.remove('universe-active');
          layoutWrapper.classList.add('song-active');
          if (currentUniverseIndex !== -1) {
            orbs[currentUniverseIndex].classList.remove('hero-mode');
            openSongView(currentUniverseIndex, { fromNav: true });
          }
          return;
        }
        bottomNav.setIndex(index - 1);
      },
    },
  },
});
bottomNav.init();

// ─────────────────────────────────────────────
// Song pill nav (Videos / Gallery / About)
// ─────────────────────────────────────────────
const songPillNav = new SongPillNav({
  left:   document.getElementById('map-left-btn'),
  center: document.getElementById('map-center-btn'),
  right:  document.getElementById('map-right-btn'),
  onPrev: () => openSongView(currentSongIndex - 1, { fromNav: true }),
  onHome: () => closeSongView(),
  onNext: () => openSongView(currentSongIndex + 1, { fromNav: true }),
});
songPillNav.init();

// ─────────────────────────────────────────────
// Song node thumbnails (footer strip)
// ─────────────────────────────────────────────
const songNodes = orbs.map((orb, index) => {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'song-node';
  node.title = orb.dataset.title || `Song ${index + 1}`;
  node.setAttribute('aria-label', node.title);

  const imgSrc = orb.querySelector('.orb-img-wrapper img')?.getAttribute('src');
  if (imgSrc) {
    node.innerHTML = `
      <span class="song-node-img-crop">
        <span class="song-node-img-wrapper">
          <img src="${imgSrc}" alt="">
        </span>
      </span>
    `;
  }

  node.addEventListener('click', e => {
    e.stopPropagation();
    openSongView(index, { fromNav: true });
  });

  songNodeRow?.appendChild(node);
  return node;
});

function syncSongNodes(activeIndex) {
  songNodes.forEach((node, i) => {
    const isActive = i === activeIndex;
    node.classList.toggle('active', isActive);
    if (window.gsap) {
      window.gsap.to(node, { scale: isActive ? 1.18 : 1, duration: 0.24, ease: 'back.out(1.7)', overwrite: true });
    }
  });
}

// ─────────────────────────────────────────────
// Card HTML injection
// ─────────────────────────────────────────────
buildOrbCards(orbs, window.musicDataGrouped);

// ─────────────────────────────────────────────
// View controllers
// ─────────────────────────────────────────────
function openUniverse(index) {
  currentUniverseIndex = index;
  bottomNav.setMode('universe', 0);

  const imgSrc = orbs[index].querySelector('img').src;
  crispArt.style.backgroundImage  = `url(${imgSrc})`;
  underlayImg.style.backgroundImage = `url(${imgSrc})`;

  layoutWrapper.classList.remove('song-active');
  layoutWrapper.classList.add('universe-active');
}

function closeUniverse({ updateUrl = true } = {}) {
  layoutWrapper.classList.remove('universe-active', 'hub-active', 'song-active');
  nodesWrapper.classList.remove('has-expanded');
  orbs.forEach(o => o.classList.remove('hero-mode', 'expanded'));

  currentUniverseIndex = -1;
  currentSongIndex     = -1;

  songPillNav.setMode('gallery');
  bottomNav.setMode('gallery', 0);
  layoutWrapper.classList.add('page-ready');
  if (updateUrl) clearSongUrl();
}

function closeSongView({ updateUrl = true } = {}) {
  layoutWrapper.classList.remove('song-active', 'hub-active', 'universe-active');
  nodesWrapper.classList.remove('has-expanded');
  orbs.forEach(o => o.classList.remove('hero-mode', 'expanded'));

  currentSongIndex     = -1;
  currentUniverseIndex = -1;

  syncSongNodes(-1);
  songPillNav.setMode('gallery');
  bottomNav.setMode('gallery', 0);
  layoutWrapper.classList.add('page-ready');
  if (updateUrl) clearSongUrl();
}

function openSongView(index, { fromNav = false, updateUrl = true } = {}) {
  index = ((index % orbs.length) + orbs.length) % orbs.length;
  const orb = orbs[index];
  if (!orb) return;

  currentSongIndex     = index;
  currentUniverseIndex = index;

  orbs.forEach(o => o.classList.remove('expanded', 'hero-mode'));
  orb.classList.add('expanded');
  nodesWrapper.classList.add('has-expanded');

  layoutWrapper.classList.add('hub-active', 'song-active');
  layoutWrapper.classList.remove('universe-active');

  syncSongNodes(index);
  songPillNav.setMode('song');
  bottomNav.setMode('gallery', 0);

  if (updateUrl) setSongUrl(orbs, index);
}

// ─────────────────────────────────────────────
// Orb click handler
// ─────────────────────────────────────────────
orbs.forEach((orb, idx) => {
  orb.addEventListener('click', e => {
    if (layoutWrapper.classList.contains('universe-active')) return;

    // "Enter Universe" button — zoom orb to fill screen, then open universe
    if (e.target.closest('.enter-btn')) {
      e.stopPropagation();
      orb.classList.add('hero-mode');
      setTimeout(() => openUniverse(idx), 900);
      return;
    }

    // Clicks inside the version list / platform icons don't toggle the card
    if (e.target.closest('.versions-list') || e.target.closest('.platform-icons')) return;

    orb.classList.contains('expanded') ? closeSongView() : openSongView(idx);
  });
});

// ─────────────────────────────────────────────
// Global click — close settings panel and song cards
// ─────────────────────────────────────────────
document.addEventListener('click', e => {
  if (!settings.isPanelTarget(e.target)) settings.closePanel();
  if (!e.target.closest('.journey-orb, .song-view-footer') && !layoutWrapper.classList.contains('universe-active')) {
    closeSongView();
  }
});

// ─────────────────────────────────────────────
// Browser back/forward
// ─────────────────────────────────────────────
window.addEventListener('popstate', () => {
  const idx = getSongIndexFromUrl(orbs);
  idx >= 0
    ? openSongView(idx, { fromNav: true, updateUrl: false })
    : closeSongView({ updateUrl: false });
});

// ─────────────────────────────────────────────
// Deep-link on initial load
// ─────────────────────────────────────────────
const initialIndex = getSongIndexFromUrl(orbs);
if (initialIndex >= 0) {
  openSongView(initialIndex, { fromNav: true, updateUrl: false });
}
