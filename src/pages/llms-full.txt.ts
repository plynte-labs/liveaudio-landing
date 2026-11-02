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

> LiveAudio is a free, open-source (MIT) app that transcribes speech locally and streams captions to OBS over a local WebSocket. Its Rust core and Tauri desktop use a Python inference worker. No cloud transcription service or API key is needed.

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

- Windows 10/11 x64 — v1.5.1: microphone + WASAPI system loopback; use the official NSIS installer.
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
- Runtime: Rust core and Tauri desktop with a Python inference worker and dependencies.
- GPU: optional. CPU works. CUDA needs compatible runtime libraries as well as a compatible GPU and driver.
- RAM: 8 GB minimum / 16 GB recommended.
- Disk: installer download ~26.2 MB, plus runtime dependencies and transcription models.
- Internet: may be needed to provision dependencies and download selected models. Transcription can run offline once required components are available.

## Downloads — real v1.5.1 assets

Base URL: ${REL}/
Always-latest: https://github.com/plynte-labs/LiveAudio/releases/latest
Release notes (changelog + hashes): https://github.com/plynte-labs/LiveAudio/releases/tag/v1.5.1

- Windows installer (primary), ~26.2 MB: ${REL}/LiveAudio_1.5.1_x64-setup.exe
- Windows desktop executable only, ~16.2 MB; lacks CLI and resources: ${REL}/liveaudio-desktop.exe
- Linux x64 legacy tarball (Python v1.2.7; extract, run ./liveaudio-launcher; needs libportaudio2), 46,351,037 bytes (46.35 MB): ${LEGACY_REL}/LiveAudio-1.2.7-linux-x64.tar.gz

Windows SmartScreen: the v1.5.1 installer is not code-signed yet, so SmartScreen may warn. Choose "More info → Run anyway"; the exact files and hashes are on the v1.5.1 release page.
Before upgrading from a legacy version, back up settings and sessions and consult the release notes.
Updates: see GitHub Releases for current installation guidance.

## Install / first run

End users: download the official installer. Setup may provision the Python worker and dependencies; models may download when selected. Storage and internet needs extend beyond the installer download.

Developers: clone https://github.com/plynte-labs/LiveAudio.git and follow the repository README (Rust toolchain + Tauri 2 prerequisites).

## OBS setup

1. In OBS: Sources → + → Browser.
2. In LiveAudio select a profile, device and model; apply changes, start the system, then copy the overlay URL. In OBS leave Local File unchecked, paste the URL, and set size 1920×200.
3. Disable "Shut down source when not visible" (and "Refresh browser when scene becomes active").
4. While the system is running, the copied URL contains the active port; the server starts at 8765 and can use an alternative through 8774. Copy it again if the port changes.
5. Speak and check the OBS captions. If the port changes, copy the URL again while the system is running.

WebSocket payload fields include id, text, timing fields and is_replay. Connections are accepted from localhost only, with no auth. Latency depends on segmentation, model, hardware and load.

## Profiles, models, and blacklist

- Profiles: Fast (low latency), Balanced (recommended), Quality (higher accuracy, more VRAM), Stable Streaming (reduces GPU load while gaming). Editing a built-in profile creates a Custom one. Apply changes to activate.
- Models: tiny / base / small / turbo. Storage, memory and latency depend on the selected model and configuration.
- Default hallucination blacklist (from config.json.example): amara.org, subtítulos por, suscríbete, dale like, gracias por ver, memos, gracias, activar la campanita, ¡Hasta la próxima!, por favor.

## Pricing & licensing

Free & open-source (MIT). Local transcription requires no subscription or API key.

## FAQ

Q: Is it really 100% local?
A: Transcription runs on your machine using a Python inference worker. Setup and model downloads may need internet; transcription can run offline when required components are available.

Q: Does it work on Linux?
A: v1.5.1 focuses on Windows 10/11 x64; Linux users stay on the legacy Python v1.2.7 tarball for microphone capture. It needs libportaudio2 (sudo apt install libportaudio2). System-audio loopback is Windows-only.

Q: Is it free / open-source?
A: Yes — it's free and open-source under the MIT license. No subscription and no API key; you only pay your own electricity.

Q: Do I need a GPU?
A: No — CPU transcription is available. CUDA is optional and requires compatible runtime libraries as well as a GPU and driver.

Q: Do I need internet or an API key?
A: No API key is needed for local transcription. Setup or a newly selected model may require internet.

Q: What's the latency?
A: Latency depends on speech segmentation, model, hardware and load.

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
