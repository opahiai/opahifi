/**
 * SongPillNav
 * Controls the three pill buttons in the map footer (Videos / Gallery / About)
 * and repurposes them as Prev / Home / Next when a song card is open.
 */
export class SongPillNav {
  constructor({ left, center, right, onPrev, onHome, onNext } = {}) {
    this.buttons = { left, center, right };
    this.labels = {
      gallery: ['Videos', 'Gallery', 'About'],
      song:    ['Prev',   'Home',    'Next'],
    };
    this.mode = 'gallery';
    this.onPrev = onPrev;
    this.onHome = onHome;
    this.onNext = onNext;
  }

  init() {
    this.buttons.left?.addEventListener('click', e => {
      if (this.mode !== 'song') return;
      e.stopPropagation();
      this.onPrev?.();
    });
    this.buttons.center?.addEventListener('click', e => {
      if (this.mode !== 'song') return;
      e.stopPropagation();
      this.onHome?.();
    });
    this.buttons.right?.addEventListener('click', e => {
      if (this.mode !== 'song') return;
      e.stopPropagation();
      this.onNext?.();
    });
  }

  setMode(mode) {
    this.mode = mode;
    const labels = this.labels[mode] || this.labels.gallery;
    Object.values(this.buttons).forEach((btn, i) => {
      if (!btn) return;
      btn.textContent = labels[i];
      btn.classList.toggle('active', i === 1);
    });
  }
}
