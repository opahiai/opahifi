import { ohSongData } from "./data.js";
import { ohSongAnimation } from "./animation.js";
import { ohRenderSong } from "./view.js";

export const ohSongModule = Object.freeze({
  data: ohSongData,
  animation: ohSongAnimation,
  render: ohRenderSong
});
