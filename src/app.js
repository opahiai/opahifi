import { ohLayoutManager } from "./core/layout-manager.js";
import { ohNavigationManager } from "./core/navigation-manager.js";
import { ohGsapManager } from "./core/gsap-manager.js";
import { ohSongographyManager } from "./songography/songography-manager.js";
import { ohRenderOpaverses } from "./opaverses/opaverse-renderer.js";

function ohMountApp() {
  ohLayoutManager.mount();
  ohRenderOpaverses();
  ohSongographyManager.mount();
  ohNavigationManager.mount();
  ohGsapManager.mount();
}

ohMountApp();
