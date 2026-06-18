class OpaHifiAboutRoute {
    isActive(state) {
        return state.mode === "about";
    }

    buildHash() {
        return "#about";
    }

    matches(route) {
        return route === "about";
    }

    apply(app) {
        app.openAbout({ skipRoute: true });
    }
}

window.OpaHifiAboutRoute = OpaHifiAboutRoute;
