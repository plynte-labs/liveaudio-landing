import { useId, useRef, useState } from "react";
import {
  Gauge,
  Cpu,
  Shield,
  Layers,
  RefreshCw,
  AudioWaveform,
  ArrowRight,
  CircleCheck,
  CircleX,
  TriangleAlert,
} from "lucide-react";
import { features, type Lang } from "../../i18n/islands/features";

/**
 * FeaturesGrid — six interactive sandboxes, one per real LiveAudio v1.2.0 control
 * (the design system, "Feature tiles / sandboxes"). Ported from the OLD
 * src/features/landing/components/FeaturesGrid.tsx, which hardcoded ~28 Spanish
 * literals. ALL copy now comes from src/i18n/islands/features.ts via `lang`, so
 * ZERO Spanish leaks onto the EN page.
 *
 * Corrections vs the old component (reconciled against the product spec):
 *   - Presets are the REAL profiles: Fast / Balanced / Quality / Stable Streaming
 *     — "Stable Streaming" reduces GPU load while gaming, no game name.
 *   - Every simulated VRAM / latency metric carries the amber sim-label.
 *   - Blacklist defaults are the config.json.example list VERBATIM.
 *   - Backlog policy controls only the OBS view; everything valid is always saved.
 *   - Loopback device flagged Windows-only in amber.
 *   - Whisper-model tip says GPU optional / CUDA driver ≥525, VRAM ≥4 GiB.
 *
 * Color law: green = signal, amber = warn/verify/timing/sim ONLY, body text only
 * off-white / muted. No hardcoded hex — tokens only. Scoped <style> mirrors the
 * HeroSignalDesk pattern.
 */

type Preset = "fast" | "balanced" | "quality" | "stable";
type Model = "tiny" | "base" | "small" | "turbo";
type Policy = "auto" | "live_only" | "send_all";
type VadResult = "empty" | "passed" | "blocked";

interface Props {
  lang?: Lang;
}

const ICONS = [Gauge, Cpu, Shield, Layers, RefreshCw, AudioWaveform];

/** Illustrative per-preset metrics (labeled Simulated in the UI). */
const PRESET_METRICS: Record<
  Preset,
  { latency: string; vram: string; cutoff: string }
> = {
  fast: { latency: "~0.4 s", vram: "~150 MB", cutoff: "0.4 s" },
  balanced: { latency: "~0.6 s", vram: "~480 MB", cutoff: "0.8 s" },
  quality: { latency: "~0.9 s", vram: "~1.5 GB", cutoff: "1.2 s" },
  stable: { latency: "~0.7 s", vram: "~300 MB", cutoff: "0.8 s" },
};

/** Illustrative per-model VRAM footprint (bar width %, label). */
const MODEL_VRAM: Record<Model, { pct: number; label: string }> = {
  tiny: { pct: 10, label: "~150 MB" },
  base: { pct: 20, label: "~300 MB" },
  small: { pct: 38, label: "~480 MB" },
  turbo: { pct: 92, label: "~1.5 GB" },
};

const MODEL_COMPUTE_PCT: Record<Model, number> = {
  tiny: 15,
  base: 30,
  small: 55,
  turbo: 85,
};

