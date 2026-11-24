/**
 * Getting-started page copy — bilingual (EN default + ES mirror).
 *
 * The /getting-started/ page is a numbered "signal timeline": the real
 * activation sequence for LiveAudio on Windows x64 and Linux x86_64.
 *
 * Spanish is neutral/professional (no regional slang or Spanglish leaks).
 */

import { LIVEAUDIO_TAG, WINDOWS_INSTALLER_FILENAME } from "../../config/release";

export type Lang = "en" | "es";

/** A line in a code block, tinted in-palette via `kind`. */
export interface CodeLine {
  kind: "comment" | "command" | "value";
  text: string;
}

export interface CodeBlock {
  tab: string;
  lines: CodeLine[];
}

/** One path inside step 01 (installer track vs source/Rust track). */
export interface InstallTrack {
  kicker: string;
  title: string;
  body: string;
  code?: CodeBlock;
  flag?: string;
}

/** One rung of the compute auto-detect ladder. */
export interface DetectRung {
  label: string;
  detail: string;
  tone: "go" | "warn" | "info";
}

/** One profile chip in step 04. */
export interface ProfileChip {
  name: string;
  note: string;
  recommended?: boolean;
}

/** A numbered step on the signal timeline. */
export interface TimelineStep {
  num: string;
  kicker: string;
  title: string;
  lede: string;
  tracks?: InstallTrack[];
  code?: CodeBlock;
  rungs?: DetectRung[];
  profiles?: ProfileChip[];
  flag?: string;
  note?: string;
}

export interface GettingStartedCopy {
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  spineLabel: string;
  steps: TimelineStep[];
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
  howToName: string;
  timelineLabel: string;
  detectLabel: string;
  profilesLabel: string;
}

