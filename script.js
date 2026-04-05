// GA4 labeled click tracking (internal + external)
(() => {
    const sanitize = (s, max = 90) => String(s || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_\-:/\.]/g, '')
        .slice(0, max);

    const labelOf = (el) => {
        if (!el) return 'click';

        const ctxAction = el.closest('[data-pl3-action]')?.dataset?.pl3Action || '';
        const ctxActionKey = ctxAction ? sanitize(ctxAction) : '';

        if (el.dataset.track) return sanitize(el.dataset.track);

        if (el.dataset.pl3Action) return 'pl3_action_' + sanitize(el.dataset.pl3Action);
        if (el.dataset.pl3Group) return 'pl3_group_' + sanitize(el.dataset.pl3Group);
        if (el.hasAttribute('data-pl3-preview')) return ctxActionKey ? 'pl3_' + ctxActionKey + '_preview' : 'pl3_preview';
        if (el.hasAttribute('data-pl3-preview-sound')) return 'pl3_preview_sound';

        if (el.dataset.pl3Platform) {
            const p = sanitize(el.dataset.pl3Platform);
            return ctxActionKey ? ('pl3_' + ctxActionKey + '_platform_' + p) : ('pl3_platform_' + p);
        }

        const aria = el.getAttribute('aria-label');
        if (aria) {
            const a = sanitize(aria);
            return ctxActionKey ? ('pl3_' + ctxActionKey + '_' + a) : a;
        }

        if (el.tagName === 'A') {
            const href = el.getAttribute('href') || '';
            const h = href ? sanitize(href) : '';
            return ctxActionKey ? ('pl3_' + ctxActionKey + '_link_' + (h || '')) : (href ? 'link_' + h : 'link');
        }

        const txt = (el.textContent || '').trim();
        return txt ? (ctxActionKey ? ('pl3_' + ctxActionKey + '_btn_' + sanitize(txt)) : ('btn_' + sanitize(txt))) : 'click';
    };

    document.addEventListener('click', (e) => {
        const el = e.target.closest(
            '[data-track],a,button,[role="button"],[data-pl3-action],[data-pl3-group],[data-pl3-preview],[data-pl3-preview-sound],[data-pl3-platform]'
        );
        if (!el) return;
        if (typeof window.gtag !== 'function') return;

        window.gtag('event', 'ui_click', {
            label: labelOf(el),
            href: el.getAttribute('href') || '',
            page_path: location.pathname
        });
    }, { capture: true, passive: true });
})();

// Music data (inline)
(function () {
    if (window.musicDataGrouped) return;

    const GROUP = Object.freeze({
        FULL_MINDNESS: 'full-mindness',
        OLD_LOVE_STORY: 'old-love-story',
        OPA_PA_PA_PARTY: 'opa-pa-pa-party',
        GLITTAA_PHOENIX: 'glittaa-phoenix',
        SPLENDA_LOVE_RABBIT_HELL: 'splenda-love-rabbit-hell',
        BELIEVE_THE_TRUTH_FAIRY: 'believe-the-truth-fairy',
        LETS_NOT_DO_BRUNCH: 'lets-not-do-brunch'
    });

    const SINGLE = Object.freeze({
        OLD_LOVE_STORY_DESERT_DISCO_DUET: 'old-love-story',
        OLD_LOVE_STORY_OPA_MAX_MIX: 'old-love-story-opa-max-mix',
        OPA_PA_PA_PARTY: 'opa-pa-pa-party',
        GLITTAA: 'glittaa',
        SPLENDA_LOVE_RABBIT_HELL: 'splenda-love-rabbit-hell',
        GLITTAA_PHOENIX_SUNRIZE_MAX_MIX: 'glittaa-phoenix-sunrize-max-mix',
        BELIEVE_THE_TRUTH_FAIRY: 'believe-the-truth-fairy',
        FULL_MINDNESS: 'full-mindness',
        LETS_NOT_DO_BRUNCH: 'lets-not-do-brunch'
    });

    const platformOrder = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Other'];

    const groups = [
        {
            id: 1,
            key: GROUP.OLD_LOVE_STORY,
            title: 'Old Love Story',
            titleLines: ['OLD LOVE', 'STORY'],
            cover: 'img/music/base/base-oldlovestory.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 2,
            key: GROUP.OPA_PA_PA_PARTY,
            title: 'Opa pa pa party',
            titleLines: ['OPA PA', 'PA PARTY!'],
            cover: 'img/music/base/base-opapapaparty.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 3,
            key: GROUP.GLITTAA_PHOENIX,
            title: 'Glittaa Phoenix',
            titleLines: ['GLITTAA', 'PHOENIX!'],
            cover: 'img/music/base/base-glittaaphoenix.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 4,
            key: GROUP.SPLENDA_LOVE_RABBIT_HELL,
            title: 'Splenda Love Rabbit Hell',
            titleLines: ['SPLENDA LOVE', 'RABBIT HELL'],
            cover: 'img/music/base/base-splendaloverabbithell.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 5,
            key: GROUP.BELIEVE_THE_TRUTH_FAIRY,
            title: 'Believe the Truth fairy',
            titleLines: ['BELIEVE the', 'TRUTH FAIRY'],
            cover: 'img/music/base/base-believethetruthfairy.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 6,
            key: GROUP.FULL_MINDNESS,
            title: 'Full-Mindness',
            titleLines: ['FULL-', 'MINDNESS'],
            cover: 'img/music/base/base-fullmindness.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 7,
            key: GROUP.LETS_NOT_DO_BRUNCH,
            title: 'Let\'s not do Brunch',
            titleLines: ['LET\'S NOT', 'DO BRUNCH'],
            cover: 'img/music/base/base-letsnotdobrunch.png',
            songIds: [],
            singlesById: {}
        }
    ];

    const groupsByKey = {};
    for (const g of groups) {
        groupsByKey[g.key] = g;
    }

    const singlesById = {
        [SINGLE.OLD_LOVE_STORY_DESERT_DISCO_DUET]: {
            id: SINGLE.OLD_LOVE_STORY_DESERT_DISCO_DUET,
            groupKey: GROUP.OLD_LOVE_STORY,
            title: 'Old Love Story',
            version: 'Desert Disco Duet Remix',
            image: 'img/music/versions/version-oldlovestory-desertdiscoduet.png',
            lyricsPath: 'lyrics/old-love-story.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=iBtEe-Ch8Qo&list=OLAK5uy_mtnikKbgC0QYek2mnPWKJy-Ewr7E1e0zE',
                'Amazon Music': 'https://music.amazon.com/albums/B0FXB4X48G',
                'Spotify': 'https://open.spotify.com/track/5jvOt03Y3cQdBqocYmbUII',
                'Apple Music': 'https://music.apple.com/us/album/old-love-story-desert-disco-duet-single/1848551028',
                'Other': 'https://youtu.be/iBtEe-Ch8Qo?si=15gHOW9HM6DAGmjq'
            }
        },
        [SINGLE.OLD_LOVE_STORY_OPA_MAX_MIX]: {
            id: SINGLE.OLD_LOVE_STORY_OPA_MAX_MIX,
            groupKey: GROUP.OLD_LOVE_STORY,
            title: 'Old Love Story',
            version: 'Opa Max Mix',
            image: 'img/music/versions/version-oldlovestory-maxmix.png',
            lyricsPath: 'lyrics/old-love-story.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=m7wP4U97FC8',
                'Amazon Music': 'https://music.amazon.com/albums/B0GHC1X6R3',
                'Spotify': 'https://open.spotify.com/track/3GZsz52AKg9ml2mMtC6EEw',
                'Apple Music': 'https://music.apple.com/ng/song/old-love-story-opa-max-mix/1869842718',
                'Other': 'https://youtu.be/m7wP4U97FC8'
            }
        },
        [SINGLE.OPA_PA_PA_PARTY]: {
            id: SINGLE.OPA_PA_PA_PARTY,
            groupKey: GROUP.OPA_PA_PA_PARTY,
            title: 'Opa pa pa party',
            image: 'img/music/base/base-opapapaparty.png',
            lyricsPath: 'lyrics/opa-pa-pa-party.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/playlist?list=OLAK5uy_kyaEMBBaI0luWjB6ch9XqEbp4_dWNu3Mw',
                'Amazon Music': 'https://music.amazon.com/albums/B0FYVMVZS4',
                'Spotify': 'https://open.spotify.com/track/5dPbCqmOBoPSDe4UfQURDf',
                'Apple Music': 'https://music.apple.com/us/album/opa-pa-pa-party/1850813736?i=1850813737',
                'Other': 'https://youtu.be/B9lX6d-AIf8?si=fseyUMFxJJVAh2C8'
            }
        },
        [SINGLE.GLITTAA]: {
            id: SINGLE.GLITTAA,
            groupKey: GROUP.GLITTAA_PHOENIX,
            title: 'Glittaa Phoenix',
            image: 'img/music/base/base-glittaaphoenix.png',
            lyricsPath: 'lyrics/glittaa-pheonix.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=4Enfe7y6RVo&si=gjMhajy0cR3VPQ17',
                'Amazon Music': 'https://music.amazon.com/albums/B0G1N1Y83C',
                'Spotify': 'https://open.spotify.com/track/7d6kFt6vOlkTPIn4gqozy6',
                'Apple Music': 'https://music.apple.com/us/album/glittaa-phoenix-single/1853214791',
                'Other': 'https://youtu.be/4Enfe7y6RVo?si=s1UpWS4WCZy6XujX'
            }
        },
        [SINGLE.SPLENDA_LOVE_RABBIT_HELL]: {
            id: SINGLE.SPLENDA_LOVE_RABBIT_HELL,
            groupKey: GROUP.SPLENDA_LOVE_RABBIT_HELL,
            title: 'Splenda Love Rabbit Hell',
            version: 'Opa Max Mix',
            image: 'img/music/versions/version-splendaloverabbithell-maxmix.png',
            lyricsPath: 'lyrics/splenda-love-rabbit-hell.txt',
            links: {
                'Spotify': 'https://open.spotify.com/track/0yILa8PArNyh1CJlfq5s2n?si=901f3fbf46fa4842',
                'Apple Music': 'https://music.apple.com/us/song/splenda-love-rabbit-hell-opa-max-mix/1872205650',
                'YouTube Music': 'https://music.youtube.com/watch?v=NR3Wcb439DI&si=p0Vz4FfM4yGb8EVE',
                'Amazon Music': 'https://music.amazon.com/albums/B0GJQZXHNL',
                'Other': 'https://youtu.be/NR3Wcb439DI?si=lXoiHaUDbYfOH40F'
            }
        },
        [SINGLE.GLITTAA_PHOENIX_SUNRIZE_MAX_MIX]: {
            id: SINGLE.GLITTAA_PHOENIX_SUNRIZE_MAX_MIX,
            groupKey: GROUP.GLITTAA_PHOENIX,
            title: 'GLITTAA Phoenix',
            version: 'Opa Sunrize Max Mix',
            image: 'img/music/versions/version-glittaaphoenix-sunrisemaxmix.png',
            lyricsPath: 'lyrics/glittaa-pheonix-sunrise-mix.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=LOywm64SGCY&si=iWf3mTJqF7wzVBwP',
                'Other': 'https://www.youtube.com/watch?v=LOywm64SGCY',
                'Spotify': 'https://open.spotify.com/artist/1WD2qPlo13H0gWENdreAsP',
                'Apple Music': 'https://music.apple.com/us/album/glittaa-phoenix-opa-sunrise-max-mix-single/1868781659',
                'Amazon Music': 'https://music.amazon.com/tracks/B0GGHZ6L2F'
            }
        },
        [SINGLE.BELIEVE_THE_TRUTH_FAIRY]: {
            id: SINGLE.BELIEVE_THE_TRUTH_FAIRY,
            groupKey: GROUP.BELIEVE_THE_TRUTH_FAIRY,
            title: 'Believe the Truth Fairy',
            image: 'img/music/base/base-believethetruthfairy.png',
            lyricsPath: 'lyrics/believe-the-truth-fairy.txt',
            links: {
                'Apple Music': 'https://music.apple.com/us/album/believe-the-truth-fairy-single/1867985683',
                'YouTube Music': 'https://music.youtube.com/watch?v=-hxtCiZO5uE&si=6RDhiG__48bZB4mj',
                'Spotify': 'https://open.spotify.com/track/2koDtHQbjsXNrNhetZfDqk?si=PDYCcyqBT9GwvMpXw5v5zg',
                'Amazon Music': 'https://music.amazon.com/albums/B0GF23N5JZ?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_hgBVvMSzssPMIipbWlbISEq4T&trackAsin=B0GF1YZG2P',
                'Other': 'https://youtu.be/-hxtCiZO5uE?si=7UXrK83pSmKyPXcC'
            }
        },
        [SINGLE.FULL_MINDNESS]: {
            id: SINGLE.FULL_MINDNESS,
            groupKey: GROUP.FULL_MINDNESS,
            title: 'Full-Mindness',
            version: 'Opa Mayhem Mix',
            image: 'img/music/versions/version-fullmindness-mayhemmix.png',
            lyricsPath: 'lyrics/full-mindness.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=lE193jDewd4&si=D9lyKQ-KrLwWuZ0Z',
                'Other': 'https://youtu.be/lE193jDewd4?si=YywLQUMDj7DPgCwh',
                'Spotify': 'https://open.spotify.com/track/6lp1u1WV8q0Aqfej1YeF8v?si=35f35519ca434960',
                'Amazon Music': 'https://music.amazon.com/albums/B0GPL4Q4R5?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_sac7n1RtCHUgR8GuzWLD1fZ7D&trackAsin=B0GPLBB653',
                'Apple Music': 'https://music.apple.com/ng/song/full-mindness-opa-mayhem-mix/1879704886'
            }
        },
        [SINGLE.LETS_NOT_DO_BRUNCH]: {
            id: SINGLE.LETS_NOT_DO_BRUNCH,
            groupKey: GROUP.LETS_NOT_DO_BRUNCH,
            title: 'Let\'s not do Brunch',
            image: 'img/music/base/base-letsnotdobrunch.png',
            lyricsPath: 'lyrics/lets-not-do-brunch.txt',
            links: {
                'Spotify': 'https://open.spotify.com/track/10pJOBA2Krl8QiAi7XUGE7?si=66f1ed7937454034',
                'Apple Music': 'https://music.apple.com/us/album/lets-do-brunch-single/1883970912',
                'YouTube Music': 'https://music.youtube.com/watch?v=nlRw2m9_Qh4&si=G1BKK_61Wf_EIast',
                'Amazon Music': 'https://music.amazon.com/albums/B0GS2JC8QD?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_CGFq3eGi1CLBa46vBJBJNB3oc&trackAsin=B0GS23XMP6',
                'Other': 'https://youtu.be/nlRw2m9_Qh4?si=Xe-ZF1Ogg2ynabpj'
            }
        }
    };

    const singleIdsInOrder = [
        SINGLE.OLD_LOVE_STORY_DESERT_DISCO_DUET,
        SINGLE.OLD_LOVE_STORY_OPA_MAX_MIX,
        SINGLE.OPA_PA_PA_PARTY,
        SINGLE.GLITTAA,
        SINGLE.SPLENDA_LOVE_RABBIT_HELL,
        SINGLE.GLITTAA_PHOENIX_SUNRIZE_MAX_MIX,
        SINGLE.BELIEVE_THE_TRUTH_FAIRY,
        SINGLE.FULL_MINDNESS,
        SINGLE.LETS_NOT_DO_BRUNCH
    ];


    for (const id of singleIdsInOrder) {
        const s = singlesById[id];
        if (!s) continue;
        const group = groupsByKey[s.groupKey];
        if (!group) continue;
        group.songIds.push(s.id);
        group.singlesById[s.id] = s;
    }

    window.musicDataGrouped = {
        platformOrder,
        groups,
        singlesById
    };
})();

