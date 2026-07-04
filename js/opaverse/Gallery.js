export class Gallery {
    constructor(containerId, opaverseViewModels, scrollManager) {
        this.container = document.getElementById(containerId);
        this.opaverseViewModels = opaverseViewModels;
        this.scrollManager = scrollManager;
        this.activeId = null;
        this.isAnimating = false;

        if (!this.container) return;
        if (window.Flip) gsap.registerPlugin(Flip);

        this.section = this.container.closest('.gallery-section');
        this.renderShell();
        this.renderCards();
    }

    renderShell() {
        this.detail = document.createElement('div');
        this.detail.className = 'gallery-detail';
        this.detail.innerHTML = `
            <div class="gallery-detail-bg"></div>
            <div class="gallery-detail-panel">
                <button class="gallery-detail-close font-display" type="button" aria-label="Close selected track">CLOSE</button>
                <div class="gallery-detail-main">
                    <div class="gallery-hero-slot" id="gallery-hero-slot"></div>
                    <div class="gallery-detail-copy">
                        <div class="gallery-detail-kicker font-display">NOW SELECTED</div>
                        <h3 class="gallery-detail-title font-heavy"></h3>
                        <p class="gallery-detail-desc"></p>
                    </div>
                </div>
            </div>
            <div class="gallery-rail" aria-label="Other tracks">
                <div class="gallery-rail-bg"></div>
                <div class="gallery-rail-track"></div>
            </div>`;

        this.section.appendChild(this.detail);
        this.heroSlot = this.detail.querySelector('.gallery-hero-slot');
        this.railTrack = this.detail.querySelector('.gallery-rail-track');
        this.detailTitle = this.detail.querySelector('.gallery-detail-title');
        this.detailDesc = this.detail.querySelector('.gallery-detail-desc');
        this.detail.querySelector('.gallery-detail-close').addEventListener('click', () => this.close());
    }

    renderCards() {
        this.opaverseViewModels.forEach(opaverse => {
            const gridSlot = document.createElement('div');
            gridSlot.className = 'gallery-slot';
            gridSlot.dataset.opaverseId = opaverse.id;
            this.container.appendChild(gridSlot);

            const railSlot = document.createElement('div');
            railSlot.className = 'gallery-rail-slot';
            railSlot.dataset.opaverseId = opaverse.id;
            this.railTrack.appendChild(railSlot);

            const card = this.createCard(opaverse);
            gridSlot.appendChild(card);
        });
    }

    createCard(opaverse) {
        const card = document.createElement('a');
        card.className = 'gallery-card';
        card.href = `#${opaverse.id}`;
        card.dataset.opaverseId = opaverse.id;
        card.innerHTML = `
            <div class="card-img">
                <div class="card-info">
                   <div class="card-info-title font-heavy">${opaverse.line1}<br>${opaverse.line2}</div>
                </div>
                <div class="img-crop-bottom"><img src="${opaverse.img}" alt=""></div>
            </div>`;

        card.addEventListener('click', (e) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            e.preventDefault();
            this.select(opaverse.id);
        });

        return card;
    }

    select(id) {
        if (this.isAnimating) return;

        if (!this.activeId) {
            this.open(id);
            return;
        }

        if (this.activeId !== id) {
            this.change(id);
        }
    }

    open(id) {
        this.isAnimating = true;
        this.activeId = id;
        this.updateDetail(id);

        const state = this.getFlipState();
        this.section.classList.add('gallery-section--expanded');
        document.body.classList.add('gallery-open');
        this.moveCardsToDetail(id);
        this.playFlip(state, () => {
            this.isAnimating = false;
            this.railTrack.scrollLeft = 0;
        });
    }

    change(id) {
        this.isAnimating = true;
        const previousId = this.activeId;
        this.activeId = id;
        this.updateDetail(id);

        const state = this.getFlipState();
        this.getRailSlot(previousId).appendChild(this.getCard(previousId));
        this.heroSlot.appendChild(this.getCard(id));
        this.updateRailSlotVisibility(id);
        this.playFlip(state, () => {
            this.isAnimating = false;
            this.getRailSlot(previousId).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    }

    close() {
        if (!this.activeId || this.isAnimating) return;

        this.isAnimating = true;
        const state = this.getFlipState();

        this.opaverseViewModels.forEach(opaverse => {
            this.getGridSlot(opaverse.id).appendChild(this.getCard(opaverse.id));
        });

        this.section.classList.remove('gallery-section--expanded');
        document.body.classList.remove('gallery-open');
        this.playFlip(state, () => {
            this.activeId = null;
            this.isAnimating = false;
            this.updateRailSlotVisibility(null);
        });
    }

    moveCardsToDetail(activeId) {
        this.opaverseViewModels.forEach(opaverse => {
            const card = this.getCard(opaverse.id);

            if (opaverse.id === activeId) {
                this.heroSlot.appendChild(card);
            } else {
                this.getRailSlot(opaverse.id).appendChild(card);
            }
        });

        this.updateRailSlotVisibility(activeId);
    }

    updateDetail(id) {
        const opaverse = this.opaverseViewModels.find(item => item.id === id);
        if (!opaverse) return;

        this.detailTitle.innerHTML = `${opaverse.line1}<br>${opaverse.line2}`;
        this.detailDesc.textContent = opaverse.description;
    }

    updateRailSlotVisibility(activeId) {
        this.opaverseViewModels.forEach(opaverse => {
            this.getRailSlot(opaverse.id).hidden = opaverse.id === activeId;
        });
    }

    getFlipState() {
        return window.Flip ? Flip.getState('.gallery-card') : null;
    }

    playFlip(state, onComplete) {
        if (!window.Flip || !state) {
            onComplete?.();
            return;
        }

        Flip.from(state, {
            duration: 0.65,
            ease: 'power3.inOut',
            absolute: true,
            nested: true,
            stagger: 0.025,
            onComplete
        });
    }

    getCard(id) {
        return this.section.querySelector(`.gallery-card[data-opaverse-id="${id}"]`);
    }

    getGridSlot(id) {
        return this.container.querySelector(`.gallery-slot[data-opaverse-id="${id}"]`);
    }

    getRailSlot(id) {
        return this.railTrack.querySelector(`.gallery-rail-slot[data-opaverse-id="${id}"]`);
    }
}
