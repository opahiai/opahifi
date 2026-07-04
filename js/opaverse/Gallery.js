export class Gallery {
    constructor(containerId, opaverseViewModels, scrollManager) {
        this.container = document.getElementById(containerId);
        this.opaverseViewModels = opaverseViewModels;
        this.scrollManager = scrollManager;

        if (this.container) {
            this.opaverseViewModels.forEach(opaverse => {
                this.createCard(opaverse);
            });
        }
    }

    createCard(opaverse) {
        const card = document.createElement('a');
        card.className = 'gallery-card';
        card.href = `#${opaverse.id}`;
        card.innerHTML = `
                <div class="card-img">
                    <div class="card-info">
                       <div class="card-info-title font-heavy">${opaverse.line1}<br>${opaverse.line2}</div>
                    </div>
                    <div class="img-crop-bottom"><img src="${opaverse.img}" alt=""></div>
                </div>`;

        this.container.appendChild(card);
    }
}
