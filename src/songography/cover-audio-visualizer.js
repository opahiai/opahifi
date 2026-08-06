const VISUALIZER_CONFIG = Object.freeze({
  fftSize: 256,
  smoothing: 0.84,
  frameInset: 0.035,
  maxAmplitude: 0.026,
  lineWidth: 0.0075
});

export class CoverAudioVisualizer {
  constructor() {
    this.audio = null;
    this.cover = null;
    this.canvas = null;
    this.context = null;
    this.source = null;
    this.analyser = null;
    this.waveformData = null;
    this.frameId = null;
    this.resizeObserver = null;
    this.draw = this.draw.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  mount({ audio, cover }) {
    if (!audio || !cover || this.canvas) return;

    this.audio = audio;
    this.cover = cover;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "ohg-cover__visualizer";
    this.canvas.setAttribute("aria-hidden", "true");
    this.cover.append(this.canvas);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.cover);
    this.resize();

    this.audio.addEventListener("play", this.start);
    this.audio.addEventListener("pause", this.stop);
    this.audio.addEventListener("ended", this.stop);
  }

  setupAudioGraph() {
    if (this.analyser || !this.audio) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.context = new AudioContext();
    this.source = this.context.createMediaElementSource(this.audio);
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = VISUALIZER_CONFIG.fftSize;
    this.analyser.smoothingTimeConstant = VISUALIZER_CONFIG.smoothing;
    this.waveformData = new Uint8Array(this.analyser.fftSize);
    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  async prepare() {
    this.setupAudioGraph();
    if (!this.analyser || !this.context) return;

    if (this.context.state === "suspended") {
      try {
        await this.context.resume();
      } catch {
        return;
      }
    }
  }

  async start() {
    await this.prepare();
    if (!this.analyser || !this.context) return;
    if (this.frameId === null) this.frameId = requestAnimationFrame(this.draw);
  }

  stop() {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.clear();
  }

  resize() {
    if (!this.canvas || !this.cover) return;

    const rect = this.cover.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
    this.canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
  }

  clear() {
    const drawingContext = this.canvas?.getContext("2d");
    drawingContext?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    if (!this.canvas || !this.analyser || !this.waveformData || !this.audio || this.audio.paused) {
      this.stop();
      return;
    }

    const drawingContext = this.canvas.getContext("2d");
    const width = this.canvas.width;
    const height = this.canvas.height;
    const size = Math.min(width, height);
    const inset = size * VISUALIZER_CONFIG.frameInset;
    const maxAmplitude = size * VISUALIZER_CONFIG.maxAmplitude;
    const horizontalLength = width - (inset * 2);
    const verticalLength = height - (inset * 2);

    this.analyser.getByteTimeDomainData(this.waveformData);
    drawingContext.clearRect(0, 0, width, height);
    drawingContext.save();
    drawingContext.lineCap = "round";
    drawingContext.lineJoin = "round";
    drawingContext.lineWidth = Math.max(2, size * VISUALIZER_CONFIG.lineWidth);
    drawingContext.globalAlpha = 0.76;

    const frameGradient = drawingContext.createLinearGradient(inset, 0, width - inset, 0);
    frameGradient.addColorStop(0, "#00a8ff");
    frameGradient.addColorStop(0.35, "#245cff");
    frameGradient.addColorStop(0.55, "#df20ff");
    frameGradient.addColorStop(0.78, "#ff1748");
    frameGradient.addColorStop(1, "#ff6a00");
    drawingContext.strokeStyle = frameGradient;
    drawingContext.shadowColor = "rgba(82, 73, 255, 0.48)";
    drawingContext.shadowBlur = size * 0.014;
    drawingContext.beginPath();

    for (let index = 0; index < this.waveformData.length; index += 1) {
      const perimeterProgress = (index / (this.waveformData.length - 1)) * 4;
      const side = Math.min(3, Math.floor(perimeterProgress));
      const sideProgress = perimeterProgress - side;
      const wave = ((this.waveformData[index] - 128) / 128) * maxAmplitude;
      let x;
      let y;

      if (side === 0) {
        x = inset + (horizontalLength * sideProgress);
        y = inset + wave;
      } else if (side === 1) {
        x = width - inset - wave;
        y = inset + (verticalLength * sideProgress);
      } else if (side === 2) {
        x = width - inset - (horizontalLength * sideProgress);
        y = height - inset - wave;
      } else {
        x = inset + wave;
        y = height - inset - (verticalLength * sideProgress);
      }

      if (index === 0) drawingContext.moveTo(x, y);
      else drawingContext.lineTo(x, y);
    }

    drawingContext.closePath();
    drawingContext.stroke();
    drawingContext.restore();
    this.frameId = requestAnimationFrame(this.draw);
  }

  destroy() {
    this.stop();
    this.resizeObserver?.disconnect();
    this.audio?.removeEventListener("play", this.start);
    this.audio?.removeEventListener("pause", this.stop);
    this.audio?.removeEventListener("ended", this.stop);
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.context?.close();
    this.canvas?.remove();
    this.audio = null;
    this.cover = null;
    this.canvas = null;
  }
}
