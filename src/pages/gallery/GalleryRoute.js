class OpaHifiGalleryRoute {
    isActive(state) {
        return state.mode === "gallery";
    }

    buildHash() {
        return "#gallery";
    }

    matches(route) {
        return !route || route === "gallery";
    }

    apply(app) {
        app.openGallery({ skipRoute: true });
    }
}

window.OpaHifiGalleryRoute = OpaHifiGalleryRoute;
