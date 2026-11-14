/**
 * Download page copy + asset data — single bilingual source for both locales.
 *
 * Every product fact / URL traces to the v1.6.0 GitHub release (100% native Rust
 * + ONNX Runtime DirectML / CPU + Tauri 2): the Windows NSIS installer
 * (LiveAudio-Setup-1.6.0.exe), the CLI zip / tar.gz, and the Linux AppImage and
 * .deb (exact filenames unknown, so they link to the release page).
 * The installer is NOT code-signed yet.
 *
 * Spanish is neutral/professional (no Rioplatense slang in artifacts).
 */

import type { Locale } from "../routes";

/** Base for every v1.6.0 release asset (Windows installer + CLI archives). */
export const RELEASE_BASE =
  "https://github.com/plynte-labs/LiveAudio/releases/download/v1.6.0";
/** Release notes page for v1.6.0 (hashes + changelog live here). */
export const RELEASE_TAG =
  "https://github.com/plynte-labs/LiveAudio/releases/tag/v1.6.0";
/** Always-latest redirect (from the product spec). */
export const RELEASE_LATEST =
  "https://github.com/plynte-labs/LiveAudio/releases/latest";

/** Open source community, bug reporting, and sponsor destinations. */
export const SPONSORS_URL = "https://github.com/sponsors/plynte-labs";
export const ISSUES_URL = "https://github.com/plynte-labs/LiveAudio/issues";
export const REPO_URL = "https://github.com/plynte-labs/LiveAudio";

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
    filename: "LiveAudio-Setup-1.6.0.exe",
    url: `${RELEASE_BASE}/LiveAudio-Setup-1.6.0.exe`,
    size: "",
  },
  linux: {
    os: "linux",
    // Exact AppImage / .deb filenames are not pinned here: link the release page.
    filename: "LiveAudio 1.6.0 (.AppImage / .deb)",
    url: RELEASE_TAG,
    size: "",
  },
};

/** CLI + ASR worker only (Windows zip); it is NOT the desktop app. */
export const CLI_ASSET = {
  filename: "liveaudio-cli-1.6.0-windows-x64.zip",
  url: `${RELEASE_BASE}/liveaudio-cli-1.6.0-windows-x64.zip`,
  size: "",
};

/** A row in the brutalist "all assets" table. */
export interface AssetRow {
  filename: string;
  url: string;
  size: string;
  /** Mono platform/use tag (already localized in the copy decks below). */
  use: string;
}

/** A card in the Trust, Community & Open Source Support section. */
export interface TrustCard {
  tag: string;
  title: string;
  body: string;
  cta: string;
  url: string;
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
  cliLabel: string; // label for the CLI + ASR worker zip link
  cliHint: string; // one-line hint: CLI only, not the desktop app
  linuxNote: string; // honest flag: Linux updates are manual

  /** Post-click download reassurance (OsDetect island) */
  statusDownloading: string;
  postDownloadTitle: string;
  postDownloadRetryPrefix: string;
  postDownloadRetryAction: string;
  postDownloadOfflineTitle: string;
  postDownloadOfflineBody: string;
  postDownloadTelemetryTitle: string;
  postDownloadTelemetryBody: string;
  postDownloadShaTitle: string;
  postDownloadShaBody: string;
  postDownloadReportBtn: string;
  postDownloadSponsorBtn: string;
  postDownloadReleaseNotesBtn: string;

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

  /** Trust, Community & Open Source section. */
  trustEyebrow: string;
  trustHeading: string;
  trustSubheading: string;
  trustCards: TrustCard[];

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
  title: "Download LiveAudio v1.6.0 — Windows x64 100% Rust build (free)",
  description:
    "Download the official LiveAudio v1.6.0 Windows x64 installer for local transcription. Free and open-source, 100% native Rust + ONNX Runtime (DirectML / CPU), zero Python.",

