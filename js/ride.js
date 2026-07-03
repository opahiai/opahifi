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
            if (!this.bgWrapper) return;

            // Verse 1: Repeating text background
            if (this.data.id === 'v1') {
                this.bgWrapper.innerText = "SURVIVING FABULOUSLY CHAOS ".repeat(300);
            }

            // Verse 3: Parallax huge text
            if (this.data.id === 'v3') {
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
            }
        }
    }

    /**
     * Manages all data for the ride.
     */
    class DataManager {
        constructor(database) {
            this.rideVerses = this._getRideData(database);
            this.processedVerses = this._processVersesData();
        }

        /**
         * Defines the structured data for all verses in the ride.
         * This mirrors the structure from `script.js` for consistency and maintainability.
         * @returns {Array} An array of verse data objects.
         */
        _getRideData(database) {
            // Use the ride-specific verses from the global database
            const rideOrder = ['full-mindness', 'hallucinatingdumdum', 'yeahletsdobrunch', 'splendaloverabbithell', 'believethetruthfairy', 'oldlovestory', 'glittaaphoenix', 'notyourbot-beepsleep', 'wellwolfhowllehluya', 'opapapaparty'];
            const allGroups = database?.groups || [];
            const groupsByKey = Object.fromEntries(allGroups.map(g => [g.key, g]));
            return rideOrder.map(key => groupsByKey[key]).filter(Boolean);
        }

        /**
         * Processes the raw verse data, adding dynamic properties like colors.
         * @returns {Array} The processed array of verse data.
         */
        _processVersesData() {
            const rideVerses = this.rideVerses;

            // Map the structured verse data to the format required by the Verse class.
            let verses = rideVerses.map((verse, index) => {
                const num = String(index + 1).padStart(2, '0');
                const fullSubtitle = `${num} // ${verse.ride?.subtitle || ''}`;
                return {
                    id: `v${index + 1}`,
                    line1: verse.titleLines[0] || '',
                    line2: verse.titleLines[1] || '',
                    img: `https://raw.githubusercontent.com/eliran-t/opa-assets/main/opahifi/base-${verse.key}.png`, // Keep remote URLs for the ride
                    subtitle: fullSubtitle,
                    description: verse.ride?.description || ''
                };
            });

            const startHue = 360; // Red
            const endHue = 210;   // Blue
            const hueStep = (startHue - endHue) / (verses.length - 1);

            verses = verses.map((song, index) => {
                const currentHue = startHue - (index * hueStep);
                return {
                    ...song,
                    color: `hsl(${currentHue}, 100%, 50%)`,
                    lightColor: `hsl(${currentHue}, 100%, 75%)`
                };
            });
            return verses;
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

        /**
         * Finds all verse elements and initializes a Verse instance for each.
         */
        setupVerses() {
            this.versesData.forEach(data => {
                const element = document.getElementById(data.id);
                if (element) {
                    const verse = new Verse(data, element);
                    verse.init();
                }
            });
        }

        /**
         * Populates the gallery section with cards for each verse.
         */
        populateGallery() {
            const galleryGrid = document.getElementById('gallery-grid');
            if (!galleryGrid) return;

            this.versesData.forEach((verse, index) => {
                const num = String(index + 1).padStart(2, '0');
                const card = document.createElement('div');
                card.className = 'gallery-card glass-panel';
                card.innerHTML = `
                    <div class="card-img"><img src="${verse.img}" alt="${verse.line1} ${verse.line2}"></div>
                    <div class="card-info">
                        <div class="card-info-num">${num}</div>
                        <div class="card-info-title font-heavy">${verse.line1}<br>${verse.line2}</div>
                    </div>`;
                card.addEventListener('click', () => this.lenis.scrollTo(`#${verse.id}`));
                galleryGrid.appendChild(card);
            });
        }

        /**
         * Sets up the toggle functionality for the mobile navigation menu.
         */
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

        /**
         * Creates and plays the entrance animation for the hero section.
         */
        setupHeroAnimation() {
            const tl = gsap.timeline();
            tl.from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.2 })
                .from(".hero-title", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4")
                .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
                .from(".hero .btn-primary", { y: 20, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4");
        }
    }

    // Instantiate the controller to run the application
    new RideController();
});