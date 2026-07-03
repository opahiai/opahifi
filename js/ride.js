document.addEventListener("DOMContentLoaded", () => {
    /**
     * Manages a single "verse" section in the ride.
     * Handles its own styling, content, and animations.
     */
    class Verse {
        constructor(data, element) {
            this.data = data;
            this.element = element;
            this.content = this.element.querySelector('.verse-content');
            this.bgWrapper = this.element.querySelector('.verse-bg-wrapper');
        }

        /**
         * Initializes the verse by setting styles, title, and animations.
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
         * Populates the title of the verse.
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
     * Main controller for the entire "Ride" page experience.
     * Manages verses, gallery, and global animations.
     */
    class RideController {
        constructor() {
            this.versesData = this.getVersesData();
            this.lenis = null;
            this.init();
        }

        /**
         * Defines the structured data for all verses in the ride.
         * This mirrors the structure from `script.js` for consistency and maintainability.
         * @returns {Array} An array of verse data objects.
         */
        getRideData() {
            // This is the single source of truth for the ride page content.
            const rideVerses = [
                {
                    key: 'full-mindness',
                    titleLines: ['Full-', 'Mindness'],
                    subtitle: 'SURVIVE FABULOUSLY',
                    description: 'Everyday chaos takes over. Calm is not the goal anymore—surviving fabulously is. A high-contrast barrage of thoughts woven into an undeniable groove.'
                },
                {
                    key: 'hallucinatingdumdum',
                    titleLines: ['Hallucinating', 'Dum Dum'],
                    subtitle: 'THE BRAIN FILLS BLANKS',
                    description: 'Human confusion mirrors AI hallucination. A surreal 3D playground where logic melts into violet and cyan haze.'
                },
                {
                    key: 'yeahletsdobrunch',
                    titleLines: ['Yeah, Let\'s', 'Do Brunch'],
                    subtitle: 'FAKE WARMTH',
                    description: '"I miss you" with no follow-through. Bright morning mimosas fade into cold read receipts and deep cobalt emptiness.'
                },
                {
                    key: 'splendaloverabbithell',
                    titleLines: ['Splenda Love', 'Rabbit Hell'],
                    subtitle: 'ARTIFICIAL SWEETNESS',
                    description: 'Fake love tastes good for one second and terrible after. A descent into a glossy, sticky, molten nightmare.'
                },
                {
                    key: 'believethetruthfairy',
                    titleLines: ['Believe the', 'Truth Fairy'],
                    subtitle: 'BRINGING THE RECEIPTS',
                    description: 'Misinformation, lazy certainty, and online hate are challenged by a tired truth fairy. The blur fades into stark contrast.'
                },
                {
                    key: 'oldlovestory',
                    titleLines: ['Old Love', 'Story'],
                    subtitle: 'SLOWER, MESSIER ROMANCE',
                    description: 'The ride looks back at a time before disposable fast culture. Warm tones, soft glowing edges, and real connection.'
                },
                {
                    key: 'glittaaphoenix',
                    titleLines: ['Glittaa', 'Phoenix'],
                    subtitle: 'FIRE AND DANCE',
                    description: 'Pain becomes glitter, rhythm, fire, and kinetic momentum. The energy spikes as we rise from the ashes.'
                },
                {
                    key: 'notyourbot-beepsleep',
                    titleLines: ['Not Your Bot', 'Beep Sleep'],
                    subtitle: 'ABSOLUTE FREEDOM',
                    description: 'Bot/toy accusations flip into freedom, sass, and release. Sharp geometric cuts, stark contrast, and electric energy.'
                },
                { key: 'wellwolfhowllehluya', titleLines: ['Wellwolf', 'Howl-Lehluya'], subtitle: 'THE MONSTER REDEFINED', description: 'Real power is kindness, restraint, and not becoming the predator. Deep navy shadows pierced by soft violet moon glows.' },
                { key: 'opapapaparty', titleLines: ['Opa Pa', 'Pa Party'], subtitle: 'RIDE EXIT', description: 'The meltdown becomes celebration. Same chaos, better rhythm. We survived the ride.' }
            ];

            return rideVerses;
        }

        /**
         * Defines the raw data for all verses and calculates their colors.
         * @returns {Array} The processed array of verse data.
         */
        getVersesData() {
            const rideVerses = this.getRideData();

            // Map the structured verse data to the format required by the Verse class.
            const verses = rideVerses.map((verse, index) => {
                const num = String(index + 1).padStart(2, '0');
                const fullSubtitle = `${num} // ${verse.subtitle}`;
                return {
                    id: `v${index + 1}`,
                    line1: verse.titleLines[0] || '',
                    line2: verse.titleLines[1] || '',
                    img: `https://raw.githubusercontent.com/eliran-t/opa-assets/main/opahifi/base-${verse.key}.png`,
                    subtitle: fullSubtitle,
                    description: verse.description
                };
            });

            const startHue = 360; // Red
            const endHue = 210;   // Blue
            const hueStep = (startHue - endHue) / (verses.length - 1);

            return verses.map((song, index) => {
                const currentHue = startHue - (index * hueStep);
                return {
                    ...song,
                    color: `hsl(${currentHue}, 100%, 50%)`,
                    lightColor: `hsl(${currentHue}, 100%, 75%)`
                };
            });
        }

        /**
         * Initializes all components of the page.
         */
        init() {
            this.setupSmoothScroll();
            this.setupVerses();
            this.populateGallery();
            this.setupMobileMenu();
            this.setupHeroAnimation();
        }

        /**
         * Sets up Lenis for smooth scrolling and connects it to GSAP's ScrollTrigger.
         */
        setupSmoothScroll() {
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