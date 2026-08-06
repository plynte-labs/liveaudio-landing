import type { Locale } from "../routes";

export interface ProductTourChapter {
  id: "live" | "first-run" | "workspace" | "engine" | "captions" | "advanced" | "diagnostics";
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
    title: "Product Tour — LiveAudio",
    description: "A visual walkthrough of real LiveAudio desktop application states, from first run through local diagnostics.",
  },
  eyebrow: "// product tour",
  heading: "A local captioning workspace, shown state by state.",
  lead: "Each chapter is a real product capture with one job to explain. Open an image for a responsive, full-resolution view without leaving the tour.",
  authenticity: "Authentic product captures",
  setupNote: "The first-run capture visibly shows v1.2.5. Other captures are presented as real product states without inferring a version from the image.",
  open: "Open full-resolution image",
  close: "Close image",
  previous: "Previous image",
  next: "Next image",
  dialogLabel: "Product capture viewer",
  chapters: [
    {
      id: "live",
      eyebrow: "// live workspace",
      title: "See the whole signal chain before it starts.",
      body: "The live panel puts audio, VAD, ASR, WebSocket and OBS status on one local operating surface.",
      alt: "LiveAudio live panel with audio, VAD, ASR, WebSocket, OBS and session status indicators above subtitle output.",
      layout: "wide",
    },
    {
      id: "first-run",
      eyebrow: "// first run",
      title: "Start with a local setup, not an account.",
      body: "Choose the sessions folder, layout and language before starting the caption engine. This capture visibly shows v1.2.5.",
      alt: "LiveAudio initial setup screen with a sessions folder selector, layout and language selectors, configuration tips, and a continue button.",
      layout: "split",
    },
    {
      id: "workspace",
      eyebrow: "// workspace",
      title: "Keep settings and output in one desktop workspace.",
      body: "The settings panes and live panel sit together, so changing a local control does not mean losing the running context.",
      alt: "LiveAudio desktop workspace showing settings on the left and the live panel with caption output on the right.",
      layout: "wide",
    },
    {
      id: "engine",
      eyebrow: "// tune engine",
      title: "Tune the engine beside the stream controls.",
      body: "Audio, VAD, performance and advanced controls stay close to the running system instead of moving to a remote dashboard.",
      alt: "LiveAudio settings panel with tabs for audio and VAD, performance, subtitles and advanced controls.",
      layout: "split",
    },
    {
      id: "captions",
      eyebrow: "// send captions",
      title: "Choose the subtitle style and local delivery path.",
      body: "The subtitle pane shows the visual preview, OBS output, transcript options and the local WebSocket port together.",
      alt: "LiveAudio subtitle settings with a visual style preview, OBS output option, transcript options and WebSocket port field.",
      layout: "split",
    },
    {
      id: "advanced",
      eyebrow: "// advanced control",
      title: "Keep session behavior and filters inspectable.",
      body: "Restart behavior and post-processing are exposed as desktop controls, not hidden behind cloud account defaults.",
      alt: "LiveAudio advanced settings with restart-session behavior and a post-processing filter text field.",
      layout: "split",
    },
    {
      id: "diagnostics",
      eyebrow: "// diagnostics",
      title: "Leave a local record when configuration changes.",
      body: "The technical log gives operators a compact, readable trace of system-level changes on the machine.",
      alt: "LiveAudio technical diagnostics log showing that the configuration was applied and saved.",
      layout: "wide",
    },
  ],
};

