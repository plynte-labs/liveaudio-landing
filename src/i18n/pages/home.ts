/**
 * Home page copy — bilingual marketing content for the conversion funnel.
 *
 * Single source for every Home sub-section (Hero, Trust strip, objection cards,
 * live demo, pipeline, WebSocket panel, feature bento, vs teaser, FAQ teaser,
 * closing Download module). Chrome strings (nav/footer/common CTAs) live in
 * ui.ts; this file holds ONLY page-specific Home copy.
 *
 * Spanish is neutral/professional (no regional slang or Spanglish leaks).
 */

import type { Locale } from "../routes";
import type { FaqItem } from "../jsonld";
import { LIVEAUDIO_TAG } from "../../config/release";

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
  /** amber conditional note — optional */
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
    /** alt text for the native Rust + Tauri 2 setup home capture */
    setupAlt: string;
    /** honest caption under the setup home capture */
    setupCaption: string;
    /** alt text for the native Rust + Tauri 2 style editor capture */
    styleAlt: string;
    /** honest caption under the style editor capture */
    styleCaption: string;
  };

  objections: {
    eyebrow: string;
    heading: string;
    cards: ObjectionCard[];
    /** amber operator note rendered on the Linux card */
    linuxNoteFlag: string;
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
    title: string;
    body: string;
    codeTab: string;
    codeLines: string[];
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
    columns: [string, string, string];
    rows: VsTeaserRow[];
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
    download: string;
    secondary: string;
  };
}

