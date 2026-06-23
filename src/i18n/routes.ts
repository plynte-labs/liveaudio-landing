/**
 * i18n routing helpers — LiveAudio v1.2.0
 *
 * EN is the default locale served at `/` (no prefix). ES is mirrored under
 * `/es/`. `trailingSlash: "always"` in astro.config.mjs, so every URL these
 * helpers emit ends with a single trailing slash.
 *
 * Path inputs are normalized: a leading/trailing slash on `path` is optional.
 *   localizedPath("en", "download")  -> "/download/"
 *   localizedPath("es", "/download/") -> "/es/download/"
 *   localizedPath("en", "")          -> "/"
 *   localizedPath("es", "/")         -> "/es/"
 */

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Strip leading/trailing slashes and collapse to a clean path segment list. */
function normalizeSegment(path: string): string {
  return path.replace(/^\/+/, "").replace(/\/+$/, "");
}

/**
 * Build a locale-aware, trailing-slash URL for a logical page path.
 * EN -> `/segment/`. ES -> `/es/segment/`. Empty path -> locale root.
 */
export function localizedPath(lang: Locale, path: string): string {
  const segment = normalizeSegment(path);
  const prefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  if (segment === "") {
    return prefix === "" ? "/" : `${prefix}/`;
  }
  return `${prefix}/${segment}/`;
}

/**
 * Given the current path (any locale), return the equivalent URL in the OTHER
 * locale. Used for the hreflang alternate + the language toggle.
 *   altLangPath("en", "/download/")    -> "/es/download/"
 *   altLangPath("es", "/es/download/") -> "/download/"
 *   altLangPath("en", "/")             -> "/es/"
 *   altLangPath("es", "/es/")          -> "/"
 */
export function altLangPath(lang: Locale, currentPath: string): string {
  const other: Locale = lang === DEFAULT_LOCALE ? "es" : DEFAULT_LOCALE;
  let segment = normalizeSegment(currentPath);

  // If the current path carries the current locale prefix, drop it so we get
  // the bare logical path before re-localizing into the other locale.
  if (lang !== DEFAULT_LOCALE && segment === lang) {
    segment = "";
  } else if (lang !== DEFAULT_LOCALE && segment.startsWith(`${lang}/`)) {
    segment = segment.slice(lang.length + 1);
  }

  return localizedPath(other, segment);
}
