/**
 * /obs-setup/ page copy — bilingual, fact-checked.
 *
 * This is the highest-intent, citable HowTo page (per the product spec). Every step
 * is the REAL OBS Browser-Source flow from the product spec (verbatim facts):
 *   1. OBS → Sources → + → Browser
 *   2. Local file → select `subtitulos_obs.html` (in liveaudio/assets/), size 1920×200
 *   3. Disable "Shut down source when not visible"
 *   4. Custom port: ws_port in config.json; OBS HTML reads ?port=XXXX (default 8765)
 *   5. In LiveAudio: profile + device + CPU/CUDA + model → Apply → START SYSTEM
 *
 * WebSocket payload fields (per the product spec): id, text, style, created_at, processed_at,
 * queue_delay, total_delay, latency, is_replay, catchup_interval_sec.
 * Connections from localhost only, no auth. Latency: sub-second to ~1s.
 *
 * Spanish is neutral/professional (no Rioplatense slang in artifacts).
 */

import type { Locale } from "../routes";
import { localizedPath } from "../routes";

/** One numbered step in the OBS setup HowTo. */
export interface ObsStep {
  /** Mono kicker (e.g. "// browser source"). */
  kicker: string;
  /** Answer-first step name (also becomes the HowTo step `name`). */
  name: string;
  /** Step body — the procedural detail (also becomes the HowTo step `text`). */
  text: string;
  /** Optional inline code token shown as a `.pill` (port, filename, size…). */
  token?: string;
  /** Optional amber operator caveat shown as a `.pill-amber`. */
  amber?: string;
}

/** One row of the WebSocket payload field reference table. */
export interface PayloadField {
  field: string;
  desc: string;
  /** When true, render the value column in amber (timing law). */
  timing?: boolean;
}

export interface ObsSetupCopy {
  // <head>
  title: string;
  description: string;

  // Hero / answer-first opener
  eyebrow: string;
  /** Single <h1> for the page. */
  h1: string;
  intro: string;

  // Steps section
  stepsEyebrow: string;
  stepsHeading: string;
  steps: ObsStep[];

  // Diagram section
  diagramEyebrow: string;
  diagramHeading: string;
  diagramBody: string;

  // Payload reference section
  payloadEyebrow: string;
  payloadHeading: string;
  payloadIntro: string;
  payloadColField: string;
  payloadColDesc: string;
  payloadFields: PayloadField[];
  payloadNote: string;

  // Closing Download module
  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
  downloadHref: string;

  // HowTo JSON-LD name
  howToName: string;

  // Diagram node labels (passed to WsDiagram.astro)
  diagram: {
    liveaudio: string;
    obs: string;
    client: string;
    signal: string;
    caption: string;
  };
}

