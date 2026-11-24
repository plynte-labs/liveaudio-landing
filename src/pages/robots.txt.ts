import type { APIRoute } from "astro";
import { LIVEAUDIO_TAG } from "../config/release";

/**
 * robots.txt — crawl/agent policy for LiveAudio.
 *
 * Static endpoint (export GET). Allow-all baseline plus an explicit Allow for
 * AI/GEO crawlers indexing citation surfaces (llms.txt, docs, faq).
 */
export const GET: APIRoute = ({ site }) => {
  // `site` is set in astro.config.mjs -> https://liveaudio.opencohost.com
  const sitemap = new URL("sitemap-index.xml", site).href;

  const body = [
    `# https://liveaudio.opencohost.com — LiveAudio ${LIVEAUDIO_TAG}`,
    "# Free, open-source (MIT) real-time local captions (NVIDIA Parakeet-TDT & Whisper) for OBS.",
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
