import type { APIRoute } from "astro";

/**
 * llms-full.txt — expanded, concatenated reference of LiveAudio v1.5.1 facts.
 *
 * A single plain-text document an LLM can ingest to answer questions about the
 * product without crawling every page. Every claim is traceable to
 * the product spec. Static endpoint (export GET).
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://liveaudio.opencohost.com")).href.replace(/\/$/, "");
  const REL = "https://github.com/plynte-labs/LiveAudio/releases/download/v1.5.1";
  const LEGACY_REL = "https://github.com/plynte-labs/LiveAudio/releases/download/v1.2.7";

  const body = `# LiveAudio — Full Reference (v1.5.1)

> LiveAudio is a free, open-source (MIT) desktop app that generates real-time Whisper speech captions 100% locally and streams them to OBS over a local WebSocket. v1.5.1 is a native Rust + Tauri 2 build for Windows x64. No cloud, no API key, no per-minute cost.

Canonical site: ${base}/
Source: https://github.com/plynte-labs/LiveAudio (MIT)
Release: v1.5.1 (Rust + Tauri 2)

---

## What it is

A real-time, local automatic-speech-recognition (ASR) engine for streamers and creators. It is a native Rust desktop app (Tauri 2 shell) that:
- Transcribes speech with Whisper (tiny, base, small, turbo models).
- Uses Silero VAD (voice activity detection) to trim silence, with configurable pause-to-close, max segment duration, VAD pre-roll and threshold.
- Optionally suppresses noise with local RNNoise and emits acoustic speech-metadata events.
- Captures from a physical microphone or system audio. System-audio loopback uses WASAPI and is Windows-only.
- Broadcasts subtitle JSON over a local WebSocket at ws://127.0.0.1:8765 (configurable via ws_port) to OBS or any HTML/WebSocket client on localhost.
- Shows a live stream-chat subtitle feed with timestamps, plus a collapsible event log.

## Platforms

- Windows 10/11 x64 — Full support (v1.5.1 native Rust build): microphone + WASAPI system loopback; NSIS installer or portable standalone exe.
- Linux x86_64 — Legacy Python v1.2.7 tarball only (microphone capture; requires libportaudio2) until a native Linux build ships.
- macOS — NOT supported.

## Features (v1.5.1)

- Real-time transcription with Whisper (tiny / base / small / turbo).
- Silero VAD with configurable pause, pre-roll and threshold.
- Optional local RNNoise suppression + acoustic speech-metadata events.
- Live stream-chat subtitle feed (timestamps, stick-to-bottom, circular buffer).
- On-the-fly blacklist and vocabulary-prompt enrichment with retroactive strike-through.
- Flexible capture: mic or system loopback (loopback is Windows-only).
- Integrated WebSocket server feeding an OBS Browser Source or any HTML/WS client.
- OBS overlay: improved subtitle legibility, capped reveal-animation timing, and an adaptive vertical "ribbon" subtitle buffer.
- OBS backlog policy: Auto / Live only / Send all (controls only what shows live in OBS; everything valid is always saved).
- Hallucination filtering via an editable blacklist.
- Session management: transcript.jsonl + subtitles.vtt (+ session.json).
- Hot-swap of device/model without restarting (CUDA selection dims the CPU-threads control).
- Profiles: Fast, Balanced, Quality, Stable Streaming (FPS-aware presets).
- Local-first diagnostics: no telemetry; event log records service lifecycle and config changes.
- Bilingual UI and installer (English / Spanish).

## System requirements

- OS: Windows 10/11 x64 (v1.5.1). Linux: legacy v1.2.7 tarball.
- Runtime: NONE for end users — v1.5.1 is a native binary, no Python runtime.
- GPU: optional. CPU works. NVIDIA CUDA is optional but recommended; auto-detected (driver ≥ 525, VRAM ≥ 4 GiB).
- RAM: 8 GB minimum / 16 GB recommended.
- Disk: installer ~26.2 MB (portable exe ~16.2 MB), plus transcription-model storage.
- Internet: first run only (downloads transcription models); fully offline afterward.

## Downloads — real v1.5.1 assets

Base URL: ${REL}/
Always-latest: https://github.com/plynte-labs/LiveAudio/releases/latest
Release notes (changelog + hashes): https://github.com/plynte-labs/LiveAudio/releases/tag/v1.5.1

- Windows installer (primary), ~26.2 MB: ${REL}/LiveAudio_1.5.1_x64-setup.exe
- Windows portable standalone (no install), ~16.2 MB: ${REL}/liveaudio-desktop.exe
- Linux x64 legacy tarball (Python v1.2.7; extract, run ./liveaudio-launcher; needs libportaudio2), 46,351,037 bytes (46.35 MB): ${LEGACY_REL}/LiveAudio-1.2.7-linux-x64.tar.gz

Windows SmartScreen: the v1.5.1 installer is not code-signed yet, so SmartScreen may warn. Choose "More info → Run anyway"; the exact files and hashes are on the v1.5.1 release page.
Upgrading from Python (v1.0.0–v1.2.7): the installer detects the legacy build via the Windows registry (32/64-bit), runs its uninstaller silently, stops leftover processes and removes obsolete Python folders. Settings and sessions in %APPDATA%\\LiveAudio are preserved.
Updates: one-click in-app update; new releases on GitHub Releases.

## Install / first run

End users: download → run. The first run downloads transcription models and auto-detects the GPU; later runs start instantly and offline. Your settings and sessions in %APPDATA%\\LiveAudio survive updates and the Python-to-Rust migration.

Developers: clone https://github.com/plynte-labs/LiveAudio.git and follow the repository README (Rust toolchain + Tauri 2 prerequisites).

## OBS setup

1. In OBS: Sources → + → Browser.
2. Local file → select subtitulos_obs.html (in liveaudio/assets/). Size 1920×200.
3. Disable "Shut down source when not visible" (and "Refresh browser when scene becomes active").
4. Custom port: set ws_port in config.json; the OBS HTML reads ?port=XXXX from its URL (default 8765, ws://127.0.0.1:8765).
5. In LiveAudio pick a profile + audio device + CPU/CUDA + model → Apply changes → START SYSTEM. Speak, and captions appear.

WebSocket payload fields: id, text, style, created_at, processed_at, queue_delay, total_delay, latency, is_replay, catchup_interval_sec. Connections are accepted from localhost only, with no auth. Latency is sub-second to about 1 second on a typical setup (example payload: total_delay ~1.3, latency ~1.1) — not "milliseconds".

## Profiles, models, and blacklist

- Profiles: Fast (low latency), Balanced (recommended), Quality (higher accuracy, more VRAM), Stable Streaming (reduces GPU load while gaming). Editing a built-in profile creates a Custom one. Apply changes to activate.
- Models: tiny / base / small / turbo. Per-model VRAM/latency figures are not published by the docs; the documented footprint is ~400 MB CPU / ~2.5 GB CUDA.
- Default hallucination blacklist (from config.json.example): amara.org, subtítulos por, suscríbete, dale like, gracias por ver, memos, gracias, activar la campanita, ¡Hasta la próxima!, por favor.

## Pricing & licensing

Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included. Compared with cloud ASR APIs (e.g. an OpenAI Whisper API at roughly $0.36/hr), LiveAudio runs locally for the cost of electricity.

## FAQ

Q: Is it really 100% local?
A: Yes — all transcription runs on your machine with no telemetry. Internet is used only on the first run to download transcription models; it works fully offline afterward. v1.5.1 is a native Rust binary with no Python runtime.

Q: Does it work on Linux?
A: v1.5.1 focuses on Windows 10/11 x64; Linux users stay on the legacy Python v1.2.7 tarball for microphone capture. It needs libportaudio2 (sudo apt install libportaudio2). System-audio loopback is Windows-only.

Q: Is it free / open-source?
A: Yes — it's free and open-source under the MIT license. No subscription and no API key; you only pay your own electricity.

Q: Do I need a GPU?
A: No — the CPU works. An NVIDIA CUDA GPU is optional but recommended and is auto-detected (driver ≥ 525, VRAM ≥ 4 GiB).

Q: Do I need internet or an API key?
A: No API key, ever. Internet is only required on the first run to download transcription models; after that it runs offline.

Q: What's the latency?
A: Low and tunable — well under a second on a typical setup. Profiles (Fast / Balanced / Quality / Stable Streaming) let you trade latency for accuracy.

Q: How is it different from cloud APIs / OBS caption plugins?
A: LiveAudio runs Whisper locally, so there's no per-minute cost, no API key, and no audio leaves your machine. It broadcasts subtitle JSON over a local WebSocket that OBS — or any localhost client — can consume.

## Compatibility

LiveAudio broadcasts clean subtitle JSON over a local WebSocket (ws://127.0.0.1:8765). OBS is the built-in target via the included subtitulos_obs.html overlay, but any HTML or WebSocket client on localhost can connect and receive the same broadcast. Connections are accepted only from localhost; no auth is needed.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
