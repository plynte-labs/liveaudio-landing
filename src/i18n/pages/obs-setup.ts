/**
 * /obs-setup/ page copy — bilingual, fact-checked.
 *
 * Every step mirrors the real OBS Browser Source flow:
 *   1. OBS → Sources → + → Browser
 *   2. Start the system, copy the overlay URL (http://127.0.0.1:<port>/overlay),
 *      leave Local File unchecked, size 1920×1080
 *   3. Disable "Shut down source when not visible"
 *   4. Match active port (default 8765; fallback up to ws_port + 9)
 *   5. Check captions, pick from 7 live themes, record .srt/.vtt/.jsonl locally
 *
 * Spanish is neutral/professional (no regional slang or Spanglish leaks).
 */

import type { Locale } from "../routes";
import { localizedPath } from "../routes";
import { LIVEAUDIO_TAG } from "../../config/release";

/** One numbered step in the OBS setup HowTo. */
export interface ObsStep {
  kicker: string;
  name: string;
  text: string;
  token?: string;
  amber?: string;
  short: string;
  see: string;
}

/** One row of the WebSocket payload field reference table. */
export interface PayloadField {
  field: string;
  desc: string;
  timing?: boolean;
}

export interface ObsSetupCopy {
  title: string;
  description: string;

  eyebrow: string;
  h1: string;
  intro: string;
  introPlain: string;
  url: { label: string; value: string; hint: string; copy: string; copied: string };
  seeLabel: string;
  moreDetail: string;
  techEyebrow: string;
  techHeading: string;

  stepsEyebrow: string;
  stepsHeading: string;
  steps: ObsStep[];

  diagramEyebrow: string;
  diagramHeading: string;
  diagramBody: string;

  payloadEyebrow: string;
  payloadHeading: string;
  payloadIntro: string;
  payloadColField: string;
  payloadColDesc: string;
  payloadFields: PayloadField[];
  payloadNote: string;

  closingEyebrow: string;
  closingHeading: string;
  closingBody: string;
  download: string;
  downloadHref: string;

  howToName: string;

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
    "Add LiveAudio local captions to OBS Studio using a Browser Source with Local File unchecked, 7 live themes, anti-burst /overlay reconnection, and local .srt/.vtt/.jsonl session recording.",

  eyebrow: "// obs setup",
  h1: "Add LiveAudio captions to OBS in five steps.",
  intro:
    `Start the system in LiveAudio, then copy its overlay URL into an OBS Browser Source. The /overlay page connects over a local WebSocket with anti-burst reconnection, 7 live themes (default, karaoke, neon, minimal, bold, rgb, typewriter), a loopback-only listener, and an Origin allowlist — while every session records .srt (DaVinci Resolve-ready), .vtt, and .jsonl locally and the stream-safe updater blocks updates while OBS is connected. Windows x64 & Linux x86_64 (${LIVEAUDIO_TAG}).`,

  introPlain:
    "Start LiveAudio, copy its overlay link, and paste it into OBS. Five short steps with 7 live themes, anti-burst reconnection, and automatic local .srt/.vtt/.jsonl recording.",
  url: {
    label: "Your overlay link",
    value: "http://127.0.0.1:8765/overlay",
    hint: "Paste this into the Browser Source URL box (with Local File unchecked). Always start the system before copying the URL in LiveAudio so the active port matches.",
    copy: "Copy link",
    copied: "Copied",
  },
  seeLabel: "You should see",
  moreDetail: "Full details",
  techEyebrow: "// for the curious",
  techHeading: "How the captions reach OBS.",

