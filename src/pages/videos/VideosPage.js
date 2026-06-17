class OpaHifiVideosView {
    static cards = [
        {
            id: "meet",
            title: "MEET OPA!",
            href: "https://www.youtube.com/playlist?list=PLtGnlTqdsNV02--EhJTxL1WJG7oAf1Fc9",
            bgSrc: "img/opa/videos/opa-meet-bg.png",
            fgSrc: "img/opa/videos/opa-meet.png",
            className: "ophf-videoCard ophf-videoCard--meet"
        },
        {
            id: "clips",
            title: "VIDEO CLIPS",
            href: "https://www.youtube.com/playlist?list=PLtGnlTqdsNV22pErYzaWpzQh1Ilcb266T",
            bgSrc: "img/opa/videos/opa-video-bg.png",
            fgSrc: "img/opa/videos/opa-video.png",
            className: "ophf-videoCard"
        },
        {
            id: "lyrics",
            title: "LYRICS SHORTS",
            href: "https://www.youtube.com/playlist?list=PLtGnlTqdsNV0mslgh_bWih69lDOORw7rA",
            bgSrc: "img/opa/videos/opa-lyrics-bg.png",
            fgSrc: "img/opa/videos/opa-lyrics.png",
            className: "ophf-videoCard"
        }
    ];

    static guideCopy = {
        default: {
            tag: "VAULT",
            text: "Choose your chaos."
        },
        meet: {
            tag: "MEET",
            text: "Meet the little menace."
        },
        clips: {
            tag: "CLIPS",
            text: "Watch the songs come alive."
        },
        lyrics: {
            tag: "LYRICS",
            text: "Sing the chaos in shorts."
        }
    };

    constructor(root) {
        this.root = root;
        this.cleanup = [];
        this.activeCardId = null;
        this.cardsById = new Map();
        this.playersById = new Map();
        this.shell = null;
        this.rail = null;
        this.layoutObserver = null;
        this.guide = document.querySelector("[data-ophf-video-guide]");
        this.guideText = document.querySelector("[data-ophf-video-guide-text]");
        this.guideTag = document.querySelector("[data-ophf-video-guide-tag]");
        this.handleLayout = () => this.applyLayout();
    }

    render() {
        if (!this.root || this.root.childElementCount) return;

        this.shell = document.createElement("div");
        this.shell.className = "ophf-videoShell";

        this.rail = document.createElement("div");
        this.rail.className = "ophf-videoRail";
        this.shell.appendChild(this.rail);
        this.root.appendChild(this.shell);

        OpaHifiVideosView.cards.forEach((card) => {
            const node = this.createCard(card);
            this.cardsById.set(card.id, node);
            this.rail.appendChild(node);
        });
    }

    activate() {
        this.render();
        this.bindPointerMotion();
        this.bindLayout();
        this.setGuide(this.activeCardId || "default");
        this.applyLayout();
    }

    deactivate() {
        this.resetPointerMotion();
        this.unbindLayout();
        this.clearSelection();
    }

    setGuide(cardId = "default") {
        const copy = OpaHifiVideosView.guideCopy[cardId] || OpaHifiVideosView.guideCopy.default;
        if (this.guide) this.guide.dataset.ophfVideoGuide = cardId;
        if (this.guideText) this.guideText.textContent = copy.text;
        if (this.guideTag) this.guideTag.textContent = copy.tag;
    }

    createCard(card) {
        const cardNode = document.createElement("article");
        cardNode.className = card.className;
        cardNode.dataset.ophfVideoId = card.id;
        cardNode.setAttribute("aria-label", `Open ${card.title}`);
        cardNode.setAttribute("aria-pressed", "false");
        cardNode.setAttribute("role", "button");
        cardNode.tabIndex = 0;
        cardNode.addEventListener("click", () => {
            if (this.activeCardId === card.id) return;
            this.selectCard(card.id);
        });
        cardNode.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            if (this.activeCardId === card.id) return;
            this.selectCard(card.id);
        });

        const scene = document.createElement("span");
        scene.className = "ophf-videoScene";
        scene.setAttribute("aria-hidden", "true");

        const bg = document.createElement("img");
        bg.className = "ophf-videoThumb ophf-videoThumb--bg";
        bg.src = card.bgSrc;
        bg.alt = "";
        bg.loading = "lazy";

        const fg = document.createElement("img");
        fg.className = "ophf-videoThumb ophf-videoThumb--fg";
        fg.src = card.fgSrc;
        fg.alt = "";
        fg.loading = "lazy";

        const title = document.createElement("span");
        title.className = "ophf-videoTitle";
        title.textContent = card.title;

        const activeStack = document.createElement("div");
        activeStack.className = "ophf-videoActiveStack";

        const player = document.createElement("div");
        player.className = "ophf-videoPlayer";

        const iframe = document.createElement("iframe");
        iframe.className = "ophf-videoFrame";
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        iframe.title = `${card.title} player`;
        player.appendChild(iframe);
        this.playersById.set(card.id, iframe);

        const close = document.createElement("button");
        close.className = "ophf-videoCloseBtn";
        close.type = "button";
        close.textContent = "X";
        close.setAttribute("aria-label", `Close ${card.title}`);
        close.addEventListener("click", (event) => {
            event.stopPropagation();
            this.clearSelection();
        });

        const playButton = document.createElement("span");
        playButton.className = "ophf-videoPlayBtn";

        const play = document.createElement("span");
        play.className = "ophf-videoPlayIcon";

        activeStack.appendChild(close);
        activeStack.appendChild(player);
        playButton.appendChild(play);
        scene.appendChild(title);
        scene.appendChild(bg);
        scene.appendChild(fg);
        scene.appendChild(playButton);
        cardNode.appendChild(scene);
        cardNode.appendChild(activeStack);
        return cardNode;
    }

    selectCard(cardId) {
        const card = OpaHifiVideosView.cards.find((item) => item.id === cardId);
        if (!card || !this.root) return;

        this.activeCardId = card.id;
        this.root.classList.add("ophf-videoGrid--active");
        this.setGuide(card.id);
        this.applyLayout();

        this.cardsById.forEach((node, id) => {
            node.setAttribute("aria-pressed", id === card.id ? "true" : "false");
        });

        this.playersById.forEach((frame, id) => {
            frame.src = id === card.id ? this.toEmbedSrc(card.href) : "";
        });
    }

    clearSelection() {
        this.activeCardId = null;
        if (this.root) this.root.classList.remove("ophf-videoGrid--active");
        this.setGuide("default");
        this.applyLayout();
        this.cardsById.forEach((node) => {
            node.setAttribute("aria-pressed", "false");
        });
        this.playersById.forEach((frame) => {
            frame.src = "";
        });
    }

    toEmbedSrc(href) {
        try {
            const url = new URL(href);
            const playlistId = url.searchParams.get("list");
            if (playlistId) {
                return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&autoplay=1&playsinline=1&rel=0&controls=1&modestbranding=1`;
            }
        } catch (_) {
            return "";
        }
        return "";
    }

    bindPointerMotion() {
        if (!this.rail || this.cleanup.length) return;
        if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        this.rail.querySelectorAll(".ophf-videoCard").forEach((card, index) => {
            const bg = card.querySelector(".ophf-videoThumb--bg");
            const fg = card.querySelector(".ophf-videoThumb--fg");
            if (!bg || !fg) return;

            const baseBgX = index === 1 ? 1.6 : -1.6;
            const moveCard = (ev) => {
                const rect = card.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const px = ((ev.clientX - rect.left) / rect.width) - 0.5;
                const py = ((ev.clientY - rect.top) / rect.height) - 0.5;
                bg.style.transform = `translate(${(baseBgX + (px * 8)).toFixed(2)}%, ${(py * 5).toFixed(2)}%) scale(1.1)`;
                fg.style.transform = `translate(${(px * -4.5).toFixed(2)}%, ${(py * -2.2).toFixed(2)}%) scale(1.04)`;
            };

            const leaveCard = () => {
                bg.style.transform = "";
                fg.style.transform = "";
            };

            card.addEventListener("pointermove", moveCard);
            card.addEventListener("pointerleave", leaveCard);
            card.addEventListener("blur", leaveCard, true);
            this.cleanup.push(() => {
                card.removeEventListener("pointermove", moveCard);
                card.removeEventListener("pointerleave", leaveCard);
                card.removeEventListener("blur", leaveCard, true);
            });
        });
    }

    bindLayout() {
        if (!this.root) return;
        if (!this.layoutObserver && "ResizeObserver" in window) {
            this.layoutObserver = new ResizeObserver(this.handleLayout);
            this.layoutObserver.observe(this.root);
        }
        window.addEventListener("resize", this.handleLayout);
    }

    unbindLayout() {
        if (this.layoutObserver) {
            this.layoutObserver.disconnect();
            this.layoutObserver = null;
        }
        window.removeEventListener("resize", this.handleLayout);
    }

    applyLayout() {
        if (!this.root) return;

        const width = this.root.clientWidth;
        const height = this.root.clientHeight;
        if (!width || !height) return;

        const isNarrow = width < 760;
        const gap = isNarrow ? 10 : 14;
        const shellW = Math.min(width, isNarrow ? 940 : 1020);
        const shellH = Math.min(
            height,
            Math.max(
                isNarrow ? 310 : 360,
                Math.min(isNarrow ? 430 : 540, Math.floor(shellW * (isNarrow ? 0.8 : 0.56)))
            )
        );
        const activeFlex = isNarrow ? 1.78 : 2.1;
        const idleFlex = isNarrow ? 0.61 : 0.78;

        this.root.style.setProperty("--ophf-video-gap", `${gap}px`);
        this.root.style.setProperty("--ophf-video-shell-w", `${shellW}px`);
        this.root.style.setProperty("--ophf-video-shell-h", `${shellH}px`);

        this.cardsById.forEach((node, id) => {
            const flex = this.activeCardId ? (id === this.activeCardId ? activeFlex : idleFlex) : 1;
            node.style.setProperty("--ophf-video-flex", String(flex));
        });
    }

    resetPointerMotion() {
        this.cleanup.forEach((cleanup) => cleanup());
        this.cleanup = [];
        if (!this.rail) return;
        this.rail.querySelectorAll(".ophf-videoThumb--bg, .ophf-videoThumb--fg").forEach((node) => {
            node.style.transform = "";
        });
    }
}

class OpaHifiVideosRoute {
    isActive(state) {
        return state.mode === "videos";
    }

    buildHash() {
        return "#videos";
    }

    matches(route) {
        return route === "videos";
    }

    apply(app) {
        app.openVideos({ skipRoute: true });
    }
}

window.OpaHifiVideosView = OpaHifiVideosView;
window.OpaHifiVideosRoute = OpaHifiVideosRoute;
