/**
 * Download page copy + asset data — single bilingual source for both locales.
 *
 * Every product fact / URL traces to the v1.5.1 GitHub release (Rust + Tauri 2
 * rewrite): the Windows NSIS installer and the portable standalone exe. The
 * Linux tarball is the legacy Python v1.2.7 build, kept as a fallback until a
 * native Linux build ships. The installer is NOT code-signed yet.
 *
 * Spanish is neutral/professional (no Rioplatense slang in artifacts).
 */

import type { Locale } from "../routes";

/** Base for every v1.5.1 release asset (verified: both .exe resolve HTTP 200). */
export const RELEASE_BASE =
  "https://github.com/plynte-labs/LiveAudio/releases/download/v1.5.1";
/** Release notes page for v1.5.1 (hashes + changelog live here). */
export const RELEASE_TAG =
  "https://github.com/plynte-labs/LiveAudio/releases/tag/v1.5.1";
/** Legacy Python build line (v1.2.7) — Linux fallback only. */
export const LEGACY_RELEASE_BASE =
  "https://github.com/plynte-labs/LiveAudio/releases/download/v1.2.7";
/** Always-latest redirect (from the product spec). */
export const RELEASE_LATEST =
  "https://github.com/plynte-labs/LiveAudio/releases/latest";

/** The two OS codes the page can detect / toggle between. */
export type Os = "windows" | "linux";

/**
 * A primary, platform-matched download (the giant CTA targets). Both render
 * server-side; OS detection only re-orders / relabels them.
 */
export interface PrimaryAsset {
  os: Os;
  /** Real filename of the released artifact. */
  filename: string;
  /** Direct download URL (RELEASE_BASE + filename). */
  url: string;
  /** Human size string, verbatim from the product spec. */
  size: string;
}

export const PRIMARY_ASSETS: Record<Os, PrimaryAsset> = {
  windows: {
    os: "windows",
    filename: "LiveAudio_1.5.1_x64-setup.exe",
    url: `${RELEASE_BASE}/LiveAudio_1.5.1_x64-setup.exe`,
    size: "~26.2 MB",
  },
  linux: {
    os: "linux",
    filename: "LiveAudio-1.2.7-linux-x64.tar.gz",
    url: `${LEGACY_RELEASE_BASE}/LiveAudio-1.2.7-linux-x64.tar.gz`,
    size: "46,351,037 bytes (46.35 MB)",
  },
};

/** Portable standalone exe (no install) — second Windows option. */
export const PORTABLE_ASSET = {
  filename: "liveaudio-desktop.exe",
  url: `${RELEASE_BASE}/liveaudio-desktop.exe`,
  size: "~16.2 MB",
};

/** A row in the brutalist "all assets" table. */
export interface AssetRow {
  filename: string;
  url: string;
  size: string;
  /** Mono platform/use tag (already localized in the copy decks below). */
  use: string;
}

/* ---------- Localized copy ---------- */

export interface DownloadCopy {
  /** <title> + meta description (SEO). */
  title: string;
  description: string;

  /** Console block. */
  consoleEyebrow: string;
  heading: string;
  subheading: string;
  detecting: string;
  detectedPrefix: string; // "Detected:" / "Detectado:"
  recommendedTag: string; // "recommended" / "recomendado"
  toggleLabel: string; // a11y group label for the manual OS switch
  windowsLabel: string;
  linuxLabel: string;
  downloadVerb: string; // verb used inside the giant CTA label
  latestLinkLabel: string; // "Always-latest release →"
  portableLabel: string; // label for the portable standalone exe link
  portableHint: string; // one-line hint: no install needed
  legacyNote: string; // honest flag: Linux build is still the legacy v1.2.7

  /** Asset table. */
  tableEyebrow: string;
  tableHeading: string;
  thAsset: string;
  thUse: string;
  thSize: string;
  thGet: string;
  getLabel: string; // mono "get" link label
  assets: AssetRow[];

  /** Operator notes (amber module). */
  notesEyebrow: string;
  notesHeading: string;
  notes: { tag: string; title: string; body: string }[];

  /** Requirements (mono two-col). */
  reqEyebrow: string;
  reqHeading: string;
  reqCols: { heading: string; rows: { k: string; v: string }[] }[];

  /** Closing Download module (the Download CTA is the hero of every page). */
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
}

