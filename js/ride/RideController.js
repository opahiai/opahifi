import { DataManager } from './DataManager.js';
import { Gallery } from './Gallery.js';
import { Opaverse } from './Opaverse.js';
import { PageUI } from './PageUI.js';
import { ScrollManager } from './ScrollManager.js';

export class RideController {
    constructor(database) {
        this.dataManager = new DataManager(database);
        this.scrollManager = new ScrollManager();
        this.pageUI = new PageUI();
        this.versesData = this.dataManager.getData();
        this.opaverses = [];
        this.init();
    }

    init() {
        this.scrollManager.init();
        this.pageUI.init();
        this.setupOpaverses();
        this.setupUrlTracking();
        new Gallery('gallery-grid', this.versesData, this.scrollManager);
        this.scrollToInitialHash();
    }

    setupOpaverses() {
        const rideContainer = document.getElementById('ride');
        if (!rideContainer) return;

        this.versesData.forEach(viewModel => {
            const element = this.createVerseElement(viewModel);
            rideContainer.appendChild(element);
            this.opaverses.push(new Opaverse(viewModel, element));
        });
    }

    setupUrlTracking() {
        const trackableSections = this.opaverses.map(o => o.element);
        document.querySelectorAll('#hero, #gallery, #about').forEach(el => trackableSections.push(el));

        trackableSections.forEach(section => {
            const updateUrl = () => {
                const nextHash = `#${section.id}`;
                if (window.location.hash !== nextHash) {
                    history.replaceState(null, '', nextHash);
                }
            };

            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: updateUrl,
                onEnterBack: updateUrl
            });
        });
    }

    scrollToInitialHash() {
        if (!window.location.hash) return;

        const target = document.querySelector(window.location.hash);
        const lenis = this.scrollManager.getLenis();
        if (!target || !lenis) return;

        requestAnimationFrame(() => {
            lenis.scrollTo(window.location.hash, { immediate: true });
        });
    }

    createVerseElement(viewModel) {
        const section = document.createElement('section');
        section.className = 'opaverse';
        section.id = viewModel.id;
        section.innerHTML = `
            <div class="verse-bg-wrapper">${viewModel.theme.specialContent || ''}</div>
            <div class="verse-content glass-panel">
                <div class="verse-subtitle font-display"></div>
                <h2 class="verse-title font-heavy"></h2>
                <p class="verse-desc font-sans"></p>
            </div>`;

        return section;
    }
}
