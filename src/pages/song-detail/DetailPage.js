class OpaHifiDetailPage {
    constructor(options = {}) {
        this.els = options.els || {};
        this.songs = options.songs || [];
        this.platforms = options.platforms || [];
        this.platformIcons = options.platformIcons || {};
        this.coverUrl = options.coverUrl;
        this.versionImageUrl = options.versionImageUrl || ((song, version) => version.image || this.coverUrl(song));
        this.onOpenSong = options.onOpenSong || (() => { });
        this.state = {
            songId: null,
            versionIndex: 0
        };
        this.lyricsCache = new Map();
        this.lyricsRequestId = 0;
    }

    activate(songId, versionIndex = 0) {
        this.state.songId = songId;
        this.state.versionIndex = versionIndex;
        this.renderDetail();
    }

    deactivate() {
        this.lyricsRequestId += 1;
    }

    getSong(id) {
        return this.songs.find((song) => song.id === id) || this.songs[0];
    }

    async loadLyrics(version) {
        const fallback = version.lyrics || "";
        if (!version.lyricsPath) return fallback;
        if (this.lyricsCache.has(version.lyricsPath)) return this.lyricsCache.get(version.lyricsPath);

        const response = await fetch(version.lyricsPath, { cache: "force-cache" });
        if (!response.ok) throw new Error(`Lyrics request failed: ${response.status}`);
        const text = await response.text();
        this.lyricsCache.set(version.lyricsPath, text);
        return text;
    }

    createIconImg(src) {
        const icon = document.createElement("img");
        icon.className = "ophf-listenIcon";
        icon.src = src;
        icon.alt = "";
        return icon;
    }

    createShareIcon() {
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("class", "ophf-listenIcon");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-hidden", "true");

        const lineA = document.createElementNS("http://www.w3.org/2000/svg", "path");
        lineA.setAttribute("d", "M8.7 10.7 15.3 7.2");
        const lineB = document.createElementNS("http://www.w3.org/2000/svg", "path");
        lineB.setAttribute("d", "M8.7 13.3 15.3 16.8");
        [lineA, lineB].forEach((line) => {
            line.setAttribute("fill", "none");
            line.setAttribute("stroke", "currentColor");
            line.setAttribute("stroke-width", "2.3");
            line.setAttribute("stroke-linecap", "round");
            icon.appendChild(line);
        });

        [
            [6.5, 12],
            [17.5, 6],
            [17.5, 18]
        ].forEach(([cx, cy]) => {
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", cx);
            dot.setAttribute("cy", cy);
            dot.setAttribute("r", "2.8");
            dot.setAttribute("fill", "currentColor");
            icon.appendChild(dot);
        });

        return icon;
    }

    versionMixBackground(version) {
        const colors = Array.isArray(version.mixColors) ? version.mixColors.filter(Boolean) : [];
        if (!colors.length) return "#ffffff";
        if (colors.length === 1) return colors[0];
        return `linear-gradient(135deg, ${colors.join(", ")})`;
    }

    createVersionJump(direction, targetVersion, targetIndex) {
        const btn = document.createElement("button");
        btn.className = "ophf-versionJump";
        btn.type = "button";
        btn.setAttribute("aria-label", `${direction < 0 ? "Previous" : "Next"} version`);
        btn.addEventListener("click", () => this.onOpenSong(this.state.songId, targetIndex));

        const glyph = document.createElement("span");
        glyph.className = "ophf-versionJumpGlyph";
        glyph.textContent = direction < 0 ? "<" : ">";

        const swatch = document.createElement("span");
        swatch.className = "ophf-versionJumpSwatch";
        swatch.style.background = this.versionMixBackground(targetVersion);
        swatch.appendChild(glyph);

        btn.appendChild(swatch);
        return btn;
    }

    renderRail() {
        if (!this.els.miniRail) return;
        this.els.miniRail.innerHTML = "";

        this.songs
            .slice()
            .sort((a, b) => a.journey - b.journey)
            .forEach((song) => {
                const btn = document.createElement("button");
                btn.className = "ophf-railBtn";
                btn.type = "button";
                btn.setAttribute("aria-label", song.title);
                btn.setAttribute("aria-current", song.id === this.state.songId ? "true" : "false");
                btn.addEventListener("click", () => this.onOpenSong(song.id));

                const img = document.createElement("img");
                img.className = "ophf-railImg";
                img.src = this.coverUrl(song);
                img.alt = "";

                const crop = document.createElement("span");
                crop.className = "ophf-nodeArtCrop";
                crop.appendChild(img);

                btn.appendChild(crop);
                this.els.miniRail.appendChild(btn);
            });
    }

    renderLinks(version) {
        if (!this.els.links) return;
        this.els.links.innerHTML = "";

        const strip = document.createElement("div");
        strip.className = "ophf-listenStrip";

        this.platforms.forEach((name) => {
            const a = document.createElement("a");
            a.className = "ophf-listenBtn";
            a.href = version.links[name] || "#";
            a.setAttribute("aria-label", `${name} link`);
            a.appendChild(this.createIconImg(this.platformIcons[name]));
            strip.appendChild(a);
        });

        this.els.links.appendChild(strip);
    }

    async renderDetail() {
        if (!this.els.trackCover) return;

        const song = this.getSong(this.state.songId);
        const version = song.versions[this.state.versionIndex] || song.versions[0];
        const requestId = ++this.lyricsRequestId;

        this.els.trackCover.src = this.versionImageUrl(song, version);
        this.els.trackCover.alt = `${song.title} cover`;
        this.els.trackTitle.textContent = "";
        this.els.versionTitle.textContent = version.title;
        this.els.lyrics.textContent = "Loading lyrics...";

        if (song.versions.length <= 1) {
            this.els.versionMeta.textContent = "Opa & Only version";
        } else {
            this.els.versionMeta.textContent = `Version ${this.state.versionIndex + 1}/${song.versions.length}`;
        }

        this.els.versionNav.innerHTML = "";
        if (song.versions.length > 1) {
            if (this.state.versionIndex > 0) {
                this.els.versionNav.appendChild(
                    this.createVersionJump(-1, song.versions[this.state.versionIndex - 1], this.state.versionIndex - 1)
                );
            }
            if (this.state.versionIndex < song.versions.length - 1) {
                this.els.versionNav.appendChild(
                    this.createVersionJump(1, song.versions[this.state.versionIndex + 1], this.state.versionIndex + 1)
                );
            }
        }

        this.els.shareSlot.innerHTML = "";
        const share = document.createElement("button");
        share.className = "ophf-shareBtn";
        share.type = "button";
        share.setAttribute("aria-label", "Share");
        share.appendChild(this.createShareIcon());
        share.addEventListener("click", () => this.shareCurrent());
        this.els.shareSlot.appendChild(share);

        this.renderLinks(version);
        this.renderRail();

        try {
            const lyrics = await this.loadLyrics(version);
            if (requestId === this.lyricsRequestId) {
                this.els.lyrics.textContent = lyrics || version.lyrics || "";
            }
        } catch {
            if (requestId === this.lyricsRequestId) {
                this.els.lyrics.textContent = version.lyrics || "";
            }
        }
    }

    shareCurrent() {
        const song = this.getSong(this.state.songId);
        const hash = this.state.versionIndex > 0
            ? `#${song.id}/v${this.state.versionIndex + 1}`
            : `#${song.id}`;
        const shareData = {
            title: `OPAHiFi - ${song.title}`,
            text: `Listen to ${song.title} on OPAHiFi`,
            url: `${location.origin}${location.pathname}${hash}`
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => { });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareData.url);
        }
    }
}

window.OpaHifiDetailPage = OpaHifiDetailPage;