class PL3AudioBorderVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas?.getContext('2d') || null;
        this.audio = null;
        this.audioContext = null;
        this.analyser = null;
        this.sourceNode = null;
        this.dataArray = null;
        this.rafId = 0;
        this.active = false;
        this.accentCyan = 'rgb(84, 198, 255)';
        this.accentViolet = 'rgb(141, 107, 255)';
        this.accentPink = 'rgb(255, 79, 136)';
        this.accentCyanRgb = '84, 198, 255';
        this.accentVioletRgb = '141, 107, 255';
        this.accentPinkRgb = '255, 79, 136';
        this.visualCenterX = 0;
        this.visualCenterY = 0;
        this.visualBaseRadius = 0;

        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.render = this.render.bind(this);

        if (this.canvas && this.ctx) {
            window.addEventListener('resize', this.resizeCanvas, { passive: true });
            this.resizeCanvas();
            this.rafId = requestAnimationFrame(this.render);
        }
    }

    syncLayoutMetrics() {
        if (!this.canvas?.parentElement) return;

        const styles = window.getComputedStyle(this.canvas.parentElement);
        const accentCyan = styles.getPropertyValue('--pl3-color-accent-cyan').trim();
        const accentViolet = styles.getPropertyValue('--pl3-color-accent-violet').trim();
        const accentPink = styles.getPropertyValue('--pl3-color-accent-pink').trim();
        const accentCyanRgb = styles.getPropertyValue('--pl3-rgb-accent-cyan').trim();
        const accentVioletRgb = styles.getPropertyValue('--pl3-rgb-accent-violet').trim();
        const accentPinkRgb = styles.getPropertyValue('--pl3-rgb-accent-pink').trim();

        this.accentCyan = accentCyan || 'rgb(84, 198, 255)';
        this.accentViolet = accentViolet || 'rgb(141, 107, 255)';
        this.accentPink = accentPink || 'rgb(255, 79, 136)';
        this.accentCyanRgb = accentCyanRgb || '84, 198, 255';
        this.accentVioletRgb = accentVioletRgb || '141, 107, 255';
        this.accentPinkRgb = accentPinkRgb || '255, 79, 136';
    }

    syncVisualizerGeometry(canvasRect) {
        if (!this.canvas) return;

        const rect = canvasRect || this.canvas.getBoundingClientRect();
        const fallbackCenterX = rect.width / 2;
        const fallbackCenterY = rect.height / 2;
        const fallbackBaseRadius = Math.min(rect.width, rect.height) * 0.24;
        const wrap = this.canvas.parentElement;
        const artTarget = wrap?.querySelector('.PL3-upcomingArt') || wrap?.querySelector('.PL3-upcomingPlayerArtPad');

        if (!artTarget) {
            this.visualCenterX = fallbackCenterX;
            this.visualCenterY = fallbackCenterY;
            this.visualBaseRadius = fallbackBaseRadius;
            return;
        }

        const artRect = artTarget.getBoundingClientRect();
        this.visualCenterX = (artRect.left - rect.left) + (artRect.width / 2);
        this.visualCenterY = (artRect.top - rect.top) + (artRect.height / 2);
        this.visualBaseRadius = Math.min(artRect.width, artRect.height) * 0.545;
    }

    attachAudio(audio) {
        if (!audio) return;
        this.audio = audio;
        this.ensureAudioGraph();
    }

    ensureAudioGraph() {
        if (!this.audio || this.audioContext || !this.ctx) return;

        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return;

        try {
            this.audioContext = new AudioContextCtor();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 1024;
            this.analyser.smoothingTimeConstant = 0.82;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        } catch (_) {
            this.audioContext = null;
            this.analyser = null;
            this.dataArray = null;
        }
    }

    async activate() {
        this.active = true;
        this.ensureAudioGraph();

        if (this.audioContext?.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (_) {
                // Ignore resume failures and retry on the next gesture.
            }
        }

        if (!this.rafId) {
            this.rafId = requestAnimationFrame(this.render);
        }
    }

    deactivate() {
        this.active = false;
        if (!this.rafId) {
            this.rafId = requestAnimationFrame(this.render);
        }
    }

    resizeCanvas() {
        if (!this.canvas || !this.ctx) return;

        this.syncLayoutMetrics();
        const rect = this.canvas.getBoundingClientRect();
        this.syncVisualizerGeometry(rect);
        const dpr = Math.max(window.devicePixelRatio || 1, 1);
        this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
        this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }

    getSquarePoint(cx, cy, radius, angle, power = 5.8) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const denominator = Math.pow(
            Math.pow(Math.abs(cos), power) + Math.pow(Math.abs(sin), power),
            1 / power
        ) || 1;

        return {
            x: cx + (radius * cos) / denominator,
            y: cy + (radius * sin) / denominator
        };
    }

    drawGlow(cx, cy, radius) {
        const ctx = this.ctx;
        ctx.save();
        ctx.beginPath();

        const steps = 220;
        for (let i = 0; i <= steps; i += 1) {
            const angle = (i / steps) * Math.PI * 2;
            const point = this.getSquarePoint(cx, cy, radius * 1.14, angle, 5.2);
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        ctx.closePath();
        ctx.fillStyle = `rgba(${this.accentVioletRgb}, 0.08)`;
        ctx.shadowBlur = 36;
        ctx.shadowColor = `rgba(${this.accentVioletRgb}, 0.22)`;
        ctx.fill();
        ctx.restore();
    }

    drawRing(cx, cy, baseRadius, bins, rotation, alpha, lineWidth, colorStops, power, motionScale, width, height) {
        const ctx = this.ctx;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        colorStops.forEach((stop) => {
            gradient.addColorStop(stop[0], stop[1]);
        });

        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        for (let i = 0; i <= bins; i += 1) {
            const index = Math.min(i, bins - 1);
            const angle = (index / bins) * Math.PI * 2 + rotation;
            const value = this.dataArray ? this.dataArray[index] / 255 : 0;
            const edgeWeight = 0.55 + 0.45 * (1 - Math.abs(Math.sin(angle * 2)));
            const wave = Math.pow(value, 1.65) * motionScale * 1.8 * edgeWeight;
            const point = this.getSquarePoint(cx, cy, baseRadius + wave, angle, power);

            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        ctx.closePath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    drawIdleRing(cx, cy, baseRadius, time, width, height) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const steps = 200;
        for (let i = 0; i <= steps; i += 1) {
            const angle = (i / steps) * Math.PI * 2;
            const edgeWeight = 0.6 + 0.4 * (1 - Math.abs(Math.sin(angle * 2)));
            const breath = Math.sin(time * 1.7 + angle * 4) * 3.2 * edgeWeight;
            const point = this.getSquarePoint(cx, cy, baseRadius + breath, angle, 5.5);

            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        ctx.closePath();
        ctx.strokeStyle = `rgba(${this.accentVioletRgb}, 0.42)`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
    }

    render() {
        this.rafId = 0;
        if (!this.canvas || !this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) {
            this.rafId = requestAnimationFrame(this.render);
            return;
        }

        const ctx = this.ctx;
        const time = performance.now() * 0.001;
        const width = rect.width;
        const height = rect.height;
        const cx = this.visualCenterX || (width / 2);
        const cy = this.visualCenterY || (height / 2);
        const baseRadius = this.visualBaseRadius || (Math.min(width, height) * 0.24);

        ctx.clearRect(0, 0, width, height);
        this.drawGlow(cx, cy, baseRadius);

        if (this.active && this.analyser && this.dataArray) {
            this.analyser.smoothingTimeConstant = 0.82;
            this.analyser.getByteFrequencyData(this.dataArray);
            const bins = Math.min(this.dataArray.length, 240);

            this.drawRing(cx, cy, baseRadius + 8, bins, time * 0.10, 0.94, 3.2, [
                [0, this.accentCyan],
                [0.5, this.accentViolet],
                [1, this.accentPink]
            ], 5.8, 26, width, height);

            this.drawRing(cx, cy, baseRadius + 22, bins, -time * 0.07, 0.34, 2.05, [
                [0, `rgba(${this.accentCyanRgb}, 0.82)`],
                [0.5, `rgba(${this.accentVioletRgb}, 0.78)`],
                [1, `rgba(${this.accentPinkRgb}, 0.72)`]
            ], 5.2, 16, width, height);
        } else {
            this.drawIdleRing(cx, cy, baseRadius + 14, time, width, height);
        }

        this.rafId = requestAnimationFrame(this.render);
    }
}

class PL3DomRegistry {
    constructor(section) {
        this.section = section;
        this.headerPart = section.querySelector('.PL3-part--header');
        this.buttonsPart = section.querySelector('.PL3-part--buttons');
        this.highlightPart = section.querySelector('.PL3-part--highlight');
        this.galleryPart = section.querySelector('.PL3-part--gallery');
        this.btnRow = section.querySelector('.PL3-btnRow');
        this.heroBtns = Array.from(section.querySelectorAll('.PL3-heroBtn'));
        this.previewBtn = section.querySelector('[data-pl3-preview]');
        this.gallery = section.querySelector('.PL3-gallery');
        this.galleryBtns = Array.from(section.querySelectorAll('.PL3-galleryItemBtn'));
        this.playlistPillToggle = section.querySelector('[data-pl3-playlist-toggle]');
        this.playlistPillLinks = section.querySelector('[data-pl3-playlist-links]');
        this.groupPanel = section.querySelector('#PL3-group-panel');
        this.groupPanelArtDock = section.querySelector('[data-pl3-group-art-dock]');
        this.groupPanelTitle = section.querySelector('[data-pl3-group-title]');
        this.groupPanelCount = section.querySelector('[data-pl3-group-count]');
        this.groupPanelVersions = section.querySelector('[data-pl3-group-versions]');
        this.groupPanelCloseBtn = section.querySelector('[data-pl3-group-close]');
        this.previewModal = document.getElementById('PL3-preview-modal');
        this.previewIframe = document.getElementById('PL3-preview-iframe');
        this.artZoomModal = document.getElementById('PL3-art-zoom-modal');
        this.artZoomImage = document.getElementById('PL3-art-zoom-image');
        this.previewSoundBtn = this.previewModal?.querySelector('[data-pl3-preview-sound]');
        this.releaseAudioVisualizerCanvas = section.querySelector('[data-pl3-audio-visualizer]');
    }
}

class PL3ScrollLock {
    constructor() {
        this.locked = false;
        this.prevHtmlOverflow = '';
        this.prevBodyOverflow = '';
    }

    lock() {
        if (this.locked) return;
        this.prevHtmlOverflow = document.documentElement.style.overflow;
        this.prevBodyOverflow = document.body.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        this.locked = true;
    }

    unlock() {
        if (!this.locked) return;
        document.documentElement.style.overflow = this.prevHtmlOverflow || '';
        document.body.style.overflow = this.prevBodyOverflow || '';
        this.locked = false;
    }
}

class PL3HeaderSection {
    constructor(dom) {
        this.dom = dom;
    }

    init() {
        if (!this.dom.headerPart) return;
        // Header is static for now; this class owns future header-specific behavior.
    }
}

class PL3ButtonsSection {
    constructor(dom) {
        this.dom = dom;
        this.expandedBtn = null;
    }

    init() {
        if (!this.dom.btnRow) return;
        this.dom.btnRow.addEventListener('click', this.onButtonRowClick, { passive: true });
    }

    onButtonRowClick = (ev) => {
        const btn = ev.target.closest('.PL3-heroBtn');
        if (!btn) return;
        const action = btn.getAttribute('data-pl3-action');
        const isCloseBtn = ev.target.closest('[data-pl3-close-btn]');

        if (action === 'shop' && !isCloseBtn) {
            window.location.href = 'https://shop.opahifi.com';
            return;
        }
        if (isCloseBtn) {
            this.collapseAllButtons();
            return;
        }
        if (action === 'listen' || action === 'follow') {
            this.expandedBtn === btn ? this.collapseAllButtons() : this.expandButton(btn);
        }
    };

    expandButton(btn) {
        this.collapseAllButtons();
        btn.classList.add('PL3-heroBtn--expanded');
        this.dom.heroBtns.forEach((b) => {
            if (b !== btn) b.classList.add('PL3-heroBtn--collapsed');
        });
        this.expandedBtn = btn;
    }

    collapseAllButtons() {
        this.dom.heroBtns.forEach((b) => {
            b.classList.remove('PL3-heroBtn--expanded', 'PL3-heroBtn--collapsed');
        });
        this.expandedBtn = null;
    }
}

const PL3_ABOUT_CYCLE_CONFIG = Object.freeze({
    timing: Object.freeze({
        pillarReveal: 0.65,
        pillarHold: 2.35,
        arrowPeak: 0.35,
        arrowIconFadeIn: 0.22,
        arrowSettle: 0.28,
        arrowHold: 0.87
    })
});

class PL3HighlightSection {
    constructor(dom, callbacks = {}) {
        this.dom = dom;
        this.lockScroll = callbacks.lockScroll || (() => { });
        this.unlockScroll = callbacks.unlockScroll || (() => { });
        this.previewVideoId = '';
        this.previewMuted = false;
        this.previewAudio = null;
        this.previewAudioBtn = null;
        this.previewAudioPlayer = null;
        this.releaseAudioVisualizer = null;
        this.videoParallaxCleanup = [];
        this.aboutCyclePanel = null;
        this.aboutCycleSteps = [];
        this.aboutCycleTimeline = null;
        this.aboutCycleStarted = false;
        this.aboutCycleCompleted = false;
    }

    init() {
        if (!this.dom.highlightPart) return;
        this.setupReleaseAudioVisualizer();
        this.setupAboutCycle();
        this.attachTabEvents();
        this.attachPreviewEvents();
    }

    setupReleaseAudioVisualizer() {
        if (!this.dom.releaseAudioVisualizerCanvas) return;
        this.releaseAudioVisualizer = new PL3AudioBorderVisualizer(this.dom.releaseAudioVisualizerCanvas);
    }

    // === Tabs ===
    attachTabEvents() {
        const container = this.dom.highlightPart.querySelector('[data-pl3-tabs]');
        if (!container) return;
        const btns = Array.from(container.querySelectorAll('[role="tab"]'));
        const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));
        if (!btns.length) return;

        const activate = (btn) => {
            btns.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
            panels.forEach(p => { p.hidden = p.id !== btn.getAttribute('aria-controls'); });
            this.onTabActivated(btn.getAttribute('data-pl3-tab') || '');
        };

        btns.forEach((btn, i) => {
            btn.addEventListener('click', () => activate(btn));
            btn.addEventListener('keydown', (ev) => {
                let next = -1;
                if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') next = (i - 1 + btns.length) % btns.length;
                if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') next = (i + 1) % btns.length;
                if (next >= 0) { btns[next].focus(); activate(btns[next]); }
            });
        });

        const activeBtn = btns.find((btn) => btn.getAttribute('aria-selected') === 'true') || btns[0];
        this.onTabActivated(activeBtn?.getAttribute('data-pl3-tab') || '');
    }

    onTabActivated(tabKey) {
        if (tabKey !== 'videos') {
            this.resetVideoParallaxCards();
            this.clearVideoParallaxCleanup();
        }
        if (tabKey !== 'about') {
            this.pauseAboutCycle();
        }
        if (tabKey !== 'release') {
            this.pausePreviewAudio(true);
        }
        if (tabKey === 'videos') {
            this.playVideoTabParallax();
        }
        if (tabKey === 'about') {
            this.playAboutCycle();
        }
    }

    setupAboutCycle() {
        const aboutPanel = this.dom.highlightPart?.querySelector('#PL3-tabPanel-about');
        if (!aboutPanel) return;

        const buildArrowStep = (selector, rgb) => {
            const el = aboutPanel.querySelector(selector);
            return el ? {
                type: 'arrow',
                el,
                icon: el.querySelector('.cycle-arrowIcon'),
                rgb
            } : null;
        };

        const steps = [
            { type: 'pillar', el: aboutPanel.querySelector('.cycle-pillar--pulse'), rgb: '111 163 255' },
            buildArrowStep('.cycle-arrow--top', '154 117 255'),
            { type: 'pillar', el: aboutPanel.querySelector('.cycle-pillar--power'), rgb: '154 117 255' },
            buildArrowStep('.cycle-arrow--right', '255 111 227'),
            { type: 'pillar', el: aboutPanel.querySelector('.cycle-pillar--party'), rgb: '255 111 227' },
            buildArrowStep('.cycle-arrow--bottom', '255 103 125'),
            { type: 'pillar', el: aboutPanel.querySelector('.cycle-pillar--people'), rgb: '255 103 125' },
            buildArrowStep('.cycle-arrow--left', '111 163 255')
        ];

        if (steps.some((step) => !step?.el)) return;

        this.aboutCyclePanel = aboutPanel;
        this.aboutCycleSteps = steps;

        if (!window.gsap) return;

        window.gsap.set(
            this.aboutCycleSteps
                .filter((step) => step.type === 'arrow')
                .map((step) => step.el),
            { transformOrigin: '50% 50%' }
        );
    }

    getCyclePillarLitVars(rgb) {
        return {
            filter: 'brightness(1.34) saturate(1.34) contrast(1.04)',
            boxShadow: [
                'inset 0 0 0 999px rgba(255, 255, 255, 0.02)',
                'inset 0 1px 0 rgba(255, 255, 255, 0.22)',
                `inset 0 0 0 2px rgb(${rgb} / 0.56)`,
                `inset 0 0 70px rgb(${rgb} / 0.22)`,
                `0 0 34px rgb(${rgb} / 0.38)`,
                `0 0 72px rgb(${rgb} / 0.24)`
            ].join(', ')
        };
    }

    getCycleArrowPeakVars(rgb) {
        return {
            scale: 1.32,
            opacity: 1,
            filter: 'brightness(1.95) saturate(1.5)',
            borderColor: `rgb(${rgb} / 0.95)`,
            boxShadow: [
                `0 0 0 2px rgb(${rgb} / 0.34)`,
                `0 0 22px rgb(${rgb} / 0.54)`,
                `0 0 46px rgb(${rgb} / 0.34)`,
                '0 12px 26px rgba(0, 0, 0, 0.34)',
                'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            ].join(', ')
        };
    }

    getCycleArrowLitVars(rgb) {
        return {
            scale: 1.08,
            opacity: 0.96,
            filter: 'brightness(1.45) saturate(1.18)',
            borderColor: `rgb(${rgb} / 0.72)`,
            boxShadow: [
                `0 0 0 1px rgb(${rgb} / 0.24)`,
                `0 0 16px rgb(${rgb} / 0.34)`,
                '0 10px 22px rgba(0, 0, 0, 0.3)',
                'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            ].join(', ')
        };
    }

    setAboutCycleCompletedState() {
        const gsap = window.gsap;
        if (!gsap || !this.aboutCycleSteps.length) return;

        this.aboutCycleSteps.forEach((step) => {
            if (step.type === 'pillar') {
                gsap.set(step.el, this.getCyclePillarLitVars(step.rgb));
                return;
            }

            gsap.set(step.el, this.getCycleArrowLitVars(step.rgb));
            if (step.icon) {
                gsap.set(step.icon, { opacity: 1 });
            }
        });

        this.aboutCycleCompleted = true;
    }

    ensureAboutCycleTimeline() {
        if (this.aboutCycleTimeline || !this.aboutCycleSteps.length || !window.gsap) {
            return this.aboutCycleTimeline;
        }

        const gsap = window.gsap;
        const { timing } = PL3_ABOUT_CYCLE_CONFIG;
        const timeline = gsap.timeline({
            paused: true,
            onComplete: () => {
                this.aboutCycleCompleted = true;
            }
        });

        const holdFor = (seconds) => {
            timeline.to({}, { duration: seconds, ease: 'none' });
        };

        this.aboutCycleSteps.forEach((step) => {
            if (step.type === 'pillar') {
                timeline.to(step.el, {
                    ...this.getCyclePillarLitVars(step.rgb),
                    duration: timing.pillarReveal,
                    ease: 'power2.out'
                });
                holdFor(timing.pillarHold);
                return;
            }

            timeline.to(step.el, {
                ...this.getCycleArrowPeakVars(step.rgb),
                duration: timing.arrowPeak,
                ease: 'power2.out'
            });

            if (step.icon) {
                timeline.to(step.icon, {
                    opacity: 1,
                    duration: timing.arrowIconFadeIn,
                    ease: 'power2.out'
                }, '<');
            }

            timeline.to(step.el, {
                ...this.getCycleArrowLitVars(step.rgb),
                duration: timing.arrowSettle,
                ease: 'power2.out'
            });
            holdFor(timing.arrowHold);
        });

        this.aboutCycleTimeline = timeline;
        return timeline;
    }

    playAboutCycle() {
        if (!this.aboutCyclePanel || !this.aboutCycleSteps.length) return;

        const gsap = window.gsap;
        if (!gsap) return;

        const hasReducedMotion = typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (hasReducedMotion) {
            this.setAboutCycleCompletedState();
            return;
        }

        const timeline = this.ensureAboutCycleTimeline();
        if (!timeline || this.aboutCycleCompleted) return;

        if (!this.aboutCycleStarted) {
            this.aboutCycleStarted = true;
            requestAnimationFrame(() => timeline.play(0));
            return;
        }

        if (timeline.paused()) {
            timeline.play();
        }
    }

    pauseAboutCycle() {
        if (!this.aboutCycleTimeline || this.aboutCycleCompleted) return;
        this.aboutCycleTimeline.pause();
    }

    getVideoCards() {
        const videoPanel = this.dom.highlightPart?.querySelector('#PL3-tabPanel-videos');
        if (!videoPanel) return [];
        return Array.from(videoPanel.querySelectorAll('.PL3-videoCard'));
    }

    resetVideoParallaxCards() {
        const cards = this.getVideoCards();
        const gsap = window.gsap;
        cards.forEach((card) => {
            const bg = card.querySelector('.PL3-videoThumb--bg');
            const fg = card.querySelector('.PL3-videoThumb--fg');
            if (gsap) {
                gsap.killTweensOf([card, bg, fg].filter(Boolean));
                gsap.set([card, bg, fg].filter(Boolean), { clearProps: 'all' });
                return;
            }
            if (bg) {
                bg.style.transform = '';
                bg.style.opacity = '';
            }
            if (fg) {
                fg.style.transform = '';
                fg.style.opacity = '';
            }
            card.style.transform = '';
            card.style.opacity = '';
        });
    }

    clearVideoParallaxCleanup() {
        this.videoParallaxCleanup.forEach((cleanup) => {
            try {
                cleanup();
            } catch (_) {
                // Ignore stale cleanup handlers.
            }
        });
        this.videoParallaxCleanup = [];
    }

    playVideoTabParallax() {
        const cards = this.getVideoCards();
        if (!cards.length) return;

        const gsap = window.gsap;
        const hasReducedMotion = typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.clearVideoParallaxCleanup();

        if (!gsap || hasReducedMotion) {
            this.resetVideoParallaxCards();
            return;
        }

        cards.forEach((card, index) => {
            const bg = card.querySelector('.PL3-videoThumb--bg');
            const fg = card.querySelector('.PL3-videoThumb--fg');
            if (!bg || !fg) return;

            const baseBgX = index === 1 ? 1.6 : -1.6;
            const baseFgX = 0;
            const baseFgY = 0;

            gsap.killTweensOf([card, bg, fg]);
            gsap.set(card, { opacity: 0, y: 28, rotateX: -7, transformPerspective: 900 });
            gsap.set(bg, { xPercent: 0, yPercent: 0, scale: 1.12, rotate: 0 });
            gsap.set(fg, { xPercent: 0, yPercent: 0, scale: 0.99, rotate: 0, opacity: 0 });

            const timeline = gsap.timeline({
                defaults: {
                    duration: 0.9,
                    ease: 'power3.out'
                }
            });

            timeline
                .to(card, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    delay: index * 0.08
                })
                .to(bg, {
                    scale: 1.04,
                    xPercent: baseBgX,
                    yPercent: -1.4,
                    duration: 1.05
                }, 0.02)
                .to(fg, {
                    opacity: 1,
                    scale: 1.02,
                    yPercent: baseFgY,
                    xPercent: baseFgX,
                    duration: 1
                }, 0.12);

            const moveCard = (ev) => {
                const rect = card.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const px = ((ev.clientX - rect.left) / rect.width) - 0.5;
                const py = ((ev.clientY - rect.top) / rect.height) - 0.5;

                gsap.to(bg, {
                    xPercent: baseBgX + (px * 8),
                    yPercent: -1.4 + (py * 6),
                    duration: 0.45,
                    overwrite: 'auto'
                });
                gsap.to(fg, {
                    xPercent: baseFgX + (px * -5.5),
                    yPercent: baseFgY,
                    rotate: px * -2.2,
                    duration: 0.45,
                    overwrite: 'auto'
                });
            };

            const leaveCard = () => {
                gsap.to(bg, {
                    xPercent: baseBgX,
                    yPercent: -1.4,
                    scale: 1.04,
                    rotate: 0,
                    duration: 0.55,
                    overwrite: 'auto'
                });
                gsap.to(fg, {
                    xPercent: baseFgX,
                    yPercent: baseFgY,
                    scale: 1.02,
                    rotate: 0,
                    duration: 0.55,
                    overwrite: 'auto'
                });
            };

            card.addEventListener('pointermove', moveCard);
            card.addEventListener('pointerleave', leaveCard);
            card.addEventListener('blur', leaveCard, true);

            this.videoParallaxCleanup.push(() => {
                card.removeEventListener('pointermove', moveCard);
                card.removeEventListener('pointerleave', leaveCard);
                card.removeEventListener('blur', leaveCard, true);
            });
        });
    }

    // === Preview (embedded YouTube) ===
    attachPreviewEvents() {
        if (this.dom.previewBtn) {
            this.dom.previewBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                this.openPreviewModal('https://www.youtube.com/embed/videoseries?list=PLtGnlTqdsNV2QBkI-_1QFuidj3alcuLHF');
            }, { passive: false });
        }

        // Video card Watch buttons with a specific playlist
        const videoPanel = this.dom.highlightPart?.querySelector('#PL3-tabPanel-videos');
        if (videoPanel) {
            videoPanel.addEventListener('click', (ev) => {
                const btn = ev.target.closest('[data-pl3-video-embed]');
                if (!btn) return;
                ev.preventDefault();
                this.openPreviewModal(btn.getAttribute('data-pl3-video-embed'));
            }, { passive: false });
        }

        // Release panel Preview button
        const releasePanel = this.dom.highlightPart?.querySelector('#PL3-tabPanel-release');
        if (releasePanel) {
            releasePanel.addEventListener('click', (ev) => {
                const audioBtn = ev.target.closest('[data-pl3-audio-toggle]');
                if (audioBtn) {
                    const audioPlayer = audioBtn.closest('[data-pl3-audio-player]');
                    if (!audioPlayer) return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    this.togglePreviewAudio(audioPlayer.getAttribute('data-pl3-audio-src'), audioBtn, audioPlayer);
                    return;
                }

                const btn = ev.target.closest('[data-pl3-video-embed]');
                if (!btn) return;
                ev.preventDefault();
                ev.stopPropagation();
                this.openPreviewModal(btn.getAttribute('data-pl3-video-embed'));
            }, { passive: false });
        }

        const m = this.dom.previewModal;
        if (m) {
            m.addEventListener('click', (ev) => {
                if (ev.target.closest('[data-pl3-preview-sound]')) {
                    ev.preventDefault();
                    this.previewMuted = !this.previewMuted;
                    this.applyPreviewIframeSrc();
                    this.syncPreviewSoundUi();
                    return;
                }
                if (!ev.target.closest('[data-pl3-preview-close]') || !m.contains(ev.target)) return;
                ev.preventDefault();
                this.closePreviewModal();
            }, { passive: false });
        }

        window.addEventListener('keydown', (ev) => {
            if (!this.dom.previewModal || this.dom.previewModal.hidden || ev.key !== 'Escape') return;
            this.closePreviewModal();
        }, { passive: true });
    }

    openPreviewModal(videoId) {
        const m = this.dom.previewModal;
        if (!m) return;
        const id = String(videoId || '').trim();
        if (!id) return;

        this.pausePreviewAudio();
        this.previewVideoId = id;
        this.previewMuted = false;
        this.applyPreviewIframeSrc();
        this.syncPreviewSoundUi();

        m.hidden = false;
        m.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                m.classList.add('PL3-preview--open');
            });
        });
        this.lockScroll();
    }

    applyPreviewIframeSrc() {
        const id = String(this.previewVideoId || '').trim();
        if (!id || !this.dom.previewIframe) return;

        let src;
        if (id.includes('youtube.com/embed/videoseries')) {
            src = id;
        } else if (id.includes('playlist?list=') || id.includes('list=')) {
            const url = new URL(id);
            const playlistId = url.searchParams.get('list');
            src = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&autoplay=1&modestbranding=1&controls=1`;
        } else {
            const mute = this.previewMuted ? 1 : 0;
            src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=${mute}&playsinline=1&rel=0&controls=1&modestbranding=1`;
        }
        this.dom.previewIframe.src = src;
    }

    syncPreviewSoundUi() {
        const btn = this.dom.previewSoundBtn;
        if (!btn) return;
        const isMuted = !!this.previewMuted;
        btn.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
        btn.setAttribute('aria-label', isMuted ? 'Unmute preview' : 'Mute preview');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-volume-xmark', isMuted);
            icon.classList.toggle('fa-volume-high', !isMuted);
        }
    }

    getPreviewAudio() {
        if (this.previewAudio) return this.previewAudio;
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.addEventListener('play', () => {
            this.releaseAudioVisualizer?.attachAudio(audio);
            this.releaseAudioVisualizer?.activate();
            this.syncPreviewAudioButton(this.previewAudioBtn, true);
            this.syncPreviewAudioProgress(this.previewAudioPlayer);
        });
        audio.addEventListener('pause', () => {
            this.releaseAudioVisualizer?.deactivate();
            this.syncPreviewAudioButton(this.previewAudioBtn, false);
            this.syncPreviewAudioProgress(this.previewAudioPlayer);
        });
        audio.addEventListener('ended', () => {
            audio.currentTime = 0;
            this.releaseAudioVisualizer?.deactivate();
            this.syncPreviewAudioButton(this.previewAudioBtn, false);
            this.syncPreviewAudioProgress(this.previewAudioPlayer);
        });
        audio.addEventListener('timeupdate', () => {
            this.syncPreviewAudioProgress(this.previewAudioPlayer);
        });
        audio.addEventListener('loadedmetadata', () => {
            this.releaseAudioVisualizer?.attachAudio(audio);
            this.syncPreviewAudioProgress(this.previewAudioPlayer);
        });
        this.releaseAudioVisualizer?.attachAudio(audio);
        this.previewAudio = audio;
        return audio;
    }

    syncPreviewAudioButton(btn, isPlaying) {
        if (!btn) return;
        const player = btn.closest('[data-pl3-audio-player]');
        if (player) {
            player.classList.toggle('is-playing', isPlaying);
        }
        btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
        btn.setAttribute('aria-label', isPlaying ? 'Pause Full-Mindness audio' : 'Play Full-Mindness audio');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-play', !isPlaying);
            icon.classList.toggle('fa-pause', isPlaying);
        }
        const label = btn.querySelector('[data-pl3-audio-toggle-label]');
        if (label) {
            label.textContent = isPlaying ? 'Pause' : 'Play';
        }
    }

    formatPreviewAudioTime(seconds) {
        const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
        const minutes = Math.floor(safeSeconds / 60);
        const remainder = safeSeconds % 60;
        return `${minutes}:${String(remainder).padStart(2, '0')}`;
    }

    syncPreviewAudioProgress(player) {
        if (!player || !this.previewAudio) return;
        const duration = Number.isFinite(this.previewAudio.duration) ? this.previewAudio.duration : 0;
        const current = Number.isFinite(this.previewAudio.currentTime) ? this.previewAudio.currentTime : 0;
        const progress = player.querySelector('[data-pl3-audio-progress]');
        const currentTime = player.querySelector('[data-pl3-audio-current]');
        const durationTime = player.querySelector('[data-pl3-audio-duration]');

        if (progress) {
            const ratio = duration > 0 ? Math.min(1, Math.max(0, current / duration)) : 0;
            progress.style.width = `${ratio * 100}%`;
        }
        if (currentTime) {
            currentTime.textContent = this.formatPreviewAudioTime(current);
        }
        if (durationTime) {
            durationTime.textContent = this.formatPreviewAudioTime(duration);
        }
    }

    pausePreviewAudio(resetTime = false) {
        if (!this.previewAudio) return;
        this.previewAudio.pause();
        if (resetTime) {
            this.previewAudio.currentTime = 0;
        }
        this.syncPreviewAudioProgress(this.previewAudioPlayer);
    }

    togglePreviewAudio(audioSrc, btn, player) {
        const src = String(audioSrc || '').trim();
        if (!src || !btn) return;

        const audio = this.getPreviewAudio();
        const resolvedSrc = new URL(src, window.location.href).href;
        this.releaseAudioVisualizer?.attachAudio(audio);

        if (this.previewAudioBtn && this.previewAudioBtn !== btn) {
            this.syncPreviewAudioButton(this.previewAudioBtn, false);
        }

        this.previewAudioBtn = btn;
        this.previewAudioPlayer = player || btn.closest('[data-pl3-audio-player]') || null;

        if (audio.src !== resolvedSrc) {
            audio.pause();
            audio.src = resolvedSrc;
            audio.currentTime = 0;
            this.syncPreviewAudioProgress(this.previewAudioPlayer);
        }

        if (!audio.paused) {
            audio.pause();
            return;
        }

        const playAttempt = audio.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {
                this.syncPreviewAudioButton(btn, false);
            });
        }
    }

    closePreviewModal() {
        const m = this.dom.previewModal;
        if (!m || m.hidden) return;
        m.classList.remove('PL3-preview--open');
        setTimeout(() => {
            m.hidden = true;
            m.setAttribute('aria-hidden', 'true');
            if (this.dom.previewIframe) this.dom.previewIframe.src = '';
            this.previewVideoId = '';
        }, 240);
        this.unlockScroll();
    }
}

