import { useEffect, useMemo, useRef, useState } from "react";
import { Download, ArrowRight } from "lucide-react";

/**
 * HeroSignalDesk — THE SIGNAL DESK signature island (per the design system).
 *
 * Asymmetric hero:
 *   LEFT  editorial column — eyebrow + live-dot, mixed-weight H1 (line A 800
 *         strong with a neon accent word + caret, line B 500 muted), the
 *         hero subtitle VERBATIM from the product spec, Download + How-it-works CTAs,
 *         mono micro-trust row.
 *   RIGHT console — a caption ribbon that types / holds / dissolves real example
 *         caption lines, and a `.payload-rail` printing REAL WebSocket fields
 *         {id, text, latency, total_delay, is_replay} from ws://127.0.0.1:8765.
 *         latency / total_delay render amber via the `.t` class (timing law).
 *         Amber `(Live preview · illustrative)` sim-label + one `scan` pass.
 *
 * The island attempts a live ws://127.0.0.1:8765 connection (a real LiveAudio
 * instance on the visitor's machine would feed it); when none is present it
 * falls back to an illustrative stream built from real payload shapes — the
 * amber sim-label already declares this. Honors prefers-reduced-motion (static
 * composed frame) and reserves height to avoid CLS.
 *
 * All numbers/strings are traceable: latency ~1.1s, total_delay ~1.3s (§7),
 * sub-second to ~1s — never "milliseconds".
 */

type Lang = "en" | "es";

interface Props {
  lang?: Lang;
}

interface Payload {
  id: number;
  text: string;
  latency: number;
  total_delay: number;
  is_replay: boolean;
}

const WS_URL = "ws://127.0.0.1:8765";

// Real-shaped example caption lines (illustrative; labeled as such in the UI).
const EXAMPLE_LINES: Record<Lang, string[]> = {
  en: [
    "and that is how the local pipeline stays offline",
    "Whisper turbo is decoding this in real time",
    "Silero VAD just trimmed the silence there",
    "captions are streaming straight into OBS now",
  ],
  es: [
    "así es como el pipeline local se mantiene sin conexión",
    "Whisper turbo está decodificando esto en tiempo real",
    "Silero VAD acaba de recortar el silencio ahí",
    "los subtítulos van directo a OBS ahora mismo",
  ],
};

const COPY: Record<
  Lang,
  {
    eyebrow: string;
    titleA: string;
    accent: string;
    titleATail: string;
    titleB: string;
    subtitle: string;
    download: string;
    how: string;
    howHref: string;
    downloadHref: string;
    microTrust: string[];
    consoleTab: string;
    railTab: string;
    simLabel: string;
    statusLive: string;
    statusPreview: string;
  }
