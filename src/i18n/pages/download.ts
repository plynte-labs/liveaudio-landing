/**
 * Download page copy + asset data — single bilingual source for both locales.
 *
 * All versions and URLs are centralized in src/config/release.ts.
 * Generic release, checksum, and Linux desktop links point to /releases/latest.
 *
 * Spanish is neutral/professional (no regional slang or Spanglish leaks).
 */

import type { Locale } from "../routes";
import {
  LIVEAUDIO_VERSION,
  LIVEAUDIO_TAG,
  REPO_URL,
  ISSUES_URL,
  RELEASE_LATEST_URL,
  RELEASE_TAG_URL,
  RELEASE_DOWNLOAD_BASE,
  WINDOWS_INSTALLER_FILENAME,
  WINDOWS_INSTALLER_URL,
  WINDOWS_INSTALLER_SIZE,
  LINUX_APPIMAGE_FILENAME,
  LINUX_APPIMAGE_URL,
  LINUX_APPIMAGE_SIZE,
  LINUX_DEB_FILENAME,
  LINUX_DEB_URL,
  LINUX_DEB_SIZE,
  WINDOWS_CLI_FILENAME,
  WINDOWS_CLI_URL,
  WINDOWS_CLI_SIZE,
  LINUX_CLI_FILENAME,
  LINUX_CLI_URL,
  LINUX_CLI_SIZE,
} from "../../config/release";

export { REPO_URL, ISSUES_URL, LIVEAUDIO_TAG, LIVEAUDIO_VERSION };
export const RELEASE_BASE = RELEASE_DOWNLOAD_BASE;
export const RELEASE_TAG = RELEASE_TAG_URL;
export const RELEASE_LATEST = RELEASE_LATEST_URL;

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
  /** Direct download URL or /releases/latest for Linux packages. */
  url: string;
  /** Human size string (optional). */
  size: string;
}

export const PRIMARY_ASSETS: Record<Os, PrimaryAsset> = {
  windows: {
    os: "windows",
    filename: WINDOWS_INSTALLER_FILENAME,
    url: WINDOWS_INSTALLER_URL,
    size: WINDOWS_INSTALLER_SIZE,
  },
  linux: {
    os: "linux",
    filename: LINUX_APPIMAGE_FILENAME,
    url: LINUX_APPIMAGE_URL,
    size: LINUX_APPIMAGE_SIZE,
  },
};

/** CLI + ASR worker only (Windows zip); it is NOT the desktop app. */
export const CLI_ASSET = {
  filename: WINDOWS_CLI_FILENAME,
  url: WINDOWS_CLI_URL,
  size: WINDOWS_CLI_SIZE,
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
  detectedPrefix: string;
  recommendedTag: string;
  toggleLabel: string;
  windowsLabel: string;
  linuxLabel: string;
  downloadVerb: string;
  latestLinkLabel: string;
  cliLabel: string;
  cliHint: string;
  linuxNote: string;

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
  postDownloadStarBtn: string;
  postDownloadReleaseNotesBtn: string;

  /** Asset table. */
  tableEyebrow: string;
  tableHeading: string;
  thAsset: string;
  thUse: string;
  thSize: string;
  thGet: string;
  getLabel: string;
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

  /** Closing Download module. */
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
}

