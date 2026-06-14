/**
 * BottomNavController
 * Manages the bottom nav bar across different modes (gallery, universe, etc.)
 * Each mode can define: count, labels, wrap, onChange, onHome, onPrev, onNext
 */
export class BottomNavController {
  constructor({ root = document.documentElement, backButton, homeButton, nextButton, backText, nextText, dots = [], modes = {}, mode = 'gallery' } = {}) {
    this.root = root;
    this.backButton = backButton;
    this.homeButton = homeButton;
    this.nextButton = nextButton;
    this.backText = backText;
    this.nextText = nextText;
    this.dotsContainer = dots?.parentElement || null;
    this.dots = Array.from(dots);
    this.modes = modes;
    this.mode = mode;
    this.index = 0;
  }

  init() {
    this.backButton?.addEventListener('click', e => { e.stopPropagation(); this.prev(); });
    this.homeButton?.addEventListener('click', e => { e.stopPropagation(); this.getMode().onHome?.(); });
    this.nextButton?.addEventListener('click', e => { e.stopPropagation(); this.next(); });
    this.sync();
  }

  getMode() {
    return this.modes[this.mode] || {};
  }

  configureMode(mode, config = {}) {
    this.modes[mode] = { ...(this.modes[mode] || {}), ...config };
    if (mode === this.mode) this.sync();
  }

  setMode(mode, index = 0) {
    this.mode = mode;
    this.setIndex(index, { force: true });
  }

  setState({ mode = this.mode, index = this.index, count, labels, wrap } = {}) {
    if (mode !== this.mode) this.mode = mode;
    const modeConfig = this.getMode();
    if (typeof count === 'number') modeConfig.count = count;
    if (labels) modeConfig.labels = { ...(modeConfig.labels || {}), ...labels };
    if (typeof wrap === 'boolean') modeConfig.wrap = wrap;
    this.setIndex(index, { force: true });
  }

  setIndex(index, { force = false } = {}) {
    const modeConfig = this.getMode();
    const count = Math.max(1, modeConfig.count || 1);
    const wrap = modeConfig.wrap !== false;
    let next = wrap
      ? ((index % count) + count) % count
      : Math.max(0, Math.min(count - 1, index));

    if (!force && next === this.index) { this.sync(); return; }
    this.index = next;
    this.sync();
    modeConfig.onChange?.(this.index);
  }

  reset() { this.setIndex(0, { force: true }); }

  prev() {
    const modeConfig = this.getMode();
    if (modeConfig.onPrev) { modeConfig.onPrev(this.index); return; }
    this.setIndex(this.index - 1);
  }

  next() {
    const modeConfig = this.getMode();
    if (modeConfig.onNext) { modeConfig.onNext(this.index); return; }
    this.setIndex(this.index + 1);
  }

  renderDots(count) {
    if (!this.dotsContainer || this.dots.length === count) return;
    this.dotsContainer.replaceChildren();
    this.dots = Array.from({ length: count }, () => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      this.dotsContainer.appendChild(dot);
      return dot;
    });
  }

  sync() {
    const modeConfig = this.getMode();
    const count = Math.max(1, modeConfig.count || 1);
    const labels = modeConfig.labels || {};

    this.renderDots(count);
    this.root.style.setProperty('--slide-index', this.index);

    const resolve = (label) => typeof label === 'function' ? label(this.index) : label;
    if (this.backText) this.backText.innerText = resolve(labels.back) || 'PREV';
    if (this.nextText) this.nextText.innerText = resolve(labels.next) || 'NEXT';

    const atStart = this.index <= 0;
    const atEnd = this.index >= count - 1;
    this.nextButton?.classList.toggle('disabled', modeConfig.wrap === false && atEnd);
    this.backButton?.classList.toggle('disabled', modeConfig.wrap === false && atStart);

    this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.index));
  }
}
