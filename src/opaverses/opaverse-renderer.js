import { OH_OPAVERSE_MODULES } from "./opaverse.registry.js";

export function ohRenderOpaverses() {
  const mount = document.querySelector("#oh-opaverses");
  if (!mount) return;
  mount.innerHTML = OH_OPAVERSE_MODULES.map((module) => module.render()).join("");
}

export function ohRenderGallery() {
  const mount = document.querySelector("#oh-gallery-grid");
  if (!mount) return;

  mount.innerHTML = OH_OPAVERSE_MODULES.map(({ data }) => `
    <a
      class="oh-gallery-card"
      href="#oh-opaverse-${data.id}"
      data-oh-scroll
      style="--oh-card-primary:${data.theme.primary};--oh-card-secondary:${data.theme.secondary}"
    >
      <span class="oh-gallery-card__circle"><span>${data.number}</span></span>
      <span class="oh-gallery-card__title">${data.title}</span>
      <span class="oh-gallery-card__meta">${data.duration} · ${data.versions.length} version</span>
    </a>
  `).join("");
}
