import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OH_OPAVERSE_MODULES } from "../src/opaverses/opaverse.registry.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_ORIGIN = "https://opahifi.com";
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

function isOriginalVersion(version) {
  return normalizeShareToken(version?.name || version?.id || version?.slug) === "original";
}

function getVersionToken(version) {
  return isOriginalVersion(version) ? "main-version" : normalizeShareToken(version?.name || version?.slug || version?.id);
}

function getAppHash(song, version = null) {
  const songSlug = song.slug || normalizeShareToken(song.title) || song.id;
  if (!version || version.default || isOriginalVersion(version)) return `#${encodeURIComponent(songSlug)}`;

  const versionSlug = version.slug || normalizeShareToken(version.name) || version.id;
  return `#${encodeURIComponent(songSlug)}/${encodeURIComponent(versionSlug)}`;
}

function getAppUrl(song, version = null) {
  const appUrl = new URL("/", SITE_ORIGIN);
  appUrl.hash = getAppHash(song, version);
  return appUrl.toString();
}

function toAbsoluteAssetUrl(assetUrl) {
  const rawUrl = String(assetUrl || "").trim();
  if (!rawUrl) return new URL("/img/music/opahifi_album.png", SITE_ORIGIN).toString();
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

  if (rawUrl.startsWith("file:")) {
    const assetPath = fileURLToPath(rawUrl);
    const relativePath = path.relative(ROOT, assetPath).replace(/\\/g, "/");
    return new URL(`/${relativePath}`, SITE_ORIGIN).toString();
  }

  const pathname = rawUrl.replace(/\\/g, "/").replace(/^\/?/, "/");
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

function cleanShareText(value) {
  return String(value ?? "")
    .replaceAll("â€™", "’")
    .replaceAll("â€˜", "‘")
    .replaceAll("â€œ", "“")
    .replaceAll("â€", "”")
    .replaceAll("â€”", "—")
    .replaceAll("â€“", "–")
    .replaceAll("Â¡", "¡")
    .replaceAll("Â¿", "¿")
    .replaceAll("Ã¡", "á")
    .replaceAll("Ã©", "é")
    .replaceAll("Ã­", "í")
    .replaceAll("Ã³", "ó")
    .replaceAll("Ãº", "ú")
    .replaceAll("Ã±", "ñ")
    .replaceAll("Ã¨", "è");
}

function renderSharePage({ title, description, shareUrl, imageUrl, appUrl }) {
  const cleanTitle = cleanShareText(title);
  const cleanDescription = cleanShareText(description);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(cleanTitle)}</title>
  <meta name="description" content="${escapeHtml(cleanDescription)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(cleanTitle)}" />
  <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:alt" content="${escapeHtml(cleanTitle)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(cleanTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(cleanTitle)}" />
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
  const redirects = [];
  ensureCleanShareRoot();

  for (const module of OH_OPAVERSE_MODULES) {
    const song = module.data;
    const songSlug = song.slug || normalizeShareToken(song.title) || song.id;
    const songTitle = String(song.title || "OpaHiFi").trim();
    const songSharePath = `/s/${encodeURIComponent(songSlug)}`;

    writePage(songSharePath, renderSharePage({
      title: songTitle,
      description: `Listen to ${songTitle} by OpaHiFi.`,
      shareUrl: new URL(songSharePath, SITE_ORIGIN).toString(),
      imageUrl: toAbsoluteAssetUrl(song.assets?.cover || song.assets?.art),
      appUrl: getAppUrl(song)
    }));
    redirects.push(`${songSharePath} ${songSharePath}/index.html 200`);

    for (const version of song.versions || []) {
      const versionToken = getVersionToken(version);
      if (!versionToken) continue;

      const versionTitle = isOriginalVersion(version) ? songTitle : `${songTitle} (${version.name})`;
      const versionSharePath = `/s/${encodeURIComponent(songSlug)}/${encodeURIComponent(versionToken)}`;

      writePage(versionSharePath, renderSharePage({
        title: versionTitle,
        description: `Listen to ${versionTitle} by OpaHiFi.`,
        shareUrl: new URL(versionSharePath, SITE_ORIGIN).toString(),
        imageUrl: toAbsoluteAssetUrl(version.cover || version.art || song.assets?.cover || song.assets?.art),
        appUrl: getAppUrl(song, version)
      }));
      redirects.push(`${versionSharePath} ${versionSharePath}/index.html 200`);
    }
  }

  fs.writeFileSync(REDIRECTS_PATH, `${redirects.join("\n")}\n`, "utf8");
}

generate();