class PL3GroupPanel {
    constructor(dom, callbacks = {}) {
        this.PANEL_STATE = Object.freeze({
            CLOSED: 'closed',
            GROUP: 'group',
            SONG: 'song'
        });
        this.VERSION_KIND = Object.freeze({
            MAIN: 'main'
        });
        this.VERSION_LABEL = Object.freeze({
            [this.VERSION_KIND.MAIN]: 'Main version'
        });
        this.dom = dom;
        this.lockScroll = callbacks.lockScroll || (() => { });
        this.unlockScroll = callbacks.unlockScroll || (() => { });
        this.data = window.musicDataGrouped || {};
        this.platformOrder = Array.isArray(this.data.platformOrder) ? this.data.platformOrder : [];
        this.singlesById = this.data.singlesById || {};
        this.groupsByKey = {};
        const groups = Array.isArray(this.data.groups) ? this.data.groups : [];
        groups.forEach((group) => {
            if (group?.key) this.groupsByKey[group.key] = group;
        });

        this.activeGroupKey = '';
        this.activeSourceBtn = null;
        this.activeSourceImg = null;
        this._state = this.PANEL_STATE.CLOSED;
        this._transitionId = 0;
        this._closeBtnPopTimer = null;
        this._queuedVersionOpenTimer = null;
        this._artSwapTimeline = null;
        this._artZoomHideTimer = null;
        this.ART_DOCK_FLIP_MS = 580;

        this.flipReady = !!(
            window.gsap &&
            window.Flip &&
            typeof window.Flip.getState === 'function' &&
            typeof window.Flip.from === 'function'
        );
        if (this.flipReady) {
            window.gsap.registerPlugin(window.Flip);
        }
    }