const en: ObsSetupCopy = {
  title: "OBS setup — LiveAudio local captions in OBS (step by step)",
  description:
    "Add LiveAudio captions to OBS in five steps: create a Browser source, point it at subtitulos_obs.html at 1920×200, disable shut-down-when-not-visible, set the WebSocket port, then START SYSTEM.",

  eyebrow: "// obs setup",
  h1: "Add LiveAudio captions to OBS in five steps.",
  intro:
    "LiveAudio renders into OBS through a Browser source that loads the included subtitulos_obs.html overlay and listens to a local WebSocket (ws://127.0.0.1:8765). Create the source, size it 1920×200, keep it always running, match the port, and start the system. Windows and Linux.",

  stepsEyebrow: "// the five steps",
  stepsHeading: "The exact Browser-source flow.",
  steps: [
    {
      kicker: "// browser source",
      name: "Add a Browser source in OBS",
      text: "In OBS, go to Sources → + → Browser. This creates the surface that LiveAudio draws captions onto inside your scene.",
      token: "Sources → + → Browser",
    },
    {
      kicker: "// local overlay",
      name: "Point it at subtitulos_obs.html and size it 1920×200",
      text: "Choose Local file and select subtitulos_obs.html (it ships in liveaudio/assets/). Not sure where that is? On the installed app it lives under your LiveAudio data folder — on Windows open %LOCALAPPDATA%\\LiveAudio\\data, on Linux ~/.local/share/liveaudio/data, then go into liveaudio/assets/. Set the source size to Width 1920 and Height 200 so the caption ribbon spans the bottom of a 1080p canvas.",
      token: "1920×200",
    },
    {
      kicker: "// keep alive",
      name: 'Disable "Shut down source when not visible"',
      text: 'In the Browser source properties, turn off "Shut down source when not visible" (and "Refresh browser when scene becomes active"). This keeps the WebSocket connection open so captions never drop when you switch scenes.',
      amber: 'turn OFF "shut down when not visible"',
    },
    {
      kicker: "// port match",
      name: "Match the WebSocket port (default 8765)",
      text: "LiveAudio broadcasts on ws://127.0.0.1:8765 by default. To change it, set ws_port in config.json; the OBS overlay reads its port from the ?port=XXXX query in the source URL. Keep both sides on the same port.",
      token: "ws://127.0.0.1:8765",
      amber: "custom port: set ws_port + ?port=XXXX",
    },
    {
      kicker: "// go live",
      name: "Apply changes, then START SYSTEM",
      text: "In LiveAudio pick a profile, audio device, CPU or CUDA, and a Whisper model, then click Apply changes and START SYSTEM. Speak — captions appear in the OBS Browser source within about a second.",
      token: "START SYSTEM",
    },
  ],

  diagramEyebrow: "// the signal path",
  diagramHeading: "How the caption signal reaches OBS.",
  diagramBody:
    "LiveAudio transcribes locally and broadcasts subtitle JSON over a local WebSocket. OBS connects through the included overlay, but any HTML or WebSocket client on localhost can receive the same broadcast. Connections are accepted only from localhost, with no authentication.",

  payloadEyebrow: "// websocket payload",
  payloadHeading: "What each caption frame contains.",
  payloadIntro:
    "Every caption is a small JSON frame broadcast on the local WebSocket. These are the documented fields you can read in your own overlay or client.",
  payloadColField: "field",
  payloadColDesc: "description",
  payloadFields: [
    { field: "id", desc: "Monotonic caption id for ordering." },
    { field: "text", desc: "The transcribed caption text." },
    { field: "style", desc: "Display style hint for the overlay." },
    { field: "created_at", desc: "When the audio segment was captured." },
    { field: "processed_at", desc: "When transcription finished." },
    { field: "queue_delay", desc: "Seconds spent waiting in the queue.", timing: true },
    { field: "total_delay", desc: "End-to-end delay, capture to broadcast.", timing: true },
    { field: "latency", desc: "Transcription latency in seconds.", timing: true },
    { field: "is_replay", desc: "True when the frame is a backlog replay." },
    { field: "catchup_interval_sec", desc: "Spacing used when replaying backlog.", timing: true },
  ],
  payloadNote:
    "Latency is low and tunable — sub-second to about one second on a typical setup (example frame: total_delay ~1.3s, latency ~1.1s), not milliseconds.",

  closingEyebrow: "// download",
  closingHeading: "Get LiveAudio and wire up OBS today.",
  closingBody:
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included. Windows and Linux.",
  download: "Download LiveAudio v1.2.5 (free)",
  downloadHref: localizedPath("en", "download"),

  howToName: "Add LiveAudio captions to OBS",

  diagram: {
    liveaudio: "LiveAudio",
    obs: "OBS Browser source",
    client: "Any localhost client",
    signal: "ws://127.0.0.1:8765",
    caption: "subtitle JSON",
  },
};

