/**
 * Getting-started page copy — bilingual (EN default + ES mirror).
 *
 * The /getting-started/ page is a numbered "signal timeline": the EARNED,
 * real activation sequence for LiveAudio v1.5.1. Numbering is honest — each
 * step is a real ordered action a user actually performs.
 *
 *   01  get LiveAudio        installer (.exe) / portable exe vs source (Rust + Tauri)
 *   02  first run            fetches transcription models; first-run internet only
 *   03  GPU auto-detect      CPU works; CUDA driver >= 525 / VRAM >= 4 GiB
 *   04  pick profile + go    Fast/Balanced/Quality/Stable Streaming -> START SYSTEM
 *
 * Every claim is traceable to the v1.5.1 release:
 *   - installation and initial Python worker provisioning
 *   - GPU optional; CUDA driver >= 525, VRAM >= 4 GiB; CPU works
 *   - installer ~26.2 MB / portable ~16.2 MB; SmartScreen (not code-signed yet);
 *     legacy Python v1.0.0–v1.2.7 auto-migration preserving %APPDATA%\LiveAudio
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
  /** amber caveat pill (SmartScreen / libportaudio2), optional. */
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
  title: "Getting started — activate LiveAudio v1.5.1 (Windows x64)",
  description:
    "Get started with the LiveAudio v1.5.1 Windows installer, select a model and audio device, and start local transcription.",
  eyebrow: "// getting-started",
  h1: "Activate LiveAudio in four real steps.",
  intro:
    "Install the app, select a model and audio device, then start the system. Initial setup can require internet for the Python worker and dependencies; selecting a new model may require a download.",
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
          body: "Windows x64: download LiveAudio_1.5.1_x64-setup.exe from the official release. The separate desktop executable lacks the CLI and resources and is not a complete portable package. Linux has a legacy v1.2.7 tarball.",
          code: {
            tab: "windows x64",
            lines: [
              { kind: "comment", text: "# Official Windows installer:" },
              {
                kind: "command",
                text: "LiveAudio_1.5.1_x64-setup.exe",
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
      note: "Legacy Linux tarball (v1.2.7) needs libportaudio2 (sudo apt install libportaudio2).",
      flag: "Linux: legacy v1.2.7 build",
    },
    {
      num: "02",
      kicker: "// first-run",
      title: "Prepare the runtime and models.",
      lede: "Setup may require internet to provision the Python inference worker and dependencies. A newly selected model may also need downloading; transcription can run offline once all required components are available.",
      flag: "Setup and model downloads may need internet",
      note: "The ~26.2 MB installer download does not include the storage needed by every runtime dependency and model.",
    },
    {
      num: "03",
      kicker: "// detect",
      title: "LiveAudio auto-detects your GPU.",
      lede: "A GPU is optional; CPU transcription is available. LiveAudio can detect an NVIDIA GPU, but CUDA inference also needs compatible runtime libraries.",
      rungs: [
        {
          label: "CUDA",
          detail: "Requires a compatible NVIDIA GPU, driver and CUDA runtime libraries.",
          tone: "go",
        },
        {
          label: "CPU",
          detail: "No usable GPU → CPU is used automatically. No setup needed.",
          tone: "info",
        },
        {
          label: "override",
          detail: "You can force CPU or CUDA yourself before starting.",
          tone: "warn",
        },
      ],
      note: "GPU detection alone does not guarantee CUDA runtime readiness.",
    },
    {
      num: "04",
      kicker: "// go",
      title: "Pick a profile, then START SYSTEM.",
      lede: "Choose an FPS-aware profile, pick your audio device and CPU/CUDA + model, click Apply changes, then START SYSTEM. Speak — captions appear and stream to OBS over the local WebSocket.",
      profiles: [
        { name: "Fast", note: "low latency" },
        { name: "Balanced", note: "recommended", recommended: true },
        { name: "Quality", note: "higher accuracy, more VRAM" },
        { name: "Stable Streaming", note: "reduces GPU load while gaming" },
      ],
      note: "For OBS, start the system, then copy the overlay URL. Copy it again if the active port changes.",
    },
  ],
  closingEyebrow: "// download",
  closingHeading: "Have the app yet?",
  closingBody:
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.",
  download: "Download LiveAudio v1.5.1 (free)",
  howToName: "Get started with LiveAudio v1.5.1",
  timelineLabel: "Activation steps",
  detectLabel: "GPU auto-detect ladder",
  profilesLabel: "Profiles",
};

