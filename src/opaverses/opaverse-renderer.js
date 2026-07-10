import { OH_JOURNEY_MODULES } from "./opaverse.registry.js";

export function ohRenderOpaverses() {
  const mount = document.querySelector("#oh-opaverses");
  if (!mount) return;
  if (mount.closest("[hidden]")) return;

  mount.innerHTML = OH_JOURNEY_MODULES
    .map((module, index) => module.render({ position: index + 1 }))
    .join("");
}
