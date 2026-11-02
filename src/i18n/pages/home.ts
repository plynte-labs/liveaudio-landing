/**
 * Home page copy — bilingual marketing content for the conversion funnel.
 *
 * Single source for every Home sub-section (Trust strip, objection cards,
 * pipeline, WebSocket panel, feature bento, vs teaser, FAQ teaser, closing
 * Download module). Chrome strings (nav/footer/common CTAs) live in ui.ts; this
 * file holds ONLY page-specific Home copy.
 *
 * Every claim is traceable to the product spec:
 *   - Hero subtitle + eyebrow + trust strip + WS panel body: verbatim from the product spec.
 *   - Pipeline (capture / Silero VAD / Whisper / ws://127.0.0.1:8765).
 *   - Feature bento (hot-swap, profiles, blacklist, session files, diagnostics,
 *     in-app update).
 *   - Objection cards (100% local / Linux / GPU).
 *   - FAQ (verbatim questions); answers traceable to the product spec.
 *   - Closing "Free" line (verbatim both locales).
 *   - Loopback amber Windows-only flag.
 *
 * Spanish is neutral/professional (NO Rioplatense slang in artifacts).
 */

import type { Locale } from "../routes";
import type { FaqItem } from "../jsonld";

export interface ObjectionCard {
  /** mono `// kicker` */
  kicker: string;
  /** answer-first H3 */
  title: string;
  /** 2-line substantiation */
  body: string;
  /** mono micro-spec line under the body */
  spec: string;
}

export interface PipelineStage {
  /** real two-digit ordinal — order is genuine (capture → broadcast) */
  n: string;
  /** lucide concept name (rendered inline in the sub-section) */
  icon: "mic" | "audio-waveform" | "cpu" | "share-2";
  title: string;
  body: string;
  /** real artifact rendered as a mono code chip */
  artifact: string;
}

export interface BentoTile {
  kicker: string;
  title: string;
  body: string;
  /** lucide concept name */
  icon:
    | "repeat"
    | "gauge"
    | "shield-x"
    | "file-text"
    | "stethoscope"
    | "refresh-cw"
    | "captions";
  /** when true the tile spans two columns in the bento grid */
  wide?: boolean;
  /** optional contextual pill rendered on the tile */
  badge?: string;
}

export interface VsTeaserRow {
  label: string;
  /** glyph state for the LiveAudio column: yes | no | cond */
  self: "yes" | "no" | "cond";
  /** plain comparison cell for the "cloud / plugins" column */
  other: string;
  /** amber conditional note (e.g. loopback Windows-only) — optional */
  note?: string;
}

export interface HomeCopy {
  /** <head> title + meta description (per-locale) */
  meta: { title: string; description: string };

  hero: {
    eyebrow: string;
    titleA: string;
    accent: string;
    titleATail: string;
    titleB: string;
    subtitle: string;
    download: string;
    how: string;
    microTrust: string[];
    proofAlt: string;
  };

  trust: { label: string; items: string[] };

  demo: {
    /** mono eyebrow */
    eyebrow: string;
    /** ".pill" "real capture" badge text (sits next to a neon live-dot) */
    badge: string;
    /** answer-first H2 */
    heading: string;
    /** one-line lead caption above the demo figures */
    lead: string;
    /** alt text for the current v1.5.0 product screenshot */
    imageAlt: string;
    /** caption under the v1.5.0 screenshot (marks it as the current UI) */
    imageCaption: string;
    /** amber pill marking the old recording as the deprecated Python version */
    legacyBadge: string;
    /** caption under the archived video (deprecated version + new video soon) */
    legacyCaption: string;
    /** toggle label when the video is paused (action: press to play) */
    play: string;
    /** toggle label when the video is playing (action: press to pause) */
    pause: string;
    /** aria-label describing the silent screen-capture video */
    videoAriaLabel: string;
  };

  objections: {
    eyebrow: string;
    heading: string;
    cards: ObjectionCard[];
    /** amber flag rendered on the Linux card (loopback caveat) */
    loopbackFlag: string;
  };

