/**
 * Download page copy + asset data — single bilingual source for both locales.
 *
 * Every product fact / URL / size traces to the product spec (real v1.2.5
 * assets, system requirements) and the operator notes (SmartScreen /
 * portable.marker / --update). Sizes and filenames are the REAL released
 * artifacts — never invent or round differently.
 *
 * Spanish is neutral/professional (no Rioplatense slang in artifacts).
 */

import type { Locale } from "../routes";

/** Base for every release asset (from the product spec). */
export const RELEASE_BASE =
  "https://github.com/plynte-labs/LiveAudio/releases/download/v1.2.5";
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
    filename: "LiveAudio-Setup-1.2.5.exe",
    url: `${RELEASE_BASE}/LiveAudio-Setup-1.2.5.exe`,
    size: "35,817,683 bytes (35.82 MB)",
  },
  linux: {
    os: "linux",
    filename: "LiveAudio-1.2.5-linux-x64.tar.gz",
    url: `${RELEASE_BASE}/LiveAudio-1.2.5-linux-x64.tar.gz`,
    size: "46,308,210 bytes (46.31 MB)",
  },
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
  title: "Download LiveAudio v1.2.5 — Windows & Linux (free)",
  description:
    "Download LiveAudio v1.2.5 free for Windows and Linux. Real v1.2.5 assets: Windows installer, Linux tarball, pip wheel, source, checksums. 100% local, MIT open-source.",

  consoleEyebrow: "// download · v1.2.5",
  heading: "Download LiveAudio v1.2.5.",
  subheading:
    "Free & open-source (MIT). No subscription, no API key. Pick your platform — both builds and every release asset are listed in full below.",
  detecting: "Detecting OS…",
  detectedPrefix: "Detected:",
  recommendedTag: "recommended",
  toggleLabel: "Choose your operating system",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Download",
  latestLinkLabel: "Always-latest release",

  tableEyebrow: "// all v1.2.5 assets",
  tableHeading: "Every release artifact, with exact URLs.",
  thAsset: "asset",
  thUse: "platform / use",
  thSize: "size",
  thGet: "get",
  getLabel: "get",
  assets: [
    {
      filename: "LiveAudio-Setup-1.2.5.exe",
      url: `${RELEASE_BASE}/LiveAudio-Setup-1.2.5.exe`,
      size: "35,817,683 bytes (35.82 MB)",
      use: "Windows installer (primary)",
    },
    {
      filename: "LiveAudio-1.2.5-linux-x64.tar.gz",
      url: `${RELEASE_BASE}/LiveAudio-1.2.5-linux-x64.tar.gz`,
      size: "46,308,210 bytes (46.31 MB)",
      use: "Linux x86_64 — extract, run ./liveaudio-launcher (needs libportaudio2)",
    },
    {
      filename: "liveaudio-1.2.5-py3-none-any.whl",
      url: `${RELEASE_BASE}/liveaudio-1.2.5-py3-none-any.whl`,
      size: "306,462 bytes (306.46 kB)",
      use: "pip wheel (advanced)",
    },
    {
      filename: "liveaudio-src-1.2.5.zip",
      url: `${RELEASE_BASE}/liveaudio-src-1.2.5.zip`,
      size: "360,586 bytes (360.59 kB)",
      use: "source",
    },
    {
      filename: "requirements-cpu.txt",
      url: `${RELEASE_BASE}/requirements-cpu.txt`,
      size: "—",
      use: "pip escape hatch (CPU)",
    },
    {
      filename: "requirements-cu121.txt",
      url: `${RELEASE_BASE}/requirements-cu121.txt`,
      size: "—",
      use: "pip escape hatch (CUDA 12.1)",
    },
    {
      filename: "SHA256SUMS.txt",
      url: `${RELEASE_BASE}/SHA256SUMS.txt`,
      size: "—",
      use: "verify your downloads",
    },
  ],

  notesEyebrow: "// operator notes",
  notesHeading: "Read before you run.",
  notes: [
    {
      tag: "not code-signed",
      title: "Windows SmartScreen",
      body: "The installer is not code-signed, so SmartScreen may warn. Click More info, then Run anyway. Optionally verify the file against SHA256SUMS.txt first.",
    },
    {
      tag: "verify",
      title: "Verify the download",
      body: "Check the file hash against SHA256SUMS.txt before running, especially on a shared or untrusted network.",
    },
    {
      tag: "portable",
      title: "Portable mode",
      body: "Create an empty file named portable.marker next to the launcher and LiveAudio stores everything in a local data/ folder instead of your user profile.",
    },
    {
      tag: "updates",
      title: "Updates",
      body: "Update in one click from inside the app, or run the launcher with --update to fetch the latest release.",
    },
  ],

  reqEyebrow: "// system requirements",
  reqHeading: "What you need to run it.",
  reqCols: [
    {
      heading: "minimum",
      rows: [
        { k: "os", v: "Windows 10/11 x64 or Linux x86_64" },
        { k: "gpu", v: "optional — CPU works" },
        { k: "ram", v: "8 GB (16 GB recommended)" },
        { k: "disk", v: "~400 MB CPU / ~2.5 GB CUDA + models" },
        { k: "internet", v: "first run only, then fully offline" },
      ],
    },
    {
      heading: "cuda (optional)",
      rows: [
        { k: "vendor", v: "NVIDIA CUDA, auto-detected" },
        { k: "driver", v: ">= 525" },
        { k: "vram", v: ">= 4 GiB" },
        { k: "python", v: "not required — installer provisions Python 3.11" },
        { k: "linux dep", v: "libportaudio2 (sudo apt install libportaudio2)" },
      ],
    },
  ],

  closingEyebrow: "// get started",
  closingHeading: "Free, local, and yours in one download.",
  closingBody:
    "No account, no API key, no per-minute cost. Grab the build above, run it, and your captions stream to OBS over a local WebSocket — fully offline after the first run.",
  download: "Download LiveAudio v1.2.5 (free)",
};

