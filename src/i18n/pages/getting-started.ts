/**
 * Getting-started page copy — bilingual (EN default + ES mirror).
 *
 * The /getting-started/ page is a numbered "signal timeline": the EARNED,
 * real activation sequence for LiveAudio v1.2.0. Numbering is honest — each
 * step is a real ordered action a user actually performs.
 *
 *   01  get LiveAudio        installer (.exe / tarball) vs source via `uv`
 *   02  first run            provisions Python + deps; first-run internet only
 *   03  GPU auto-detect      CPU works; CUDA driver >= 525 / VRAM >= 4 GiB
 *   04  pick profile + go    Fast/Balanced/Quality/Stable Streaming -> START SYSTEM
 *
 * Every claim is traceable to the product spec:
 *   - install / first run + uv dev flow (uv sync --extra cpu|cu121, uv run liveaudio)
 *   - GPU optional; CUDA driver >= 525, VRAM >= 4 GiB; CPU works
 *   - first-run footprint ~400 MB (CPU) / ~2.5 GB (CUDA); SmartScreen; libportaudio2
 *   - START SYSTEM (INICIAR SISTEMA) + Apply changes
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

/** One path inside step 01 (installer track vs source/uv track). */
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
  title: "Getting started — activate LiveAudio v1.2.0 (Windows & Linux)",
  description:
    "Activate LiveAudio v1.2.0: install the app or run from source with uv, let the first run provision Python + deps, auto-detect your GPU, pick a profile, and START SYSTEM. Windows and Linux, 100% local.",
  eyebrow: "// getting-started",
  h1: "Activate LiveAudio in four real steps.",
  intro:
    "Install the app (or run from source with uv), let the first run provision Python, deps and models, let LiveAudio auto-detect your GPU, then pick a profile and START SYSTEM. Internet is needed only on the first run; after that it is 100% local.",
  spineLabel: "ACTIVATION SEQUENCE",
  steps: [
    {
      num: "01",
      kicker: "// get",
      title: "Get LiveAudio — installer or source.",
      lede: "Most people just download and run. Two real paths: the graphical installer (recommended), or running from source with uv if you are a developer.",
      tracks: [
        {
          kicker: "// installer",
          title: "Installer (recommended)",
          body: "Windows: download LiveAudio-Setup-1.2.0.exe and run it. Linux: download the tarball, extract it, and run ./liveaudio-launcher. No Python to install — the app provisions its own Python 3.11.",
          code: {
            tab: "linux x86_64",
            lines: [
              { kind: "comment", text: "# Linux: extract and launch" },
              {
                kind: "command",
                text: "tar -xzf LiveAudio-1.2.0-linux-x64.tar.gz",
              },
              { kind: "command", text: "./liveaudio-launcher" },
            ],
          },
          flag: "Windows: not code-signed",
        },
        {
          kicker: "// source",
          title: "Run from source (uv)",
          body: "Clone the repo and let uv create the environment. Choose exactly one torch extra: --extra cpu for CPU, or --extra cu121 for NVIDIA CUDA. Then run liveaudio.",
          code: {
            tab: "uv · developers",
            lines: [
              {
                kind: "command",
                text: "git clone https://github.com/plynte-labs/LiveAudio.git",
              },
              { kind: "command", text: "cd LiveAudio" },
              { kind: "comment", text: "# pick exactly one torch extra:" },
              { kind: "command", text: "uv sync --extra cpu" },
              { kind: "command", text: "uv sync --extra cu121" },
              { kind: "command", text: "uv run liveaudio" },
            ],
          },
        },
      ],
      note: "Linux needs libportaudio2 (sudo apt install libportaudio2).",
      flag: "Linux: needs libportaudio2",
    },
    {
      num: "02",
      kicker: "// first-run",
      title: "First run provisions everything.",
      lede: "The first launch downloads Python, dependencies and models, then caches them. Plan for roughly 400 MB on CPU or 2.5 GB on CUDA. Models download on first transcription. Every later start is instant and fully offline.",
      flag: "First run: internet required",
      note: "Footprint: ~400 MB (CPU) / ~2.5 GB (CUDA). After that, fully offline. Portable mode: drop an empty portable.marker next to the launcher to keep everything in a local data/ folder.",
    },
    {
      num: "03",
      kicker: "// detect",
      title: "LiveAudio auto-detects your GPU.",
      lede: "A GPU is optional — the CPU works. On launch, LiveAudio checks for a usable NVIDIA CUDA GPU and falls back to CPU automatically. You can always override the choice.",
      rungs: [
        {
          label: "CUDA",
          detail: "NVIDIA driver ≥ 525 and VRAM ≥ 4 GiB → CUDA is used.",
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
      note: "GPU optional; CPU works. CUDA needs driver ≥ 525, VRAM ≥ 4 GiB.",
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
      note: "Editing a built-in profile creates a Custom one. Apply changes to activate.",
    },
  ],
  closingEyebrow: "// download",
  closingHeading: "Have the app yet?",
  closingBody:
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.",
  download: "Download LiveAudio v1.2.0 (free)",
  howToName: "Get started with LiveAudio v1.2.0",
  timelineLabel: "Activation steps",
  detectLabel: "GPU auto-detect ladder",
  profilesLabel: "Profiles",
};

const ES: GettingStartedCopy = {
  title: "Primeros pasos — activa LiveAudio v1.2.0 (Windows y Linux)",
  description:
    "Activa LiveAudio v1.2.0: instala la app o ejecuta desde el código con uv, deja que la primera ejecución provisione Python y dependencias, detecte la GPU, elige un perfil e INICIAR SISTEMA. Windows y Linux, 100% local.",
  eyebrow: "// primeros-pasos",
  h1: "Activa LiveAudio en cuatro pasos reales.",
  intro:
    "Instala la app (o ejecuta desde el código con uv), deja que la primera ejecución provisione Python, dependencias y modelos, deja que LiveAudio detecte tu GPU y después elige un perfil e INICIAR SISTEMA. Internet solo en la primera ejecución; después es 100% local.",
  spineLabel: "SECUENCIA DE ACTIVACIÓN",
  steps: [
    {
      num: "01",
      kicker: "// obtener",
      title: "Obtén LiveAudio — instalador o código.",
      lede: "La mayoría solo descarga y ejecuta. Dos rutas reales: el instalador gráfico (recomendado), o ejecutar desde el código con uv si eres desarrollador.",
      tracks: [
        {
          kicker: "// instalador",
          title: "Instalador (recomendado)",
          body: "Windows: descarga LiveAudio-Setup-1.2.0.exe y ejecútalo. Linux: descarga el tarball, extráelo y ejecuta ./liveaudio-launcher. No hay que instalar Python — la app provisiona su propio Python 3.11.",
          code: {
            tab: "linux x86_64",
            lines: [
              { kind: "comment", text: "# Linux: extraer y ejecutar" },
              {
                kind: "command",
                text: "tar -xzf LiveAudio-1.2.0-linux-x64.tar.gz",
              },
              { kind: "command", text: "./liveaudio-launcher" },
            ],
          },
          flag: "Windows: sin firma de código",
        },
        {
          kicker: "// código",
          title: "Ejecutar desde el código (uv)",
          body: "Clona el repositorio y deja que uv cree el entorno. Elige exactamente un extra de torch: --extra cpu para CPU, o --extra cu121 para NVIDIA CUDA. Después ejecuta liveaudio.",
          code: {
            tab: "uv · desarrolladores",
            lines: [
              {
                kind: "command",
                text: "git clone https://github.com/plynte-labs/LiveAudio.git",
              },
              { kind: "command", text: "cd LiveAudio" },
              {
                kind: "comment",
                text: "# elige exactamente un extra de torch:",
              },
              { kind: "command", text: "uv sync --extra cpu" },
              { kind: "command", text: "uv sync --extra cu121" },
              { kind: "command", text: "uv run liveaudio" },
            ],
          },
        },
      ],
      note: "Linux necesita libportaudio2 (sudo apt install libportaudio2).",
      flag: "Linux: necesita libportaudio2",
    },
    {
      num: "02",
      kicker: "// primera-ejecución",
      title: "La primera ejecución provisiona todo.",
      lede: "El primer arranque descarga Python, dependencias y modelos, y luego los guarda en caché. Calculá unos 400 MB en CPU o 2.5 GB en CUDA. Los modelos se descargan en la primera transcripción. Cada arranque posterior es instantáneo y sin conexión.",
      flag: "Primera ejecución: requiere internet",
      note: "Tamaño: ~400 MB (CPU) / ~2.5 GB (CUDA). Después, totalmente sin conexión. Modo portable: coloca un portable.marker vacío junto al launcher para mantener todo en una carpeta data/ local.",
    },
    {
      num: "03",
      kicker: "// detectar",
      title: "LiveAudio detecta tu GPU sola.",
      lede: "La GPU es opcional — la CPU funciona. Al arrancar, LiveAudio busca una GPU NVIDIA CUDA utilizable y vuelve a CPU automáticamente. Siempre puedes anular la elección.",
      rungs: [
        {
          label: "CUDA",
          detail: "Driver NVIDIA ≥ 525 y VRAM ≥ 4 GiB → se usa CUDA.",
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
      note: "GPU opcional; la CPU funciona. CUDA necesita driver ≥ 525, VRAM ≥ 4 GiB.",
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
      note: "Editar un perfil integrado crea uno Custom. Aplica los cambios para activar.",
    },
  ],
  closingEyebrow: "// descargar",
  closingHeading: "¿Todavía no tienes la app?",
  closingBody:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido.",
  download: "Descargar LiveAudio v1.2.0 (gratis)",
  howToName: "Empieza con LiveAudio v1.2.0",
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
