export class PageUI {
    init() {
        this.setupHeroAnimation();
    }

    setupHeroAnimation() {
        const tl = gsap.timeline();

        tl.from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 })
            .from('.hero-title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
            .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
            .from('.hero .btn-primary', { y: 20, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4');
    }
}