> = {
  en: {
    eyebrow: "PLYNTE LIVEAUDIO v1.2.0 · WINDOWS & LINUX",
    titleA: "Real-time ",
    accent: "local",
    titleATail: " captions for your OBS.",
    titleB: "No cloud, no subscription, no API key.",
    subtitle:
      "LiveAudio is a free, open-source (MIT) app that generates real-time Whisper speech captions 100% locally and streams them to OBS over a local WebSocket. It runs on Windows and Linux. No cloud, no API key, no per-minute cost.",
    download: "Download LiveAudio v1.2.0 (free)",
    how: "How it works",
    howHref: "/getting-started/",
    downloadHref: "/download/",
    microTrust: ["100% local", "MIT open-source", "Windows + Linux"],
    consoleTab: "subtitulos_obs.html",
    railTab: "ws://127.0.0.1:8765",
    simLabel: "Live preview · illustrative",
    statusLive: "LIVE",
    statusPreview: "PREVIEW",
  },
  es: {
    eyebrow: "PLYNTE LIVEAUDIO v1.2.0 · WINDOWS Y LINUX",
    titleA: "Subtítulos ",
    accent: "locales",
    titleATail: " en tiempo real para tu OBS.",
    titleB: "Sin nube, sin suscripción, sin API key.",
    subtitle:
      "LiveAudio es una app gratuita y de código abierto (MIT) que genera subtítulos de voz en tiempo real con Whisper, 100% en tu equipo, y los envía a OBS por un WebSocket local. Funciona en Windows y Linux. Sin nube, sin API key, sin costo por minuto.",
    download: "Descargar LiveAudio v1.2.0 (gratis)",
    how: "Cómo funciona",
    howHref: "/es/getting-started/",
    downloadHref: "/es/download/",
    microTrust: ["100% local", "Código abierto MIT", "Windows + Linux"],
    consoleTab: "subtitulos_obs.html",
    railTab: "ws://127.0.0.1:8765",
    simLabel: "Vista previa en vivo · ilustrativo",
    statusLive: "EN VIVO",
    statusPreview: "VISTA PREVIA",
  },
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export default function HeroSignalDesk({ lang = "en" }: Props) {
  const copy = COPY[lang];
  const lines = useMemo(() => EXAMPLE_LINES[lang], [lang]);
  const reduced = usePrefersReducedMotion();

  const [live, setLive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [ribbon, setRibbon] = useState(reduced ? lines[0] : "");
  const [phase, setPhase] = useState<"typing" | "hold" | "dissolve">("hold");
  const [payloads, setPayloads] = useState<Payload[]>(() =>
    seedPayloads(lines, lang),
  );

  // One scan pass on mount (visual only).
  useEffect(() => {
    if (reduced) {
      setScanned(true);
      return;
    }
    const id = window.setTimeout(() => setScanned(true), 1400);
    return () => window.clearTimeout(id);
  }, [reduced]);

  // Try a real local WebSocket; otherwise stay in illustrative mode.
  useEffect(() => {
    if (reduced) return;
    let ws: WebSocket | null = null;
    let closed = false;
    try {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => {
        if (!closed) setLive(true);
      };
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as Partial<Payload> & {
            text?: string;
          };
          if (typeof data.text !== "string") return;
          const p: Payload = {
            id: typeof data.id === "number" ? data.id : Date.now() % 100000,
            text: data.text,
            latency: typeof data.latency === "number" ? data.latency : 1.1,
            total_delay:
              typeof data.total_delay === "number" ? data.total_delay : 1.3,
            is_replay: Boolean(data.is_replay),
          };
          setRibbon(p.text);
          setPhase("hold");
          setPayloads((prev) => [p, ...prev].slice(0, 4));
        } catch {
          /* ignore malformed frame */
        }
      };
      ws.onerror = () => {
        if (!closed) setLive(false);
      };
    } catch {
      setLive(false);
    }
    return () => {
      closed = true;
      ws?.close();
    };
  }, [reduced]);

  // Illustrative caption cycle (type -> hold -> dissolve) when not live.
  useEffect(() => {
    if (reduced || live) return;
    let i = 0;
    let charTimer = 0;
    let phaseTimer = 0;

    const run = () => {
      const full = lines[i % lines.length];
      setPhase("typing");
      setRibbon("");
      let c = 0;
      const type = () => {
        c += 1;
        setRibbon(full.slice(0, c));
        if (c < full.length) {
          charTimer = window.setTimeout(type, 28);
        } else {
          setPhase("hold");
          phaseTimer = window.setTimeout(() => {
            setPhase("dissolve");
            phaseTimer = window.setTimeout(() => {
              i += 1;
              // advance the payload rail in lockstep
              setPayloads(() => seedPayloads(rotate(lines, i), lang));
              run();
            }, 520);
          }, 2200);
        }
      };
      type();
    };

    run();
    return () => {
      window.clearTimeout(charTimer);
      window.clearTimeout(phaseTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, live, lang]);

  const statusText = live ? copy.statusLive : copy.statusPreview;

  return (
    <section className="hero section section-glow" aria-labelledby="hero-h1">
      <div className="container hero-grid">
        {/* LEFT — editorial column */}
        <div className="hero-left">
          <p className="eyebrow hero-eyebrow">
            <span className="live-dot" aria-hidden="true" />
            {copy.eyebrow}
          </p>

          <h1 id="hero-h1" className="hero-title">
            <span className="hero-title-a">
              {copy.titleA}
              <span className="hero-accent">
                {copy.accent}
                <span
                  className={reduced ? "" : "caret"}
                  aria-hidden="true"
                />
              </span>
              {copy.titleATail}
            </span>
            <span className="hero-title-b">{copy.titleB}</span>
          </h1>

          <p className="hero-subtitle">{copy.subtitle}</p>

          <div className="hero-ctas">
            <a className="btn btn-primary" href={copy.downloadHref}>
              <Download size={20} strokeWidth={1.75} aria-hidden="true" />
              {copy.download}
            </a>
            <a className="btn btn-secondary" href={copy.howHref}>
              {copy.how}
              <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>

          <ul className="hero-trust" role="list">
            {copy.microTrust.map((item) => (
              <li key={item} className="hero-trust-item">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — console + payload rail */}
        <div className="hero-right">
          <div className="console hero-console">
            {!scanned && !reduced && (
              <span className="hero-scan" aria-hidden="true" />
            )}

            {/* Console head */}
            <div className="hero-console-head">
              <span className="hero-dots" aria-hidden="true">
                <span className="hero-dot" />
                <span className="hero-dot" />
                <span className="hero-dot" />
              </span>
              <span className="hero-console-tab">{copy.consoleTab}</span>
              <span
                className={`hero-status ${live ? "is-live" : ""}`}
                aria-hidden="true"
              >
                <span className="live-dot" />
                {statusText}
              </span>
            </div>

            {/* Caption ribbon */}
            <div className="hero-ribbon" aria-hidden="true">
              <span className={`hero-ribbon-line phase-${phase}`}>
                {ribbon}
                {!reduced && phase === "typing" && (
                  <span className="hero-ribbon-caret" />
                )}
              </span>
            </div>

            {/* Payload rail */}
            <div className="payload-rail hero-rail">
              <div className="hero-rail-tab">{copy.railTab}</div>
              <ul className="hero-rail-list" role="list">
                {payloads.map((p, idx) => (
                  <li
                    key={`${p.id}-${idx}`}
                    className="hero-rail-row"
                    style={{ opacity: 1 - idx * 0.18 }}
                  >
                    <span className="k">id</span>
                    <span className="v">{p.id}</span>
                    <span className="k">text</span>
                    <span className="v hero-rail-text">
                      &quot;{truncate(p.text, 26)}&quot;
                    </span>
                    <span className="k">latency</span>
                    <span className="t">{p.latency.toFixed(2)}s</span>
                    <span className="k">total_delay</span>
                    <span className="t">{p.total_delay.toFixed(2)}s</span>
                    <span className="k">is_replay</span>
                    <span className="v">{String(p.is_replay)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sim label */}
            <div className="hero-sim">
              <span className="pill pill-amber">{copy.simLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          padding-block: clamp(3rem, 8vh, 6rem) clamp(4rem, 9vh, 7rem);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-9);
          align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 58fr 42fr;
            gap: var(--space-10);
          }
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
        }
        .hero-title {
          font-size: var(--text-display);
          margin: 0 0 var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .hero-title-a {
          font-weight: 800;
          color: var(--color-text-strong);
        }
        .hero-accent {
          color: var(--color-neon);
          white-space: nowrap;
        }
        .hero-title-b {
          font-weight: 500;
          color: var(--color-text-muted);
        }
        .hero-subtitle {
          color: var(--color-text);
          font-size: var(--text-lg);
          line-height: 1.6;
          max-width: var(--measure);
          margin: 0 0 var(--space-7);
        }
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }
        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .hero-trust-item {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .hero-trust-item::before {
          content: "·";
          color: var(--color-green);
        }

        /* Console */
        .hero-right {
          min-width: 0;
        }
        .hero-console {
          position: relative;
          overflow: hidden;
          min-height: 360px; /* reserve height: no CLS */
          display: flex;
          flex-direction: column;
        }
        .hero-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 40%;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--color-green-glow),
            transparent
          );
          animation: scan 1.3s var(--ease-mech) 1 both;
          pointer-events: none;
          z-index: 2;
        }
        .hero-console-head {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--color-border);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .hero-dots {
          display: inline-flex;
          gap: 6px;
        }
        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: var(--color-ghost);
        }
        .hero-dot:first-child {
          background: var(--color-green);
        }
        .hero-console-tab {
          flex: 1;
        }
        .hero-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.12em;
          color: var(--color-text-muted);
        }
        .hero-status.is-live {
          color: var(--color-green);
        }

        /* Ribbon */
        .hero-ribbon {
          padding: var(--space-7) var(--space-5);
          min-height: 96px;
          display: flex;
          align-items: center;
          font-size: var(--text-lg);
          color: var(--color-text-strong);
          font-weight: 500;
          background: var(--color-surface-2);
          border-bottom: 1px solid var(--color-border);
        }
        .hero-ribbon-line {
          transition: opacity 480ms var(--ease-mech), transform 480ms var(--ease-mech);
        }
        .hero-ribbon-line.phase-dissolve {
          opacity: 0;
          transform: translateY(-4px);
        }
        .hero-ribbon-line.phase-typing,
        .hero-ribbon-line.phase-hold {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-ribbon-caret {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          margin-left: 3px;
          background: var(--color-neon);
          vertical-align: text-bottom;
          animation: caret-blink 1.05s steps(1) infinite;
        }

        /* Payload rail */
        .hero-rail {
          flex: 1;
          padding: var(--space-4) var(--space-5);
        }
        .hero-rail-tab {
          color: var(--color-text-muted);
          margin-bottom: var(--space-3);
          font-size: var(--text-xs);
        }
        .hero-rail-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .hero-rail-row {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2px var(--space-3);
          line-height: 1.5;
          transition: opacity 480ms var(--ease-mech);
        }
        .hero-rail-row:not(:first-child) {
          display: none;
        }
        @media (min-width: 480px) {
          .hero-rail-row {
            grid-template-columns: auto minmax(0, 1fr) auto auto;
            align-items: baseline;
          }
        }
        .hero-rail-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--color-text-muted);
        }

        .hero-sim {
          padding: var(--space-3) var(--space-5) var(--space-5);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-ribbon-line { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------- helpers ---------- */

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function rotate<T>(arr: T[], by: number): T[] {
  const k = ((by % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

function seedPayloads(lines: string[], _lang: Lang): Payload[] {
  // Real-shaped illustrative payloads: sub-second to ~1s latencies (§7).
  const baseId = 1042;
  return lines.slice(0, 4).map((text, i) => ({
    id: baseId + (lines.length - i),
    text,
    latency: 1.08 + i * 0.04,
    total_delay: 1.27 + i * 0.05,
    is_replay: i === lines.length - 1,
  }));
}