const en: HomeCopy = {
  meta: {
    title: "LiveAudio — Real-time local captions for OBS (Parakeet-TDT & Whisper)",
    description:
      "Free, open-source (MIT) native Rust desktop app for Windows & Linux that generates real-time captions 100% locally with NVIDIA Parakeet-TDT and Whisper and streams them to OBS — zero data collected or retained by the app.",
  },

  hero: {
    eyebrow: `PLYNTE LIVEAUDIO ${LIVEAUDIO_TAG} · 100% RUST + TAURI 2 · WINDOWS X64 & LINUX X86_64`,
    titleA: "Real-time ",
    accent: "local",
    titleATail: " captions for your OBS.",
    titleB: "No cloud transcription, subscription, or API key.",
    subtitle:
      "LiveAudio is a free, open-source (MIT) app that generates real-time captions 100% locally and streams them to OBS. Powered by NVIDIA Parakeet (recommended for EN/ES — ~2× faster on CPU, near-zero silence hallucinations) and Whisper on native Rust + ONNX Runtime (DirectML / CPU / optional CUDA). Zero Python, no cloud transcription, no API key, and zero data collected or retained by the app.",
    download: `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
    how: "How it works",
    microTrust: [
      "NVIDIA Parakeet-TDT + Whisper",
      "Zero Python",
      "Zero app data collected",
      "Windows & Linux",
      "MIT open-source",
    ],
    proofAlt: "LiveAudio product mark with the LiveAudio name and Plynte attribution.",
  },

  trust: {
    label: "What LiveAudio guarantees",
    items: [
      "NVIDIA Parakeet-TDT + Whisper",
      "100% Native Rust",
      "Zero Python",
      "Zero data collected in app",
      "Windows x64 & Linux x86_64",
      "No API key",
      "MIT open-source",
    ],
  },

  demo: {
    eyebrow: "LIVE INTERFACE",
    badge: "real desktop captures",
    heading: "See the native Rust + Tauri 2 workspace.",
    lead: "Real desktop captures of the native Rust + Tauri 2 app showing local setup with OBS Browser Source wiring and the live 7-theme subtitle style editor.",
    setupAlt:
      "LiveAudio native Rust and Tauri 2 main window showing the Setup tab (audio source, spoken language, Balanced profile), Live Subtitles Feed, OBS Studio Browser Source URL with Copy URL button, and Event Log.",
    setupCaption:
      "Native Rust + Tauri 2 desktop capture (v1.6.0 baseline UI) — Setup tab, live subtitle feed, and one-click Copy URL for OBS Browser Source.",
    styleAlt:
      "LiveAudio native Rust and Tauri 2 Style tab showing the built-in style selector, custom preset controls (Save, Delete, Reset), and live subtitle preview.",
    styleCaption:
      "Live Style Editor capture (v1.6.0 baseline UI) — switch live across 7 built-in OBS themes (default, karaoke, neon, minimal, bold, rgb, typewriter) and custom presets.",
  },

  objections: {
    eyebrow: "// why LiveAudio",
    heading: "Straight answers to the real objections.",
    cards: [
      {
        kicker: "// zero app data",
        title: "Is it really 100% local?",
        body: "Yes. Running 100% locally is the core benefit: the desktop app collects zero data and retains zero data. Audio and transcripts never leave your machine — outbound requests are limited to on-demand SHA-256 model downloads, an optional 24 h update check (zero telemetry, toggleable), and opt-in CUDA runtime downloads. Only this website uses Microsoft Clarity for web analytics.",
        spec: "zero app data · zero telemetry · 100% native Rust · zero Python",
      },
      {
        kicker: "// windows & linux",
        title: "Does it work on Linux?",
        body: "Yes. LiveAudio ships a Windows 10/11 x64 NSIS installer and prebuilt Linux x86_64 .AppImage and .deb packages. System-audio loopback works on both Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture with ALSA fallback). Signed Minisign Ed25519 in-app updates work on Windows and Linux .AppImage.",
        spec: "windows wasapi + linux pipewire/pulseaudio loopback · appimage + deb",
      },
      {
        kicker: "// cpu & gpu",
        title: "Do I need a GPU?",
        body: "No. NVIDIA Parakeet-TDT 0.6B v3 (int8 on CPU) is ~2× faster on CPU than Whisper small, emits blank on silence for near-zero hallucinations, and runs smoothly on 4-thread CPU-only laptops with automatic CPU threads. DirectML (DirectX 12 GPU) and optional CTranslate2 CUDA 12.8 acceleration are also built in.",
        spec: "parakeet-tdt int8 cpu · directml dx12 · optional cuda 12.8 (ct2)",
      },
    ],
    linuxNoteFlag: "Linux .deb updates via GitHub Releases",
  },

  pipeline: {
    eyebrow: "// the signal path",
    heading: "From microphone or desktop audio to OBS, locally.",
    intro:
      "Capture audio on Windows or Linux, gate silence locally, decode with NVIDIA Parakeet-TDT or Whisper, then stream captions to OBS. Read the docs when you want the implementation details.",
    docsLabel: "Read the signal-path docs",
    stages: [
      {
        n: "01",
        icon: "mic",
        title: "Capture",
        body: "Choose a physical microphone or system-audio loopback on Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture with ALSA fallback).",
        artifact: "mic · wasapi (win) · pipewire / pulseaudio / alsa (linux)",
      },
      {
        n: "02",
        icon: "audio-waveform",
        title: "Gate",
        body: "Silero VAD keeps silence out before decoding, with configurable onset pre-roll, threshold, and optional local RNNoise suppression.",
        artifact: "silero-vad · onset pre-roll + threshold · optional rnnoise",
      },
      {
        n: "03",
        icon: "cpu",
        title: "Decode",
        body: "NVIDIA Parakeet-TDT 0.6B v3 (recommended for EN/ES — ~2× faster on CPU, near-zero silence hallucinations, smooth on 4-thread laptops) alongside Whisper (other languages, translate-to-English, context prompts) on ONNX Runtime (CPU / DirectML) + optional CTranslate2 CUDA.",
        artifact: "parakeet-tdt 0.6b v3 · whisper · onnx runtime · optional cuda",
      },
      {
        n: "04",
        icon: "share-2",
        title: "Broadcast",
        body: "Local subtitle JSON reaches OBS over localhost with CSWSH origin allowlist, 7 live themes, anti-burst /overlay reconnection, and local .srt/.vtt/.jsonl recording.",
        artifact: "ws://127.0.0.1:8765 · 7 themes · anti-burst /overlay",
      },
    ],
  },

  paths: {
    eyebrow: "// choose a path",
    heading: "See the product, install it, or wire it into OBS.",
    lead: "The home page gives you the decision. These routes carry the details without making you scroll through every possible configuration.",
    tour: {
      title: "Product Tour",
      body: "Walk through real released-app states, from local setup to the style editor and diagnostics.",
      cta: "Open the tour",
    },
    start: {
      title: "Getting Started",
      body: "Install on Windows or Linux, pick Parakeet-TDT or Whisper, and start the local caption engine.",
      cta: "Start setup",
    },
    obs: {
      title: "OBS Setup & Docs",
      body: "Connect the local subtitle output to OBS with 7 live themes, then keep the technical reference nearby.",
      cta: "Set up OBS",
      docs: "Browse docs",
    },
  },

  ws: {
    eyebrow: "// integration",
    title: "Works with OBS — or any WebSocket client.",
    body: "LiveAudio broadcasts clean subtitle JSON over a local WebSocket (ws://127.0.0.1:8765). OBS connects through the built-in /overlay Browser Source with 7 live themes and anti-burst reconnection, protected by a loopback-only listener and configurable Origin allowlist against Cross-Site WebSocket Hijacking (CSWSH).",
    codeTab: "ws://127.0.0.1:8765",
    codeLines: [
      "{",
      '  "id": "utt_42",',
      '  "text": "real-time local captions",',
      '  "style": "karaoke",',
      '  "latency": 0.5,',
      '  "total_delay": 0.7,',
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
    eyebrow: "// built for real streams",
    heading:
      "Prebuilt native Rust desktop app for Windows & Linux with Parakeet-TDT ONNX + built-in OBS overlay.",
    tiles: [
      {
        kicker: "// 7 obs themes",
        title: "7 live OBS themes & anti-burst /overlay",
        body: "Switch themes live without touching OBS: default, karaoke, neon, minimal, bold, rgb, and typewriter. Built-in anti-burst /overlay reconnection keeps captions clean if OBS reconnects mid-stream.",
        icon: "captions",
        wide: true,
        badge: "live themes",
      },
      {
        kicker: "// session recording",
        title: ".srt (DaVinci Resolve-ready), .vtt & .jsonl",
        body: "Every session writes SubRip (.srt, ready to drop straight into DaVinci Resolve), WebVTT (.vtt), and structured .jsonl transcripts locally on disk — zero cloud uploads.",
        icon: "file-text",
        wide: true,
        badge: "davinci resolve",
      },
      {
        kicker: "// mcp & opencohost",
        title: "Dual-consent MCP & OpenCohost sync",
        body: "Connect local AI assistants via liveaudio-cli mcp behind separate Style and System consent switches, plus a Follow OpenCohost Language switch for instant locale sync.",
        icon: "repeat",
      },
      {
        kicker: "// blacklist",
        title: "Edge-trimming Blacklist & switches",
        body: "Upgraded whole-word matching trims blacklisted phrases only at utterance edges so long sentences are never dropped, with dedicated switches for context prompt and blacklist.",
        icon: "shield-x",
      },
      {
        kicker: "// cpu & advanced",
        title: "Automatic CPU threads & Advanced tab",
        body: "Redesigned Advanced tab with an automatic CPU threads switch so Parakeet-TDT int8 runs smoothly on 4-thread CPU-only laptops alongside DirectML and optional CUDA 12.8.",
        icon: "gauge",
      },
      {
        kicker: "// stream-safe updates",
        title: "Stream-safe signed updates",
        body: "Minisign Ed25519 signed in-app updates on Windows (NSIS) and Linux (.AppImage) check GitHub Releases every 24 h (toggleable, zero telemetry) and block updates while live or OBS is connected (.deb updates via GitHub Releases).",
        icon: "refresh-cw",
      },
    ],
  },

  cost: {
    eyebrow: "// the math",
    heading: "Local beats per-minute pricing.",
    intro:
      "Cloud ASR APIs bill per minute; LiveAudio bills you nothing. Compare what cloud transcription would cost against your own electricity — hardware not included.",
  },

  features: {
    eyebrow: "// capabilities",
    heading: "Built for real streaming sessions.",
  },

  vsTeaser: {
    eyebrow: "// the short version",
    heading: "How LiveAudio compares at a glance.",
    columns: ["", "LiveAudio", "Cloud ASR / plugins"],
    rows: [
      { label: "100% local · zero app data", self: "yes", other: "cloud-dependent" },
      { label: "$0 per-minute cost", self: "yes", other: "billed per minute" },
      { label: "No API key required", self: "yes", other: "usually required" },
      {
        label: "System-audio loopback",
        self: "yes",
        other: "varies",
        note: "Windows WASAPI + Linux PipeWire/PulseAudio",
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
          `Yes. LiveAudio ${LIVEAUDIO_TAG} runs NVIDIA Parakeet-TDT and Whisper 100% locally in native Rust + ONNX Runtime with zero Python and zero data collected or retained by the desktop app (only this website uses Microsoft Clarity for web analytics).`,
      },
      {
        question: "Does it work on Linux?",
        answer:
          `Yes. LiveAudio ${LIVEAUDIO_TAG} ships a Windows 10/11 x64 installer and Linux x86_64 .AppImage and .deb packages, with system-audio loopback on both Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture + ALSA fallback) and signed Minisign in-app updates on Windows and Linux .AppImage.`,
      },
      {
        question: "Do I need a GPU?",
        answer:
          "No. NVIDIA Parakeet-TDT 0.6B v3 int8 is ~2× faster on CPU than Whisper small and runs smoothly on 4-thread CPU-only laptops, with DirectML (DirectX 12 GPU) and optional CTranslate2 CUDA 12.8 acceleration also built in.",
      },
      {
        question: "Is it free and open-source?",
        answer:
          "Yes. LiveAudio is free and open-source under the MIT license, with no subscription and no API key — audio and transcripts never leave your machine.",
      },
    ],
    cta: "Read the full FAQ",
  },

  closing: {
    eyebrow: "// download",
    heading: "Local captions in your OBS in minutes.",
    body: "Free & open-source (MIT) for Windows x64 & Linux x86_64. NVIDIA Parakeet-TDT + Whisper, zero Python, no API key, and zero data collected or retained by the desktop app.",
    download: `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
    secondary: "How it works",
  },
};