const EN: DownloadCopy = {
  title: `Download LiveAudio ${LIVEAUDIO_TAG} — Windows x64 & Linux x86_64 (free)`,
  description:
    `Download LiveAudio ${LIVEAUDIO_TAG} for Windows x64 (.exe) and Linux x86_64 (.AppImage / .deb). Free, open-source (MIT) native Rust + ONNX Runtime captions powered by NVIDIA Parakeet-TDT and Whisper, zero Python, and zero app data collected.`,

  consoleEyebrow: `// download · ${LIVEAUDIO_TAG} · 100% rust + tauri 2`,
  heading: `Download LiveAudio ${LIVEAUDIO_TAG}.`,
  subheading:
    "Free and open-source (MIT) for Windows x64 and Linux x86_64. Powered by NVIDIA Parakeet-TDT 0.6B v3 (recommended for EN/ES, on-demand download) and Whisper on native Rust + ONNX Runtime — zero Python, no API key, and zero data collected or retained by the desktop app.",
  detecting: "Detecting OS…",
  detectedPrefix: "Detected:",
  recommendedTag: "recommended",
  toggleLabel: "Choose your operating system",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Download",
  latestLinkLabel: "Always-latest release on GitHub",
  cliLabel: "CLI + ASR worker (zip)",
  cliHint: `${WINDOWS_CLI_FILENAME} · CLI and ASR worker only, not the desktop app`,
  linuxNote:
    "Linux x86_64 (.AppImage & .deb) supports PipeWire/PulseAudio system-audio loopback (ALSA fallback). Signed Minisign Ed25519 in-app updates work on Windows (NSIS) and Linux .AppImage; .deb updates via GitHub Releases.",

  statusDownloading: "Download starting…",
  postDownloadTitle: "Your download is starting…",
  postDownloadRetryPrefix: "Didn't start automatically?",
  postDownloadRetryAction: "Click here to retry",
  postDownloadOfflineTitle: "100% Local Processing",
  postDownloadOfflineBody:
    "Parakeet-TDT & Whisper run locally on your CPU or GPU. Audio and transcripts never leave your machine.",
  postDownloadTelemetryTitle: "Zero App Data Collected",
  postDownloadTelemetryBody:
    "No accounts, zero data collected or retained by the desktop app, and zero telemetry.",
  postDownloadShaTitle: "SHA-256 & Minisign Verified",
  postDownloadShaBody:
    "SHA-256 checksums published on GitHub Releases plus Minisign Ed25519 signed in-app updates.",
  postDownloadReportBtn: "Report an issue",
  postDownloadStarBtn: "Star on GitHub",
  postDownloadReleaseNotesBtn: "Hashes & changelog",

  tableEyebrow: `// all ${LIVEAUDIO_TAG} assets`,
  tableHeading: "Every release artifact, with direct links.",
  thAsset: "asset",
  thUse: "platform / use",
  thSize: "size",
  thGet: "get",
  getLabel: "get",
  assets: [
    {
      filename: WINDOWS_INSTALLER_FILENAME,
      url: WINDOWS_INSTALLER_URL,
      size: WINDOWS_INSTALLER_SIZE,
      use: "Windows x64 installer (primary) — NSIS, Minisign Ed25519 signed in-app updater, WASAPI loopback, VC++ runtime bundled",
    },
    {
      filename: LINUX_APPIMAGE_FILENAME,
      url: LINUX_APPIMAGE_URL,
      size: LINUX_APPIMAGE_SIZE,
      use: "Linux x86_64 desktop app — AppImage with PipeWire/PulseAudio loopback (ALSA fallback) and Minisign Ed25519 signed in-app updates",
    },
    {
      filename: LINUX_DEB_FILENAME,
      url: LINUX_DEB_URL,
      size: LINUX_DEB_SIZE,
      use: "Linux x86_64 desktop app — .deb package with PipeWire/PulseAudio loopback (ALSA fallback); update via GitHub Releases",
    },
    {
      filename: WINDOWS_CLI_FILENAME,
      url: WINDOWS_CLI_URL,
      size: WINDOWS_CLI_SIZE,
      use: "Windows x64 — CLI (including liveaudio-cli mcp) and ASR worker only (not the desktop app)",
    },
    {
      filename: LINUX_CLI_FILENAME,
      url: LINUX_CLI_URL,
      size: LINUX_CLI_SIZE,
      use: "Linux x86_64 — CLI (including liveaudio-cli mcp) and ASR worker only (not the desktop app)",
    },
    {
      filename: `${LIVEAUDIO_TAG} release notes & SHA256SUMS`,
      url: RELEASE_LATEST_URL,
      size: "—",
      use: "changelog, checksums, and source archives on GitHub Releases",
    },
  ],

  notesEyebrow: "// operator notes",
  notesHeading: "Read before you run.",
  notes: [
    {
      tag: "not code-signed",
      title: "Windows SmartScreen",
      body: `The ${LIVEAUDIO_TAG} Windows installer is not code-signed yet, so SmartScreen may warn. Click More info, then Run anyway. All release assets and SHA-256 checksums are published on GitHub Releases.`,
    },
    {
      tag: "parakeet + whisper",
      title: "NVIDIA Parakeet-TDT & Whisper — zero Python",
      body: "LiveAudio ships 100% native Rust with zero Python setup. NVIDIA Parakeet-TDT 0.6B v3 is recommended for EN/ES (~2× faster on CPU than Whisper small, near-zero silence hallucinations, hardware-matched on-demand download with CPU fallback), while Whisper remains available for other languages, translate-to-English, and context prompts.",
    },
    {
      tag: "stream-safe updater",
      title: "Signed in-app updates (Windows NSIS & Linux .AppImage)",
      body: "The built-in updater checks GitHub Releases every 24 h (zero telemetry, toggleable in Settings > Advanced), verifies Minisign Ed25519 signatures, and blocks updates while transcription is live or OBS is connected. Linux .deb users update via GitHub Releases.",
    },
    {
      tag: "migration",
      title: "Upgrading from v1.5.1 or older",
      body: `If you are on v1.5.1 or older, install ${LIVEAUDIO_TAG} manually once from GitHub Releases because older versions do not include the signed in-app updater. Back up your settings and sessions before upgrading.`,
    },
  ],

  trustEyebrow: "// trust & community",
  trustHeading: "Open source, verifiable, community backed.",
  trustSubheading:
    "LiveAudio is built in the open. 100% free, local, and collects zero data in the desktop app.",
  trustCards: [
    {
      tag: "open source",
      title: "Star the Repository",
      body: "LiveAudio is 100% free, local, and subscription-free under the MIT license. Starring the repository helps other streamers and creators discover local-first captioning.",
      cta: "Star on GitHub",
      url: REPO_URL,
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
      body: "Inspect every line of Rust code, audit automated CI release workflows, and verify release SHA-256 checksums and Minisign signatures independently.",
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
        { k: "os", v: "Windows 10/11 x64 (.exe), Linux x86_64 (.AppImage / .deb)" },
        { k: "audio", v: "Microphone + system-audio loopback on Windows (WASAPI) and Linux (PipeWire/PulseAudio + ALSA fallback)" },
        { k: "cpu / gpu", v: "GPU optional — Parakeet-TDT int8 runs smoothly on 4-thread CPU-only laptops; DirectML & optional CUDA 12.8 supported" },
        { k: "ram", v: "4 GB minimum (8 GB+ recommended)" },
        { k: "disk", v: "250 MB (app) + ~500 MB–1.5 GB per cached model; zero Python" },
      ],
    },
    {
      heading: "engines & network",
      rows: [
        { k: "parakeet", v: "NVIDIA Parakeet-TDT 0.6B v3 (recommended EN/ES) on ONNX Runtime (int8 CPU / DirectML GPU)" },
        { k: "whisper", v: "Whisper (tiny / base / small / turbo) for other languages, translate-to-English & context prompts" },
        { k: "cuda (opt)", v: "Optional NVIDIA CUDA 12.8 via CTranslate2 worker (opt-in download with cuBLAS 12.8 / cuDNN 9 + ONNX fallback)" },
        { k: "network", v: "On-demand SHA-256 model downloads, optional 24 h release check (zero telemetry, toggleable), opt-in CUDA download — audio & transcripts never leave your PC" },
      ],
    },
  ],

  closingEyebrow: "// get started",
  closingHeading: "Free, local, and yours in one download.",
  closingBody:
    "No account, no API key, no per-minute cost, and zero data collected or retained by the desktop app. Download LiveAudio and connect OBS through the local overlay.",
  download: `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
};

const ES: DownloadCopy = {
  title: `Descargar LiveAudio ${LIVEAUDIO_TAG} — Windows x64 y Linux x86_64 (gratis)`,
  description:
    `Descarga LiveAudio ${LIVEAUDIO_TAG} para Windows x64 (.exe) y Linux x86_64 (.AppImage / .deb). Subtítulos locales gratuitos y de código abierto (MIT) en Rust nativo + ONNX Runtime con NVIDIA Parakeet-TDT y Whisper, cero Python y sin recolección de datos en la app.`,

  consoleEyebrow: `// descargar · ${LIVEAUDIO_TAG} · 100% rust + tauri 2`,
  heading: `Descargar LiveAudio ${LIVEAUDIO_TAG}.`,
  subheading:
    "Gratis y de código abierto (MIT) para Windows x64 y Linux x86_64. Impulsado por NVIDIA Parakeet-TDT 0.6B v3 (recomendado para ES/EN, descarga bajo demanda) y Whisper en Rust nativo + ONNX Runtime — cero Python, sin clave API y sin recolección ni retención de datos en la app de escritorio.",
  detecting: "Detectando SO…",
  detectedPrefix: "Detectado:",
  recommendedTag: "recomendado",
  toggleLabel: "Elige tu sistema operativo",
  windowsLabel: "Windows",
  linuxLabel: "Linux",
  downloadVerb: "Descargar",
  latestLinkLabel: "Última versión en GitHub Releases",
  cliLabel: "CLI + worker ASR (zip)",
  cliHint: `${WINDOWS_CLI_FILENAME} · solo CLI y worker ASR, no la app de escritorio`,
  linuxNote:
    "Linux x86_64 (.AppImage y .deb) incluye loopback de audio del sistema con PipeWire/PulseAudio (respaldo ALSA). Las actualizaciones firmadas con Minisign Ed25519 dentro de la app funcionan en Windows (NSIS) y Linux .AppImage; .deb se actualiza desde GitHub Releases.",

  statusDownloading: "Iniciando descarga…",
  postDownloadTitle: "Tu descarga está comenzando…",
  postDownloadRetryPrefix: "¿No inició automáticamente?",
  postDownloadRetryAction: "Haz clic aquí para reintentar",
  postDownloadOfflineTitle: "Procesamiento 100% local",
  postDownloadOfflineBody:
    "Parakeet-TDT y Whisper corren localmente en tu CPU o GPU. El audio y las transcripciones nunca salen de tu equipo.",
  postDownloadTelemetryTitle: "Cero datos en la app",
  postDownloadTelemetryBody:
    "Sin cuentas, sin recolección ni retención de datos en la aplicación de escritorio y cero telemetría.",
  postDownloadShaTitle: "SHA-256 y Minisign",
  postDownloadShaBody:
    "Sumas SHA-256 publicadas en GitHub Releases y actualizaciones firmadas con Minisign Ed25519.",
  postDownloadReportBtn: "Reportar un problema",
  postDownloadStarBtn: "Dar estrella en GitHub",
  postDownloadReleaseNotesBtn: "Hashes y notas",

  tableEyebrow: `// todos los artefactos ${LIVEAUDIO_TAG}`,
  tableHeading: "Cada artefacto del lanzamiento, con enlaces directos.",
  thAsset: "artefacto",
  thUse: "plataforma / uso",
  thSize: "tamaño",
  thGet: "obtener",
  getLabel: "obtener",
  assets: [
    {
      filename: WINDOWS_INSTALLER_FILENAME,
      url: WINDOWS_INSTALLER_URL,
      size: WINDOWS_INSTALLER_SIZE,
      use: "Instalador Windows x64 (primario) — NSIS, actualizador firmado Minisign Ed25519, loopback WASAPI, runtime VC++ incluido",
    },
    {
      filename: LINUX_APPIMAGE_FILENAME,
      url: LINUX_APPIMAGE_URL,
      size: LINUX_APPIMAGE_SIZE,
      use: "App de escritorio Linux x86_64 — AppImage con loopback PipeWire/PulseAudio (respaldo ALSA) y actualizaciones firmadas Minisign Ed25519",
    },
    {
      filename: LINUX_DEB_FILENAME,
      url: LINUX_DEB_URL,
      size: LINUX_DEB_SIZE,
      use: "App de escritorio Linux x86_64 — paquete .deb con loopback PipeWire/PulseAudio (respaldo ALSA); actualizar vía GitHub Releases",
    },
    {
      filename: WINDOWS_CLI_FILENAME,
      url: WINDOWS_CLI_URL,
      size: WINDOWS_CLI_SIZE,
      use: "Windows x64 — solo CLI (incluido liveaudio-cli mcp) y worker ASR (no la app de escritorio)",
    },
    {
      filename: LINUX_CLI_FILENAME,
      url: LINUX_CLI_URL,
      size: LINUX_CLI_SIZE,
      use: "Linux x86_64 — solo CLI (incluido liveaudio-cli mcp) y worker ASR (no la app de escritorio)",
    },
    {
      filename: `notas de ${LIVEAUDIO_TAG} y SHA256SUMS`,
      url: RELEASE_LATEST_URL,
      size: "—",
      use: "changelog, sumas de verificación y código fuente en GitHub Releases",
    },
  ],

  notesEyebrow: "// notas de operación",
  notesHeading: "Lee antes de ejecutar.",
  notes: [
    {
      tag: "sin firma de código",
      title: "SmartScreen de Windows",
      body: `El instalador de Windows ${LIVEAUDIO_TAG} aún no cuenta con firma de código comercial, por lo que SmartScreen puede mostrar un aviso. Pulsa Más información y luego Ejecutar de todas formas. Todos los archivos y hashes SHA-256 están publicados en GitHub Releases.`,
    },
    {
      tag: "parakeet + whisper",
      title: "NVIDIA Parakeet-TDT y Whisper — cero Python",
      body: "LiveAudio es 100% Rust nativo sin preparación de Python. NVIDIA Parakeet-TDT 0.6B v3 es la opción recomendada para ES/EN (~2× más rápido en CPU que Whisper small, casi sin alucinaciones en silencio, descarga adaptada al hardware bajo demanda con respaldo CPU), y Whisper sigue disponible para otros idiomas, traducción al inglés y prompts de contexto.",
    },
    {
      tag: "actualizador seguro",
      title: "Actualizaciones firmadas (Windows NSIS y Linux .AppImage)",
      body: "El actualizador integrado consulta GitHub Releases cada 24 h (cero telemetría, desactivable en Ajustes > Avanzado), valida firmas Minisign Ed25519 y bloquea cualquier actualización mientras estás transcribiendo o OBS está conectado. En Linux .deb las actualizaciones se instalan desde GitHub Releases.",
    },
    {
      tag: "migración",
      title: "Actualizar desde v1.5.1 o anteriores",
      body: `Si estás en la v1.5.1 o anterior, instala ${LIVEAUDIO_TAG} manualmente una vez desde GitHub Releases porque esas versiones no incluían el actualizador firmado. Respalda tu configuración y sesiones antes de actualizar.`,
    },
  ],

  trustEyebrow: "// confianza y comunidad",
  trustHeading: "Código abierto, verificable y respaldado por la comunidad.",
  trustSubheading:
    "LiveAudio se desarrolla en abierto. 100% gratuito, local y sin recolección de datos en la aplicación de escritorio.",
  trustCards: [
    {
      tag: "código abierto",
      title: "Dar estrella al repositorio",
      body: "LiveAudio es 100% gratuito, local y sin suscripciones bajo licencia MIT. Dar una estrella en GitHub ayuda a que más creadores descubran los subtítulos locales.",
      cta: "Dar estrella en GitHub",
      url: REPO_URL,
    },
    {
      tag: "reportes",
      title: "Reportar fallos y sugerencias",
      body: "¿Encontraste un problema o tienes una sugerencia? Nuestro tracker en GitHub es público, activo y transparente. Cada reporte mejora la estabilidad.",
      cta: "Abrir issue en GitHub",
      url: ISSUES_URL,
    },
    {
      tag: "transparencia",
      title: "Auditoría de código y verificación",
      body: "Inspecciona cada línea de código Rust, audita los flujos de compilación en CI y verifica los hashes SHA-256 y firmas Minisign de manera independiente.",
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
        { k: "so", v: "Windows 10/11 x64 (.exe), Linux x86_64 (.AppImage / .deb)" },
        { k: "audio", v: "Micrófono + loopback de audio del sistema en Windows (WASAPI) y Linux (PipeWire/PulseAudio + respaldo ALSA)" },
        { k: "cpu / gpu", v: "GPU opcional — Parakeet-TDT int8 corre fluido en portátiles de 4 hilos sin GPU; admite DirectML y CUDA 12.8 opcional" },
        { k: "ram", v: "4 GB mínimo (8 GB+ recomendado)" },
        { k: "disco", v: "250 MB (app) + ~500 MB–1.5 GB por modelo en caché; cero Python" },
      ],
    },
    {
      heading: "motores y red",
      rows: [
        { k: "parakeet", v: "NVIDIA Parakeet-TDT 0.6B v3 (recomendado ES/EN) sobre ONNX Runtime (int8 CPU / DirectML GPU)" },
        { k: "whisper", v: "Whisper (tiny / base / small / turbo) para otros idiomas, traducción al inglés y prompts de contexto" },
        { k: "cuda (opt)", v: "NVIDIA CUDA 12.8 opcional vía worker CTranslate2 (descarga voluntaria con cuBLAS 12.8 / cuDNN 9 + respaldo ONNX)" },
        { k: "red", v: "Descarga bajo demanda de modelos verificados por SHA-256, comprobación opcional cada 24 h (cero telemetría) y CUDA opcional — audio y transcripciones nunca salen de tu equipo" },
      ],
    },
  ],

  closingEyebrow: "// empezar",
  closingHeading: "Gratis, local y tuyo en una sola descarga.",
  closingBody:
    "Sin cuenta, sin clave API, sin costo por minuto y sin recolección ni retención de datos en la aplicación de escritorio. Descarga LiveAudio y conecta OBS con el overlay local.",
  download: `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
};

export function downloadCopy(lang: Locale): DownloadCopy {
  return lang === "es" ? ES : EN;
}
