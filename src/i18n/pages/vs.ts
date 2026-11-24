/**
 * /vs comparison-page copy — EN default + ES mirror.
 *
 * Single decisive, FACT-BASED comparison table.
 * Accurate competitive positioning:
 *   "Prebuilt native Rust desktop app for Windows & Linux with Parakeet-TDT
 *    ONNX + built-in OBS WebSocket/Browser Source overlay."
 *
 * Spanish is neutral/professional (no regional slang or Spanglish leaks).
 */

import type { Locale } from "../routes";
import { LIVEAUDIO_TAG } from "../../config/release";

/** Glyph state for a comparison cell. */
export type VsState = "yes" | "no" | "cond";

/** A single cell: a glyph state plus a short factual note. */
export interface VsCell {
  state: VsState;
  note: string;
  flag?: boolean;
}

/** One comparison row: a feature label + one cell per column. */
export interface VsRow {
  feature: string;
  cells: [VsCell, VsCell, VsCell, VsCell];
}

/** Column headers, in order. The first entry is the highlighted self column. */
export interface VsColumn {
  name: string;
  example: string;
}

export interface VsCopy {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  tableCaption: string;
  tableSummary: string;
  featureHeader: string;
  columns: [VsColumn, VsColumn, VsColumn, VsColumn];
  rows: VsRow[];
  legend: { yes: string; no: string; cond: string };
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
}

