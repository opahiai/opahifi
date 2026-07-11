import { ohLayoutManager } from "./core/layout-manager.js";
import { ohContentRenderer } from "./core/content-renderer.js";
import { ohNavigationManager } from "./core/navigation-manager.js";
import { ohGsapManager } from "./core/gsap-manager.js";
import { ohAboutCarousel } from "./core/about-carousel.js";
import { ohTermsOverlay } from "./core/terms-overlay.js";
import { ohSongographyManager } from "./songography/songography-manager.js";
import { ohRenderOpaverses } from "./opaverses/opaverse-renderer.js";

function ohMountApp() {
  ohLayoutManager.mount();
  ohContentRenderer.mount();
  ohRenderOpaverses();
  ohSongographyManager.mount();
  ohAboutCarousel.mount();
  ohNavigationManager.mount();
  ohTermsOverlay.mount();
  ohGsapManager.mount();
}

ohMountApp();
