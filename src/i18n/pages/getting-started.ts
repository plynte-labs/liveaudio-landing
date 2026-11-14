/**
 * Getting-started page copy — bilingual (EN default + ES mirror).
 *
 * The /getting-started/ page is a numbered "signal timeline": the EARNED,
 * real activation sequence for LiveAudio v1.6.0. Numbering is honest — each
 * step is a real ordered action a user actually performs.
 *
 *   01  get LiveAudio        installer (.exe) / Linux AppImage + .deb vs source (Rust + Tauri)
 *   02  first run            instant startup, zero Python; downloads models on first selection
 *   03  GPU auto-detect      DirectML (DirectX 12) / CPU fallback / optional CUDA
 *   04  pick profile + go    Fast/Balanced/Quality/Stable Streaming -> START SYSTEM
 *
 * Every claim is traceable to the v1.6.0 release:
 *   - installation; no Python worker provisioning
 *   - GPU optional; DirectML / CPU; optional NVIDIA CUDA engine (explicit download)
 *   - installer LiveAudio-Setup-1.6.0.exe; SmartScreen (not code-signed yet);
 *     config in %APPDATA%\LiveAudio, models in %LOCALAPPDATA%\LiveAudio\models\onnx
 *   - START SYSTEM + Apply changes
 *   - profiles Fast / Balanced (recommended) / Quality / Stable Streaming
 *
 * Spanish is neutral/professional — NO Rioplatense slang in artifacts.
 */

export type Lang = "en" | "es";

/** A line in a code block, tinted in-palette via `kind`. */
export interface CodeLine {
  /** comment | command | output — drives the syntax tint (keys/strings/comments). */
  kind: "comment" | "command" | "value";
  text: string;
}

export interface CodeBlock {
  /** Filename / context tab shown in the code-head. */
  tab: string;
  lines: CodeLine[];
}

/** One path inside step 01 (installer track vs source/Rust track). */
export interface InstallTrack {
  /** mono kicker, e.g. "// installer". */
  kicker: string;
  title: string;
  body: string;
  code?: CodeBlock;
  /** amber caveat pill (SmartScreen / manual Linux updates), optional. */
  flag?: string;
}

/** One rung of the GPU auto-detect ladder. */
export interface DetectRung {
  /** mono label, e.g. "CUDA". */
  label: string;
  /** short condition / outcome. */
  detail: string;
  /** "go" (emerald) | "warn" (amber) | "info" (muted) — tint only, not text. */
  tone: "go" | "warn" | "info";
}

/** One profile chip in step 04. */
export interface ProfileChip {
  name: string;
  note: string;
  /** true = the recommended default (Balanced). */
  recommended?: boolean;
}

/** A numbered step on the signal timeline. */
export interface TimelineStep {
  /** "01".."04" — printed numeral on the spine. */
  num: string;
  /** mono kicker, e.g. "// capture". */
  kicker: string;
  title: string;
  /** answer-first lede paragraph. */
  lede: string;
  /** install tracks (step 01 only). */
  tracks?: InstallTrack[];
  /** a single code block attached to the step (steps 02 dev recap, etc.). */
  code?: CodeBlock;
  /** GPU auto-detect ladder rungs (step 03 only). */
  rungs?: DetectRung[];
  /** profile chips (step 04 only). */
  profiles?: ProfileChip[];
  /** amber caveat pill for the whole step (e.g. first-run internet). */
  flag?: string;
  /** mono micro-note under the step body. */
  note?: string;
}

export interface GettingStartedCopy {
  // <head>
  title: string;
  description: string;
  // intro
  eyebrow: string;
  /** the page's single H1. */
  h1: string;
  /** answer-first lede under the H1. */
  intro: string;
  /** mono spine label, e.g. "ACTIVATION SEQUENCE". */
  spineLabel: string;
  // timeline
  steps: TimelineStep[];
  // closing download module
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
  // HowTo JSON-LD
  howToName: string;
  // a11y / labels
  timelineLabel: string;
  detectLabel: string;
  profilesLabel: string;
}

