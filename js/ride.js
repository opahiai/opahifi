document.addEventListener("DOMContentLoaded", () => {
    /**
     * Manages a single "Opaverse" section in the ride.
     * Handles its own styling, content, and animations.
     */
    class Opaverse {
        constructor(data, element) {
            this.data = data;
            this.element = element;
            this.content = this.element.querySelector('.verse-content');
            this.bgWrapper = this.element.querySelector('.verse-bg-wrapper');
            this.init();
        }

        /**
         * Initializes the verse by setting styles, content, and animations.
         */
        init() {
            this.setStyles();
            this.setTitle();
            this.setThemeClasses();
            this.setupAnimation();
            this.setupBackground();
        }

        /**
         * Applies the verse-specific colors from the data.
         */
        setStyles() {
            this.element.style.setProperty('--verse-main', this.data.color);
            this.element.style.setProperty('--verse-light', this.data.lightColor);
        }

        /**
         * Applies theme-based classes to the verse element for styling.
         */
        setThemeClasses() {
            if (this.data.theme?.classes) {
                this.data.theme.classes.forEach(cls => this.element.classList.add(cls));
            }
        }

        /**
         * Populates the content of the verse.
         */
        setTitle() {
            const titleEl = this.element.querySelector('.verse-title');
            const subtitleEl = this.element.querySelector('.verse-subtitle');
            const descEl = this.element.querySelector('.verse-desc');
            if (titleEl) {
                titleEl.innerHTML = `${this.data.line1}<br>${this.data.line2}`;
            }
            if (subtitleEl && this.data.subtitle) {
                subtitleEl.textContent = this.data.subtitle;
            }
            if (descEl && this.data.description) {
                descEl.textContent = this.data.description;
            }
        }

        /**
         * Sets up the GSAP ScrollTrigger animation for the verse content.
         */
        setupAnimation() {
            if (this.content) {
                gsap.fromTo(this.content,
                    { opacity: 0, y: 100, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out",
                        scrollTrigger: {
                            trigger: this.element,
                            start: "top 75%",
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            }
        }

        /**
         * Sets up special background effects for specific verses.
         */
        setupBackground() {
            if (!this.bgWrapper || !this.data.theme?.background) return;

            // The ViewModel (this.data) now dictates the background type.
            switch (this.data.theme.background.type) {
                case 'repeating-text':
                    this.bgWrapper.innerText = this.data.theme.background.text.repeat(300);
                    break;
                case 'parallax-text':
                    gsap.to(this.bgWrapper, {
                        yPercent: 30,
                        ease: "none",
                        scrollTrigger: {
                            trigger: this.element,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    });
                    break;
                case 'conic-gradient-spin':
                    // The animation is handled purely by CSS via the .layout--glittaa class.
                    break;
            }
        }
    }

    /**
     * A true model for a single verse. It contains all data and derived
     * properties required for rendering, including UI-specific logic.
     */
    class VerseViewModel {
        constructor(verseData, index, totalVerses, themes) {
            const num = String(index + 1).padStart(2, '0');
            const hueStep = totalVerses > 1 ? (360 - 210) / (totalVerses - 1) : 0;
            const currentHue = 360 - (index * hueStep);

            // --- Base Properties ---
            this.themeKey = verseData.themeKey || 'default-verse';
            this.key = verseData.key;
            this.line1 = verseData.titleLines[0] || '';
            this.line2 = verseData.titleLines[1] || '';
            this.img = verseData.cover;
            this.subtitle = `${num} // ${verseData.ride?.subtitle || ''}`;
            this.description = verseData.ride?.description || '';

            // --- Derived UI Properties ---
            this.color = `hsl(${currentHue}, 100%, 50%)`;
            this.lightColor = `hsl(${currentHue}, 100%, 75%)`;
            this.id = verseData.key;
            this.theme = { ...themes['default-verse'], ...themes[this.themeKey] };
        }
    }

    /**
     * Manages all data for the ride.
     */
    class DataManager {
        constructor(database) {
            const rideOrder = database?.rideOrder || [];
            const allGroups = database?.groups || [];
            const groupsByKey = Object.fromEntries(allGroups.map(g => [g.key, g]));
            const themes = database?.themes || {};
            const rideVerses = rideOrder.map(key => groupsByKey[key]).filter(Boolean);

            // The DataManager's sole responsibility is to create the ViewModels.
            this.processedVerses = rideVerses.map((verseData, index) =>
                new VerseViewModel(verseData, index, rideVerses.length, themes)
            );
        }

        getData() {
            return this.processedVerses;
        }
    }

    /**
     * Manages smooth scrolling using Lenis.
     */
    class ScrollManager {
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

            const raf = (time) => {
                this.lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            gsap.registerPlugin(ScrollTrigger);
            this.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => this.lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.lenis.scrollTo(anchor.getAttribute('href'));
                });
            });
        }
    }

    /**
     * Manages the gallery section.
     */
    class Gallery {
        constructor(containerId, versesData, scrollManager) {
            this.container = document.getElementById(containerId);
            this.versesData = versesData;
            this.scrollManager = scrollManager;

            if (this.container) {
                this.versesData.forEach((verse, index) => {
                    this.createCard(verse, index);
                });
            }
        }

        createCard(verse, index) {
            const lenis = this.scrollManager.getLenis();
            if (!lenis) return;

            const num = String(index + 1).padStart(2, '0');
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                    <div class="card-img">
                        <div class="card-info">
                           <div class="card-info-title font-heavy">${verse.line1}<br>${verse.line2}</div>
                        </div>
                        <div class="img-crop-bottom"><img src="${verse.img}" alt=""></div>
                    </div>`;
            card.addEventListener('click', () => lenis.scrollTo(`#${verse.id}`, { offset: 0 }));
            this.container.appendChild(card);
        }
    }

    /**
     * Manages general page UI elements like menus and hero animations.
     */
    class PageUI {
        init() {
            this.setupMobileMenu();
            this.setupHeroAnimation();
        }

        setupMobileMenu() {
            const menuBtn = document.getElementById('mobile-menu-btn');
            const navMenu = document.getElementById('nav-menu');
            if (menuBtn && navMenu) {
                menuBtn.addEventListener('click', () => {
                    navMenu.classList.toggle('open');
                    menuBtn.innerText = navMenu.classList.contains('open') ? 'CLOSE' : 'MENU';
                });
            }
        }

        setupHeroAnimation() {
            const tl = gsap.timeline();
            tl.from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.2 })
                .from(".hero-title", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4")
                .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
                .from(".hero .btn-primary", { y: 20, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4");
        }
    }

    /**
     * Main controller for the entire "Ride" page experience.
     * Manages verses, gallery, and global animations.
     */
    class RideController {
        constructor() {
            this.dataManager = new DataManager(window.opaHifiDatabase);
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
            this.opaverses.forEach(opaverse => {
                const updateUrl = () => {
                    const nextHash = `#${opaverse.element.id}`;
                    if (window.location.hash !== nextHash) {
                        history.replaceState(null, '', nextHash);
                    }
                };

                ScrollTrigger.create({
                    trigger: opaverse.element,
                    start: "top center",
                    end: "bottom center",
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

        /**
         * Creates the DOM element for a single verse based on its ViewModel.
         * @param {VerseViewModel} viewModel - The data model for the verse.
         * @returns {HTMLElement} The constructed <section> element for the verse.
         */
        createVerseElement(viewModel) {
            const section = document.createElement('section');
            section.className = 'opaverse';
            section.id = viewModel.id;

            // This template defines the universal inner structure for all verses.
            // Special content (like the huge text for 'brunch') is added conditionally.
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

    // Instantiate the controller to run the application
    new RideController();
});
