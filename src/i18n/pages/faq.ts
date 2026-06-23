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
  lede: "Short, source-backed answers to the questions people ask before downloading LiveAudio v1.2.0.",
  items: [
    {
      question: "Is it really 100% local?",
      answer:
        "Yes. All audio processing and transcription run on your own machine with no telemetry, and internet is needed only on first run to download Python, dependencies and models — after that it works fully offline.",
    },
    {
      question: "Does it work on Linux?",
      answer:
        "Yes, on Linux x86_64 with microphone capture, which needs the libportaudio2 package (sudo apt install libportaudio2). System-audio loopback (WASAPI) is Windows-only; on Linux you capture the microphone.",
    },
    {
      question: "Is it free and open-source?",
      answer:
        "Yes. LiveAudio is free and open-source under the MIT license, with no subscription and no API key — you only pay your own electricity, and hardware is not included.",
    },
    {
      question: "Do I need a GPU?",
      answer:
        "No. The CPU works on its own; NVIDIA CUDA is optional but recommended and is auto-detected, needing driver 525 or newer and at least 4 GiB of VRAM.",
    },
    {
      question: "Do I need internet or an API key?",
      answer:
        "No API key, ever — and no account either. Internet is required only on first run to fetch Python, dependencies and models; once those are cached, LiveAudio runs entirely offline.",
    },
    {
      question: "What's the latency?",
      answer:
        "Low and tunable — well under a second on a typical setup — using FPS-aware presets (Fast / Balanced / Quality / Stable Streaming). It is real-time and sub-second, not the few-milliseconds figure marketing pages sometimes claim.",
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
  download: "Download LiveAudio v1.2.0 (free)",
};

const es: FaqPageCopy = {
  title: "Preguntas frecuentes de LiveAudio — subtítulos Whisper locales para OBS",
  description:
    "Respuestas sobre LiveAudio: si es 100% local, si funciona en Linux, si es gratis y de código abierto (MIT), si necesitas GPU o API key, cuál es la latencia y en qué se diferencia de las APIs en la nube y los plugins de subtítulos de OBS.",
  eyebrow: "// faq",
  heading: "Respuestas sobre subtítulos locales, gratuitos y en tiempo real.",
  lede: "Respuestas breves y verificables a las preguntas habituales antes de descargar LiveAudio v1.2.0.",
  items: [
    {
      question: "¿De verdad es 100% local?",
      answer:
        "Sí. Todo el procesamiento de audio y la transcripción ocurren en tu propio equipo, sin telemetría, y solo se necesita internet en la primera ejecución para descargar Python, dependencias y modelos — después funciona totalmente sin conexión.",
    },
    {
      question: "¿Funciona en Linux?",
      answer:
        "Sí, en Linux x86_64 con captura por micrófono, que requiere el paquete libportaudio2 (sudo apt install libportaudio2). El loopback de audio del sistema (WASAPI) es solo de Windows; en Linux capturas el micrófono.",
    },
    {
      question: "¿Es gratis y de código abierto?",
      answer:
        "Sí. LiveAudio es gratuito y de código abierto bajo licencia MIT, sin suscripción y sin API key — solo pagas tu propia electricidad, y el hardware no está incluido.",
    },
    {
      question: "¿Necesito una GPU?",
      answer:
        "No. La CPU funciona por sí sola; NVIDIA CUDA es opcional pero recomendada y se detecta de forma automática, y necesita driver 525 o posterior y al menos 4 GiB de VRAM.",
    },
    {
      question: "¿Necesito internet o una API key?",
      answer:
        "Nunca una API key — ni tampoco una cuenta. Solo se necesita internet en la primera ejecución para descargar Python, dependencias y modelos; una vez guardados en caché, LiveAudio funciona totalmente sin conexión.",
    },
    {
      question: "¿Cuál es la latencia?",
      answer:
        "Baja y ajustable — bastante por debajo de un segundo en un equipo típico — mediante perfiles según FPS (Fast / Balanced / Quality / Stable Streaming). Es en tiempo real y por debajo de un segundo, no la cifra de pocos milisegundos que a veces prometen otras páginas.",
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
  download: "Descargar LiveAudio v1.2.0 (gratis)",
};

const TABLE: Record<Locale, FaqPageCopy> = { en, es };

/** Locale-bound FAQ page copy. */
export function faqCopy(lang: Locale): FaqPageCopy {
  return TABLE[lang];
}
