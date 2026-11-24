/**
 * /faq/ page copy — the GEO citation magnet.
 *
 * Every answer is answer-first and concise so it stays LLM-citable.
 * The SAME `items` array feeds both the rendered accordion and the FAQPage
 * JSON-LD (jsonld.faqPage), so structured data never drifts from visible copy.
 *
 * Spanish is neutral/professional (no regional slang or Spanglish leaks).
 */

import type { Locale } from "../routes";
import type { FaqItem } from "../jsonld";
import { LIVEAUDIO_TAG } from "../../config/release";

export interface FaqPageCopy {
  /** <head> title. */
  title: string;
  /** Meta description. */
  description: string;
  /** Mono eyebrow above the answer-first H1. */
  eyebrow: string;
  /** The page's single H1 (answer-first framing). */
  heading: string;
  /** One-line lede under the H1. */
  lede: string;
  /** Question + answer rows. Drives both the accordion AND FAQPage JSON-LD. */
  items: FaqItem[];
  /** Closing Download module copy. */
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  /** Primary Download CTA label. */
  download: string;
}

const en: FaqPageCopy = {
  title: "LiveAudio FAQ — local Parakeet-TDT & Whisper captions for OBS",
  description:
    "Answers about LiveAudio: zero desktop data collection, NVIDIA Parakeet-TDT & Whisper on CPU/GPU, Windows & Linux loopback, free MIT license, hallucinations, and how it compares to cloud APIs and OBS plugins.",
  eyebrow: "// faq",
  heading: "Answers about local, free, real-time captions.",
  lede: `Short, source-backed answers to the questions people ask before downloading LiveAudio ${LIVEAUDIO_TAG}.`,
  items: [
    {
      question: "Is it really 100% local?",
      answer:
        `Yes. Running 100% locally is the core benefit: the LiveAudio ${LIVEAUDIO_TAG} desktop app collects zero data and retains zero data — audio and transcripts never leave your machine, with native Rust + ONNX Runtime (zero Python) and zero telemetry. Only this website (liveaudio.opencohost.com) uses Microsoft Clarity for web analytics.`,
    },
    {
      question: "Does it work on Linux?",
      answer:
        `Yes. LiveAudio ${LIVEAUDIO_TAG} ships a Windows 10/11 x64 installer plus prebuilt Linux x86_64 .AppImage and .deb packages. System-audio loopback works on both Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture with ALSA fallback), and signed Minisign Ed25519 in-app updates work on Windows (NSIS) and Linux .AppImage (.deb users update via GitHub Releases).`,
    },
    {
      question: "Is it free and open-source?",
      answer:
        "Yes. LiveAudio is free and open-source under the MIT license, with no subscription and no API key — you only pay your own electricity, and hardware is not included.",
    },
    {
      question: "Do I need a GPU?",
      answer:
        "No. NVIDIA Parakeet-TDT 0.6B v3 (int8 on CPU) is ~2× faster on CPU than Whisper small and runs smoothly on modest 4-thread CPU-only laptops using the automatic CPU threads switch. DirectML (DirectX 12 GPU) and an optional CTranslate2 CUDA 12.8 worker for NVIDIA GPUs are also built in.",
    },
    {
      question: "Do I need internet or an API key?",
      answer:
        "No API key or account is needed, and there are zero Python runtimes to download. Outbound desktop network access is limited to on-demand SHA-256 model downloads, an optional 24-hour GitHub Releases update check (zero telemetry, toggleable in Settings > Advanced), and an opt-in CUDA runtime download; audio and transcripts never leave your machine.",
    },
    {
      question: "What's the latency?",
      answer:
        "Latency depends on speech segmentation, the chosen model (Parakeet-TDT vs Whisper), your hardware, and system load. Profiles let you tune the balance between responsiveness and accuracy for your setup.",
    },
    {
      question:
        "How is it different from cloud APIs or OBS caption plugins?",
      answer:
        "Cloud ASR APIs send your audio off your machine and bill per minute; LiveAudio runs 100% locally with zero per-minute cost and zero app data collected. Unlike an in-process OBS plugin that can crash OBS and interrupt your stream, LiveAudio runs as a separate native Rust app feeding an OBS Browser Source with 7 live themes and anti-burst reconnection.",
    },
    {
      question: "Captions appear in LiveAudio's Events panel but not in OBS. What do I do?",
      answer:
        "In OBS, open your Browser Source Properties, make sure Local File is unchecked, and click \"Refresh cache of current page\" at the bottom. Also verify the URL matches LiveAudio's Copy URL button (http://127.0.0.1:8765/overlay by default) after starting the system.",
    },
    {
      question: "Whisper writes words I never said. Why?",
      answer:
        "Switch to NVIDIA Parakeet-TDT 0.6B v3 first for EN/ES: its transducer decoder emits blank on silence and noise, giving near-zero silence hallucinations. If you use Whisper (for other languages, translate-to-English, or context prompts), enable the upgraded word-boundary edge-trimming Blacklist in Settings > Advanced — it strips filler phrases only at utterance edges so long sentences are not dropped.",
    },
  ],
  closingEyebrow: "// download",
  closingHeading: "Ready when your answers are.",
  closingBody:
    "Free & open-source (MIT) for Windows x64 & Linux x86_64. No subscription, no API key, and zero data collected or retained by the desktop app.",
  download: `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
};

const es: FaqPageCopy = {
  title: "Preguntas frecuentes de LiveAudio — subtítulos locales Parakeet-TDT y Whisper para OBS",
  description:
    "Respuestas sobre LiveAudio: cero recolección de datos en la app, NVIDIA Parakeet-TDT y Whisper en CPU/GPU, loopback en Windows y Linux, licencia MIT, alucinaciones y diferencias frente a APIs en la nube y plugins de OBS.",
  eyebrow: "// preguntas frecuentes",
  heading: "Respuestas sobre subtítulos locales, gratuitos y en tiempo real.",
  lede: `Respuestas breves y verificables a las preguntas habituales antes de descargar LiveAudio ${LIVEAUDIO_TAG}.`,
  items: [
    {
      question: "¿De verdad es 100% local?",
      answer:
        `Sí. Ejecutarse 100% en tu equipo es el beneficio principal: la aplicación de escritorio LiveAudio ${LIVEAUDIO_TAG} no recopila ni retiene ningún dato — el audio y las transcripciones nunca salen de tu equipo, con Rust nativo + ONNX Runtime (cero Python) y cero telemetría. Solo este sitio web (liveaudio.opencohost.com) utiliza Microsoft Clarity para analítica web.`,
    },
    {
      question: "¿Funciona en Linux?",
      answer:
        `Sí. LiveAudio ${LIVEAUDIO_TAG} incluye instalador para Windows 10/11 x64 y paquetes precompilados .AppImage y .deb para Linux x86_64. El loopback de audio del sistema funciona tanto en Windows (WASAPI) como en Linux (monitor PipeWire/PulseAudio con respaldo ALSA), y las actualizaciones firmadas con Minisign Ed25519 dentro de la app funcionan en Windows (NSIS) y Linux .AppImage (.deb se actualiza vía GitHub Releases).`,
    },
    {
      question: "¿Es gratis y de código abierto?",
      answer:
        "Sí. LiveAudio es gratuito y de código abierto bajo licencia MIT, sin suscripción y sin clave API — solo pagas tu propia electricidad, y el hardware no está incluido.",
    },
    {
      question: "¿Necesito una GPU?",
      answer:
        "No. NVIDIA Parakeet-TDT 0.6B v3 (int8 en CPU) es ~2× más rápido en CPU que Whisper small y funciona con fluidez en portátiles modestos solo con CPU de 4 hilos gracias al selector automático de hilos. También integra aceleración DirectML (GPU DirectX 12) y un worker opcional CTranslate2 CUDA 12.8 para GPUs NVIDIA.",
    },
    {
      question: "¿Necesito internet o una clave API?",
      answer:
        "No necesitas clave API ni cuenta, y no hay runtimes de Python que descargar. El tráfico saliente de la app de escritorio se limita a descargas de modelos verificadas por SHA-256 bajo demanda, comprobación opcional de GitHub Releases cada 24 h (cero telemetría, desactivable en Ajustes > Avanzado) y descarga voluntaria del runtime CUDA; el audio y las transcripciones nunca salen de tu equipo.",
    },
    {
      question: "¿Cuál es la latencia?",
      answer:
        "La latencia depende de la segmentación de voz, el modelo elegido (Parakeet-TDT o Whisper), tu hardware y la carga del sistema. Los perfiles permiten ajustar el equilibrio entre respuesta y precisión.",
    },
    {
      question:
        "¿En qué se diferencia de las APIs en la nube o los plugins de subtítulos de OBS?",
      answer:
        "Las APIs de ASR en la nube envían tu audio fuera del equipo y cobran por minuto; LiveAudio procesa todo localmente sin costo por minuto y sin recopilar datos en la app. A diferencia de un plugin interno que puede cerrar OBS si falla, LiveAudio corre como una app nativa en Rust separada conectada por Fuente de navegador con 7 temas en vivo y reconexión anti-ráfagas.",
    },
    {
      question: "Los subtítulos aparecen en el panel de eventos de LiveAudio pero no en OBS. ¿Qué hago?",
      answer:
        "En OBS, abre las Propiedades de tu Fuente de navegador, verifica que Archivo local esté desmarcado y pulsa \"Actualizar caché de la página actual\" al final. Comprueba también que la URL coincida con el botón Copiar URL de LiveAudio (http://127.0.0.1:8765/overlay por defecto) tras iniciar el sistema.",
    },
    {
      question: "Whisper escribe palabras que nunca dije. ¿Por qué?",
      answer:
        "Cambia primero a NVIDIA Parakeet-TDT 0.6B v3 para español e inglés: su decodificador transductor emite blanco en silencio o ruido y reduce casi a cero las alucinaciones. Si usas Whisper (para otros idiomas, traducción al inglés o prompts de contexto), activa la Blacklist mejorada en Ajustes > Avanzado: coincide por palabra completa y recorta frases solo en los bordes sin descartar oraciones largas.",
    },
  ],
  closingEyebrow: "// descargar",
  closingHeading: "Listo cuando tengas tus respuestas.",
  closingBody:
    "Gratis y de código abierto (MIT) para Windows x64 y Linux x86_64. Sin suscripción, sin clave API y sin recolección ni retención de datos en la aplicación de escritorio.",
  download: `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
};

const TABLE: Record<Locale, FaqPageCopy> = { en, es };

/** Locale-bound FAQ page copy. */
export function faqCopy(lang: Locale): FaqPageCopy {
  return TABLE[lang];
}