const EN: DownloadCopy = {
  title: "Download LiveAudio v1.5.1 — Windows x64 Rust build (free)",
  description:
    "Download LiveAudio v1.5.1 free for Windows x64. Rewritten in Rust + Tauri 2: faster startup, lower footprint, memory-safe — no Python runtime. Windows installer + portable exe. 100% local, MIT open-source.",

  consoleEyebrow: "// download · v1.5.1 · rust + tauri 2",
  heading: "Download LiveAudio v1.5.1.",
  subheading:
    "Free & open-source (MIT). Rewritten in Rust with a Tauri 2 desktop shell: faster startup, lower RAM, and memory-safe transcription — with no Python runtime to provision. Windows x64 below; Linux users stay on the legacy v1.2.7 build for now.",
  detecting: "Detecting OS…",
  detectedPrefix: "Detected:",
  recommendedTag: "recommended",
  toggleLabel: "Choose your operating system",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Download",
  latestLinkLabel: "Always-latest release",
  portableLabel: "Portable standalone (no install)",
  portableHint: "liveaudio-desktop.exe · ~16.2 MB · just run it",
  legacyNote:
    "v1.5.1 is Windows x64. The Linux build below is the legacy Python v1.2.7.",

  tableEyebrow: "// all v1.5.1 assets",
  tableHeading: "Every release artifact, with exact URLs.",
  thAsset: "asset",
  thUse: "platform / use",
  thSize: "size",
  thGet: "get",
  getLabel: "get",
  assets: [
    {
      filename: "LiveAudio_1.5.1_x64-setup.exe",
      url: `${RELEASE_BASE}/LiveAudio_1.5.1_x64-setup.exe`,
      size: "~26.2 MB",
      use: "Windows x64 installer (primary) — NSIS, bilingual, removes legacy Python builds",
    },
    {
      filename: "liveaudio-desktop.exe",
      url: `${RELEASE_BASE}/liveaudio-desktop.exe`,
      size: "~16.2 MB",
      use: "Windows x64 portable — standalone, no install, just run it",
    },
    {
      filename: "LiveAudio-1.2.7-linux-x64.tar.gz",
      url: `${LEGACY_RELEASE_BASE}/LiveAudio-1.2.7-linux-x64.tar.gz`,
      size: "46,351,037 bytes (46.35 MB)",
      use: "Linux x86_64 legacy (Python v1.2.7) — extract, run ./liveaudio-launcher (needs libportaudio2)",
    },
    {
      filename: "v1.5.1 release notes",
      url: RELEASE_TAG,
      size: "—",
      use: "changelog, hashes and source for v1.5.1",
    },
  ],

  notesEyebrow: "// operator notes",
  notesHeading: "Read before you run.",
  notes: [
    {
      tag: "not code-signed",
      title: "Windows SmartScreen",
      body: "The v1.5.1 installer is not code-signed yet, so SmartScreen may warn. Click More info, then Run anyway. The exact files and hashes are listed on the v1.5.1 release page.",
    },
    {
      tag: "migration",
      title: "Upgrading from the Python version",
      body: "Coming from v1.0.0–v1.2.7? The installer finds the legacy Python build (32/64-bit registry), runs its uninstaller silently, stops leftover processes and removes the obsolete Python folders. Your settings and sessions in %APPDATA%\\LiveAudio are preserved.",
    },
    {
      tag: "rust",
      title: "Why Rust is safer to download",
      body: "v1.5.1 is a native binary — there is no Python runtime, no pip dependency chain and no multi-gigabyte first-run provisioning. The installer (~26.2 MB) is the whole app; only transcription models download on first use.",
    },
    {
      tag: "updates",
      title: "Updates",
      body: "Update in one click from inside the app. New releases are published on GitHub Releases.",
    },
  ],

  reqEyebrow: "// system requirements",
  reqHeading: "What you need to run it.",
  reqCols: [
    {
      heading: "minimum",
      rows: [
        { k: "os", v: "Windows 10/11 x64 (v1.5.1); Linux x86_64 legacy v1.2.7" },
        { k: "gpu", v: "optional — CPU works" },
        { k: "ram", v: "8 GB (16 GB recommended)" },
        { k: "disk", v: "installer ~26.2 MB + transcription models" },
        { k: "internet", v: "first run only, then fully offline" },
      ],
    },
    {
      heading: "cuda (optional)",
      rows: [
        { k: "vendor", v: "NVIDIA CUDA, auto-detected" },
        { k: "driver", v: ">= 525" },
        { k: "vram", v: ">= 4 GiB" },
        { k: "python", v: "not needed — v1.5.1 is a native Rust binary" },
        { k: "linux dep", v: "libportaudio2 (sudo apt install libportaudio2)" },
      ],
    },
  ],

  closingEyebrow: "// get started",
  closingHeading: "Free, local, and yours in one download.",
  closingBody:
    "No account, no API key, no per-minute cost. Grab the build above, run it, and your captions stream to OBS over a local WebSocket — fully offline after the first run.",
  download: "Download LiveAudio v1.5.1 (free)",
};

