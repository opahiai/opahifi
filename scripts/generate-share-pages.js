const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE_ORIGIN = "https://opahifi.com";
const SCRIPT_PATH = path.join(ROOT, "script.js");
const REDIRECTS_PATH = path.join(ROOT, "_redirects");
const SHARE_ROOT = path.join(ROOT, "s");

function normalizeShareToken(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getVersionKind(song) {
    return song && !song.version ? "main" : null;
}

function getVersionLabel(song) {
    const versionKind = getVersionKind(song);
    if (versionKind === "main") return "Main version";
    return String(song && song.version ? song.version : "").trim();
}

function getSongShareToken(song) {
    return normalizeShareToken(getVersionLabel(song) || song.id || "");
}

function toAbsoluteAssetUrl(assetPath) {
    const normalized = String(assetPath || "").trim().replace(/\\/g, "/");
    const pathname = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return new URL(pathname, SITE_ORIGIN).toString();
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function renderSharePage({ title, description, shareUrl, imageUrl, appUrl }) {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:alt" content="${escapeHtml(title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
</head>
<body>
  <p>Opening...</p>
  <p><a href="${escapeHtml(appUrl)}">Continue</a></p>
  <script>
    location.replace(${JSON.stringify(appUrl)});
  </script>
</body>
</html>
`;
}

function loadMusicData() {
    const source = fs.readFileSync(SCRIPT_PATH, "utf8");
    const start = source.indexOf("// Music data (inline)");
    const end = source.indexOf("class PL3AudioBorderVisualizer");
    if (start === -1 || end === -1 || end <= start) {
        throw new Error("Could not locate inline music data block in script.js");
    }

    const musicBlock = source.slice(start, end);
    const context = {
        window: {},
        Object,
        String,
        Array
    };
    vm.createContext(context);
    vm.runInContext(musicBlock, context, { filename: "script.js" });

    const data = context.window.musicDataGrouped;
    if (!data || !Array.isArray(data.groups) || !data.singlesById) {
        throw new Error("musicDataGrouped was not populated from script.js");
    }

    return data;
}

function ensureCleanShareRoot() {
    fs.rmSync(SHARE_ROOT, { recursive: true, force: true });
    fs.mkdirSync(SHARE_ROOT, { recursive: true });
}

function writePage(routePath, html) {
    const relativePath = routePath.replace(/^\/+/, "");
    const targetDir = path.join(ROOT, relativePath);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.html"), html, "utf8");
}

function generate() {
    const data = loadMusicData();
    const redirects = [];

    ensureCleanShareRoot();

    for (const group of data.groups) {
        const groupKey = String(group.key || "").trim();
        if (!groupKey) continue;

        const groupTitle = String(group.title || "OpaHiFi").trim();
        const groupDescription = `Listen to ${groupTitle} by OpaHiFi.`;
        const groupSharePath = `/s/${encodeURIComponent(groupKey)}`;
        const groupAppUrl = new URL("/", SITE_ORIGIN);
        groupAppUrl.searchParams.set("pl3", groupKey);

        writePage(groupSharePath, renderSharePage({
            title: groupTitle,
            description: groupDescription,
            shareUrl: new URL(groupSharePath, SITE_ORIGIN).toString(),
            imageUrl: toAbsoluteAssetUrl(group.shareImage || group.cover || "img/music/opahifi_album.png"),
            appUrl: groupAppUrl.toString()
        }));
        redirects.push(`${groupSharePath} ${groupSharePath}/index.html 200`);

        const songIds = Array.isArray(group.songIds) ? group.songIds : [];
        for (const songId of songIds) {
            const song = data.singlesById[songId];
            if (!song) continue;

            const versionKind = getVersionKind(song);
            const versionLabel = getVersionLabel(song);
            const songTitle = `${song.title}${versionKind !== "main" && versionLabel ? ` (${versionLabel})` : ""}`;
            const songDescription = `Listen to ${songTitle} by OpaHiFi.`;
            const songToken = getSongShareToken(song);
            const songSharePath = `/s/${encodeURIComponent(groupKey)}/${encodeURIComponent(songToken)}`;
            const songAppUrl = new URL("/", SITE_ORIGIN);
            songAppUrl.searchParams.set("pl3", groupKey);
            songAppUrl.searchParams.set("pl3s", songToken);

            writePage(songSharePath, renderSharePage({
                title: songTitle,
                description: songDescription,
                shareUrl: new URL(songSharePath, SITE_ORIGIN).toString(),
                imageUrl: toAbsoluteAssetUrl(song.image || group.shareImage || group.cover || "img/music/opahifi_album.png"),
                appUrl: songAppUrl.toString()
            }));
            redirects.push(`${songSharePath} ${songSharePath}/index.html 200`);
        }
    }

    fs.writeFileSync(REDIRECTS_PATH, `${redirects.join("\n")}\n`, "utf8");
}

generate();
