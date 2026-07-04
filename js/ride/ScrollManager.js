export class ScrollManager {
    constructor() {
        this.lenis = null;
    }

    getLenis() {
        return this.lenis;
    }

    init() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        gsap.registerPlugin(ScrollTrigger);
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => this.lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor || e.defaultPrevented) return;
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            e.preventDefault();
            this.lenis.scrollTo(anchor.getAttribute('href'));
        });
    }
}
