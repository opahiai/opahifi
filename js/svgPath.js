/**
 * Journey SVG path
 * Draws and animates the glow line connecting all orb nodes.
 */

/** Computes a smooth cubic bezier path through all orbs. */
function buildPathData(orbs) {
  return orbs.reduce((d, orb, i) => {
    const x = orb.offsetLeft;
    const y = orb.offsetTop;
    if (i === 0) return `M ${x} ${y} `;
    const px = orbs[i - 1].offsetLeft;
    const py = orbs[i - 1].offsetTop;
    const midY = py + (y - py) / 2;
    return d + `C ${px} ${midY}, ${x} ${midY}, ${x} ${y} `;
  }, '');
}

/** Draws the SVG path and triggers the dash animation. */
export function drawPath(orbs) {
  const path = document.getElementById('glow-line');
  if (!path || !orbs.length) return;

  path.setAttribute('d', buildPathData(orbs));
  const length = path.getTotalLength();
  path.style.transition = 'none';
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect(); // force reflow
  path.style.transition = 'stroke-dashoffset 2s ease-in-out';
  path.style.strokeDashoffset = '0';
}

/**
 * Settings panel (orb size slider)
 */
export function initSettingsPanel(orbs, onResize) {
  const btn    = document.getElementById('settings-btn');
  const panel  = document.getElementById('settings-panel');
  const slider = document.getElementById('size-slider');

  btn?.addEventListener('click', e => {
    e.stopPropagation();
    panel?.classList.toggle('active');
  });

  slider?.addEventListener('input', e => {
    document.documentElement.style.setProperty('--orb-scale', e.target.value);
    onResize?.();
  });

  return {
    closePanel: () => panel?.classList.remove('active'),
    isPanelTarget: (target) => panel?.contains(target) || btn?.contains(target),
  };
}
