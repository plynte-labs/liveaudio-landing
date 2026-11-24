/**
 * Shared CHROME strings only — nav labels, footer columns, common buttons,
 * skip link, language names. Page-specific marketing copy lives with each page,
 * NOT here. All strings traceable to the product spec.
 *
 * Spanish is neutral/professional (no regional slang in artifacts).
 */

import type { Locale } from "./routes";
import { LIVEAUDIO_TAG } from "../config/release";

export const ui = {
  en: {
    // Skip link / a11y
    "a11y.skipToContent": "Skip to content",

    // Nav labels
    "nav.home": "Home",
    "nav.productTour": "Product Tour",
    "nav.download": "Download",
    "nav.gettingStarted": "Getting Started",
    "nav.obsSetup": "OBS Setup",
    "nav.docs": "Docs",
    "nav.faq": "FAQ",
    "nav.vs": "Compare",
    "nav.menu": "Menu",
    "nav.closeMenu": "Close menu",
    "nav.openMenu": "Open menu",

    // Common buttons / CTAs (chrome-level; page heroes own their own copy)
    "cta.download": `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
    "cta.github": "GitHub",
    "cta.x": "X (@franguhh) — bug reports & collabs",
    "cta.xShort": "X · @franguhh",
    "cta.copy": "Copy",
    "cta.copied": "copied",

    // Brand / version
    "brand.name": "LiveAudio",
    "brand.version": LIVEAUDIO_TAG,
    "brand.versionLinkLabel": `View LiveAudio ${LIVEAUDIO_TAG} release`,

    // Footer columns
    "footer.tagline": "100% local · Zero data collected · MIT open-source",
    "footer.colProduct": "Product",
    "footer.colDocs": "Docs",
    "footer.colResources": "Resources",
    "footer.resources.github": "GitHub",
    "footer.resources.releases": "Releases",
    "footer.resources.llms": "llms.txt",
    "footer.resources.checksums": "SHA256SUMS",
    "footer.legal": `© Plynte · LiveAudio ${LIVEAUDIO_TAG} · MIT · Windows x64 & Linux x86_64 · Rust`,
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",

    // Language toggle
    "lang.en": "EN",
    "lang.es": "ES",
    "lang.switchTo": "Español",
    "lang.label": "Language",
  },
  es: {
    // Skip link / a11y
    "a11y.skipToContent": "Saltar al contenido",

    // Nav labels
    "nav.home": "Inicio",
    "nav.productTour": "Tour del producto",
    "nav.download": "Descargar",
    "nav.gettingStarted": "Primeros pasos",
    "nav.obsSetup": "Configurar OBS",
    "nav.docs": "Documentación",
    "nav.faq": "Preguntas frecuentes",
    "nav.vs": "Comparativa",
    "nav.menu": "Menú",
    "nav.closeMenu": "Cerrar menú",
    "nav.openMenu": "Abrir menú",

    // Common buttons / CTAs
    "cta.download": `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
    "cta.github": "GitHub",
    "cta.x": "X (@franguhh) — reportes y colaboraciones",
    "cta.xShort": "X · @franguhh",
    "cta.copy": "Copiar",
    "cta.copied": "copiado",

    // Brand / version
    "brand.name": "LiveAudio",
    "brand.version": LIVEAUDIO_TAG,
    "brand.versionLinkLabel": `Ver versión de LiveAudio ${LIVEAUDIO_TAG}`,

    // Footer columns
    "footer.tagline": "100% local · Sin recolección de datos · Código abierto MIT",
    "footer.colProduct": "Producto",
    "footer.colDocs": "Documentación",
    "footer.colResources": "Recursos",
    "footer.resources.github": "GitHub",
    "footer.resources.releases": "Versiones",
    "footer.resources.llms": "llms.txt",
    "footer.resources.checksums": "SHA256SUMS",
    "footer.legal": `© Plynte · LiveAudio ${LIVEAUDIO_TAG} · MIT · Windows x64 y Linux x86_64 · Rust`,
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos del Servicio",

    // Language toggle
    "lang.en": "EN",
    "lang.es": "ES",
    "lang.switchTo": "English",
    "lang.label": "Idioma",
  },
} as const;

/** Keys are shared across locales; derive the union from the EN table. */
export type UIKey = keyof (typeof ui)["en"];

/**
 * Returns a translator bound to `lang`. Falls back to the English string if a
 * key is somehow missing from a locale table (it never should be — the type
 * keeps them in sync).
 */
export function t(lang: Locale): (key: UIKey) => string {
  const table = ui[lang];
  return (key: UIKey): string => table[key] ?? ui.en[key];
}
