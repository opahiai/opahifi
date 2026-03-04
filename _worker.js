// _worker.js (Cloudflare Pages Advanced Mode)

const SHARE = {
    "old-love-story": {
        title: "Old Love Story",
        imagePath: "/img/music/main_oldlovestory.png",
        description: "Listen to Old Love Story by OpaHiFi."
    },
    "opa-pa-pa-party": {
        title: "Opa pa pa party",
        imagePath: "/img/music/main_oparty.png",
        description: "Listen to Opa pa pa party by OpaHiFi."
    },
    "glittaa-phoenix": {
        title: "Glittaa Phoenix",
        imagePath: "/img/music/main_glitta.png",
        description: "Listen to Glittaa Phoenix by OpaHiFi."
    },
    "splenda-love-rabbit-hell": {
        title: "Splenda Love Rabbit Hell",
        imagePath: "/img/music/main_splenda_rabbit.png",
        description: "Listen to Splenda Love Rabbit Hell by OpaHiFi."
    },
    "believe-the-truth-fairy": {
        title: "Believe the Truth Fairy",
        imagePath: "/img/music/main_truthfairy.png",
        description: "Listen to Believe the Truth Fairy by OpaHiFi."
    }
    ,
    "full-mindness": {
        title: "Full-Mindness (Opa Mayhem Mix)",
        imagePath: "/img/music/main_full_mindness.png",
        description: "Listen to Full-Mindness by OpaHiFi."
    }
};

function esc(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Share landing: /s/<groupKey>[/<singleToken>]
        if (url.pathname.startsWith("/s/")) {
            const rawPath = url.pathname.slice(3);
            const pathParts = rawPath.split("/").filter(Boolean);
            let key = "";
            let singleToken = "";
            try {
                key = decodeURIComponent(pathParts[0] || "").replaceAll("/", "").trim();
            } catch {
                key = "";
            }
            try {
                singleToken = decodeURIComponent(pathParts[1] || "").replaceAll("/", "").trim();
            } catch {
                singleToken = "";
            }
            // Backwards compatibility for existing query-param share links.
            if (!singleToken) singleToken = (url.searchParams.get("pl3s") || "").trim();
            const meta = SHARE[key] || {
                title: "OpaHiFi",
                imagePath: "/img/music/opahiai_album.png",
                description: "OpaHiFi music."
            };

            const sharePath = singleToken
                ? `/s/${encodeURIComponent(key)}/${encodeURIComponent(singleToken)}`
                : `/s/${encodeURIComponent(key)}`;
            const shareUrl = new URL(sharePath, url.origin);
            const imageUrl = new URL(meta.imagePath, url.origin).toString();

            // Your app expects ?pl3=<key> to open the modal
            const appUrl = new URL(url.origin + "/");
            if (key) appUrl.searchParams.set("pl3", key);
            if (singleToken) appUrl.searchParams.set("pl3s", singleToken);

            const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.description)}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(meta.title)}" />
  <meta property="og:description" content="${esc(meta.description)}" />
  <meta property="og:url" content="${esc(shareUrl.toString())}" />
  <meta property="og:image" content="${esc(imageUrl)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(meta.title)}" />
  <meta name="twitter:description" content="${esc(meta.description)}" />
  <meta name="twitter:image" content="${esc(imageUrl)}" />
</head>
<body>
  <p>Opening…</p>
  <p><a href="${esc(appUrl.toString())}">Continue</a></p>
  <script>
    // JS redirect so crawlers still read OG tags (they don’t run JS)
    location.replace(${JSON.stringify(appUrl.toString())});
  </script>
</body>
</html>`;

            return new Response(html, {
                headers: {
                    "content-type": "text/html; charset=utf-8",
                    "cache-control": "public, max-age=600"
                }
            });
        }

        // Everything else = your normal static site
        return env.ASSETS.fetch(request);
    }
};
