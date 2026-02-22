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
        if (el.hasAttribute('data-pl3-share-group')) return 'pl3_share_open';
        if (el.hasAttribute('data-pl3-share-copy')) return 'pl3_share_copy';
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
            '[data-track],a,button,[role="button"],[data-pl3-action],[data-pl3-group],[data-pl3-preview],[data-pl3-share-group],[data-pl3-share-copy],[data-pl3-preview-sound],[data-pl3-platform]'
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
        BELIEVE_THE_TRUTH_FAIRY: 'believe-the-truth-fairy'
    });

    const SINGLE = Object.freeze({
        OLD_LOVE_STORY: 'old-love-story',
        OPA_PA_PA_PARTY: 'opa-pa-pa-party',
        GLITTAA: 'glittaa',
        SPLENDA_LOVE_RABBIT_HELL: 'splenda-love-rabbit-hell',
        GLITTAA_PHOENIX_SUNRIZE_MAX_MIX: 'glittaa-phoenix-sunrize-max-mix',
        BELIEVE_THE_TRUTH_FAIRY: 'believe-the-truth-fairy',
        FULL_MINDNESS: 'full-mindness'
    });

    const platformOrder = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Other'];

    const groups = [
        {
            id: 1,
            key: GROUP.OLD_LOVE_STORY,
            title: 'Old Love Story',
            titleLines: ['OLD LOVE', 'STORY'],
            cover: 'img/music/main_oldlovestory.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 2,
            key: GROUP.OPA_PA_PA_PARTY,
            title: 'Opa pa pa party',
            titleLines: ['OPA PA', 'PA PARTY!'],
            cover: 'img/music/main_oparty.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 3,
            key: GROUP.GLITTAA_PHOENIX,
            title: 'Glittaa Phoenix',
            titleLines: ['GLITTAA', 'PHOENIX!'],
            cover: 'img/music/main_glitta.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 4,
            key: GROUP.SPLENDA_LOVE_RABBIT_HELL,
            title: 'Splenda Love Rabbit Hell',
            titleLines: ['SPLENDA LOVE', 'RABBIT HELL'],
            cover: 'img/music/main_splenda_rabbit.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 5,
            key: GROUP.BELIEVE_THE_TRUTH_FAIRY,
            title: 'Believe the Truth fairy',
            titleLines: ['BELIEVE the', 'TRUTH FAIRY'],
            cover: 'img/music/main_truthfairy.png',
            songIds: [],
            singlesById: {}
        },
        {
            id: 6,
            key: GROUP.FULL_MINDNESS,
            title: 'Full-Mindness',
            titleLines: ['FULL-', 'MINDNESS'],
            cover: 'img/music/main_full_mindness.png',
            songIds: [],
            singlesById: {},

        }
    ];

    const groupsByKey = {};
    for (const g of groups) {
        groupsByKey[g.key] = g;
    }

    const singlesById = {
        [SINGLE.OLD_LOVE_STORY]: {
            id: SINGLE.OLD_LOVE_STORY,
            groupKey: GROUP.OLD_LOVE_STORY,
            title: 'Old Love Story',
            version: 'Desert Disco Duet',
            image: 'img/music/oldlovestory_opa-max-mix.png',
            lyricsPath: 'lyrics/old-love-story.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=iBtEe-Ch8Qo&list=OLAK5uy_mtnikKbgC0QYek2mnPWKJy-Ewr7E1e0zE',
                'Amazon Music': 'https://music.amazon.com/albums/B0FXB4X48G',
                'Spotify': 'https://open.spotify.com/track/5jvOt03Y3cQdBqocYmbUII',
                'Apple Music': 'https://music.apple.com/us/album/old-love-story-desert-disco-duet-single/1848551028',
                'Other': 'https://youtu.be/iBtEe-Ch8Qo?si=15gHOW9HM6DAGmjq'
            }
        },
        [SINGLE.OPA_PA_PA_PARTY]: {
            id: SINGLE.OPA_PA_PA_PARTY,
            groupKey: GROUP.OPA_PA_PA_PARTY,
            title: 'Opa pa pa party',
            image: 'img/music/main_oparty.png',
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
            image: 'img/music/3_glitta.png',
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
            image: 'img/music/main_splenda_rabbit.png',
            lyricsPath: 'lyrics/splenda-love-rabbit-hell.txt',
            links: {
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
            image: 'img/music/glittaa_max-mix.png',
            lyricsPath: 'lyrics/glittaa-pheonix.txt',
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
            image: 'img/music/main_truthfairy.png',
            lyricsPath: 'lyrics/beleive-the-truth-fairy.txt',
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
            image: 'img/music/main_full_mindness.png',
            lyricsPath: 'lyrics/full-mindness.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=lE193jDewd4&si=D9lyKQ-KrLwWuZ0Z',
                'Other': 'https://youtu.be/lE193jDewd4?si=YywLQUMDj7DPgCwh',
                'Spotify': 'https://open.spotify.com/track/6lp1u1WV8q0Aqfej1YeF8v?si=35f35519ca434960',
                'Amazon Music': 'https://music.amazon.com/albums/B0GPL4Q4R5?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_sac7n1RtCHUgR8GuzWLD1fZ7D&trackAsin=B0GPLBB653'
            }
        }
    };

    const singleIdsInOrder = [
        SINGLE.OLD_LOVE_STORY,
        SINGLE.OPA_PA_PA_PARTY,
        SINGLE.GLITTAA,
        SINGLE.SPLENDA_LOVE_RABBIT_HELL,
        SINGLE.GLITTAA_PHOENIX_SUNRIZE_MAX_MIX,
        SINGLE.BELIEVE_THE_TRUTH_FAIRY,
        SINGLE.FULL_MINDNESS,
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

const PL3GSAP = (typeof window !== 'undefined' && window.gsap) ? window.gsap : null;
const PL3Flip = (typeof window !== 'undefined' && window.Flip) ? window.Flip : null;
if (PL3GSAP && PL3Flip && typeof PL3GSAP.registerPlugin === 'function') {
    try { PL3GSAP.registerPlugin(PL3Flip); } catch { /* ignore */ }
}

class PL3MusicModel {
    constructor(data = window.musicDataGrouped) {
        this.data = data || { groups: [], platformOrder: [], singlesById: {} };
        this.defaultPlatformOrder = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Other'];
    }

    getGroup(key) {
        return this.data?.groups?.find((group) => String(group.key) === String(key)) || null;
    }

    getPlatformOrder() {
        return this.data?.platformOrder?.length ? this.data.platformOrder : this.defaultPlatformOrder;
    }

    getSingle(groupKey, singleId) {
        const group = this.getGroup(groupKey);
        if (!group || !singleId) return null;
        return group.singlesById?.[String(singleId)] || null;
    }

    buildGroupUrl(groupKey, singleId = null) {
        const safeKey = encodeURIComponent(String(groupKey || ''));
        const safeSingleId = singleId ? encodeURIComponent(String(singleId)) : '';
        const suffix = safeSingleId ? `?pl3s=${safeSingleId}` : '';
        try {
            return `${window.location.origin}/s/${safeKey}${suffix}`;
        } catch (e) {
            return `/s/${safeKey}${suffix}`;
        }
    }
}

class PL3StateModel {
    constructor() {
        this.expandedBtn = null;
        this.activeGalleryBtn = null;
        this.openGroupKey = null;
        this.openSingleId = null;
        this.singleViewLocked = false;
        this.shareUrl = '';
        this.previewVideoId = '';
        this.previewMuted = false;
    }
}

class PL3DomRegistry {
    constructor(section) {
        this.section = section;
        this.btnRow = section.querySelector('.PL3-btnRow');
        this.heroBtns = Array.from(section.querySelectorAll('.PL3-heroBtn'));
        this.previewBtn = section.querySelector('[data-pl3-preview]');
        this.gallery = section.querySelector('.PL3-gallery');
        this.galleryBtns = Array.from(section.querySelectorAll('.PL3-galleryItemBtn'));
        this.galleryPart = section.querySelector('.PL3-part--gallery');
        this.streamingBtns = Array.from(document.querySelectorAll('[data-pl3-streaming-popup]'));
        this.modal = document.getElementById('PL3-group-modal');
        this.heroCrop = document.getElementById('PL3-group-hero-crop');
        this.heroImg = document.getElementById('PL3-group-hero-img');
        this.titleEl = document.getElementById('PL3-group-title');
        this.mixesEl = document.getElementById('PL3-mixes');
        this.emptyEl = document.getElementById('PL3-mixes-empty');
        this.backBtn = document.getElementById('PL3-group-back-btn');
        this.songCard = document.getElementById('PL3-song-card');
        this.songCardTrack = document.getElementById('PL3-song-card-track');
        this.songDetailCard = document.getElementById('PL3-song-detail-card');
        this.songHeaderTarget = document.getElementById('PL3-song-header-target');
        this.lyricsText = document.getElementById('PL3-song-lyrics-text');
        this.shareModal = document.getElementById('PL3-share-modal');
        this.shareInput = document.getElementById('PL3-share-url');
        this.previewModal = document.getElementById('PL3-preview-modal');
        this.previewIframe = document.getElementById('PL3-preview-iframe');
        this.streamingModal = document.getElementById('PL3-streaming-modal');

        this.modalPanel = this.modal?.querySelector('.PL3-modalPanel');
        this.coverOverlay = this.heroCrop?.querySelector('.PL3-coverOverlay');
        this.titleLine1 = this.titleEl?.querySelector('[data-pl3-title-line="1"]');
        this.titleLine2 = this.titleEl?.querySelector('[data-pl3-title-line="2"]');
        this.previewSoundBtn = this.previewModal?.querySelector('[data-pl3-preview-sound]');

        this.mixRows = this.mixesEl
            ? Array.from(this.mixesEl.querySelectorAll('[data-pl3-mix-row]')).map((row) => ({
                row,
                art: row.querySelector('[data-pl3-mix-art]'),
                name: row.querySelector('[data-pl3-mix-name]'),
                links: Array.from(row.querySelectorAll('[data-pl3-platform]'))
            }))
            : [];
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

// PL3 Controller Class - orchestrates UI + model + state
class PL3Controller {
    constructor(sectionId, model = new PL3MusicModel()) {
        this.section = document.getElementById(sectionId);
        if (!this.section) return;

        this.model = model;
        this.state = new PL3StateModel();
        this.scrollLock = new PL3ScrollLock();
        this.el = new PL3DomRegistry(this.section);
        this.galleryShiftRaf = null;
        this.groupScrollRaf = null;
        this.groupTopSyncTimeout = null;
        this.groupOpenScrollY = 0;
        this.modalCloseTimer = null;
        this.currentMixRow = null;
        this.currentMixPlaceholder = null;
        this.cardSlideTween = null;
        this.lyricsCache = new Map();
        this.init();
    }

    init() {
        if (!this.section) return;
        this.attachButtonEvents();
        this.attachGalleryEvents();
        this.attachModalEvents();
        this.attachShareEvents();
        this.attachPreviewEvents();
        this.attachStreamingPopupEvents();
        window.addEventListener('resize', () => {
            this.queueGalleryShiftSync();
        }, { passive: true });
        this.openFromUrlIfPresent();
    }

    // === Streaming Services Popup ===
    attachStreamingPopupEvents() {
        if (this.el.streamingBtns && this.el.streamingBtns.length > 0) {
            this.el.streamingBtns.forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    this.openStreamingPopup();
                }, { passive: false });
            });
        }

        const m = this.el.streamingModal;
        if (m) {
            m.addEventListener('click', (ev) => {
                if (!ev.target.closest('[data-pl3-streaming-close]') || !m.contains(ev.target)) return;
                ev.preventDefault();
                this.closeStreamingPopup();
            }, { passive: false });
        }

        window.addEventListener('keydown', (ev) => {
            if (!this.el.streamingModal || this.el.streamingModal.hidden || ev.key !== 'Escape') return;
            this.closeStreamingPopup();
        }, { passive: true });
    }

    openStreamingPopup() {
        const m = this.el.streamingModal;
        if (!m) return;
        m.hidden = false;
        m.removeAttribute('aria-hidden');
        this.lockScroll();
    }

    closeStreamingPopup() {
        const m = this.el.streamingModal;
        if (!m) return;
        m.hidden = true;
        m.setAttribute('aria-hidden', 'true');
        this.unlockScroll();
    }

    // === Preview (embedded YouTube) ===
    attachPreviewEvents() {
        if (this.el.previewBtn) {
            this.el.previewBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                this.openPreviewModal('https://www.youtube.com/embed/videoseries?list=PLtGnlTqdsNV2QBkI-_1QFuidj3alcuLHF');
            }, { passive: false });
        }

        const m = this.el.previewModal;
        if (m) {
            m.addEventListener('click', (ev) => {
                if (ev.target.closest('[data-pl3-preview-sound]')) {
                    ev.preventDefault();
                    this.state.previewMuted = !this.state.previewMuted;
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
            if (!this.el.previewModal || this.el.previewModal.hidden || ev.key !== 'Escape') return;
            this.closePreviewModal();
        }, { passive: true });
    }

    openPreviewModal(videoId) {
        const m = this.el.previewModal;
        if (!m) return;
        const id = String(videoId || '').trim();
        if (!id) return;

        this.state.previewVideoId = id;
        this.state.previewMuted = false;
        this.applyPreviewIframeSrc();
        this.syncPreviewSoundUi();

        m.hidden = false;
        m.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                m.classList.add('PL3-preview--open');
            });
        });
    }

    applyPreviewIframeSrc() {
        const id = String(this.state.previewVideoId || '').trim();
        if (!id || !this.el.previewIframe) return;

        let src;
        if (id.includes('youtube.com/embed/videoseries')) {
            src = id;
        } else if (id.includes('playlist?list=') || id.includes('list=')) {
            const url = new URL(id);
            const playlistId = url.searchParams.get('list');
            src = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&autoplay=1&modestbranding=1&controls=1`;
        } else {
            const mute = this.state.previewMuted ? 1 : 0;
            src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&mute=${mute}&playsinline=1&rel=0&controls=1&modestbranding=1`;
        }
        this.el.previewIframe.src = src;
    }

    syncPreviewSoundUi() {
        const btn = this.el.previewSoundBtn;
        if (!btn) return;
        const isMuted = !!this.state.previewMuted;
        btn.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
        btn.setAttribute('aria-label', isMuted ? 'Unmute preview' : 'Mute preview');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-volume-xmark', isMuted);
            icon.classList.toggle('fa-volume-high', !isMuted);
        }
    }

    closePreviewModal() {
        const m = this.el.previewModal;
        if (!m || m.hidden) return;
        m.classList.remove('PL3-preview--open');
        setTimeout(() => {
            m.hidden = true;
            m.setAttribute('aria-hidden', 'true');
            if (this.el.previewIframe) this.el.previewIframe.src = '';
            this.state.previewVideoId = '';
        }, 240);
    }

    // === URL deep link ===
    getGroupKeyFromUrl() {
        try {
            const u = new URL(window.location.href);
            const key = (u.searchParams.get('pl3') || '').trim();
            if (!key) return null;
            const g = this.model.getGroup(key);
            if (!g || g.isComingSoon) return null;
            return String(g.key);
        } catch {
            return null;
        }
    }

    getSingleIdFromUrl(groupKey) {
        try {
            const g = this.model.getGroup(groupKey);
            if (!g) return null;
            const u = new URL(window.location.href);
            const singleId = (u.searchParams.get('pl3s') || '').trim();
            if (!singleId) return null;
            return g.singlesById?.[singleId] ? singleId : null;
        } catch {
            return null;
        }
    }

    setGroupKeyInUrl(groupKeyOrNull, singleIdOrNull = null) {
        try {
            const u = new URL(window.location.href);
            if (groupKeyOrNull) u.searchParams.set('pl3', String(groupKeyOrNull));
            else u.searchParams.delete('pl3');
            if (groupKeyOrNull && singleIdOrNull) u.searchParams.set('pl3s', String(singleIdOrNull));
            else u.searchParams.delete('pl3s');
            window.history.replaceState({}, '', u.toString());
        } catch {
            // ignore
        }
    }

    openFromUrlIfPresent() {
        const key = this.getGroupKeyFromUrl();
        if (!key) return;
        const singleId = this.getSingleIdFromUrl(key);
        this.openModal(key, { initialSingleId: singleId });
    }

    // === Button Expansion ===
    attachButtonEvents() {
        if (!this.el.btnRow) return;
        this.el.btnRow.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.PL3-heroBtn');
            if (!btn) return;
            const action = btn.getAttribute('data-pl3-action');
            const isCloseBtn = ev.target.closest('[data-pl3-close-btn]');

            if (action === 'shop' && !isCloseBtn) {
                window.location.href = 'https://shop.opahifi.com';
                return;
            }
            if (isCloseBtn) return this.collapseAllButtons();
            if (action === 'listen' || action === 'follow') {
                this.state.expandedBtn === btn ? this.collapseAllButtons() : this.expandButton(btn);
            }
        }, { passive: true });
    }

    expandButton(btn) {
        this.collapseAllButtons();
        btn.classList.add('PL3-heroBtn--expanded');
        const icons = btn.querySelector('.PL3-heroBtn-icons');
        if (icons) icons.hidden = false;
        this.el.heroBtns.forEach(b => b !== btn && b.classList.add('PL3-heroBtn--collapsed'));
        this.state.expandedBtn = btn;
    }

    collapseAllButtons() {
        this.el.heroBtns.forEach(b => {
            b.classList.remove('PL3-heroBtn--expanded', 'PL3-heroBtn--collapsed');
            const icons = b.querySelector('.PL3-heroBtn-icons');
            if (icons) icons.hidden = true;
        });
        this.state.expandedBtn = null;
    }

    isGroupModalBusy() {
        return !!(this.el.modal && !this.el.modal.hidden) || !!this.modalCloseTimer;
    }

    // === Gallery ===
    attachGalleryEvents() {
        this.section.addEventListener('click', (ev) => {
            const btn = ev.target.closest('[data-pl3-group]');
            if (!btn || !this.section.contains(btn)) return;
            const key = String(btn.getAttribute('data-pl3-group') || '').trim();
            if (!key) return;

            if (this.isGroupModalBusy()) {
                ev.preventDefault();
                ev.stopImmediatePropagation();
                this.closeModal();
                return;
            }

            ev.preventDefault();
            this.openModal(key);
        }, { passive: false });
    }

    // === Modal ===
    attachModalEvents() {
        if (!this.el.modal) return;
        this.el.modal.addEventListener('click', (ev) => {
            const closeBtn = ev.target.closest('[data-pl3-close-group]');
            if (closeBtn && this.el.modal.contains(closeBtn)) {
                ev.preventDefault();
                this.closeModal();
                return;
            }

            const backBtn = ev.target.closest('[data-pl3-back-group]');
            if (backBtn && this.el.modal.contains(backBtn)) {
                ev.preventDefault();
                this.exitSingleView({ animate: true, syncUrl: true });
                return;
            }

            if (ev.target.closest('.ohf-mix-link')) return;
            const mixRow = ev.target.closest('[data-pl3-mix-row]');
            if (!mixRow || !this.el.modal.contains(mixRow) || mixRow.hidden) return;
            if (mixRow.classList.contains('is-active') && this.el.modal.classList.contains('PL3-modal--single-view')) {
                ev.preventDefault();
                this.exitSingleView({ animate: true, syncUrl: true });
                return;
            }
            ev.preventDefault();
            this.openSingleViewFromRow(mixRow, { animate: true, syncUrl: true });
        }, { passive: false });

        this.el.modal.addEventListener('keydown', (ev) => {
            if (ev.key !== 'Enter' && ev.key !== ' ') return;
            if (ev.target.closest('.ohf-mix-link')) return;
            const mixRow = ev.target.closest('[data-pl3-mix-row]');
            if (!mixRow || mixRow.hidden) return;
            if (mixRow.classList.contains('is-active') && this.el.modal.classList.contains('PL3-modal--single-view')) {
                ev.preventDefault();
                this.exitSingleView({ animate: true, syncUrl: true });
                return;
            }
            ev.preventDefault();
            this.openSingleViewFromRow(mixRow, { animate: true, syncUrl: true });
        }, { passive: false });

        document.addEventListener('pointerdown', (ev) => {
            if (!this.el.modal || this.el.modal.hidden) return;

            if (typeof ev.button === 'number' && ev.button !== 0) return;
            const target = ev.target;
            if (!(target instanceof Element)) return;
            if (target.closest('#PL3-group-modal .PL3-modalPanel')) return;
            this.closeModal();
        }, { passive: true });

        window.addEventListener('keydown', (ev) => {
            if (!this.el.modal || this.el.modal.hidden || ev.key !== 'Escape') return;
            this.closeModal();
        }, { passive: true });
    }


    // === Share ===
    attachShareEvents() {
        if (this.el.modal) {
            this.el.modal.addEventListener('click', (ev) => {
                const btn = ev.target.closest('[data-pl3-share-group]');
                if (!btn || !this.el.modal.contains(btn)) return;
                ev.preventDefault();
                this.shareCurrentGroup();
            }, { passive: false });
        }

        if (this.el.shareModal) {
            this.el.shareModal.addEventListener('click', (ev) => {
                if (ev.target.closest('[data-pl3-share-close]')) {
                    ev.preventDefault();
                    this.closeShareSheet();
                    return;
                }
                if (ev.target.closest('[data-pl3-share-copy]')) {
                    ev.preventDefault();
                    this.copyShareUrl();
                    return;
                }
            }, { passive: false });
        }
    }

    openShareSheet(url) {
        const m = this.el.shareModal;
        if (!m) return;
        this.state.shareUrl = url || '';
        if (this.el.shareInput) this.el.shareInput.value = this.state.shareUrl;
        m.hidden = false;
        m.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                m.classList.add('PL3-share--open');
            });
        });
    }

    closeShareSheet() {
        const m = this.el.shareModal;
        if (!m || m.hidden) return;
        m.classList.remove('PL3-share--open');
        setTimeout(() => {
            m.hidden = true;
            m.setAttribute('aria-hidden', 'true');
        }, 240);
    }

    async copyShareUrl() {
        const url = this.state.shareUrl || (this.el.shareInput ? this.el.shareInput.value : '') || '';
        if (!url) return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                return;
            }
        } catch {
            // fall back below
        }

        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch { /* ignore */ }
        ta.remove();
    }

    async shareCurrentGroup() {
        const key = this.state.openGroupKey;
        if (!key) return;
        const g = this.model.getGroup(key);
        if (!g) return;
        const singleId = this.state.openSingleId;
        const single = singleId ? this.model.getSingle(key, singleId) : null;
        const versionName = single?.version || 'Main Version';
        const url = this.model.buildGroupUrl(key, single?.id || null);
        const shareTitle = single ? `${single.title || g.title || 'OpaHiFi'} - ${versionName}` : (g.title || 'OpaHiFi');
        const shareText = single
            ? `${single.title || g.title || 'OpaHiFi'} (${versionName})`
            : (g.title || 'OpaHiFi group');

        try {
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle || 'OpaHiFi',
                    text: shareText,
                    url
                });
                return;
            }
        } catch {
            // user cancelled or unsupported; fall back
        }

        this.openShareSheet(url);
    }

    openModal(groupKey, opts = {}) {
        const { modal, heroCrop, heroImg } = this.el;
        if (!modal || !heroCrop || !heroImg) return;
        if (this.modalCloseTimer) {
            clearTimeout(this.modalCloseTimer);
            this.modalCloseTimer = null;
        }
        const group = this.model.getGroup(groupKey);
        if (!group || group.isComingSoon) return;
        const initialSingleId = opts?.initialSingleId || null;

        this.resetSingleViewState({ syncUrl: false, resetLyrics: true });

        this.setTitle(group.titleLines || [group.title]);
        this.renderMixes(group);
        this.setSongTrackPosition(0);
        modal.classList.remove('PL3-modal--single-view');

        modal.classList.remove('PL3-modal--opening');
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        this.updateHeroImage(group);

        this.state.openGroupKey = String(group.key);
        this.state.openSingleId = null;
        this.setGroupKeyInUrl(this.state.openGroupKey, null);
        this.setActiveGalleryButton(this.findGalleryButtonByGroup(group.key));
        this.setGalleryInteractionLocked(true);
        this.groupOpenScrollY = window.scrollY || window.pageYOffset || 0;
        this.lockScroll();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('PL3-modal--opening');
                this.scrollGroupCardIntoView();
                this.scheduleGroupTopSync();

                if (initialSingleId) {
                    const targetRow = this.el.mixRows
                        .find((entry) => entry.row.getAttribute('data-pl3-single-id') === String(initialSingleId) && !entry.row.hidden)
                        ?.row || null;
                    if (targetRow) this.openSingleViewFromRow(targetRow, { animate: false, syncUrl: true });
                }
            });
        });
    }

    closeModal() {
        const { modal, heroCrop, heroImg, coverOverlay } = this.el;
        if (!modal || modal.hidden || this.modalCloseTimer) return;
        this.cancelGroupTopSync();
        this.resetSingleViewState({ syncUrl: false, resetLyrics: true });
        this.cancelGroupScrollAnimation();
        const returnTop = Math.max(0, Math.round(this.groupOpenScrollY || 0));
        const didSmoothScrollBack = this.animateWindowScrollTo(returnTop, 340);
        modal.classList.remove('PL3-modal--opening');
        modal.classList.remove('PL3-modal--single-view');
        const closeDelay = didSmoothScrollBack ? 340 : 300;
        this.modalCloseTimer = window.setTimeout(() => {
            this.modalCloseTimer = null;
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');

            this.state.openGroupKey = null;
            this.state.openSingleId = null;
            this.setGroupKeyInUrl(null, null);
            this.setActiveGalleryButton(null);
            this.setGalleryInteractionLocked(false);
            this.unlockScroll();
            this.groupOpenScrollY = 0;

            if (heroCrop) {
                heroCrop.replaceChildren();
                if (heroImg) {
                    heroImg.hidden = true;
                    heroImg.src = '';
                    heroImg.alt = '';
                    heroCrop.appendChild(heroImg);
                }
                heroCrop.style.removeProperty('--pl3-hero-bg');
                if (coverOverlay) heroCrop.appendChild(coverOverlay);
            }
        }, closeDelay);
    }

    isReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    getFlipStateForElement(el) {
        if (!el || !PL3GSAP || !PL3Flip || this.isReducedMotion()) return null;
        try {
            return PL3Flip.getState(el);
        } catch {
            return null;
        }
    }

    setSongTrackPosition(xPercent) {
        const track = this.el.songCardTrack;
        if (!track) return;
        const safeX = Number.isFinite(xPercent) ? xPercent : 0;
        if (PL3GSAP) {
            PL3GSAP.set(track, { xPercent: safeX });
            return;
        }
        track.style.transform = `translate3d(${safeX}%, 0, 0)`;
    }

    animateSongTrackTo(xPercent, durationMs = 420) {
        const track = this.el.songCardTrack;
        if (!track) return;
        if (this.cardSlideTween) {
            this.cardSlideTween.kill();
            this.cardSlideTween = null;
        }

        const safeX = Number.isFinite(xPercent) ? xPercent : 0;
        if (!PL3GSAP || this.isReducedMotion() || durationMs <= 0) {
            this.setSongTrackPosition(safeX);
            return;
        }

        this.cardSlideTween = PL3GSAP.to(track, {
            xPercent: safeX,
            duration: durationMs / 1000,
            ease: 'power2.inOut',
            onComplete: () => { this.cardSlideTween = null; }
        });
    }

    applyFlipFromState(flipState, durationMs = 440) {
        if (!flipState || !PL3GSAP || !PL3Flip || this.isReducedMotion() || durationMs <= 0) return;
        PL3Flip.from(flipState, {
            duration: durationMs / 1000,
            ease: 'power2.inOut',
            nested: true,
            prune: true
        });
    }

    setLyricsText(text) {
        if (!this.el.lyricsText) return;
        this.el.lyricsText.textContent = String(text || '');
    }

    async loadLyricsText(single) {
        const path = String(single?.lyricsPath || '').trim();
        if (!path) return 'Lyrics coming soon.';
        if (this.lyricsCache.has(path)) return this.lyricsCache.get(path);

        try {
            const res = await fetch(path, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Lyrics not found: ${path}`);
            const txt = (await res.text()).trim() || 'Lyrics coming soon.';
            this.lyricsCache.set(path, txt);
            return txt;
        } catch {
            return 'Lyrics coming soon.';
        }
    }

    ensureMixRowPlaceholder(row) {
        if (!row) return;
        if (this.currentMixPlaceholder && this.currentMixPlaceholder.parentNode) {
            this.currentMixPlaceholder.remove();
        }
        const placeholder = document.createElement('div');
        placeholder.className = 'PL3-mix-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        const h = Math.max(1, Math.round(row.getBoundingClientRect().height || row.offsetHeight || 81));
        placeholder.style.setProperty('--pl3-mix-placeholder-h', `${h}px`);
        row.insertAdjacentElement('afterend', placeholder);
        this.currentMixPlaceholder = placeholder;
        this.currentMixRow = row;
    }

    restoreCurrentMixRow({ animate = false } = {}) {
        const row = this.currentMixRow;
        if (!row) return;
        const flipState = this.getFlipStateForElement(row);
        const placeholder = this.currentMixPlaceholder;
        if (placeholder && placeholder.parentNode) {
            placeholder.replaceWith(row);
        } else if (this.el.mixesEl) {
            this.el.mixesEl.appendChild(row);
        }
        row.classList.remove('is-active');
        this.currentMixRow = null;
        this.currentMixPlaceholder = null;
        if (animate) this.applyFlipFromState(flipState, 420);
    }

    resetSingleViewState({ syncUrl = false, resetLyrics = false } = {}) {
        this.state.singleViewLocked = false;
        this.restoreCurrentMixRow({ animate: false });
        if (this.cardSlideTween) {
            this.cardSlideTween.kill();
            this.cardSlideTween = null;
        }
        if (this.el.songHeaderTarget) this.el.songHeaderTarget.replaceChildren();
        if (resetLyrics) this.setLyricsText('');
        if (this.el.modal) this.el.modal.classList.remove('PL3-modal--single-view');
        this.setSongTrackPosition(0);
        this.state.openSingleId = null;
        if (syncUrl && this.state.openGroupKey) {
            this.setGroupKeyInUrl(this.state.openGroupKey, null);
        }
    }

    async openSingleViewFromRow(rowEl, { animate = true, syncUrl = true } = {}) {
        if (!rowEl || rowEl.hidden || this.state.singleViewLocked) return;
        const groupKey = this.state.openGroupKey;
        if (!groupKey) return;

        const singleId = String(rowEl.getAttribute('data-pl3-single-id') || '').trim();
        if (!singleId) return;
        const group = this.model.getGroup(groupKey);
        const single = this.model.getSingle(groupKey, singleId);
        if (!group || !single) return;

        if (this.state.openSingleId && this.state.openSingleId !== singleId) {
            this.resetSingleViewState({ syncUrl: false, resetLyrics: false });
        }
        if (this.state.openSingleId === singleId && this.el.modal?.classList.contains('PL3-modal--single-view')) return;

        this.state.singleViewLocked = true;
        const flipState = this.getFlipStateForElement(rowEl);
        this.ensureMixRowPlaceholder(rowEl);
        if (this.el.songHeaderTarget) this.el.songHeaderTarget.replaceChildren(rowEl);

        rowEl.classList.add('is-active');
        if (this.el.modal) this.el.modal.classList.add('PL3-modal--single-view');
        this.state.openSingleId = singleId;
        if (syncUrl) this.setGroupKeyInUrl(groupKey, singleId);

        this.setLyricsText('Loading lyrics...');
        this.animateSongTrackTo(-100, animate ? 440 : 0);
        this.applyFlipFromState(flipState, animate ? 460 : 0);
        this.state.singleViewLocked = false;

        const lyrics = await this.loadLyricsText(single);
        if (this.state.openSingleId === singleId) {
            this.setLyricsText(lyrics);
        }
    }

    exitSingleView({ animate = true, syncUrl = true } = {}) {
        if (!this.state.openSingleId || this.state.singleViewLocked) return;
        this.state.singleViewLocked = true;
        this.restoreCurrentMixRow({ animate });
        if (this.el.songHeaderTarget) this.el.songHeaderTarget.replaceChildren();
        this.setLyricsText('');
        if (this.el.modal) this.el.modal.classList.remove('PL3-modal--single-view');
        this.animateSongTrackTo(0, animate ? 420 : 0);
        this.state.openSingleId = null;
        if (syncUrl && this.state.openGroupKey) {
            this.setGroupKeyInUrl(this.state.openGroupKey, null);
        }
        this.state.singleViewLocked = false;
    }

    cancelGroupScrollAnimation() {
        if (!this.groupScrollRaf) return;
        window.cancelAnimationFrame(this.groupScrollRaf);
        this.groupScrollRaf = null;
    }

    cancelGroupTopSync() {
        if (!this.groupTopSyncTimeout) return;
        window.clearTimeout(this.groupTopSyncTimeout);
        this.groupTopSyncTimeout = null;
    }

    scheduleGroupTopSync(delayMs = 420) {
        this.cancelGroupTopSync();
        this.groupTopSyncTimeout = window.setTimeout(() => {
            this.groupTopSyncTimeout = null;
            if (!this.el.modal || this.el.modal.hidden) return;
            this.scrollGroupCardIntoView();
        }, delayMs);
    }

    animateWindowScrollTo(targetTop, durationMs = 380) {
        const startTop = window.scrollY || window.pageYOffset || 0;
        if (Math.abs(startTop - targetTop) <= 1) return false;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            window.scrollTo({ top: targetTop, behavior: 'auto' });
            return false;
        }

        this.cancelGroupScrollAnimation();
        const startTime = performance.now();
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const progress = Math.min(1, (now - startTime) / durationMs);
            const eased = easeOutCubic(progress);
            const nextTop = Math.round(startTop + ((targetTop - startTop) * eased));
            window.scrollTo({ top: nextTop, behavior: 'auto' });
            if (progress < 1) {
                this.groupScrollRaf = window.requestAnimationFrame(tick);
                return;
            }
            this.groupScrollRaf = null;
        };

        this.groupScrollRaf = window.requestAnimationFrame(tick);
        return true;
    }

    updateHeroImage(group) {
        const { heroCrop, heroImg, coverOverlay } = this.el;
        heroCrop.replaceChildren();
        if (heroImg) heroCrop.appendChild(heroImg);
        if (coverOverlay) heroCrop.appendChild(coverOverlay);
        const cover = group.cover || '';
        if (heroImg) {
            heroImg.hidden = !cover;
            heroImg.src = cover;
            heroImg.alt = cover ? `${group.title || 'Group'} cover` : '';
        }

        if (heroCrop) {
            heroCrop.style.setProperty('--pl3-hero-bg', cover ? `url("${cover}")` : 'none');
        }
    }

    setActiveGalleryButton(btnOrNull) {
        const prev = this.state.activeGalleryBtn;
        if (prev) prev.classList.remove('PL3-galleryItemBtn--active');

        const nextBtn = btnOrNull && btnOrNull.classList
            ? btnOrNull
            : null;

        if (nextBtn) nextBtn.classList.add('PL3-galleryItemBtn--active');
        this.state.activeGalleryBtn = nextBtn;
        this.queueGalleryShiftSync();
    }

    setGalleryInteractionLocked(locked) {
        const isLocked = !!locked;
        if (this.el.gallery) this.el.gallery.classList.toggle('PL3-gallery--locked', isLocked);
        this.el.galleryBtns.forEach((btn) => {
            btn.disabled = isLocked;
            if (isLocked) btn.setAttribute('aria-disabled', 'true');
            else btn.removeAttribute('aria-disabled');
        });
    }

    queueGalleryShiftSync() {
        if (this.galleryShiftRaf) cancelAnimationFrame(this.galleryShiftRaf);
        this.galleryShiftRaf = requestAnimationFrame(() => {
            this.galleryShiftRaf = null;
            this.syncActiveGalleryLayout();
        });
    }

    isCompactGalleryMode() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    syncActiveGalleryLayout() {
        const gallery = this.el.gallery;
        if (!gallery) return;

        gallery.style.setProperty('--pl3-gallery-shift', '0px');
        if (this.isCompactGalleryMode()) return;
        const activeBtn = this.state.activeGalleryBtn;
        if (!activeBtn) return;

        const galleryRect = gallery.getBoundingClientRect();
        const activeRect = activeBtn.getBoundingClientRect();
        if (!galleryRect.width || !activeRect.width) return;

        const galleryCenterX = galleryRect.left + (galleryRect.width / 2);
        const activeCenterX = activeRect.left + (activeRect.width / 2);
        const shiftX = Math.round(galleryCenterX - activeCenterX);
        gallery.style.setProperty('--pl3-gallery-shift', `${shiftX}px`);
    }

    findGalleryButtonByGroup(groupKey) {
        const safeKey = String(groupKey || '').trim();
        if (!safeKey) return null;
        return this.section.querySelector(`.PL3-galleryItemBtn[data-pl3-group="${safeKey}"]`);
    }

    getGalleryTopPosition() {
        const galleryPart = this.el.galleryPart;
        if (!galleryPart) return null;
        return Math.max(0, Math.round(window.scrollY + galleryPart.getBoundingClientRect().top));
    }

    scrollGroupCardIntoView(onlyIfBelow = false) {
        const top = this.getGalleryTopPosition();
        if (top === null) return false;
        const currentTop = window.scrollY || window.pageYOffset || 0;
        if (Math.abs(currentTop - top) <= 3) return false;
        if (onlyIfBelow && currentTop <= top + 4) return false;
        return this.animateWindowScrollTo(top);
    }


    setTitle(lines) {
        const { titleLine1, titleLine2 } = this.el;
        if (!titleLine1) return;
        const arr = Array.isArray(lines) ? lines.filter(Boolean).map(String) : [];
        titleLine1.textContent = arr[0] || '';
        if (titleLine2) {
            titleLine2.textContent = arr[1] || '';
            titleLine2.hidden = !arr[1];
        }
    }

    renderMixes(group) {
        this.el.mixRows.forEach(r => this.clearMixRow(r));
        if (!group) return this.showEmpty('Missing group.');
        const ids = Array.isArray(group.songIds) ? group.songIds : [];
        if (!ids.length) return this.showEmpty('Mixes list coming soon.');

        this.hideEmpty();
        const platforms = this.model.getPlatformOrder();
        const max = Math.min(this.el.mixRows.length, ids.length);
        for (let i = 0; i < max; i++) {
            const single = group.singlesById?.[ids[i]];
            single ? this.populateMixRow(this.el.mixRows[i], single, group, platforms) : this.clearMixRow(this.el.mixRows[i]);
        }
    }

    clearMixRow({ row, art, name, links }) {
        row.hidden = true;
        row.removeAttribute('data-pl3-single-id');
        row.setAttribute('tabindex', '-1');
        row.setAttribute('aria-label', '');
        row.classList.remove('is-active', 'is-collapsed', 'is-before', 'is-after');
        if (art) { art.hidden = true; art.src = ''; art.alt = ''; }
        if (name) name.textContent = '';
        links.forEach((a) => {
            a.hidden = true;
            a.removeAttribute('href');
            a.classList.remove('is-disabled');
            a.removeAttribute('aria-disabled');
            a.removeAttribute('tabindex');
        });
    }

    populateMixRow({ row, art, name, links }, single, group, platforms) {
        const mixName = single.version || 'Main Version';
        const artSrc = single.image || group.cover || '';
        const singleLinks = single.links || {};
        row.hidden = false;
        row.setAttribute('data-pl3-single-id', String(single.id || ''));
        row.setAttribute('tabindex', '0');
        row.setAttribute('aria-label', mixName);
        row.classList.remove('is-active', 'is-collapsed', 'is-before', 'is-after');
        if (art) { art.hidden = false; art.src = artSrc; art.alt = `${mixName} cover`; }
        if (name) name.textContent = mixName;
        platforms.forEach(p => {
            const link = links.find(a => a.getAttribute('data-pl3-platform') === p);
            if (!link) return;
            const url = singleLinks[p] || '';
            link.hidden = false;
            if (url) {
                link.href = url;
                link.classList.remove('is-disabled');
                link.removeAttribute('aria-disabled');
                link.removeAttribute('tabindex');
            } else {
                link.removeAttribute('href');
                link.classList.add('is-disabled');
                link.setAttribute('aria-disabled', 'true');
                link.setAttribute('tabindex', '-1');
            }
        });
    }






    showEmpty(msg) { if (this.el.emptyEl) { this.el.emptyEl.textContent = msg || ''; this.el.emptyEl.hidden = false; } }
    hideEmpty() { if (this.el.emptyEl) { this.el.emptyEl.textContent = ''; this.el.emptyEl.hidden = true; } }
    lockScroll() { this.scrollLock.lock(); }
    unlockScroll() { this.scrollLock.unlock(); }
}

window.initPL3 = function () { window.PL3Instance = new PL3Controller('p_listen3'); };

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initPL3);
} else {
    window.initPL3();
}
