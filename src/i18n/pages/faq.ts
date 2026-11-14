/**
 * /faq/ page copy — the GEO citation magnet (the product spec).
 *
 * The first 7 questions are the product spec FAQ list, verbatim in intent and
 * order: 100% local · Linux · free/open-source · GPU · internet/API key ·
 * latency · how it differs from cloud APIs / OBS caption plugins. Then two
 * support questions: captions missing in OBS · Whisper hallucinations.
 *
 * Every answer is answer-first and capped at TWO sentences so it stays
 * LLM-citable, and every claim is traceable to the product spec:
 *   - 100% local + first-run internet only
 *   - Linux AppImage / .deb (manual updates); loopback Win
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
  lede: "Short, source-backed answers to the questions people ask before downloading LiveAudio v1.6.0.",
  items: [
    {
      question: "Is it really 100% local?",
      answer:
        "Audio capture and transcription run 100% on your machine. LiveAudio v1.6.0 is 100% native Rust using ONNX Runtime (DirectML / CPU) with zero Python runtimes to provision and 0 telemetry.",
    },
    {
      question: "Does it work on Linux?",
      answer:
        "Yes. v1.6.0 ships a Windows 10/11 x64 installer plus a Linux x86_64 AppImage and .deb on the GitHub release page. On Linux, updates are manual (the in-app updater is Windows-only). System-audio loopback (WASAPI) is Windows-only.",
    },
    {
      question: "Is it free and open-source?",
      answer:
        "Yes. LiveAudio is free and open-source under the MIT license, with no subscription and no API key — you only pay your own electricity, and hardware is not included.",
    },
    {
      question: "Do I need a GPU?",
      answer:
        "No. LiveAudio uses DirectML (DirectX 12) for native GPU acceleration across NVIDIA, AMD, and Intel GPUs, with automatic CPU fallback. An optional CTranslate2 CUDA worker is available for dedicated NVIDIA GPUs.",
    },
    {
      question: "Do I need internet or an API key?",
      answer:
        "No API key or account is needed, and there are zero Python runtimes to download. Internet is only required if you choose to download additional Whisper models; once downloaded, transcription runs entirely offline with zero network traffic.",
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
        "Cloud ASR APIs send your audio off your machine and bill per minute; LiveAudio does everything locally with no cloud and no per-minute cost. And unlike an OBS plugin, which runs inside OBS and can take OBS (and your recording) down if it crashes, LiveAudio is a separate app that OBS only shows as a Browser Source, so if it stops, OBS keeps streaming and recording.",
    },
    {
      question: "Captions appear in LiveAudio's Events panel but not in OBS. What do I do?",
      answer:
        "In OBS, open your Browser Source's Properties and click \"Refresh cache of current page\" at the bottom. Also check that the source URL is the one from LiveAudio's Copy URL button (http://127.0.0.1:8765/overlay by default).",
    },
    {
      question: "Whisper writes words I never said. Why?",
      answer:
        "Whisper-style speech models sometimes \"hallucinate\" phrases, especially during silence or background noise; it is a known limitation of this kind of ASR. Copy the phrase exactly as it appears into the Hallucination Filter (Blacklist) in the Advanced tab, and LiveAudio will drop it from your captions.",
    },
  ],
  closingEyebrow: "// download",
  closingHeading: "Ready when your answers are.",
  closingBody:
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.",
  download: "Download LiveAudio v1.6.0 (free)",
};

const es: FaqPageCopy = {
  title: "Preguntas frecuentes de LiveAudio — subtítulos Whisper locales para OBS",
  description:
    "Respuestas sobre LiveAudio: si es 100% local, si funciona en Linux, si es gratis y de código abierto (MIT), si necesitas GPU o API key, cuál es la latencia y en qué se diferencia de las APIs en la nube y los plugins de subtítulos de OBS.",
  eyebrow: "// faq",
  heading: "Respuestas sobre subtítulos locales, gratuitos y en tiempo real.",
  lede: "Respuestas breves y verificables a las preguntas habituales antes de descargar LiveAudio v1.6.0.",
  items: [
    {
      question: "¿De verdad es 100% local?",
      answer:
        "La captura de audio y la transcripción ocurren 100% en tu equipo. LiveAudio v1.6.0 es 100% Rust nativo con ONNX Runtime (DirectML / CPU) sin runtimes de Python que instalar y 0 telemetría.",
    },
    {
      question: "¿Funciona en Linux?",
      answer:
        "Sí. La v1.6.0 incluye un instalador para Windows 10/11 x64 y un AppImage y un .deb para Linux x86_64 en la página del release de GitHub. En Linux las actualizaciones son manuales (el actualizador integrado es solo de Windows). El loopback de audio del sistema (WASAPI) es solo de Windows.",
    },
    {
      question: "¿Es gratis y de código abierto?",
      answer:
        "Sí. LiveAudio es gratuito y de código abierto bajo licencia MIT, sin suscripción y sin API key — solo pagas tu propia electricidad, y el hardware no está incluido.",
    },
    {
      question: "¿Necesito una GPU?",
      answer:
        "No. LiveAudio utiliza DirectML (DirectX 12) para aceleración nativa en GPUs NVIDIA, AMD e Intel, con fallback automático a CPU. Dispone de un worker opcional CTranslate2 para GPUs NVIDIA dedicadas con CUDA.",
    },
    {
      question: "¿Necesito internet o una API key?",
      answer:
        "No necesitas clave API ni cuenta, y no hay ningún runtime de Python que descargar. Internet solo se requiere si descargas modelos Whisper adicionales; una vez descargados, la transcripción funciona completamente offline con cero tráfico de red.",
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
        "Las APIs de ASR en la nube envían tu audio fuera del equipo y cobran por minuto; LiveAudio hace todo localmente, sin nube y sin costo por minuto. Y a diferencia de un plugin de OBS, que corre dentro de OBS y si falla puede cerrar OBS (y cortar tu grabación), LiveAudio es una app aparte que OBS solo muestra como Fuente de navegador: si se detiene, OBS sigue transmitiendo y grabando.",
    },
    {
      question: "Los subtítulos aparecen en el panel de eventos de LiveAudio pero no en OBS. ¿Qué hago?",
      answer:
        "En OBS, abre las Propiedades de tu Fuente de navegador y pulsa \"Actualizar caché de la página actual\", al final de la ventana. Comprueba también que la URL de la fuente sea la del botón Copiar URL de LiveAudio (http://127.0.0.1:8765/overlay por defecto).",
    },
    {
      question: "Whisper escribe palabras que nunca dije. ¿Por qué?",
      answer:
        "Los modelos de voz tipo Whisper a veces \"alucinan\" frases, sobre todo en silencios o con ruido de fondo; es una limitación conocida de este tipo de ASR. Copia la frase tal cual aparece en el Filtro de Frases Alucinadas (Blacklist) de la pestaña Avanzado, y LiveAudio la quitará de tus subtítulos.",
    },
  ],
  closingEyebrow: "// descargar",
  closingHeading: "Listo cuando tengas tus respuestas.",
  closingBody:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido.",
  download: "Descargar LiveAudio v1.6.0 (gratis)",
};

const TABLE: Record<Locale, FaqPageCopy> = { en, es };

/** Locale-bound FAQ page copy. */
export function faqCopy(lang: Locale): FaqPageCopy {
  return TABLE[lang];
}
