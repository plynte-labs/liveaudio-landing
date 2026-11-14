/**
 * /obs-setup/ page copy — bilingual, fact-checked.
 *
 * This is the highest-intent, citable HowTo page (per the product spec). Every step
 * is the REAL OBS Browser-Source flow from the product spec (verbatim facts):
 *   1. OBS → Sources → + → Browser
 *   2. Paste the copied overlay URL (http://127.0.0.1:<port>/overlay), size 1920×1080
 *   3. Disable "Shut down source when not visible"
 *   4. Custom port: ws_port in config.json; OBS HTML reads ?port=XXXX (default 8765)
 *   5. In LiveAudio: profile + device + model → Save → START SYSTEM
 *
 * WebSocket payload fields (per the product spec): id, text, style, created_at, processed_at,
 * queue_delay, total_delay, latency, is_replay, catchup_interval_sec.
 * Loopback-only peers plus an Origin allowlist (403 otherwise), no auth. Verified against v1.6.0.
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
    "Add LiveAudio captions to OBS using a Browser source and the overlay URL copied from LiveAudio.",

  eyebrow: "// obs setup",
  h1: "Add LiveAudio captions to OBS in five steps.",
  intro:
    "Start the system in LiveAudio, then copy its overlay URL into an OBS Browser source. The overlay talks to LiveAudio over a local WebSocket protected by a loopback-only listener and an Origin allowlist. Windows x64 (v1.6.0).",

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
      name: "Paste the overlay URL and size it 1920×1080",
      text: "In LiveAudio, select your audio device, profile and model and click Save. Start the system, then copy the overlay URL with Copy URL (Browser Source URL, in the OBS Studio Integration card). In OBS, leave Local File unchecked and paste it into URL. Set Width to 1920 and Height to 1080: the full canvas, because the overlay positions the captions itself.",
      token: "1920×1080",
    },
    {
      kicker: "// keep alive",
      name: 'Disable "Shut down source when not visible"',
      text: 'In the Browser source properties, turn off "Shut down source when not visible" (and "Refresh browser when scene becomes active") to keep the connection active when switching scenes.',
      amber: 'turn OFF "shut down when not visible"',
    },
    {
      kicker: "// port match",
      name: "Match the WebSocket port (default 8765)",
      text: "The Browser source URL is http://127.0.0.1:8765/overlay; Copy URL adds ?port=<port> with the active port. LiveAudio starts at ws_port (default 8765) and, if that port is busy, tries up to ws_port + 9 (8765–8774 by default); copy the URL again if the port changes. ws://127.0.0.1:8765 is the WebSocket endpoint the overlay connects to, not what you paste into OBS.",
      token: "http://127.0.0.1:8765/overlay",
      amber: "use the copied URL for the active port",
    },
    {
      kicker: "// go live",
      name: "Check captions in OBS",
      text: "Speak and check for captions in the OBS Browser source. Style tab changes reach OBS instantly. If you open OBS before LiveAudio, the overlay retries with a 1–8 s backoff and rescans the ports, so it connects once LiveAudio starts. If captions show in a regular browser but not in OBS, open the Browser source properties and press Refresh cache of current page.",
      token: "Check captions",
    },
  ],

  diagramEyebrow: "// the signal path",
  diagramHeading: "How the caption signal reaches OBS.",
  diagramBody:
    "LiveAudio transcribes locally and broadcasts subtitle JSON over a local WebSocket. OBS connects through the included overlay, but any HTML or WebSocket client on localhost can receive the same broadcast. The server listens on 127.0.0.1 only, drops non-loopback peers and has no authentication. Browser pages are filtered by Origin (HTTP 403 otherwise): the OBS Browser source and the /overlay page are already allowed. Other local browser tools on a different port must be added in Settings > Advanced > Allowed local connections (the card also lists Recent blocked attempts).",

  payloadEyebrow: "// websocket payload",
  payloadHeading: "What each caption frame contains.",
  payloadIntro:
    "Every caption is a small JSON frame broadcast on the local WebSocket. These are the documented fields you can read in your own overlay or client. Besides caption frames, the server sends a hello frame first on each connection, theme frames, and optional subtitle_partial frames; these carry a type field and no caption text, so skip them when you only want captions.",
  payloadColField: "field",
  payloadColDesc: "description",
  payloadFields: [
    { field: "id", desc: "Opaque per-session caption id, such as utt_42. Not monotonic; do not use it for ordering." },
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
    "Latency depends on speech segmentation, model, hardware and system load. Timing fields are measured in seconds.",

  closingEyebrow: "// download",
  closingHeading: "Get LiveAudio and wire up OBS today.",
  closingBody:
    "Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included. Windows x64 (v1.6.0).",
  download: "Download LiveAudio v1.6.0 (free)",
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
    "Agrega subtítulos de LiveAudio a OBS mediante una fuente de navegador y la URL del overlay copiada desde LiveAudio.",

  eyebrow: "// configurar obs",
  h1: "Agrega los subtítulos de LiveAudio a OBS en cinco pasos.",
  intro:
    "Inicia el sistema en LiveAudio y después copia la URL del overlay en una fuente de navegador de OBS. El overlay se comunica con LiveAudio por un WebSocket local protegido con un listener solo loopback y una lista de orígenes permitidos. Windows x64 (v1.6.0).",

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
      name: "Pega la URL del overlay y configura 1920×1080",
      text: "En LiveAudio, selecciona el dispositivo de audio, el perfil y el modelo y pulsa Guardar. Inicia el sistema y después copia la URL del overlay con Copiar URL (URL de Fuente de Navegador, en la tarjeta de integración con OBS Studio). En OBS, deja Archivo local desmarcado y pégala en URL. Configura Ancho 1920 y Alto 1080: el lienzo completo, porque el overlay posiciona los subtítulos por sí mismo.",
      token: "1920×1080",
    },
    {
      kicker: "// mantener activo",
      name: 'Desactiva "Apagar la fuente cuando no está visible"',
      text: 'En las propiedades de la fuente de navegador, desactiva "Apagar la fuente cuando no está visible" (y "Actualizar el navegador cuando la escena se activa") para mantener activa la conexión al cambiar de escena.',
      amber: 'desactiva "apagar cuando no está visible"',
    },
    {
      kicker: "// igualar puerto",
      name: "Comprueba el puerto del WebSocket (predeterminado 8765)",
      text: "La URL de la fuente de navegador es http://127.0.0.1:8765/overlay; Copiar URL agrega ?port=<puerto> con el puerto activo. LiveAudio comienza en ws_port (predeterminado 8765) y, si está ocupado, prueba hasta ws_port + 9 (8765–8774 por defecto); copia de nuevo la URL si el puerto cambia. ws://127.0.0.1:8765 es el endpoint WebSocket al que se conecta el overlay, no lo que se pega en OBS.",
      token: "http://127.0.0.1:8765/overlay",
      amber: "usa la URL copiada para el puerto activo",
    },
    {
      kicker: "// salir en vivo",
      name: "Comprueba los subtítulos en OBS",
      text: "Habla y comprueba los subtítulos en la fuente de navegador de OBS. Los cambios de la pestaña Estilo llegan a OBS al instante. Si abres OBS antes que LiveAudio, el overlay reintenta con espera creciente de 1 a 8 s y vuelve a buscar el puerto, así que se conecta cuando LiveAudio inicia. Si los subtítulos se ven en un navegador normal pero no en OBS, abre las propiedades de la fuente de navegador y pulsa Actualizar la caché de la página actual.",
      token: "Comprueba los subtítulos",
    },
  ],

  diagramEyebrow: "// el camino de la señal",
  diagramHeading: "Cómo llega la señal de subtítulos a OBS.",
  diagramBody:
    "LiveAudio transcribe localmente y emite subtítulos en JSON por un WebSocket local. OBS se conecta mediante el overlay incluido, pero cualquier cliente HTML o WebSocket en localhost puede recibir la misma transmisión. El servidor escucha solo en 127.0.0.1, descarta pares que no sean loopback y no tiene autenticación. Las páginas de navegador se filtran por Origin (HTTP 403 en caso contrario): la fuente de navegador de OBS y la página /overlay ya están permitidas. Otras herramientas de navegador locales en otro puerto deben agregarse en Ajustes > Avanzado > Conexiones locales permitidas (la tarjeta también muestra Intentos bloqueados recientes).",

  payloadEyebrow: "// payload del websocket",
  payloadHeading: "Qué contiene cada frame de subtítulo.",
  payloadIntro:
    "Cada subtítulo es un pequeño frame JSON emitido por el WebSocket local. Estos son los campos documentados que puedes leer en tu propio overlay o cliente. Además de los frames de subtítulo, el servidor envía primero un frame hello en cada conexión, frames theme y, opcionalmente, frames subtitle_partial; llevan un campo type y no tienen texto de subtítulo, así que omítelos si solo quieres subtítulos.",
  payloadColField: "campo",
  payloadColDesc: "descripción",
  payloadFields: [
    { field: "id", desc: "Id opaco del subtítulo por sesión, como utt_42. No es monotónico; no lo uses para ordenar." },
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
    "La latencia depende de la segmentación, el modelo, el hardware y la carga. Los campos de tiempo se miden en segundos.",

  closingEyebrow: "// descargar",
  closingHeading: "Descarga LiveAudio y configura OBS hoy.",
  closingBody:
    "Gratis y de código abierto (MIT). Sin suscripción, sin API key. Solo pagas tu propia electricidad — el hardware no está incluido. Windows x64 (v1.6.0).",
  download: "Descargar LiveAudio v1.6.0 (gratis)",
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