    getVersionKind(song) {
        return song?.version ? null : this.VERSION_KIND.MAIN;
    }

    getVersionLabel(song) {
        const versionKind = this.getVersionKind(song);
        if (versionKind) {
            return this.VERSION_LABEL[versionKind];
        }
        return String(song?.version || '').trim();
    }

    normalizeShareToken(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    getSongShareToken(song) {
        return this.normalizeShareToken(this.getVersionLabel(song) || song?.id || '');
    }

    findSongIdByShareToken(groupKey, token) {
        const normalizedToken = this.normalizeShareToken(token);
        if (!groupKey || !normalizedToken) return '';

        for (const songId of this.getGroupSongIds(groupKey)) {
            const song = this.singlesById[songId];
            if (!song) continue;

            const candidates = [
                song.id,
                this.getSongShareToken(song),
                this.getVersionLabel(song),
                song.version,
                song.title
            ];

            if (candidates.some((candidate) => this.normalizeShareToken(candidate) === normalizedToken)) {
                return songId;
            }
        }

        return '';
    }

    init() {
        if (!this.dom.groupPanel) return;
        if (this.dom.groupPanelCloseBtn) {
            this.dom.groupPanelCloseBtn.addEventListener('click', this.onCloseClick, { passive: false });
        }
        const shareBtn = this.dom.groupPanel.querySelector('[data-pl3-group-share]');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareActivePanel(), { passive: true });
        }
        // Any click that lands outside the panel closes it
        this.dom.section.addEventListener('click', this.onSectionClick, { passive: true });
        // Version row click → overlay drilldown
        if (this.dom.groupPanelVersions) {
            this.dom.groupPanelVersions.addEventListener('click', this.onVersionRowClick, { passive: false });
        }
        if (this.dom.groupPanelArtDock) {
            this.dom.groupPanelArtDock.addEventListener('click', this.onArtDockClick, { passive: false });
            this.dom.groupPanelArtDock.addEventListener('keydown', this.onArtDockKeyDown, { passive: false });
        }
        if (this.dom.artZoomModal) {
            this.dom.artZoomModal.addEventListener('click', this.onArtZoomModalClick, { passive: false });
        }
        window.addEventListener('keydown', this.onKeyDown, { passive: true });
    }

    shareActivePanel() {
        if (this._panelState === this.PANEL_STATE.SONG && this._activeDetailSongId) {
            this.shareVersion(this._activeDetailSongId);
            return;
        }
        this.shareGroup();
    }

    shareGroup() {
        const key = this.activeGroupKey;
        if (!key) return;
        const url = `${location.origin}/s/${encodeURIComponent(key)}`;
        const group = this.groupsByKey[key];
        const title = group?.title || 'OpaHiFi';
        const text = `Listen to ${title} by OpaHiFi`;

        this.sharePayload({ title, text, url });
    }

    shareVersion(songId) {
        const song = this.singlesById[songId];
        if (!song) {
            this.shareGroup();
            return;
        }
        if (!song.groupKey) {
            this.shareGroup();
            return;
        }

        const group = this.groupsByKey[song.groupKey];
        const versionKind = this.getVersionKind(song);
        const versionLabel = this.getVersionLabel(song);
        const shareTitle = `${song.title}${versionKind !== this.VERSION_KIND.MAIN && versionLabel ? ` (${versionLabel})` : ''}`;
        const versionToken = this.getSongShareToken(song);
        const url = versionToken
            ? `${location.origin}/s/${encodeURIComponent(song.groupKey)}/${encodeURIComponent(versionToken)}`
            : `${location.origin}/s/${encodeURIComponent(song.groupKey)}`;
        const text = group?.title && shareTitle !== group.title
            ? `Listen to ${shareTitle} from ${group.title} by OpaHiFi`
            : `Listen to ${shareTitle} by OpaHiFi`;

        this.sharePayload({ title: shareTitle, text, url });
    }

    sharePayload({ title, text, url }) {
        if (!url) return;

        if (navigator.share) {
            navigator.share({ title, text, url }).catch(() => { });
        } else {
            navigator.clipboard?.writeText(url).then(() => {
                const btn = this.dom.groupPanel.querySelector('[data-pl3-group-share]');
                if (!btn) return;
                btn.classList.add('PL3-groupPanelShareBtn--copied');
                const icon = btn.querySelector('i');
                if (icon) { icon.className = 'fa-solid fa-check'; }
                clearTimeout(this._shareCopiedTimer);
                this._shareCopiedTimer = setTimeout(() => {
                    btn.classList.remove('PL3-groupPanelShareBtn--copied');
                    if (icon) { icon.className = 'fa-solid fa-share-nodes'; }
                }, 2000);
            }).catch(() => { });
        }
    }

    onCloseClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.close();
    };

    onSectionClick = (ev) => {
        if (this._panelState === this.PANEL_STATE.CLOSED) return;
        if (ev.target.closest('#PL3-group-panel')) return;
        this.close();
    };

    onVersionRowClick = (ev) => {
        if (ev.target.closest('a')) return;
        const row = ev.target.closest('.PL3-groupVersionItem[data-pl3-song-id]');
        if (!row) return;
        ev.preventDefault();
        this.openVersionDetail(row, row.dataset.pl3SongId);
    };

    onArtDockClick = (ev) => {
        const img = ev.target.closest('.PL3-groupArtInPanel--expandable');
        if (!img || !this.dom.groupPanelArtDock?.contains(img)) return;
        ev.preventDefault();
        ev.stopPropagation();
        this.openExpandedArt(img);
    };

    onArtDockKeyDown = (ev) => {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        const img = ev.target.closest('.PL3-groupArtInPanel--expandable');
        if (!img || !this.dom.groupPanelArtDock?.contains(img)) return;
        ev.preventDefault();
        ev.stopPropagation();
        this.openExpandedArt(img);
    };

    onArtZoomModalClick = (ev) => {
        if (!ev.target.closest('[data-pl3-art-zoom-close]')) return;
        ev.preventDefault();
        this.closeExpandedArt();
    };

    onKeyDown = (ev) => {
        if (ev.key !== 'Escape') return;
        if (this.isExpandedArtOpen()) {
            this.closeExpandedArt();
            return;
        }
        if (this._panelState === this.PANEL_STATE.SONG) {
            if (this._detailHasBackNav === false) {
                this.close();
            } else {
                this.closeVersionDetail();
            }
            return;
        }
        if (this._panelState === this.PANEL_STATE.GROUP) { this.close(); }
    };

    isOpen() {
        return this._panelState !== this.PANEL_STATE.CLOSED;
    }

    get _panelState() {
        return this._state;
    }

    _setPanelState(state) {
        this._state = state;
    }

    _bumpTransition() {
        this._transitionId += 1;
        return this._transitionId;
    }

    getGroupSongIds(groupKey) {
        const group = this.groupsByKey[groupKey];
        return Array.isArray(group?.songIds) ? group.songIds : [];
    }

    clearQueuedVersionOpen() {
        if (this._queuedVersionOpenTimer == null) return;
        window.clearTimeout(this._queuedVersionOpenTimer);
        this._queuedVersionOpenTimer = null;
    }

    clearActiveArtSwap() {
        if (!this._artSwapTimeline) return;
        this._artSwapTimeline.kill();
        this._artSwapTimeline = null;
    }

    clearArtZoomHideTimer() {
        if (this._artZoomHideTimer == null) return;
        window.clearTimeout(this._artZoomHideTimer);
        this._artZoomHideTimer = null;
    }

    isExpandedArtOpen() {
        return !!(this.dom.artZoomModal && !this.dom.artZoomModal.hidden);
    }

    armPanelArtImage(img) {
        if (!img) return;
        img.classList.add('PL3-groupArtInPanel--expandable');
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', img.alt ? `Expand ${img.alt}` : 'Expand cover art');
    }

    disarmPanelArtImage(img) {
        if (!img) return;
        img.classList.remove('PL3-groupArtInPanel--expandable');
        img.removeAttribute('tabindex');
        img.removeAttribute('role');
        if ((img.getAttribute('aria-label') || '').startsWith('Expand ')) {
            img.removeAttribute('aria-label');
        }
    }

    openExpandedArt(sourceImg) {
        const modal = this.dom.artZoomModal;
        const modalImg = this.dom.artZoomImage;
        const src = sourceImg?.currentSrc || sourceImg?.getAttribute('src') || '';
        if (!modal || !modalImg || !src) return;

        this.clearArtZoomHideTimer();
        modalImg.src = src;
        modalImg.alt = sourceImg?.alt || 'Expanded cover art';

        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('PL3-artZoom--open');
            });
        });
        this.lockScroll();
    }

    closeExpandedArt(options = {}) {
        const { immediate = false } = options;
        const modal = this.dom.artZoomModal;
        const modalImg = this.dom.artZoomImage;
        if (!modal || modal.hidden) return;

        const finish = () => {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('PL3-artZoom--open');
            if (modalImg) {
                modalImg.removeAttribute('src');
                modalImg.removeAttribute('alt');
            }
            this._artZoomHideTimer = null;
        };

        this.clearArtZoomHideTimer();
        modal.classList.remove('PL3-artZoom--open');

        if (immediate) {
            finish();
        } else {
            this._artZoomHideTimer = window.setTimeout(finish, 220);
        }

        this.unlockScroll();
    }

    hasDistinctSingleVersionArt(groupKey) {
        if (!this.shouldAutoOpenSingleVersion(groupKey)) return false;
        const [songId] = this.getGroupSongIds(groupKey);
        const song = this.singlesById[songId];
        const group = this.groupsByKey[groupKey];
        const songImage = String(song?.image || '').trim();
        const groupCover = String(group?.cover || '').trim();
        return !!(songImage && groupCover && songImage !== groupCover);
    }

    getSingleVersionAutoOpenDelay(groupKey) {
        if (!this.flipReady) return 0;
        return this.hasDistinctSingleVersionArt(groupKey) ? this.ART_DOCK_FLIP_MS : 0;
    }

    shouldAutoOpenSingleVersion(groupKey) {
        return this.getGroupSongIds(groupKey).length === 1;
    }

    queueVersionOpen(songId, options = {}) {
        const { groupKey = this.activeGroupKey, hasBackNav = true, skipArtFlip = false, delayMs = 0 } = options;
        if (!songId) return;

        const scheduleOpen = () => {
            this._queuedVersionOpenTimer = null;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (this.activeGroupKey !== groupKey || this._panelState !== this.PANEL_STATE.GROUP) return;
                    const row = this.dom.groupPanelVersions?.querySelector(`[data-pl3-song-id="${songId}"]`);
                    if (!row) return;
                    this.openVersionDetail(row, songId, { hasBackNav, skipArtFlip });
                });
            });
        };

        this.clearQueuedVersionOpen();
        if (delayMs > 0) {
            this._queuedVersionOpenTimer = window.setTimeout(scheduleOpen, delayMs);
            return;
        }

        scheduleOpen();
    }

    queueSingleVersionOpen(groupKey) {
        const [songId] = this.getGroupSongIds(groupKey);
        if (!songId) return;

        this.queueVersionOpen(songId, {
            groupKey,
            hasBackNav: false,
            skipArtFlip: true,
            delayMs: this.getSingleVersionAutoOpenDelay(groupKey)
        });
    }

    openFromTrigger(triggerBtn, groupKey, options = {}) {
        const { skipAutoOpen = false } = options;
        if (!this.dom.groupPanel || !this.dom.groupPanelArtDock) return;
        const key = String(groupKey || '').trim();
        if (!key) return;
        if (this.isOpen() && this.activeGroupKey === key && this.activeSourceImg) return;

        this.clearQueuedVersionOpen();
        this.clearActiveArtSwap();

        const sourceBtn = this.resolveSourceArtButton(triggerBtn, key);
        if (!sourceBtn) return;

        if (this._panelState === this.PANEL_STATE.SONG) {
            this.closeVersionDetail({ immediate: true });
        }

        if (this.activeSourceBtn && this.activeSourceBtn !== sourceBtn) {
            this.restoreSourceArt({ animate: false });
        }

        this.renderGroup(key);
        this.renderGroupHeader(key);
        this.moveSourceArtToPanel(sourceBtn, key);
        this.openPanelShell();

        if (!skipAutoOpen && this.shouldAutoOpenSingleVersion(key)) {
            this.queueSingleVersionOpen(key);
        }
    }

    openFromShareRoute(groupKey, songToken = '') {
        const key = String(groupKey || '').trim();
        if (!key) return false;

        const sourceBtn = this.dom.galleryBtns.find((btn) => btn.getAttribute('data-pl3-group') === key)
            || this.dom.section.querySelector(`.PL3-upcomingArtWrap[data-pl3-group="${key}"]`)
            || this.dom.section.querySelector(`.PL3-galleryItemBtn[data-pl3-group="${key}"]`);
        if (!sourceBtn) return false;

        const songId = songToken ? this.findSongIdByShareToken(key, songToken) : '';
        this.openFromTrigger(sourceBtn, key, { skipAutoOpen: !!songId });

        if (songId) {
            const hasBackNav = this.getGroupSongIds(key).length > 1;
            this.queueVersionOpen(songId, {
                groupKey: key,
                hasBackNav,
                skipArtFlip: !hasBackNav
            });
        }

        return true;
    }

    close() {
        if (!this.isOpen() && !this.activeSourceBtn) return;
        this.clearQueuedVersionOpen();
        this.clearActiveArtSwap();
        this.closeExpandedArt({ immediate: true });
        this.closeVersionDetail({ immediate: true });
        this.restoreSourceArt({ animate: true });
        this.closePanelShell();
        this.activeGroupKey = '';
        this.renderGroupHeader('');
        this.syncGallerySelection('');
    }

    resolveSourceArtButton(triggerBtn, groupKey) {
        if (!triggerBtn) return null;
        if (triggerBtn.classList.contains('PL3-galleryItemBtn')) {
            return triggerBtn;
        }

        if (triggerBtn.classList.contains('PL3-upcomingArtWrap')) {
            if (triggerBtn.getAttribute('data-pl3-source-art') === 'gallery') {
                return this.dom.section.querySelector(`.PL3-galleryItemBtn[data-pl3-group="${groupKey}"]`) || triggerBtn;
            }
            return triggerBtn;
        }

        const upcoming = triggerBtn.closest('.PL3-upcoming');
        const upcomingArt = upcoming?.querySelector(`.PL3-upcomingArtWrap[data-pl3-group="${groupKey}"]`);
        if (upcomingArt) {
            if (upcomingArt.getAttribute('data-pl3-source-art') === 'gallery') {
                return this.dom.section.querySelector(`.PL3-galleryItemBtn[data-pl3-group="${groupKey}"]`) || upcomingArt;
            }
            return upcomingArt;
        }

        return this.dom.section.querySelector(`.PL3-galleryItemBtn[data-pl3-group="${groupKey}"]`);
    }

    moveSourceArtToPanel(sourceBtn, groupKey) {
        const sourceImg = sourceBtn.querySelector('img');
        if (!sourceImg) return;

        const alreadyDocked = sourceImg.parentElement === this.dom.groupPanelArtDock;
        if (alreadyDocked) {
            this.activeGroupKey = groupKey;
            this.syncGallerySelection(groupKey);
            return;
        }

        const flipState = this.flipReady ? window.Flip.getState(sourceImg) : null;

        sourceBtn.classList.add('PL3-artHost--detached');
        sourceImg.classList.add('PL3-groupArtInPanel');
        this.armPanelArtImage(sourceImg);
        this.dom.groupPanelArtDock.replaceChildren(sourceImg);

        this.activeSourceBtn = sourceBtn;
        this.activeSourceImg = sourceImg;
        this.activeGroupKey = groupKey;
        this.syncGallerySelection(groupKey);

        if (flipState) {
            window.Flip.from(flipState, {
                duration: 0.58,
                ease: 'power2.inOut',
                absolute: true,
                nested: true
            });
        }
    }

    restoreSourceArt({ animate } = {}) {
        const sourceBtn = this.activeSourceBtn;
        const sourceImg = this.activeSourceImg;
        if (!sourceBtn || !sourceImg) return;

        const flipState = animate && this.flipReady ? window.Flip.getState(sourceImg) : null;
        sourceBtn.classList.remove('PL3-artHost--detached');
        this.disarmPanelArtImage(sourceImg);
        sourceImg.classList.remove('PL3-groupArtInPanel');

        sourceBtn.replaceChildren(sourceImg);

        if (flipState) {
            window.Flip.from(flipState, {
                duration: 0.46,
                ease: 'power2.inOut',
                absolute: true,
                nested: true
            });
        }

        this.activeSourceBtn = null;
        this.activeSourceImg = null;
    }

    openPanelShell() {
        if (!this.dom.groupPanel) return;
        if (this._closeBtnPopTimer) {
            clearTimeout(this._closeBtnPopTimer);
            this._closeBtnPopTimer = null;
        }
        this.dom.groupPanel.setAttribute('aria-hidden', 'false');
        this.dom.groupPanel.classList.remove('PL3-groupPanel--closeReady');
        this.dom.groupPanel.classList.add('PL3-groupPanel--open');
        this._closeBtnPopTimer = window.setTimeout(() => {
            if (this._panelState === this.PANEL_STATE.CLOSED || !this.dom.groupPanel?.classList.contains('PL3-groupPanel--open')) return;
            this.dom.groupPanel.classList.add('PL3-groupPanel--closeReady');
            this._closeBtnPopTimer = null;
        }, 540);
        this._setPanelState(this.PANEL_STATE.GROUP);
    }

    closePanelShell() {
        if (!this.dom.groupPanel) return;
        this.clearQueuedVersionOpen();
        this.clearActiveArtSwap();
        if (this._closeBtnPopTimer) {
            clearTimeout(this._closeBtnPopTimer);
            this._closeBtnPopTimer = null;
        }
        this.dom.groupPanel.classList.remove('PL3-groupPanel--open');
        this.dom.groupPanel.classList.remove('PL3-groupPanel--closeReady');
        this.dom.groupPanel.setAttribute('aria-hidden', 'true');
        this.dom.groupPanelArtDock?.replaceChildren();
        this._setPanelState(this.PANEL_STATE.CLOSED);
    }

    syncGallerySelection(groupKey) {
        const key = String(groupKey || '');
        this.dom.galleryBtns.forEach((btn) => {
            const hasArt = !!btn.querySelector('.PL3-galleryImg');
            const isSelected = key && btn.getAttribute('data-pl3-group') === key && hasArt;
            btn.classList.toggle('PL3-galleryItemBtn--active', !!isSelected);
        });
    }

    renderGroup(groupKey) {
        const group = this.groupsByKey[groupKey];

        const versionsWrap = this.dom.groupPanelVersions;
        if (!versionsWrap) return;
        versionsWrap.replaceChildren();
        versionsWrap.classList.add('PL3-groupVersionList');

        const songIds = Array.isArray(group?.songIds) ? group.songIds : [];
        songIds.forEach((songId) => {
            const song = this.singlesById[songId];
            if (!song) return;

            const versionLabel = this.getVersionLabel(song);
            const row = document.createElement('article');
            row.className = 'PL3-groupVersionItem';
            row.dataset.pl3SongId = song.id;

            const art = document.createElement('img');
            art.className = 'PL3-groupVersionArt';
            art.src = song.image || group?.cover || 'img/music/opahifi_album.png';
            art.alt = `${group?.title || 'Release'} ${versionLabel} cover`;
            art.loading = 'lazy';
            art.onerror = () => { art.src = 'img/music/opahifi_album.png'; };

            // Wrap art so the share button can be overlaid on it
            const artWrap = document.createElement('div');
            artWrap.className = 'PL3-groupVersionArtWrap';
            artWrap.appendChild(art);

            const tray = document.createElement('div');
            tray.className = 'PL3-groupVersionTray';
            this.platformOrder.forEach((platform) => {
                const url = song.links?.[platform] || '';
                tray.appendChild(this.createPlatformEntry(platform, url, versionLabel));
            });

            const name = document.createElement('div');
            name.className = 'PL3-groupVersionName';
            name.textContent = versionLabel;

            const infoBtn = document.createElement('div');
            infoBtn.className = 'PL3-groupVersionInfoBtn';
            infoBtn.setAttribute('aria-hidden', 'true');

            const infoIcon = document.createElement('span');
            infoIcon.className = 'PL3-groupVersionInfoGlyph PL3-groupVersionInfoGlyph--info';
            infoIcon.setAttribute('aria-hidden', 'true');
            infoIcon.textContent = 'ℹ';

            const backIcon = document.createElement('span');
            backIcon.className = 'PL3-groupVersionInfoGlyph PL3-groupVersionInfoGlyph--back';
            backIcon.setAttribute('aria-hidden', 'true');
            backIcon.innerHTML = '&#8592;';

            infoBtn.append(infoIcon, backIcon);

            const body = document.createElement('div');
            body.className = 'PL3-groupVersionBody';
            body.append(name, tray);

            row.append(artWrap, body, infoBtn);
            versionsWrap.appendChild(row);
        });

        if (versionsWrap.childElementCount < 1) {
            const empty = document.createElement('div');
            empty.className = 'PL3-groupVersionEmpty';
            empty.textContent = 'No versions yet';
            versionsWrap.appendChild(empty);
        }
    }

    renderGroupHeader(groupKey) {
        if (!this.dom.groupPanelTitle) return;
        const group = this.groupsByKey[groupKey];
        const titleEl = this.dom.groupPanelTitle;
        const countEl = this.dom.groupPanelCount;
        titleEl.replaceChildren();

        const lines = Array.isArray(group?.titleLines) && group.titleLines.length
            ? group.titleLines.slice(0, 2)
            : (group?.title ? [group.title] : []);

        if (!lines.length) {
            titleEl.removeAttribute('aria-label');
            if (countEl) countEl.textContent = '';
            return;
        }

        titleEl.setAttribute('aria-label', group?.title || lines.join(' '));
        lines.forEach((lineText) => {
            const line = document.createElement('span');
            line.className = 'PL3-groupPanelGroupTitleLine';
            line.textContent = lineText;
            titleEl.appendChild(line);
        });

        if (countEl) {
            const versionCount = Array.isArray(group?.songIds) ? group.songIds.length : 0;
            countEl.textContent = versionCount > 0
                ? `(${versionCount} version${versionCount === 1 ? '' : 's'})`
                : '';
        }
    }

    pickPrimaryLink(links) {
        for (const name of this.platformOrder) {
            const url = links[name];
            if (url) return { platform: name, url };
        }
        const entries = Object.entries(links || {});
        if (entries.length < 1) return null;
        const [platform, url] = entries[0];
        return { platform, url };
    }

    createPlatformEntry(platform, url, versionLabel) {
        const platformLabel = this.displayPlatformName(platform);
        const hasUrl = !!String(url || '').trim();
        const item = document.createElement(hasUrl ? 'a' : 'span');
        item.className = `PL3-groupVersionPlatform${hasUrl ? '' : ' PL3-groupVersionPlatform--disabled'}`;
        item.setAttribute('aria-label', hasUrl ? `${versionLabel} on ${platformLabel}` : `${platformLabel} unavailable`);
        item.title = platformLabel;

        if (hasUrl) {
            item.href = url;
            item.target = '_blank';
            item.rel = 'noopener';
            item.dataset.pl3Platform = platformLabel;
        } else {
            item.setAttribute('aria-disabled', 'true');
        }

        item.appendChild(this.createPlatformIcon(platform));
        return item;
    }

    displayPlatformName(platform) {
        if (platform === 'Other') return 'YouTube';
        return platform;
    }

    createPlatformIcon(platform) {
        const iconUrlByPlatform = {
            'Spotify': 'img/ico/spotify-white.svg',
            'Apple Music': 'img/ico/apple-white.svg',
            'YouTube Music': 'img/ico/youtubemusic-white.svg',
            'Other': 'img/ico/youtube-white.svg'
        };

        if (iconUrlByPlatform[platform]) {
            const img = document.createElement('img');
            img.className = 'PL3-groupVersionPlatformIcon';
            img.src = iconUrlByPlatform[platform];
            img.alt = '';
            img.loading = 'lazy';
            return img;
        }

        const icon = document.createElement('i');
        if (platform === 'Amazon Music') {
            icon.className = 'fa-brands fa-amazon PL3-groupVersionPlatformIcon';
        } else {
            icon.className = 'fa-solid fa-link PL3-groupVersionPlatformIcon';
        }
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    }

    getPanelInner() {
        return this.dom.groupPanel?.querySelector('.PL3-groupPanelInner') || null;
    }

    setDetailMotionVars(panelInner, row) {
        if (!panelInner || !row) return;
        const panelRect = panelInner.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const originX = (rowRect.left - panelRect.left) + (rowRect.width / 2);
        const originY = (rowRect.top - panelRect.top) + (rowRect.height / 2);
        const scaleX = Math.max(0.24, Math.min(0.92, rowRect.width / Math.max(1, panelRect.width)));
        const scaleY = Math.max(0.1, Math.min(0.42, rowRect.height / Math.max(1, panelRect.height)));
        panelInner.style.setProperty('--pl3-panel-detail-origin-x', `${originX}px`);
        panelInner.style.setProperty('--pl3-panel-detail-origin-y', `${originY}px`);
        panelInner.style.setProperty('--pl3-panel-detail-scale-x', scaleX.toFixed(4));
        panelInner.style.setProperty('--pl3-panel-detail-scale-y', scaleY.toFixed(4));
    }

    ensureDetailBackHandler() {
        if (this._detailInfoBackHandler) return this._detailInfoBackHandler;
        this._detailInfoBackHandler = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            this.closeVersionDetail();
        };
        return this._detailInfoBackHandler;
    }

    createDetailDom(row, song, options = {}) {
        const { hasBackNav = true, skipArtFlip = false } = options;
        const detail = document.createElement('div');
        detail.className = 'PL3-groupPanelSongDetail';

        const stage = document.createElement('div');
        stage.className = 'PL3-groupPanelSongStage PL3-lyricsStage PL3-lyricsStage--loading PL3-lyricsStage--collapsed';
        stage.setAttribute('aria-label', 'Lyrics');

        const detailBody = row.querySelector('.PL3-groupVersionBody');
        const versionName = row.querySelector('.PL3-groupVersionName');
        const versionTray = row.querySelector('.PL3-groupVersionTray');
        const infoBtn = row.querySelector('.PL3-groupVersionInfoBtn');
        const versionArt = row.querySelector('.PL3-groupVersionArt');
        const dockArt = this.dom.groupPanelArtDock?.querySelector('img') || null;
        const groupMeta = this.dom.groupPanel?.querySelector('.PL3-groupPanelGroupMeta') || null;
        const groupTitle = this.dom.groupPanel?.querySelector('.PL3-groupPanelGroupTitle') || null;
        const shouldFlipArt = this.shouldFlipDetailArt(versionArt);
        const useDockArtForDetail = this.shouldUseDockArtForDetail(song, versionArt);
        const flipArtTarget = skipArtFlip
            ? null
            : (shouldFlipArt
                ? (useDockArtForDetail ? dockArt : versionArt)
                : dockArt);
        const detailControls = document.createElement('div');
        detailControls.className = 'PL3-groupPanelSongDetailControls';

        if (infoBtn && hasBackNav) {
            infoBtn.classList.add('PL3-groupVersionInfoBtn--back');
            infoBtn.setAttribute('aria-label', 'Back to versions');
            infoBtn.setAttribute('role', 'button');
            infoBtn.removeAttribute('aria-hidden');
            infoBtn.tabIndex = 0;
            infoBtn.addEventListener('click', this.ensureDetailBackHandler(), { passive: false });
            detailControls.appendChild(infoBtn);
        }

        detail.appendChild(detailControls);

        return {
            detail,
            stage,
            detailBody,
            versionName,
            versionTray,
            groupMeta,
            groupTitle,
            dockArt,
            flipArtTarget,
            shouldFlipArt,
            useDockArtForDetail,
            infoBtn: hasBackNav ? infoBtn : null,
            hasBackNav,
            versionArt,
            flipState: this.captureFlipState(
                flipArtTarget,
                detailBody,
                versionName,
                versionTray,
                groupMeta,
                groupTitle,
                infoBtn
            )
        };
    }

    captureFlipState(...targets) {
        const activeTargets = targets.filter(Boolean);
        if (!this.flipReady || !activeTargets.length) return null;
        return window.Flip.getState(activeTargets);
    }

    getImageIdentity(img) {
        if (!img) return '';
        return String(img.currentSrc || img.src || '').trim();
    }

    shouldFlipDetailArt(versionArt) {
        const dockArt = this.dom.groupPanelArtDock?.querySelector('img');
        if (!dockArt || !versionArt) return true;
        return this.getImageIdentity(dockArt) === this.getImageIdentity(versionArt);
    }

    shouldUseDockArtForDetail(song, versionArt) {
        return this.shouldAutoOpenSingleVersion(song?.groupKey) && this.shouldFlipDetailArt(versionArt);
    }

    animateDetailArtSwap(versionArt, previousDockArt) {
        if (!versionArt) return;
        const gsap = window.gsap;
        const cleanup = () => {
            this.resetTransientArtStyles(previousDockArt);
            previousDockArt?.remove();
            this.resetTransientArtStyles(versionArt);
            this._artSwapTimeline = null;
        };

        this.clearActiveArtSwap();
        if (!gsap) {
            cleanup();
            return;
        }

        const timeline = gsap.timeline({
            delay: 0.08,
            onComplete: cleanup,
            onInterrupt: cleanup
        });
        this._artSwapTimeline = timeline;

        if (previousDockArt) {
            timeline.to(previousDockArt, {
                opacity: 0,
                scale: 1.02,
                duration: 0.16,
                ease: 'power2.out'
            }, 0);
        }

        timeline.to(versionArt, {
            opacity: 1,
            scale: 1,
            duration: 0.16,
            ease: 'power2.out'
        }, 0.02);
    }

    prepareDockArtOverlay(img, options = {}) {
        if (!img) return;
        const { zIndex = 120, opacity = null, scale = null } = options;
        img.style.position = 'absolute';
        img.style.inset = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.pointerEvents = 'none';
        img.style.zIndex = String(zIndex);
        if (opacity != null) {
            img.style.opacity = String(opacity);
        }
        if (scale != null) {
            img.style.transform = `scale(${scale})`;
        }
    }

    resetTransientArtStyles(img) {
        if (!img) return;
        img.style.removeProperty('position');
        img.style.removeProperty('inset');
        img.style.removeProperty('width');
        img.style.removeProperty('height');
        img.style.removeProperty('object-fit');
        img.style.removeProperty('border-radius');
        img.style.removeProperty('pointer-events');
        img.style.removeProperty('opacity');
        img.style.removeProperty('transform');
        img.style.removeProperty('z-index');
    }

    getPrimaryDockArt(children) {
        return (children || []).find((node) => node?.tagName === 'IMG') || null;
    }

    prepareDockArtReveal(img) {
        if (!img) return;
        img.style.opacity = '0';
        img.style.transform = 'scale(0.97)';
    }

    animateDockArtReveal(img, delay = 0.3) {
        if (!img) return;
        const gsap = window.gsap;
        if (!gsap) {
            this.resetTransientArtStyles(img);
            return;
        }

        gsap.to(img, {
            opacity: 1,
            scale: 1,
            duration: 0.14,
            delay,
            ease: 'power2.out',
            onComplete: () => this.resetTransientArtStyles(img)
        });
    }

    mountDetailDom(detailParts, panelInner) {
        const { detail, stage, detailBody, versionArt, versionName, versionTray, groupMeta, groupTitle, dockArt, shouldFlipArt, useDockArtForDetail, flipState, hasBackNav } = detailParts;
        (groupMeta ?? this.dom.groupPanelVersions.parentElement).appendChild(detail);
        this.dom.groupPanelVersions.insertAdjacentElement('afterend', stage);

        this._activeDetailEl = detail;
        this._activeDetailStage = stage;
        this._detailBodyElement = detailBody;
        this._detailNameElement = versionName;
        this._detailTrayElement = versionTray;
        this._detailGroupMetaElement = groupMeta;
        this._detailGroupTitleElement = groupTitle;
        this._detailShouldFlipArt = shouldFlipArt;
        this._detailUseDockArt = useDockArtForDetail;
        this._detailHasBackNav = hasBackNav;
        this._detailInfoBtn = detailParts.infoBtn;

        if (this.flipReady && this.dom.groupPanelArtDock && detailBody && versionArt) {
            detail.style.display = 'flex';
            this._detailPrevDockChildren = Array.from(this.dom.groupPanelArtDock.children);
            this._detailArtElement = useDockArtForDetail ? dockArt : versionArt;
            const previousDockArt = shouldFlipArt ? null : dockArt;
            if (previousDockArt) {
                this.prepareDockArtOverlay(previousDockArt, { zIndex: 121, opacity: 1, scale: 1 });
            }
            detail.appendChild(detailBody);
            if (!useDockArtForDetail) {
                versionArt.classList.remove('PL3-groupVersionArt');
                versionArt.classList.add('PL3-groupArtInPanel');
                this.armPanelArtImage(versionArt);
                if (!shouldFlipArt) {
                    this.prepareDockArtOverlay(versionArt, { zIndex: 120, opacity: 0, scale: 0.97 });
                }
                this.dom.groupPanelArtDock.replaceChildren(versionArt);
                if (previousDockArt) {
                    this.dom.groupPanelArtDock.appendChild(previousDockArt);
                }
            }
            panelInner?.classList.add('PL3-groupPanelInner--detail');
            if (flipState) {
                window.Flip.from(flipState, {
                    duration: 0.5,
                    ease: 'power2.inOut',
                    absolute: true,
                    scale: true,
                    nested: true
                });
            }
            if (!shouldFlipArt) {
                this.animateDetailArtSwap(versionArt, previousDockArt);
            }
            return;
        }

        if (detailBody) {
            detail.style.display = 'flex';
            detail.appendChild(detailBody);
        }
        this._detailArtElement = versionArt || null;
        panelInner?.classList.add('PL3-groupPanelInner--detail');
    }

    scheduleStageActivation(stage, song, transitionId) {
        const gsap = window.gsap;
        const expandStage = () => {
            if (transitionId !== this._transitionId || this._panelState !== this.PANEL_STATE.SONG) return;
            stage.classList.remove('PL3-lyricsStage--collapsed');
            if (!song.lyricsPath) {
                stage.classList.remove('PL3-lyricsStage--loading');
                return;
            }
            fetch(song.lyricsPath)
                .then(r => r.ok ? r.text() : Promise.reject())
                .then(text => {
                    if (transitionId !== this._transitionId || this._activeDetailStage !== stage) return;
                    stage.classList.remove('PL3-lyricsStage--loading');
                    this._buildDrum(stage, text);
                })
                .catch(() => {
                    if (transitionId === this._transitionId && this._activeDetailStage === stage) {
                        stage.classList.remove('PL3-lyricsStage--loading');
                    }
                });
        };

        const activate = () => {
            if (transitionId !== this._transitionId || this._panelState !== this.PANEL_STATE.SONG) return;
            if (!gsap) {
                expandStage();
                return;
            }
            gsap.fromTo(stage,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out', onComplete: expandStage }
            );
        };

        if (gsap && this.flipReady) {
            gsap.delayedCall(0.18, activate);
            return;
        }
        activate();
    }

    stopLyricsPlayback() {
        this._lyricsTween?.kill();
        this._lyricsTween = null;
        this._drumScroller = null;
    }

    getActiveDetailSnapshot() {
        return {
            row: this._activeDetailRow,
            songId: this._activeDetailSongId,
            detail: this._activeDetailEl,
            stage: this._activeDetailStage,
            detailBody: this._detailBodyElement,
            versionName: this._detailNameElement,
            versionTray: this._detailTrayElement,
            groupMeta: this._detailGroupMetaElement,
            groupTitle: this._detailGroupTitleElement,
            shouldFlipArt: this._detailShouldFlipArt,
            useDockArtForDetail: this._detailUseDockArt,
            hasBackNav: this._detailHasBackNav,
            art: this._detailArtElement,
            prevDockChildren: this._detailPrevDockChildren,
            infoBtn: this._detailInfoBtn
        };
    }

    restoreDetailLayout(detailState, panelInner) {
        const { row, detailBody, art, prevDockChildren, infoBtn, useDockArtForDetail } = detailState;
        if (!row) return;

        const rowInfoBtn = row.querySelector('.PL3-groupVersionInfoBtn');
        panelInner?.classList.remove('PL3-groupPanelInner--detail');

        if (art && this.dom.groupPanelArtDock && !useDockArtForDetail) {
            const artWrap = row.querySelector('.PL3-groupVersionArtWrap');
            if (artWrap) {
                this.disarmPanelArtImage(art);
                art.classList.remove('PL3-groupArtInPanel');
                art.classList.add('PL3-groupVersionArt');
                artWrap.replaceChildren(art);
            }
            if (prevDockChildren?.length) {
                this.dom.groupPanelArtDock.replaceChildren(...prevDockChildren);
            } else {
                this.dom.groupPanelArtDock.replaceChildren();
            }
        }

        if (detailBody) {
            if (rowInfoBtn) {
                row.insertBefore(detailBody, rowInfoBtn);
            } else {
                row.appendChild(detailBody);
            }
        }

        if (infoBtn) {
            infoBtn.classList.remove('PL3-groupVersionInfoBtn--back');
            infoBtn.setAttribute('aria-hidden', 'true');
            infoBtn.removeAttribute('aria-label');
            infoBtn.removeAttribute('role');
            infoBtn.tabIndex = -1;
            if (this._detailInfoBackHandler) {
                infoBtn.removeEventListener('click', this._detailInfoBackHandler);
            }
            row.appendChild(infoBtn);
        }
    }

    clearActiveDetailState(detailState) {
        detailState.detail?.remove();
        detailState.stage?.remove();
        this._activeDetailRow = null;
        this._activeDetailSongId = null;
        this._activeDetailEl = null;
        this._activeDetailStage = null;
        this._detailBodyElement = null;
        this._detailNameElement = null;
        this._detailTrayElement = null;
        this._detailGroupMetaElement = null;
        this._detailGroupTitleElement = null;
        this._detailShouldFlipArt = null;
        this._detailUseDockArt = null;
        this._detailHasBackNav = null;
        this._detailArtElement = null;
        this._detailPrevDockChildren = null;
        this._detailInfoBtn = null;
    }

    // ── Version Detail (in-panel) ──────────────────────────────────────────

    openVersionDetail(row, songId, options = {}) {
        const { hasBackNav = true, skipArtFlip = false } = options;
        if (this._panelState !== this.PANEL_STATE.GROUP || this._activeDetailRow) return;
        const song = this.singlesById[songId];
        if (!song) return;

        this.closeExpandedArt({ immediate: true });
        this.clearActiveArtSwap();
        const transitionId = this._bumpTransition();

        this._activeDetailRow = row;
        this._activeDetailSongId = songId;
        this._lyricsTween = null;
        this._drumScroller = null;
        this._setPanelState(this.PANEL_STATE.SONG);

        const panelInner = this.getPanelInner();
        this.setDetailMotionVars(panelInner, row);

        const detailParts = this.createDetailDom(row, song, { hasBackNav, skipArtFlip });
        this.mountDetailDom(detailParts, panelInner);
        this.scheduleStageActivation(detailParts.stage, song, transitionId);
    }

    closeVersionDetail(options = {}) {
        const { immediate = false } = options;
        if (!this._activeDetailRow) return;

        this.clearActiveArtSwap();
        const transitionId = this._bumpTransition();
        const detailState = this.getActiveDetailSnapshot();
        const panelInner = this.getPanelInner();
        const gsap = window.gsap;

        this.stopLyricsPlayback();

        const finish = () => {
            if (transitionId !== this._transitionId) return;
            this.clearActiveDetailState(detailState);
            this._setPanelState(this.PANEL_STATE.GROUP);
        };

        const runReverseFlip = () => {
            if (transitionId !== this._transitionId) return;
            const restoredDockArt = this.getPrimaryDockArt(detailState.prevDockChildren);
            if (!detailState.shouldFlipArt) {
                this.prepareDockArtReveal(restoredDockArt);
            }
            const flipState = immediate
                ? null
                : this.captureFlipState(
                    detailState.detailBody,
                    detailState.versionName,
                    detailState.versionTray,
                    detailState.groupMeta,
                    detailState.groupTitle,
                    detailState.art,
                    detailState.infoBtn
                );

            this.restoreDetailLayout(detailState, panelInner);

            if (flipState) {
                window.Flip.from(flipState, {
                    duration: 0.42,
                    ease: 'power2.inOut',
                    absolute: true,
                    scale: true,
                    nested: true,
                    onComplete: finish
                });
                if (!detailState.shouldFlipArt) {
                    this.animateDockArtReveal(restoredDockArt, 0.3);
                }
            } else {
                this.resetTransientArtStyles(restoredDockArt);
                finish();
            }
        };

        if (immediate) {
            runReverseFlip();
            return;
        }

        if (detailState.stage && gsap) {
            gsap.to(detailState.stage, {
                opacity: 0,
                y: 12,
                duration: 0.18,
                ease: 'power2.in',
                onComplete: runReverseFlip
            });
        } else {
            runReverseFlip();
        }
    }

    _buildDrum(stage, rawText) {
        const rawLines = rawText.split('\n').map(l => l.trim());
        let s = 0, e = rawLines.length - 1;
        while (s <= e && !rawLines[s]) s++;
        while (e >= s && !rawLines[e]) e--;
        const lines = rawLines.slice(s, e + 1);
        if (!lines.length) return;

        const scroller = document.createElement('div');
        scroller.className = 'PL3-lyricsScroller';

        const content = document.createElement('div');
        content.className = 'PL3-lyricsContent';

        lines.forEach(text => {
            const p = document.createElement('p');
            p.className = 'PL3-lyricsLine' + (!text ? ' PL3-lyricsLine--blank' : '');
            p.textContent = text || '';
            content.appendChild(p);
        });

        scroller.appendChild(content);

        // Custom Opa scrollbar
        const track = document.createElement('div');
        track.className = 'PL3-lyricsTrack';
        const thumb = document.createElement('div');
        thumb.className = 'PL3-lyricsThumb';
        const thumbImg = document.createElement('img');
        thumbImg.src = 'img/opa/scroller_opa.png';
        thumbImg.alt = '';
        thumbImg.className = 'PL3-lyricsThumbImg';
        thumb.appendChild(thumbImg);
        track.appendChild(thumb);

        stage.appendChild(scroller);
        stage.appendChild(track);
        this._drumScroller = scroller;

        // Sync thumb position to scroll
        const syncThumb = () => {
            const scrollable = scroller.scrollHeight - scroller.clientHeight;
            const trackH = track.clientHeight;
            const thumbH = thumb.offsetHeight;
            const ratio = scrollable > 0 ? scroller.scrollTop / scrollable : 0;
            thumb.style.top = (ratio * (trackH - thumbH)) + 'px';
        };
        scroller.addEventListener('scroll', syncThumb, { passive: true });

        const pauseAuto = () => { this._lyricsTween?.pause(); };
        // Also pause if user manually scrolls
        scroller.addEventListener('touchstart', pauseAuto, { passive: true });
        scroller.addEventListener('wheel', pauseAuto, { passive: true });

        // Full drag on thumb with pointer capture
        thumb.addEventListener('pointerdown', (ev) => {
            ev.preventDefault();
            pauseAuto();
            thumb.setPointerCapture(ev.pointerId);
            const startY = ev.clientY;
            const startTop = parseFloat(thumb.style.top) || 0;
            const trackH = track.clientHeight;
            const thumbH = thumb.offsetHeight;
            const travel = trackH - thumbH;

            const onMove = (e) => {
                const dy = e.clientY - startY;
                const newTop = Math.max(0, Math.min(travel, startTop + dy));
                thumb.style.top = newTop + 'px';
                const scrollable = scroller.scrollHeight - scroller.clientHeight;
                scroller.scrollTop = (newTop / travel) * scrollable;
            };
            const onUp = () => {
                thumb.removeEventListener('pointermove', onMove);
                thumb.removeEventListener('pointerup', onUp);
            };
            thumb.addEventListener('pointermove', onMove);
            thumb.addEventListener('pointerup', onUp);
        });

        // Tap on track (not thumb) jumps to position
        track.addEventListener('pointerdown', (ev) => {
            if (ev.target === thumb || thumb.contains(ev.target)) return;
            pauseAuto();
            const rect = track.getBoundingClientRect();
            const thumbH = thumb.offsetHeight;
            const travel = rect.height - thumbH;
            const ratio = Math.max(0, Math.min(1, (ev.clientY - rect.top - thumbH / 2) / travel));
            const scrollable = scroller.scrollHeight - scroller.clientHeight;
            scroller.scrollTop = ratio * scrollable;
        });

        // Auto-scroll from top through all lyrics
        const gsap = window.gsap;
        if (gsap) {
            requestAnimationFrame(() => {
                syncThumb();
                const scrollable = scroller.scrollHeight - scroller.clientHeight;
                if (scrollable > 0) {
                    this._lyricsTween = gsap.to(scroller, {
                        scrollTop: scrollable,
                        duration: lines.length * 1.8,
                        ease: 'none',
                        delay: 1.2,
                        onUpdate: syncThumb
                    });
                }
            });
        }
    }

    humanizeGroupKey(key) {
        return String(key || '')
            .split('-')
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }
}

