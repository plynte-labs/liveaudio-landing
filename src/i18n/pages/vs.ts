/**
 * /vs comparison-page copy — EN default + ES mirror.
 *
 * Single decisive, FACT-BASED comparison table. Every cell is traceable to
 * the product spec:
 *   - 100% local / no telemetry.
 *   - Cost $0 (electricity only) vs cloud ASR ~$0.006/min (= ~$0.36/hr,
 *     OpenAI Whisper API).
 *   - Platforms Windows + Linux (loopback Windows-only -> conditional ◐).
 *   - OBS integration via WebSocket Browser Source (subtitulos_obs.html).
 *   - Open-source MIT.
 *   - GPU optional (CPU works).
 *
 * No disparagement: competitor cells describe capabilities factually. Cloud
 * cost/latency cells carry the amber operator-attention flag (timing/cost is the
 * amber semantic per the design system). The LiveAudio column is highlighted
 * (.vs-col-self). Glyphs: ● yes (.vs-yes) · ○ no (.vs-no) · ◐ conditional
 * (.vs-cond, amber) — e.g. WASAPI loopback is Windows-only.
 *
 * Spanish is neutral/professional (no Rioplatense slang in artifacts).
 */

import type { Locale } from "../routes";

/** Glyph state for a comparison cell. */
export type VsState = "yes" | "no" | "cond";

/** A single cell: a glyph state plus a short factual note. */
export interface VsCell {
  state: VsState;
  /** Short factual qualifier shown under the glyph (mono). */
  note: string;
  /** Amber operator-attention flag (cost/timing/conditional). Default false. */
  flag?: boolean;
}

/** One comparison row: a feature label + one cell per column. */
export interface VsRow {
  /** Row feature label (sticky first column on mobile). */
  feature: string;
  /** Cells, in column order: self, obsPlugin, browserTool, cloud. */
  cells: [VsCell, VsCell, VsCell, VsCell];
}

/** Column headers, in order. The first entry is the highlighted self column. */
export interface VsColumn {
  /** Display name. */
  name: string;
  /** Short factual descriptor (e.g. an example tool), mono sub-label. */
  example: string;
}

export interface VsCopy {
  title: string;
  description: string;
  eyebrow: string;
  /** Answer-first H2. */
  heading: string;
  /** One-paragraph intro under the H2. */
  intro: string;
  /** Caption above the table (mono). */
  tableCaption: string;
  /** Accessible caption/summary for the <table>. */
  tableSummary: string;
  /** Header for the leftmost (feature) column. */
  featureHeader: string;
  columns: [VsColumn, VsColumn, VsColumn, VsColumn];
  rows: VsRow[];
  /** Mono legend explaining the glyphs. */
  legend: { yes: string; no: string; cond: string };
  /** Closing Download module. */
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
}

