/**
 * Docs content model — LiveAudio · 5 sections, bilingual.
 *
 * This is the CONTENT source for /docs/[section]/ (EN) + /es/docs/[section]/ (ES).
 * 100% native Rust + Tauri 2 with ONNX Runtime (NVIDIA Parakeet-TDT 0.6B v3 &
 * Whisper on CPU / DirectML) plus optional NVIDIA CUDA via CTranslate2.
 *
 * Rendering: DocsPage.astro walks `blocks[]`. Each `heading` block contributes an
 * anchor to the right-rail "on this page" list (its `id` + text). Inline markup in
 * prose/cells is restricted to the SIGNAL DESK palette: <code> mono tokens, <strong>
 * emphasis. NO hardcoded colors — code tints come from .code-block / <code> CSS.
 *
 * Spanish copy is neutral/professional (no regional slang or Spanglish leaks).
 */

import type { Locale } from "../routes";
import {
  LIVEAUDIO_TAG,
  REPO_URL,
  RELEASE_LATEST_URL,
  WINDOWS_INSTALLER_FILENAME,
  WINDOWS_CLI_FILENAME,
  LINUX_CLI_FILENAME,
} from "../../config/release";

/** The 5 doc sections, in nav order. Drives getStaticPaths. */
export const DOC_SECTIONS = [
  "overview",
  "getting_started",
  "websocket_obs",
  "troubleshooting",
  "config",
] as const;

export type DocSection = (typeof DOC_SECTIONS)[number];

/* ------------------------------------------------------------------ */
/* Block model                                                         */
/* ------------------------------------------------------------------ */

/** A section heading — also surfaced in the right-rail anchor list. */
export interface HeadingBlock {
  type: "heading";
  /** Stable anchor id (kebab-case, unique within the section). */
  id: string;
  text: string;
}

/** A paragraph. `html` may contain <code>, <strong>, <a> — palette-safe only. */
export interface ProseBlock {
  type: "prose";
  html: string;
}

/** A bullet list. Items are HTML strings (palette-safe inline markup). */
export interface ListBlock {
  type: "list";
  items: string[];
}

/** A data table. `head` = column labels; `rows` = cells (HTML strings). */
export interface TableBlock {
  type: "table";
  head: string[];
  rows: string[][];
}

/** A fenced code/data block rendered in `.code-block` chrome. */
export interface CodeBlock {
  type: "code";
  /** mono tab label (filename / port / "json" / "bash"). */
  label: string;
  /** raw code text (newlines preserved; rendered as-is, no syntax exec). */
  code: string;
}

/**
 * An amber operator note (warn / verify / timing semantic per the design system).
 * Use ONLY for caveats: SmartScreen, manual Linux updates, first-run internet, the
 * Windows-only loopback flag, CUDA out-of-memory recovery, simulated labels.
 */
export interface CalloutBlock {
  type: "callout";
  /** short mono kicker, e.g. "windows-only" / "first run: internet". */
  flag: string;
  html: string;
}

export type DocBlock =
  | HeadingBlock
  | ProseBlock
  | ListBlock
  | TableBlock
  | CodeBlock
  | CalloutBlock;

/** One rendered doc page. */
export interface DocSectionContent {
  slug: DocSection;
  /** Mono nav label (sidebar + mobile <details>). */
  navLabel: string;
  /** Page <title> (used by Layout). */
  metaTitle: string;
  /** Page meta description (used by Layout). */
  metaDescription: string;
  /** Mono eyebrow above the H2 (answer-first opener). */
  eyebrow: string;
  /** The single page H1. */
  h1: string;
  /** Answer-first lede under the H1. */
  lede: string;
  /** Body blocks. */
  blocks: DocBlock[];
}

/* ------------------------------------------------------------------ */
/* Shared facts (single source — keeps EN/ES in lockstep, the product spec) */
/* ------------------------------------------------------------------ */

const REPO = REPO_URL;

/** WebSocket JSON payload example — verbatim shape from §7. */
const WS_PAYLOAD_EN = `{
  "id": "utt_42",
  "text": "Hello everyone, welcome to the stream",
  "style": "default",
  "created_at": 1760000000.0,
  "processed_at": 1760000001.3,
  "queue_delay": 0.2,
  "total_delay": 1.3,
  "latency": 1.1,
  "is_replay": false,
  "catchup_interval_sec": 0.0
}`;

const WS_PAYLOAD_ES = `{
  "id": "utt_42",
  "text": "Hola a todos, bienvenidos al stream",
  "style": "default",
  "created_at": 1760000000.0,
  "processed_at": 1760000001.3,
  "queue_delay": 0.2,
  "total_delay": 1.3,
  "latency": 1.1,
  "is_replay": false,
  "catchup_interval_sec": 0.0
}`;

/** Source checkout (Rust + Tauri 2) — identical across locales except comments. */
const SOURCE_CLONE_EN = `git clone ${REPO}.git
cd LiveAudio

# Developer path: see the repository README for the
# Rust + Tauri 2 build prerequisites, then build from source.`;

const SOURCE_CLONE_ES = `git clone ${REPO}.git
cd LiveAudio

# Camino de desarrollador: consulta el README del repositorio para los
# prerrequisitos de compilación Rust + Tauri 2, y luego compila desde el código.`;

/** Session folder layout (transcript.jsonl + subtitles.vtt + subtitles.srt). */
const SESSION_TREE = `sessions/
└── session_2026-05-04_143022/
    ├── subtitles.srt
    ├── subtitles.vtt
    └── transcript.jsonl`;

/**
 * Default blacklist — VERBATIM from config.json.example (§8). Do NOT invent words.
 * (The OLD site's flupco/cuanos/kibon/plechitin/pae are removed — §9 row 9.)
 */
const BLACKLIST_VERBATIM = `amara.org, subtítulos por, suscríbete, dale like, gracias por ver,
memos, gracias, activar la campanita`;

const WS_PYTHON_CLIENT = `import asyncio, json, websockets

async def main():
    # ping_interval=None: the server answers pings only after its replay burst
    async with websockets.connect("ws://127.0.0.1:8765", ping_interval=None) as ws:
        async for frame in ws:
            msg = json.loads(frame)
            if "type" in msg:  # hello, theme, subtitle_partial...: not a caption
                continue
            print(msg["text"])

asyncio.run(main())`;

/**
 * Minimal browser WebSocket client — reads the same broadcast OBS reads.
 * Follows docs/WEBSOCKET_OBS.md §8.1: caption frames carry `text`; frames with a
 * `type` field (hello, theme, subtitle_partial) are skipped. Locale-neutral.
 */
const WS_HTML_CLIENT = `<!-- serve from a local http server, e.g. python -m http.server 5500
     (file:// sends Origin: null and gets 403), then allow port 5500 in
     Advanced > Allowed local connections -->
<div id="caption"></div>
<script>
  const PORT = 8765; // base port; the effective port is announced in the hello frame
  let ws;
  function connect() {
    ws = new WebSocket("ws://127.0.0.1:" + PORT);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if ("type" in msg) return;  // hello, theme, subtitle_partial: not a caption
      document.getElementById("caption").textContent = msg.text;
    };
    // retry after 3 s if the connection drops (this sample's own choice)
    ws.onclose = () => setTimeout(connect, 3000);
  }
  connect();
</script>`;

/** Installer and provisioning overview. */
const NATIVE_INSTALL_FLOW = `${WINDOWS_INSTALLER_FILENAME}  (or Linux .AppImage / .deb)
  │
  ├─ Back up custom settings and sessions before upgrading
  ├─ Run the installer or launch the Linux .AppImage / .deb package
  └─ 100% native Rust, zero Python; SHA-256 models download on demand`;

/** config.json example — blacklist trimmed to verbatim words. */
const CONFIG_EXAMPLE_EN = `{
    "output_dir": "C:\\\\streams\\\\sessions",
    "device": "cpu",
    "cpu_threads": 4,
    "auto_cpu_threads": true,
    "asr_engine": "parakeet",
    "model_size": "parakeet-tdt-0.6b-v3",
    "blacklist": "amara.org, subtítulos por, gracias por ver",
    "blacklist_enabled": true,
    "context_prompt_enabled": false,
    "follow_opencohost_language": false,
    "continuous_session": true,
    "subtitle_style": "default",
    "subtitle_backlog_policy": "auto",
    "subtitle_max_live_delay_sec": 10.0,
    "subtitle_catchup_interval_sec": 1.5,
    "silence_timeout": 0.5,
    "max_chunk_duration": 3.0,
    "audio_device": null,
    "selected_profile_id": "balanced",
    "profile_mode": "preset",
    "ws_port": 8765,
    "ws_allowed_loopback_ports": [1420],
    "obs_enabled": true,
    "whisper_context_prompt_en": "",
    "whisper_context_prompt_es": "",
    "asr_language": "en",
    "settings_navigation_mode": "tabs",
    "diagnostics_enabled": false,
    "rnnoise_enabled": false,
    "check_updates_enabled": true
}`;

const CONFIG_EXAMPLE_ES = `{
    "output_dir": "E:\\\\streams\\\\sessions",
    "device": "cpu",
    "cpu_threads": 4,
    "auto_cpu_threads": true,
    "asr_engine": "parakeet",
    "model_size": "parakeet-tdt-0.6b-v3",
    "blacklist": "amara.org, subtítulos por, gracias por ver",
    "blacklist_enabled": true,
    "context_prompt_enabled": false,
    "follow_opencohost_language": false,
    "continuous_session": true,
    "subtitle_style": "default",
    "subtitle_backlog_policy": "auto",
    "subtitle_max_live_delay_sec": 10.0,
    "subtitle_catchup_interval_sec": 1.5,
    "silence_timeout": 0.5,
    "max_chunk_duration": 3.0,
    "audio_device": null,
    "selected_profile_id": "balanced",
    "profile_mode": "preset",
    "ws_port": 8765,
    "ws_allowed_loopback_ports": [1420],
    "obs_enabled": true,
    "whisper_context_prompt_en": "",
    "whisper_context_prompt_es": "",
    "asr_language": "es",
    "settings_navigation_mode": "tabs",
    "diagnostics_enabled": false,
    "rnnoise_enabled": false,
    "check_updates_enabled": true
}`;

/* ================================================================== */
/* ENGLISH                                                             */
/* ================================================================== */

