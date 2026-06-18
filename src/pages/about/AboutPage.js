class OpaHifiAboutPage {
    constructor(root) {
        this.root = root;
        this.rendered = false;
    }

    activate() {
        this.render();
    }

    deactivate() {}

    render() {
        if (!this.root || this.rendered) return;
        this.rendered = true;

        const panel = document.createElement("div");
        panel.className = "ophf-aboutPanel";
        this.root.appendChild(panel);
    }
}

window.OpaHifiAboutPage = OpaHifiAboutPage;
