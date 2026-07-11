class OhTermsOverlay {
  constructor() {
    this.overlay = null;
    this.openButtons = [];
    this.closeButtons = [];
    this.lastFocusedElement = null;
  }

  mount() {
    this.overlay = document.querySelector("[data-oh-terms-overlay]");
    this.openButtons = [...document.querySelectorAll("[data-oh-terms-open]")];
    this.closeButtons = [...document.querySelectorAll("[data-oh-terms-close]")];

    if (!this.overlay || this.openButtons.length === 0) return;

    this.openButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.open();
      });
    });

    this.closeButtons.forEach((button) => {
      button.addEventListener("click", () => this.close());
    });

    this.overlay.addEventListener("click", (event) => {
      if (event.target === this.overlay) this.close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.overlay?.classList.contains("is-open")) this.close();
    });
  }

  open() {
    this.lastFocusedElement = document.activeElement;
    this.overlay.classList.add("is-open");
    this.overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-terms-open");
    this.overlay.querySelector("[data-oh-terms-close]")?.focus();
  }

  close() {
    this.overlay.classList.remove("is-open");
    this.overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-terms-open");

    if (this.lastFocusedElement instanceof HTMLElement) {
      this.lastFocusedElement.focus();
    }
  }
}

export const ohTermsOverlay = new OhTermsOverlay();
