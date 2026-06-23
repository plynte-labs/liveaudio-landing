/**
 * Shared CHROME strings only — nav labels, footer columns, common buttons,
 * skip link, language names. Page-specific marketing copy lives with each page,
 * NOT here. All strings traceable to the product spec.
 *
 * Spanish is neutral/professional (no Rioplatense slang in artifacts).
 */

import type { Locale } from "./routes";

export const ui = {
  en: {
    // Skip link / a11y
    "a11y.skipToContent": "Skip to content",

    // Nav labels (mono lowercase links in the header)
    "nav.download": "download",
    "nav.gettingStarted": "getting-started",
    "nav.obsSetup": "obs-setup",
    "nav.docs": "docs",
    "nav.faq": "faq",
    "nav.vs": "vs",
    "nav.menu": "Menu",
    "nav.closeMenu": "Close menu",
    "nav.openMenu": "Open menu",

    // Common buttons / CTAs (chrome-level; page heroes own their own copy)
    "cta.download": "Download LiveAudio v1.2.0 (free)",
    "cta.github": "GitHub",
    "cta.copy": "Copy",
    "cta.copied": "copied",

    // Brand / version
    "brand.name": "LiveAudio",
    "brand.version": "v1.2.0",

    // Footer columns
    "footer.tagline": "100% local · MIT open-source",
    "footer.colProduct": "Product",
    "footer.colDocs": "Docs",
    "footer.colResources": "Resources",
    "footer.resources.github": "GitHub",
    "footer.resources.releases": "Releases",
    "footer.resources.llms": "llms.txt",
    "footer.resources.checksums": "SHA256SUMS",
    "footer.legal": "© Plynte · LiveAudio v1.2.0 · MIT · Windows + Linux",

    // Language toggle
    "lang.en": "EN",
    "lang.es": "ES",
    "lang.switchTo": "Español",
    "lang.label": "Language",
  },
  es: {
    // Skip link / a11y
    "a11y.skipToContent": "Saltar al contenido",

    // Nav labels (mono lowercase links in the header)
    "nav.download": "descargar",
    "nav.gettingStarted": "primeros-pasos",
    "nav.obsSetup": "configurar-obs",
    "nav.docs": "docs",
    "nav.faq": "faq",
    "nav.vs": "comparativa",
    "nav.menu": "Menú",
    "nav.closeMenu": "Cerrar menú",
    "nav.openMenu": "Abrir menú",

    // Common buttons / CTAs
    "cta.download": "Descargar LiveAudio v1.2.0 (gratis)",
    "cta.github": "GitHub",
    "cta.copy": "Copiar",
    "cta.copied": "copiado",

    // Brand / version
    "brand.name": "LiveAudio",
    "brand.version": "v1.2.0",

    // Footer columns
    "footer.tagline": "100% local · Código abierto MIT",
    "footer.colProduct": "Producto",
    "footer.colDocs": "Docs",
    "footer.colResources": "Recursos",
    "footer.resources.github": "GitHub",
    "footer.resources.releases": "Versiones",
    "footer.resources.llms": "llms.txt",
    "footer.resources.checksums": "SHA256SUMS",
    "footer.legal": "© Plynte · LiveAudio v1.2.0 · MIT · Windows + Linux",

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
