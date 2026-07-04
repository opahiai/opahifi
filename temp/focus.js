(function () {
    const isEmbed = window.location.search.includes('embed=1') || window.self !== window.top;
    if (document.body) {
        document.body.classList.toggle('focusPage--embed', isEmbed);
    }

    const player = document.querySelector('[data-focus-player]');
    if (!player) return;

    const waveformEl = player.querySelector('[data-focus-waveform]');
    const audioEl = player.querySelector('[data-focus-audio]');
    const toggleBtn = player.querySelector('[data-focus-toggle]');
    const toggleLabel = player.querySelector('[data-focus-toggle-label]');
    const currentEl = player.querySelector('[data-focus-current]');
    const durationEl = player.querySelector('[data-focus-duration]');

    if (!waveformEl || !audioEl || !toggleBtn || !window.WaveSurfer || typeof window.WaveSurfer.create !== 'function') {
        return;
    }

    const formatTime = (seconds) => {
        const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
        const minutes = Math.floor(safeSeconds / 60);
        const remainder = safeSeconds % 60;
        return `${minutes}:${String(remainder).padStart(2, '0')}`;
    };

    const getWaveHeight = () => {
        const width = window.innerWidth || document.documentElement.clientWidth || 0;
        if (width >= 900) return 108;
        if (width >= 640) return 92;
        return 84;
    };

    const syncUi = () => {
        const isPlaying = !audioEl.paused;
        player.classList.toggle('is-playing', isPlaying);
        toggleBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', isPlaying ? 'Pause Full-Mindness audio' : 'Play Full-Mindness audio');
        if (toggleLabel) {
            toggleLabel.textContent = isPlaying ? 'Pause' : 'Play';
        }
        if (currentEl) {
            currentEl.textContent = formatTime(audioEl.currentTime);
        }
        if (durationEl) {
            durationEl.textContent = formatTime(audioEl.duration);
        }
    };

    const rootStyles = window.getComputedStyle(document.documentElement);
    const waveColor = rootStyles.getPropertyValue('--focus-wave-cyan').trim() || '#54c6ff';
    const progressColor = rootStyles.getPropertyValue('--focus-wave-violet').trim() || '#8d6bff';

    const wavesurfer = window.WaveSurfer.create({
        container: waveformEl,
        media: audioEl,
        height: getWaveHeight(),
        normalize: true,
        cursorWidth: 0,
        interact: true,
        dragToSeek: true,
        waveColor,
        progressColor,
        renderFunction: (channels, ctx) => {
            const { width, height } = ctx.canvas;
            const samples = channels?.[0];
            if (!samples || !samples.length || !width || !height) return;

            const scale = samples.length / width;
            const step = Math.max(8, Math.round(width / 60));
            const amplitude = height * 0.34;

            if (typeof ctx.resetTransform === 'function') {
                ctx.resetTransform();
            }
            ctx.clearRect(0, 0, width, height);
            ctx.translate(0, height / 2);
            ctx.lineWidth = 2.4;
            ctx.lineCap = 'round';
            ctx.strokeStyle = ctx.fillStyle;
            ctx.beginPath();

            for (let i = 0; i < width; i += step * 2) {
                const index = Math.min(samples.length - 1, Math.floor(i * scale));
                const value = Math.max(0.08, Math.abs(samples[index] || 0));
                let x = i;
                let y = value * amplitude;

                ctx.moveTo(x, 0);
                ctx.lineTo(x, y);
                ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
                ctx.lineTo(x + step, 0);

                x += step;
                y *= -1;

                ctx.moveTo(x, 0);
                ctx.lineTo(x, y);
                ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
                ctx.lineTo(x + step, 0);
            }

            ctx.stroke();
            ctx.closePath();
        }
    });

    toggleBtn.addEventListener('click', () => {
        if (audioEl.paused) {
            const playAttempt = audioEl.play();
            if (playAttempt && typeof playAttempt.catch === 'function') {
                playAttempt.catch(() => {
                    syncUi();
                });
            }
            return;
        }

        audioEl.pause();
    });

    audioEl.addEventListener('play', syncUi);
    audioEl.addEventListener('pause', syncUi);
    audioEl.addEventListener('timeupdate', syncUi);
    audioEl.addEventListener('loadedmetadata', syncUi);
    audioEl.addEventListener('ended', () => {
        audioEl.currentTime = 0;
        syncUi();
    });

    window.addEventListener('message', (event) => {
        if (event?.data?.type !== 'focus-pause') return;
        audioEl.pause();
        syncUi();
    });

    wavesurfer.on('ready', syncUi);
    wavesurfer.on('interaction', () => {
        if (!audioEl.paused) return;

        const playAttempt = wavesurfer.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {
                syncUi();
            });
        }
    });

    window.addEventListener('resize', () => {
        if (typeof wavesurfer.setOptions !== 'function') return;
        wavesurfer.setOptions({ height: getWaveHeight() });
    }, { passive: true });

    syncUi();
})();
