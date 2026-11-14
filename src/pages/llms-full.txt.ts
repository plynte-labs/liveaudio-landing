import type { APIRoute } from "astro";

/**
 * llms-full.txt — expanded, concatenated reference of LiveAudio v1.6.0 facts.
 *
 * A single plain-text document an LLM can ingest to answer questions about the
 * product without crawling every page. Every claim is traceable to
 * the product spec. Static endpoint (export GET).
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://liveaudio.opencohost.com")).href.replace(/\/$/, "");
  const REL = "https://github.com/plynte-labs/LiveAudio/releases/download/v1.6.0";
  const TAG_URL = "https://github.com/plynte-labs/LiveAudio/releases/tag/v1.6.0";

  const body = `# LiveAudio — Full Reference (v1.6.0)

> LiveAudio is a free, open-source (MIT) app that transcribes speech locally and streams captions to OBS over a local WebSocket. 100% native Rust architecture with Tauri 2 desktop and ONNX Runtime DirectML/CPU Whisper inference worker (zero Python). Windows x64 release: v1.6.0. No cloud transcription service or API key is needed.

Canonical site: ${base}/
Source: https://github.com/plynte-labs/LiveAudio (MIT)
Release: v1.6.0 (100% Native Rust + ONNX Runtime + Tauri 2)

---

## What it is

A real-time, local automatic-speech-recognition (ASR) engine for streamers and creators. It is a 100% native Rust desktop app (Tauri 2 shell) that:
- Transcribes speech with Whisper (tiny, base, small, turbo models) on a native Rust worker (liveaudio-asr-worker.exe) via ONNX Runtime with DirectML (DirectX 12) acceleration for NVIDIA, AMD, and Intel GPUs, plus automatic CPU fallback.
- Offers an optional NVIDIA CUDA engine (CTranslate2), downloaded only after an explicit user action.
- Features total elimination of Python: no Python runtime, no virtual environment, no uv, no Python dependencies to provision, and instant application startup.
- Uses Silero VAD (voice activity detection) to trim silence, with configurable pause-to-close, max segment duration, VAD pre-roll and threshold.
- Optionally suppresses noise with local RNNoise and emits acoustic speech-metadata events.
- Captures from a physical microphone or system audio. System-audio loopback uses WASAPI and is Windows-only.
- Broadcasts subtitle JSON over a local WebSocket at ws://127.0.0.1:8765 (configurable via ws_port) to OBS or any HTML/WebSocket client on localhost.
- Includes a WebSocket Loopback Origin Allowlist in Settings > Advanced against Cross-Site WebSocket Hijacking (CSWSH), with real-time rejected connection monitoring and Allow/Revoke controls for local ports.
- Provides a Model Context Protocol (MCP) granular stdio server (liveaudio-cli mcp) for AI assistants (Claude Desktop/Code) with dual explicit consent switches: Style switch (themes, CSS tokens, presets) and System switch (device, model, VAD). Port allowlist and local paths are strictly excluded from AI mutation.
- Features a signed In-App Updater (Windows only): checks GitHub Releases every 24 h (can be disabled), verifies Minisign signatures before executing any installer, and blocks downloads and installs while transcribing or while OBS clients are connected. Linux updates are manual.
- Maintains 100% private local usage metrics (sessions, active minutes, subtitles broadcast) with 0 telemetry and 0 external server transmissions.
- Features a style engine with sanitized CSS tokens, WCAG AA contrast validation, immediate partial caption broadcast for OBS, and late-join client synchronization.
- Shows a live stream-chat subtitle feed with timestamps, plus a collapsible event log.

## Platforms

- Windows 10/11 x64 — v1.6.0: microphone + WASAPI system loopback; use the official NSIS installer (LiveAudio-Setup-1.6.0.exe, VC++ runtime bundled).
- Linux x86_64 — v1.6.0: AppImage and .deb on the release page (manual updates; no system-audio loopback).
- macOS — NOT supported.

## Features (v1.6.0)

- 100% native Rust Whisper engine over ONNX Runtime (DirectML DirectX 12 / CPU) with instant startup and zero Python.
- Real-time transcription with Whisper (tiny / base / small / turbo).
- Silero VAD with configurable pause, pre-roll and threshold.
- Optional local RNNoise suppression + acoustic speech-metadata events.
- WebSocket Loopback Origin Allowlist with real-time rejected-connection monitor.
- Model Context Protocol (MCP) server with dual explicit consent switches (Style & System).
- Signed In-App Updater (Windows) with Minisign signature validation and stream-safety blocking.
- 100% Private local metrics with zero telemetry.
- Style engine with sanitized CSS tokens, WCAG AA contrast validation, instant partial broadcasts, and late-join client sync.
- Live stream-chat subtitle feed (timestamps, stick-to-bottom, circular buffer).
- On-the-fly blacklist and vocabulary-prompt enrichment with retroactive strike-through.
- Flexible capture: mic or system loopback (loopback is Windows-only).
- Integrated WebSocket server feeding an OBS Browser Source or any HTML/WS client.
- OBS overlay: improved subtitle legibility, capped reveal-animation timing, and an adaptive vertical "ribbon" subtitle buffer.
- OBS backlog policy: Auto / Live only / Send all (controls only what shows live in OBS; everything valid is always saved).
- Hallucination filtering via an editable blacklist.
- Session management: transcript.jsonl + subtitles.vtt (+ session.json).
- Hot-swap of device/model without restarting.
- Profiles: Fast, Balanced, Quality, Stable Streaming (FPS-aware presets).
- Local-first diagnostics: no telemetry; event log records service lifecycle and config changes.
- Bilingual UI (English / Spanish).

## System requirements

- OS: Windows 10/11 x64 (v1.6.0). Linux x86_64: AppImage / .deb.
- Runtime: 100% native Rust and Tauri 2 desktop; zero Python runtime dependencies.
- GPU: optional. DirectML (DirectX 12) for NVIDIA, AMD, and Intel GPUs; automatic CPU fallback. Optional CT2 CUDA worker for NVIDIA.
- RAM: 4 GB minimum / 8 GB+ recommended.
- Disk: 250 MB (app) + about 500 MB per model cache; models are stored locally (Windows: %LOCALAPPDATA%\\LiveAudio\\models\\onnx; settings in %APPDATA%\\LiveAudio).
- Internet: only needed to download selected transcription models upon first selection. Transcription runs 100% offline once models are stored locally.

## Downloads — real v1.6.0 assets

Base URL: ${REL}/
Always-latest: https://github.com/plynte-labs/LiveAudio/releases/latest
Release notes (changelog + hashes): https://github.com/plynte-labs/LiveAudio/releases/tag/v1.6.0

- Windows installer (primary): ${REL}/LiveAudio-Setup-1.6.0.exe
- Windows CLI + ASR worker only (not the desktop app): ${REL}/liveaudio-cli-1.6.0-windows-x64.zip
- Linux x86_64 desktop app (.AppImage and .deb; exact filenames are on the release page): ${TAG_URL}
- Linux x64 CLI + ASR worker only (not the desktop app): ${REL}/liveaudio-cli-1.6.0-linux-x64.tar.gz

Windows SmartScreen: the v1.6.0 installer is not code-signed yet, so SmartScreen may warn. Choose "More info → Run anyway"; the exact files and hashes are on the v1.6.0 release page.
Upgrading: users on v1.5.1 or older must install v1.6.0 manually once (those versions have no in-app updater). Back up custom settings and sessions first.

## Install / first run

End users: download the official installer. The app starts immediately with zero Python provisioning wait. Whisper models download upon first selection.

Developers: clone https://github.com/plynte-labs/LiveAudio.git and follow the repository README (Rust toolchain + Tauri 2 prerequisites).

## OBS setup

1. In OBS: Sources → + → Browser.
2. In LiveAudio select a profile, device and model; apply changes, start the system, then copy the overlay URL. In OBS leave Local File unchecked, paste the URL, and set size 1920×1080.
3. Disable "Shut down source when not visible" (and "Refresh browser when scene becomes active").
4. While the system is running, the copied URL contains the active port; the server starts at 8765 and can use an alternative through 8774. Settings > Advanced includes the loopback port allowlist.
5. Speak and check the OBS captions.

WebSocket payload fields include id, text, timing fields, is_replay, and style. Connections are accepted from localhost only, subject to the loopback origin filter.

## Profiles, models, and blacklist

- Profiles: Fast (low latency), Balanced (recommended), Quality (higher accuracy, more VRAM), Stable Streaming (reduces GPU load while gaming). Editing a built-in profile creates a Custom one. Apply changes to activate.
- Models: tiny / base / small / turbo. Storage, memory and latency depend on the selected model and configuration.
- Default hallucination blacklist (from config.json.example): amara.org, subtítulos por, suscríbete, dale like, gracias por ver, memos, gracias, activar la campanita, ¡Hasta la próxima!, por favor.

## Pricing & licensing

Free & open-source (MIT). Local transcription requires no subscription or API key.

## FAQ

Q: Is it really 100% local?
A: Transcription runs 100% on your machine with a native Rust Whisper engine over ONNX Runtime (DirectML / CPU). There is zero Python runtime to install, zero telemetry, and zero network traffic during transcription.

Q: Does it work on Linux?
A: Yes. v1.6.0 ships a Windows 10/11 x64 installer and a Linux x86_64 AppImage and .deb (updates are manual on Linux). System-audio loopback is Windows-only.

Q: Is it free / open-source?
A: Yes — it's free and open-source under the MIT license. No subscription and no API key; you only pay your own electricity.

Q: Do I need a GPU?
A: No — DirectML accelerates Whisper inference on DirectX 12 GPUs (NVIDIA, AMD, Intel) out of the box, with automatic CPU fallback. An optional CTranslate2 CUDA worker is available for dedicated NVIDIA GPUs.

Q: Do I need internet or an API key?
A: No API key is needed for local transcription, and there are no Python runtimes to download. Internet is only used when downloading a newly selected Whisper model.

Q: What's the latency?
A: Latency depends on speech segmentation, model, hardware and load. Profiles let you adjust the tradeoff between latency and accuracy.

Q: How is it different from cloud APIs / OBS caption plugins?
A: LiveAudio runs Whisper locally with zero cloud dependencies, zero per-minute cost, and zero data leaving your machine. It broadcasts subtitle JSON over a local WebSocket with CSWSH protection and full OBS/client integration.

## Compatibility

LiveAudio broadcasts clean subtitle JSON over a local WebSocket (ws://127.0.0.1:8765). OBS is the built-in target via the included subtitulos_obs.html overlay, but any HTML or WebSocket client on localhost can connect and receive the same broadcast subject to the configurable loopback origin allowlist.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