class PL3GallerySection {
    constructor(dom, callbacks = {}) {
        this.dom = dom;
        this.onGroupSelect = callbacks.onGroupSelect || (() => { });
        this.playlistExpanded = false;
    }

    init() {
        if (!this.dom.section) return;
        this.dom.section.addEventListener('click', this.onSectionClick, { passive: false });
    }

    onSectionClick = (ev) => {
        const playlistToggle = ev.target.closest('[data-pl3-playlist-toggle]');
        if (playlistToggle) {
            const isPlaylistLink = ev.target.closest('[data-pl3-playlist-links] a');
            if (isPlaylistLink) return;
            ev.preventDefault();
            this.playlistExpanded ? this.collapsePlaylistPill() : this.expandPlaylistPill();
            return;
        }

        const playlistClose = ev.target.closest('[data-pl3-playlist-close]');
        if (playlistClose) {
            ev.preventDefault();
            this.collapsePlaylistPill();
            return;
        }

        if (ev.target.closest('[data-pl3-playlist-links]')) return;

        const btn = ev.target.closest('[data-pl3-group]');
        if (!btn || !this.dom.section.contains(btn)) {
            if (this.playlistExpanded) this.collapsePlaylistPill();
            return;
        }
        this.collapsePlaylistPill();
        ev.preventDefault();
        this.onGroupSelect(btn, btn.getAttribute('data-pl3-group') || '');
    };