  stepsEyebrow: "// the five steps",
  stepsHeading: "The exact Browser-source flow.",
  steps: [
    {
      kicker: "// browser source",
      name: "Add a Browser source in OBS",
      text: "In OBS, go to Sources → + → Browser. This creates the surface that LiveAudio draws captions onto inside your scene.",
      token: "Sources → + → Browser",
      short: "Open OBS, then click Sources → + → Browser.",
      see: "A new Browser source in your Sources list.",
    },
    {
      kicker: "// local overlay",
      name: "Paste the overlay URL and size it 1920×1080",
      text: "In LiveAudio, select your audio device (mic or Windows WASAPI / Linux PipeWire-PulseAudio loopback), profile, and engine (NVIDIA Parakeet-TDT for EN/ES or Whisper), then click Save. Start the system before copying the overlay URL with Copy URL (Browser Source URL, in the OBS Studio Integration card). In OBS, leave Local File unchecked and paste it into URL. Set Width to 1920 and Height to 1080: the full canvas, because the overlay positions the captions itself.",
      token: "1920×1080",
      short: "Start the system in LiveAudio, press Copy URL, and paste it into the URL box. Leave Local File unchecked and set the size to 1920×1080.",
      see: "A full-canvas source. The overlay places the captions for you.",
    },
    {
      kicker: "// keep alive",
      name: 'Disable "Shut down source when not visible"',
      text: 'In the Browser source properties, turn off "Shut down source when not visible" (and "Refresh browser when scene becomes active") to keep the connection active when switching scenes.',
      amber: 'turn OFF "shut down when not visible"',
      short: "Turn off \"Shut down source when not visible\" so captions keep working when you switch scenes.",
      see: "Both options unchecked in the Browser source properties.",
    },
    {
      kicker: "// port match",
      name: "Match the WebSocket port (default 8765)",
      text: "The Browser source URL is http://127.0.0.1:8765/overlay; Copy URL adds ?port=<port> with the active port. LiveAudio starts at ws_port (default 8765) and, if that port is busy, tries up to ws_port + 9 (8765–8774 by default); copy the URL again if the port changes. ws://127.0.0.1:8765 is the WebSocket endpoint the overlay connects to, not what you paste into OBS.",
      token: "http://127.0.0.1:8765/overlay",
      amber: "use the copied URL for the active port",
      short: "Use the link exactly as copied. If LiveAudio moves to another port, copy it again.",
      see: "A URL ending in /overlay with the active port (8765 by default).",
    },
    {
      kicker: "// go live & themes",
      name: "Check captions & pick a live OBS theme",
      text: "Speak and check for captions in the OBS Browser Source. Switch live across 7 built-in themes in the Style tab (default, karaoke, neon, minimal, bold, rgb, typewriter) — changes reach OBS instantly without refreshing. Anti-burst /overlay reconnection keeps captions clean if OBS reconnects, every session saves DaVinci Resolve-ready .srt, .vtt, and .jsonl files locally, and the stream-safe updater blocks updates while live or OBS is connected. If captions show in a regular browser but not in OBS, open the Browser Source properties and press Refresh cache of current page.",
      token: "7 live themes · anti-burst /overlay",
      short: "Speak, watch captions appear in OBS, and switch live across the 7 built-in themes.",
      see: "Your words appearing as styled captions in OBS.",
    },
  ],

  diagramEyebrow: "// the signal path",
  diagramHeading: "How the caption signal reaches OBS.",
  diagramBody:
    "LiveAudio transcribes locally and broadcasts subtitle JSON over a local WebSocket. OBS connects through the built-in /overlay page with anti-burst reconnection and 7 live themes, and any HTML or WebSocket client on localhost can receive the same broadcast. The server listens on 127.0.0.1 only, drops non-loopback peers, and filters browser pages by Origin (HTTP 403 otherwise): OBS Browser Source and /overlay are already allowed. Other local browser tools on a different port can be authorized in Advanced > Allowed local connections.",

  payloadEyebrow: "// websocket payload",
  payloadHeading: "What each caption frame contains.",
  payloadIntro:
    "Every caption is a small JSON frame broadcast on the local WebSocket. Besides caption frames, the server sends a hello frame first on each connection, theme frames, and optional subtitle_partial frames; these carry a type field and no caption text, so skip them when you only want final captions.",
  payloadColField: "field",
  payloadColDesc: "description",
  payloadFields: [
    { field: "id", desc: "Opaque per-session caption id, such as utt_42. Not monotonic; do not use it for ordering." },
    { field: "text", desc: "The transcribed caption text." },
    { field: "style", desc: "Active live theme: default, karaoke, neon, minimal, bold, rgb, or typewriter." },
    { field: "created_at", desc: "When the audio segment was captured." },
    { field: "processed_at", desc: "When transcription finished." },
    { field: "queue_delay", desc: "Seconds spent waiting in the queue.", timing: true },
    { field: "total_delay", desc: "End-to-end delay, capture to broadcast.", timing: true },
    { field: "latency", desc: "Transcription latency in seconds.", timing: true },
    { field: "is_replay", desc: "True when the frame is a backlog replay." },
    { field: "catchup_interval_sec", desc: "Spacing used when replaying backlog.", timing: true },
  ],
  payloadNote:
    "Latency depends on speech segmentation, model, hardware, and system load. Timing fields are measured in seconds. Every session also saves .srt, .vtt, and .jsonl locally.",

