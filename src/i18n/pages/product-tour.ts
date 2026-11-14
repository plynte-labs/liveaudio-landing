import type { Locale } from "../routes";

export interface ProductTourChapter {
  id: "setup" | "style" | "rust";
  eyebrow: string;
  title: string;
  body: string;
  alt: string;
  layout: "wide" | "split";
}

export interface ProductTourCopy {
  meta: { title: string; description: string };
  eyebrow: string;
  heading: string;
  lead: string;
  authenticity: string;
  setupNote: string;
  open: string;
  close: string;
  previous: string;
  next: string;
  dialogLabel: string;
  chapters: ProductTourChapter[];
}

const en: ProductTourCopy = {
  meta: {
    title: "Product Tour — LiveAudio v1.6.0",
    description: "A visual walkthrough of the LiveAudio v1.6.0 desktop app: the setup home with the OBS Browser Source URL and the subtitle style editor.",
  },
  eyebrow: "// product tour",
  heading: "A local captioning workspace, shown state by state.",
  lead: "Each chapter is a real product capture with one job to explain. Open an image for a responsive, full-resolution view without leaving the tour.",
  authenticity: "Authentic product captures",
  setupNote: "The first two captures show LiveAudio v1.6.0. The last chapter keeps a historical v1.5.0 (Tauri 2) capture.",
  open: "Open full-resolution image",
  close: "Close image",
  previous: "Previous image",
  next: "Next image",
  dialogLabel: "Product capture viewer",
  chapters: [
    {
      id: "setup",
      eyebrow: "// v1.6.0 · setup",
      title: "Start from a local setup, not an account.",
      body: "The main window keeps the Start Transcription button, the Setup, Subtitles, Style, Advanced and Files tabs, and the audio source, spoken language and recommended profile in one place. On the right, the live subtitles feed, the OBS Studio Browser Source URL with a Copy URL button, and the event log sit beside the controls.",
      alt: "LiveAudio v1.6.0 main window in English. On the left, the Start Transcription button, the Setup, Subtitles, Style, Advanced and Files tabs, and the Setup tab with audio source, spoken language English (en), recommended profile Balanced and a Save button. On the right, the Live Subtitles Feed marked Idle with Test and Clear buttons, an OBS Studio Integration card with the Browser Source URL http://127.0.0.1:8765/overlay?port=8765 and a Copy URL button, and the Event Log. The header shows v1.6.0, Info and stats, and the Stopped and VAD: Silence status pills.",
      layout: "wide",
    },
    {
      id: "style",
      eyebrow: "// v1.6.0 · style",
      title: "Shape the subtitle style and see it live.",
      body: "The Style tab offers a built-in style selector, a preset name field with Save, Delete and Reset style actions, and a live preview of how your subtitles will look. Here a saved preset named Plynte is selected.",
      alt: "LiveAudio v1.6.0 Style tab with the built-in style selector showing a saved preset named Plynte, a preset name field, Save, Delete and Reset style buttons, and a Preview with pixel-font green subtitles reading This is how your subtitles will.",
      layout: "split",
    },
    {
      id: "rust",
      eyebrow: "// v1.5.0 · rust + tauri 2",
      title: "A local transcription workspace.",
      body: "LiveAudio is 100% native Rust with a Tauri 2 desktop and ONNX Runtime DirectML/CPU worker (zero Python). This v1.5.0 capture shows the historical interface foundation.",
      alt: "LiveAudio Advanced tab with Whisper model, DirectML/CUDA compute device, voice-activity sliders, RNNoise suppression, live subtitle feed, OBS Studio integration and event log.",
      layout: "wide",
    },
  ],
};

const es: ProductTourCopy = {
  meta: {
    title: "Tour del producto — LiveAudio v1.6.0",
    description: "Un recorrido visual por la app de escritorio LiveAudio v1.6.0: la pantalla de configuración con la URL de Browser Source para OBS y el editor de estilo de subtítulos.",
  },
  eyebrow: "// tour del producto",
  heading: "Un espacio local para subtítulos, mostrado estado por estado.",
  lead: "Cada capítulo es una captura real del producto con una tarea concreta que explicar. Abre una imagen para verla en resolución completa sin salir del tour.",
  authenticity: "Capturas reales del producto",
  setupNote: "Las dos primeras capturas muestran LiveAudio v1.6.0. El último capítulo conserva una captura histórica de la v1.5.0 (Tauri 2).",
  open: "Abrir imagen en resolución completa",
  close: "Cerrar imagen",
  previous: "Imagen anterior",
  next: "Imagen siguiente",
  dialogLabel: "Visor de capturas del producto",
  chapters: [
    {
      id: "setup",
      eyebrow: "// v1.6.0 · configuración",
      title: "Empieza con una configuración local, no con una cuenta.",
      body: "La ventana principal reúne el botón Start Transcription, las pestañas Setup, Subtitles, Style, Advanced y Files, y la fuente de audio, el idioma hablado y el perfil recomendado en un solo lugar. A la derecha, el feed de subtítulos en vivo, la URL de Browser Source para OBS Studio con botón Copy URL y el registro de eventos acompañan a los controles.",
      alt: "Ventana principal de LiveAudio v1.6.0 con interfaz en inglés. A la izquierda, el botón Start Transcription, las pestañas Setup, Subtitles, Style, Advanced y Files, y la pestaña Setup con fuente de audio, idioma hablado English (en), perfil recomendado Balanced y botón Save. A la derecha, el Live Subtitles Feed en estado Idle con botones Test y Clear, una tarjeta OBS Studio Integration con la URL de Browser Source http://127.0.0.1:8765/overlay?port=8765 y botón Copy URL, y el Event Log. El encabezado muestra v1.6.0, Info & stats y los indicadores Stopped y VAD: Silence.",
      layout: "wide",
    },
    {
      id: "style",
      eyebrow: "// v1.6.0 · estilo",
      title: "Da forma al estilo de los subtítulos y míralo al instante.",
      body: "La pestaña Style ofrece un selector de estilos integrados, un campo de nombre de preset con las acciones Save, Delete y Reset style, y una vista previa en vivo de cómo se verán tus subtítulos. Aquí está seleccionado un preset guardado llamado Plynte.",
      alt: "Pestaña Style de LiveAudio v1.6.0 con el selector de estilos integrados mostrando un preset guardado llamado Plynte, un campo de nombre de preset, los botones Save, Delete y Reset style, y una vista previa con subtítulos verdes en fuente pixelada que dicen This is how your subtitles will.",
      layout: "split",
    },
    {
      id: "rust",
      eyebrow: "// v1.5.0 · rust + tauri 2",
      title: "Un espacio de transcripción local.",
      body: "LiveAudio es 100% Rust nativo con escritorio Tauri 2 y worker ONNX Runtime DirectML/CPU (cero Python). Esta captura de la v1.5.0 muestra la base histórica de la interfaz.",
      alt: "Pestaña Avanzado de LiveAudio con modelo Whisper, dispositivo de cómputo DirectML/CUDA, actividad de voz, supresión RNNoise, feed de subtítulos en vivo, integración con OBS Studio y registro.",
      layout: "wide",
    },
  ],
};

const PRODUCT_TOUR_COPY: Record<Locale, ProductTourCopy> = { en, es };

export function productTourCopy(lang: Locale): ProductTourCopy {
  return PRODUCT_TOUR_COPY[lang];
}
