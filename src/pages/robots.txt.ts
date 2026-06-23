import type { APIRoute } from "astro";

/**
 * robots.txt — crawl/agent policy for LiveAudio v1.2.0.
 *
 * Static endpoint (export GET). Allow-all baseline plus an explicit Allow for
 * the AI/GEO crawlers we want indexing the citation surfaces (llms.txt, docs,
 * faq). Sitemap points at the @astrojs/sitemap index.
 *
 * Resolved decision (the product spec): allow-all + explicitly welcome GPTBot,
 * PerplexityBot, Google-Extended.
 */
export const GET: APIRoute = ({ site }) => {
  // `site` is set in astro.config.mjs → https://liveaudio.opencohost.com
  const sitemap = new URL("sitemap-index.xml", site).href;

  const body = [
    "# https://liveaudio.opencohost.com — LiveAudio v1.2.0",
    "# Free, open-source (MIT) real-time local Whisper captions for OBS.",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# AI / GEO crawlers — explicitly welcome",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    `Sitemap: ${sitemap}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