const DOCS_EN: Record<DocSection, DocSectionContent> = {
  overview: {
    slug: "overview",
    navLabel: "Overview",
    metaTitle: "LiveAudio docs — Overview",
    metaDescription:
      "What LiveAudio is and what it needs: a free, open-source (MIT) native Rust desktop app for Windows & Linux powered by NVIDIA Parakeet-TDT and Whisper on ONNX Runtime with zero desktop data collection.",
    eyebrow: "// docs / overview",
    h1: "LiveAudio documentation",
    lede:
      `LiveAudio is a free, open-source (MIT) native Rust + Tauri 2 desktop app for Windows x64 and Linux x86_64 that generates real-time captions 100% locally and streams them to OBS. ${LIVEAUDIO_TAG} pairs NVIDIA Parakeet-TDT 0.6B v3 (recommended for EN/ES) and Whisper on ONNX Runtime (CPU / DirectML) plus optional CUDA — with zero Python, no API key, and zero data collected or retained by the desktop app.`,
    blocks: [
      {
        type: "heading",
        id: "what-it-is",
        text: "What LiveAudio is",
      },
      {
        type: "prose",
        html: "<strong>Plynte LiveAudio</strong> is a prebuilt native Rust desktop app for Windows &amp; Linux with <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> ONNX (recommended for English &amp; Spanish — ~2&times; faster on CPU than Whisper small, near-zero silence hallucinations) and <strong>Whisper</strong> (other languages, translate-to-English, context prompts) plus a built-in OBS WebSocket/Browser Source overlay.",
      },
      {
        type: "list",
        items: [
          "<strong>Zero desktop data collection &amp; retention.</strong> Running 100% locally is the core benefit: audio and transcripts never leave your machine. Outbound traffic is strictly limited to on-demand SHA-256 model downloads, an optional 24-hour GitHub Releases update check (zero telemetry, toggleable in Settings &gt; Advanced), and an opt-in NVIDIA CUDA runtime download. Only the website uses Microsoft Clarity for web analytics.",
          "<strong>100% Native Rust pipeline.</strong> Rust handles audio capture (Windows WASAPI and Linux PipeWire/PulseAudio loopback + ALSA fallback), Silero VAD, optional RNNoise, and ONNX Runtime inference (int8 CPU / DirectML GPU) with zero Python.",
          "<strong>Built for OBS &amp; creators.</strong> Includes 7 live OBS themes (<code>default</code>, <code>karaoke</code>, <code>neon</code>, <code>minimal</code>, <code>bold</code>, <code>rgb</code>, <code>typewriter</code>), anti-burst <code>/overlay</code> reconnection, DaVinci Resolve-ready <code>.srt</code> / <code>.vtt</code> / <code>.jsonl</code> recording, Follow OpenCohost Language sync, and a dual-consent MCP server (<code>liveaudio-cli mcp</code>).",
        ],
      },
      {
        type: "heading",
        id: "system-requirements",
        text: "System requirements",
      },
      {
        type: "table",
        head: ["Component", "Requirement"],
        rows: [
          [
            "Operating system",
            "Windows 10/11 x64 (<code>.exe</code> NSIS installer) and Linux x86_64 (<code>.AppImage</code> / <code>.deb</code>). <strong>No macOS.</strong>",
          ],
          [
            "CPU / GPU",
            "<strong>GPU optional</strong> — Parakeet-TDT 0.6B v3 int8 runs smoothly on 4-thread CPU-only laptops (automatic CPU threads switch). DirectML (DirectX 12 GPU) and optional NVIDIA CUDA 12.8 (CTranslate2) are also supported.",
          ],
          ["RAM", "4 GB minimum, 8 GB+ recommended."],
          [
            "Disk",
            "250 MB for the app plus ~500 MB&ndash;1.5 GB per cached model; models are stored locally (Windows: <code>%LOCALAPPDATA%\\LiveAudio\\models\\onnx</code>).",
          ],
          [
            "Runtime",
            "100% native Rust and ONNX Runtime — zero Python runtime dependencies.",
          ],
          [
            "Outbound network",
            "On-demand SHA-256 model downloads, optional 24 h GitHub Releases update check (zero telemetry, toggleable), and opt-in CUDA runtime download. Audio and transcripts never leave your machine.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "models: sha-256 on-demand download",
        html: "No Python setup or virtual environment downloads are required. Parakeet-TDT and Whisper models download on demand (hardware-matched with automatic CPU fallback) and are SHA-256 verified before use; transcription runs 100% offline once models are cached.",
      },
      {
        type: "heading",
        id: "capture-and-platforms",
        text: "Capture and platforms",
      },
      {
        type: "prose",
        html: "LiveAudio captures from a <strong>physical microphone</strong> or <strong>system-audio loopback</strong> on both <strong>Windows</strong> (WASAPI loopback) and <strong>Linux</strong> (PipeWire/PulseAudio monitor capture with ALSA fallback).",
      },
      {
        type: "callout",
        flag: "linux packages",
        html: "Prebuilt Linux x86_64 packages ship as <code>.AppImage</code> and <code>.deb</code>. Signed in-app updates (Minisign Ed25519) work on Windows (NSIS) and Linux <code>.AppImage</code>; <code>.deb</code> users update via GitHub Releases.",
      },
      {
        type: "heading",
        id: "how-it-installs",
        text: "How it installs (native build)",
      },
      {
        type: "prose",
        html: `On Windows x64, use the official NSIS installer (<code>${WINDOWS_INSTALLER_FILENAME}</code>; VC++ runtime bundled). On Linux x86_64, use the <code>.AppImage</code> or <code>.deb</code> package from GitHub Releases. The app launches immediately with zero Python provisioning wait.`,
      },
      {
        type: "code",
        label: "native install flow",
        code: NATIVE_INSTALL_FLOW,
      },
      {
        type: "prose",
        html: "Before upgrading, back up your settings and sessions and consult the release notes on GitHub Releases.",
      },
      {
        type: "heading",
        id: "where-data-lives",
        text: "Where your data lives",
      },
      {
        type: "prose",
        html: "LiveAudio stores all configuration, models, and session transcripts strictly on your local disk:",
      },
      {
        type: "table",
        head: ["Location", "Content"],
        rows: [
          [
            "<code>%APPDATA%\\LiveAudio</code> (Windows) / XDG config (Linux)",
            "Settings (<code>config.json</code>) and <code>sessions/</code> (<code>.srt</code>, <code>.vtt</code>, <code>.jsonl</code>) — back these up before upgrading.",
          ],
          [
            "<code>%LOCALAPPDATA%\\LiveAudio</code> (Windows) / XDG data (Linux)",
            "Downloaded ONNX models (Parakeet &amp; Whisper) and the optional CUDA runtime. The uninstaller's &ldquo;delete app data&rdquo; option removes both folders (never during an update).",
          ],
        ],
      },
      {
        type: "heading",
        id: "hardware-detection",
        text: "Compute &amp; ASR engines",
      },
      {
        type: "prose",
        html: "LiveAudio runs both <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> and <strong>Whisper</strong> on ONNX Runtime (int8 on CPU, DirectML on DirectX 12 GPUs), with an optional NVIDIA CUDA CTranslate2 worker:",
      },
      {
        type: "list",
        items: [
          "<strong>NVIDIA Parakeet-TDT 0.6B v3 (recommended for EN/ES):</strong> Transducer architecture emits blank on silence/noise for near-zero hallucinations. Measured on <code>es_media</code>: 1390 ms on CPU int8 vs 2877 ms for Whisper <code>small</code> (~2&times; faster on CPU), and 501 ms on GPU DirectML (WER 0.189). Runs smoothly on 4-thread CPU-only laptops with the automatic CPU threads switch.",
          "<strong>Whisper (tiny / base / small / turbo):</strong> Available for additional languages, translate-to-English, and context prompts.",
          "<strong>Optional NVIDIA CUDA 12.8 (CTranslate2):</strong> Opt-in worker (<code>ct2-worker-v1.6.0</code>) validated against on-demand cuBLAS 12.8 / cuDNN 9 runtime libraries with a protocol-version guard and automatic fallback to ONNX Runtime.",
        ],
      },
      {
        type: "heading",
        id: "updates",
        text: "Stream-safe signed updates",
      },
      {
        type: "prose",
        html: `Signed in-app updates (Minisign Ed25519) work on Windows (NSIS) and Linux (<code>.AppImage</code>); <code>.deb</code> users update via <a href="${RELEASE_LATEST_URL}" target="_blank" rel="noopener noreferrer">GitHub Releases</a>. The optional 24-hour update check sends zero telemetry, can be turned off in <strong>Settings &gt; Advanced</strong>, and blocks updates while transcription is live or OBS is connected.`,
      },
    ],
  },

  getting_started: {
    slug: "getting_started",
    navLabel: "Getting Started",
    metaTitle: "LiveAudio docs — Getting Started",
    metaDescription:
      `Install and run LiveAudio ${LIVEAUDIO_TAG} on Windows x64 or Linux x86_64, pick NVIDIA Parakeet-TDT or Whisper, and configure profiles and sessions locally.`,
    eyebrow: "// docs / getting-started",
    h1: "Getting Started",
    lede:
      "Install the Windows NSIS installer or Linux .AppImage / .deb package. The 100% native Rust and Tauri 2 desktop app starts instantly with zero Python setup; chosen models download on demand and are SHA-256 verified.",
    blocks: [
      {
        type: "heading",
        id: "option-a-installer",
        text: "Option A — Prebuilt packages (recommended)",
      },
      {
        type: "prose",
        html: `Download the latest release from <a href="${RELEASE_LATEST_URL}" target="_blank" rel="noopener noreferrer">GitHub Releases</a>:`,
      },
      {
        type: "list",
        items: [
          `<strong>Windows x64:</strong> <code>${WINDOWS_INSTALLER_FILENAME}</code> (NSIS graphical installer, VC++ runtime bundled, Minisign signed in-app updater).`,
          "<strong>Linux x86_64:</strong> <code>.AppImage</code> (Minisign signed in-app updater) or <code>.deb</code> (update via GitHub Releases), both with PipeWire/PulseAudio loopback and ALSA fallback.",
          `<strong>CLI only:</strong> <code>${WINDOWS_CLI_FILENAME}</code> and <code>${LINUX_CLI_FILENAME}</code> contain the CLI (including <code>liveaudio-cli mcp</code>) and ASR worker, not the desktop app.`,
        ],
      },
      {
        type: "prose",
        html: "Zero Python dependencies are downloaded or installed. Models download locally on demand and are verified with SHA-256.",
      },
      {
        type: "callout",
        flag: "updates",
        html: `On v1.5.1 or older, install ${LIVEAUDIO_TAG} manually once: those versions have no signed in-app updater. From ${LIVEAUDIO_TAG}, Windows (NSIS) and Linux <code>.AppImage</code> support stream-safe Minisign Ed25519 updates (blocked while live or OBS is connected); Linux <code>.deb</code> users update from GitHub Releases.`,
      },
      {
        type: "heading",
        id: "option-b-source",
        text: "Option B — From source (developers)",
      },
      {
        type: "prose",
        html: "Developer path — clone the repo and follow the build instructions in the repository README (Rust toolchain + Tauri 2 prerequisites).",
      },
      {
        type: "code",
        label: "bash",
        code: SOURCE_CLONE_EN,
      },
      {
        type: "heading",
        id: "verify-install",
        text: "Verify the install",
      },
      {
        type: "prose",
        html: "Open the app — the header shows the live status (listening / VAD state) and the redesigned <strong>Advanced</strong> tab shows the active ASR engine (Parakeet-TDT or Whisper) and compute device (CPU, DirectML, or optional CUDA). Speak, and captions appear in the live subtitle feed and stream to OBS.",
      },
      {
        type: "heading",
        id: "updates-recovery",
        text: "Updates &amp; recovery",
      },
      {
        type: "prose",
        html: "Consult GitHub Releases for current installation guidance. Back up settings and sessions before upgrading or attempting recovery.",
      },
      {
        type: "heading",
        id: "gpu-auto-detect",
        text: "Compute options (CPU, DirectML, optional CUDA)",
      },
      {
        type: "prose",
        html: "With the <strong>automatic CPU threads</strong> switch enabled, Parakeet-TDT 0.6B v3 int8 runs smoothly on 4-thread CPU-only laptops without a GPU. On DirectX 12 GPUs, DirectML accelerates ONNX Runtime out of the box with automatic CPU fallback. For NVIDIA GPUs, an opt-in CTranslate2 CUDA 12.8 worker (cuBLAS 12.8 / cuDNN 9) is available with a protocol-version guard and automatic fallback to ONNX Runtime.",
      },
      {
        type: "heading",
        id: "profiles",
        text: "Profiles",
      },
      {
        type: "prose",
        html: "Profiles are FPS-aware presets. Editing a built-in profile turns it into <strong>Custom</strong>; changes only take effect after you click <strong>Save</strong>.",
      },
      {
        type: "table",
        head: ["Profile", "Recommended for"],
        rows: [
          ["<code>Fast</code>", "Lowest latency and short phrases."],
          ["<code>Balanced</code>", "Recommended for most sessions."],
          ["<code>Quality</code>", "Higher accuracy, more VRAM and latency."],
          [
            "<code>Stable Streaming</code>",
            "Reduces GPU load while gaming or streaming on a busy PC.",
          ],
        ],
      },
      {
        type: "heading",
        id: "blacklist",
        text: "Hallucination blacklist &amp; context prompt switches",
      },
      {
        type: "prose",
        html: "For EN/ES, switching to <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> eliminates almost all silence hallucinations because its transducer decoder emits blank on silence. When using Whisper, LiveAudio provides an upgraded <strong>whole-word edge-trimming Blacklist</strong> (plus dedicated switches for both the blacklist and context prompt in <strong>Advanced</strong>): blacklisted phrases are trimmed only at utterance edges so long sentences are never dropped. Default list:",
      },
      {
        type: "code",
        label: "config.json.example · blacklist",
        code: BLACKLIST_VERBATIM,
      },
      {
        type: "prose",
        html: "Words and phrases are comma-separated and fully editable from the <strong>Advanced</strong> tab (<strong>Vocabulary and filters</strong>).",
      },
      {
        type: "heading",
        id: "models",
        text: "Engines &amp; models",
      },
      {
        type: "prose",
        html: "Pick your ASR engine and model in the <strong>Advanced</strong> tab (<strong>Engine and performance</strong>). The audio device, language (including <strong>Follow OpenCohost Language</strong>), and profile live in <strong>Setup</strong>. Models download on demand with SHA-256 verification and hardware-matched CPU fallback.",
      },
      {
        type: "table",
        head: ["Engine / Model", "Best for", "Notes"],
        rows: [
          [
            "<code>Parakeet-TDT 0.6B v3</code>",
            "Recommended for EN &amp; ES",
            "ONNX Runtime (int8 CPU / DirectML GPU). ~2&times; faster on CPU than Whisper small, near-zero silence hallucinations, smooth on 4-thread laptops.",
          ],
          ["<code>Whisper tiny</code>", "Ultra-light fallback", "~150 MB; fastest Whisper tier."],
          ["<code>Whisper base</code>", "Light multilingual", "~300 MB; other languages &amp; translate-to-English."],
          ["<code>Whisper small</code>", "Balanced multilingual", "~480 MB; context prompts &amp; translate-to-English."],
          ["<code>Whisper turbo</code>", "High-accuracy multilingual", "~1.5 GB; best with DirectML or optional CUDA GPU."],
        ],
      },
      {
        type: "callout",
        flag: "on-demand sha-256 models",
        html: "On a metered connection, allow for model downloads when switching engines or sizes (and the optional CUDA runtime only if you opt in). Once cached, transcription runs 100% offline.",
      },
      {
        type: "heading",
        id: "session-files",
        text: "Session files (.srt, .vtt, .jsonl)",
      },
      {
        type: "prose",
        html: "Every session is saved locally to disk as structured JSONL (<code>transcript.jsonl</code>), WebVTT subtitles (<code>subtitles.vtt</code>), and DaVinci Resolve-ready SubRip subtitles (<code>subtitles.srt</code>):",
      },
      {
        type: "code",
        label: "sessions/",
        code: SESSION_TREE,
      },
    ],
  },

  websocket_obs: {
    slug: "websocket_obs",
    navLabel: "WebSocket & OBS",
    metaTitle: "LiveAudio docs — WebSocket & OBS",
    metaDescription:
      "The LiveAudio WebSocket: ws://127.0.0.1:8765, anti-burst /overlay reconnection, 7 live OBS themes, JSON payload schema, OBS backlog policy, and loopback Origin-allowlist security.",
    eyebrow: "// docs / websocket-obs",
    h1: "WebSocket & OBS",
    lede:
      "LiveAudio runs a local WebSocket server that broadcasts subtitle JSON in real time to the built-in OBS /overlay (7 live themes + anti-burst reconnection) or any HTML/WebSocket client on localhost.",
    blocks: [
      {
        type: "heading",
        id: "server-details",
        text: "Server details",
      },
      {
        type: "table",
        head: ["Parameter", "Value"],
        rows: [
          ["Protocol", "WebSocket (<code>ws://</code>)"],
          ["Host", "<code>127.0.0.1</code> (localhost only)"],
          [
            "Port",
            "<code>8765</code> by default, configurable via <code>ws_port</code>. If it is busy, the server tries the next ports up to <code>ws_port + 9</code> (<code>8765</code>&ndash;<code>8774</code> by default).",
          ],
          [
            "Effective port",
            "Announced in the first frame of every connection (<code>hello</code>) and shown in the app as the <code>WS: &lt;port&gt;</code> pill.",
          ],
          [
            "Overlay URL",
            "<code>http://127.0.0.1:&lt;port&gt;/overlay</code> — the OBS Browser Source URL. <code>ws://127.0.0.1:&lt;port&gt;</code> is the WebSocket endpoint, not what you paste into OBS.",
          ],
          ["Format", "JSON"],
          ["Auth", "None — loopback-only listener plus an Origin allowlist (see Security)"],
        ],
      },
      {
        type: "heading",
        id: "payload-schema",
        text: "JSON payload schema",
      },
      {
        type: "code",
        label: "subtitle.json",
        code: WS_PAYLOAD_EN,
      },
      {
        type: "table",
        head: ["Field", "Type", "Description"],
        rows: [
          [
            "<code>id</code>",
            "string",
            "Opaque per-session phrase identifier, such as <code>utt_42</code>. It restarts on each run and is not monotonic.",
          ],
          [
            "<code>text</code>",
            "string",
            "Transcribed text, after blacklist filtering.",
          ],
          [
            "<code>style</code>",
            "string",
            "Visual style: default, karaoke, neon, minimal, bold, rgb, typewriter.",
          ],
          [
            "<code>created_at</code>",
            "number",
            "Timestamp when the audio segment was created.",
          ],
          [
            "<code>processed_at</code>",
            "number",
            "Timestamp when transcription completed.",
          ],
          [
            "<code>queue_delay</code>",
            "number",
            "Seconds the audio waited before entering the ASR engine.",
          ],
          [
            "<code>total_delay</code>",
            "number",
            "Total delay from audio capture to a ready subtitle.",
          ],
          [
            "<code>latency</code>",
            "number",
            "Seconds the ASR engine (Parakeet-TDT or Whisper) spent transcribing the segment.",
          ],
          [
            "<code>is_replay</code>",
            "boolean",
            "Whether this is a backlog / catch-up subtitle.",
          ],
          [
            "<code>catchup_interval_sec</code>",
            "number",
            "Recommended pacing between backlog items in auto mode.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "timing",
        html: "<code>total_delay</code> and <code>latency</code> are measured in <strong>seconds</strong>. Actual latency depends on segmentation, model, hardware and load.",
      },
      {
        type: "prose",
        html: "The built-in OBS overlay consumes <code>text</code>, <code>style</code>, <code>is_replay</code>, <code>catchup_interval_sec</code>, <code>theme</code> frames and optional <code>subtitle_partial</code> frames. The remaining fields are metadata for diagnostics — useful if you build your own client, ignorable if you do not. Frames that carry a <code>type</code> field (<code>hello</code>, <code>theme</code>, <code>subtitle_partial</code>) are not captions.",
      },
      {
        type: "heading",
        id: "subtitle-styles",
        text: "Subtitle styles",
      },
      {
        type: "prose",
        html: "The <code>style</code> field selects one of seven built-in looks, switchable from the <strong>Style</strong> tab, which also holds presets and a live preview (the <strong>Subtitles</strong> tab holds the display mode: adaptive, single or ribbon):",
      },
      {
        type: "table",
        head: ["Style", "Look"],
        rows: [
          [
            "<code>default</code>",
            "White text on a semi-transparent black background, soft fade in/out.",
          ],
          [
            "<code>karaoke</code>",
            "Words appear staggered with a <code>popIn</code> animation; bright yellow with a black outline.",
          ],
          [
            "<code>neon</code>",
            "Cyan glow, uppercase, wide letter-spacing.",
          ],
          [
            "<code>minimal</code>",
            "No background, subtle fade — for streams with their own design.",
          ],
          [
            "<code>bold</code>",
            "High-contrast thick text, fast animation, strong on-screen presence.",
          ],
          [
            "<code>rgb</code>",
            "Each word takes a different rainbow color.",
          ],
          [
            "<code>typewriter</code>",
            "Words type in one at a time with a blinking cursor; monospaced.",
          ],
        ],
      },
      {
        type: "heading",
        id: "backlog-policy",
        text: "OBS backlog policy",
      },
      {
        type: "prose",
        html: "The backlog policy controls only what shows <strong>live in OBS</strong>. Everything valid is always saved to disk regardless of policy.",
      },
      {
        type: "table",
        head: ["Mode", "Config value", "Behavior"],
        rows: [
          [
            "Auto",
            "<code>auto</code>",
            "Sends fresh subtitles plus a short, paced backlog. Drops anything past the max delay.",
          ],
          [
            "Live only",
            "<code>live_only</code>",
            "Saves everything; shows only what is within <code>subtitle_max_live_delay_sec</code>.",
          ],
          [
            "Send all",
            "<code>send_all</code>",
            "Sends everything to OBS even when it arrives late.",
          ],
        ],
      },
      {
        type: "heading",
        id: "security",
        text: "Security",
      },
      {
        type: "list",
        items: [
          "Loopback only — the server binds <code>127.0.0.1</code> and drops peers that are not loopback.",
          "Origin rules — no <code>Origin</code> header (native apps, scripts) is accepted; several <code>Origin</code> headers get HTTP <code>403</code>. <code>http://absolute</code> (OBS Browser Source), <code>tauri.localhost</code>, and loopback origins on the server's bound port (the <code>/overlay</code> page) or on an allowlisted port are accepted; anything else gets <code>403</code>.",
          "Allowlist — add the port of any other local browser tool in <strong>Advanced &gt; Allowed local connections</strong> (default <code>[1420]</code>). The card also lists recent blocked attempts.",
          "Limits — at most 64 simultaneous connections, inbound messages up to 64 KiB, and a 5 s handshake timeout.",
          "No authentication — any local process that sends no <code>Origin</code> can read subtitles.",
          "Broadcast — multiple clients receive the same messages simultaneously.",
        ],
      },
      {
        type: "heading",
        id: "obs-setup",
        text: "OBS Browser Source setup",
      },
      {
        type: "list",
        items: [
          "In OBS, <strong>Sources &rarr; + &rarr; Browser</strong>.",
          "Start the system, then copy the overlay URL from LiveAudio (<strong>Copy URL</strong>; the base form is <code>http://127.0.0.1:8765/overlay</code>). Leave <strong>Local file</strong> unchecked in OBS and paste the URL. Set size <strong>1920&times;1080</strong>.",
          "Set <strong>FPS</strong> to <code>30</code> or <code>60</code>. Keep the source at the full canvas: the overlay positions the captions itself.",
          'Disable <strong>"Shut down source when not visible"</strong> and "Refresh browser when scene becomes active" — both can drop the WebSocket connection.',
          "While the system is running, the copied overlay URL includes the active WebSocket port. The server starts at <code>ws_port</code> (default <code>8765</code>) and may use an alternative up to <code>ws_port + 9</code>; copy the URL again if the port changes.",
        ],
      },
      {
        type: "heading",
        id: "reconnect-contract",
        text: "Connection behavior",
      },
      {
        type: "list",
        items: [
          "<strong>Anti-burst reconnect.</strong> The bundled <code>/overlay</code> page retries with exponential backoff from 1 s up to 8 s, rescans ports <code>ws_port</code> through <code>ws_port + 9</code>, and uses anti-burst reconnection so captions stay clean if OBS reconnects mid-stream. A custom client needs its own retry logic.",
          "<strong>Broadcast.</strong> Every connected client receives every message. Multiple clients (OBS plus a debug browser tab) all see the same stream, and a slow client does not block the others.",
          "<strong>Slow clients.</strong> Each client has a 64-frame outgoing queue and a 10-frame retry queue. When the retry queue is full the oldest frame is dropped; the client is not disconnected.",
        ],
      },
      {
        type: "heading",
        id: "test-client",
        text: "Build your own client",
      },
      {
        type: "prose",
        html: "Any localhost WebSocket client can subscribe to the same broadcast OBS reads. A minimal browser client. Serve it from a local HTTP server and add that server's port to <strong>Allowed local connections</strong>: a page opened from <code>file://</code> sends <code>Origin: null</code> and is rejected with <code>403</code>. It skips frames that have a <code>type</code> field and renders only caption frames:",
      },
      {
        type: "code",
        label: "client.html",
        code: WS_HTML_CLIENT,
      },
      {
        type: "prose",
        html: "Or a minimal Python client, to print every caption as it arrives (requires the <code>websockets</code> package; non-browser clients send no <code>Origin</code>, so no allowlist entry is needed):",
      },
      {
        type: "code",
        label: "ws_client.py",
        code: WS_PYTHON_CLIENT,
      },
      {
        type: "heading",
        id: "debug-signals",
        text: "Debug signals",
      },
      {
        type: "prose",
        html: "These signals tell you where a stalled overlay is stuck:",
      },
      {
        type: "table",
        head: ["Signal", "Meaning"],
        rows: [
          [
            "<code>WS: &lt;port&gt;</code> pill in the app",
            "The WebSocket server is running on that port, with the number of connected clients. Use this port if you build your own client. <code>WS: off</code> means the service is stopped.",
          ],
          [
            "Browser devtools (<strong>F12</strong>) on the overlay page",
            "Network &rarr; WS shows the frames the overlay receives; the Console shows its errors.",
          ],
          [
            "<code>Error parseando WebSocket</code> (console)",
            "A non-JSON message reached the overlay — the payload was not a valid frame.",
          ],
          [
            "HTTP <code>403</code> on the handshake",
            "The page's Origin is not allowed. Add its port in <strong>Allowed local connections</strong>; check <strong>Recent blocked attempts</strong>.",
          ],
        ],
      },
    ],
  },

  troubleshooting: {
    slug: "troubleshooting",
    navLabel: "Troubleshooting",
    metaTitle: "LiveAudio docs — Troubleshooting",
    metaDescription:
      "Fixes for common LiveAudio issues: no captions, Windows & Linux loopback, hallucinations (Parakeet-TDT vs Whisper), DirectML/CUDA fallback, OBS reconnection, SmartScreen, and local-first diagnostics.",
    eyebrow: "// docs / troubleshooting",
    h1: "Troubleshooting",
    lede:
      "Root-cause fixes for the most common setup issues — Windows WASAPI and Linux PipeWire/PulseAudio loopback, DirectML/CUDA fallback, silence hallucinations, OBS WebSocket reconnection, and local-first diagnostics.",
    blocks: [
      {
        type: "heading",
        id: "no-captions",
        text: "Captions are not appearing",
      },
      {
        type: "prose",
        html: "Verify the selected audio device in the <strong>Setup</strong> tab. System-audio loopback works on both <strong>Windows</strong> (WASAPI loopback) and <strong>Linux</strong> (PipeWire/PulseAudio monitor capture with ALSA fallback) — make sure you picked the active output monitor channel.",
      },
      {
        type: "callout",
        flag: "hallucinations",
        html: "If Whisper invents phrases during silence, switch to <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> for EN/ES (near-zero silence hallucinations) or enable the upgraded whole-word edge-trimming Blacklist switch in <strong>Advanced</strong>.",
      },
      {
        type: "heading",
        id: "cuda-oom",
        text: "GPU / CUDA error or out of memory",
      },
      {
        type: "prose",
        html: "If transcription fails with a GPU error or runs out of VRAM, switch to <strong>CPU</strong> (with Parakeet-TDT 0.6B v3 int8 and the automatic CPU threads switch) or <strong>DirectML</strong> in the <strong>Advanced</strong> tab, or pick a smaller Whisper model (<code>tiny</code> or <code>base</code>). The optional CTranslate2 CUDA 12.8 worker validates cuBLAS 12.8 / cuDNN 9 and falls back to ONNX Runtime automatically if CUDA initialization fails.",
      },
      {
        type: "heading",
        id: "upgrading-from-python",
        text: "Upgrading from the legacy Python version (v1.0.0–v1.2.7)",
      },
      {
        type: "prose",
        html: "Before upgrading a legacy installation, back up settings and sessions and consult the release notes.",
      },
      {
        type: "heading",
        id: "obs-not-connecting",
        text: "OBS does not connect",
      },
      {
        type: "prose",
        html: "Start the system first, then check the <code>WS: &lt;port&gt;</code> pill in the app: that is the effective port. If the base port was busy, LiveAudio used one of the next ports up to <code>ws_port + 9</code> (<code>8765</code>&ndash;<code>8774</code> by default); copy the overlay URL again. A <code>403</code> only affects browser origins other than OBS and the <code>/overlay</code> page: add the port of any other local browser tool in <strong>Advanced &gt; Allowed local connections</strong> and check <strong>Recent blocked attempts</strong>.",
      },
      {
        type: "heading",
        id: "legacy-process-still-running",
        text: "Installer reports a running copy",
      },
      {
        type: "prose",
        html: "Stop any transcription and close LiveAudio before upgrading. Back up settings and sessions first.",
      },
      {
        type: "heading",
        id: "audio-cuts-out",
        text: "Audio cuts out or long silences",
      },
      {
        type: "prose",
        html: "Increase the <strong>silence detection</strong> value (around <code>1.0&ndash;1.5 s</code>) so heavily paused phrases are not cut mid-sentence.",
      },
      {
        type: "heading",
        id: "smartscreen",
        text: "Windows SmartScreen warning",
      },
      {
        type: "callout",
        flag: "not code-signed",
        html: `The Windows installer is not code-signed yet, so SmartScreen may warn. Choose <strong>More info &rarr; Run anyway</strong>. Exact release files and SHA-256 hashes are published on <a href="${RELEASE_LATEST_URL}" target="_blank" rel="noopener noreferrer">GitHub Releases</a>.`,
      },
      {
        type: "heading",
        id: "install-recovery",
        text: "Install &amp; download recovery",
      },
      {
        type: "prose",
        html: "For installation problems, back up settings and sessions first, then consult the release notes and troubleshooting guidance:",
      },
      {
        type: "table",
        head: ["Problem", "What to do"],
        rows: [
          [
            "Interrupted model download",
            "Just relaunch the app. Downloaded models are cached, so only the missing pieces are fetched again.",
          ],
          [
            "Installer warns about a running copy",
            "Close every LiveAudio window (stop transcription first), then run the installer again.",
          ],
          [
            "Corrupted install",
            "Review the release notes before re-running the installer; back up settings and sessions first.",
          ],
          [
            "Coming from the Python version",
            "Before upgrading a legacy build, back up its settings and sessions.",
          ],
          [
            "Where are the logs?",
            "The in-app <strong>Event Log</strong> records the service lifecycle, config changes and diagnostics.",
          ],
        ],
      },
      {
        type: "heading",
        id: "diagnostics",
        text: "Local diagnostics",
      },
      {
        type: "prose",
        html: "LiveAudio ships local-first diagnostics — no telemetry is sent anywhere. Use them when OBS stops receiving subtitles, the ASR falls behind, or audio reconnects too often.",
      },
      {
        type: "list",
        items: [
          "<strong>How:</strong> reproduce the issue, click <strong>Diagnostics</strong> (<strong>Export Diagnostic Report</strong>, in the <strong>Files</strong> tab) in the app, then review the exported JSON (process states, queue sizes, audio/asr/ws states).",
          "<strong>Privacy:</strong> the export never includes raw audio or full transcripts, and it sanitizes secrets, tokens and sensitive paths.",
        ],
      },
      {
        type: "table",
        head: ["Key", "Value"],
        rows: [
          ["<code>diagnostics_enabled</code>", "true / false"],
          ["<code>diagnostics_level</code>", "minimal / deep"],
          ["<code>diagnostics_export_dir</code>", "path or null"],
        ],
      },
    ],
  },

  config: {
    slug: "config",
    navLabel: "Configuration",
    metaTitle: "LiveAudio docs — Configuration",
    metaDescription:
      "The LiveAudio config.json reference: file locations on Windows and Linux, Parakeet-TDT & Whisper keys, CPU/DirectML/CUDA compute options, edge-trimming blacklist, MCP switches, and full example.",
    eyebrow: "// docs / config",
    h1: "Configuration",
    lede:
      "LiveAudio writes a config.json with sensible defaults on first run. Change everything from the GUI (including the redesigned Advanced tab), or edit the file directly. This page is the key reference.",
    blocks: [
      {
        type: "heading",
        id: "file-location",
        text: "File location",
      },
      {
        type: "prose",
        html: "Settings and sessions are stored locally (<code>%APPDATA%\\LiveAudio</code> on Windows, XDG config on Linux). Back them up before upgrading.",
      },
      {
        type: "table",
        head: ["Build", "Path"],
        rows: [
          [`Windows x64 (${LIVEAUDIO_TAG}, Rust)`, "<code>%APPDATA%\\LiveAudio</code>"],
          [`Linux x86_64 (${LIVEAUDIO_TAG}, .AppImage / .deb)`, "<code>~/.config/LiveAudio</code> (XDG config)"],
          ["Any build (override)", "<code>LIVEAUDIO_HOME</code> environment variable"],
          ["Models (Windows)", "<code>%LOCALAPPDATA%\\LiveAudio\\models\\onnx</code>"],
        ],
      },
      {
        type: "callout",
        flag: "migration",
        html: "Before upgrading a legacy version, back up <code>config.json</code> and <code>sessions/</code> and consult the release notes.",
      },
      {
        type: "prose",
        html: "Use the official Windows installer or Linux .AppImage / .deb package; the CLI archives contain only the CLI and ASR worker, not the desktop app.",
      },
      {
        type: "heading",
        id: "options",
        text: "Options",
      },
      {
        type: "table",
        head: ["Key", "Type", "Description"],
        rows: [
          ["<code>output_dir</code>", "string", "Path to the sessions folder (<code>.srt</code>, <code>.vtt</code>, <code>.jsonl</code>)."],
          ["<code>device</code>", "string", '<code>"cpu"</code> (default), <code>"directml"</code> (DirectX 12 GPU), or optional <code>"cuda"</code> (CTranslate2 CUDA 12.8).'],
          [
            "<code>auto_cpu_threads</code>, <code>cpu_threads</code>",
            "boolean / number",
            "Automatic CPU threads switch (recommended for 4-thread CPU-only laptops) or explicit thread count for CPU inference.",
          ],
          [
            "<code>asr_engine</code>, <code>model_size</code>",
            "string",
            'Choose NVIDIA <code>parakeet-tdt-0.6b-v3</code> (recommended for EN/ES) or Whisper (<code>tiny</code>, <code>base</code>, <code>small</code>, <code>turbo</code>).',
          ],
          [
            "<code>blacklist</code>, <code>blacklist_enabled</code>",
            "string / boolean",
            "Comma-separated filter phrases with an enable switch. Whole-word matching trims phrases only at utterance edges so long sentences are not dropped.",
          ],
          [
            "<code>context_prompt_enabled</code>",
            "boolean",
            "Dedicated switch to enable or disable Whisper context prompts.",
          ],
          [
            "<code>follow_opencohost_language</code>",
            "boolean",
            'Opt-in "Follow OpenCohost Language" switch for automatic locale sync with OpenCohost.',
          ],
          [
            "<code>continuous_session</code>",
            "boolean",
            "Keeps the same session across restarts.",
          ],
          [
            "<code>subtitle_style</code>",
            "string",
            "default, karaoke, neon, minimal, bold, rgb, typewriter.",
          ],
          [
            "<code>subtitle_backlog_policy</code>",
            "string",
            '"auto", "live_only" or "send_all".',
          ],
          [
            "<code>subtitle_max_live_delay_sec</code>",
            "number",
            "Max delay before OBS hides backlog.",
          ],
          [
            "<code>subtitle_catchup_interval_sec</code>",
            "number",
            "Pacing between backlog items.",
          ],
          [
            "<code>silence_timeout</code>",
            "number",
            "Seconds of silence before cutting a segment (default: 0.5).",
          ],
          [
            "<code>max_chunk_duration</code>",
            "number",
            "Max seconds before forcing a cut (default: 3.0).",
          ],
          [
            "<code>audio_device</code>",
            "string | null",
            "Selected device, or null for the system default.",
          ],
          [
            "<code>selected_profile_id</code>",
            "string",
            '"fast", "balanced" (default), "quality" or "stable_streaming".',
          ],
          [
            "<code>profile_mode</code>",
            "string",
            '"preset" or "custom" — set to "custom" automatically when you edit a built-in profile.',
          ],
          [
            "<code>ws_port</code>",
            "number",
            "WebSocket server base port (default: 8765). The server may use up to <code>ws_port + 9</code> if it is busy.",
          ],
          [
            "<code>ws_allowed_loopback_ports</code>",
            "number[]",
            "Extra local ports whose browser pages may connect (default: [1420]). Managed in Advanced &gt; Allowed local connections.",
          ],
          [
            "<code>obs_enabled</code>",
            "boolean",
            "Enable or disable sending subtitles to OBS.",
          ],
          [
            "<code>whisper_context_prompt_en</code>",
            "string",
            "Optional initial-prompt context passed to Whisper for English (e.g. recurring names or jargon). Empty by default.",
          ],
          [
            "<code>whisper_context_prompt_es</code>",
            "string",
            "Same, for Spanish. Empty by default.",
          ],
          [
            "<code>asr_language</code>",
            "string",
            'Language code for Whisper (e.g. "en", "es"). Default: "es".',
          ],
          [
            "<code>settings_navigation_mode</code>",
            "string",
            'Settings UI layout — "tabs".',
          ],
          [
            "<code>diagnostics_enabled</code>",
            "boolean",
            "Enables local diagnostics instrumentation.",
          ],
          [
            "<code>rnnoise_enabled</code>",
            "boolean",
            "Local RNNoise noise suppression before voice detection (default: false; applies after a service restart).",
          ],
          [
            "<code>live_partial_subtitles_enabled</code>",
            "boolean",
            "Sends provisional <code>subtitle_partial</code> frames while a phrase is still being spoken (default: false; desktop app only; restart required).",
          ],
          [
            "<code>subtitle_display_mode</code>",
            "string",
            '"adaptive" (default), "single" or "ribbon".',
          ],
          [
            "<code>check_updates_enabled</code>",
            "boolean",
            "Checks GitHub Releases for updates automatically (default: true).",
          ],
          [
            "<code>mcp_style_enabled</code>, <code>mcp_system_enabled</code>",
            "boolean",
            "Opt-in switches that let a local AI agent change subtitle styles, or system settings, through <code>liveaudio-cli mcp</code> (default: false).",
          ],
        ],
      },
      {
        type: "heading",
        id: "example",
        text: "Example config.json",
      },
      {
        type: "code",
        label: "config.json",
        code: CONFIG_EXAMPLE_EN,
      },
      {
        type: "heading",
        id: "cli",
        text: "Command line",
      },
      {
        type: "prose",
        html: "<code>liveaudio-cli</code> (included in the installer and in the CLI archives) accepts these commands: <code>serve</code> / <code>--service</code> (headless daemon), <code>devices</code> (list audio inputs), <code>doctor</code> (environment and hardware diagnostics) and <code>mcp</code> (MCP server over stdio for AI agents). Options: <code>--port</code> / <code>-P</code> sets the WebSocket port and <code>--licenses</code> shows the bundled third-party notices. <code>mcp</code> only works after you enable the MCP switches in <strong>Advanced</strong> (OBS and integrations).",
      },
    ],
  },
};

/* ================================================================== */
/* SPANISH (neutral / professional — no Rioplatense slang)             */
/* ================================================================== */

const DOCS_ES: Record<DocSection, DocSectionContent> = {
  overview: {
    slug: "overview",
    navLabel: "Resumen",
    metaTitle: "Documentación de LiveAudio — Resumen",
    metaDescription:
      "Qué es LiveAudio y qué necesita: app de escritorio nativa en Rust, gratuita y de código abierto (MIT) para Windows y Linux impulsada por NVIDIA Parakeet-TDT y Whisper sobre ONNX Runtime sin recolección de datos en la app.",
    eyebrow: "// docs / resumen",
    h1: "Documentación de LiveAudio",
    lede:
      `LiveAudio es una app de escritorio gratuita y de código abierto (MIT) en Rust nativo + Tauri 2 para Windows x64 y Linux x86_64 que genera subtítulos en tiempo real 100% en tu equipo y los envía a OBS. ${LIVEAUDIO_TAG} combina NVIDIA Parakeet-TDT 0.6B v3 (recomendado para ES/EN) y Whisper sobre ONNX Runtime (CPU / DirectML) más CUDA opcional — con cero Python, sin clave API y sin recolección ni retención de datos en la app de escritorio.`,
    blocks: [
      {
        type: "heading",
        id: "que-es",
        text: "Qué es LiveAudio",
      },
      {
        type: "prose",
        html: "<strong>Plynte LiveAudio</strong> es una app de escritorio nativa en Rust precompilada para Windows y Linux con <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> ONNX (recomendado para español e inglés — ~2&times; más rápido en CPU que Whisper small, casi sin alucinaciones en silencio) y <strong>Whisper</strong> (otros idiomas, traducción al inglés y prompts de contexto) más un overlay WebSocket/Browser Source integrado para OBS.",
      },
      {
        type: "list",
        items: [
          "<strong>Cero recolección ni retención de datos en la app.</strong> Ejecutarse 100% en local es el beneficio principal: el audio y las transcripciones nunca salen de tu equipo. La red saliente se limita estrictamente a descargas bajo demanda de modelos verificados por SHA-256, comprobación opcional de GitHub Releases cada 24 h (cero telemetría, desactivable en Ajustes &gt; Avanzado) y descarga voluntaria de NVIDIA CUDA. Solo el sitio web usa Microsoft Clarity para analítica web.",
          "<strong>Pipeline 100% Rust nativo.</strong> Rust gestiona la captura de audio (loopback WASAPI en Windows y PipeWire/PulseAudio con respaldo ALSA en Linux), Silero VAD, RNNoise opcional e inferencia ONNX Runtime (CPU int8 / DirectML GPU) con cero Python.",
          "<strong>Diseñado para OBS y creadores.</strong> Incluye 7 temas en vivo para OBS (<code>default</code>, <code>karaoke</code>, <code>neon</code>, <code>minimal</code>, <code>bold</code>, <code>rgb</code>, <code>typewriter</code>), reconexión anti-ráfagas en <code>/overlay</code>, grabación <code>.srt</code> lista para DaVinci Resolve junto con <code>.vtt</code> y <code>.jsonl</code>, sincronización Seguir idioma de OpenCohost y servidor MCP de doble consentimiento (<code>liveaudio-cli mcp</code>).",
        ],
      },
      {
        type: "heading",
        id: "requisitos-del-sistema",
        text: "Requisitos del sistema",
      },
      {
        type: "table",
        head: ["Componente", "Requisito"],
        rows: [
          [
            "Sistema operativo",
            "Windows 10/11 x64 (instalador NSIS <code>.exe</code>) y Linux x86_64 (<code>.AppImage</code> / <code>.deb</code>). <strong>Sin macOS.</strong>",
          ],
          [
            "CPU / GPU",
            "<strong>GPU opcional</strong> — Parakeet-TDT 0.6B v3 int8 funciona con fluidez en portátiles de 4 hilos sin GPU (interruptor automático de hilos de CPU). También admite DirectML (GPU DirectX 12) y NVIDIA CUDA 12.8 opcional (CTranslate2).",
          ],
          ["RAM", "4 GB mínimo, 8 GB+ recomendados."],
          [
            "Disco",
            "250 MB para la app más ~500 MB&ndash;1.5 GB por modelo en caché; los modelos se guardan localmente (Windows: <code>%LOCALAPPDATA%\\LiveAudio\\models\\onnx</code>).",
          ],
          [
            "Runtime",
            "100% Rust nativo y ONNX Runtime — cero dependencias de Python.",
          ],
          [
            "Red saliente",
            "Descargas bajo demanda de modelos SHA-256, comprobación opcional cada 24 h en GitHub Releases (cero telemetría, desactivable) y descarga voluntaria de CUDA. El audio y las transcripciones nunca salen de tu equipo.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "modelos: descarga bajo demanda sha-256",
        html: "No se requieren descargas de Python ni entornos virtuales. Los modelos Parakeet-TDT y Whisper se descargan bajo demanda (adaptados al hardware con respaldo automático en CPU) y se verifican con SHA-256 antes de usarse; una vez en caché, la transcripción funciona 100% sin conexión.",
      },
      {
        type: "heading",
        id: "captura-y-plataformas",
        text: "Captura y plataformas",
      },
      {
        type: "prose",
        html: "LiveAudio captura desde un <strong>micrófono físico</strong> o mediante <strong>loopback de audio del sistema</strong> tanto en <strong>Windows</strong> (WASAPI loopback) como en <strong>Linux</strong> (captura de monitor PipeWire/PulseAudio con respaldo ALSA).",
      },
      {
        type: "callout",
        flag: "paquetes de linux",
        html: "Los paquetes precompilados para Linux x86_64 se distribuyen en <code>.AppImage</code> y <code>.deb</code>. Las actualizaciones firmadas dentro de la app (Minisign Ed25519) funcionan en Windows (NSIS) y Linux <code>.AppImage</code>; los usuarios de <code>.deb</code> actualizan desde GitHub Releases.",
      },
      {
        type: "heading",
        id: "como-se-instala",
        text: "Cómo se instala (build nativa)",
      },
      {
        type: "prose",
        html: `En Windows x64, usa el instalador oficial NSIS (<code>${WINDOWS_INSTALLER_FILENAME}</code>; runtime VC++ incluido). En Linux x86_64, usa el paquete <code>.AppImage</code> o <code>.deb</code> de GitHub Releases. La app arranca de inmediato sin aprovisionamiento de Python.`,
      },
      {
        type: "code",
        label: "native install flow",
        code: NATIVE_INSTALL_FLOW,
      },
      {
        type: "prose",
        html: "Antes de actualizar, respalda tu configuración y sesiones y consulta las notas del lanzamiento en GitHub Releases.",
      },
      {
        type: "heading",
        id: "donde-viven-tus-datos",
        text: "Dónde viven tus datos",
      },
      {
        type: "prose",
        html: "LiveAudio almacena toda la configuración, los modelos y las transcripciones de sesión exclusivamente en tu disco local:",
      },
      {
        type: "table",
        head: ["Ubicación", "Contenido"],
        rows: [
          [
            "<code>%APPDATA%\\LiveAudio</code> (Windows) / configuración XDG (Linux)",
            "Tu configuración (<code>config.json</code>) y <code>sessions/</code> (<code>.srt</code>, <code>.vtt</code>, <code>.jsonl</code>) — haz una copia de seguridad antes de actualizar.",
          ],
          [
            "<code>%LOCALAPPDATA%\\LiveAudio</code> (Windows) / datos XDG (Linux)",
            "Modelos ONNX descargados (Parakeet y Whisper) y el runtime CUDA opcional. La opción &ldquo;borrar datos de la app&rdquo; del desinstalador elimina ambas carpetas (nunca durante una actualización).",
          ],
        ],
      },
      {
        type: "heading",
        id: "deteccion-de-hardware",
        text: "Cómputo y motores ASR",
      },
      {
        type: "prose",
        html: "LiveAudio ejecuta tanto <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> como <strong>Whisper</strong> sobre ONNX Runtime (int8 en CPU, DirectML en GPUs DirectX 12), con un worker opcional NVIDIA CUDA sobre CTranslate2:",
      },
      {
        type: "list",
        items: [
          "<strong>NVIDIA Parakeet-TDT 0.6B v3 (recomendado para ES/EN):</strong> Su arquitectura transductora emite blanco en silencio o ruido para casi cero alucinaciones. Medido en <code>es_media</code>: 1390 ms en CPU int8 frente a 2877 ms de Whisper <code>small</code> (~2&times; más rápido en CPU), y 501 ms en GPU DirectML (WER 0.189). Corre con soltura en portátiles de 4 hilos sin GPU con el interruptor automático de hilos de CPU.",
          "<strong>Whisper (tiny / base / small / turbo):</strong> Disponible para otros idiomas, traducción al inglés y prompts de contexto.",
          "<strong>NVIDIA CUDA 12.8 opcional (CTranslate2):</strong> Worker voluntario (<code>ct2-worker-v1.6.0</code>) validado con bibliotecas cuBLAS 12.8 / cuDNN 9 bajo demanda, con verificación de versión de protocolo y respaldo automático a ONNX Runtime.",
        ],
      },
      {
        type: "heading",
        id: "actualizaciones",
        text: "Actualizaciones firmadas seguras en directo",
      },
      {
        type: "prose",
        html: `Las actualizaciones firmadas dentro de la app (Minisign Ed25519) funcionan en Windows (NSIS) y Linux (<code>.AppImage</code>); los usuarios de <code>.deb</code> actualizan desde <a href="${RELEASE_LATEST_URL}" target="_blank" rel="noopener noreferrer">GitHub Releases</a>. La comprobación opcional cada 24 h no envía telemetría, se puede desactivar en <strong>Ajustes &gt; Avanzado</strong> y bloquea actualizaciones mientras estás transcribiendo o OBS está conectado.`,
      },
    ],
  },

  getting_started: {
    slug: "getting_started",
    navLabel: "Primeros pasos",
    metaTitle: "Documentación de LiveAudio — Primeros pasos",
    metaDescription:
      `Instala y ejecuta LiveAudio ${LIVEAUDIO_TAG} en Windows x64 o Linux x86_64, elige NVIDIA Parakeet-TDT o Whisper y configura perfiles y sesiones en local.`,
    eyebrow: "// docs / primeros-pasos",
    h1: "Primeros pasos",
    lede:
      "Usa el instalador NSIS de Windows o el paquete .AppImage / .deb de Linux. La app nativa en Rust y Tauri 2 arranca de inmediato sin setup de Python; los modelos seleccionados se descargan bajo demanda con verificación SHA-256.",
    blocks: [
      {
        type: "heading",
        id: "opcion-a-instalador",
        text: "Opción A — Paquetes precompilados (recomendado)",
      },
      {
        type: "prose",
        html: `Descarga la última versión desde <a href="${RELEASE_LATEST_URL}" target="_blank" rel="noopener noreferrer">GitHub Releases</a>:`,
      },
      {
        type: "list",
        items: [
          `<strong>Windows x64:</strong> <code>${WINDOWS_INSTALLER_FILENAME}</code> (instalador gráfico NSIS, runtime VC++ incluido, actualizador firmado Minisign).`,
          "<strong>Linux x86_64:</strong> <code>.AppImage</code> (actualizador firmado Minisign) o <code>.deb</code> (actualizar vía GitHub Releases), ambos con loopback PipeWire/PulseAudio y respaldo ALSA.",
          `<strong>Solo CLI:</strong> <code>${WINDOWS_CLI_FILENAME}</code> y <code>${LINUX_CLI_FILENAME}</code> contienen la CLI (incluido <code>liveaudio-cli mcp</code>) y el worker ASR, no la app de escritorio.`,
        ],
      },
      {
        type: "prose",
        html: "No se descarga ni instala ninguna dependencia de Python. Los modelos se descargan localmente bajo demanda y se verifican mediante SHA-256.",
      },
      {
        type: "callout",
        flag: "actualizaciones",
        html: `Si estás en la v1.5.1 o anterior, instala ${LIVEAUDIO_TAG} manualmente una vez: esas versiones no incluyen el actualizador firmado. Desde ${LIVEAUDIO_TAG}, Windows (NSIS) y Linux <code>.AppImage</code> cuentan con actualizaciones seguras Minisign Ed25519 (bloqueadas mientras estás en directo o OBS está conectado); en Linux <code>.deb</code> se actualiza desde GitHub Releases.`,
      },
      {
        type: "heading",
        id: "opcion-b-codigo",
        text: "Opción B — Desde el código (desarrolladores)",
      },
      {
        type: "prose",
        html: "Camino de desarrollador — clona el repositorio y sigue las instrucciones de compilación del README (toolchain de Rust + prerrequisitos de Tauri 2).",
      },
      {
        type: "code",
        label: "bash",
        code: SOURCE_CLONE_ES,
      },
      {
        type: "heading",
        id: "verificar-instalacion",
        text: "Verificar la instalación",
      },
      {
        type: "prose",
        html: "Abre la app — la cabecera muestra el estado en vivo (escuchando / estado VAD) y la pestaña <strong>Avanzado</strong> rediseñada muestra el motor ASR activo (Parakeet-TDT o Whisper) y el dispositivo de cómputo (CPU, DirectML o CUDA opcional). Habla, y los subtítulos aparecen en el feed en vivo y se envían a OBS.",
      },
      {
        type: "heading",
        id: "actualizaciones-recuperacion",
        text: "Actualizaciones y recuperación",
      },
      {
        type: "prose",
        html: "Consulta GitHub Releases para conocer las instrucciones de instalación. Respalda la configuración y las sesiones antes de actualizar o intentar recuperar la instalación.",
      },
      {
        type: "heading",
        id: "deteccion-gpu",
        text: "Opciones de cómputo (CPU, DirectML, CUDA opcional)",
      },
      {
        type: "prose",
        html: "Con el interruptor de <strong>hilos de CPU automáticos</strong> activado, Parakeet-TDT 0.6B v3 int8 corre con fluidez en portátiles de 4 hilos sin GPU. En GPUs DirectX 12, DirectML acelera ONNX Runtime de inmediato con respaldo automático en CPU. Para GPUs NVIDIA, existe un worker voluntario CTranslate2 CUDA 12.8 (cuBLAS 12.8 / cuDNN 9) con verificación de protocolo y respaldo automático a ONNX Runtime.",
      },
      {
        type: "heading",
        id: "perfiles",
        text: "Perfiles",
      },
      {
        type: "prose",
        html: "Los perfiles son presets conscientes de los FPS. Editar un perfil integrado lo convierte en <strong>Personalizado</strong>; los cambios solo se activan al pulsar <strong>Guardar</strong>.",
      },
      {
        type: "table",
        head: ["Perfil", "Recomendado para"],
        rows: [
          ["<code>Fast</code>", "Menor latencia y frases cortas."],
          ["<code>Balanced</code>", "Recomendado para la mayoría de las sesiones."],
          ["<code>Quality</code>", "Más precisión, más VRAM y latencia."],
          [
            "<code>Stable Streaming</code>",
            "Reduce la carga de GPU al jugar o transmitir con la PC ocupada.",
          ],
        ],
      },
      {
        type: "heading",
        id: "blacklist",
        text: "Blacklist de alucinaciones y conmutadores",
      },
      {
        type: "prose",
        html: "Para español e inglés, cambiar a <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> elimina casi por completo las alucinaciones en silencio porque su decodificador transductor emite blanco. Al usar Whisper, LiveAudio incluye una <strong>Blacklist mejorada de coincidencia por palabra completa en los bordes</strong> (junto con interruptores dedicados para blacklist y prompt de contexto en <strong>Avanzado</strong>): recorta frases bloqueadas solo en los extremos sin descartar oraciones largas. Lista por defecto:",
      },
      {
        type: "code",
        label: "config.json.example · blacklist",
        code: BLACKLIST_VERBATIM,
      },
      {
        type: "prose",
        html: "Las palabras y frases se separan por comas y son totalmente editables desde la pestaña <strong>Avanzado</strong> (<strong>Vocabulario y filtros</strong>).",
      },
      {
        type: "heading",
        id: "modelos",
        text: "Motores y modelos",
      },
      {
        type: "prose",
        html: "Elige el motor ASR y el modelo en la pestaña <strong>Avanzado</strong> (<strong>Motor y rendimiento</strong>). El dispositivo de audio, el idioma (incluido <strong>Seguir idioma de OpenCohost</strong>) y el perfil están en <strong>Inicio</strong>. Los modelos se descargan bajo demanda con verificación SHA-256 y respaldo automático en CPU.",
      },
      {
        type: "table",
        head: ["Motor / Modelo", "Recomendado para", "Notas"],
        rows: [
          [
            "<code>Parakeet-TDT 0.6B v3</code>",
            "Recomendado para ES y EN",
            "ONNX Runtime (int8 CPU / DirectML GPU). ~2&times; más rápido en CPU que Whisper small, casi sin alucinaciones, fluido en equipos de 4 hilos.",
          ],
          ["<code>Whisper tiny</code>", "Respaldo ultraligero", "~150 MB; el nivel más rápido de Whisper."],
          ["<code>Whisper base</code>", "Multilingüe ligero", "~300 MB; otros idiomas y traducción al inglés."],
          ["<code>Whisper small</code>", "Multilingüe equilibrado", "~480 MB; prompts de contexto y traducción al inglés."],
          ["<code>Whisper turbo</code>", "Alta precisión multilingüe", "~1.5 GB; ideal con DirectML o GPU CUDA opcional."],
        ],
      },
      {
        type: "callout",
        flag: "modelos sha-256 bajo demanda",
        html: "En una conexión medida, ten en cuenta la descarga inicial al cambiar de motor o tamaño (y del runtime CUDA opcional solo si lo activas). Una vez en caché, la transcripción funciona 100% sin conexión.",
      },
      {
        type: "heading",
        id: "archivos-de-sesion",
        text: "Archivos de sesión (.srt, .vtt, .jsonl)",
      },
      {
        type: "prose",
        html: "Cada sesión se guarda localmente en disco como transcripción JSONL (<code>transcript.jsonl</code>), subtítulos WebVTT (<code>subtitles.vtt</code>) y subtítulos SubRip listos para DaVinci Resolve (<code>subtitles.srt</code>):",
      },
      {
        type: "code",
        label: "sessions/",
        code: SESSION_TREE,
      },
    ],
  },

  websocket_obs: {
    slug: "websocket_obs",
    navLabel: "WebSocket y OBS",
    metaTitle: "Documentación de LiveAudio — WebSocket y OBS",
    metaDescription:
      "El WebSocket de LiveAudio: ws://127.0.0.1:8765, reconexión anti-ráfagas en /overlay, 7 temas en vivo para OBS, esquema JSON, política de backlog y seguridad loopback con lista de orígenes permitidos.",
    eyebrow: "// docs / websocket-obs",
    h1: "WebSocket y OBS",
    lede:
      "LiveAudio levanta un servidor WebSocket local que emite subtítulos en JSON en tiempo real hacia el /overlay integrado para OBS (7 temas en vivo y reconexión anti-ráfagas) o cualquier cliente HTML/WebSocket en localhost.",
    blocks: [
      {
        type: "heading",
        id: "detalles-del-servidor",
        text: "Detalles del servidor",
      },
      {
        type: "table",
        head: ["Parámetro", "Valor"],
        rows: [
          ["Protocolo", "WebSocket (<code>ws://</code>)"],
          ["Host", "<code>127.0.0.1</code> (solo localhost)"],
          [
            "Puerto",
            "<code>8765</code> por defecto, configurable con <code>ws_port</code>. Si está ocupado, el servidor prueba los siguientes puertos hasta <code>ws_port + 9</code> (<code>8765</code>&ndash;<code>8774</code> por defecto).",
          ],
          [
            "Puerto efectivo",
            "Se anuncia en el primer frame de cada conexión (<code>hello</code>) y se muestra en la app como el indicador <code>WS: &lt;puerto&gt;</code>.",
          ],
          [
            "URL del overlay",
            "<code>http://127.0.0.1:&lt;puerto&gt;/overlay</code> — la URL de la fuente de navegador de OBS. <code>ws://127.0.0.1:&lt;puerto&gt;</code> es el endpoint WebSocket, no lo que se pega en OBS.",
          ],
          ["Formato", "JSON"],
          ["Autenticación", "Ninguna — listener solo loopback más una lista de orígenes permitidos (ver Seguridad)"],
        ],
      },
      {
        type: "heading",
        id: "esquema-del-payload",
        text: "Esquema del payload JSON",
      },
      {
        type: "code",
        label: "subtitle.json",
        code: WS_PAYLOAD_ES,
      },
      {
        type: "table",
        head: ["Campo", "Tipo", "Descripción"],
        rows: [
          [
            "<code>id</code>",
            "string",
            "Identificador opaco de la frase por sesión, como <code>utt_42</code>. Se reinicia en cada ejecución y no es monotónico.",
          ],
          [
            "<code>text</code>",
            "string",
            "Texto transcrito, luego del filtro de blacklist.",
          ],
          [
            "<code>style</code>",
            "string",
            "Estilo visual: default, karaoke, neon, minimal, bold, rgb, typewriter.",
          ],
          [
            "<code>created_at</code>",
            "number",
            "Timestamp de creación del segmento de audio.",
          ],
          [
            "<code>processed_at</code>",
            "number",
            "Timestamp al terminar la transcripción.",
          ],
          [
            "<code>queue_delay</code>",
            "number",
            "Segundos que el audio esperó antes de entrar al motor ASR.",
          ],
          [
            "<code>total_delay</code>",
            "number",
            "Atraso total desde la captura hasta el subtítulo listo.",
          ],
          [
            "<code>latency</code>",
            "number",
            "Segundos que el motor ASR (Parakeet-TDT o Whisper) usó para transcribir el segmento.",
          ],
          [
            "<code>is_replay</code>",
            "boolean",
            "Si es un subtítulo de backlog / catch-up.",
          ],
          [
            "<code>catchup_interval_sec</code>",
            "number",
            "Espaciado recomendado entre ítems de backlog en modo auto.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "timing",
        html: "<code>total_delay</code> y <code>latency</code> se miden en <strong>segundos</strong>. La latencia depende de la segmentación, el modelo, el hardware y la carga.",
      },
      {
        type: "prose",
        html: "El overlay de OBS integrado consume <code>text</code>, <code>style</code>, <code>is_replay</code>, <code>catchup_interval_sec</code>, los frames <code>theme</code> y los frames opcionales <code>subtitle_partial</code>. Los demás campos son metadata para diagnóstico — útiles si construyes tu propio cliente, ignorables si no. Los frames con un campo <code>type</code> (<code>hello</code>, <code>theme</code>, <code>subtitle_partial</code>) no son subtítulos.",
      },
      {
        type: "heading",
        id: "estilos-de-subtitulos",
        text: "Estilos de subtítulos",
      },
      {
        type: "prose",
        html: "El campo <code>style</code> selecciona uno de siete looks integrados, conmutables desde la pestaña <strong>Estilo</strong>, que también incluye presets y vista previa en vivo (la pestaña <strong>Subtítulos</strong> contiene el modo de visualización: adaptativo, línea única o cinta):",
      },
      {
        type: "table",
        head: ["Estilo", "Aspecto"],
        rows: [
          [
            "<code>default</code>",
            "Texto blanco sobre fondo negro semitransparente, fade suave de entrada/salida.",
          ],
          [
            "<code>karaoke</code>",
            "Las palabras aparecen escalonadas con animación <code>popIn</code>; amarillo brillante con contorno negro.",
          ],
          [
            "<code>neon</code>",
            "Glow cian, mayúsculas, espaciado amplio.",
          ],
          [
            "<code>minimal</code>",
            "Sin fondo, fade sutil — para streams con diseño propio.",
          ],
          [
            "<code>bold</code>",
            "Texto grueso de alto contraste, animación rápida, presencia fuerte en pantalla.",
          ],
          [
            "<code>rgb</code>",
            "Cada palabra toma un color distinto del arcoíris.",
          ],
          [
            "<code>typewriter</code>",
            "Las palabras se escriben una por una con cursor parpadeante; monoespaciado.",
          ],
        ],
      },
      {
        type: "heading",
        id: "politica-de-backlog",
        text: "Política de backlog en OBS",
      },
      {
        type: "prose",
        html: "La política de backlog controla solo lo que se muestra <strong>en vivo en OBS</strong>. Todo lo válido siempre se guarda en disco, sin importar la política.",
      },
      {
        type: "table",
        head: ["Modo", "Valor de config", "Comportamiento"],
        rows: [
          [
            "Auto",
            "<code>auto</code>",
            "Envía subtítulos frescos más un backlog corto espaciado. Omite lo que supere el atraso máximo.",
          ],
          [
            "Solo en vivo",
            "<code>live_only</code>",
            "Guarda todo; solo muestra lo que está dentro de <code>subtitle_max_live_delay_sec</code>.",
          ],
          [
            "Enviar todo",
            "<code>send_all</code>",
            "Envía todo a OBS aunque llegue tarde.",
          ],
        ],
      },
      {
        type: "heading",
        id: "seguridad",
        text: "Seguridad",
      },
      {
        type: "list",
        items: [
          "Solo loopback — el servidor escucha en <code>127.0.0.1</code> y descarta los pares que no sean loopback.",
          "Reglas de Origin — sin cabecera <code>Origin</code> (apps nativas, scripts) se acepta; varias cabeceras <code>Origin</code> reciben HTTP <code>403</code>. Se aceptan <code>http://absolute</code> (fuente de navegador de OBS), <code>tauri.localhost</code> y orígenes loopback en el puerto del servidor (la página <code>/overlay</code>) o en un puerto permitido; cualquier otro recibe <code>403</code>.",
          "Lista permitida — agrega el puerto de cualquier otra herramienta de navegador local en <strong>Avanzado &gt; Conexiones locales permitidas</strong> (por defecto <code>[1420]</code>). La tarjeta también muestra los intentos bloqueados recientes.",
          "Límites — máximo 64 conexiones simultáneas, mensajes entrantes de hasta 64 KiB y 5 s de tiempo para el handshake.",
          "Sin autenticación — cualquier proceso local que no envíe <code>Origin</code> puede leer los subtítulos.",
          "Broadcast — múltiples clientes reciben los mismos mensajes a la vez.",
        ],
      },
      {
        type: "heading",
        id: "configurar-obs",
        text: "Configurar el Browser Source de OBS",
      },
      {
        type: "list",
        items: [
          "En OBS, <strong>Fuentes &rarr; + &rarr; Navegador</strong>.",
          "Inicia el sistema y después copia la URL del overlay desde LiveAudio (<strong>Copiar URL</strong>; la forma base es <code>http://127.0.0.1:8765/overlay</code>). Deja <strong>Archivo local</strong> desmarcado en OBS y pega la URL. Tamaño <strong>1920&times;1080</strong>.",
          "Pon los <strong>FPS</strong> en <code>30</code> o <code>60</code>. Deja la fuente en el lienzo completo: el overlay posiciona los subtítulos por sí mismo.",
          'Desactiva <strong>"Apagar la fuente cuando no esté visible"</strong> y "Actualizar el navegador cuando la escena se active" — ambas pueden cortar la conexión WebSocket.',
          "Mientras el sistema está iniciado, la URL copiada del overlay incluye el puerto WebSocket activo. El servidor comienza en <code>ws_port</code> (por defecto <code>8765</code>) y puede usar una alternativa hasta <code>ws_port + 9</code>; copia de nuevo la URL si cambia el puerto.",
        ],
      },
      {
        type: "heading",
        id: "comportamiento-de-conexion",
        text: "Comportamiento de la conexión",
      },
      {
        type: "list",
        items: [
          "<strong>Reconexión anti-ráfagas.</strong> La página integrada <code>/overlay</code> reintenta con espera exponencial de 1 s hasta 8 s, recorre los puertos <code>ws_port</code> a <code>ws_port + 9</code> y usa reconexión anti-ráfagas para mantener limpios los subtítulos si OBS reconecta en pleno directo. Un cliente propio necesita su propia lógica de reintento.",
          "<strong>Broadcast.</strong> Cada cliente conectado recibe cada mensaje. Varios clientes (OBS más una pestaña de depuración) ven el mismo flujo, y un cliente lento no bloquea a los demás.",
          "<strong>Clientes lentos.</strong> Cada cliente tiene una cola de salida de 64 frames y una cola de reintento de 10 frames. Cuando la cola de reintento se llena se descarta el frame más antiguo; el cliente no se desconecta.",
        ],
      },
      {
        type: "heading",
        id: "cliente-de-prueba",
        text: "Construir tu propio cliente",
      },
      {
        type: "prose",
        html: "Cualquier cliente WebSocket en localhost puede suscribirse a la misma transmisión que lee OBS. Un cliente mínimo en navegador. Sírvelo desde un servidor HTTP local y agrega el puerto de ese servidor en <strong>Conexiones locales permitidas</strong>: una página abierta desde <code>file://</code> envía <code>Origin: null</code> y se rechaza con <code>403</code>. Omite los frames con campo <code>type</code> y solo muestra frames de subtítulo:",
      },
      {
        type: "code",
        label: "client.html",
        code: WS_HTML_CLIENT,
      },
      {
        type: "prose",
        html: "O un cliente mínimo en Python, para imprimir cada subtítulo a medida que llega (requiere el paquete <code>websockets</code>; los clientes que no son de navegador no envían <code>Origin</code>, así que no necesitan entrada en la lista):",
      },
      {
        type: "code",
        label: "ws_client.py",
        code: WS_PYTHON_CLIENT,
      },
      {
        type: "heading",
        id: "senales-de-depuracion",
        text: "Señales de depuración",
      },
      {
        type: "prose",
        html: "Estas señales indican dónde se traba un overlay que no muestra nada:",
      },
      {
        type: "table",
        head: ["Señal", "Significado"],
        rows: [
          [
            "Indicador <code>WS: &lt;puerto&gt;</code> en la app",
            "El servidor WebSocket está activo en ese puerto, con el número de clientes conectados. Usa ese puerto si construyes tu propio cliente. <code>WS: apagado</code> significa que el servicio está detenido.",
          ],
          [
            "Herramientas de desarrollo del navegador (<strong>F12</strong>) en la página del overlay",
            "Red &rarr; WS muestra los frames que recibe el overlay; la Consola muestra sus errores.",
          ],
          [
            "<code>Error parseando WebSocket</code> (consola)",
            "Llegó al overlay un mensaje que no es JSON — el payload no era un frame válido.",
          ],
          [
            "HTTP <code>403</code> en el handshake",
            "El Origin de la página no está permitido. Agrega su puerto en <strong>Conexiones locales permitidas</strong>; revisa <strong>Intentos bloqueados recientes</strong>.",
          ],
        ],
      },
    ],
  },

  troubleshooting: {
    slug: "troubleshooting",
    navLabel: "Solución de problemas",
    metaTitle: "Documentación de LiveAudio — Solución de problemas",
    metaDescription:
      "Soluciones a problemas comunes de LiveAudio: sin subtítulos, loopback en Windows y Linux, alucinaciones (Parakeet-TDT vs Whisper), respaldo DirectML/CUDA, reconexión de OBS, SmartScreen y diagnóstico local.",
    eyebrow: "// docs / solución-de-problemas",
    h1: "Solución de problemas",
    lede:
      "Soluciones de raíz para los problemas de configuración más comunes — loopback WASAPI en Windows y PipeWire/PulseAudio en Linux, respaldo DirectML/CUDA, alucinaciones en silencio, reconexión WebSocket en OBS y diagnóstico local.",
    blocks: [
      {
        type: "heading",
        id: "sin-subtitulos",
        text: "No aparecen subtítulos",
      },
      {
        type: "prose",
        html: "Verifica el dispositivo de audio seleccionado en la pestaña <strong>Inicio</strong>. El loopback de audio del sistema funciona tanto en <strong>Windows</strong> (WASAPI loopback) como en <strong>Linux</strong> (captura de monitor PipeWire/PulseAudio con respaldo ALSA) — comprueba que seleccionaste el canal monitor activo.",
      },
      {
        type: "callout",
        flag: "alucinaciones",
        html: "Si Whisper inventa frases durante el silencio, cambia a <strong>NVIDIA Parakeet-TDT 0.6B v3</strong> para español e inglés (casi sin alucinaciones en silencio) o activa el interruptor de la Blacklist mejorada de recorte por bordes en <strong>Avanzado</strong>.",
      },
      {
        type: "heading",
        id: "cuda-sin-memoria",
        text: "Error de GPU / CUDA o sin memoria",
      },
      {
        type: "prose",
        html: "Si la transcripción falla con un error de GPU o se queda sin VRAM, cambia a <strong>CPU</strong> (con Parakeet-TDT 0.6B v3 int8 y el interruptor de hilos de CPU automáticos) o a <strong>DirectML</strong> en la pestaña <strong>Avanzado</strong>, o elige un modelo Whisper más ligero (<code>tiny</code> o <code>base</code>). El worker opcional CTranslate2 CUDA 12.8 valida cuBLAS 12.8 / cuDNN 9 y vuelve automáticamente a ONNX Runtime si CUDA falla.",
      },
      {
        type: "heading",
        id: "actualizar-desde-python",
        text: "Actualizar desde la versión Python heredada (v1.0.0–v1.2.7)",
      },
      {
        type: "prose",
        html: "Antes de actualizar una instalación heredada, respalda la configuración y las sesiones y consulta las notas de la versión.",
      },
      {
        type: "heading",
        id: "obs-no-conecta",
        text: "OBS no conecta",
      },
      {
        type: "prose",
        html: "Inicia primero el sistema y revisa el indicador <code>WS: &lt;puerto&gt;</code> de la app: ese es el puerto efectivo. Si el puerto base estaba ocupado, LiveAudio usó uno de los siguientes hasta <code>ws_port + 9</code> (<code>8765</code>&ndash;<code>8774</code> por defecto); copia de nuevo la URL del overlay. Un <code>403</code> solo afecta a orígenes de navegador distintos de OBS y de la página <code>/overlay</code>: agrega el puerto de cualquier otra herramienta de navegador local en <strong>Avanzado &gt; Conexiones locales permitidas</strong> y revisa <strong>Intentos bloqueados recientes</strong>.",
      },
      {
        type: "heading",
        id: "instalador-informa-copia-en-ejecucion",
        text: "El instalador informa una copia en ejecución",
      },
      {
        type: "prose",
        html: "Detén cualquier transcripción y cierra LiveAudio antes de actualizar. Respalda primero la configuración y las sesiones.",
      },
      {
        type: "heading",
        id: "audio-se-corta",
        text: "El audio se corta o hay silencios largos",
      },
      {
        type: "prose",
        html: "Aumenta el valor de <strong>detección de silencio</strong> (alrededor de <code>1.0&ndash;1.5 s</code>) para que no corte frases con pausas largas a mitad de oración.",
      },
      {
        type: "heading",
        id: "smartscreen",
        text: "Aviso de Windows SmartScreen",
      },
      {
        type: "callout",
        flag: "sin firma de código",
        html: `El instalador de Windows aún no cuenta con firma comercial, así que SmartScreen puede avisar. Elige <strong>Más información &rarr; Ejecutar de todas formas</strong>. Los archivos exactos y sus hashes SHA-256 están publicados en <a href="${RELEASE_LATEST_URL}" target="_blank" rel="noopener noreferrer">GitHub Releases</a>.`,
      },
      {
        type: "heading",
        id: "recuperacion-de-instalacion",
        text: "Recuperación de instalación y descargas",
      },
      {
        type: "prose",
        html: "Ante problemas de instalación, respalda primero la configuración y las sesiones y consulta las notas de la versión y la guía de resolución de problemas:",
      },
      {
        type: "table",
        head: ["Problema", "Qué hacer"],
        rows: [
          [
            "Descarga de modelos interrumpida",
            "Simplemente vuelve a abrir la app. Los modelos descargados quedan en caché, así que solo se baja lo que falte.",
          ],
          [
            "El instalador avisa de una copia en ejecución",
            "Cierra todas las ventanas de LiveAudio (detén la transcripción primero) y vuelve a ejecutar el instalador.",
          ],
          [
            "Instalación corrupta",
            "Consulta las notas de la versión antes de volver a ejecutar el instalador; respalda primero la configuración y las sesiones.",
          ],
          [
            "Vienes de la versión Python",
            "Antes de actualizar una versión heredada, respalda su configuración y sesiones.",
          ],
          [
            "¿Dónde están los logs?",
            "El <strong>Registro de Eventos</strong> dentro de la app registra el ciclo de vida del servicio, los cambios de configuración y el diagnóstico.",
          ],
        ],
      },
      {
        type: "heading",
        id: "diagnostico",
        text: "Diagnóstico local",
      },
      {
        type: "prose",
        html: "LiveAudio incluye diagnóstico local-first — no envía telemetría a ningún lado. Úsalo cuando OBS deja de recibir subtítulos, el ASR se atrasa o el audio reconecta demasiado seguido.",
      },
      {
        type: "list",
        items: [
          "<strong>Cómo:</strong> reproduce el problema, pulsa <strong>Diagnóstico</strong> (<strong>Exportar Reporte Diagnóstico</strong>, en la pestaña <strong>Archivos</strong>) en la app y revisa el JSON exportado (estados de procesos, tamaños de colas, estados audio/asr/ws).",
          "<strong>Privacidad:</strong> la exportación nunca incluye audio crudo ni transcripciones completas, y sanitiza secrets, tokens y rutas sensibles.",
        ],
      },
      {
        type: "table",
        head: ["Clave", "Valor"],
        rows: [
          ["<code>diagnostics_enabled</code>", "true / false"],
          ["<code>diagnostics_level</code>", "minimal / deep"],
          ["<code>diagnostics_export_dir</code>", "ruta o null"],
        ],
      },
    ],
  },

  config: {
    slug: "config",
    navLabel: "Configuración",
    metaTitle: "Documentación de LiveAudio — Configuración",
    metaDescription:
      "Referencia de config.json de LiveAudio: ubicaciones en Windows y Linux, claves para Parakeet-TDT y Whisper, opciones de cómputo CPU/DirectML/CUDA, blacklist por bordes, interruptores MCP y ejemplo completo.",
    eyebrow: "// docs / configuración",
    h1: "Configuración",
    lede:
      "LiveAudio escribe un config.json con valores por defecto sensatos en la primera ejecución. Cambia todo desde la GUI (incluida la pestaña Avanzado rediseñada) o edita el archivo directamente. Esta página es la referencia de claves.",
    blocks: [
      {
        type: "heading",
        id: "ubicacion-del-archivo",
        text: "Ubicación del archivo",
      },
      {
        type: "prose",
        html: "La configuración y las sesiones se guardan en local (<code>%APPDATA%\\LiveAudio</code> en Windows, configuración XDG en Linux). Haz una copia de seguridad antes de actualizar.",
      },
      {
        type: "table",
        head: ["Build", "Ruta"],
        rows: [
          [`Windows x64 (${LIVEAUDIO_TAG}, Rust)`, "<code>%APPDATA%\\LiveAudio</code>"],
          [`Linux x86_64 (${LIVEAUDIO_TAG}, .AppImage / .deb)`, "<code>~/.config/LiveAudio</code> (configuración XDG)"],
          ["Cualquier build (override)", "variable de entorno <code>LIVEAUDIO_HOME</code>"],
          ["Modelos (Windows)", "<code>%LOCALAPPDATA%\\LiveAudio\\models\\onnx</code>"],
        ],
      },
      {
        type: "callout",
        flag: "migración",
        html: "Antes de actualizar una versión heredada, respalda <code>config.json</code> y <code>sessions/</code> y consulta las notas de la versión.",
      },
      {
        type: "prose",
        html: "Usa el instalador oficial de Windows o el paquete .AppImage / .deb de Linux; los archivos CLI solo contienen la CLI y el worker ASR, no la app de escritorio.",
      },
      {
        type: "heading",
        id: "opciones",
        text: "Opciones",
      },
      {
        type: "table",
        head: ["Clave", "Tipo", "Descripción"],
        rows: [
          ["<code>output_dir</code>", "string", "Ruta a la carpeta de sesiones (<code>.srt</code>, <code>.vtt</code>, <code>.jsonl</code>)."],
          ["<code>device</code>", "string", '<code>"cpu"</code> (por defecto), <code>"directml"</code> (GPU DirectX 12) o <code>"cuda"</code> opcional (CTranslate2 CUDA 12.8).'],
          [
            "<code>auto_cpu_threads</code>, <code>cpu_threads</code>",
            "boolean / number",
            "Interruptor de hilos de CPU automáticos (recomendado en portátiles de 4 hilos sin GPU) o número manual de hilos.",
          ],
          [
            "<code>asr_engine</code>, <code>model_size</code>",
            "string",
            'Elige NVIDIA <code>parakeet-tdt-0.6b-v3</code> (recomendado para ES/EN) o Whisper (<code>tiny</code>, <code>base</code>, <code>small</code>, <code>turbo</code>).',
          ],
          [
            "<code>blacklist</code>, <code>blacklist_enabled</code>",
            "string / boolean",
            "Frases de filtro separadas por coma con interruptor propio. La coincidencia por palabra completa recorta solo en los extremos sin descartar oraciones largas.",
          ],
          [
            "<code>context_prompt_enabled</code>",
            "boolean",
            "Interruptor dedicado para activar o desactivar los prompts de contexto de Whisper.",
          ],
          [
            "<code>follow_opencohost_language</code>",
            "boolean",
            'Interruptor voluntario "Seguir idioma de OpenCohost" para sincronizar automáticamente el idioma con OpenCohost.',
          ],
          [
            "<code>continuous_session</code>",
            "boolean",
            "Mantiene la misma sesión entre reinicios.",
          ],
          [
            "<code>subtitle_style</code>",
            "string",
            "default, karaoke, neon, minimal, bold, rgb, typewriter.",
          ],
          [
            "<code>subtitle_backlog_policy</code>",
            "string",
            '"auto", "live_only" o "send_all".',
          ],
          [
            "<code>subtitle_max_live_delay_sec</code>",
            "number",
            "Atraso máximo antes de que OBS oculte el backlog.",
          ],
          [
            "<code>subtitle_catchup_interval_sec</code>",
            "number",
            "Espaciado entre ítems de backlog.",
          ],
          [
            "<code>silence_timeout</code>",
            "number",
            "Segundos de silencio antes de cortar un segmento (por defecto: 0.5).",
          ],
          [
            "<code>max_chunk_duration</code>",
            "number",
            "Segundos máximos antes de forzar el corte (por defecto: 3.0).",
          ],
          [
            "<code>audio_device</code>",
            "string | null",
            "Dispositivo seleccionado, o null para el default del sistema.",
          ],
          [
            "<code>selected_profile_id</code>",
            "string",
            '"fast", "balanced" (por defecto), "quality" o "stable_streaming".',
          ],
          [
            "<code>profile_mode</code>",
            "string",
            '"preset" o "custom" — pasa a "custom" automáticamente cuando editas un perfil integrado.',
          ],
          [
            "<code>ws_port</code>",
            "number",
            "Puerto base del servidor WebSocket (por defecto: 8765). El servidor puede usar hasta <code>ws_port + 9</code> si está ocupado.",
          ],
          [
            "<code>ws_allowed_loopback_ports</code>",
            "number[]",
            "Puertos locales adicionales cuyas páginas de navegador pueden conectarse (por defecto: [1420]). Se gestiona en Avanzado &gt; Conexiones locales permitidas.",
          ],
          [
            "<code>obs_enabled</code>",
            "boolean",
            "Habilita o deshabilita el envío de subtítulos a OBS.",
          ],
          [
            "<code>whisper_context_prompt_en</code>",
            "string",
            "Contexto de prompt inicial opcional pasado a Whisper para inglés (p. ej. nombres o jerga recurrentes). Vacío por defecto.",
          ],
          [
            "<code>whisper_context_prompt_es</code>",
            "string",
            "Lo mismo, para español. Vacío por defecto.",
          ],
          [
            "<code>asr_language</code>",
            "string",
            'Código de idioma para Whisper (ej. "en", "es"). Por defecto: "es".',
          ],
          [
            "<code>settings_navigation_mode</code>",
            "string",
            'Layout de la UI de ajustes — "tabs".',
          ],
          [
            "<code>diagnostics_enabled</code>",
            "boolean",
            "Activa la instrumentación de diagnóstico local.",
          ],
          [
            "<code>rnnoise_enabled</code>",
            "boolean",
            "Supresión de ruido local RNNoise antes de la detección de voz (por defecto: false; se aplica al reiniciar el servicio).",
          ],
          [
            "<code>live_partial_subtitles_enabled</code>",
            "boolean",
            "Envía frames provisionales <code>subtitle_partial</code> mientras una frase aún se está diciendo (por defecto: false; solo app de escritorio; requiere reinicio).",
          ],
          [
            "<code>subtitle_display_mode</code>",
            "string",
            '"adaptive" (por defecto), "single" o "ribbon".',
          ],
          [
            "<code>check_updates_enabled</code>",
            "boolean",
            "Busca actualizaciones en GitHub Releases automáticamente (por defecto: true).",
          ],
          [
            "<code>mcp_style_enabled</code>, <code>mcp_system_enabled</code>",
            "boolean",
            "Interruptores opt-in que permiten a un agente de IA local cambiar los estilos de subtítulos, o los ajustes del sistema, mediante <code>liveaudio-cli mcp</code> (por defecto: false).",
          ],
        ],
      },
      {
        type: "heading",
        id: "ejemplo",
        text: "Ejemplo de config.json",
      },
      {
        type: "code",
        label: "config.json",
        code: CONFIG_EXAMPLE_ES,
      },
      {
        type: "heading",
        id: "linea-de-comandos",
        text: "Línea de comandos",
      },
      {
        type: "prose",
        html: "<code>liveaudio-cli</code> (incluido en el instalador y en los archivos CLI) acepta estos comandos: <code>serve</code> / <code>--service</code> (daemon sin interfaz), <code>devices</code> (lista las entradas de audio), <code>doctor</code> (diagnóstico de entorno y hardware) y <code>mcp</code> (servidor MCP por stdio para agentes de IA). Opciones: <code>--port</code> / <code>-P</code> fija el puerto WebSocket y <code>--licenses</code> muestra los avisos de terceros incluidos. <code>mcp</code> solo funciona después de activar los interruptores MCP en <strong>Avanzado</strong> (OBS e integraciones).",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Public accessors                                                    */
/* ------------------------------------------------------------------ */

const TABLE: Record<Locale, Record<DocSection, DocSectionContent>> = {
  en: DOCS_EN,
  es: DOCS_ES,
};

/** All sections for a locale, in nav order (drives the sidebar + getStaticPaths). */
export function getDocsNav(
  lang: Locale,
): { slug: DocSection; label: string }[] {
  return DOC_SECTIONS.map((slug) => ({
    slug,
    label: TABLE[lang][slug].navLabel,
  }));
}

/** Full content for one section in one locale. */
export function getDocSection(
  lang: Locale,
  section: DocSection,
): DocSectionContent {
  return TABLE[lang][section];
}

/** Heading anchors for the "on this page" rail (derived from heading blocks). */
export function getDocAnchors(
  content: DocSectionContent,
): { id: string; text: string }[] {
  return content.blocks
    .filter((b): b is HeadingBlock => b.type === "heading")
    .map(({ id, text }) => ({ id, text }));
}

/** Localized "on this page" rail label. */
export function onThisPageLabel(lang: Locale): string {
  return lang === "es" ? "En esta página" : "On this page";
}

/** Localized mobile nav <details> summary. */
export function docsNavLabel(lang: Locale): string {
  return lang === "es" ? "Secciones" : "Sections";
}
