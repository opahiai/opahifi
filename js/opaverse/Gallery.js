export class Gallery {
    constructor(containerId, versesData, scrollManager) {
        this.container = document.getElementById(containerId);
        this.versesData = versesData;
        this.scrollManager = scrollManager;

        if (this.container) {
            this.versesData.forEach(verse => {
                this.createCard(verse);
            });
        }
    }

    createCard(verse) {
        const card = document.createElement('a');
        card.className = 'gallery-card';
        card.href = `#${verse.id}`;
        card.innerHTML = `
                <div class="card-img">
                    <div class="card-info">
                       <div class="card-info-title font-heavy">${verse.line1}<br>${verse.line2}</div>
                    </div>
                    <div class="img-crop-bottom"><img src="${verse.img}" alt=""></div>
                </div>`;

        this.container.appendChild(card);
    }
}