const EN: GettingStartedCopy = {
  title: "Getting started — activate LiveAudio v1.6.0 (Windows x64)",
  description:
    "Get started with the LiveAudio v1.6.0 Windows installer, select a model and audio device, and start local transcription.",
  eyebrow: "// getting-started",
  h1: "Activate LiveAudio in four real steps.",
  intro:
    "Install the app, select a model and audio device, then start the system. 100% native Rust Whisper engine over ONNX Runtime (DirectML / CPU) with instant startup and zero Python setup.",
  spineLabel: "ACTIVATION SEQUENCE",
  steps: [
    {
      num: "01",
      kicker: "// get",
      title: "Get LiveAudio — installer or source.",
      lede: "Use the recommended Windows installer, or build from source if you are a developer.",
      tracks: [
        {
          kicker: "// installer",
          title: "Installer (recommended)",
          body: "Windows x64: download LiveAudio-Setup-1.6.0.exe from the official release (the VC++ runtime is bundled, so it works on a clean Windows). Linux: AppImage or .deb from the same release page.",
          code: {
            tab: "windows x64",
            lines: [
              { kind: "comment", text: "# Official Windows installer:" },
              {
                kind: "command",
                text: "LiveAudio-Setup-1.6.0.exe",
              },
            ],
          },
          flag: "Windows: not code-signed yet",
        },
        {
          kicker: "// source",
          title: "Build from source (Rust + Tauri 2)",
          body: "Clone the repo and follow the build instructions in the repository README (Rust toolchain + Tauri 2 prerequisites). This path is for developers; everyone else should use the installer.",
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
      note: "Coming from v1.5.1 or older? Install v1.6.0 manually once; from then on the Windows app updates itself in-app (Linux updates are manual).",
      flag: "Linux: manual updates",
    },
    {
      num: "02",
      kicker: "// first-run",
      title: "Instant startup — zero Python setup.",
      lede: "LiveAudio v1.6.0 starts instantly. With the total elimination of Python, there is no virtual environment, uv, or runtime provisioning wait. Only newly selected transcription models are downloaded locally on first selection; transcription runs 100% offline once downloaded.",
      flag: "Model download on first selection",
      note: "Zero Python dependencies to install or manage. The engine is 100% native Rust.",
    },
    {
      num: "03",
      kicker: "// detect",
      title: "DirectML GPU acceleration & CPU fallback.",
      lede: "LiveAudio uses native ONNX Runtime with DirectML (DirectX 12) to accelerate Whisper inference on NVIDIA, AMD, and Intel GPUs out of the box, with automatic CPU fallback. An optional CTranslate2 worker is available for dedicated CUDA setups.",
      rungs: [
        {
          label: "DirectML",
          detail: "DirectX 12 hardware acceleration for NVIDIA, AMD, and Intel GPUs.",
          tone: "go",
        },
        {
          label: "CPU",
          detail: "Automatic fallback — runs reliably on any CPU with zero extra setup.",
          tone: "info",
        },
        {
          label: "CUDA (opt)",
          detail: "Optional NVIDIA CUDA engine (CTranslate2), downloaded only after an explicit action from you.",
          tone: "warn",
        },
      ],
      note: "DirectML provides hardware acceleration across modern Windows GPUs without vendor lock-in.",
    },
    {
      num: "04",
      kicker: "// go",
      title: "Pick a profile, then START SYSTEM.",
      lede: "Choose an FPS-aware profile, pick your audio device and model, click Apply changes, then START SYSTEM. Speak — captions appear and stream to OBS over the local WebSocket with CSWSH protection.",
      profiles: [
        { name: "Fast", note: "low latency" },
        { name: "Balanced", note: "recommended", recommended: true },
        { name: "Quality", note: "higher accuracy, more VRAM" },
        { name: "Stable Streaming", note: "reduces GPU load while gaming" },
      ],
      note: "For OBS, start the system, then copy the overlay URL. Advanced includes the loopback port allowlist and MCP AI switches.",
    },
  ],
  closingEyebrow: "// download",
  closingHeading: "Have the app yet?",
  closingBody:
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.",
  download: "Download LiveAudio v1.6.0 (free)",
  howToName: "Get started with LiveAudio v1.6.0",
  timelineLabel: "Activation steps",
  detectLabel: "GPU auto-detect ladder",
  profilesLabel: "Profiles",
};

const ES: GettingStartedCopy = {
  title: "Primeros pasos — activa LiveAudio v1.6.0 (Windows x64)",
  description:
    "Empieza con el instalador de LiveAudio v1.6.0 para Windows, selecciona un modelo y un dispositivo de audio e inicia la transcripción local.",
  eyebrow: "// primeros-pasos",
  h1: "Activa LiveAudio en cuatro pasos reales.",
  intro:
    "Instala la app, selecciona un modelo y un dispositivo de audio e inicia el sistema. Motor Whisper 100% Rust nativo sobre ONNX Runtime (DirectML / CPU) con inicio instantáneo y cero setup de Python.",
  spineLabel: "SECUENCIA DE ACTIVACIÓN",
  steps: [
    {
      num: "01",
      kicker: "// obtener",
      title: "Obtén LiveAudio — instalador o código.",
      lede: "Usa el instalador recomendado de Windows o compila desde el código si eres desarrollador.",
      tracks: [
        {
          kicker: "// instalador",
          title: "Instalador (recomendado)",
          body: "Windows x64: descarga LiveAudio-Setup-1.6.0.exe de la versión oficial (incluye el runtime VC++, así que funciona en un Windows limpio). Linux: AppImage o .deb desde la misma página del release.",
          code: {
            tab: "windows x64",
            lines: [
              { kind: "comment", text: "# Instalador oficial de Windows:" },
              {
                kind: "command",
                text: "LiveAudio-Setup-1.6.0.exe",
              },
            ],
          },
          flag: "Windows: aún sin firma de código",
        },
        {
          kicker: "// código",
          title: "Compilar desde el código (Rust + Tauri 2)",
          body: "Clona el repositorio y sigue las instrucciones de compilación del README (toolchain de Rust + prerrequisitos de Tauri 2). Este camino es para desarrolladores; los demás deben usar el instalador.",
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
      note: "¿Vienes de la v1.5.1 o anterior? Instala la v1.6.0 manualmente una vez; desde entonces la app de Windows se actualiza sola desde dentro (en Linux las actualizaciones son manuales).",
      flag: "Linux: actualizaciones manuales",
    },
    {
      num: "02",
      kicker: "// primera-ejecución",
      title: "Inicio instantáneo — sin esperas de setup de Python.",
      lede: "LiveAudio v1.6.0 arranca de forma instantánea. Con la eliminación total de Python, ya no existen entornos virtuales, uv ni esperas de aprovisionamiento de runtime. Solo los modelos de transcripción seleccionados se descargan en local en su primer uso; la transcripción funciona 100% offline una vez descargados.",
      flag: "Descarga de modelo en la primera selección",
      note: "Cero dependencias de Python para instalar o gestionar. El motor es 100% Rust nativo.",
    },
    {
      num: "03",
      kicker: "// detectar",
      title: "Aceleración DirectML para GPU y fallback a CPU.",
      lede: "LiveAudio utiliza ONNX Runtime nativo con DirectML (DirectX 12) para acelerar Whisper en GPUs NVIDIA, AMD e Intel de inmediato, con fallback automático a CPU. Dispone de un worker opcional CTranslate2 para entornos dedicados con CUDA.",
      rungs: [
        {
          label: "DirectML",
          detail: "Aceleración por hardware DirectX 12 para GPUs NVIDIA, AMD e Intel.",
          tone: "go",
        },
        {
          label: "CPU",
          detail:
            "Fallback automático — funciona de forma confiable en cualquier CPU sin configuración.",
          tone: "info",
        },
        {
          label: "CUDA (opt)",
          detail: "Motor NVIDIA CUDA opcional (CTranslate2), que se descarga solo tras una acción explícita tuya.",
          tone: "warn",
        },
      ],
      note: "DirectML ofrece aceleración por hardware en GPUs modernas en Windows sin depender de un solo fabricante.",
    },
    {
      num: "04",
      kicker: "// iniciar",
      title: "Elige un perfil e INICIAR SISTEMA.",
      lede: "Elige un perfil con presets según FPS, elige tu dispositivo de audio y modelo, haz clic en Aplicar cambios y después INICIAR SISTEMA. Habla — los subtítulos aparecen y se envían a OBS por el WebSocket local con protección anti-CSWSH.",
      profiles: [
        { name: "Fast", note: "baja latencia" },
        { name: "Balanced", note: "recomendado", recommended: true },
        { name: "Quality", note: "más precisión, más VRAM" },
        { name: "Stable Streaming", note: "reduce carga de GPU al jugar" },
      ],
      note: "Para OBS, inicia el sistema y copia la URL del overlay. En Avanzado configuras la allowlist de puertos loopback y los interruptores MCP.",
    },
  ],
  closingEyebrow: "// descargar",
  closingHeading: "¿Todavía no tienes la app?",
  closingBody:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido.",
  download: "Descargar LiveAudio v1.6.0 (gratis)",
  howToName: "Empieza con LiveAudio v1.6.0",
  timelineLabel: "Pasos de activación",
  detectLabel: "Escalera de detección de GPU",
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
