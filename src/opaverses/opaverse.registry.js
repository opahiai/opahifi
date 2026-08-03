import { ohSongModule as ohFullMindnessModule } from "./full-mindness/index.js";
import { ohSongModule as ohHallucinatingDumDumModule } from "./hallucinating-dum-dum/index.js";
import { ohSongModule as ohYeahLetsDoBrunchModule } from "./yeah-lets-do-brunch/index.js";
import { ohSongModule as ohSplendaLoveRabbitHellModule } from "./splenda-love-rabbit-hell/index.js";
import { ohSongModule as ohBelieveTheTruthFairyModule } from "./believe-the-truth-fairy/index.js";
import { ohSongModule as ohOldLoveStoryModule } from "./old-love-story/index.js";
import { ohSongModule as ohGlittaaPhoenixModule } from "./glittaa-phoenix/index.js";
import { ohSongModule as ohNotYourBotBeepSleepModule } from "./not-your-bot-beep-sleep/index.js";
import { ohSongModule as ohDoThePanicarenaModule } from "./do-the-panicarena/index.js";
import { ohSongModule as ohWellwolfHowlLehluyaModule } from "./wellwolf-howl-lehluya/index.js";
import { ohSongModule as ohOpaPaPaPartyModule } from "./opa-pa-pa-party/index.js";

const OH_SOURCE_OPAVERSE_MODULES = Object.freeze([
  ohFullMindnessModule,
  ohHallucinatingDumDumModule,
  ohYeahLetsDoBrunchModule,
  ohSplendaLoveRabbitHellModule,
  ohBelieveTheTruthFairyModule,
  ohOldLoveStoryModule,
  ohGlittaaPhoenixModule,
  ohNotYourBotBeepSleepModule,
  ohDoThePanicarenaModule,
  ohWellwolfHowlLehluyaModule,
  ohOpaPaPaPartyModule
]);

const OH_SONGOGRAPHY_COVER_STYLE_ID = "oh-songography-dynamic-cover-style";
const OH_SONGOGRAPHY_TITLE_CLASS = "ohg-dynamic-cover-title";

function ohEscapeMarkup(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ohCreateSongographyModule(module) {
  const data = module.data ?? {};
  const assets = data.assets ?? {};
  const artwork = assets.art ?? assets.cover ?? "";
  const versions = Array.isArray(data.versions)
    ? data.versions.map((version) => {
      const versionAssets = version?.assets ?? {};
      const versionArtwork = version?.art
        ?? versionAssets.art
        ?? artwork;

      return Object.freeze({
        ...version,
        cover: versionArtwork,
        art: versionArtwork,
        assets: Object.freeze({
          ...versionAssets,
          cover: versionArtwork,
          art: versionArtwork
        })
      });
    })
    : [];

  return Object.freeze({
    ...module,
    data: Object.freeze({
      ...data,
      assets: Object.freeze({
        ...assets,
        cover: artwork,
        art: artwork
      }),
      versions: Object.freeze(versions)
    })
  });
}

function ohInjectSongographyCoverStyles() {
  if (document.getElementById(OH_SONGOGRAPHY_COVER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = OH_SONGOGRAPHY_COVER_STYLE_ID;
  style.textContent = `
    .ohg-cover {
      overflow: hidden;
    }

    .${OH_SONGOGRAPHY_TITLE_CLASS} {
      position: absolute;
      z-index: 2;
      top: 7%;
      inset-inline: 5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 23%;
      color: var(--ohf-cover-text);
      font-family: var(--oh-font-condensed);
      font-size: clamp(0.72rem, 3.5vw, 1.08rem);
      font-weight: 700;
      line-height: 0.92;
      letter-spacing: -0.02em;
      text-align: center;
      text-transform: uppercase;
      pointer-events: none;
    }

    .${OH_SONGOGRAPHY_TITLE_CLASS} span {
      display: block;
      max-width: 100%;
      white-space: nowrap;
    }

    .ohg-grid__item--featured .${OH_SONGOGRAPHY_TITLE_CLASS} {
      inset-inline: 8%;
      font-size: clamp(1.08rem, 4.45vw, 1.5rem);
      line-height: 0.88;
    }

    .ohg-rail__slot .${OH_SONGOGRAPHY_TITLE_CLASS} {
      font-size: 0.4rem;
    }

    .ohg-cover--detail .${OH_SONGOGRAPHY_TITLE_CLASS} {
      font-size: 0.7rem;
    }
  `;
  document.head.append(style);
}

function ohDecorateSongographyCovers() {
  const songsById = new Map(OH_OPAVERSE_MODULES.map(({ data }) => [data.id, data]));

  document.querySelectorAll("[data-ohg-song-id]").forEach((cover) => {
    if (cover.querySelector(`.${OH_SONGOGRAPHY_TITLE_CLASS}`)) return;

    const song = songsById.get(cover.dataset.ohgSongId);
    if (!song) return;

    const lines = Array.isArray(song.titleLines) && song.titleLines.length > 0
      ? song.titleLines.slice(0, 2)
      : [song.title];
    const title = document.createElement("span");
    title.className = OH_SONGOGRAPHY_TITLE_CLASS;
    title.setAttribute("aria-hidden", "true");
    title.innerHTML = lines.map((line) => `<span>${ohEscapeMarkup(line)}</span>`).join("");
    cover.append(title);
  });
}

function ohEnablePersistentSongographyCovers() {
  ohInjectSongographyCoverStyles();
  ohDecorateSongographyCovers();

  const songography = document.querySelector("#songography");
  if (!songography) return;

  const observer = new MutationObserver(ohDecorateSongographyCovers);
  observer.observe(songography, { childList: true, subtree: true });
}

export const OH_OPAVERSE_MODULES = Object.freeze(
  OH_SOURCE_OPAVERSE_MODULES.map(ohCreateSongographyModule)
);

export const OH_JOURNEY_MODULES = Object.freeze(OH_SOURCE_OPAVERSE_MODULES.slice(0, 3));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ohEnablePersistentSongographyCovers, { once: true });
} else {
  ohEnablePersistentSongographyCovers();
}
