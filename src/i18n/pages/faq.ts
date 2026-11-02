/**
 * /faq/ page copy — the GEO citation magnet (the product spec).
 *
 * The 7 questions are the product spec FAQ list, verbatim in intent and
 * order: 100% local · Linux · free/open-source · GPU · internet/API key ·
 * latency · how it differs from cloud APIs / OBS caption plugins.
 *
 * Every answer is answer-first and capped at TWO sentences so it stays
 * LLM-citable, and every claim is traceable to the product spec:
 *   - 100% local + first-run internet only
 *   - Linux mic capture + libportaudio2; loopback Win
 *   - Free & open-source (MIT), no key/subscription
 *   - GPU optional; CPU works; CUDA driver >=525
 *   - Internet only on first run; no API key
 *   - Low, tunable, sub-second latency (NOT "ms")
 *   - Differs from cloud APIs / OBS caption plugins
 *
 * The SAME `items` array feeds both the rendered accordion and the FAQPage
 * JSON-LD (jsonld.faqPage), so the structured data can never drift from the
 * visible copy. Spanish is neutral/professional (no Rioplatense slang).
 */

import type { Locale } from "../routes";
import type { FaqItem } from "../jsonld";

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
  title: "LiveAudio FAQ — local Whisper captions for OBS",
  description:
    "Answers about LiveAudio: is it 100% local, does it run on Linux, is it free and open-source (MIT), do you need a GPU or an API key, what is the latency, and how it differs from cloud APIs and OBS caption plugins.",
  eyebrow: "// faq",
  heading: "Answers about local, free, real-time captions.",
  lede: "Short, source-backed answers to the questions people ask before downloading LiveAudio v1.5.1.",
  items: [
    {
      question: "Is it really 100% local?",
      answer:
        "Audio processing and transcription run on your computer. The Rust core and Tauri desktop use a Python inference worker; initial setup and model downloads may require internet.",
    },
    {
      question: "Does it work on Linux?",
      answer:
        "v1.5.1 focuses on Windows 10/11 x64; Linux users stay on the legacy Python v1.2.7 tarball with microphone capture, which needs the libportaudio2 package (sudo apt install libportaudio2). System-audio loopback (WASAPI) is Windows-only.",
    },
    {
      question: "Is it free and open-source?",
      answer:
        "Yes. LiveAudio is free and open-source under the MIT license, with no subscription and no API key — you only pay your own electricity, and hardware is not included.",
    },
    {
      question: "Do I need a GPU?",
      answer:
        "No. CPU transcription is available. NVIDIA CUDA is optional; detecting a GPU does not guarantee that the required CUDA runtime libraries are available.",
    },
    {
      question: "Do I need internet or an API key?",
      answer:
        "No API key or account is needed for local transcription. Internet may be needed to provision components or download a newly selected model. Transcription can run offline once the required components and model are available.",
    },
    {
      question: "What's the latency?",
      answer:
        "Latency depends on speech segmentation, the model, hardware and system load. Profiles let you adjust the balance between responsiveness and accuracy.",
    },
    {
      question:
        "How is it different from cloud APIs or OBS caption plugins?",
      answer:
        "Cloud ASR APIs send your audio off your machine and bill per minute, while browser caption tools depend on a remote service; LiveAudio does everything locally with no cloud and no per-minute cost. It broadcasts clean subtitle JSON over a local WebSocket (ws://127.0.0.1:8765) that OBS — or any localhost client — can consume.",
    },
  ],
  closingEyebrow: "// download",
  closingHeading: "Ready when your answers are.",
  closingBody:
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.",
  download: "Download LiveAudio v1.5.1 (free)",
};

const es: FaqPageCopy = {
  title: "Preguntas frecuentes de LiveAudio — subtítulos Whisper locales para OBS",
  description:
    "Respuestas sobre LiveAudio: si es 100% local, si funciona en Linux, si es gratis y de código abierto (MIT), si necesitas GPU o API key, cuál es la latencia y en qué se diferencia de las APIs en la nube y los plugins de subtítulos de OBS.",
  eyebrow: "// faq",
  heading: "Respuestas sobre subtítulos locales, gratuitos y en tiempo real.",
  lede: "Respuestas breves y verificables a las preguntas habituales antes de descargar LiveAudio v1.5.1.",
  items: [
    {
      question: "¿De verdad es 100% local?",
      answer:
        "El procesamiento de audio y la transcripción ocurren en tu equipo. El núcleo Rust y el escritorio Tauri usan un worker de inferencia Python; la configuración inicial y las descargas de modelos pueden necesitar internet.",
    },
    {
      question: "¿Funciona en Linux?",
      answer:
        "La v1.5.1 se enfoca en Windows 10/11 x64; en Linux sigue el tarball heredado Python v1.2.7 con captura por micrófono, que requiere el paquete libportaudio2 (sudo apt install libportaudio2). El loopback de audio del sistema (WASAPI) es solo de Windows.",
    },
    {
      question: "¿Es gratis y de código abierto?",
      answer:
        "Sí. LiveAudio es gratuito y de código abierto bajo licencia MIT, sin suscripción y sin API key — solo pagas tu propia electricidad, y el hardware no está incluido.",
    },
    {
      question: "¿Necesito una GPU?",
      answer:
        "No. La transcripción puede usar la CPU. NVIDIA CUDA es opcional; detectar una GPU no garantiza que las bibliotecas necesarias para CUDA estén disponibles.",
    },
    {
      question: "¿Necesito internet o una API key?",
      answer:
        "La transcripción local no necesita una clave API ni una cuenta. Puede necesitarse internet para preparar los componentes o descargar un modelo recién seleccionado. La transcripción puede funcionar sin conexión cuando los componentes y el modelo necesarios están disponibles.",
    },
    {
      question: "¿Cuál es la latencia?",
      answer:
        "La latencia depende de la segmentación de voz, el modelo, el hardware y la carga del sistema. Los perfiles permiten ajustar el equilibrio entre respuesta y precisión.",
    },
    {
      question:
        "¿En qué se diferencia de las APIs en la nube o los plugins de subtítulos de OBS?",
      answer:
        "Las APIs de ASR en la nube envían tu audio fuera del equipo y cobran por minuto, y las herramientas de subtítulos del navegador dependen de un servicio remoto; LiveAudio hace todo localmente, sin nube y sin costo por minuto. Emite subtítulos en JSON limpio por un WebSocket local (ws://127.0.0.1:8765) que OBS — o cualquier cliente en localhost — puede consumir.",
    },
  ],
  closingEyebrow: "// descargar",
  closingHeading: "Listo cuando tengas tus respuestas.",
  closingBody:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido.",
  download: "Descargar LiveAudio v1.5.1 (gratis)",
};

const TABLE: Record<Locale, FaqPageCopy> = { en, es };

/** Locale-bound FAQ page copy. */
export function faqCopy(lang: Locale): FaqPageCopy {
  return TABLE[lang];
}