const ES: GettingStartedCopy = {
  title: "Primeros pasos — activa LiveAudio v1.5.1 (Windows x64)",
  description:
    "Empieza con el instalador de LiveAudio v1.5.1 para Windows, selecciona un modelo y un dispositivo de audio e inicia la transcripción local.",
  eyebrow: "// primeros-pasos",
  h1: "Activa LiveAudio en cuatro pasos reales.",
  intro:
    "Instala la app, selecciona un modelo y un dispositivo de audio e inicia el sistema. La configuración inicial puede necesitar internet para el worker Python y sus dependencias; seleccionar un modelo nuevo puede requerir una descarga.",
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
          body: "Windows x64: descarga LiveAudio_1.5.1_x64-setup.exe de la versión oficial. El ejecutable de escritorio separado no incluye la CLI ni los recursos y no es un paquete portable completo. Linux tiene un tarball heredado v1.2.7.",
          code: {
            tab: "windows x64",
            lines: [
              { kind: "comment", text: "# Instalador oficial de Windows:" },
              {
                kind: "command",
                text: "LiveAudio_1.5.1_x64-setup.exe",
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
      note: "El tarball heredado de Linux (v1.2.7) necesita libportaudio2 (sudo apt install libportaudio2).",
      flag: "Linux: versión heredada v1.2.7",
    },
    {
      num: "02",
      kicker: "// primera-ejecución",
      title: "Prepara el runtime y los modelos.",
      lede: "La configuración puede necesitar internet para preparar el worker de inferencia Python y sus dependencias. Un modelo recién seleccionado también puede requerir una descarga; la transcripción puede funcionar sin conexión cuando están disponibles los componentes necesarios.",
      flag: "La configuración y las descargas pueden necesitar internet",
      note: "La descarga del instalador (~26.2 MB) no incluye el almacenamiento necesario para todas las dependencias y modelos.",
    },
    {
      num: "03",
      kicker: "// detectar",
      title: "LiveAudio detecta tu GPU sola.",
      lede: "La GPU es opcional; la transcripción puede usar la CPU. LiveAudio puede detectar una GPU NVIDIA, pero la inferencia CUDA también necesita bibliotecas compatibles.",
      rungs: [
        {
          label: "CUDA",
          detail: "Requiere una GPU NVIDIA, un driver y bibliotecas CUDA compatibles.",
          tone: "go",
        },
        {
          label: "CPU",
          detail:
            "Sin GPU utilizable → se usa CPU automáticamente. Sin configuración.",
          tone: "info",
        },
        {
          label: "anular",
          detail: "Puedes forzar CPU o CUDA tú mismo antes de empezar.",
          tone: "warn",
        },
      ],
      note: "Detectar la GPU no garantiza que el runtime CUDA esté preparado.",
    },
    {
      num: "04",
      kicker: "// iniciar",
      title: "Elige un perfil e INICIAR SISTEMA.",
      lede: "Elige un perfil con presets según FPS, elige tu dispositivo de audio y CPU/CUDA + modelo, haz clic en Aplicar cambios y después INICIAR SISTEMA. Habla — los subtítulos aparecen y se envían a OBS por el WebSocket local.",
      profiles: [
        { name: "Fast", note: "baja latencia" },
        { name: "Balanced", note: "recomendado", recommended: true },
        { name: "Quality", note: "más precisión, más VRAM" },
        { name: "Stable Streaming", note: "reduce carga de GPU al jugar" },
      ],
      note: "Para OBS, inicia el sistema y después copia la URL del overlay. Cópiala de nuevo si cambia el puerto activo.",
    },
  ],
  closingEyebrow: "// descargar",
  closingHeading: "¿Todavía no tienes la app?",
  closingBody:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido.",
  download: "Descargar LiveAudio v1.5.1 (gratis)",
  howToName: "Empieza con LiveAudio v1.5.1",
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