  closingEyebrow: "// download",
  closingHeading: "Get LiveAudio and wire up OBS today.",
  closingBody:
    `Free & open-source (MIT) for Windows x64 & Linux x86_64 (${LIVEAUDIO_TAG}). No subscription, no API key, and zero data collected or retained by the desktop app.`,
  download: `Download LiveAudio ${LIVEAUDIO_TAG} (free)`,
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
    "Agrega subtítulos locales de LiveAudio a OBS Studio con una fuente de navegador (Archivo local desmarcado), 7 temas en vivo, reconexión anti-ráfagas en /overlay y grabación local .srt/.vtt/.jsonl.",

  eyebrow: "// configurar obs",
  h1: "Agrega los subtítulos de LiveAudio a OBS en cinco pasos.",
  intro:
    `Inicia el sistema en LiveAudio y después copia la URL del overlay en una fuente de navegador de OBS. La página /overlay se conecta por un WebSocket local con reconexión anti-ráfagas, 7 temas en vivo (default, karaoke, neon, minimal, bold, rgb, typewriter), listener solo loopback y lista de orígenes permitidos, mientras cada sesión guarda .srt (listo para DaVinci Resolve), .vtt y .jsonl en local y el actualizador seguro bloquea actualizaciones mientras OBS está conectado. Windows x64 y Linux x86_64 (${LIVEAUDIO_TAG}).`,

  introPlain:
    "Inicia LiveAudio, copia su enlace del overlay y pégalo en OBS. Cinco pasos cortos con 7 temas en vivo, reconexión anti-ráfagas y grabación automática .srt/.vtt/.jsonl en local.",
  url: {
    label: "Tu enlace del overlay",
    value: "http://127.0.0.1:8765/overlay",
    hint: "Pégalo en el cuadro URL de la fuente de navegador (con Archivo local desmarcado). Inicia siempre el sistema antes de copiar la URL en LiveAudio para que el puerto activo coincida.",
    copy: "Copiar enlace",
    copied: "Copiado",
  },
  seeLabel: "Deberías ver",
  moreDetail: "Detalles completos",
  techEyebrow: "// para los curiosos",
  techHeading: "Cómo llegan los subtítulos a OBS.",

  stepsEyebrow: "// los cinco pasos",
  stepsHeading: "El flujo exacto de la fuente de navegador.",
  steps: [
    {
      kicker: "// fuente de navegador",
      name: "Agrega una fuente de navegador en OBS",
      text: "En OBS, ve a Fuentes → + → Navegador. Esto crea la superficie sobre la que LiveAudio dibuja los subtítulos dentro de tu escena.",
      token: "Fuentes → + → Navegador",
      short: "Abre OBS y pulsa Fuentes → + → Navegador.",
      see: "Una nueva fuente de navegador en tu lista de Fuentes.",
    },
    {
      kicker: "// overlay local",
      name: "Pega la URL del overlay y configura 1920×1080",
      text: "En LiveAudio, selecciona tu dispositivo de audio (micrófono o loopback WASAPI en Windows / PipeWire-PulseAudio en Linux), el perfil y el motor (NVIDIA Parakeet-TDT para ES/EN o Whisper) y pulsa Guardar. Inicia el sistema antes de copiar la URL del overlay con Copiar URL (URL de Fuente de Navegador, en la tarjeta de integración con OBS Studio). En OBS, deja Archivo local desmarcado y pégala en URL. Configura Ancho 1920 y Alto 1080: el lienzo completo, porque el overlay posiciona los subtítulos por sí mismo.",
      token: "1920×1080",
      short: "Inicia el sistema en LiveAudio, pulsa Copiar URL y pégala en el cuadro URL. Deja Archivo local desmarcado y configura el tamaño 1920×1080.",
      see: "Una fuente de lienzo completo. El overlay coloca los subtítulos por ti.",
    },
    {
      kicker: "// mantener activo",
      name: 'Desactiva "Apagar la fuente cuando no está visible"',
      text: 'En las propiedades de la fuente de navegador, desactiva "Apagar la fuente cuando no está visible" (y "Actualizar el navegador cuando la escena se activa") para mantener activa la conexión al cambiar de escena.',
      amber: 'desactiva "apagar cuando no está visible"',
      short: "Desactiva \"Apagar la fuente cuando no está visible\" para que los subtítulos sigan funcionando al cambiar de escena.",
      see: "Ambas opciones desmarcadas en las propiedades de la fuente de navegador.",
    },
    {
      kicker: "// igualar puerto",
      name: "Comprueba el puerto del WebSocket (predeterminado 8765)",
      text: "La URL de la fuente de navegador es http://127.0.0.1:8765/overlay; Copiar URL agrega ?port=<puerto> con el puerto activo. LiveAudio comienza en ws_port (predeterminado 8765) y, si está ocupado, prueba hasta ws_port + 9 (8765–8774 por defecto); copia de nuevo la URL si el puerto cambia. ws://127.0.0.1:8765 es el endpoint WebSocket al que se conecta el overlay, no lo que se pega en OBS.",
      token: "http://127.0.0.1:8765/overlay",
      amber: "usa la URL copiada para el puerto activo",
      short: "Usa el enlace tal como lo copiaste. Si LiveAudio cambia de puerto, cópialo de nuevo.",
      see: "Una URL que termina en /overlay con el puerto activo (8765 por defecto).",
    },
    {
      kicker: "// salir en vivo y temas",
      name: "Comprueba los subtítulos y elige un tema en vivo",
      text: "Habla y comprueba los subtítulos en la fuente de navegador de OBS. Cambia al instante entre 7 temas integrados desde la pestaña Estilo (default, karaoke, neon, minimal, bold, rgb, typewriter) sin recargar OBS. La reconexión anti-ráfagas de /overlay evita acumulaciones si OBS reconecta, cada sesión guarda archivos .srt (listos para DaVinci Resolve), .vtt y .jsonl en local y el actualizador seguro bloquea actualizaciones mientras estás en directo o OBS está conectado. Si los subtítulos se ven en un navegador normal pero no en OBS, abre las propiedades de la fuente de navegador y pulsa Actualizar la caché de la página actual.",
      token: "7 temas en vivo · /overlay anti-ráfagas",
      short: "Habla, mira los subtítulos en OBS y cambia al vuelo entre los 7 temas integrados.",
      see: "Tus palabras apareciendo como subtítulos estilizados en OBS.",
    },
  ],