const ES: DownloadCopy = {
  title: "Descargar LiveAudio v1.5.1 — Windows x64 build Rust (gratis)",
  description:
    "Descarga LiveAudio v1.5.1 gratis para Windows x64. Reescrito en Rust + Tauri 2: arranque más rápido, menor huella, transcripción con memoria segura — sin runtime de Python. Instalador de Windows + portable. 100% local, código abierto MIT.",

  consoleEyebrow: "// descargar · v1.5.1 · rust + tauri 2",
  heading: "Descargar LiveAudio v1.5.1.",
  subheading:
    "Gratis y de código abierto (MIT). Reescrito en Rust con interfaz Tauri 2: arranque más rápido, menos RAM y transcripción con memoria segura — sin runtime de Python por provisionar. Windows x64 abajo; en Linux sigue la versión heredada v1.2.7 por ahora.",
  detecting: "Detectando SO…",
  detectedPrefix: "Detectado:",
  recommendedTag: "recomendado",
  toggleLabel: "Elige tu sistema operativo",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Descargar",
  latestLinkLabel: "Versión siempre más reciente",
  portableLabel: "Portable standalone (sin instalar)",
  portableHint: "liveaudio-desktop.exe · ~16.2 MB · solo ejecútalo",
  legacyNote:
    "La v1.5.1 es Windows x64. La versión de Linux abajo es la heredada Python v1.2.7.",

  tableEyebrow: "// todos los assets v1.5.1",
  tableHeading: "Cada artefacto del release, con URLs exactas.",
  thAsset: "asset",
  thUse: "plataforma / uso",
  thSize: "tamaño",
  thGet: "obtener",
  getLabel: "obtener",
  assets: [
    {
      filename: "LiveAudio_1.5.1_x64-setup.exe",
      url: `${RELEASE_BASE}/LiveAudio_1.5.1_x64-setup.exe`,
      size: "~26.2 MB",
      use: "Instalador de Windows x64 (primario) — NSIS, bilingüe, elimina versiones Python heredadas",
    },
    {
      filename: "liveaudio-desktop.exe",
      url: `${RELEASE_BASE}/liveaudio-desktop.exe`,
      size: "~16.2 MB",
      use: "Portable de Windows x64 — standalone, sin instalación, solo ejecútalo",
    },
    {
      filename: "LiveAudio-1.2.7-linux-x64.tar.gz",
      url: `${LEGACY_RELEASE_BASE}/LiveAudio-1.2.7-linux-x64.tar.gz`,
      size: "46,351,037 bytes (46.35 MB)",
      use: "Linux x86_64 heredado (Python v1.2.7) — extrae y ejecuta ./liveaudio-launcher (necesita libportaudio2)",
    },
    {
      filename: "notas de la versión v1.5.1",
      url: RELEASE_TAG,
      size: "—",
      use: "changelog, hashes y código fuente de v1.5.1",
    },
  ],

  notesEyebrow: "// notas de operación",
  notesHeading: "Lee antes de ejecutar.",
  notes: [
    {
      tag: "sin firma de código",
      title: "SmartScreen de Windows",
      body: "El instalador v1.5.1 aún no está firmado digitalmente, así que SmartScreen puede advertir. Haz clic en Más información y luego en Ejecutar de todas formas. Los archivos exactos y sus hashes están en la página del release v1.5.1.",
    },
    {
      tag: "migración",
      title: "Si vienes de la versión Python",
      body: "¿Vienes de v1.0.0–v1.2.7? El instalador encuentra la versión Python heredada (registro de 32/64 bits), ejecuta su desinstalador en silencio, detiene procesos restantes y elimina las carpetas Python obsoletas. Tu configuración y sesiones en %APPDATA%\\LiveAudio se conservan.",
    },
    {
      tag: "rust",
      title: "Por qué Rust es más seguro de descargar",
      body: "La v1.5.1 es un binario nativo — no hay runtime de Python, ni cadena de dependencias pip, ni provisión multi-gigabyte en el primer arranque. El instalador (~26.2 MB) es la app completa; solo los modelos de transcripción se descargan en el primer uso.",
    },
    {
      tag: "actualizaciones",
      title: "Actualizaciones",
      body: "Actualiza con un clic desde la app. Las versiones nuevas se publican en GitHub Releases.",
    },
  ],

  reqEyebrow: "// requisitos del sistema",
  reqHeading: "Lo que necesitas para ejecutarlo.",
  reqCols: [
    {
      heading: "mínimo",
      rows: [
        { k: "so", v: "Windows 10/11 x64 (v1.5.1); Linux x86_64 heredado v1.2.7" },
        { k: "gpu", v: "opcional — la CPU funciona" },
        { k: "ram", v: "8 GB (16 GB recomendado)" },
        { k: "disco", v: "instalador ~26.2 MB + modelos de transcripción" },
        { k: "internet", v: "solo la primera vez, luego sin conexión" },
      ],
    },
    {
      heading: "cuda (opcional)",
      rows: [
        { k: "fabricante", v: "NVIDIA CUDA, autodetectado" },
        { k: "driver", v: ">= 525" },
        { k: "vram", v: ">= 4 GiB" },
        { k: "python", v: "no necesario — v1.5.1 es un binario Rust nativo" },
        { k: "dep linux", v: "libportaudio2 (sudo apt install libportaudio2)" },
      ],
    },
  ],

  closingEyebrow: "// empezar",
  closingHeading: "Gratis, local y tuyo en una sola descarga.",
  closingBody:
    "Sin cuenta, sin API key, sin costo por minuto. Descarga la versión de arriba, ejecútala y tus subtítulos van a OBS por un WebSocket local — sin conexión después de la primera ejecución.",
  download: "Descargar LiveAudio v1.5.1 (gratis)",
};

export function downloadCopy(lang: Locale): DownloadCopy {
  return lang === "es" ? ES : EN;
}