    expandPlaylistPill() {
        const toggle = this.dom.playlistPillToggle;
        const links = this.dom.playlistPillLinks;
        if (!toggle || !links) return;

        toggle.classList.add('PL3-playlistPill--expanded');
        toggle.setAttribute('aria-expanded', 'true');
        links.hidden = false;
        this.playlistExpanded = true;
    }

    collapsePlaylistPill() {
        const toggle = this.dom.playlistPillToggle;
        const links = this.dom.playlistPillLinks;
        if (!toggle || !links) return;

        toggle.classList.remove('PL3-playlistPill--expanded');
        toggle.setAttribute('aria-expanded', 'false');
        links.hidden = true;
        this.playlistExpanded = false;
    }
}

// PL3 Controller Class - UI orchestration
class PL3Controller {
    constructor(sectionId) {
        this.section = document.getElementById(sectionId);
        if (!this.section) return;

        this.scrollLock = new PL3ScrollLock();
        this.el = new PL3DomRegistry(this.section);
        this.headerSection = new PL3HeaderSection(this.el);
        this.buttonsSection = new PL3ButtonsSection(this.el);
        this.highlightSection = new PL3HighlightSection(this.el, {
            lockScroll: () => this.lockScroll(),
            unlockScroll: () => this.unlockScroll()
        });
        this.groupPanelSection = new PL3GroupPanel(this.el, {
            lockScroll: () => this.lockScroll(),
            unlockScroll: () => this.unlockScroll()
        });
        this.gallerySection = new PL3GallerySection(this.el, {
            onGroupSelect: (btn, groupKey) => this.groupPanelSection.openFromTrigger(btn, groupKey)
        });

        this.init();
    }

