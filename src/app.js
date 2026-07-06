import { ohLayoutManager } from "./core/layout-manager.js";
import { ohNavigationManager } from "./core/navigation-manager.js";
import { ohGsapManager } from "./core/gsap-manager.js";
import { ohGalleryManager } from "./gallery/gallery-manager.js";
import { ohRenderOpaverses } from "./opaverses/opaverse-renderer.js";

function ohMountApp() {
  ohLayoutManager.mount();
  ohRenderOpaverses();
  ohGalleryManager.mount();
  ohNavigationManager.mount();
  ohGsapManager.mount();
}

ohMountApp();