const es: HomeCopy = {
  meta: {
    title: "LiveAudio — Subtítulos locales en tiempo real para OBS (Parakeet-TDT y Whisper)",
    description:
      "App de escritorio nativa en Rust, gratuita y de código abierto (MIT) para Windows y Linux que genera subtítulos en tiempo real 100% en local con NVIDIA Parakeet-TDT y Whisper y los envía a OBS sin recopilar ni retener datos.",
  },

  hero: {
    eyebrow: `PLYNTE LIVEAUDIO ${LIVEAUDIO_TAG} · 100% RUST + TAURI 2 · WINDOWS X64 Y LINUX X86_64`,
    titleA: "Subtítulos ",
    accent: "locales",
    titleATail: " en tiempo real para tu OBS.",
    titleB: "Sin transcripción en la nube, suscripción ni clave API.",
    subtitle:
      "LiveAudio es una app gratuita y de código abierto (MIT) que genera subtítulos en tiempo real 100% en tu equipo y los envía a OBS. Impulsada por NVIDIA Parakeet (recomendado para ES/EN — ~2× más rápido en CPU y casi sin alucinaciones) y Whisper en Rust nativo + ONNX Runtime (DirectML / CPU / CUDA opcional). Cero Python, sin nube, sin claves API y sin recolección ni retención de datos en la app.",
    download: `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
    how: "Cómo funciona",
    microTrust: [
      "NVIDIA Parakeet-TDT + Whisper",
      "Cero Python",
      "Sin recolección de datos en la app",
      "Windows y Linux",
      "Código abierto MIT",
    ],
    proofAlt: "Marca del producto LiveAudio con el nombre LiveAudio y la atribución a Plynte.",
  },

  trust: {
    label: "Lo que garantiza LiveAudio",
    items: [
      "NVIDIA Parakeet-TDT + Whisper",
      "100% Rust nativo",
      "Cero Python",
      "Cero datos recopilados en la app",
      "Windows x64 y Linux x86_64",
      "Sin clave API",
      "Código abierto MIT",
    ],
  },

  demo: {
    eyebrow: "INTERFAZ EN VIVO",
    badge: "capturas reales de escritorio",
    heading: "Conoce el espacio nativo en Rust + Tauri 2.",
    lead: "Capturas reales de la aplicación nativa en Rust + Tauri 2 mostrando la configuración local con integración de OBS Studio y el editor en vivo de 7 temas.",
    setupAlt:
      "Ventana principal de LiveAudio en Rust nativo y Tauri 2 mostrando la pestaña Setup (fuente de audio, idioma hablado, perfil Balanced), feed de subtítulos en vivo, URL de fuente de navegador de OBS Studio con botón Copiar URL y registro de eventos.",
    setupCaption:
      "Captura de escritorio Rust + Tauri 2 (interfaz base v1.6.0) — pestaña de configuración, feed de subtítulos en vivo y botón Copiar URL para OBS Studio.",
    styleAlt:
      "Pestaña Style de LiveAudio en Rust nativo y Tauri 2 mostrando el selector de estilos integrados, gestión de presets (Guardar, Eliminar, Restablecer) y vista previa en vivo.",
    styleCaption:
      "Captura del editor de estilos en vivo (interfaz base v1.6.0) — cambia al instante entre 7 temas integrados para OBS (default, karaoke, neon, minimal, bold, rgb, typewriter) y presets propios.",
  },

  objections: {
    eyebrow: "// por qué LiveAudio",
    heading: "Respuestas directas a las objeciones reales.",
    cards: [
      {
        kicker: "// cero datos en la app",
        title: "¿De verdad es 100% local?",
        body: "Sí. Ejecutarse 100% en tu equipo es el beneficio principal: la app de escritorio no recopila ni retiene ningún dato. El audio y las transcripciones nunca salen de tu equipo; la red saliente se limita a descargas de modelos verificadas por SHA-256 bajo demanda, comprobación opcional de actualizaciones cada 24 h (cero telemetría, desactivable) y descarga voluntaria de CUDA. Solo este sitio web usa Microsoft Clarity para analítica web.",
        spec: "cero datos en la app · cero telemetría · 100% Rust nativo · cero Python",
      },
      {
        kicker: "// windows y linux",
        title: "¿Funciona en Linux?",
        body: "Sí. LiveAudio incluye un instalador NSIS para Windows 10/11 x64 y paquetes precompilados .AppImage y .deb para Linux x86_64. El loopback de audio del sistema funciona tanto en Windows (WASAPI) como en Linux (captura de monitor PipeWire/PulseAudio con respaldo ALSA). Las actualizaciones firmadas con Minisign Ed25519 dentro de la app funcionan en Windows y en Linux .AppImage.",
        spec: "loopback windows wasapi + linux pipewire/pulseaudio · appimage + deb",
      },
      {
        kicker: "// cpu y gpu",
        title: "¿Necesito una GPU?",
        body: "No. NVIDIA Parakeet-TDT 0.6B v3 (int8 en CPU) es ~2× más rápido en CPU que Whisper small, emite blanco en silencio para eliminar casi por completo las alucinaciones y corre con fluidez en portátiles solo con CPU de 4 hilos gracias al selector automático de hilos. También incluye DirectML (GPU DirectX 12) y soporte opcional CTranslate2 CUDA 12.8.",
        spec: "parakeet-tdt int8 cpu · directml dx12 · cuda 12.8 opcional (ct2)",
      },
    ],
    linuxNoteFlag: "Linux .deb se actualiza vía GitHub Releases",
  },

  pipeline: {
    eyebrow: "// el camino de la señal",
    heading: "Del micrófono o audio del sistema a OBS, en local.",
    intro:
      "Captura audio en Windows o Linux, filtra el silencio en local, decodifica con NVIDIA Parakeet-TDT o Whisper y envía subtítulos a OBS. Consulta la documentación cuando necesites el detalle técnico.",
    docsLabel: "Leer la documentación del flujo",
    stages: [
      {
        n: "01",
        icon: "mic",
        title: "Captura",
        body: "Elige un micrófono físico o el loopback de audio del sistema en Windows (WASAPI) y Linux (monitor PipeWire/PulseAudio con respaldo ALSA).",
        artifact: "micrófono · wasapi (win) · pipewire / pulseaudio / alsa (linux)",
      },
      {
        n: "02",
        icon: "audio-waveform",
        title: "Filtra",
        body: "Silero VAD deja fuera el silencio antes de decodificar, con pre-roll de inicio y umbral configurables más supresión local opcional RNNoise.",
        artifact: "silero-vad · pre-roll + umbral · rnnoise opcional",
      },
      {
        n: "03",
        icon: "cpu",
        title: "Decodifica",
        body: "NVIDIA Parakeet-TDT 0.6B v3 (recomendado para ES/EN — ~2× más rápido en CPU, casi sin alucinaciones en silencio, fluido en equipos de 4 hilos) junto con Whisper (otros idiomas, traducción al inglés, prompts de contexto) sobre ONNX Runtime (CPU / DirectML) y CTranslate2 CUDA opcional.",
        artifact: "parakeet-tdt 0.6b v3 · whisper · onnx runtime · cuda opcional",
      },
      {
        n: "04",
        icon: "share-2",
        title: "Emite",
        body: "El JSON de subtítulos local llega a OBS por localhost con lista blanca de orígenes anti-CSWSH, 7 temas en vivo, reconexión anti-ráfagas en /overlay y grabación local .srt/.vtt/.jsonl.",
        artifact: "ws://127.0.0.1:8765 · 7 temas · /overlay anti-ráfagas",
      },
    ],
  },

  paths: {
    eyebrow: "// elige un camino",
    heading: "Conoce el producto, instálalo o conéctalo a OBS.",
    lead: "La página de inicio te ayuda a decidir. Estas rutas llevan los detalles sin obligarte a recorrer cada configuración posible.",
    tour: {
      title: "Tour del producto",
      body: "Recorre estados reales de la app publicada, desde la configuración local hasta el editor de estilos y diagnóstico.",
      cta: "Abrir el tour",
    },
    start: {
      title: "Primeros pasos",
      body: "Instala en Windows o Linux, elige Parakeet-TDT o Whisper e inicia el motor local de subtítulos.",
      cta: "Empezar la configuración",
    },
    obs: {
      title: "Configuración de OBS y documentación",
      body: "Conecta la salida local de subtítulos a OBS con 7 temas en vivo y conserva la referencia técnica cerca.",
      cta: "Configurar OBS",
      docs: "Ver documentación",
    },
  },

  ws: {
    eyebrow: "// integración",
    title: "Funciona con OBS — o cualquier cliente WebSocket.",
    body: "LiveAudio emite subtítulos en JSON limpio por un WebSocket local (ws://127.0.0.1:8765). OBS se conecta mediante el overlay integrado /overlay con 7 temas en vivo y reconexión anti-ráfagas, protegido por un listener solo loopback y lista blanca de orígenes contra secuestro de WebSocket (CSWSH).",
    codeTab: "ws://127.0.0.1:8765",
    codeLines: [
      "{",
      '  "id": "utt_42",',
      '  "text": "subtítulos locales en tiempo real",',
      '  "style": "karaoke",',
      '  "latency": 0.5,',
      '  "total_delay": 0.7,',
      '  "is_replay": false',
      "}",
    ],
    diagram: {
      source: "LiveAudio",
      signal: "subtítulos JSON",
      obs: "Fuente de navegador OBS",
      anyClient: "cualquier cliente en localhost",
    },
  },

  bento: {
    eyebrow: "// pensado para directos reales",
    heading:
      "App de escritorio nativa en Rust para Windows y Linux con Parakeet-TDT ONNX y overlay integrado para OBS.",
    tiles: [
      {
        kicker: "// 7 temas obs",
        title: "7 temas en vivo y /overlay anti-ráfagas",
        body: "Cambia de tema en directo sin tocar OBS: default, karaoke, neon, minimal, bold, rgb y typewriter. La reconexión anti-ráfagas de /overlay mantiene los subtítulos limpios si OBS reconecta en medio del directo.",
        icon: "captions",
        wide: true,
        badge: "temas en vivo",
      },
      {
        kicker: "// grabación de sesión",
        title: ".srt (listo para DaVinci Resolve), .vtt y .jsonl",
        body: "Cada sesión guarda en tu disco archivos SubRip (.srt, listos para importar directamente en DaVinci Resolve), WebVTT (.vtt) y transcripciones estructuradas .jsonl — sin subir nada a la nube.",
        icon: "file-text",
        wide: true,
        badge: "davinci resolve",
      },
      {
        kicker: "// mcp y opencohost",
        title: "MCP con doble consentimiento y OpenCohost",
        body: "Conecta asistentes de IA locales mediante liveaudio-cli mcp con interruptores independientes para Estilo y Sistema, más el interruptor Seguir idioma de OpenCohost para sincronizar el idioma al instante.",
        icon: "repeat",
      },
      {
        kicker: "// blacklist",
        title: "Blacklist por bordes y conmutadores",
        body: "La coincidencia de palabra completa recorta las frases bloqueadas solo en los extremos de cada intervención para no descartar oraciones largas, con interruptores dedicados para prompt de contexto y blacklist.",
        icon: "shield-x",
      },
      {
        kicker: "// cpu y avanzado",
        title: "Hilos de CPU automáticos y pestaña Avanzado",
        body: "Pestaña Avanzado rediseñada con interruptor automático de hilos de CPU para que Parakeet-TDT int8 corra con soltura en portátiles de 4 hilos sin GPU, además de DirectML y CUDA 12.8 opcional.",
        icon: "gauge",
      },
      {
        kicker: "// actualizaciones seguras",
        title: "Actualizador firmado seguro en directo",
        body: "Actualizaciones firmadas con Minisign Ed25519 en Windows (NSIS) y Linux (.AppImage), comprobación opcional cada 24 h (cero telemetría) y bloqueo automático mientras estás en vivo o con OBS conectado (.deb se actualiza desde GitHub Releases).",
        icon: "refresh-cw",
      },
    ],
  },

  cost: {
    eyebrow: "// las cuentas",
    heading: "Lo local le gana al pago por minuto.",
    intro:
      "Las APIs de ASR en la nube cobran por minuto; LiveAudio no te cobra nada. Compara lo que costaría la transcripción en la nube frente a tu propia electricidad — el hardware no está incluido.",
  },

  features: {
    eyebrow: "// capacidades",
    heading: "Pensado para sesiones de streaming reales.",
  },

  vsTeaser: {
    eyebrow: "// la versión corta",
    heading: "Cómo se compara LiveAudio de un vistazo.",
    columns: ["", "LiveAudio", "ASR en la nube / plugins"],
    rows: [
      { label: "100% local · cero datos en la app", self: "yes", other: "depende de la nube" },
      { label: "$0 de costo por minuto", self: "yes", other: "se cobra por minuto" },
      { label: "Sin clave API", self: "yes", other: "normalmente sí" },
      {
        label: "Loopback de audio del sistema",
        self: "yes",
        other: "varía",
        note: "Windows WASAPI + Linux PipeWire/PulseAudio",
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
          `Sí. LiveAudio ${LIVEAUDIO_TAG} ejecuta NVIDIA Parakeet-TDT y Whisper 100% en tu equipo en Rust nativo + ONNX Runtime con cero Python y sin recopilar ni retener ningún dato en la app de escritorio (solo este sitio web usa Microsoft Clarity para analítica web).`,
      },
      {
        question: "¿Funciona en Linux?",
        answer:
          `Sí. LiveAudio ${LIVEAUDIO_TAG} ofrece instalador para Windows 10/11 x64 y paquetes .AppImage y .deb para Linux x86_64, con loopback de audio del sistema en Windows (WASAPI) y Linux (monitor PipeWire/PulseAudio + respaldo ALSA) y actualizaciones firmadas con Minisign en Windows y Linux .AppImage.`,
      },
      {
        question: "¿Necesito una GPU?",
        answer:
          "No. NVIDIA Parakeet-TDT 0.6B v3 int8 es ~2× más rápido en CPU que Whisper small y corre con fluidez en portátiles solo con CPU de 4 hilos, además de incluir aceleración DirectML (GPU DirectX 12) y CTranslate2 CUDA 12.8 opcional.",
      },
      {
        question: "¿Es gratis y de código abierto?",
        answer:
          "Sí. LiveAudio es gratuito y de código abierto bajo licencia MIT, sin suscripción y sin clave API: el audio y las transcripciones nunca salen de tu equipo.",
      },
    ],
    cta: "Leer las preguntas frecuentes",
  },

  closing: {
    eyebrow: "// descargar",
    heading: "Subtítulos locales en tu OBS en minutos.",
    body: "Gratis y de código abierto (MIT) para Windows x64 y Linux x86_64. NVIDIA Parakeet-TDT + Whisper, cero Python, sin clave API y sin recolección ni retención de datos en la aplicación de escritorio.",
    download: `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
    secondary: "Cómo funciona",
  },
};

const HOME_COPY: Record<Locale, HomeCopy> = { en, es };

/** Returns the Home copy table for the given locale. */
export function homeCopy(lang: Locale): HomeCopy {
  return HOME_COPY[lang];
}
