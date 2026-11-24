import type { APIRoute } from "astro";
import {
  LIVEAUDIO_TAG,
  REPO_URL,
  RELEASE_LATEST_URL,
  WINDOWS_INSTALLER_FILENAME,
  WINDOWS_CLI_FILENAME,
  LINUX_CLI_FILENAME,
} from "../config/release";

/**
 * llms.txt — curated, LLM-friendly index of LiveAudio's canonical pages.
 *
 * Follows the llmstxt.org convention: an H1 product name, a blockquote summary,
 * then linked sections of canonical URLs with one-line descriptions.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://liveaudio.opencohost.com")).href.replace(/\/$/, "");
  const u = (path: string) => `${base}${path}`;

  const body = `# LiveAudio

> LiveAudio (${LIVEAUDIO_TAG}) is a prebuilt native Rust + Tauri 2 desktop app for Windows x64 and Linux x86_64 that generates real-time captions 100% locally and streams them to OBS. Powered by NVIDIA Parakeet-TDT 0.6B v3 (recommended for EN/ES) and Whisper on ONNX Runtime (CPU / DirectML) plus optional NVIDIA CUDA (CTranslate2) — zero Python, free & open-source (MIT), no API key, and zero data collected or retained by the desktop app.

Key facts:
- Recommended ASR engine (EN & ES): NVIDIA Parakeet-TDT 0.6B v3 on native Rust + ONNX Runtime (int8 on CPU, DirectML on GPU; hardware-matched download on demand with automatic CPU fallback). Measured on es_media clip: Parakeet CPU int8 = 1390 ms vs Whisper small on CPU = 2877 ms (~2x faster on CPU), GPU DirectML = 501 ms (WER 0.189). Transducer decoder emits blank on silence/noise for near-zero silence hallucinations and runs smoothly on 4-thread CPU-only laptops (automatic CPU threads switch).
- Whisper remains available (tiny, base, small, turbo) for other languages, translate-to-English, and context prompts.
- Optional NVIDIA CUDA 12.8 acceleration via CTranslate2 worker (ct2-worker-v1.6.0, validated against on-demand cuBLAS 12.8 / cuDNN 9 runtime, with protocol-version guard and automatic fallback to ONNX Runtime).
- 100% Native Rust & Zero Python: zero Python runtimes, virtual environments, or uv setup downloads.
- Zero desktop data collection & zero data retention: running 100% locally is the core benefit. Audio, transcripts, settings, and usage never leave the user's machine. Only the website (liveaudio.opencohost.com) uses Microsoft Clarity for web analytics.
- Outbound Network Scope (Desktop App): strictly limited to (a) on-demand SHA-256 verified model downloads, (b) optional 24-hour GitHub Releases update check (zero telemetry, toggleable in Settings > Advanced), and (c) opt-in NVIDIA CUDA runtime download. Audio and transcripts never leave your machine.
- Platforms & Loopback: Windows 10/11 x64 NSIS installer (${WINDOWS_INSTALLER_FILENAME}; VC++ runtime bundled, not code-signed yet so SmartScreen may warn) and prebuilt Linux x86_64 .AppImage and .deb packages. System-audio loopback works on BOTH Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture with ALSA fallback).
- Stream-safe signed in-app updater (Minisign Ed25519): works on Windows (NSIS) and Linux (.AppImage) and blocks updates while live or while OBS is connected. Linux .deb users update via GitHub Releases (${RELEASE_LATEST_URL}).
- OBS overlay & themes: 7 live OBS themes (default, karaoke, neon, minimal, bold, rgb, typewriter), anti-burst /overlay reconnection, sanitized CSS tokens, WCAG AA contrast validation, and WebSocket loopback Origin allowlist against CSWSH.
- Session recording: saves .srt (DaVinci Resolve-ready), .vtt, and .jsonl locally on disk.
- Dual-consent MCP server (liveaudio-cli mcp): granular stdio server with independent Style and System consent switches; CLI archives (${WINDOWS_CLI_FILENAME}, ${LINUX_CLI_FILENAME}) contain only the CLI and ASR worker, not the desktop app.
- Additional v1.6.5 features: Follow OpenCohost Language switch, upgraded whole-word edge-trimming Blacklist (trims phrases only at utterance edges so long sentences are not dropped) with dedicated blacklist & context-prompt switches, automatic CPU threads switch, and redesigned Advanced tab.

## Pages

- [Home](${u("/")}): LiveAudio overview — prebuilt native Rust desktop app for Windows & Linux with NVIDIA Parakeet-TDT ONNX + Whisper and built-in OBS overlay.
- [Download](${u("/download/")}): Windows x64 installer (${LIVEAUDIO_TAG}), Linux x86_64 .AppImage and .deb, CLI archives, requirements, and SHA-256 checksums.
- [Getting started](${u("/getting-started/")}): Step-by-step activation for Windows and Linux, Parakeet-TDT vs Whisper, CPU/DirectML/CUDA compute, and profiles.
- [OBS setup](${u("/obs-setup/")}): Start the system before copying the overlay URL, paste into an OBS Browser Source with Local File unchecked, and use 7 live themes.
- [Product tour](${u("/product-tour/")}): Real native Rust + Tauri 2 desktop captures (setup home, style editor, and historical v1.5.0 view).

## Docs

- [Docs: Overview](${u("/docs/overview/")}): Local architecture, Parakeet-TDT & Whisper engines, Windows & Linux loopback, outbound network scope, and signed updates.
- [Docs: Getting started](${u("/docs/getting_started/")}): Prebuilt packages, source build, compute options, profiles, edge-trimming blacklist, and .srt/.vtt/.jsonl session files.
- [Docs: WebSocket & OBS](${u("/docs/websocket_obs/")}): Local ws://127.0.0.1:8765 broadcast, 7 live themes, anti-burst /overlay reconnection, CSWSH Origin allowlist, and JSON payload schema.
- [Docs: Troubleshooting](${u("/docs/troubleshooting/")}): Windows/Linux loopback, hallucinations (Parakeet-TDT vs Blacklist), GPU/CUDA fallback, OBS reconnection, SmartScreen, and local diagnostics.
- [Docs: Configuration](${u("/docs/config/")}): config.json reference, Windows & Linux paths, compute/engine keys, MCP switches, Follow OpenCohost Language, and CLI commands.

## Reference

- [FAQ](${u("/faq/")}): Concise, source-backed answers on local privacy, Linux support, CPU-only laptops, Parakeet-TDT vs Whisper, hallucinations, and OBS plugins.
- [Comparison](${u("/vs/")}): LiveAudio vs OBS caption plugins, browser-based caption tools, and cloud ASR APIs.
- [Privacy Policy](${u("/privacy/")}): Zero desktop app data collection/retention, outbound network scope, and website-only Microsoft Clarity disclosure.

## Resources

- [GitHub](${REPO_URL}): Source code, issues, and releases (MIT license).
- [Latest release](${RELEASE_LATEST_URL}): Always-current download assets, SHA-256 checksums, and changelog.
- [llms-full.txt](${u("/llms-full.txt")}): Expanded, single-document technical reference for deeper agent context.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
