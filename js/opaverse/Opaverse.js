export class Opaverse {
    constructor(data, element) {
        this.data = data;
        this.element = element;
        this.content = this.element.querySelector('.verse-content');
        this.bgWrapper = this.element.querySelector('.verse-bg-wrapper');
        this.init();
    }

    init() {
        this.setStyles();
        this.setTitle();
        this.setThemeClasses();
        this.setupAnimation();
        this.setupBackground();
    }

    setStyles() {
        this.element.style.setProperty('--verse-main', this.data.color);
        this.element.style.setProperty('--verse-light', this.data.lightColor);
    }

    setThemeClasses() {
        if (this.data.theme?.classes) {
            this.data.theme.classes.forEach(cls => this.element.classList.add(cls));
        }
    }

    setTitle() {
        const titleEl = this.element.querySelector('.verse-title');
        const subtitleEl = this.element.querySelector('.verse-subtitle');
        const descEl = this.element.querySelector('.verse-desc');

        if (titleEl) titleEl.innerHTML = `${this.data.line1}<br>${this.data.line2}`;
        if (subtitleEl && this.data.subtitle) subtitleEl.textContent = this.data.subtitle;
        if (descEl && this.data.description) descEl.textContent = this.data.description;
    }

    setupAnimation() {
        if (!this.content) return;

        gsap.fromTo(this.content,
            { opacity: 0, y: 100, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: this.element,
                    start: 'top 75%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    }

    setupBackground() {
        if (!this.bgWrapper || !this.data.theme?.background) return;

        switch (this.data.theme.background.type) {
            case 'repeating-text':
                this.bgWrapper.innerText = this.data.theme.background.text.repeat(300);
                break;
            case 'parallax-text':
                gsap.to(this.bgWrapper, {
                    yPercent: 30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: this.element,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
                break;
            case 'conic-gradient-spin':
                break;
        }
    }
}
