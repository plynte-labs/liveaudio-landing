import { useState, useSyncExternalStore } from "react";
import {
  Download,
  MonitorDown,
  ArrowUpRight,
  RotateCcw,
  WifiOff,
  ShieldCheck,
  FileCheck,
  Bug,
  Star,
} from "lucide-react";
import {
  PRIMARY_ASSETS,
  CLI_ASSET,
  RELEASE_LATEST,
  ISSUES_URL,
  REPO_URL,
  LIVEAUDIO_TAG,
  downloadCopy,
  type Os,
  type PrimaryAsset,
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

const subscribeNoop = () => () => {};
const getServerOs = (): Os | null => null;

export default function OsDetect({ lang = "en" }: Props) {
  const copy = downloadCopy(lang);

  // Deterministic SSR ("windows") promoted client-side via useSyncExternalStore
  // without synchronous setState-in-effect.
  const detected = useSyncExternalStore(subscribeNoop, detectOs, getServerOs);
  const [manualOs, setManualOs] = useState<Os | null>(null);
  const [downloadedAsset, setDownloadedAsset] = useState<PrimaryAsset | null>(null);

  const active: Os = manualOs ?? detected ?? "windows";

  const osLabel = (os: Os): string =>
    os === "windows" ? copy.windowsLabel : copy.linuxLabel;

  const statusText = downloadedAsset
    ? copy.statusDownloading
    : detected
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
        <span className="osd-tab">liveaudio · {LIVEAUDIO_TAG} · rust</span>
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
                onClick={() => setManualOs(os)}
              >
                {osLabel(os)}
              </button>
            );
          })}
        </div>

        {/* The giant matched primary CTA */}
        <a
          className="btn btn-primary osd-primary"
          href={activeAsset.url}
          onClick={() => setDownloadedAsset(activeAsset)}
        >
          <Download size={24} strokeWidth={1.75} aria-hidden="true" />
          <span className="osd-primary-label">
            {copy.downloadVerb} {osLabel(active)}
          </span>
          <span className="osd-primary-meta">
            {activeAsset.filename}{activeAsset.size ? ` · ${activeAsset.size}` : ""}
          </span>
        </a>

        {/* Post-download reassurance panel */}
        {downloadedAsset && (
          <div className="osd-post-download" role="status" aria-live="polite">
            <div className="osd-post-header">
              <div className="osd-post-status">
                <span className="live-dot" aria-hidden="true" />
                <span className="osd-post-title">{copy.postDownloadTitle}</span>
              </div>
              <div className="osd-post-retry">
                <span className="osd-post-retry-label">
                  {copy.postDownloadRetryPrefix}
                </span>{" "}
                <a
                  href={downloadedAsset.url}
                  className="osd-post-retry-link"
                  onClick={() => setDownloadedAsset(downloadedAsset)}
                >
                  <RotateCcw size={13} strokeWidth={2} aria-hidden="true" />
                  <span>
                    {copy.postDownloadRetryAction} ({downloadedAsset.filename})
                  </span>
                </a>
              </div>
            </div>

            {/* Security verification: 100% offline, zero telemetry, SHA-256 */}
            <div className="osd-post-security">
              <div className="osd-post-sec-item">
                <div className="osd-post-sec-icon-wrap" aria-hidden="true">
                  <WifiOff size={16} strokeWidth={2} />
                </div>
                <div>
                  <span className="osd-post-sec-title">
                    {copy.postDownloadOfflineTitle}
                  </span>
                  <p className="osd-post-sec-desc">
                    {copy.postDownloadOfflineBody}
                  </p>
                </div>
              </div>

              <div className="osd-post-sec-item">
                <div className="osd-post-sec-icon-wrap" aria-hidden="true">
                  <ShieldCheck size={16} strokeWidth={2} />
                </div>
                <div>
                  <span className="osd-post-sec-title">
                    {copy.postDownloadTelemetryTitle}
                  </span>
                  <p className="osd-post-sec-desc">
                    {copy.postDownloadTelemetryBody}
                  </p>
                </div>
              </div>

              <div className="osd-post-sec-item">
                <div className="osd-post-sec-icon-wrap" aria-hidden="true">
                  <FileCheck size={16} strokeWidth={2} />
                </div>
                <div>
                  <span className="osd-post-sec-title">
                    {copy.postDownloadShaTitle}
                  </span>
                  <p className="osd-post-sec-desc">
                    {copy.postDownloadShaBody}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick action buttons: Report issue, Support project, Hashes */}
            <div className="osd-post-actions">
              <a
                className="osd-post-btn"
                href={ISSUES_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bug size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>{copy.postDownloadReportBtn}</span>
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a
                className="osd-post-btn"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>{copy.postDownloadStarBtn}</span>
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a
                className="osd-post-link"
                href={RELEASE_LATEST}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{copy.postDownloadReleaseNotesBtn}</span>
                <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        {/* The other real build(s) stay reachable as secondary anchors */}
        <div className="osd-others">
          {others.map((os) => {
            const a = PRIMARY_ASSETS[os];
            return (
              <a
                key={os}
                className="btn btn-secondary osd-other"
                href={a.url}
                onClick={() => setDownloadedAsset(a)}
              >
                <MonitorDown
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="osd-other-label">
                  {copy.downloadVerb} {osLabel(os)}
                </span>
                <span className="osd-other-meta">
                  {a.filename}{a.size ? ` · ${a.size}` : ""}
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

        {/* CLI + ASR worker zip (Windows) - not the desktop app */}
        <a
          className="btn-tertiary osd-latest"
          href={CLI_ASSET.url}
          rel="noopener"
          onClick={() =>
            setDownloadedAsset({
              os: "windows",
              filename: CLI_ASSET.filename,
              url: CLI_ASSET.url,
              size: CLI_ASSET.size,
            })
          }
        >
          {copy.cliLabel}
          <span className="osd-portable-meta">{copy.cliHint}</span>
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </a>

        {/* Platform note: Linux loopback + signed AppImage updates */}
        <p className="osd-legacy">{copy.linuxNote}</p>

        {/* Release notes (hashes + changelog) */}
        <a
          className="btn-tertiary osd-latest"
          href={RELEASE_LATEST}
          rel="noopener"
        >
          {LIVEAUDIO_TAG} · Tauri 2
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

        .osd-post-download {
          background: var(--color-surface-2);
          border: 1px solid var(--color-green);
          box-shadow: 0 0 24px rgba(16, 185, 129, 0.12);
          border-radius: var(--radius);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          animation: var(--animate-reveal);
        }
        .osd-post-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .osd-post-status {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .osd-post-title {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--color-text-strong);
        }
        .osd-post-retry {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .osd-post-retry-label {
          color: var(--color-text-muted);
        }
        .osd-post-retry-link {
          color: var(--color-neon);
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          text-decoration: underline;
        }
        .osd-post-retry-link:hover {
          color: var(--color-text-strong);
        }
        .osd-post-security {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
          padding: var(--space-4) 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        @media (min-width: 640px) {
          .osd-post-security {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .osd-post-sec-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
        }
        .osd-post-sec-icon-wrap {
          color: var(--color-green);
          flex: none;
          margin-top: 2px;
        }
        .osd-post-sec-title {
          display: block;
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-strong);
          margin-bottom: 2px;
        }
        .osd-post-sec-desc {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          line-height: 1.45;
          margin: 0;
        }
        .osd-post-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-3);
        }
        .osd-post-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          padding: 6px var(--space-3);
          min-height: 32px;
          border-radius: var(--radius-sm);
          color: var(--color-text);
          background: var(--color-surface);
          border: 1px solid var(--color-border-soft);
          text-decoration: none;
          transition: color 120ms, border-color 120ms;
        }
        .osd-post-btn:hover {
          color: var(--color-green);
          border-color: var(--color-green);
          text-decoration: none;
        }
        .osd-post-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          margin-left: auto;
          text-decoration: none;
          transition: color 120ms;
        }
        .osd-post-link:hover {
          color: var(--color-green);
          text-decoration: underline;
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
        .osd-portable-meta {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        .osd-legacy {
          margin: 0;
          align-self: flex-start;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-amber);
        }
      `}</style>
    </div>
  );
}