const es: ObsSetupCopy = {
  title: "Configurar OBS — subtítulos locales de LiveAudio en OBS (paso a paso)",
  description:
    "Agrega los subtítulos de LiveAudio a OBS en cinco pasos: crea una fuente de navegador, apúntala a subtitulos_obs.html en 1920×200, desactiva apagar cuando no está visible, configura el puerto del WebSocket y luego INICIAR SISTEMA.",

  eyebrow: "// configurar obs",
  h1: "Agrega los subtítulos de LiveAudio a OBS en cinco pasos.",
  intro:
    "LiveAudio se muestra en OBS mediante una fuente de navegador que carga el overlay incluido subtitulos_obs.html y escucha un WebSocket local (ws://127.0.0.1:8765). Crea la fuente, dale un tamaño de 1920×200, mantenla siempre activa, iguala el puerto e inicia el sistema. Windows y Linux.",

  stepsEyebrow: "// los cinco pasos",
  stepsHeading: "El flujo exacto de la fuente de navegador.",
  steps: [
    {
      kicker: "// fuente de navegador",
      name: "Agrega una fuente de navegador en OBS",
      text: "En OBS, ve a Fuentes → + → Navegador. Esto crea la superficie sobre la que LiveAudio dibuja los subtítulos dentro de tu escena.",
      token: "Fuentes → + → Navegador",
    },
    {
      kicker: "// overlay local",
      name: "Apúntala a subtitulos_obs.html y pon 1920×200",
      text: "Elige Archivo local y selecciona subtitulos_obs.html (viene en liveaudio/assets/). ¿No sabes dónde está? En la app instalada vive dentro de tu carpeta de datos de LiveAudio — en Windows abre %LOCALAPPDATA%\\LiveAudio\\data, en Linux ~/.local/share/liveaudio/data, y luego entra en liveaudio/assets/. Configura el tamaño de la fuente en Ancho 1920 y Alto 200 para que la franja de subtítulos cubra la parte inferior de un lienzo 1080p.",
      token: "1920×200",
    },
    {
      kicker: "// mantener activo",
      name: 'Desactiva "Apagar la fuente cuando no está visible"',
      text: 'En las propiedades de la fuente de navegador, desactiva "Apagar la fuente cuando no está visible" (y "Actualizar el navegador cuando la escena se activa"). Esto mantiene abierta la conexión del WebSocket para que los subtítulos no se corten al cambiar de escena.',
      amber: 'desactiva "apagar cuando no está visible"',
    },
    {
      kicker: "// igualar puerto",
      name: "Igualá el puerto del WebSocket (por defecto 8765)",
      text: "Por defecto, LiveAudio emite en ws://127.0.0.1:8765. Para cambiarlo, configura ws_port en config.json; el overlay de OBS lee su puerto desde la consulta ?port=XXXX en la URL de la fuente. Mantén ambos lados en el mismo puerto.",
      token: "ws://127.0.0.1:8765",
      amber: "puerto personalizado: ws_port + ?port=XXXX",
    },
    {
      kicker: "// salir en vivo",
      name: "Aplica los cambios y luego INICIAR SISTEMA",
      text: "En LiveAudio elige un perfil, un dispositivo de audio, CPU o CUDA y un modelo de Whisper; luego haz clic en Aplicar cambios e INICIAR SISTEMA. Habla — los subtítulos aparecen en la fuente de navegador de OBS en aproximadamente un segundo.",
      token: "INICIAR SISTEMA",
    },
  ],

  diagramEyebrow: "// el camino de la señal",
  diagramHeading: "Cómo llega la señal de subtítulos a OBS.",
  diagramBody:
    "LiveAudio transcribe localmente y emite subtítulos en JSON por un WebSocket local. OBS se conecta mediante el overlay incluido, pero cualquier cliente HTML o WebSocket en localhost puede recibir la misma transmisión. Solo se aceptan conexiones desde localhost, sin autenticación.",

  payloadEyebrow: "// payload del websocket",
  payloadHeading: "Qué contiene cada frame de subtítulo.",
  payloadIntro:
    "Cada subtítulo es un pequeño frame JSON emitido por el WebSocket local. Estos son los campos documentados que puedes leer en tu propio overlay o cliente.",
  payloadColField: "campo",
  payloadColDesc: "descripción",
  payloadFields: [
    { field: "id", desc: "Id monotónico del subtítulo para el orden." },
    { field: "text", desc: "El texto transcrito del subtítulo." },
    { field: "style", desc: "Sugerencia de estilo de visualización para el overlay." },
    { field: "created_at", desc: "Cuándo se capturó el segmento de audio." },
    { field: "processed_at", desc: "Cuándo terminó la transcripción." },
    { field: "queue_delay", desc: "Segundos de espera en la cola.", timing: true },
    { field: "total_delay", desc: "Retardo de extremo a extremo, de captura a emisión.", timing: true },
    { field: "latency", desc: "Latencia de transcripción en segundos.", timing: true },
    { field: "is_replay", desc: "Verdadero cuando el frame es una repetición del backlog." },
    { field: "catchup_interval_sec", desc: "Espaciado usado al repetir el backlog.", timing: true },
  ],
  payloadNote:
    "La latencia es baja y ajustable — de menos de un segundo a alrededor de un segundo en un equipo típico (frame de ejemplo: total_delay ~1.3s, latency ~1.1s), no milisegundos.",

  closingEyebrow: "// descargar",
  closingHeading: "Descarga LiveAudio y configura OBS hoy.",
  closingBody:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido. Windows y Linux.",
  download: "Descargar LiveAudio v1.2.5 (gratis)",
  downloadHref: localizedPath("es", "download"),

  howToName: "Agregar subtítulos de LiveAudio a OBS",

  diagram: {
    liveaudio: "LiveAudio",
    obs: "Fuente de navegador OBS",
    client: "Cualquier cliente en localhost",
    signal: "ws://127.0.0.1:8765",
    caption: "subtítulos JSON",
  },
};

const TABLE: Record<Locale, ObsSetupCopy> = { en, es };

/** Resolve the /obs-setup/ copy bundle for a locale. */
export function obsSetupCopy(lang: Locale): ObsSetupCopy {
  return TABLE[lang] ?? en;
}