const EN: GettingStartedCopy = {
  title: `Getting started — activate LiveAudio ${LIVEAUDIO_TAG} (Windows & Linux)`,
  description:
    `Get started with LiveAudio ${LIVEAUDIO_TAG} on Windows x64 (.exe) or Linux x86_64 (.AppImage / .deb), choose NVIDIA Parakeet-TDT or Whisper, and start 100% local transcription with zero app data collected.`,
  eyebrow: "// getting-started",
  h1: "Activate LiveAudio in four real steps.",
  intro:
    "Install on Windows or Linux, pick NVIDIA Parakeet-TDT (recommended for EN/ES) or Whisper, choose your audio source, and start the system. 100% native Rust + ONNX Runtime with zero Python setup and zero data collected or retained by the desktop app.",
  spineLabel: "ACTIVATION SEQUENCE",
  steps: [
    {
      num: "01",
      kicker: "// get",
      title: "Get LiveAudio — Windows installer, Linux package, or source.",
      lede: "Download the Windows x64 installer (.exe) or Linux x86_64 package (.AppImage / .deb), or build from source if you are a developer.",
      tracks: [
        {
          kicker: "// prebuilt packages",
          title: "Windows (.exe) & Linux (.AppImage / .deb)",
          body: `Windows x64: download ${WINDOWS_INSTALLER_FILENAME} (VC++ runtime bundled). Linux x86_64: download the .AppImage or .deb from GitHub Releases. Both Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture + ALSA fallback) support system-audio loopback.`,
          code: {
            tab: "windows & linux",
            lines: [
              { kind: "comment", text: "# Windows x64 installer:" },
              { kind: "command", text: WINDOWS_INSTALLER_FILENAME },
              { kind: "comment", text: "# Linux x86_64: .AppImage or .deb from GitHub Releases" },
            ],
          },
          flag: "Windows: SmartScreen (not code-signed yet)",
        },
        {
          kicker: "// source",
          title: "Build from source (Rust + Tauri 2)",
          body: "Clone the repo and follow the build instructions in the repository README (Rust toolchain + Tauri 2 prerequisites). This path is for developers; everyone else should use the prebuilt packages.",
          code: {
            tab: "git · developers",
            lines: [
              {
                kind: "command",
                text: "git clone https://github.com/plynte-labs/LiveAudio.git",
              },
              { kind: "command", text: "cd LiveAudio" },
            ],
          },
        },
      ],
      note: `Coming from v1.5.1 or older? Install ${LIVEAUDIO_TAG} manually once. Signed Minisign Ed25519 in-app updates work on Windows (NSIS) and Linux .AppImage (stream-safe: blocked while live or OBS is connected); .deb users update via GitHub Releases.`,
      flag: "Linux .deb: update via GitHub Releases",
    },
    {
      num: "02",
      kicker: "// first-run",
      title: "Instant startup — pick Parakeet-TDT (EN/ES) or Whisper.",
      lede: `LiveAudio ${LIVEAUDIO_TAG} launches instantly with zero Python provisioning wait. Choose NVIDIA Parakeet-TDT 0.6B v3 (recommended for English & Spanish — ~2× faster on CPU than Whisper small, near-zero silence hallucinations, hardware-matched on-demand download) or Whisper (for other languages, translate-to-English, and context prompts). Every model download is SHA-256 verified, and audio and transcripts never leave your machine.`,
      flag: "On-demand SHA-256 model download",
      note: "Zero data collected or retained by the desktop app. Once your model is cached locally, transcription runs 100% offline.",
    },
    {
      num: "03",
      kicker: "// compute",
      title: "Fast on CPU, DirectML GPU, or optional NVIDIA CUDA.",
      lede: "Parakeet-TDT 0.6B v3 int8 runs smoothly even on 4-thread CPU-only laptops using the automatic CPU threads switch. DirectML accelerates ONNX Runtime on DirectX 12 GPUs (NVIDIA, AMD, Intel) with automatic CPU fallback, and an opt-in CTranslate2 CUDA 12.8 worker is available for NVIDIA GPUs.",
      rungs: [
        {
          label: "CPU (int8)",
          detail: "Automatic CPU threads switch — Parakeet-TDT int8 is ~2× faster on CPU than Whisper small and smooth on 4-thread laptops.",
          tone: "go",
        },
        {
          label: "DirectML",
          detail: "Native DirectX 12 GPU acceleration via ONNX Runtime (NVIDIA, AMD, Intel) with automatic CPU fallback.",
          tone: "go",
        },
        {
          label: "CUDA 12.8 (opt)",
          detail: "Opt-in NVIDIA CUDA acceleration via CTranslate2 (cuBLAS 12.8 / cuDNN 9) with automatic fallback to ONNX Runtime.",
          tone: "warn",
        },
      ],
      note: "All compute options live in the redesigned Advanced tab alongside the Follow OpenCohost Language switch.",
    },
    {
      num: "04",
      kicker: "// go",
      title: "Pick a profile, START SYSTEM, then copy the OBS URL.",
      lede: "Choose an FPS-aware profile, pick your microphone or system-audio loopback, click Save, and start the system. Start the system before copying the overlay URL for OBS Studio — you get 7 live themes, anti-burst /overlay reconnection, and local .srt (DaVinci Resolve-ready), .vtt, and .jsonl session files.",
      profiles: [
        { name: "Fast", note: "low latency" },
        { name: "Balanced", note: "recommended", recommended: true },
        { name: "Quality", note: "higher accuracy, more VRAM" },
        { name: "Stable Streaming", note: "reduces GPU load while gaming" },
      ],
      note: "Advanced also includes the loopback port allowlist, word-boundary edge-trimming Blacklist switch, context prompt switch, and dual-consent MCP switches (liveaudio-cli mcp).",
    },
  ],
  closingEyebrow: "// download",
  closingHeading: "Have the app yet?",
  closingBody:
    "Free & open-source (MIT) for Windows x64 & Linux x86_64. No subscription, no API key, and zero data collected or retained by the desktop app.",
  download: `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
  howToName: `Get started with LiveAudio ${LIVEAUDIO_TAG}`,
  timelineLabel: "Activation steps",
  detectLabel: "Compute acceleration options",
  profilesLabel: "Profiles",
};

const ES: GettingStartedCopy = {
  title: `Primeros pasos — activa LiveAudio ${LIVEAUDIO_TAG} (Windows y Linux)`,
  description:
    `Empieza con LiveAudio ${LIVEAUDIO_TAG} en Windows x64 (.exe) o Linux x86_64 (.AppImage / .deb), elige NVIDIA Parakeet-TDT o Whisper e inicia la transcripción 100% local sin recolección de datos en la app.`,
  eyebrow: "// primeros-pasos",
  h1: "Activa LiveAudio en cuatro pasos reales.",
  intro:
    "Instala en Windows o Linux, elige NVIDIA Parakeet-TDT (recomendado para ES/EN) o Whisper, selecciona tu fuente de audio e inicia el sistema. 100% Rust nativo + ONNX Runtime sin setup de Python y sin recolección ni retención de datos en la app de escritorio.",
  spineLabel: "SECUENCIA DE ACTIVACIÓN",
  steps: [
    {
      num: "01",
      kicker: "// obtener",
      title: "Obtén LiveAudio — instalador Windows, paquete Linux o código.",
      lede: "Descarga el instalador para Windows x64 (.exe) o el paquete para Linux x86_64 (.AppImage / .deb), o compila desde el código si eres desarrollador.",
      tracks: [
        {
          kicker: "// paquetes precompilados",
          title: "Windows (.exe) y Linux (.AppImage / .deb)",
          body: `Windows x64: descarga ${WINDOWS_INSTALLER_FILENAME} (runtime VC++ incluido). Linux x86_64: descarga el .AppImage o .deb desde GitHub Releases. Tanto Windows (WASAPI) como Linux (monitor PipeWire/PulseAudio con respaldo ALSA) admiten loopback de audio del sistema.`,
          code: {
            tab: "windows y linux",
            lines: [
              { kind: "comment", text: "# Instalador oficial de Windows x64:" },
              { kind: "command", text: WINDOWS_INSTALLER_FILENAME },
              { kind: "comment", text: "# Linux x86_64: .AppImage o .deb en GitHub Releases" },
            ],
          },
          flag: "Windows: SmartScreen (sin firma comercial)",
        },
        {
          kicker: "// código",
          title: "Compilar desde el código (Rust + Tauri 2)",
          body: "Clona el repositorio y sigue las instrucciones de compilación del README (toolchain de Rust + prerrequisitos de Tauri 2). Este camino es para desarrolladores; los demás deben usar los paquetes precompilados.",
          code: {
            tab: "git · desarrolladores",
            lines: [
              {
                kind: "command",
                text: "git clone https://github.com/plynte-labs/LiveAudio.git",
              },
              { kind: "command", text: "cd LiveAudio" },
            ],
          },
        },
      ],
      note: `¿Vienes de la v1.5.1 o anterior? Instala ${LIVEAUDIO_TAG} manualmente una vez. Las actualizaciones firmadas Minisign Ed25519 dentro de la app funcionan en Windows (NSIS) y Linux .AppImage (bloqueadas mientras estás en directo o OBS está conectado); en .deb se actualiza vía GitHub Releases.`,
      flag: "Linux .deb: actualizar vía GitHub Releases",
    },
    {
      num: "02",
      kicker: "// primera-ejecución",
      title: "Inicio instantáneo — elige Parakeet-TDT (ES/EN) o Whisper.",
      lede: `LiveAudio ${LIVEAUDIO_TAG} arranca al instante sin esperar instalación de Python. Elige NVIDIA Parakeet-TDT 0.6B v3 (recomendado para español e inglés — ~2× más rápido en CPU que Whisper small, casi sin alucinaciones en silencio, descarga bajo demanda adaptada a tu hardware) o Whisper (otros idiomas, traducción al inglés y prompts de contexto). Cada descarga de modelo se verifica con SHA-256 y el audio y las transcripciones nunca salen de tu equipo.`,
      flag: "Descarga de modelos verificada con SHA-256",
      note: "Cero datos recopilados o retenidos por la aplicación de escritorio. Con el modelo en caché local, la transcripción corre 100% sin conexión.",
    },
    {
      num: "03",
      kicker: "// cómputo",
      title: "Rápido en CPU, GPU DirectML o NVIDIA CUDA opcional.",
      lede: "Parakeet-TDT 0.6B v3 int8 corre con fluidez incluso en portátiles de 4 hilos sin GPU gracias al interruptor automático de hilos de CPU. DirectML acelera ONNX Runtime en GPUs DirectX 12 (NVIDIA, AMD, Intel) con respaldo automático en CPU, y hay un worker opcional CTranslate2 CUDA 12.8 para GPUs NVIDIA.",
      rungs: [
        {
          label: "CPU (int8)",
          detail: "Hilos de CPU automáticos — Parakeet-TDT int8 es ~2× más rápido en CPU que Whisper small y fluido en equipos de 4 hilos.",
          tone: "go",
        },
        {
          label: "DirectML",
          detail: "Aceleración nativa por GPU DirectX 12 mediante ONNX Runtime (NVIDIA, AMD, Intel) con respaldo automático en CPU.",
          tone: "go",
        },
        {
          label: "CUDA 12.8 (opt)",
          detail: "Aceleración voluntaria NVIDIA CUDA con CTranslate2 (cuBLAS 12.8 / cuDNN 9) y respaldo automático a ONNX Runtime.",
          tone: "warn",
        },
      ],
      note: "Todas las opciones de cómputo están en la pestaña Avanzado rediseñada junto al interruptor Seguir idioma de OpenCohost.",
    },
    {
      num: "04",
      kicker: "// iniciar",
      title: "Elige un perfil, INICIAR SISTEMA y copia la URL para OBS.",
      lede: "Elige un perfil consciente de los FPS, selecciona tu micrófono o el loopback del sistema, haz clic en Guardar e inicia el sistema. Inicia el sistema antes de copiar la URL del overlay para OBS Studio: tendrás 7 temas en vivo, reconexión anti-ráfagas en /overlay y grabación local en .srt (listo para DaVinci Resolve), .vtt y .jsonl.",
      profiles: [
        { name: "Fast", note: "baja latencia" },
        { name: "Balanced", note: "recomendado", recommended: true },
        { name: "Quality", note: "más precisión, más VRAM" },
        { name: "Stable Streaming", note: "reduce carga de GPU al jugar" },
      ],
      note: "En Avanzado también configuras la lista blanca de puertos loopback, la Blacklist por bordes con interruptor propio, el prompt de contexto y los interruptores MCP de doble consentimiento (liveaudio-cli mcp).",
    },
  ],
  closingEyebrow: "// descargar",
  closingHeading: "¿Todavía no tienes la app?",
  closingBody:
    "Gratis y de código abierto (MIT) para Windows x64 y Linux x86_64. Sin suscripción, sin clave API y sin recolección ni retención de datos en la aplicación de escritorio.",
  download: `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
  howToName: `Empieza con LiveAudio ${LIVEAUDIO_TAG}`,
  timelineLabel: "Pasos de activación",
  detectLabel: "Opciones de aceleración de cómputo",
  profilesLabel: "Perfiles",
};

/** Return the page copy bound to a locale (EN default). */
export function gettingStartedCopy(lang: Lang): GettingStartedCopy {
  return lang === "es" ? ES : EN;
}

/**
 * Build the HowTo step list from the timeline (name + plain-text instruction).
 * The JSON-LD steps mirror the on-page numbered timeline 1:1.
 */
export function gettingStartedHowToSteps(
  copy: GettingStartedCopy,
): { name: string; text: string }[] {
  return copy.steps.map((step) => ({
    name: step.title,
    text: step.lede,
  }));
}