    getInitialShareRoute() {
        const url = new URL(window.location.href);
        const groupKey = String(url.searchParams.get('pl3') || '').trim();
        const songToken = String(
            url.searchParams.get('pl3s')
            || url.searchParams.get('song')
            || ''
        ).trim();

        return { groupKey, songToken };
    }

    openInitialShareRoute() {
        const { groupKey, songToken } = this.getInitialShareRoute();
        if (!groupKey) return;

        requestAnimationFrame(() => {
            this.groupPanelSection.openFromShareRoute(groupKey, songToken);
        });
    }

    clearIntroPreload() {
        this.section?.classList.remove('PL3-section--preload');
    }

    playIntro() {
        if (!this.section) return;

        const gsap = window.gsap;
        const hasReducedMotion = typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const { groupKey } = this.getInitialShareRoute();

        if (!gsap || hasReducedMotion || groupKey) {
            this.clearIntroPreload();
            return;
        }

        const nav = this.section.querySelector('.PL3-nav');
        const heroCover = this.section.querySelector('.PL3-heroRow');
        const brand = this.section.querySelector('.PL3-heroTitle');
        const slogan = this.section.querySelector('.PL3-heroSlogan');
        const tabs = this.section.querySelector('.PL3-tabs');
        const releaseArt = this.section.querySelector('.PL3-upcomingArtWrap');
        const releaseArtImage = this.section.querySelector('.PL3-upcomingArt');
        const releasePanel = this.section.querySelector('.PL3-upcoming--playingNow');
        const releaseCopy = releasePanel
            ? Array.from(releasePanel.children).filter((node) => node.matches('.PL3-upcomingHeader, .PL3-upcomingPlayerCard'))
            : [];
        const galleryHeader = this.section.querySelector('.PL3-galleryHeader');
        const galleryItems = Array.from(this.section.querySelectorAll('.PL3-galleryItemBtn'));
        const galleryImages = Array.from(this.section.querySelectorAll('.PL3-galleryImg'));
        const animatedNodes = [
            nav,
            heroCover,
            brand,
            ...this.el.heroBtns,
            slogan,
            tabs,
            releaseArt,
            releaseArtImage,
            releaseCopy,
            galleryHeader,
            ...galleryItems,
            ...galleryImages
        ].filter(Boolean);

        const timeline = gsap.timeline({
            defaults: {
                duration: 0.74,
                ease: 'power3.out'
            },
            onComplete: () => {
                this.clearIntroPreload();
                gsap.set(animatedNodes, { clearProps: 'all' });
            }
        });

        const addStep = (target, vars, position) => {
            if (!target || (Array.isArray(target) && !target.length)) return;
            timeline.to(target, vars, position);
        };

        addStep(nav, { y: 0, opacity: 1, duration: 0.56 });
        addStep(heroCover, {
            scale: 1,
            opacity: 1,
            filter: 'saturate(1) blur(0px)',
            duration: 0.82
        }, '-=0.2');
        addStep(brand, { x: 0, opacity: 1, duration: 0.58 }, '-=0.28');
        addStep(this.el.heroBtns, {
            y: 0,
            opacity: 1,
            stagger: 0.07,
            duration: 0.46
        }, '<0.08');
        addStep(slogan, { y: 0, opacity: 1, duration: 0.68 }, '-=0.42');
        addStep(tabs, { y: 0, opacity: 1, duration: 0.72 }, '-=0.34');
        addStep(releaseArt, {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 0.68
        }, '-=0.5');
        addStep(releaseArtImage, {
            scale: 1,
            opacity: 1,
            duration: 0.72
        }, '<0.04');
        addStep(releaseCopy, { x: 0, opacity: 1, duration: 0.62 }, '<0.08');
        addStep(galleryHeader, { y: 0, opacity: 1, duration: 0.58 }, '-=0.34');
        addStep(galleryItems, {
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.06,
            duration: 0.56
        }, '-=0.26');
        addStep(galleryImages, {
            scale: 1,
            opacity: 1,
            stagger: 0.06,
            duration: 0.62
        }, '<');
    }

    init() {
        if (!this.section) return;
        this.headerSection.init();
        this.buttonsSection.init();
        this.highlightSection.init();
        this.groupPanelSection.init();
        this.gallerySection.init();
        this.playIntro();
        this.openInitialShareRoute();
    }

    lockScroll() { this.scrollLock.lock(); }
    unlockScroll() { this.scrollLock.unlock(); }
}
window.initPL3 = function () { window.PL3Instance = new PL3Controller('p_listen3'); };

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initPL3);
} else {
    window.initPL3();
}

