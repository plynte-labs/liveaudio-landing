import type { APIRoute } from "astro";

/**
 * llms.txt — curated, LLM-friendly index of LiveAudio's canonical pages.
 *
 * Follows the llmstxt.org convention: an H1 product name, a blockquote summary,
 * then linked sections of canonical URLs with one-line descriptions. Every fact
 * here is traceable to the product spec. Static endpoint (export GET).
 *
 * The /es/ mirror exists for each marketing page but is intentionally omitted
 * from this index — agents only need one canonical (EN) entry per page.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://liveaudio.opencohost.com")).href.replace(/\/$/, "");
  const u = (path: string) => `${base}${path}`;

  const body = `# LiveAudio

> LiveAudio is a free, open-source (MIT) app for local speech transcription and OBS captions. Its Rust core and Tauri desktop use a Python inference worker. Windows x64 release: v1.5.1. No cloud transcription service or API key is needed.

Key facts:
- Transcription runs locally. Setup may require internet for worker dependencies and models, including newly selected models. Once required components are available, transcription can run offline.
- Use the official ~26.2 MB Windows installer. The separate desktop executable lacks the CLI and resources. Runtime dependencies and models require additional storage. The installer is not code-signed; SmartScreen may warn.
- Transcribes with Whisper (tiny, base, small, turbo); Silero VAD trims silence (configurable onset pre-roll + VAD threshold); optional local RNNoise suppression and acoustic speech-metadata events.
- Capture: physical microphone or system audio (WASAPI loopback is Windows-only).
- Broadcasts subtitle JSON over a local WebSocket to OBS Browser Source or any HTML/WS client on localhost; connections accepted from localhost only, no auth.
- Live stream-chat subtitle feed with timestamps, on-the-fly blacklist and vocabulary prompt, FPS-aware profiles, hot-swap device/model, session files.
- Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.
- GPU optional; CPU works. CUDA inference also requires compatible runtime libraries; GPU detection alone does not guarantee readiness.
- Latency depends on speech segmentation, model, hardware and load.
- Linux: legacy Python v1.2.7 tarball until a native Linux build ships.

## Pages

- [Home](${u("/")}): What LiveAudio is, who it's for, and the conversion funnel — real-time local captions for OBS, now as a native Rust build on Windows x64.
- [Download](${u("/download/")}): Windows installer, incomplete desktop executable, legacy Linux tarball, release notes and requirements.
- [Getting started](${u("/getting-started/")}): Activation walkthrough — graphical installer vs. source build for developers, first-run download, GPU auto-detect, and profiles.
- [OBS setup](${u("/obs-setup/")}): Start LiveAudio, copy its overlay URL, and use it in an OBS Browser Source with Local File unchecked.

## Docs

- [Docs: Overview](${u("/docs/overview/")}): What LiveAudio does and how the local pipeline (capture → VAD → Whisper → WebSocket broadcast) fits together.
- [Docs: Getting started](${u("/docs/getting_started/")}): Install, first run, GPU auto-detect, and choosing a profile (Fast / Balanced / Quality / Stable Streaming).
- [Docs: WebSocket & OBS](${u("/docs/websocket_obs/")}): The ws://127.0.0.1:8765 broadcast, subtitle JSON payload fields, OBS Browser Source wiring, and custom ports.
- [Docs: Troubleshooting](${u("/docs/troubleshooting/")}): Common fixes — SmartScreen, libportaudio2 on Linux, audio device selection, and reconnection.
- [Docs: Config](${u("/docs/config/")}): config.json reference — ws_port, profiles, hallucination blacklist, and session output files.

## Reference

- [FAQ](${u("/faq/")}): Short, citable answers — is it really local, does it work on Linux, is it free, do I need a GPU, do I need internet, what's the latency, how does it differ from cloud APIs.
- [Comparison](${u("/vs/")}): LiveAudio vs. OBS caption plugins, browser-based caption tools, and cloud ASR APIs — local cost, privacy, and latency tradeoffs.

## Resources

- [GitHub](https://github.com/plynte-labs/LiveAudio): Source code, issues, and releases (MIT license).
- [Latest release](https://github.com/plynte-labs/LiveAudio/releases/latest): Always-current download assets and changelog.
- [llms-full.txt](${u("/llms-full.txt")}): Expanded, concatenated reference of LiveAudio facts and docs for deeper agent context.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