  pipeline: {
    eyebrow: string;
    heading: string;
    intro: string;
    stages: PipelineStage[];
    docsLabel: string;
  };

  paths: {
    eyebrow: string;
    heading: string;
    lead: string;
    tour: { title: string; body: string; cta: string };
    start: { title: string; body: string; cta: string };
    obs: { title: string; body: string; cta: string; docs: string };
  };

  ws: {
    eyebrow: string;
    /** §12 title verbatim */
    title: string;
    /** §12 body verbatim */
    body: string;
    /** payload code-block: filename/port tab + the real broadcast fields */
    codeTab: string;
    codeLines: string[];
    /** diagram node labels */
    diagram: { source: string; signal: string; obs: string; anyClient: string };
  };

  bento: {
    eyebrow: string;
    heading: string;
    tiles: BentoTile[];
  };

  cost: {
    eyebrow: string;
    heading: string;
    intro: string;
  };

  features: {
    eyebrow: string;
    heading: string;
  };

  vsTeaser: {
    eyebrow: string;
    heading: string;
    /** column headers: [feature, LiveAudio, the alternative] */
    columns: [string, string, string];
    rows: VsTeaserRow[];
    /**
     * Accessible text for each self-cell glyph state. The aria-hidden glyph
     * (●/○/◐) is never the sole carrier — these visually-hidden labels mirror
     * the vs-sr pattern in ComparisonPage.astro so screen readers announce
     * yes/no/conditional per row.
     */
    srState: Record<VsTeaserRow["self"], string>;
    cta: string;
  };

  faqTeaser: {
    eyebrow: string;
    heading: string;
    items: FaqItem[];
    cta: string;
  };

  closing: {
    eyebrow: string;
    heading: string;
    body: string;
    /** primary Download CTA label (Download path) */
    download: string;
    /** secondary "How it works" CTA label */
    secondary: string;
  };
}