  consoleEyebrow: "// download · v1.6.0 · 100% rust + tauri 2",
  heading: "Download LiveAudio v1.6.0.",
  subheading:
    "Free and open-source (MIT). LiveAudio is 100% native Rust and Tauri 2 with ONNX Runtime DirectML/CPU — zero Python dependencies and instant startup. Use the Windows x64 installer below; Linux is available as AppImage and .deb.",
  detecting: "Detecting OS…",
  detectedPrefix: "Detected:",
  recommendedTag: "recommended",
  toggleLabel: "Choose your operating system",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Download",
  latestLinkLabel: "Always-latest release",
  cliLabel: "CLI + ASR worker (zip)",
  cliHint: "liveaudio-cli-1.6.0-windows-x64.zip · CLI and ASR worker only, not the desktop app",
  linuxNote:
    "Linux builds (AppImage and .deb) are on the release page. The in-app updater is Windows-only: on Linux, updates are manual.",

  statusDownloading: "Download starting…",
  postDownloadTitle: "Your download is starting…",
  postDownloadRetryPrefix: "Didn't start automatically?",
  postDownloadRetryAction: "Click here to retry",
  postDownloadOfflineTitle: "100% Offline",
  postDownloadOfflineBody:
    "Whisper runs locally on your GPU/CPU. Zero audio leaves your machine.",
  postDownloadTelemetryTitle: "Zero Telemetry",
  postDownloadTelemetryBody:
    "No tracking, no accounts, and no background phone-home calls.",
  postDownloadShaTitle: "SHA-256 Verified",
  postDownloadShaBody:
    "Cryptographic hashes published on GitHub to verify binary integrity.",
  postDownloadReportBtn: "Report an issue",
  postDownloadSponsorBtn: "Support project",
  postDownloadReleaseNotesBtn: "Hashes & changelog",

  tableEyebrow: "// all v1.6.0 assets",
  tableHeading: "Every release artifact, with exact URLs.",
  thAsset: "asset",
  thUse: "platform / use",
  thSize: "size",
  thGet: "get",
  getLabel: "get",
  assets: [
    {
      filename: "LiveAudio-Setup-1.6.0.exe",
      url: `${RELEASE_BASE}/LiveAudio-Setup-1.6.0.exe`,
      size: "—",
      use: "Windows x64 installer (primary) — NSIS, signed in-app updater, VC++ runtime bundled",
    },
    {
      filename: "liveaudio-cli-1.6.0-windows-x64.zip",
      url: `${RELEASE_BASE}/liveaudio-cli-1.6.0-windows-x64.zip`,
      size: "—",
      use: "Windows x64 — CLI and ASR worker only (not the desktop app)",
    },
    {
      filename: "*.AppImage",
      url: RELEASE_TAG,
      size: "—",
      use: "Linux x86_64 desktop app — AppImage (see the release page for the exact file; manual updates)",
    },
    {
      filename: "*.deb",
      url: RELEASE_TAG,
      size: "—",
      use: "Linux x86_64 desktop app — .deb package (see the release page for the exact file; manual updates)",
    },
    {
      filename: "liveaudio-cli-1.6.0-linux-x64.tar.gz",
      url: `${RELEASE_BASE}/liveaudio-cli-1.6.0-linux-x64.tar.gz`,
      size: "—",
      use: "Linux x64 — CLI and ASR worker only (not the desktop app)",
    },
    {
      filename: "v1.6.0 release notes",
      url: RELEASE_TAG,
      size: "—",
      use: "changelog, hashes and source for v1.6.0",
    },
  ],

  notesEyebrow: "// operator notes",
  notesHeading: "Read before you run.",
  notes: [
    {
      tag: "not code-signed",
      title: "Windows SmartScreen",
      body: "The v1.6.0 installer is not code-signed yet, so SmartScreen may warn. Click More info, then Run anyway. The exact files and hashes are listed on the v1.6.0 release page.",
    },
    {
      tag: "zero python",
      title: "100% native Rust — no Python setup",
      body: "LiveAudio v1.6.0 completely eliminated Python. There are no virtual environments, uv, or Python runtimes to download during setup. The app starts and transcribes immediately using native ONNX Runtime DirectML/CPU.",
    },
    {
      tag: "migration",
      title: "Upgrading from older versions",
      body: "If you are on v1.5.1 or older, install v1.6.0 manually once from GitHub Releases: those versions do not include the in-app updater or its public signing key. From v1.6.0 onward, the signed in-app updater handles Windows updates; on Linux, updates are manual. Back up your settings and sessions first.",
    },
    {
      tag: "updates",
      title: "Integrated Updater & Security",
      body: "The signed in-app updater (Windows only) checks GitHub Releases every 24 h (can be turned off in Advanced), verifies the Minisign signature before running any installer, and never downloads or installs while you are transcribing or OBS clients are connected. The WebSocket server only accepts allowed loopback ports.",
    },
  ],

