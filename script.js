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

    buildGroupUrl(groupKey) {
        const safeKey = encodeURIComponent(String(groupKey || ''));
        try {
            return `${window.location.origin}/s/${safeKey}`;
        } catch (e) {
            return `/s/${safeKey}`;
        }
    }
}

class PL3StateModel {
    constructor() {
        this.expandedBtn = null;
        this.activeGalleryBtn = null;
        this.openGroupKey = null;
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
        this.groupOpenScrollY = 0;
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
        return null;
    }

    setGroupKeyInUrl(groupKeyOrNull) {
        try {
            const u = new URL(window.location.href);
            if (groupKeyOrNull) u.searchParams.set('pl3', String(groupKeyOrNull));
            else u.searchParams.delete('pl3');
            u.searchParams.delete('pl3s');
            window.history.replaceState({}, '', u.toString());
        } catch {
            // ignore
        }
    }

    openFromUrlIfPresent() {
        const key = this.getGroupKeyFromUrl();
        if (!key) return;
        this.openModal(key);
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

    // === Gallery ===
    attachGalleryEvents() {
        this.section.addEventListener('click', (ev) => {
            const btn = ev.target.closest('[data-pl3-group]');
            if (!btn || !this.section.contains(btn)) return;
            if (this.el.modal && !this.el.modal.hidden) return;
            const key = String(btn.getAttribute('data-pl3-group') || '').trim();
            if (!key) return;
            ev.preventDefault();

            if (this.el.modal && !this.el.modal.hidden && this.state.openGroupKey && this.state.openGroupKey !== key) {
                this.setActiveGalleryButton(null);
            }

            this.openModal(key);
        }, { passive: false });
    }

    // === Modal ===
    attachModalEvents() {
        if (!this.el.modal) return;
        this.el.modal.addEventListener('click', (ev) => {
            if (!ev.target.closest('[data-pl3-close-group]') || !this.el.modal.contains(ev.target)) return;
            ev.preventDefault();
            this.closeModal();
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
        const url = this.model.buildGroupUrl(key);
        const shareTitle = g.title || 'OpaHiFi';
        const shareText = g.title || 'OpaHiFi group';

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

    openModal(groupKey) {
        const { modal, heroCrop, heroImg } = this.el;
        if (!modal || !heroCrop || !heroImg) return;
        const group = this.model.getGroup(groupKey);
        if (!group || group.isComingSoon) return;

        this.setTitle(group.titleLines || [group.title]);
        this.renderMixes(group);

        modal.classList.remove('PL3-modal--opening');
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        this.updateHeroImage(group);

        this.state.openGroupKey = String(group.key);
        this.setGroupKeyInUrl(this.state.openGroupKey);
        this.setActiveGalleryButton(this.findGalleryButtonByGroup(group.key));
        this.setGalleryInteractionLocked(true);
        this.groupOpenScrollY = window.scrollY || window.pageYOffset || 0;
        this.lockScroll();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('PL3-modal--opening');
                this.scrollGroupCardIntoView();
            });
        });
    }

    closeModal() {
        const { modal, heroCrop, heroImg, coverOverlay } = this.el;
        if (!modal || modal.hidden) return;
        this.cancelGroupScrollAnimation();
        const returnTop = Math.max(0, Math.round(this.groupOpenScrollY || 0));
        const didSmoothScrollBack = this.animateWindowScrollTo(returnTop, 340);
        modal.classList.remove('PL3-modal--opening');
        const closeDelay = didSmoothScrollBack ? 340 : 300;
        setTimeout(() => {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');

            this.state.openGroupKey = null;
            this.setGroupKeyInUrl(null);
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

    cancelGroupScrollAnimation() {
        if (!this.groupScrollRaf) return;
        window.cancelAnimationFrame(this.groupScrollRaf);
        this.groupScrollRaf = null;
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

    syncActiveGalleryLayout() {
        const gallery = this.el.gallery;
        if (!gallery) return;

        gallery.style.setProperty('--pl3-gallery-shift', '0px');
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
        links.forEach(a => { a.hidden = true; a.href = '#'; });
    }

    populateMixRow({ row, art, name, links }, single, group, platforms) {
        const mixName = single.version || 'Main Version';
        const artSrc = single.image || group.cover || '';
        const singleLinks = single.links || {};
        row.hidden = false;
        row.setAttribute('data-pl3-single-id', String(single.id || ''));
        row.setAttribute('tabindex', '-1');
        row.setAttribute('aria-label', mixName);
        row.classList.remove('is-active', 'is-collapsed', 'is-before', 'is-after');
        if (art) { art.hidden = false; art.src = artSrc; art.alt = `${mixName} cover`; }
        if (name) name.textContent = mixName;
        platforms.forEach(p => {
            const link = links.find(a => a.getAttribute('data-pl3-platform') === p);
            if (!link) return;
            const url = singleLinks[p] || '';
            link.hidden = !url;
            link.href = url || '#';
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