const en: VsCopy = {
  title: "LiveAudio vs OBS plugins, browser tools & cloud ASR",
  description:
    "Fact-based comparison: LiveAudio runs Whisper captions 100% locally, free under MIT, on Windows and Linux, and streams to OBS over a local WebSocket — versus OBS caption plugins, browser-source tools and paid cloud ASR APIs.",
  eyebrow: "// vs",
  heading: "Local, free, and yours — versus everything else.",
  intro:
    "LiveAudio generates real-time Whisper captions 100% on your own machine and broadcasts them to OBS over a local WebSocket. The table below compares it on the facts: cost, platforms, OBS integration, license, privacy and hardware. No spin — every cell is a capability statement.",
  tableCaption: "// capability comparison · v1.2.0",
  tableSummary:
    "Capability comparison across LiveAudio, OBS caption plugins, browser-source caption tools and cloud ASR APIs. Rows: local processing, cost, platforms, OBS integration, open-source license, privacy, and GPU requirement.",
  featureHeader: "capability",
  columns: [
    { name: "LiveAudio", example: "v1.2.0 · this app" },
    { name: "OBS caption plugins", example: "e.g. LocalVocal" },
    { name: "Browser-source tools", example: "e.g. Caption.Ninja" },
    { name: "Cloud ASR APIs", example: "e.g. OpenAI Whisper API" },
  ],
  rows: [
    {
      feature: "100% local processing",
      cells: [
        { state: "yes", note: "on-device Whisper" },
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
        { state: "no", note: "~$0.006/min metered", flag: true },
      ],
    },
    {
      feature: "Platforms",
      cells: [
        { state: "yes", note: "Windows + Linux" },
        { state: "cond", note: "depends on host" },
        { state: "yes", note: "any browser" },
        { state: "yes", note: "any with internet" },
      ],
    },
    {
      feature: "System-audio loopback",
      cells: [
        { state: "cond", note: "Windows-only (WASAPI)", flag: true },
        { state: "cond", note: "host-dependent" },
        { state: "cond", note: "browser-dependent" },
        { state: "cond", note: "source-dependent" },
      ],
    },
    {
      feature: "OBS integration",
      cells: [
        { state: "yes", note: "WebSocket Browser Source" },
        { state: "yes", note: "native OBS plugin" },
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
      feature: "No telemetry",
      cells: [
        { state: "yes", note: "no telemetry" },
        { state: "cond", note: "varies by plugin" },
        { state: "cond", note: "varies by tool" },
        { state: "no", note: "server-side logs", flag: true },
      ],
    },
    {
      feature: "Works without a GPU",
      cells: [
        { state: "yes", note: "CPU works · CUDA optional" },
        { state: "cond", note: "model-dependent" },
        { state: "yes", note: "remote compute" },
        { state: "yes", note: "remote compute" },
      ],
    },
    {
      feature: "Works offline",
      cells: [
        { state: "yes", note: "offline after first run" },
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
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.",
  download: "Download LiveAudio v1.2.0 (free)",
};

const es: VsCopy = {
  title: "LiveAudio frente a plugins de OBS, herramientas web y ASR en la nube",
  description:
    "Comparativa basada en hechos: LiveAudio genera subtítulos Whisper 100% en tu equipo, gratis con licencia MIT, en Windows y Linux, y los envía a OBS por un WebSocket local — frente a plugins de subtítulos de OBS, herramientas de origen de navegador y APIs de ASR en la nube de pago.",
  eyebrow: "// comparativa",
  heading: "Local, gratis y tuyo — frente a todo lo demás.",
  intro:
    "LiveAudio genera subtítulos Whisper en tiempo real 100% en tu propio equipo y los emite a OBS por un WebSocket local. La tabla siguiente lo compara con datos: costo, plataformas, integración con OBS, licencia, privacidad y hardware. Sin adornos — cada celda es una afirmación de capacidad.",
  tableCaption: "// comparativa de capacidades · v1.2.0",
  tableSummary:
    "Comparativa de capacidades entre LiveAudio, plugins de subtítulos de OBS, herramientas de origen de navegador y APIs de ASR en la nube. Filas: procesamiento local, costo, plataformas, integración con OBS, licencia de código abierto, privacidad y requisito de GPU.",
  featureHeader: "capacidad",
  columns: [
    { name: "LiveAudio", example: "v1.2.0 · esta app" },
    { name: "Plugins de OBS", example: "p. ej. LocalVocal" },
    { name: "Herramientas web", example: "p. ej. Caption.Ninja" },
    { name: "ASR en la nube", example: "p. ej. OpenAI Whisper API" },
  ],
  rows: [
    {
      feature: "Procesamiento 100% local",
      cells: [
        { state: "yes", note: "Whisper en el equipo" },
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
        { state: "no", note: "~$0.006/min medido", flag: true },
      ],
    },
    {
      feature: "Plataformas",
      cells: [
        { state: "yes", note: "Windows + Linux" },
        { state: "cond", note: "según el anfitrión" },
        { state: "yes", note: "cualquier navegador" },
        { state: "yes", note: "cualquiera con internet" },
      ],
    },
    {
      feature: "Loopback de audio del sistema",
      cells: [
        { state: "cond", note: "solo Windows (WASAPI)", flag: true },
        { state: "cond", note: "según el anfitrión" },
        { state: "cond", note: "según el navegador" },
        { state: "cond", note: "según la fuente" },
      ],
    },
    {
      feature: "Integración con OBS",
      cells: [
        { state: "yes", note: "Browser Source por WebSocket" },
        { state: "yes", note: "plugin nativo de OBS" },
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
      feature: "Sin telemetría",
      cells: [
        { state: "yes", note: "sin telemetría" },
        { state: "cond", note: "según el plugin" },
        { state: "cond", note: "según la herramienta" },
        { state: "no", note: "registros en servidor", flag: true },
      ],
    },
    {
      feature: "Funciona sin GPU",
      cells: [
        { state: "yes", note: "CPU funciona · CUDA opcional" },
        { state: "cond", note: "según el modelo" },
        { state: "yes", note: "cómputo remoto" },
        { state: "yes", note: "cómputo remoto" },
      ],
    },
    {
      feature: "Funciona sin conexión",
      cells: [
        { state: "yes", note: "offline tras la 1ª ejecución" },
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
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido.",
  download: "Descargar LiveAudio v1.2.0 (gratis)",
};

/** Return the /vs copy bound to a locale (EN default). */
export function vsCopy(lang: Locale): VsCopy {
  return lang === "es" ? es : en;
}