  trustEyebrow: "// trust & community",
  trustHeading: "Open source, verifiable, community backed.",
  trustSubheading:
    "LiveAudio is built in the open. 100% free, local, and without subscriptions or telemetry.",
  trustCards: [
    {
      tag: "sponsorship",
      title: "Support the Project",
      body: "LiveAudio is 100% free, local, and subscription-free. Sponsoring development directly funds GPU testing hardware, CI runners, and ongoing maintenance.",
      cta: "Sponsor on GitHub",
      url: SPONSORS_URL,
    },
    {
      tag: "issues",
      title: "Report Bugs & Suggestions",
      body: "Encountered an issue or have a feature idea? Our GitHub tracker is public, monitored, and transparent. Every bug report directly improves stability.",
      cta: "Open GitHub issues",
      url: ISSUES_URL,
    },
    {
      tag: "transparency",
      title: "Code Audit & Verification",
      body: "Inspect every line of Rust code, audit automated CI release workflows, and verify release SHA-256 checksums independently.",
      cta: "Audit source repository",
      url: REPO_URL,
    },
  ],

  reqEyebrow: "// system requirements",
  reqHeading: "What you need to run it.",
  reqCols: [
    {
      heading: "minimum",
      rows: [
        { k: "os", v: "Windows 10/11 x64, Linux x86_64 (AppImage / .deb)" },
        { k: "gpu", v: "optional — DirectX 12 (DirectML) GPU acceleration or CPU fallback" },
        { k: "ram", v: "4 GB (8 GB+ recommended)" },
        { k: "disk", v: "250 MB (app) + 500 MB per model cache; zero Python" },
        { k: "internet", v: "models download on first use; update check every 24 h (can be disabled); 0 telemetry" },
      ],
    },
    {
      heading: "acceleration",
      rows: [
        { k: "directml", v: "DirectX 12 (NVIDIA, AMD, Intel) native via ONNX Runtime" },
        { k: "cpu", v: "multi-threaded CPU fallback on Windows and Linux" },
        { k: "cuda (opt)", v: "optional NVIDIA CUDA engine (CTranslate2); downloaded only on your request" },
        { k: "vram", v: "2 GB (tiny / base); 4 GB+ (small / turbo)" },
      ],
    },
  ],

  closingEyebrow: "// get started",
  closingHeading: "Free, local, and yours in one download.",
  closingBody:
    "No account, API key or per-minute cost for local transcription. Download the installer and connect OBS through the local overlay.",
  download: "Download LiveAudio v1.6.0 (free)",
};

