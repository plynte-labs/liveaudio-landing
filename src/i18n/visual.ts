/**
 * Shared plain-language copy for the visual sections (step flow, call-to-action
 * bands, "technical details" labels). Facts mirror the existing v1.6.0 page copy:
 * Windows x64 installer, pick device + model, start the system, copy the overlay
 * URL into an OBS Browser source. EN and ES are kept in sync.
 */
import type { Locale } from "./routes";
import { localizedPath } from "./routes";

export type VisualIcon = "download" | "mic" | "monitor" | "lifebuoy";

export interface FlowStep {
  icon: VisualIcon;
  title: string;
  body: string;
  /** Route slug passed to localizedPath. */
  route: string;
  linkLabel: string;
}

export interface CtaBandCopy {
  heading: string;
  body: string;
  icon: VisualIcon;
  actions: { label: string; href: string; variant: "primary" | "secondary" }[];
}

export interface VisualCopy {
  techDetails: string;
  allFiles: string;
  flow: { eyebrow: string; heading: string; intro: string; steps: FlowStep[] };
  band: { download: CtaBandCopy; obs: CtaBandCopy; help: CtaBandCopy };
}

const en = (l: Locale): VisualCopy => ({
  techDetails: "Technical details (optional)",
  allFiles: "All download files (advanced)",
  flow: {
    eyebrow: "// how it works",
    heading: "How it works in 3 steps.",
    intro: "From install to captions on your stream. No account and no API key.",
    steps: [
      { icon: "download", title: "Install", body: "Download the free Windows installer and run it.", route: "download", linkLabel: "Get the installer" },
      { icon: "mic", title: "Pick your mic", body: "Choose your microphone and a speech model, then start the system.", route: "getting-started", linkLabel: "See the setup guide" },
      { icon: "monitor", title: "Add it to OBS", body: "Copy the overlay link into an OBS Browser source. Captions show on your stream.", route: "obs-setup", linkLabel: "Set up OBS" },
    ],
  },
  band: {
    download: {
      icon: "download",
      heading: "Need LiveAudio first?",
      body: "It is free and open source (MIT), and it runs on your own PC.",
      actions: [{ label: "Download LiveAudio (free)", href: localizedPath(l, "download"), variant: "primary" }],
    },
    obs: {
      icon: "monitor",
      heading: "Installed already? Connect it to OBS.",
      body: "Five short steps: add a Browser source, paste the link, check your captions.",
      actions: [{ label: "Set up OBS", href: localizedPath(l, "obs-setup"), variant: "primary" }],
    },
    help: {
      icon: "lifebuoy",
      heading: "Need a hand?",
      body: "Read the quick answers, follow the setup guide, or browse the docs.",
      actions: [
        { label: "Read the FAQ", href: localizedPath(l, "faq"), variant: "secondary" },
        { label: "Getting started", href: localizedPath(l, "getting-started"), variant: "secondary" },
        { label: "Browse the docs", href: localizedPath(l, "docs/overview"), variant: "secondary" },
      ],
    },
  },
});

const es = (l: Locale): VisualCopy => ({
  techDetails: "Detalles técnicos (opcional)",
  allFiles: "Todos los archivos de descarga (avanzado)",
  flow: {
    eyebrow: "// cómo funciona",
    heading: "Cómo funciona en 3 pasos.",
    intro: "De la instalación a los subtítulos en tu stream. Sin cuenta y sin API key.",
    steps: [
      { icon: "download", title: "Instala", body: "Descarga el instalador gratuito para Windows y ejecútalo.", route: "download", linkLabel: "Obtener el instalador" },
      { icon: "mic", title: "Elige tu micrófono", body: "Elige tu micrófono y un modelo de voz, y luego inicia el sistema.", route: "getting-started", linkLabel: "Ver la guía de inicio" },
      { icon: "monitor", title: "Agrégalo a OBS", body: "Copia el enlace del overlay en una fuente de navegador de OBS. Los subtítulos aparecen en tu stream.", route: "obs-setup", linkLabel: "Configurar OBS" },
    ],
  },
  band: {
    download: {
      icon: "download",
      heading: "¿Aún no tienes LiveAudio?",
      body: "Es gratis y de código abierto (MIT), y funciona en tu propia PC.",
      actions: [{ label: "Descargar LiveAudio (gratis)", href: localizedPath(l, "download"), variant: "primary" }],
    },
    obs: {
      icon: "monitor",
      heading: "¿Ya lo instalaste? Conéctalo a OBS.",
      body: "Cinco pasos cortos: agrega una fuente de navegador, pega el enlace y comprueba tus subtítulos.",
      actions: [{ label: "Configurar OBS", href: localizedPath(l, "obs-setup"), variant: "primary" }],
    },
    help: {
      icon: "lifebuoy",
      heading: "¿Necesitas ayuda?",
      body: "Lee las respuestas rápidas, sigue la guía de inicio o explora la documentación.",
      actions: [
        { label: "Leer las preguntas frecuentes", href: localizedPath(l, "faq"), variant: "secondary" },
        { label: "Primeros pasos", href: localizedPath(l, "getting-started"), variant: "secondary" },
        { label: "Explorar la documentación", href: localizedPath(l, "docs/overview"), variant: "secondary" },
      ],
    },
  },
});

export function visualCopy(lang: Locale): VisualCopy {
  return lang === "es" ? es(lang) : en(lang);
}