export default function FeaturesGrid({ lang = "en" }: Props) {
  const t = features[lang];
  const uid = useId();
  const [active, setActive] = useState(0);

  // Roving-tabindex refs for the WAI-ARIA Tabs keyboard model (one ref per tab).
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabCount = t.cards.length;
  const focusTab = (idx: number) => {
    setActive(idx);
    tabRefs.current[idx]?.focus();
  };
  const onTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (idx + 1) % tabCount;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (idx - 1 + tabCount) % tabCount;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabCount - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    focusTab(next);
  };

  // Sandbox 0 — Profiles
  const [preset, setPreset] = useState<Preset>("balanced");
  const [measuring, setMeasuring] = useState(false);

  // Sandbox 1 — Whisper models
  const [model, setModel] = useState<Model>("small");

  // Sandbox 2 — Blacklist
  const [terms, setTerms] = useState(t.blacklist.demoTerms);
  const [raw, setRaw] = useState(t.blacklist.demoRaw);
  const [filtered, setFiltered] = useState("");
  const [filtering, setFiltering] = useState(false);

  // Sandbox 3 — Backlog policy
  const [policy, setPolicy] = useState<Policy>("auto");
  const [frozen, setFrozen] = useState(false);
  const [buffer, setBuffer] = useState<string[]>([]);
  const [obsLine, setObsLine] = useState<string>(t.waitingForAudio);

  // Sandbox 4 — Hot-swap devices
  const [devices, setDevices] = useState<string[]>(t.devices.list);
  const [activeDevice, setActiveDevice] = useState<string>(t.devices.list[0]);
  const [newDevice, setNewDevice] = useState("");

  // Sandbox 5 — Silero VAD
  const [vad, setVad] = useState<VadResult>("empty");
  const [vadName, setVadName] = useState("");

  // --- handlers (all simulated / illustrative) ---
  const runLatency = () => {
    setMeasuring(true);
    window.setTimeout(() => setMeasuring(false), 900);
  };

  const runFilter = () => {
    setFiltering(true);
    window.setTimeout(() => {
      const words = terms
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean);
      let out = raw;
      for (const w of words) {
        const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        out = out.replace(new RegExp(escaped, "gi"), t.blacklist.filteredToken);
      }
      setFiltered(out);
      setFiltering(false);
    }, 400);
  };

  const loadDemo = () => {
    setTerms(t.blacklist.demoTerms);
    setRaw(t.blacklist.demoRaw);
    setFiltered("");
  };

  const simulateFreeze = () => {
    setFrozen(true);
    setBuffer([...t.backlog.demoLines]);
    setObsLine(t.backlog.frozen);
  };

  const catchUp = () => {
    setFrozen(false);
    if (policy === "live_only") {
      setObsLine(t.backlog.liveOnlyResult);
      setBuffer([]);
    } else if (policy === "send_all") {
      setObsLine(t.backlog.demoLines.join(" "));
      setBuffer([]);
    } else {
      // auto pacing — reveal lines one at a time
      let i = 0;
      const lines = [...t.backlog.demoLines];
      const tick = window.setInterval(() => {
        if (i < lines.length) {
          setObsLine(lines[i]);
          i += 1;
        } else {
          window.clearInterval(tick);
          setBuffer([]);
        }
      }, 650);
    }
  };

  const addDevice = () => {
    const name = newDevice.trim();
    if (!name) return;
    setDevices((prev) => [...prev, name]);
    setNewDevice("");
  };

  const sendVad = (kind: "speech" | "noise") => {
    if (kind === "speech") {
      setVadName(t.vad.speechName);
      setVad("passed");
    } else {
      setVadName(t.vad.noiseName);
      setVad("blocked");
    }
  };

  const m = PRESET_METRICS[preset];
  const vram = MODEL_VRAM[model];

  return (
    <section
      className="fg section section-glow"
      aria-labelledby={`${uid}-h2`}
    >
      <div className="container">
        <header className="fg-head">
          {/* Prominent top-of-section sim banner so the interactive sandboxes
              below are never mistaken for the live app (per the product spec). Amber
              is the warn/verify/sim semantic; tokens only. */}
          <p className="fg-sim-banner">
            <span className="pill pill-amber fg-sim-banner-pill">
              <TriangleAlert size={14} strokeWidth={2} aria-hidden="true" />
              {t.simLabel}
            </span>
            <span className="fg-sim-banner-text">{t.simBannerNote}</span>
          </p>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id={`${uid}-h2`} className="fg-title">
            {t.title}
          </h2>
          <p className="fg-subtitle">{t.subtitle}</p>
        </header>

        <div className="fg-grid">
          {/* LEFT — selector rail */}
          <div className="fg-rail" role="tablist" aria-label={t.title}>
            {t.cards.map(([title, desc], idx) => {
              const Icon = ICONS[idx];
              const isActive = active === idx;
              return (
                <button
                  key={title}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${idx}`}
                  aria-selected={isActive}
                  aria-controls={`${uid}-panel-${idx}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`fg-rail-item${isActive ? " is-active" : ""}`}
                  onClick={() => setActive(idx)}
                  onKeyDown={(e) => onTabKeyDown(e, idx)}
                >
                  <span className="fg-rail-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="fg-rail-body">
                    <span className="fg-rail-title">
                      {title}
                      {isActive && (
                        <ArrowRight
                          size={14}
                          strokeWidth={2}
                          aria-hidden="true"
                          className="fg-rail-caret"
                        />
                      )}
                    </span>
                    <span className="fg-rail-desc">{desc}</span>
                  </span>
                </button>
              );
            })}
            <p className="fg-rail-foot">
              <span className="live-dot" aria-hidden="true" />
              <span className="eyebrow">{t.activePanelLabel}</span>
            </p>
          </div>

          {/* RIGHT — sandbox console */}
          <div className="console fg-stage">
            {/* Sandbox 0 — Profiles */}
            <Panel uid={uid} idx={0} active={active}>
              <PanelHead kicker={t.profiles.kicker} title={t.profiles.title} desc={t.profiles.description} />
              <div className="fg-presets" role="group" aria-label={t.profiles.title}>
                {(["fast", "balanced", "quality", "stable"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={preset === p}
                    className={`fg-preset${preset === p ? " is-on" : ""}`}
                    onClick={() => setPreset(p)}
                  >
                    <span className="fg-preset-name">{t.profiles.presetNames[p]}</span>
                    <span className="fg-preset-sub">{t.profiles.presetSubs[p]}</span>
                  </button>
                ))}
              </div>

              <div className="fg-metrics tile">
                <p className="fg-metrics-desc">{t.profiles.presetDescs[preset]}</p>
                <div className="fg-metrics-row">
                  <Metric label={t.profiles.metricLatency} value={m.latency} timing />
                  <Metric label={t.profiles.metricVram} value={m.vram} timing />
                  <Metric label={t.profiles.metricVadCutoff} value={m.cutoff} timing />
                </div>
                <SimLabel text={t.simLabel} />
              </div>

              <div className="fg-foot">
                <span className="fg-status">
                  <span className="eyebrow">{t.profiles.statusLabel}</span>
                  <span className={`fg-status-val${measuring ? " is-busy" : ""}`}>
                    {measuring ? t.profiles.statusRunning : t.profiles.statusReady}
                  </span>
                </span>
                <button
                  type="button"
                  className="btn btn-secondary fg-btn"
                  onClick={runLatency}
                  disabled={measuring}
                >
                  {t.profiles.run}
                </button>
              </div>
              <p className="fg-note">{t.profiles.fpsNote}</p>
            </Panel>

            {/* Sandbox 1 — Whisper models */}
            <Panel uid={uid} idx={1} active={active}>
              <PanelHead kicker={t.models.kicker} title={t.models.title} desc={t.models.description} />
              <div className="fg-seg" role="group" aria-label={t.models.title}>
                {(["tiny", "base", "small", "turbo"] as const).map((md) => (
                  <button
                    key={md}
                    type="button"
                    aria-pressed={model === md}
                    className={`fg-seg-item${model === md ? " is-on" : ""}`}
                    onClick={() => setModel(md)}
                  >
                    {md}
                  </button>
                ))}
              </div>

              <div className="fg-bars">
                <Bar
                  label={t.models.vramLabel}
                  value={vram.label}
                  pct={vram.pct}
                  timing
                />
                <Bar
                  label={t.models.computeLabel}
                  value={t.models.computeValues[model]}
                  pct={MODEL_COMPUTE_PCT[model]}
                />
                <SimLabel text={t.simLabel} />
              </div>

              <div className="fg-tip tile">
                <span className="fg-tip-label">{t.models.tipLabel}</span>
                <p className="fg-tip-body">
                  {model === "turbo" ? t.models.tipTurbo : t.models.tipSmall}
                </p>
              </div>
            </Panel>

            {/* Sandbox 2 — Blacklist */}
            <Panel uid={uid} idx={2} active={active}>
              <PanelHead kicker={t.blacklist.kicker} title={t.blacklist.title} desc={t.blacklist.description} />
              <div className="fg-fields">
                <label className="fg-field">
                  <span className="fg-field-label">{t.blacklist.termsLabel}</span>
                  <input
                    type="text"
                    className="fg-input"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                  />
                </label>
                <label className="fg-field">
                  <span className="fg-field-label">{t.blacklist.rawLabel}</span>
                  <input
                    type="text"
                    className="fg-input"
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                  />
                </label>
              </div>

              <div className="fg-output payload-rail" aria-live="polite">
                {filtering ? (
                  <span className="fg-output-loading">{t.blacklist.loading}</span>
                ) : filtered ? (
                  <>
                    <span className="fg-output-label">{t.blacklist.outputLabel}</span>
                    <p className="fg-output-text">{filtered}</p>
                  </>
                ) : (
                  <span className="fg-output-empty">{t.blacklist.empty}</span>
                )}
              </div>

              <div className="fg-foot fg-foot-end">
                <button type="button" className="btn btn-secondary fg-btn" onClick={loadDemo}>
                  {t.blacklist.loadDemo}
                </button>
                <button type="button" className="btn btn-secondary fg-btn" onClick={runFilter}>
                  {t.blacklist.filter}
                </button>
              </div>
              <p className="fg-note">{t.illustrative}</p>
            </Panel>

            {/* Sandbox 3 — Backlog policy */}
            <Panel uid={uid} idx={3} active={active}>
              <PanelHead kicker={t.backlog.kicker} title={t.backlog.title} desc={t.backlog.description} />
              <div className="fg-seg" role="group" aria-label={t.backlog.title}>
                {(["auto", "live_only", "send_all"] as const).map((pol) => (
                  <button
                    key={pol}
                    type="button"
                    aria-pressed={policy === pol}
                    className={`fg-seg-item${policy === pol ? " is-on" : ""}`}
                    onClick={() => setPolicy(pol)}
                  >
                    {t.backlog.policyNames[pol]}
                  </button>
                ))}
              </div>

              <div className="fg-backlog">
                <div className="fg-backlog-col tile">
                  <span className="fg-col-label">{t.backlog.bufferLabel}</span>
                  {buffer.length > 0 ? (
                    <ul className="fg-buffer" role="list">
                      {buffer.map((line, i) => (
                        <li key={i} className="fg-buffer-item">
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="fg-col-empty">{t.backlog.bufferEmpty}</span>
                  )}
                </div>
                <div className="fg-backlog-col tile">
                  <span className="fg-col-label">{t.backlog.obsLabel}</span>
                  <p className={`fg-obs${frozen ? " is-frozen" : ""}`}>{obsLine}</p>
                </div>
              </div>

              <p className="fg-note fg-note-amber">{t.backlog.savedNote}</p>

              <div className="fg-foot fg-foot-end">
                <button
                  type="button"
                  className="btn btn-secondary fg-btn"
                  onClick={simulateFreeze}
                  disabled={frozen}
                >
                  {t.backlog.freeze}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary fg-btn"
                  onClick={catchUp}
                  disabled={buffer.length === 0}
                >
                  {t.backlog.catchUp}
                </button>
              </div>
            </Panel>

            {/* Sandbox 4 — Hot-swap devices */}
            <Panel uid={uid} idx={4} active={active}>
              <PanelHead kicker={t.devices.kicker} title={t.devices.title} desc={t.devices.description} />
              <span className="fg-col-label">{t.devices.listLabel}</span>
              <ul className="fg-devices" role="list">
                {devices.map((device, i) => {
                  const isLoopback = i === t.devices.loopbackIndex;
                  const isOn = activeDevice === device;
                  return (
                    <li key={device}>
                      <button
                        type="button"
                        aria-pressed={isOn}
                        className={`fg-device${isOn ? " is-on" : ""}`}
                        onClick={() => setActiveDevice(device)}
                      >
                        <span className="fg-device-name">{device}</span>
                        {isLoopback && (
                          <span className="pill pill-amber fg-device-flag">
                            <TriangleAlert size={12} strokeWidth={2} aria-hidden="true" />
                            {t.devices.loopbackFlag}
                          </span>
                        )}
                        {isOn && <span className="live-dot fg-device-dot" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="fg-add">
                <label className="fg-add-field">
                  <span className="fg-sr">{t.devices.placeholder}</span>
                  <input
                    type="text"
                    className="fg-input"
                    placeholder={t.devices.placeholder}
                    value={newDevice}
                    onChange={(e) => setNewDevice(e.target.value)}
                  />
                </label>
                <button type="button" className="btn btn-secondary fg-btn" onClick={addDevice}>
                  {t.devices.add}
                </button>
              </div>

              <div className="fg-active tile">
                <span className="eyebrow">{t.devices.activeLabel}</span>
                <span className="fg-active-name">{activeDevice}</span>
                <span className="live-dot" aria-hidden="true" />
              </div>
              <p className="fg-note">{t.illustrative}</p>
            </Panel>

            {/* Sandbox 5 — Silero VAD */}
            <Panel uid={uid} idx={5} active={active}>
              <PanelHead kicker={t.vad.kicker} title={t.vad.title} desc={t.vad.description} />
              <div className="fg-vad-choices">
                <button type="button" className="fg-vad-choice" onClick={() => sendVad("speech")}>
                  <span className="fg-vad-choice-name">{t.vad.speechLabel}</span>
                  <span className="fg-vad-choice-sub">{t.vad.speechSub}</span>
                </button>
                <button type="button" className="fg-vad-choice" onClick={() => sendVad("noise")}>
                  <span className="fg-vad-choice-name">{t.vad.noiseLabel}</span>
                  <span className="fg-vad-choice-sub">{t.vad.noiseSub}</span>
                </button>
              </div>

              <div className="fg-vad-result tile" aria-live="polite">
                {vad === "empty" ? (
                  <span className="fg-col-empty">{t.vad.empty}</span>
                ) : (
                  <>
                    <span className="fg-vad-input">
                      <span className="eyebrow">{t.vad.inputSignal}</span>
                      <span className="fg-vad-input-name">{vadName}</span>
                    </span>
                    {vad === "passed" ? (
                      <span className="fg-verdict is-pass">
                        <CircleCheck size={16} strokeWidth={2} aria-hidden="true" />
                        {t.vad.passed}
                      </span>
                    ) : (
                      <span className="fg-verdict is-block">
                        <CircleX size={16} strokeWidth={2} aria-hidden="true" />
                        {t.vad.blocked}
                      </span>
                    )}
                    <p className="fg-vad-note">
                      {vad === "passed" ? t.vad.passedNote : t.vad.blockedNote}
                    </p>
                  </>
                )}
              </div>
              <p className="fg-note">{t.vad.footer}</p>
            </Panel>
          </div>
        </div>
      </div>

      <style>{`
        .fg-head {
          max-width: var(--measure);
          margin-bottom: var(--space-9);
        }
        .fg-sim-banner {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-2) var(--space-3);
          margin: 0 0 var(--space-4);
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--color-amber);
          border-radius: var(--radius-sm);
          background: var(--color-amber-faint);
        }
        .fg-sim-banner-pill {
          flex-shrink: 0;
        }
        .fg-sim-banner-text {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .fg-title {
          font-size: var(--text-2xl);
          margin: var(--space-3) 0 var(--space-4);
        }
        .fg-subtitle {
          color: var(--color-text);
          font-size: var(--text-base);
          line-height: 1.7;
        }

        .fg-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-7);
          align-items: start;
        }
        @media (min-width: 1024px) {
          .fg-grid {
            grid-template-columns: 5fr 7fr;
            gap: var(--space-8);
          }
        }

        /* ---- Selector rail ---- */
        .fg-rail {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .fg-rail-item {
          display: flex;
          gap: var(--space-4);
          align-items: flex-start;
          text-align: left;
          padding: var(--space-4);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          transition: border-color 150ms var(--ease-mech), background 150ms;
          cursor: pointer;
        }
        .fg-rail-item:hover { border-color: var(--color-green); }
        .fg-rail-item.is-active {
          border-color: var(--color-green);
          background: var(--color-green-faint);
        }
        .fg-rail-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
        }
        .fg-rail-item.is-active .fg-rail-icon {
          color: var(--color-green);
          border-color: var(--color-green);
        }
        .fg-rail-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .fg-rail-title {
          font-weight: 700;
          color: var(--color-text-strong);
          font-size: var(--text-sm);
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
        }
        .fg-rail-caret { color: var(--color-green); }
        .fg-rail-desc {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .fg-rail-foot {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          margin: var(--space-2) 0 0;
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          background: var(--color-green-faint);
        }

        /* ---- Stage ---- */
        .fg-stage {
          position: relative;
          min-height: 460px;
          padding: var(--space-7);
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .fg-stage { padding: var(--space-8); }
        }
        .fg-panel { display: flex; flex-direction: column; gap: var(--space-6); }
        .fg-panel[hidden] { display: none; }

        .fg-panel-head { display: flex; flex-direction: column; gap: var(--space-2); }
        .fg-panel-kicker { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); }
        .fg-panel-title { font-size: var(--text-lg); color: var(--color-text-strong); font-weight: 700; margin: 0; }
        .fg-panel-desc { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; margin: 0; }

        /* ---- Profiles ---- */
        .fg-presets {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }
        .fg-preset {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
          padding: var(--space-4);
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: border-color 150ms, background 150ms;
        }
        .fg-preset:hover { border-color: var(--color-green); }
        .fg-preset.is-on { border-color: var(--color-green); background: var(--color-green-faint); }
        .fg-preset-name {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--color-text-strong);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .fg-preset-sub { font-size: var(--text-xs); color: var(--color-text-muted); }

        .fg-metrics { display: flex; flex-direction: column; gap: var(--space-4); }
        .fg-metrics-desc { font-size: var(--text-sm); color: var(--color-text); line-height: 1.6; margin: 0; }
        .fg-metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
        .fg-metric { display: flex; flex-direction: column; gap: 2px; }
        .fg-metric-label {
          font-family: var(--font-mono);
          font-size: var(--text-eyebrow);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
        }
        .fg-metric-val { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-size: var(--text-sm); color: var(--color-text); }
        .fg-metric-val.is-timing { color: var(--color-amber); }

        /* ---- Foot row + status ---- */
        .fg-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
          margin-top: auto;
        }
        .fg-foot-end { justify-content: flex-end; }
        .fg-status { display: inline-flex; flex-direction: column; gap: 2px; }
        .fg-status-val { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-green); }
        .fg-status-val.is-busy { color: var(--color-amber); }
        .fg-btn { font-family: var(--font-mono); font-size: var(--text-xs); }
        .fg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .fg-note { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); margin: 0; }
        .fg-note-amber { color: var(--color-amber); }

        /* ---- Segmented control (models + policy) ---- */
        .fg-seg {
          display: flex;
          gap: 4px;
          padding: 4px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface-2);
        }
        .fg-seg-item {
          flex: 1;
          padding: var(--space-2) var(--space-3);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: color 150ms, background 150ms;
        }
        .fg-seg-item:hover { color: var(--color-text); }
        .fg-seg-item.is-on { background: var(--color-green); color: var(--color-bg); font-weight: 700; }

        /* ---- Bars ---- */
        .fg-bars { display: flex; flex-direction: column; gap: var(--space-5); }
        .fg-bar-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }
        .fg-bar-label { font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted); }
        .fg-bar-val { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-size: var(--text-xs); color: var(--color-text); }
        .fg-bar-val.is-timing { color: var(--color-amber); }
        .fg-bar-track {
          height: 8px;
          border-radius: 9999px;
          border: 1px solid var(--color-border);
          background: var(--color-surface-2);
          overflow: hidden;
        }
        .fg-bar-fill {
          height: 100%;
          background: var(--color-green);
          border-radius: 9999px;
          transition: width 450ms var(--ease-mech);
        }

        .fg-tip { display: flex; flex-direction: column; gap: var(--space-2); }
        .fg-tip-label { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-green); text-transform: uppercase; letter-spacing: 0.08em; }
        .fg-tip-body { font-size: var(--text-sm); color: var(--color-text); line-height: 1.6; margin: 0; }

        /* ---- Blacklist fields ---- */
        .fg-fields { display: flex; flex-direction: column; gap: var(--space-4); }
        .fg-field { display: flex; flex-direction: column; gap: var(--space-2); }
        .fg-field-label {
          font-family: var(--font-mono);
          font-size: var(--text-eyebrow);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
        }
        .fg-input {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text);
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .fg-input::placeholder { color: var(--color-text-muted); }
        .fg-input:focus-visible { outline: 2px solid var(--color-green); outline-offset: 1px; border-color: var(--color-green); }

        .fg-output {
          min-height: 84px;
          padding: var(--space-4);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--space-2);
        }
        .fg-output-loading { color: var(--color-green); font-size: var(--text-xs); }
        .fg-output-empty { color: var(--color-text-muted); font-size: var(--text-xs); font-style: italic; }
        .fg-output-label {
          font-family: var(--font-mono);
          font-size: var(--text-eyebrow);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
        }
        .fg-output-text { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text); line-height: 1.6; margin: 0; }

        /* ---- Backlog ---- */
        .fg-backlog { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        .fg-backlog-col { display: flex; flex-direction: column; gap: var(--space-3); min-height: 120px; }
        .fg-col-label {
          font-family: var(--font-mono);
          font-size: var(--text-eyebrow);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
        }
        .fg-col-empty { font-size: var(--text-xs); color: var(--color-text-muted); font-style: italic; }
        .fg-buffer { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2); }
        .fg-buffer-item {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-amber);
          background: var(--color-amber-faint);
          border: 1px solid var(--color-amber);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
        }
        .fg-obs { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-green); line-height: 1.6; margin: 0; }
        .fg-obs.is-frozen { color: var(--color-amber); }

        /* ---- Devices ---- */
        .fg-devices { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2); }
        .fg-device {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: border-color 150ms, color 150ms;
        }
        .fg-device:hover { border-color: var(--color-green); color: var(--color-text); }
        .fg-device.is-on { border-color: var(--color-green); background: var(--color-green-faint); color: var(--color-text-strong); }
        .fg-device-name { flex: 1; text-align: left; }
        .fg-device-flag { flex-shrink: 0; }
        .fg-device-dot { flex-shrink: 0; }

        .fg-add { display: flex; gap: var(--space-3); align-items: stretch; }
        .fg-add-field { flex: 1; }
        .fg-sr {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0, 0, 0, 0);
          white-space: nowrap; border: 0;
        }
        .fg-active { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
        .fg-active-name { flex: 1; font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-text-strong); }

        /* ---- VAD ---- */
        .fg-vad-choices { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
        .fg-vad-choice {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          text-align: center;
          padding: var(--space-5) var(--space-4);
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          cursor: pointer;
          transition: border-color 150ms;
        }
        .fg-vad-choice:hover { border-color: var(--color-green); }
        .fg-vad-choice-name { font-weight: 700; font-size: var(--text-sm); color: var(--color-text-strong); }
        .fg-vad-choice-sub { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); }

        .fg-vad-result {
          min-height: 120px;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .fg-vad-input { display: flex; flex-direction: column; gap: 4px; }
        .fg-vad-input-name { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text); }
        .fg-verdict {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid;
        }
        .fg-verdict.is-pass { color: var(--color-green); border-color: var(--color-green); background: var(--color-green-faint); }
        .fg-verdict.is-block { color: var(--color-amber); border-color: var(--color-amber); background: var(--color-amber-faint); }
        .fg-vad-note { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; margin: 0; max-width: 44ch; }

        .fg-sim {
          display: inline-flex;
          align-self: flex-start;
        }

        @media (max-width: 480px) {
          .fg-presets, .fg-backlog, .fg-vad-choices { grid-template-columns: 1fr; }
          .fg-metrics-row { grid-template-columns: 1fr; gap: var(--space-2); }
        }
      `}</style>
    </section>
  );
}

/* ---------- small presentational helpers ---------- */

function Panel({
  uid,
  idx,
  active,
  children,
}: {
  uid: string;
  idx: number;
  active: number;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`${uid}-panel-${idx}`}
      aria-labelledby={`${uid}-tab-${idx}`}
      className="fg-panel"
      hidden={active !== idx}
    >
      {children}
    </div>
  );
}

function PanelHead({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div className="fg-panel-head">
      <span className="fg-panel-kicker">{kicker}</span>
      <h3 className="fg-panel-title">{title}</h3>
      <p className="fg-panel-desc">{desc}</p>
    </div>
  );
}

function Metric({ label, value, timing }: { label: string; value: string; timing?: boolean }) {
  return (
    <div className="fg-metric">
      <span className="fg-metric-label">{label}</span>
      <span className={`fg-metric-val${timing ? " is-timing" : ""}`}>{value}</span>
    </div>
  );
}

function Bar({
  label,
  value,
  pct,
  timing,
}: {
  label: string;
  value: string;
  pct: number;
  timing?: boolean;
}) {
  return (
    <div>
      <div className="fg-bar-head">
        <span className="fg-bar-label">{label}</span>
        <span className={`fg-bar-val${timing ? " is-timing" : ""}`}>{value}</span>
      </div>
      <div className="fg-bar-track">
        <div className="fg-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SimLabel({ text }: { text: string }) {
  return (
    <span className="pill pill-amber fg-sim">
      <TriangleAlert size={12} strokeWidth={2} aria-hidden="true" />
      {text}
    </span>
  );
}
