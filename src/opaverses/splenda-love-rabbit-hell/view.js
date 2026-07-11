import { ohSongData } from "./data.js";

export function ohRenderSong({ position }) {
  const number = String(position).padStart(2, "0");

  return `
    <section
      class="oh-opaverse"
      id="oh-opaverse-${ohSongData.id}"
      data-oh-opaverse
      data-oh-song-id="${ohSongData.id}"
      data-oh-preset="${ohSongData.opaverse.animationPreset}"
      style="--oh-scene-bg:${ohSongData.theme.background};--oh-scene-primary:${ohSongData.theme.primary};--oh-scene-secondary:${ohSongData.theme.secondary}"
    >
      <div class="oh-opaverse__stage">
        <div class="oh-opaverse__ambient" aria-hidden="true"></div>
        <figure class="oh-opaverse__visual" data-oh-scene-visual>
          <img
            class="oh-opaverse__art"
            src="${ohSongData.assets.art}"
            alt=""
            width="900"
            height="563"
          >
          <span class="oh-opaverse__visual-number" aria-hidden="true">${number}</span>
        </figure>
        <div class="oh-shell oh-opaverse__content">
          <p class="oh-opaverse__number">Opaverse ${number}</p>
          <h3 class="oh-opaverse__title" data-oh-scene-title>${ohSongData.title}</h3>
          <div class="oh-opaverse__accent" data-oh-scene-accent></div>
          <p class="oh-opaverse__copy" data-oh-scene-copy>${ohSongData.opaverse.summary}</p>
          <blockquote class="oh-opaverse__quote" data-oh-scene-quote>${ohSongData.opaverse.featuredLine}</blockquote>
        </div>
      </div>
    </section>
  `;
}