const ES: DownloadCopy = {
  title: "Descargar LiveAudio v1.2.5 — Windows y Linux (gratis)",
  description:
    "Descargá LiveAudio v1.2.5 gratis para Windows y Linux. Assets reales de v1.2.5: instalador de Windows, tarball de Linux, wheel pip, código fuente, checksums. 100% local, código abierto MIT.",

  consoleEyebrow: "// descargar · v1.2.5",
  heading: "Descargar LiveAudio v1.2.5.",
  subheading:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Elegí tu plataforma — ambas versiones y cada asset del release están listados por completo abajo.",
  detecting: "Detectando SO…",
  detectedPrefix: "Detectado:",
  recommendedTag: "recomendado",
  toggleLabel: "Elegí tu sistema operativo",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Descargar",
  latestLinkLabel: "Versión siempre más reciente",

  tableEyebrow: "// todos los assets v1.2.5",
  tableHeading: "Cada artefacto del release, con URLs exactas.",
  thAsset: "asset",
  thUse: "plataforma / uso",
  thSize: "tamaño",
  thGet: "obtener",
  getLabel: "obtener",
  assets: [
    {
      filename: "LiveAudio-Setup-1.2.5.exe",
      url: `${RELEASE_BASE}/LiveAudio-Setup-1.2.5.exe`,
      size: "35,817,683 bytes (35.82 MB)",
      use: "Instalador de Windows (primario)",
    },
    {
      filename: "LiveAudio-1.2.5-linux-x64.tar.gz",
      url: `${RELEASE_BASE}/LiveAudio-1.2.5-linux-x64.tar.gz`,
      size: "46,308,210 bytes (46.31 MB)",
      use: "Linux x86_64 — extraé y ejecutá ./liveaudio-launcher (necesita libportaudio2)",
    },
    {
      filename: "liveaudio-1.2.5-py3-none-any.whl",
      url: `${RELEASE_BASE}/liveaudio-1.2.5-py3-none-any.whl`,
      size: "306,462 bytes (306.46 kB)",
      use: "wheel pip (avanzado)",
    },
    {
      filename: "liveaudio-src-1.2.5.zip",
      url: `${RELEASE_BASE}/liveaudio-src-1.2.5.zip`,
      size: "360,586 bytes (360.59 kB)",
      use: "código fuente",
    },
    {
      filename: "requirements-cpu.txt",
      url: `${RELEASE_BASE}/requirements-cpu.txt`,
      size: "—",
      use: "vía pip (CPU)",
    },
    {
      filename: "requirements-cu121.txt",
      url: `${RELEASE_BASE}/requirements-cu121.txt`,
      size: "—",
      use: "vía pip (CUDA 12.1)",
    },
    {
      filename: "SHA256SUMS.txt",
      url: `${RELEASE_BASE}/SHA256SUMS.txt`,
      size: "—",
      use: "verificar tus descargas",
    },
  ],

  notesEyebrow: "// notas de operación",
  notesHeading: "Leé antes de ejecutar.",
  notes: [
    {
      tag: "sin firma de código",
      title: "SmartScreen de Windows",
      body: "El instalador no está firmado digitalmente, así que SmartScreen puede advertir. Hacé clic en Más información y luego en Ejecutar de todas formas. Opcionalmente verificá el archivo contra SHA256SUMS.txt primero.",
    },
    {
      tag: "verificar",
      title: "Verificá la descarga",
      body: "Comprobá el hash del archivo contra SHA256SUMS.txt antes de ejecutar, sobre todo en una red compartida o no confiable.",
    },
    {
      tag: "portable",
      title: "Modo portable",
      body: "Creá un archivo vacío llamado portable.marker junto al launcher y LiveAudio guarda todo en una carpeta local data/ en lugar de tu perfil de usuario.",
    },
    {
      tag: "actualizaciones",
      title: "Actualizaciones",
      body: "Actualizá con un clic desde la app, o ejecutá el launcher con --update para obtener el último release.",
    },
  ],

  reqEyebrow: "// requisitos del sistema",
  reqHeading: "Lo que necesitás para ejecutarlo.",
  reqCols: [
    {
      heading: "mínimo",
      rows: [
        { k: "so", v: "Windows 10/11 x64 o Linux x86_64" },
        { k: "gpu", v: "opcional — la CPU funciona" },
        { k: "ram", v: "8 GB (16 GB recomendado)" },
        { k: "disco", v: "~400 MB CPU / ~2.5 GB CUDA + modelos" },
        { k: "internet", v: "solo la primera vez, luego sin conexión" },
      ],
    },
    {
      heading: "cuda (opcional)",
      rows: [
        { k: "fabricante", v: "NVIDIA CUDA, autodetectado" },
        { k: "driver", v: ">= 525" },
        { k: "vram", v: ">= 4 GiB" },
        { k: "python", v: "no requerido — el instalador provee Python 3.11" },
        { k: "dep linux", v: "libportaudio2 (sudo apt install libportaudio2)" },
      ],
    },
  ],

  closingEyebrow: "// empezar",
  closingHeading: "Gratis, local y tuyo en una sola descarga.",
  closingBody:
    "Sin cuenta, sin API key, sin costo por minuto. Descargá la versión de arriba, ejecutala y tus subtítulos van a OBS por un WebSocket local — sin conexión después de la primera ejecución.",
  download: "Descargar LiveAudio v1.2.5 (gratis)",
};

export function downloadCopy(lang: Locale): DownloadCopy {
  return lang === "es" ? ES : EN;
}
