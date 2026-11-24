import type { APIRoute } from "astro";
import {
  LIVEAUDIO_TAG,
  REPO_URL,
  RELEASE_LATEST_URL,
  RELEASE_DOWNLOAD_BASE,
  WINDOWS_INSTALLER_FILENAME,
  WINDOWS_INSTALLER_URL,
  WINDOWS_CLI_URL,
  LINUX_CLI_URL,
} from "../config/release";

/**
 * llms-full.txt — expanded, concatenated reference of LiveAudio facts.
 *
 * A single plain-text document an LLM can ingest to answer questions about
 * LiveAudio without crawling every page.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://liveaudio.opencohost.com")).href.replace(/\/$/, "");

  const body = `# LiveAudio — Full Reference (${LIVEAUDIO_TAG})

> LiveAudio is a free, open-source (MIT) prebuilt native Rust desktop app for Windows x64 and Linux x86_64 with NVIDIA Parakeet-TDT ONNX + Whisper and a built-in OBS WebSocket/Browser Source overlay. Zero Python, no cloud transcription, no API key, and zero data collected or retained by the desktop app.

Canonical site: ${base}/
Source: ${REPO_URL} (MIT)
Release: ${LIVEAUDIO_TAG} (100% Native Rust + ONNX Runtime + Tauri 2)

---

## What it is

A real-time, 100% local automatic-speech-recognition (ASR) desktop application for streamers and creators:
- Recommended ASR engine for EN & ES: **NVIDIA Parakeet-TDT 0.6B v3** on native Rust + ONNX Runtime (int8 on CPU, DirectML on GPU; hardware-matched download on demand with automatic CPU fallback).
  - Measured on \`es_media\` clip: Parakeet CPU int8 = 1390 ms vs Whisper \`small\` on CPU = 2877 ms (~2x faster on CPU), GPU DirectML = 501 ms (WER 0.189).
  - Transducer decoder emits blank on silence/noise for near-zero silence hallucinations.
  - Runs smoothly on 4-thread CPU-only laptops using the automatic CPU threads switch.
- **Whisper** (tiny, base, small, turbo) remains available for other languages, translate-to-English, and context prompts.
- Optional **NVIDIA CUDA 12.8** acceleration via CTranslate2 worker (\`ct2-worker-v1.6.0\`, validated against on-demand cuBLAS 12.8 / cuDNN 9 runtime, with protocol-version guard and automatic fallback to ONNX Runtime).
- **Zero Python**: completely native Rust and Tauri 2 with instant startup and no virtual environments or uv provisioning.
- **Zero data collection / zero data retention (Desktop App)**: running 100% locally is the core benefit. Audio, transcripts, settings, and usage never leave the user's machine. Only the website (\`liveaudio.opencohost.com\`) uses Microsoft Clarity for web analytics.
- **Outbound Network Scope (Desktop App)**:
  1. On-demand model downloads (SHA-256 verified).
  2. Optional 24-hour GitHub Releases update check (zero telemetry, toggleable in Settings > Advanced).
  3. Opt-in NVIDIA CUDA runtime download.
  Audio and transcripts never leave your machine.

## Platforms & Linux x86_64 capabilities

- **Windows 10/11 x64**: official NSIS installer (\`${WINDOWS_INSTALLER_FILENAME}\`, VC++ runtime bundled), WASAPI system-audio loopback, signed Minisign Ed25519 in-app updates.
- **Linux x86_64**: prebuilt \`.AppImage\` and \`.deb\` packages on GitHub Releases (${RELEASE_LATEST_URL}).
  - System-audio loopback works on BOTH Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture with ALSA fallback).
  - Signed Minisign Ed25519 in-app updates work on Windows (NSIS) and Linux (\`.AppImage\`); \`.deb\` users update via GitHub Releases.
- **macOS**: not supported.

## Key features (${LIVEAUDIO_TAG})

- NVIDIA Parakeet-TDT 0.6B v3 (recommended for EN/ES) + Whisper (multilingual, translate-to-English, context prompts) on native Rust + ONNX Runtime (CPU int8 / DirectML) + optional CUDA 12.8 (CTranslate2).
- 7 live OBS themes (\`default\`, \`karaoke\`, \`neon\`, \`minimal\`, \`bold\`, \`rgb\`, \`typewriter\`) with sanitized CSS tokens, WCAG AA contrast validation, and anti-burst \`/overlay\` reconnection.
- Local session recording to \`.srt\` (DaVinci Resolve-ready), \`.vtt\`, and \`.jsonl\`.
- Dual-consent MCP server (\`liveaudio-cli mcp\`): granular stdio server for AI assistants with separate Style and System consent switches (loopback allowlist and filesystem paths strictly excluded from AI mutation).
- "Follow OpenCohost Language": OpenCohost locale sync behind an opt-in switch.
- Upgraded Blacklist filter: whole-word matching that trims phrases only at utterance edges (so long sentences are not dropped), plus dedicated switches for context prompt and blacklist.
- Automatic CPU threads switch + redesigned Advanced tab.
- Stream-safe signed in-app updater (Minisign Ed25519 on Windows NSIS and Linux \`.AppImage\`): blocks updates while live or OBS is connected.
- Silero VAD (configurable onset pre-roll + threshold) + optional local RNNoise noise suppression.
- WebSocket Loopback Origin Allowlist in Advanced against Cross-Site WebSocket Hijacking (CSWSH) with real-time rejected-connection monitor.
- OBS backlog policy (\`auto\` / \`live_only\` / \`send_all\`) controlling only live OBS display while saving every valid line locally.
- FPS-aware profiles: Fast, Balanced (recommended), Quality, Stable Streaming.
- Local-first diagnostics (sanitizes secrets and paths, excludes raw audio and full transcripts, zero telemetry).
- Bilingual UI (English / Spanish).

## System requirements

- OS: Windows 10/11 x64 (\`.exe\`), Linux x86_64 (\`.AppImage\` / \`.deb\`).
- Runtime: 100% native Rust and Tauri 2 desktop; zero Python runtime dependencies.
- CPU / GPU: GPU optional. Parakeet-TDT 0.6B v3 int8 runs smoothly on 4-thread CPU-only laptops (automatic CPU threads switch). DirectML (DirectX 12) for NVIDIA, AMD, and Intel GPUs with automatic CPU fallback; optional CTranslate2 CUDA 12.8 worker for NVIDIA GPUs.
- RAM: 4 GB minimum / 8 GB+ recommended.
- Disk: 250 MB (app) + ~500 MB–1.5 GB per cached model; Windows stores models in \`%LOCALAPPDATA%\\LiveAudio\\models\\onnx\` and settings in \`%APPDATA%\\LiveAudio\`.

## Downloads (${LIVEAUDIO_TAG})

Base download URL: ${RELEASE_DOWNLOAD_BASE}/
Always-latest release (changelog, SHA-256 checksums, Linux packages): ${RELEASE_LATEST_URL}

- Windows installer (primary): ${WINDOWS_INSTALLER_URL}
- Windows CLI + ASR worker only (not the desktop app): ${WINDOWS_CLI_URL}
- Linux x86_64 desktop app (\`.AppImage\` and \`.deb\`): ${RELEASE_LATEST_URL}
- Linux x86_64 CLI + ASR worker only (not the desktop app): ${LINUX_CLI_URL}

Windows SmartScreen: the Windows installer is not code-signed yet, so SmartScreen may warn. Choose "More info -> Run anyway"; exact files and SHA-256 hashes are published on GitHub Releases.
Upgrading: users on v1.5.1 or older must install ${LIVEAUDIO_TAG} manually once because older versions lack the signed in-app updater. Back up custom settings and sessions first.

## OBS setup

1. In OBS: Sources -> + -> Browser.
2. In LiveAudio select a profile, audio device (mic or Windows WASAPI / Linux PipeWire-PulseAudio loopback), and engine (Parakeet-TDT or Whisper); click Save, start the system before copying the overlay URL. In OBS leave Local File unchecked, paste the URL, and set size 1920x1080.
3. Disable "Shut down source when not visible" (and "Refresh browser when scene becomes active").
4. While the system is running, the copied URL contains the active port (base 8765, fallback up to 8774). Advanced includes the loopback Origin allowlist.
5. Speak, check captions in OBS, and switch live across the 7 built-in themes.

WebSocket payload fields: \`id\`, \`text\`, \`style\`, \`created_at\`, \`processed_at\`, \`queue_delay\`, \`total_delay\`, \`latency\`, \`is_replay\`, \`catchup_interval_sec\`. Connections are accepted from localhost (\`127.0.0.1\`) only, subject to the loopback Origin allowlist.

## Default hallucination blacklist

\`amara.org, subtítulos por, suscríbete, dale like, gracias por ver, memos, gracias, activar la campanita\`
(Whole-word edge-trimming matcher trims phrases only at utterance edges so long sentences are not dropped; switching to NVIDIA Parakeet-TDT 0.6B v3 eliminates most silence hallucinations for EN/ES.)

## Pricing & licensing

Free & open-source (MIT). Local transcription requires no subscription and no API key.

## FAQ

Q: Is it really 100% local?
A: Yes. The LiveAudio desktop app collects zero data and retains zero data — audio and transcripts never leave your machine. Outbound desktop network access is limited to on-demand SHA-256 model downloads, an optional 24-hour GitHub Releases check (zero telemetry, toggleable), and opt-in CUDA runtime downloads. Only the website (liveaudio.opencohost.com) uses Microsoft Clarity.

Q: Does it work on Linux?
A: Yes. LiveAudio ships prebuilt Linux x86_64 .AppImage and .deb packages alongside the Windows 10/11 x64 installer. System-audio loopback works on both Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture + ALSA fallback), and signed Minisign Ed25519 in-app updates work on Windows (NSIS) and Linux .AppImage (.deb updates via GitHub Releases).

Q: Do I need a GPU?
A: No. NVIDIA Parakeet-TDT 0.6B v3 int8 is ~2x faster on CPU than Whisper small and runs smoothly on 4-thread CPU-only laptops using the automatic CPU threads switch. DirectML (DirectX 12 GPU) and optional CTranslate2 CUDA 12.8 acceleration are also built in.

Q: Whisper writes words I never said. Why?
A: Switch to NVIDIA Parakeet-TDT 0.6B v3 first for EN/ES: its transducer decoder emits blank on silence/noise for near-zero hallucinations. For Whisper, enable the upgraded whole-word edge-trimming Blacklist switch in Settings > Advanced.

Q: What's the latency?
A: Latency depends on speech segmentation, chosen engine/model, hardware, and system load. Profiles let you adjust the tradeoff between responsiveness and accuracy.

Q: How is it different from cloud APIs or OBS caption plugins?
A: LiveAudio is a prebuilt native Rust desktop app for Windows & Linux with Parakeet-TDT ONNX + built-in OBS WebSocket/Browser Source overlay. Unlike cloud APIs it has zero per-minute cost and zero app data collection, and unlike in-process OBS plugins it runs isolated from OBS so it cannot take your stream down.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
