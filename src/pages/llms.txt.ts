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

> LiveAudio is a free, open-source (MIT) app for local speech transcription and OBS captions. 100% native Rust architecture with Tauri 2 desktop and ONNX Runtime DirectML/CPU Whisper inference worker (zero Python). Windows x64 release: v1.6.0. No cloud transcription service or API key is needed.

Key facts:
- 100% Native Rust & Zero Python: completely eliminated Python runtimes, virtual environments, uv, and Python setup downloads. The native Whisper engine (liveaudio-asr-worker.exe) runs on ONNX Runtime with DirectML (DirectX 12 for NVIDIA, AMD, Intel) and automatic CPU fallback. Optional NVIDIA CUDA engine (CTranslate2), downloaded only after an explicit user action. Instant startup and immediate transcription.
- Model downloads only: internet is only required to download transcription models upon first selection. Once downloaded, transcription runs 100% offline with zero network traffic.
- Use the official Windows installer (LiveAudio-Setup-1.6.0.exe; the VC++ runtime is bundled, so it works on a clean Windows). The installer is not code-signed; SmartScreen may warn. Linux: AppImage and .deb on the v1.6.0 release page.
- Transcribes with Whisper (tiny, base, small, turbo); Silero VAD trims silence (configurable onset pre-roll + VAD threshold); optional local RNNoise suppression and acoustic speech-metadata events.
- Capture: physical microphone or system audio (WASAPI loopback is Windows-only).
- WebSocket Loopback Origin Allowlist: strict protection against Cross-Site WebSocket Hijacking (CSWSH) attacks. Configurable in Advanced with live rejected-connection monitoring and Allow/Revoke controls for local ports.
- Model Context Protocol (MCP) granular stdio server: liveaudio-cli mcp integrates with AI assistants (Claude Desktop/Code) with dual explicit consent switches (Style switch for themes/CSS/presets; System switch for device/model/VAD). Port allowlist and filesystem paths strictly excluded from AI mutation.
- Signed In-App Updater (Windows only): checks GitHub Releases every 24 h (can be disabled in Advanced), verifies Minisign signatures before running any installer, and never downloads or installs while transcribing or while OBS clients are connected. Users on v1.5.1 or older must install v1.6.0 manually once. Linux updates are manual.
- 100% Private local usage metrics: anonymous local statistics stored strictly on your machine with 0 telemetry.
- Style engine & partial broadcast: sanitized CSS tokens, WCAG AA contrast validation, immediate partial caption broadcast, and late-join client synchronization.
- Free & open-source (MIT). No subscription, no API key. You only pay your own electricity — hardware not included.
- Linux x86_64: AppImage and .deb on the v1.6.0 release page (manual updates); CLI archives (liveaudio-cli-1.6.0-linux-x64.tar.gz, liveaudio-cli-1.6.0-windows-x64.zip) contain only the CLI and ASR worker, not the desktop app.

## Pages

- [Home](${u("/")}): What LiveAudio is, who it's for, and the conversion funnel — real-time local captions for OBS, 100% native Rust on Windows x64.
- [Download](${u("/download/")}): Windows installer (v1.6.0), Linux AppImage and .deb, CLI archives, release notes and requirements.
- [Getting started](${u("/getting-started/")}): Activation walkthrough — graphical installer vs. source build for developers, instant startup, DirectML GPU auto-detect, and profiles.
- [OBS setup](${u("/obs-setup/")}): Start LiveAudio, copy its overlay URL, and use it in an OBS Browser Source with Local File unchecked.

## Docs

- [Docs: Overview](${u("/docs/overview/")}): What LiveAudio does and how the 100% native local pipeline (capture → VAD → Whisper ONNX Runtime → WebSocket broadcast) fits together.
- [Docs: Getting started](${u("/docs/getting_started/")}): Install, instant first run, DirectML GPU acceleration, and choosing a profile (Fast / Balanced / Quality / Stable Streaming).
- [Docs: WebSocket & OBS](${u("/docs/websocket_obs/")}): The ws://127.0.0.1:8765 broadcast, CSWSH origin allowlist, subtitle JSON payload fields, OBS Browser Source wiring, and custom ports.
- [Docs: Troubleshooting](${u("/docs/troubleshooting/")}): Common fixes — SmartScreen, audio device selection, and reconnection.
- [Docs: Config](${u("/docs/config/")}): config.json reference — ws_port, profiles, hallucination blacklist, and session output files.

## Reference

- [FAQ](${u("/faq/")}): Short, citable answers — is it really local, does it run on Linux, is it free, do I need a GPU, do I need internet, what's the latency, how does it differ from cloud APIs.
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