const en: HomeCopy = {
  meta: {
    title: "LiveAudio — Real-time local captions for OBS",
    description:
      "Free, open-source (MIT) app that generates real-time Whisper speech captions 100% locally and streams them to OBS over a local WebSocket. Windows and Linux.",
  },

  hero: {
    eyebrow: "PLYNTE LIVEAUDIO v1.5.1 · RUST + TAURI 2 · WINDOWS X64",
    titleA: "Real-time ",
    accent: "local",
    titleATail: " captions for your OBS.",
    titleB: "No cloud transcription, subscription, or API key.",
    subtitle:
      "LiveAudio is a free, open-source (MIT) app that transcribes speech locally and sends captions to OBS or other local clients. Its Rust core and Tauri desktop work with a Python inference worker; no cloud transcription service or API key is needed.",
    download: "Download LiveAudio v1.5.1 (free)",
    how: "How it works",
    microTrust: ["Rust + Tauri 2", "100% local", "MIT open-source"],
    proofAlt: "LiveAudio product mark with the LiveAudio name and Plynte attribution.",
  },

  trust: {
    label: "What LiveAudio guarantees",
    items: [
      "Rust + Tauri 2",
      "100% local",
      "MIT open-source",
      "No cloud transcription",
      "No API key",
    ],
  },

  demo: {
    eyebrow: "LIVE DEMO",
    badge: "real capture",
    heading: "See LiveAudio running live.",
    lead: "A v1.5.0 interface screenshot — plus an archived recording of an earlier version below.",
    imageAlt:
      "LiveAudio v1.5.0 desktop showing the Advanced tab with Whisper turbo on CUDA, voice-activity tuning, live subtitle feed and OBS Studio integration.",
    imageCaption: "v1.5.0 (Rust + Tauri 2) — historical capture.",
    legacyBadge: "archived capture · deprecated Python version",
    legacyCaption:
      "Archived recording of an earlier version. The screenshot above shows v1.5.0.",
    play: "Play",
    pause: "Pause",
    videoAriaLabel:
      "Silent screen recording of the LiveAudio interface generating real-time captions and broadcasting them to OBS.",
  },

  objections: {
    eyebrow: "// why LiveAudio",
    heading: "Straight answers to the real objections.",
    cards: [
      {
        kicker: "// 100% local",
        title: "Is it really 100% local?",
        body: "Transcription runs on your machine. Initial setup can require internet for the Python worker and its dependencies; models may also need downloading when first selected. Once the required components and models are available, transcription can run offline.",
        spec: "local transcription · Python worker · setup may need internet",
      },
      {
        kicker: "// linux",
        title: "Does it work on Linux?",
        body: "v1.5.1 focuses on Windows 10/11 x64. Linux users stay on the legacy Python v1.2.7 tarball (microphone capture, needs libportaudio2) until a native Linux build ships. System-audio loopback (WASAPI) is Windows-only.",
        spec: "v1.5.1 windows x64 · linux legacy v1.2.7",
      },
      {
        kicker: "// gpu",
        title: "Do I need a GPU?",
        body: "No. CPU transcription is available. NVIDIA CUDA is optional; detection alone does not ensure that the required CUDA runtime libraries are installed.",
        spec: "cpu works · cuda driver ≥ 525 · vram ≥ 4 GiB",
      },
    ],
    loopbackFlag: "loopback Windows-only",
  },

  pipeline: {
    eyebrow: "// the signal path",
    heading: "From microphone to OBS, locally.",
    intro:
      "Capture audio, keep real speech, decode it locally, then send captions to OBS. Read the docs when you need the implementation details.",
    docsLabel: "Read the signal-path docs",
    stages: [
      {
        n: "01",
        icon: "mic",
        title: "Capture",
        body: "Choose a microphone or supported system audio input.",
        artifact: "mic · system loopback (windows)",
      },
      {
        n: "02",
        icon: "audio-waveform",
        title: "Gate",
        body: "Silero VAD keeps silence out before Whisper decodes.",
        artifact: "silero-vad · onset pre-roll + threshold",
      },
      {
        n: "03",
        icon: "cpu",
        title: "Decode",
        body: "Whisper turns speech into text on CPU or optional CUDA.",
        artifact: "whisper · tiny / base / small / turbo",
      },
      {
        n: "04",
        icon: "share-2",
        title: "Broadcast",
        body: "Local subtitle JSON reaches OBS or another localhost client.",
        artifact: "ws://127.0.0.1:8765",
      },
    ],
  },

  paths: {
    eyebrow: "// choose a path",
    heading: "See the product, install it, or wire it into OBS.",
    lead: "The home page gives you the decision. These routes carry the details without making you scroll through every possible configuration.",
    tour: {
      title: "Product Tour",
      body: "Walk through real released-app states, from first run to diagnostics.",
      cta: "Open the tour",
    },
    start: {
      title: "Getting Started",
      body: "Install, choose a profile, and start the local caption engine.",
      cta: "Start setup",
    },
    obs: {
      title: "OBS Setup & Docs",
      body: "Connect the local subtitle output to OBS, then keep the technical reference nearby.",
      cta: "Set up OBS",
      docs: "Browse docs",
    },
  },

  ws: {
    eyebrow: "// integration",
    title: "Works with OBS — or any WebSocket client.",
    body: "LiveAudio broadcasts clean subtitle JSON over a local WebSocket (ws://127.0.0.1:8765). OBS is the built-in target via the included subtitulos_obs.html overlay, but any HTML or WebSocket client on localhost can connect and receive the same broadcast — so you can build your own consumer or wire it into other local tools. Connections are accepted only from localhost; no auth needed.",
    codeTab: "ws://127.0.0.1:8765",
    codeLines: [
      "{",
      '  "id": 482,',
      '  "text": "real-time local captions",',
      '  "style": "live",',
      '  "latency": 1.1,',
      '  "total_delay": 1.3,',
      '  "is_replay": false',
      "}",
    ],
    diagram: {
      source: "LiveAudio",
      signal: "subtitle JSON",
      obs: "OBS Browser Source",
      anyClient: "any localhost client",
    },
  },

  bento: {
    eyebrow: "// in the box",
    heading:
      "Built-in tools include an adaptive overlay, device and model selection, profiles, session files and local diagnostics.",
    tiles: [
      {
        kicker: "// obs overlay",
        title: "Adaptive ribbon overlay",
        body: "The OBS overlay adds an adaptive vertical “ribbon” subtitle buffer, with improved subtitle legibility and capped reveal-animation timing.",
        icon: "captions",
        wide: true,
        badge: "adaptive overlay",
      },
      {
        kicker: "// hot-swap",
        title: "Hot-swap device & model",
        body: "Change the audio device or Whisper model without restarting. Apply changes and the engine reconfigures live.",
        icon: "repeat",
        wide: true,
      },
      {
        kicker: "// profiles",
        title: "FPS-aware profiles",
        body: "Fast, Balanced, Quality and Stable Streaming presets balance latency against GPU load while you game.",
        icon: "gauge",
      },
      {
        kicker: "// blacklist",
        title: "Hallucination blacklist",
        body: "An editable blacklist filters out the junk phrases Whisper invents on silence — and you control the list.",
        icon: "shield-x",
      },
      {
        kicker: "// session files",
        title: "Session files",
        body: "Every run saves transcript.jsonl and subtitles.vtt (plus session.json) so nothing valid is ever lost.",
        icon: "file-text",
        wide: true,
      },
      {
        kicker: "// diagnostics",
        title: "Local-first diagnostics",
        body: "Export sanitizes secrets and paths and excludes raw audio and full transcripts. The application does not send telemetry.",
        icon: "stethoscope",
      },
      {
        kicker: "// updates",
        title: "Release information",
        body: "Find new versions on GitHub Releases. Back up settings and sessions before upgrading.",
        icon: "refresh-cw",
      },
    ],
  },

  cost: {
    eyebrow: "// the math",
    heading: "Local beats per-minute pricing.",
    intro:
      "Cloud ASR APIs bill per minute; LiveAudio bills you nothing. Slide the hours to compare what cloud transcription would cost against your own electricity — hardware not included.",
  },

  features: {
    eyebrow: "// capabilities",
    heading: "Built for real streaming sessions.",
  },

  vsTeaser: {
    eyebrow: "// the short version",
    heading: "How LiveAudio compares at a glance.",
    columns: ["", "LiveAudio", "Cloud ASR / plugins"],
    // Rows mirror the full /vs/ page: each LiveAudio cell scores a POSITIVE
    // capability ● .vs-yes for the SAME fact (never the inverted ○). The
    // alternatives column carries the trade-off.
    rows: [
      { label: "100% local", self: "yes", other: "cloud-dependent" },
      { label: "$0 per-minute cost", self: "yes", other: "billed per minute" },
      { label: "No API key required", self: "yes", other: "usually required" },
      {
        label: "System-audio loopback",
        self: "cond",
        other: "varies",
        note: "Windows-only",
      },
    ],
    srState: { yes: "Yes", no: "No", cond: "Conditional" },
    cta: "See the full comparison",
  },

  faqTeaser: {
    eyebrow: "// answers",
    heading: "The questions people ask first.",
    items: [
      {
        question: "Is it really 100% local?",
        answer:
          "Transcription runs locally. Initial setup may need internet for the Python worker and its dependencies, and a model may need downloading when first selected.",
      },
      {
        question: "Does it work on Linux?",
        answer:
          "v1.5.1 focuses on Windows 10/11 x64; Linux users stay on the legacy Python v1.2.7 tarball with microphone capture (needs libportaudio2). System-audio loopback is Windows-only.",
      },
      {
        question: "Is it free and open-source?",
        answer:
          "Yes. LiveAudio is free and open-source under the MIT license. No subscription and no API key.",
      },
      {
        question: "What's the latency?",
        answer:
          "Latency depends on speech segmentation, model, hardware and system load. Profiles let you adjust the tradeoff between responsiveness and accuracy.",
      },
    ],
    cta: "Read the full FAQ",
  },

  closing: {
    eyebrow: "// download",
    heading: "Local captions in your OBS in minutes.",
    body: "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.",
    download: "Download LiveAudio v1.5.1 (free)",
    secondary: "How it works",
  },
};