const en: VsCopy = {
  title: "LiveAudio vs OBS plugins, browser tools & cloud ASR",
  description:
    "Fact-based comparison: LiveAudio is a prebuilt native Rust desktop app for Windows & Linux with NVIDIA Parakeet-TDT ONNX + Whisper, built-in OBS WebSocket/Browser Source overlay, and zero desktop data collection — versus OBS plugins, browser tools, and cloud ASR APIs.",
  eyebrow: "// compare",
  heading: "Local, free, and yours — versus everything else.",
  intro:
    "LiveAudio is a prebuilt native Rust desktop app for Windows & Linux with Parakeet-TDT ONNX + Whisper and a built-in OBS WebSocket/Browser Source overlay — with zero data collected or retained by the app. The table below compares it on the facts: engines, cost, platforms, loopback, OBS integration, privacy, and hardware.",
  tableCaption: `// capability comparison · ${LIVEAUDIO_TAG}`,
  tableSummary:
    "Capability comparison across LiveAudio, OBS caption plugins, browser-source caption tools and cloud ASR APIs. Rows: local processing, engines, per-minute cost, platforms, system-audio loopback, OBS integration, open-source license, privacy, CPU performance, and offline operation.",
  featureHeader: "capability",
  columns: [
    { name: "LiveAudio", example: `${LIVEAUDIO_TAG} · this app` },
    { name: "OBS caption plugins", example: "e.g. LocalVocal" },
    { name: "Browser-source tools", example: "e.g. Caption.Ninja" },
    { name: "Cloud ASR APIs", example: "e.g. OpenAI Whisper API" },
  ],
  rows: [
    {
      feature: "100% local processing",
      cells: [
        { state: "yes", note: "Parakeet-TDT + Whisper on-device" },
        { state: "yes", note: "on-device" },
        { state: "cond", note: "varies by tool" },
        { state: "no", note: "audio sent to cloud" },
      ],
    },
    {
      feature: "Per-minute cost",
      cells: [
        { state: "yes", note: "$0 · electricity only" },
        { state: "yes", note: "$0" },
        { state: "cond", note: "free / paid tiers" },
        { state: "cond", note: "provider pricing varies", flag: true },
      ],
    },
    {
      feature: "Platforms",
      cells: [
        { state: "cond", note: `Windows x64 (.exe) & Linux x86_64 (.AppImage / .deb) · ${LIVEAUDIO_TAG}`, flag: true },
        { state: "cond", note: "depends on host" },
        { state: "yes", note: "any browser" },
        { state: "yes", note: "any with internet" },
      ],
    },
    {
      feature: "System-audio loopback",
      cells: [
        { state: "yes", note: "Windows (WASAPI) + Linux (PipeWire/PulseAudio + ALSA)" },
        { state: "cond", note: "host-dependent" },
        { state: "cond", note: "browser-dependent" },
        { state: "cond", note: "source-dependent" },
      ],
    },
    {
      feature: "OBS integration",
      cells: [
        { state: "yes", note: "Built-in WebSocket /overlay · 7 live themes · isolated process" },
        { state: "yes", note: "in-process OBS plugin" },
        { state: "yes", note: "Browser Source URL" },
        { state: "cond", note: "via add-ons" },
      ],
    },
    {
      feature: "Open-source (MIT)",
      cells: [
        { state: "yes", note: "MIT" },
        { state: "cond", note: "license varies" },
        { state: "cond", note: "license varies" },
        { state: "no", note: "proprietary service" },
      ],
    },
    {
      feature: "Zero desktop data collected",
      cells: [
        { state: "yes", note: "zero app data collected or retained" },
        { state: "cond", note: "varies by plugin" },
        { state: "cond", note: "varies by tool" },
        { state: "no", note: "server-side logs", flag: true },
      ],
    },
    {
      feature: "Works without a GPU",
      cells: [
        { state: "yes", note: "Parakeet-TDT int8 CPU (4-thread laptops) · DirectML · opt. CUDA" },
        { state: "cond", note: "model-dependent" },
        { state: "yes", note: "remote compute" },
        { state: "yes", note: "remote compute" },
      ],
    },
    {
      feature: "Works offline",
      cells: [
        { state: "cond", note: "once chosen models are cached (SHA-256 verified, zero Python)" },
        { state: "yes", note: "on-device" },
        { state: "no", note: "needs the web page" },
        { state: "no", note: "needs internet", flag: true },
      ],
    },
  ],
  legend: {
    yes: "● yes",
    no: "○ no",
    cond: "◐ conditional",
  },
  closingEyebrow: "// download",
  closingHeading: "Local captions, on your terms.",
  closingBody:
    "Free & open-source (MIT) for Windows x64 & Linux x86_64. No subscription, no API key, and zero data collected or retained by the desktop app.",
  download: `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
};

const es: VsCopy = {
  title: "LiveAudio frente a plugins de OBS, herramientas web y ASR en la nube",
  description:
    "Comparativa basada en hechos: LiveAudio es una app de escritorio nativa en Rust precompilada para Windows y Linux con NVIDIA Parakeet-TDT ONNX + Whisper, overlay WebSocket/Browser Source integrado para OBS y cero recolección de datos en la app.",
  eyebrow: "// comparativa",
  heading: "Local, gratis y tuyo — frente a todo lo demás.",
  intro:
    "LiveAudio es una app de escritorio nativa en Rust precompilada para Windows y Linux con Parakeet-TDT ONNX + Whisper y overlay WebSocket/Browser Source integrado para OBS — sin recopilar ni retener datos en la app. La tabla siguiente compara los hechos: motores, costo, plataformas, loopback, integración con OBS, privacidad y hardware.",
  tableCaption: `// comparativa de capacidades · ${LIVEAUDIO_TAG}`,
  tableSummary:
    "Comparativa de capacidades entre LiveAudio, plugins de subtítulos de OBS, herramientas de origen de navegador y APIs de ASR en la nube. Filas: procesamiento local, costo, plataformas, loopback, integración con OBS, licencia de código abierto, privacidad, CPU y modo sin conexión.",
  featureHeader: "capacidad",
  columns: [
    { name: "LiveAudio", example: `${LIVEAUDIO_TAG} · esta app` },
    { name: "Plugins de OBS", example: "p. ej. LocalVocal" },
    { name: "Herramientas web", example: "p. ej. Caption.Ninja" },
    { name: "ASR en la nube", example: "p. ej. OpenAI Whisper API" },
  ],
  rows: [
    {
      feature: "Procesamiento 100% local",
      cells: [
        { state: "yes", note: "Parakeet-TDT + Whisper en el equipo" },
        { state: "yes", note: "en el equipo" },
        { state: "cond", note: "según la herramienta" },
        { state: "no", note: "audio enviado a la nube" },
      ],
    },
    {
      feature: "Costo por minuto",
      cells: [
        { state: "yes", note: "$0 · solo electricidad" },
        { state: "yes", note: "$0" },
        { state: "cond", note: "planes gratis / de pago" },
        { state: "cond", note: "según el proveedor", flag: true },
      ],
    },
    {
      feature: "Plataformas",
      cells: [
        { state: "cond", note: `Windows x64 (.exe) y Linux x86_64 (.AppImage / .deb) · ${LIVEAUDIO_TAG}`, flag: true },
        { state: "cond", note: "según el anfitrión" },
        { state: "yes", note: "cualquier navegador" },
        { state: "yes", note: "cualquiera con internet" },
      ],
    },
    {
      feature: "Loopback de audio del sistema",
      cells: [
        { state: "yes", note: "Windows (WASAPI) + Linux (PipeWire/PulseAudio + ALSA)" },
        { state: "cond", note: "según el anfitrión" },
        { state: "cond", note: "según el navegador" },
        { state: "cond", note: "según la fuente" },
      ],
    },
    {
      feature: "Integración con OBS",
      cells: [
        { state: "yes", note: "WebSocket /overlay integrado · 7 temas · proceso aislado" },
        { state: "yes", note: "plugin interno de OBS" },
        { state: "yes", note: "URL en Browser Source" },
        { state: "cond", note: "mediante complementos" },
      ],
    },
    {
      feature: "Código abierto (MIT)",
      cells: [
        { state: "yes", note: "MIT" },
        { state: "cond", note: "licencia variable" },
        { state: "cond", note: "licencia variable" },
        { state: "no", note: "servicio propietario" },
      ],
    },
    {
      feature: "Cero datos recopilados en la app",
      cells: [
        { state: "yes", note: "sin recolección ni retención en la app" },
        { state: "cond", note: "según el plugin" },
        { state: "cond", note: "según la herramienta" },
        { state: "no", note: "registros en servidor", flag: true },
      ],
    },
    {
      feature: "Funciona sin GPU",
      cells: [
        { state: "yes", note: "Parakeet-TDT int8 CPU (4 hilos) · DirectML · CUDA opc." },
        { state: "cond", note: "según el modelo" },
        { state: "yes", note: "cómputo remoto" },
        { state: "yes", note: "cómputo remoto" },
      ],
    },
    {
      feature: "Funciona sin conexión",
      cells: [
        { state: "cond", note: "con modelos en caché (SHA-256, cero Python)" },
        { state: "yes", note: "en el equipo" },
        { state: "no", note: "necesita la página web" },
        { state: "no", note: "necesita internet", flag: true },
      ],
    },
  ],
  legend: {
    yes: "● sí",
    no: "○ no",
    cond: "◐ condicional",
  },
  closingEyebrow: "// descargar",
  closingHeading: "Subtítulos locales, en tus términos.",
  closingBody:
    "Gratis y de código abierto (MIT) para Windows x64 y Linux x86_64. Sin suscripción, sin clave API y sin recolección ni retención de datos en la aplicación de escritorio.",
  download: `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
};

/** Return the /vs copy bound to a locale (EN default). */
export function vsCopy(lang: Locale): VsCopy {
  return lang === "es" ? es : en;
}
