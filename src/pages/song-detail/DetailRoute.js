class OpaHifiDetailRoute {
    isActive(state) {
        return state.mode === "detail";
    }

    buildHash(state) {
        return state.versionIndex > 0
            ? `#${state.songId}/v${state.versionIndex + 1}`
            : `#${state.songId}`;
    }

    matches(route, app) {
        const [songId] = route.split("/");
        return app.songs.some((song) => song.id === songId);
    }

    apply(app, route) {
        const [songId, versionToken] = route.split("/");
        const song = app.songs.find((item) => item.id === songId);
        if (!song) {
            app.openGallery({ skipRoute: true });
            return;
        }

        let versionIndex = 0;
        if (versionToken) {
            const parsed = Number.parseInt(versionToken.replace(/^v/i, ""), 10);
            if (Number.isFinite(parsed) && parsed > 0) {
                versionIndex = Math.min(parsed - 1, song.versions.length - 1);
            }
        }

        app.openSong(songId, versionIndex, { skipRoute: true });
    }
}

window.OpaHifiDetailRoute = OpaHifiDetailRoute;
