import type { APIRoute } from "astro";

/**
 * llms-full.txt — expanded, concatenated reference of LiveAudio v1.2.0 facts.
 *
 * A single plain-text document an LLM can ingest to answer questions about the
 * product without crawling every page. Every claim is traceable to
 * the product spec. Static endpoint (export GET).
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://liveaudio.opencohost.com")).href.replace(/\/$/, "");
  const REL = "https://github.com/plynte-labs/LiveAudio/releases/download/v1.2.0";

  const body = `# LiveAudio — Full Reference (v1.2.0)

> LiveAudio is a free, open-source (MIT) desktop app that generates real-time Whisper speech captions 100% locally and streams them to OBS over a local WebSocket. It runs on Windows and Linux. No cloud, no API key, no per-minute cost.

Canonical site: ${base}/
Source: https://github.com/plynte-labs/LiveAudio (MIT)
Release: v1.2.0 (published 2026-06-20)

---

## What it is

A real-time, local automatic-speech-recognition (ASR) engine for streamers and creators. It is a Python desktop GUI application (CustomTkinter) that:
- Transcribes speech with Whisper (tiny, base, small, turbo models).
- Uses Silero VAD (voice activity detection) to trim silence, with a configurable onset pre-roll and VAD threshold (new in v1.2.0).
- Captures from a physical microphone or system audio. System-audio loopback uses WASAPI and is Windows-only; on Linux it captures the microphone.
- Broadcasts subtitle JSON over a local WebSocket at ws://127.0.0.1:8765 (configurable via ws_port) to OBS or any HTML/WebSocket client on localhost.

## Platforms (NOT Windows-only)

- Windows 10/11 x64 — Full support: microphone + WASAPI system loopback; graphical installer (.exe).
- Linux x86_64 — Supported: microphone capture; requires libportaudio2 (sudo apt install libportaudio2); ships as a tarball launcher.
- macOS — NOT supported.

## Features

- Real-time transcription with Whisper (tiny / base / small / turbo).
- Silero VAD with configurable onset pre-roll + VAD threshold (new in v1.2.0).
- Flexible capture: mic or system loopback (loopback is Windows-only).
- Integrated WebSocket server feeding an OBS Browser Source or any HTML/WS client.
- OBS overlay: improved subtitle legibility, capped reveal-animation timing, and an adaptive vertical "ribbon" subtitle buffer (new in v1.2.0).
- OBS backlog policy: Auto / Live only / Send all (controls only what shows live in OBS; everything valid is always saved).
- Hallucination filtering via an editable blacklist.
- Session management: transcript.jsonl + subtitles.vtt (+ session.json).
- Hot-swap of device/model without restarting.
- Profiles: Fast, Balanced, Quality, Stable Streaming (FPS-aware presets).
- Local-first diagnostics: no telemetry; export sanitizes secrets/paths and excludes raw audio + full transcripts.
- Robust runtime: isolated processes (multiprocessing), audio ring buffer, automatic reconnection.

## System requirements

- OS: Windows 10/11 or Linux x86_64.
- Python: NOT required for end users — the installer provisions its own Python 3.11.
- GPU: optional. CPU works. NVIDIA CUDA is optional but recommended; auto-detected (driver ≥ 525, VRAM ≥ 4 GiB).
- RAM: 8 GB minimum / 16 GB recommended.
- Disk: ~400 MB (CPU) / ~2.5 GB (CUDA) for app + dependencies, plus model storage.
- Internet: first run only (downloads Python + dependencies + models); fully offline afterward.

## Downloads — real v1.2.0 assets

Base URL: ${REL}/
Always-latest: https://github.com/plynte-labs/LiveAudio/releases/latest

- Windows installer (primary), ~35.8 MB: ${REL}/LiveAudio-Setup-1.2.0.exe
- Linux x64 tarball (extract, run ./liveaudio-launcher; needs libportaudio2), ~46.3 MB: ${REL}/LiveAudio-1.2.0-linux-x64.tar.gz
- pip wheel (advanced), ~0.29 MB: ${REL}/liveaudio-1.2.0-py3-none-any.whl
- Source, ~0.35 MB: ${REL}/liveaudio-src-1.2.0.zip
- CPU requirements (pip escape hatch): ${REL}/requirements-cpu.txt
- CUDA 12.1 requirements (pip escape hatch): ${REL}/requirements-cu121.txt
- Checksums: ${REL}/SHA256SUMS.txt

Windows SmartScreen: the installer is not code-signed, so SmartScreen may warn. Choose "More info → Run anyway", and verify the download against SHA256SUMS.txt.
Portable mode: create an empty portable.marker file next to the launcher (stores everything in data/).
Updates: in-app one-click, or run the launcher with --update.

## Install / first run

End users: download → run. The first run downloads Python + dependencies (~400 MB CPU / ~2.5 GB CUDA) and auto-detects the GPU; later runs start instantly. Models download on first transcription (Silero VAD ~2 MB; Whisper tiny ~150 MB / base ~300 MB / small ~480 MB / turbo ~1.5 GB). Offline after that.

Developers (uv):
  git clone https://github.com/plynte-labs/LiveAudio.git
  cd LiveAudio
  uv sync --extra cpu      # OR: uv sync --extra cu121 (exactly one torch extra)
  uv run liveaudio
  uv run pytest

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
A: Yes — all transcription runs on your machine with no telemetry. Internet is used only on the first run to download Python, dependencies, and models; it works fully offline afterward.

Q: Does it work on Linux?
A: Yes — Linux x86_64 is supported for microphone capture. It needs libportaudio2 (sudo apt install libportaudio2) and ships as a tarball launcher. System-audio loopback is Windows-only.

Q: Is it free / open-source?
A: Yes — it's free and open-source under the MIT license. No subscription and no API key; you only pay your own electricity.

Q: Do I need a GPU?
A: No — the CPU works. An NVIDIA CUDA GPU is optional but recommended and is auto-detected (driver ≥ 525, VRAM ≥ 4 GiB).

Q: Do I need internet or an API key?
A: No API key, ever. Internet is only required on the first run to download Python, dependencies, and models; after that it runs offline.

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