const ES: DownloadCopy = {
  title: "Descargar LiveAudio v1.6.0 — Windows x64 build 100% Rust (gratis)",
  description:
    "Descarga el instalador oficial de LiveAudio v1.6.0 para Windows x64 y transcribe localmente. Gratis y de código abierto, 100% Rust nativo + ONNX Runtime (DirectML / CPU), sin Python.",

  consoleEyebrow: "// descargar · v1.6.0 · 100% rust + tauri 2",
  heading: "Descargar LiveAudio v1.6.0.",
  subheading:
    "Gratis y de código abierto (MIT). LiveAudio es 100% Rust nativo y Tauri 2 con ONNX Runtime DirectML/CPU — cero dependencias de Python e inicio instantáneo. Usa el instalador de Windows x64; Linux está disponible como AppImage y .deb.",
  detecting: "Detectando SO…",
  detectedPrefix: "Detectado:",
  recommendedTag: "recomendado",
  toggleLabel: "Elige tu sistema operativo",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Descargar",
  latestLinkLabel: "Versión siempre más reciente",
  cliLabel: "CLI + worker ASR (zip)",
  cliHint: "liveaudio-cli-1.6.0-windows-x64.zip · solo CLI y worker ASR, no la app de escritorio",
  linuxNote:
    "Las builds de Linux (AppImage y .deb) están en la página del release. El actualizador integrado es solo de Windows: en Linux las actualizaciones son manuales.",

  statusDownloading: "Iniciando descarga…",
  postDownloadTitle: "Tu descarga está comenzando…",
  postDownloadRetryPrefix: "¿No inició automáticamente?",
  postDownloadRetryAction: "Haz clic aquí para reintentar",
  postDownloadOfflineTitle: "100% Offline",
  postDownloadOfflineBody:
    "Whisper se ejecuta localmente en tu GPU o CPU. El audio nunca sale de tu equipo.",
  postDownloadTelemetryTitle: "Cero Telemetría",
  postDownloadTelemetryBody:
    "Sin rastreo, sin cuentas y sin conexiones externas en segundo plano.",
  postDownloadShaTitle: "Verificación SHA-256",
  postDownloadShaBody:
    "Hashes criptográficos publicados en GitHub para validar la integridad del binario.",
  postDownloadReportBtn: "Reportar un problema",
  postDownloadSponsorBtn: "Apoyar el proyecto",
  postDownloadReleaseNotesBtn: "Hashes y notas",

  tableEyebrow: "// todos los assets v1.6.0",
  tableHeading: "Cada artefacto del release, con URLs exactas.",
  thAsset: "asset",
  thUse: "plataforma / uso",
  thSize: "tamaño",
  thGet: "obtener",
  getLabel: "obtener",
  assets: [
    {
      filename: "LiveAudio-Setup-1.6.0.exe",
      url: `${RELEASE_BASE}/LiveAudio-Setup-1.6.0.exe`,
      size: "—",
      use: "Instalador de Windows x64 (primario) — NSIS, actualizador integrado firmado, runtime VC++ incluido",
    },
    {
      filename: "liveaudio-cli-1.6.0-windows-x64.zip",
      url: `${RELEASE_BASE}/liveaudio-cli-1.6.0-windows-x64.zip`,
      size: "—",
      use: "Windows x64 — solo CLI y worker ASR (no la app de escritorio)",
    },
    {
      filename: "*.AppImage",
      url: RELEASE_TAG,
      size: "—",
      use: "App de escritorio Linux x86_64 — AppImage (el archivo exacto está en la página del release; actualizaciones manuales)",
    },
    {
      filename: "*.deb",
      url: RELEASE_TAG,
      size: "—",
      use: "App de escritorio Linux x86_64 — paquete .deb (el archivo exacto está en la página del release; actualizaciones manuales)",
    },
    {
      filename: "liveaudio-cli-1.6.0-linux-x64.tar.gz",
      url: `${RELEASE_BASE}/liveaudio-cli-1.6.0-linux-x64.tar.gz`,
      size: "—",
      use: "Linux x64 — solo CLI y worker ASR (no la app de escritorio)",
    },
    {
      filename: "notas de la versión v1.6.0",
      url: RELEASE_TAG,
      size: "—",
      use: "changelog, hashes y código fuente de v1.6.0",
    },
  ],

  notesEyebrow: "// notas de operación",
  notesHeading: "Lee antes de ejecutar.",
  notes: [
    {
      tag: "sin firma de código",
      title: "SmartScreen de Windows",
      body: "El instalador v1.6.0 aún no está firmado digitalmente, así que SmartScreen puede advertir. Haz clic en Más información y luego en Ejecutar de todas formas. Los archivos exactos y sus hashes están en la página del release v1.6.0.",
    },
    {
      tag: "cero python",
      title: "100% Rust nativo — sin setup de Python",
      body: "LiveAudio v1.6.0 eliminó Python por completo. Ya no existen entornos virtuales, uv ni runtimes de Python que descargar durante el setup. La app arranca y transcribe inmediatamente con ONNX Runtime DirectML/CPU nativo.",
    },
    {
      tag: "migración",
      title: "Actualizar desde versiones anteriores",
      body: "Si estás en la v1.5.1 o anterior, instala la v1.6.0 manualmente una vez desde GitHub Releases: esas versiones no incluyen el actualizador integrado ni su clave pública de firma. Desde la v1.6.0, en Windows las actualizaciones llegan dentro de la app; en Linux son manuales. Respalda antes tu configuración y sesiones.",
    },
    {
      tag: "actualizaciones",
      title: "Actualizador integrado y seguridad",
      body: "El actualizador integrado y firmado (solo Windows) consulta GitHub Releases cada 24 h (se puede desactivar en Avanzado), verifica la firma Minisign antes de ejecutar cualquier instalador y nunca descarga ni instala mientras transcribes o hay clientes OBS conectados. El servidor WebSocket solo acepta puertos loopback permitidos.",
    },
  ],

  trustEyebrow: "// confianza y comunidad",
  trustHeading: "Código abierto, verificable y respaldado por la comunidad.",
  trustSubheading:
    "LiveAudio se desarrolla de forma abierta. 100% gratuito, local y sin suscripciones ni telemetría.",
  trustCards: [
    {
      tag: "patrocinio",
      title: "Apoya el proyecto",
      body: "LiveAudio es 100% gratuito, local y sin suscripciones. El patrocinio financia directamente pruebas en hardware con GPUs diversas, runners de CI y mantenimiento continuo.",
      cta: "Patrocinar en GitHub",
      url: SPONSORS_URL,
    },
    {
      tag: "reportes",
      title: "Reportar fallos y sugerencias",
      body: "¿Encontraste un problema o tienes una sugerencia? Nuestro tracker en GitHub es público, activo y transparente. Cada reporte ayuda a mejorar la estabilidad.",
      cta: "Abrir issue en GitHub",
      url: ISSUES_URL,
    },
    {
      tag: "transparencia",
      title: "Auditoría de código y verificación",
      body: "Inspecciona cada línea de código Rust, audita nuestros flujos de compilación en CI y verifica los hashes SHA-256 de cada compilación de manera independiente.",
      cta: "Ver repositorio en GitHub",
      url: REPO_URL,
    },
  ],

  reqEyebrow: "// requisitos del sistema",
  reqHeading: "Lo que necesitas para ejecutarlo.",
  reqCols: [
    {
      heading: "mínimo",
      rows: [
        { k: "so", v: "Windows 10/11 x64, Linux x86_64 (AppImage / .deb)" },
        { k: "gpu", v: "opcional — aceleración GPU DirectX 12 (DirectML) o CPU" },
        { k: "ram", v: "4 GB (8 GB+ recomendado)" },
        { k: "disco", v: "250 MB (app) + 500 MB por caché de modelo; cero Python" },
        { k: "internet", v: "los modelos se descargan en el primer uso; consulta de actualizaciones cada 24 h (se puede desactivar); 0 telemetría" },
      ],
    },
    {
      heading: "aceleración",
      rows: [
        { k: "directml", v: "DirectX 12 (NVIDIA, AMD, Intel) nativo con ONNX Runtime" },
        { k: "cpu", v: "CPU multihilo como alternativa en Windows y Linux" },
        { k: "cuda (opt)", v: "motor NVIDIA CUDA opcional (CTranslate2); se descarga solo si lo pides" },
        { k: "vram", v: "2 GB (tiny / base); 4 GB+ (small / turbo)" },
      ],
    },
  ],

  closingEyebrow: "// empezar",
  closingHeading: "Gratis, local y tuyo en una sola descarga.",
  closingBody:
    "Sin cuenta, clave API ni costo por minuto para transcribir localmente. Descarga el instalador y conecta OBS mediante el overlay local.",
  download: "Descargar LiveAudio v1.6.0 (gratis)",
};

export function downloadCopy(lang: Locale): DownloadCopy {
  return lang === "es" ? ES : EN;
}
