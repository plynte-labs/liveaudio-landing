/**
 * Download page copy + asset data — single bilingual source for both locales.
 *
 * Every product fact / URL traces to the v1.5.1 GitHub release (Rust + Tauri 2
 * rewrite): the Windows NSIS installer and the incomplete desktop exe. The
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

/** Desktop executable only; it does not include the CLI or resources. */
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
  portableLabel: string; // label for the separate desktop executable link
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
    "Download the official LiveAudio v1.5.1 Windows x64 installer for local transcription. Free and open-source, with Rust, Tauri and a Python inference worker.",

  consoleEyebrow: "// download · v1.5.1 · rust + tauri 2",
  heading: "Download LiveAudio v1.5.1.",
  subheading:
    "Free and open-source (MIT). LiveAudio combines Rust and Tauri with a Python inference worker. Use the Windows x64 installer below; Linux has a legacy v1.2.7 build.",
  detecting: "Detecting OS…",
  detectedPrefix: "Detected:",
  recommendedTag: "recommended",
  toggleLabel: "Choose your operating system",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Download",
  latestLinkLabel: "Always-latest release",
  portableLabel: "Desktop executable (incomplete)",
  portableHint: "liveaudio-desktop.exe · ~16.2 MB · lacks CLI and resources; use the installer",
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
      use: "Windows desktop executable only — lacks CLI and resources; use the installer",
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
      body: "Before upgrading from a legacy version, back up your settings and sessions and consult the release notes for installation guidance.",
    },
    {
      tag: "rust",
      title: "Runtime and model downloads",
      body: "The installer download is approximately 26.2 MB. The Python inference worker, its dependencies and transcription models require additional storage and may require internet to provision or download.",
    },
    {
      tag: "updates",
      title: "Updates",
      body: "New releases and publisher hashes are available on GitHub Releases. Back up settings and sessions before upgrading.",
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
        { k: "disk", v: "installer ~26.2 MB plus runtime, dependencies and models" },
        { k: "internet", v: "may be needed for setup and model downloads" },
      ],
    },
    {
      heading: "cuda (optional)",
      rows: [
        { k: "vendor", v: "NVIDIA CUDA, auto-detected" },
        { k: "driver", v: ">= 525" },
        { k: "vram", v: ">= 4 GiB" },
        { k: "runtime", v: "Python inference worker; CUDA also needs runtime libraries" },
        { k: "linux dep", v: "libportaudio2 (sudo apt install libportaudio2)" },
      ],
    },
  ],

  closingEyebrow: "// get started",
  closingHeading: "Free, local, and yours in one download.",
  closingBody:
    "No account, API key or per-minute cost for local transcription. Download the installer and connect OBS through the local overlay.",
  download: "Download LiveAudio v1.5.1 (free)",
};

const ES: DownloadCopy = {
  title: "Descargar LiveAudio v1.5.1 — Windows x64 build Rust (gratis)",
  description:
    "Descarga el instalador oficial de LiveAudio v1.5.1 para Windows x64 y transcribe localmente. Gratis y de código abierto, con Rust, Tauri y un worker de inferencia Python.",

  consoleEyebrow: "// descargar · v1.5.1 · rust + tauri 2",
  heading: "Descargar LiveAudio v1.5.1.",
  subheading:
    "Gratis y de código abierto (MIT). LiveAudio combina Rust y Tauri con un worker de inferencia Python. Usa el instalador de Windows x64; Linux tiene una versión heredada v1.2.7.",
  detecting: "Detectando SO…",
  detectedPrefix: "Detectado:",
  recommendedTag: "recomendado",
  toggleLabel: "Elige tu sistema operativo",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Descargar",
  latestLinkLabel: "Versión siempre más reciente",
  portableLabel: "Ejecutable de escritorio (incompleto)",
  portableHint: "liveaudio-desktop.exe · ~16.2 MB · no incluye CLI ni recursos; usa el instalador",
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
      use: "Solo ejecutable de escritorio — sin CLI ni recursos; usa el instalador",
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
      body: "Antes de actualizar desde una versión heredada, respalda tu configuración y sesiones y consulta las notas de la versión para obtener instrucciones de instalación.",
    },
    {
      tag: "rust",
      title: "Descargas del runtime y los modelos",
      body: "La descarga del instalador ocupa aproximadamente 26.2 MB. El worker de inferencia Python, sus dependencias y los modelos requieren almacenamiento adicional y pueden necesitar internet para prepararse o descargarse.",
    },
    {
      tag: "actualizaciones",
      title: "Actualizaciones",
      body: "Las versiones nuevas y los hashes publicados están en GitHub Releases. Respalda la configuración y las sesiones antes de actualizar.",
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
        { k: "disco", v: "instalador ~26.2 MB más runtime, dependencias y modelos" },
        { k: "internet", v: "puede requerirse para configurar y descargar modelos" },
      ],
    },
    {
      heading: "cuda (opcional)",
      rows: [
        { k: "fabricante", v: "NVIDIA CUDA, autodetectado" },
        { k: "driver", v: ">= 525" },
        { k: "vram", v: ">= 4 GiB" },
        { k: "runtime", v: "worker de inferencia Python; CUDA también necesita bibliotecas" },
        { k: "dep linux", v: "libportaudio2 (sudo apt install libportaudio2)" },
      ],
    },
  ],

  closingEyebrow: "// empezar",
  closingHeading: "Gratis, local y tuyo en una sola descarga.",
  closingBody:
    "Sin cuenta, clave API ni costo por minuto para transcribir localmente. Descarga el instalador y conecta OBS mediante el overlay local.",
  download: "Descargar LiveAudio v1.5.1 (gratis)",
};

export function downloadCopy(lang: Locale): DownloadCopy {
  return lang === "es" ? ES : EN;
}
