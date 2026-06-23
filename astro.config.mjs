// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// LiveAudio v1.2.0 — Astro 6 static build.
// i18n: EN default at `/`, ES mirror at `/es/`. Tailwind v4 via the Vite plugin
// (NOT @astrojs/tailwind, which is deprecated). React 19 islands.
export default defineConfig({
  site: "https://liveaudio.opencohost.com",
  output: "static",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