  diagramEyebrow: "// el camino de la señal",
  diagramHeading: "Cómo llega la señal de subtítulos a OBS.",
  diagramBody:
    "LiveAudio transcribe localmente y emite subtítulos en JSON por un WebSocket local. OBS se conecta mediante la página integrada /overlay con reconexión anti-ráfagas y 7 temas en vivo, y cualquier cliente HTML o WebSocket en localhost puede recibir la misma transmisión. El servidor escucha solo en 127.0.0.1, descarta pares que no sean loopback y filtra páginas de navegador por Origin (HTTP 403 en caso contrario): la fuente de navegador de OBS y /overlay ya están permitidos. Otras herramientas locales en otro puerto pueden autorizarse en Avanzado > Conexiones locales permitidas.",

  payloadEyebrow: "// payload del websocket",
  payloadHeading: "Qué contiene cada frame de subtítulo.",
  payloadIntro:
    "Cada subtítulo es un pequeño frame JSON emitido por el WebSocket local. Además de los frames de subtítulo, el servidor envía primero un frame hello en cada conexión, frames theme y, opcionalmente, frames subtitle_partial; llevan un campo type y no tienen texto de subtítulo, así que omítelos si solo quieres subtítulos finales.",
  payloadColField: "campo",
  payloadColDesc: "descripción",
  payloadFields: [
    { field: "id", desc: "Id opaco del subtítulo por sesión, como utt_42. No es monotónico; no lo uses para ordenar." },
    { field: "text", desc: "El texto transcrito del subtítulo." },
    { field: "style", desc: "Tema en vivo activo: default, karaoke, neon, minimal, bold, rgb o typewriter." },
    { field: "created_at", desc: "Cuándo se capturó el segmento de audio." },
    { field: "processed_at", desc: "Cuándo terminó la transcripción." },
    { field: "queue_delay", desc: "Segundos de espera en la cola.", timing: true },
    { field: "total_delay", desc: "Retardo de extremo a extremo, de captura a emisión.", timing: true },
    { field: "latency", desc: "Latencia de transcripción en segundos.", timing: true },
    { field: "is_replay", desc: "Verdadero cuando el frame es una repetición del backlog." },
    { field: "catchup_interval_sec", desc: "Espaciado usado al repetir el backlog.", timing: true },
  ],
  payloadNote:
    "La latencia depende de la segmentación, el modelo, el hardware y la carga. Los campos de tiempo se miden en segundos. Cada sesión guarda además .srt, .vtt y .jsonl en local.",

  closingEyebrow: "// descargar",
  closingHeading: "Descarga LiveAudio y configura OBS hoy.",
  closingBody:
    `Gratis y de código abierto (MIT) para Windows x64 y Linux x86_64 (${LIVEAUDIO_TAG}). Sin suscripción, sin clave API y sin recolección ni retención de datos en la aplicación de escritorio.`,
  download: `Descargar LiveAudio ${LIVEAUDIO_TAG} (gratis)`,
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