const es: HomeCopy = {
  meta: {
    title: "LiveAudio — Subtítulos locales en tiempo real para OBS",
    description:
      "App gratuita y de código abierto (MIT) que genera subtítulos de voz Whisper en tiempo real 100% en tu equipo y los envía a OBS por un WebSocket local. Windows y Linux.",
  },

  hero: {
    eyebrow: "PLYNTE LIVEAUDIO v1.5.1 · RUST + TAURI 2 · WINDOWS X64",
    titleA: "Subtítulos ",
    accent: "locales",
    titleATail: " en tiempo real para tu OBS.",
    titleB: "Sin transcripción en la nube, suscripción ni clave API.",
    subtitle:
      "LiveAudio es una app gratuita y de código abierto (MIT) que transcribe voz localmente y envía subtítulos a OBS u otros clientes locales. Su núcleo Rust y escritorio Tauri trabajan con un worker de inferencia Python, sin servicio de transcripción en la nube ni clave API.",
    download: "Descargar LiveAudio v1.5.1 (gratis)",
    how: "Cómo funciona",
    microTrust: ["Rust + Tauri 2", "100% local", "Código abierto MIT"],
    proofAlt: "Marca del producto LiveAudio con el nombre LiveAudio y la atribución a Plynte.",
  },

  trust: {
    label: "Lo que garantiza LiveAudio",
    items: [
      "Rust + Tauri 2",
      "100% local",
      "Código abierto MIT",
      "Sin transcripción en la nube",
      "Sin API key",
    ],
  },

  demo: {
    eyebrow: "DEMO EN VIVO",
    badge: "captura real",
    heading: "Mira LiveAudio funcionando en vivo.",
    lead: "Una captura de la interfaz v1.5.0 y una grabación archivada de una versión anterior.",
    imageAlt:
      "Escritorio de LiveAudio v1.5.0 con la pestaña Avanzado: Whisper turbo en CUDA, ajuste de actividad de voz, feed de subtítulos en vivo e integración con OBS Studio.",
    imageCaption: "v1.5.0 (Rust + Tauri 2) — captura histórica.",
    legacyBadge: "captura archivada · versión Python obsoleta",
    legacyCaption:
      "Grabación archivada de una versión anterior. La captura de arriba muestra la v1.5.0.",
    play: "Reproducir",
    pause: "Pausar",
    videoAriaLabel:
      "Grabación de pantalla sin audio de la interfaz de LiveAudio generando subtítulos en tiempo real y enviándolos a OBS.",
  },

  objections: {
    eyebrow: "// por qué LiveAudio",
    heading: "Respuestas directas a las objeciones reales.",
    cards: [
      {
        kicker: "// 100% local",
        title: "¿De verdad es 100% local?",
        body: "La transcripción ocurre en tu equipo. La configuración inicial puede necesitar internet para el worker Python y sus dependencias; también puede ser necesario descargar cada modelo al seleccionarlo por primera vez. Una vez disponibles los componentes y modelos necesarios, la transcripción puede funcionar sin conexión.",
        spec: "transcripción local · worker Python · conexión para configurar",
      },
      {
        kicker: "// linux",
        title: "¿Funciona en Linux?",
        body: "La v1.5.1 se enfoca en Windows 10/11 x64. En Linux sigue el tarball heredado Python v1.2.7 (captura por micrófono, necesita libportaudio2) hasta que salga una build nativa. El loopback de audio del sistema (WASAPI) es solo de Windows.",
        spec: "v1.5.1 windows x64 · linux heredado v1.2.7",
      },
      {
        kicker: "// gpu",
        title: "¿Necesito una GPU?",
        body: "No. La transcripción puede usar la CPU. NVIDIA CUDA es opcional; la detección por sí sola no garantiza que estén instaladas las bibliotecas necesarias para CUDA.",
        spec: "la cpu funciona · cuda driver ≥ 525 · vram ≥ 4 GiB",
      },
    ],
    loopbackFlag: "loopback solo Windows",
  },

  pipeline: {
    eyebrow: "// el camino de la señal",
    heading: "Del micrófono a OBS, localmente.",
    intro:
      "Captura audio, conserva la voz real, la decodifica localmente y envía subtítulos a OBS. Consulta la documentación cuando necesites los detalles de implementación.",
    docsLabel: "Leer la documentación del flujo",
    stages: [
      {
        n: "01",
        icon: "mic",
        title: "Captura",
        body: "Elige un micrófono o una entrada de audio del sistema compatible.",
        artifact: "micrófono · loopback del sistema (windows)",
      },
      {
        n: "02",
        icon: "audio-waveform",
        title: "Filtra",
        body: "Silero VAD deja fuera el silencio antes de que Whisper decodifique.",
        artifact: "silero-vad · pre-roll de inicio + umbral",
      },
      {
        n: "03",
        icon: "cpu",
        title: "Decodifica",
        body: "Whisper convierte el habla en texto en CPU o CUDA opcional.",
        artifact: "whisper · tiny / base / small / turbo",
      },
      {
        n: "04",
        icon: "share-2",
        title: "Emite",
        body: "El JSON de subtítulos local llega a OBS u otro cliente en localhost.",
        artifact: "ws://127.0.0.1:8765",
      },
    ],
  },

  paths: {
    eyebrow: "// elige un camino",
    heading: "Conoce el producto, instálalo o conéctalo a OBS.",
    lead: "La página de inicio te ayuda a decidir. Estas rutas llevan los detalles sin obligarte a recorrer cada configuración posible.",
    tour: {
      title: "Tour del producto",
      body: "Recorre estados reales de la app publicada, desde el primer inicio hasta el diagnóstico.",
      cta: "Abrir el tour",
    },
    start: {
      title: "Primeros pasos",
      body: "Instala, elige un perfil e inicia el motor local de subtítulos.",
      cta: "Empezar la configuración",
    },
    obs: {
      title: "Configuración de OBS y docs",
      body: "Conecta la salida local de subtítulos a OBS y conserva la referencia técnica cerca.",
      cta: "Configurar OBS",
      docs: "Ver docs",
    },
  },

  ws: {
    eyebrow: "// integración",
    title: "Funciona con OBS — o cualquier cliente WebSocket.",
    body: "LiveAudio emite subtítulos en JSON limpio por un WebSocket local (ws://127.0.0.1:8765). OBS es el destino integrado mediante el overlay subtitulos_obs.html, pero cualquier cliente HTML o WebSocket en localhost puede conectarse y recibir la misma transmisión — así puedes construir tu propio consumidor o integrarlo con otras herramientas locales. Solo se aceptan conexiones desde localhost; no requiere autenticación.",
    codeTab: "ws://127.0.0.1:8765",
    codeLines: [
      "{",
      '  "id": 482,',
      '  "text": "subtítulos locales en tiempo real",',
      '  "style": "live",',
      '  "latency": 1.1,',
      '  "total_delay": 1.3,',
      '  "is_replay": false',
      "}",
    ],
    diagram: {
      source: "LiveAudio",
      signal: "subtítulos JSON",
      obs: "OBS Browser Source",
      anyClient: "cualquier cliente en localhost",
    },
  },

  bento: {
    eyebrow: "// incluido",
    heading:
      "Las herramientas incluyen un overlay adaptable, selección de dispositivo y modelo, perfiles, archivos de sesión y diagnóstico local.",
    tiles: [
      {
        kicker: "// overlay obs",
        title: "Overlay de cinta adaptable",
        body: "El overlay de OBS suma un búfer de subtítulos en “cinta” vertical adaptable, con mejor legibilidad de los subtítulos y un tiempo de animación de aparición acotado.",
        icon: "captions",
        wide: true,
        badge: "overlay adaptable",
      },
      {
        kicker: "// hot-swap",
        title: "Cambio de dispositivo y modelo en caliente",
        body: "Cambia el dispositivo de audio o el modelo de Whisper sin reiniciar. Aplica los cambios y el motor se reconfigura en vivo.",
        icon: "repeat",
        wide: true,
      },
      {
        kicker: "// perfiles",
        title: "Perfiles que cuidan los FPS",
        body: "Los presets Fast, Balanced, Quality y Stable Streaming equilibran la latencia con la carga de GPU mientras juegas.",
        icon: "gauge",
      },
      {
        kicker: "// blacklist",
        title: "Blacklist de alucinaciones",
        body: "Una blacklist editable filtra las frases basura que Whisper inventa en el silencio — y tú controlas la lista.",
        icon: "shield-x",
      },
      {
        kicker: "// archivos de sesión",
        title: "Archivos de sesión",
        body: "Cada ejecución guarda transcript.jsonl y subtitles.vtt (más session.json), así nada válido se pierde.",
        icon: "file-text",
        wide: true,
      },
      {
        kicker: "// diagnóstico",
        title: "Diagnóstico local",
        body: "La exportación sanea secretos y rutas y excluye audio crudo y transcripciones completas. La aplicación no envía telemetría.",
        icon: "stethoscope",
      },
      {
        kicker: "// actualizaciones",
        title: "Información de versiones",
        body: "Consulta las versiones nuevas en GitHub Releases. Respalda la configuración y las sesiones antes de actualizar.",
        icon: "refresh-cw",
      },
    ],
  },

  cost: {
    eyebrow: "// las cuentas",
    heading: "Lo local le gana al pago por minuto.",
    intro:
      "Las APIs de ASR en la nube cobran por minuto; LiveAudio no te cobra nada. Desliza las horas para comparar lo que costaría la transcripción en la nube frente a tu propia electricidad — el hardware no está incluido.",
  },

  features: {
    eyebrow: "// capacidades",
    heading: "Pensado para sesiones de streaming reales.",
  },

  vsTeaser: {
    eyebrow: "// la versión corta",
    heading: "Cómo se compara LiveAudio de un vistazo.",
    columns: ["", "LiveAudio", "ASR en la nube / plugins"],
    // Las filas reflejan la página /vs/ completa: cada celda de LiveAudio puntúa
    // una capacidad POSITIVA ● .vs-yes para el MISMO hecho (nunca el ○ invertido).
    // La columna de alternativas carga la contrapartida.
    rows: [
      { label: "100% local", self: "yes", other: "depende de la nube" },
      { label: "$0 de costo por minuto", self: "yes", other: "se cobra por minuto" },
      { label: "Sin API key", self: "yes", other: "normalmente sí" },
      {
        label: "Loopback de audio del sistema",
        self: "cond",
        other: "varía",
        note: "solo Windows",
      },
    ],
    srState: { yes: "Sí", no: "No", cond: "Condicional" },
    cta: "Ver la comparativa completa",
  },

  faqTeaser: {
    eyebrow: "// respuestas",
    heading: "Las preguntas que aparecen primero.",
    items: [
      {
        question: "¿De verdad es 100% local?",
        answer:
          "La transcripción ocurre localmente. La configuración inicial puede necesitar internet para el worker Python y sus dependencias, y un modelo puede requerir una descarga al seleccionarlo por primera vez.",
      },
      {
        question: "¿Funciona en Linux?",
        answer:
          "La v1.5.1 se enfoca en Windows 10/11 x64; en Linux sigue el tarball heredado Python v1.2.7 con captura por micrófono (necesita libportaudio2). El loopback de audio del sistema es solo de Windows.",
      },
      {
        question: "¿Es gratis y de código abierto?",
        answer:
          "Sí. LiveAudio es gratuito y de código abierto bajo licencia MIT. Sin suscripción y sin API key.",
      },
      {
        question: "¿Cuál es la latencia?",
        answer:
          "La latencia depende de la segmentación de voz, el modelo, el hardware y la carga del sistema. Los perfiles permiten ajustar el equilibrio entre respuesta y precisión.",
      },
    ],
    cta: "Leer las FAQ completas",
  },

  closing: {
    eyebrow: "// descargar",
    heading: "Subtítulos locales en tu OBS en minutos.",
    body: "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido.",
    download: "Descargar LiveAudio v1.5.1 (gratis)",
    secondary: "Cómo funciona",
  },
};

const HOME_COPY: Record<Locale, HomeCopy> = { en, es };

/** Returns the Home copy table for the given locale. */
export function homeCopy(lang: Locale): HomeCopy {
  return HOME_COPY[lang];
}