const es: ProductTourCopy = {
  meta: {
    title: "Tour del producto — LiveAudio",
    description: "Un recorrido visual por estados reales de la app de escritorio LiveAudio, desde el primer inicio hasta el diagnóstico local.",
  },
  eyebrow: "// tour del producto",
  heading: "Un espacio local para subtítulos, mostrado estado por estado.",
  lead: "Cada capítulo es una captura real del producto con una tarea concreta que explicar. Abre una imagen para verla en resolución completa sin salir del tour.",
  authenticity: "Capturas reales del producto",
  setupNote: "La captura del primer inicio muestra visiblemente la v1.2.5. Las demás se presentan como estados reales del producto sin deducir una versión a partir de la imagen.",
  open: "Abrir imagen en resolución completa",
  close: "Cerrar imagen",
  previous: "Imagen anterior",
  next: "Imagen siguiente",
  dialogLabel: "Visor de capturas del producto",
  chapters: [
    {
      id: "live",
      eyebrow: "// espacio en vivo",
      title: "Ve toda la cadena de señal antes de iniciarla.",
      body: "El panel en vivo reúne el estado de audio, VAD, ASR, WebSocket y OBS en una sola superficie operativa local.",
      alt: "Panel en vivo de LiveAudio con indicadores de estado de audio, VAD, ASR, WebSocket, OBS y sesión sobre la salida de subtítulos.",
      layout: "wide",
    },
    {
      id: "first-run",
      eyebrow: "// primer inicio",
      title: "Empieza con una configuración local, no con una cuenta.",
      body: "Elige la carpeta de sesiones, el diseño y el idioma antes de iniciar el motor de subtítulos. Esta captura muestra visiblemente la v1.2.5.",
      alt: "Pantalla de configuración inicial de LiveAudio con selector de carpeta de sesiones, selectores de diseño e idioma, consejos y botón para continuar.",
      layout: "split",
    },
    {
      id: "workspace",
      eyebrow: "// espacio de trabajo",
      title: "Mantén ajustes y salida en un único espacio de escritorio.",
      body: "Los paneles de ajustes y el panel en vivo conviven, por lo que cambiar un control local no hace perder el contexto de ejecución.",
      alt: "Espacio de trabajo de escritorio LiveAudio con ajustes a la izquierda y el panel en vivo con salida de subtítulos a la derecha.",
      layout: "wide",
    },
    {
      id: "engine",
      eyebrow: "// ajustar motor",
      title: "Ajusta el motor junto a los controles de transmisión.",
      body: "Los controles de audio, VAD, rendimiento y opciones avanzadas permanecen cerca del sistema en ejecución, no en un dashboard remoto.",
      alt: "Panel de ajustes de LiveAudio con pestañas de audio y VAD, rendimiento, subtítulos y opciones avanzadas.",
      layout: "split",
    },
    {
      id: "captions",
      eyebrow: "// enviar subtítulos",
      title: "Elige el estilo y la ruta local de entrega.",
      body: "El panel de subtítulos muestra juntos la vista previa, la salida a OBS, las opciones de transcripción y el puerto WebSocket local.",
      alt: "Ajustes de subtítulos de LiveAudio con vista previa de estilo, opción de salida a OBS, opciones de transcripción y campo de puerto WebSocket.",
      layout: "split",
    },
    {
      id: "advanced",
      eyebrow: "// control avanzado",
      title: "Mantén el comportamiento de sesión y los filtros a la vista.",
      body: "El reinicio de sesión y el postprocesamiento son controles de escritorio visibles, no valores ocultos detrás de una cuenta en la nube.",
      alt: "Ajustes avanzados de LiveAudio con comportamiento de sesión al reiniciar y un campo de texto para filtro de postprocesamiento.",
      layout: "split",
    },
    {
      id: "diagnostics",
      eyebrow: "// diagnóstico",
      title: "Deja un registro local cuando cambia la configuración.",
      body: "El registro técnico ofrece a operadores un rastro compacto y legible de cambios del sistema en el equipo.",
      alt: "Registro técnico de diagnóstico de LiveAudio que muestra que la configuración se aplicó y guardó.",
      layout: "wide",
    },
  ],
};

const PRODUCT_TOUR_COPY: Record<Locale, ProductTourCopy> = { en, es };

export function productTourCopy(lang: Locale): ProductTourCopy {
  return PRODUCT_TOUR_COPY[lang];
}
