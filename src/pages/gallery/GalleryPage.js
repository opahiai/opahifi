class OpaHifiGalleryPage {
    constructor(options = {}) {
        this.els = options.els;
        this.songs = options.songs || [];
        this.coverUrl = options.coverUrl;
        this.setImageFallback = options.setImageFallback;
        this.onOpenSong = options.onOpenSong;
        this.onOpenLatest = options.onOpenLatest;
        this.onPlayAll = options.onPlayAll;
        this.spiralFrame = 0;
        this.mapResizeObserver = null;
        this.bound = false;
        this.handleResize = this.scheduleSpiralUpdate.bind(this);
        this.handleLatest = () => this.onOpenLatest();
        this.handlePlayAll = () => this.onPlayAll();
    }

    activate() {
        this.render();
        this.bindEvents();
        this.scheduleSpiralUpdate();
    }

    deactivate() {
        this.unbindEvents();
        if (this.spiralFrame) {
            cancelAnimationFrame(this.spiralFrame);
            this.spiralFrame = 0;
        }
    }

    render() {
        if (!this.els?.mapGrid) return;
        this.els.mapGrid.innerHTML = "";

        this.songs
            .slice()
            .sort((a, b) => a.journey - b.journey)
            .forEach((song) => {
                const cell = document.createElement("div");
                cell.className = "ophf-mapCell";
                cell.dataset.ophfSongId = song.id;
                cell.style.gridRow = song.grid[0];
                cell.style.gridColumn = song.grid[1];

                const node = document.createElement("button");
                node.className = "ophf-songNode";
                node.type = "button";
                node.setAttribute("aria-label", `Open ${song.title}`);
                node.addEventListener("click", () => this.onOpenSong(song.id));

                const img = document.createElement("img");
                img.className = "ophf-songNodeImg";
                img.src = this.coverUrl(song);
                img.alt = "";
                this.setImageFallback(img, song);

                const title = document.createElement("span");
                title.className = "ophf-songNodeTitle";
                (song.labelLines || [song.title]).forEach((line) => {
                    const lineEl = document.createElement("span");
                    lineEl.className = "ophf-songNodeTitleLine";
                    lineEl.textContent = line;
                    title.appendChild(lineEl);
                });

                const crop = document.createElement("span");
                crop.className = "ophf-nodeArtCrop";
                crop.appendChild(img);

                node.appendChild(title);
                node.appendChild(crop);
                const unit = document.createElement("div");
                unit.className = "ophf-songUnit";

                unit.appendChild(node);
                cell.appendChild(unit);
                this.els.mapGrid.appendChild(cell);
            });
    }

    bindEvents() {
        if (this.bound) return;
        this.bound = true;

        if (this.els?.latest) {
            this.els.latest.addEventListener("click", this.handleLatest);
        }
        if (this.els?.playAll) {
            this.els.playAll.addEventListener("click", this.handlePlayAll);
        }

        window.addEventListener("resize", this.handleResize);

        if ("ResizeObserver" in window && this.els?.songField) {
            this.mapResizeObserver = new ResizeObserver(this.handleResize);
            this.mapResizeObserver.observe(this.els.songField);
        }
    }

    unbindEvents() {
        if (!this.bound) return;
        this.bound = false;

        if (this.els?.latest) {
            this.els.latest.removeEventListener("click", this.handleLatest);
        }
        if (this.els?.playAll) {
            this.els.playAll.removeEventListener("click", this.handlePlayAll);
        }

        window.removeEventListener("resize", this.handleResize);

        if (this.mapResizeObserver) {
            this.mapResizeObserver.disconnect();
            this.mapResizeObserver = null;
        }
    }

    scheduleSpiralUpdate() {
        if (this.spiralFrame) return;
        this.spiralFrame = requestAnimationFrame(() => {
            this.spiralFrame = 0;
            this.updateSpiral();
        });
    }

    updateSpiral() {
        if (!this.els?.songField || !this.els?.spiralSvg || !this.els?.spiralLine || !this.els?.spiralGlow) return;

        const fieldRect = this.els.songField.getBoundingClientRect();
        if (!fieldRect.width || !fieldRect.height) return;

        const ordered = this.songs.slice().sort((a, b) => a.journey - b.journey);
        const points = ordered
            .map((song) => {
                const cell = this.els.mapGrid.querySelector(`[data-ophf-song-id="${song.id}"]`);
                const node = cell ? cell.querySelector(".ophf-songNode") : null;
                if (!node) return null;

                const nodeRect = node.getBoundingClientRect();
                return {
                    x: nodeRect.left - fieldRect.left + nodeRect.width / 2,
                    y: nodeRect.top - fieldRect.top + nodeRect.height / 2
                };
            })
            .filter(Boolean);

        if (points.length < 2) return;

        const d = points
            .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
            .join(" ");
        const width = fieldRect.width.toFixed(2);
        const height = fieldRect.height.toFixed(2);
        const first = points[0];
        const last = points[points.length - 1];

        this.els.spiralSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        this.els.spiralGlow.setAttribute("d", d);
        this.els.spiralLine.setAttribute("d", d);

        if (this.els.spiralGradient) {
            this.els.spiralGradient.setAttribute("x1", first.x.toFixed(2));
            this.els.spiralGradient.setAttribute("y1", first.y.toFixed(2));
            this.els.spiralGradient.setAttribute("x2", last.x.toFixed(2));
            this.els.spiralGradient.setAttribute("y2", last.y.toFixed(2));
        }
    }
}

window.OpaHifiGalleryPage = OpaHifiGalleryPage;
