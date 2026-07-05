import { ohLayoutManager } from "./core/layout-manager.js";
import { ohNavigationManager } from "./core/navigation-manager.js";
import { ohGsapManager } from "./core/gsap-manager.js";
import { ohRenderGallery, ohRenderOpaverses } from "./opaverses/opaverse-renderer.js";

function ohMountApp() {
  ohLayoutManager.mount();
  ohRenderOpaverses();
  ohRenderGallery();
  ohNavigationManager.mount();
  ohGsapManager.mount();
}

ohMountApp();
