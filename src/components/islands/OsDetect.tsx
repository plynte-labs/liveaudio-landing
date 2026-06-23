import { useEffect, useState } from "react";
import { Download, MonitorDown, ArrowUpRight } from "lucide-react";
import {
  PRIMARY_ASSETS,
  RELEASE_LATEST,
  downloadCopy,
  type Os,
} from "../../i18n/pages/download";
import type { Locale } from "../../i18n/routes";

/**
 * OsDetect — /download terminal-output console (per the design system).
 *
 * No-JS safe by construction: BOTH platform builds (Windows + Linux) are real
 * targets and BOTH render in the static HTML. The giant `.btn-primary` is the
 * matched/active OS; the other platform sits beside it as a `.btn-secondary`.
 * A manual OS toggle lets the visitor switch which build is primary. Client
 * detection only RE-ORDERS / RELABELS — it never gates or hides a download, and
 * the full asset table below is always visible regardless of JS.
 *
 * Initial render is deterministic (Windows primary) so the SSR HTML is valid
 * and identical to first hydration; `useEffect` then promotes the detected OS.
 *
 * Hydrated with client:idle by the page (non-blocking; the buttons already work
 * before hydration because they are plain anchors to real release URLs).
 */

interface Props {
  lang?: Locale;
}

const OS_ORDER: Os[] = ["windows", "linux"];

/**
 * Confident RESTING label for the console status line. Both platform builds
 * already render server-side, so before/without detection we invite a choice
 * instead of implying the page is still "Detecting OS…" (neutral Spanish per
 * the artifact-language contract — no voseo).
 */
const RESTING_LABEL: Record<Locale, string> = {
  en: "Choose your platform",
  es: "Elige tu plataforma",
};

function detectOs(): Os | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (/Windows/i.test(ua)) return "windows";
  // Exclude Android (Linux kernel) so we don't mislabel phones.
  if (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return null;
}

export default function OsDetect({ lang = "en" }: Props) {
  const copy = downloadCopy(lang);

  // Deterministic first paint → matches SSR. Promote on the client.
  const [active, setActive] = useState<Os>("windows");
  const [detected, setDetected] = useState<Os | null>(null);

  useEffect(() => {
    const os = detectOs();
    setDetected(os);
    if (os) setActive(os);
  }, []);

  const osLabel = (os: Os): string =>
    os === "windows" ? copy.windowsLabel : copy.linuxLabel;

  const statusText = detected
    ? `${copy.detectedPrefix} ${osLabel(detected)}`
    : RESTING_LABEL[lang];

  const activeAsset = PRIMARY_ASSETS[active];
  // Keep a stable, ordered list so the secondary builds always render.
  const others = OS_ORDER.filter((os) => os !== active);

  return (
    <div className="osd console">
      {/* Console head: terminal-style status line */}
      <div className="osd-head">
        <span className="osd-dots" aria-hidden="true">
          <span className="osd-dot" />
          <span className="osd-dot" />
          <span className="osd-dot" />
        </span>
        <span className="osd-tab">liveaudio · v1.2.0</span>
        <span className="osd-status" aria-live="polite">
          <span className="live-dot" aria-hidden="true" />
          {statusText}
        </span>
      </div>

      <div className="osd-body">
        {/* Manual OS toggle — never gates a download, just re-targets primary */}
        <div
          className="osd-toggle"
          role="group"
          aria-label={copy.toggleLabel}
        >
          {OS_ORDER.map((os) => {
            const isActive = os === active;
            return (
              <button
                key={os}
                type="button"
                className={`osd-toggle-btn${isActive ? " is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => setActive(os)}
              >
                {osLabel(os)}
              </button>
            );
          })}
        </div>

        {/* The giant matched primary CTA */}
        <a className="btn btn-primary osd-primary" href={activeAsset.url}>
          <Download size={24} strokeWidth={1.75} aria-hidden="true" />
          <span className="osd-primary-label">
            {copy.downloadVerb} {osLabel(active)}
          </span>
          <span className="osd-primary-meta">
            {activeAsset.filename} · {activeAsset.size}
          </span>
        </a>

        {/* The other real build(s) stay reachable as secondary anchors */}
        <div className="osd-others">
          {others.map((os) => {
            const a = PRIMARY_ASSETS[os];
            return (
              <a key={os} className="btn btn-secondary osd-other" href={a.url}>
                <MonitorDown
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="osd-other-label">
                  {copy.downloadVerb} {osLabel(os)}
                </span>
                <span className="osd-other-meta">
                  {a.filename} · {a.size}
                </span>
              </a>
            );
          })}
        </div>

        {/* Always-latest redirect */}
        <a
          className="btn-tertiary osd-latest"
          href={RELEASE_LATEST}
          rel="noopener"
        >
          {copy.latestLinkLabel}
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>

      <style>{`
        .osd { overflow: hidden; }
        .osd-head {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--color-border);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .osd-dots { display: inline-flex; gap: 6px; }
        .osd-dot {
          width: 8px; height: 8px; border-radius: 9999px;
          background: var(--color-ghost);
        }
        .osd-dot:first-child { background: var(--color-green); }
        .osd-tab { flex: 1; }
        .osd-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-green);
          letter-spacing: 0.04em;
        }

        .osd-body {
          padding: var(--space-7) var(--space-6) var(--space-8);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .osd-toggle {
          display: inline-flex;
          align-self: flex-start;
          gap: 2px;
          padding: 3px;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
        }
        .osd-toggle-btn {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
          padding: 6px var(--space-4);
          min-height: 32px;
          border-radius: var(--radius-sm);
          background: transparent;
          cursor: pointer;
          transition: color 120ms, background 120ms;
        }
        .osd-toggle-btn:hover { color: var(--color-text); }
        .osd-toggle-btn.is-active {
          color: var(--color-bg);
          background: var(--color-green);
        }

        .osd-primary {
          min-height: 64px;
          align-self: flex-start;
          max-width: 100%;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-1);
          padding: var(--space-4) var(--space-7);
          position: relative;
        }
        .osd-primary > svg {
          position: absolute;
          top: var(--space-4);
          right: var(--space-5);
        }
        .osd-primary-label {
          font-size: var(--text-base);
          font-weight: 700;
          padding-right: var(--space-7);
        }
        .osd-primary-meta {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          font-weight: 400;
          opacity: 0.85;
        }

        .osd-others {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }
        .osd-other {
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          min-height: 56px;
          padding: var(--space-3) var(--space-5);
        }
        .osd-other-label { font-weight: 600; }
        .osd-other-meta {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          font-weight: 400;
          color: var(--color-text-muted);
        }

        .osd-latest {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          align-self: flex-start;
          font-size: var(--text-xs);
        }
      `}</style>
    </div>
  );
}
