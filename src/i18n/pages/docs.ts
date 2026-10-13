/**
 * Docs content model — LiveAudio v1.5.0 · 5 sections, bilingual.
 *
 * This is the CONTENT source for /docs/[section]/ (EN) + /es/docs/[section]/ (ES).
 * v1.5.0 is a native Rust + Tauri 2 Windows x64 build: no Python runtime, no uv /
 * torch provisioning. The legacy Python line (v1.0.0–v1.2.7) is covered only as a
 * migration source and as the Linux fallback tarball.
 *
 * Structure-only port of the OLD DocViewer.tsx; EVERY product fact is reconciled
 * to the product spec (no macOS, no Kira, no milliseconds, GPU optional w/ VRAM >= 4
 * GiB, blacklist verbatim from config.json.example, WS schema + ports, backlog
 * policy, profiles, session files, config paths + LIVEAUDIO_HOME).
 *
 * Rendering: DocsPage.astro walks `blocks[]`. Each `heading` block contributes an
 * anchor to the right-rail "on this page" list (its `id` + text). Inline markup in
 * prose/cells is restricted to the SIGNAL DESK palette: <code> mono tokens, <strong>
 * emphasis. NO hardcoded colors — code tints come from .code-block / <code> CSS.
 *
 * Spanish copy is neutral/professional (no Rioplatense slang in artifacts).
 */

import type { Locale } from "../routes";

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
 * Use ONLY for caveats: SmartScreen, libportaudio2, first-run internet, the
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

const REPO = "https://github.com/plynte-labs/LiveAudio";

/** WebSocket JSON payload example — verbatim shape from §7. */
const WS_PAYLOAD_EN = `{
  "id": "1760000000000-12",
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
  "id": "1760000000000-12",
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

/** Session folder layout — §3 (transcript.jsonl + subtitles.vtt + session.json). */
const SESSION_TREE = `sessions/
└── session_2026-05-04_143022/
    ├── subtitles.vtt
    ├── transcript.jsonl
    └── session.json`;

/**
 * Default blacklist — VERBATIM from config.json.example (§8). Do NOT invent words.
 * (The OLD site's flupco/cuanos/kibon/plechitin/pae are removed — §9 row 9.)
 */
const BLACKLIST_VERBATIM = `amara.org, subtítulos por, suscríbete, dale like, gracias por ver,
memos, gracias, activar la campanita, ¡Hasta la próxima!, por favor`;

const WS_PYTHON_CLIENT = `import asyncio, websockets

async def test():
    async with websockets.connect("ws://127.0.0.1:8765") as ws:
        async for msg in ws:
            print(msg)

asyncio.run(test())`;

/**
 * Minimal browser WebSocket client — the smallest thing that reads the same
 * broadcast OBS reads. Mirrors what subtitulos_obs.html does internally
 * (WEBSOCKET_OBS.md §1/§10): connect, parse JSON, render text, reconnect on
 * close. Locale-neutral (HTML/JS identifiers stay as-is).
 */
const WS_HTML_CLIENT = `<!-- open this file in a browser, or load it as an OBS Browser Source -->
<div id="caption"></div>
<script>
  // ?port=XXXX overrides the default; matches ws_port in config.json
  const port = new URLSearchParams(location.search).get("port") || "8765";
  let ws;
  function connect() {
    ws = new WebSocket("ws://127.0.0.1:" + port);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);       // the subtitle payload
      document.getElementById("caption").textContent = msg.text;
    };
    // the server only broadcasts — reconnect every 3 s if it drops
    ws.onclose = () => setTimeout(connect, 3000);
  }
  connect();
</script>`;

/**
 * Native install flow — what the v1.5.0 NSIS installer does: detect and remove
 * legacy Python builds, preserve user data, install the Rust binary.
 */
const NATIVE_INSTALL_FLOW = `LiveAudio_1.5.0_x64-setup.exe  /  liveaudio-desktop.exe
  │
  ├─ 1. Detect legacy Python builds (v1.0.0–v1.2.7) via the Windows registry
  ├─ 2. Run the legacy uninstaller silently + stop leftover processes
  ├─ 3. Remove obsolete Python folders (settings in %APPDATA%\\LiveAudio kept)
  ├─ 4. Install the native Rust + Tauri 2 desktop app (~23.9 MB, no Python)
  └─ 5. Launch — transcription models download once on first use`;

/** config.json example — §8 values, blacklist trimmed to verbatim words. */
const CONFIG_EXAMPLE_EN = `{
    "output_dir": "C:\\\\streams\\\\sessions",
    "device": "cuda",
    "cpu_threads": 8,
    "model_size": "small",
    "blacklist": "amara.org, subtítulos por, gracias por ver",
    "continuous_session": true,
    "subtitle_style": "default",
    "subtitle_backlog_policy": "auto",
    "subtitle_max_live_delay_sec": 10.0,
    "subtitle_catchup_interval_sec": 1.5,
    "silence_timeout": 0.8,
    "max_chunk_duration": 5.0,
    "audio_device": null,
    "selected_profile_id": "balanced",
    "profile_mode": "preset",
    "ws_port": 8765,
    "obs_enabled": true,
    "whisper_context_prompt_en": "",
    "whisper_context_prompt_es": "",
    "asr_language": "en",
    "settings_navigation_mode": "tabs",
    "diagnostics_enabled": false
}`;

const CONFIG_EXAMPLE_ES = `{
    "output_dir": "E:\\\\streams\\\\sessions",
    "device": "cuda",
    "cpu_threads": 8,
    "model_size": "small",
    "blacklist": "amara.org, subtítulos por, gracias por ver",
    "continuous_session": true,
    "subtitle_style": "default",
    "subtitle_backlog_policy": "auto",
    "subtitle_max_live_delay_sec": 10.0,
    "subtitle_catchup_interval_sec": 1.5,
    "silence_timeout": 0.8,
    "max_chunk_duration": 5.0,
    "audio_device": null,
    "selected_profile_id": "balanced",
    "profile_mode": "preset",
    "ws_port": 8765,
    "obs_enabled": true,
    "whisper_context_prompt_en": "",
    "whisper_context_prompt_es": "",
    "asr_language": "es",
    "settings_navigation_mode": "tabs",
    "diagnostics_enabled": false
}`;

/* ================================================================== */
/* ENGLISH                                                             */
/* ================================================================== */

const DOCS_EN: Record<DocSection, DocSectionContent> = {
  overview: {
    slug: "overview",
    navLabel: "overview",
    metaTitle: "LiveAudio docs — Overview",
    metaDescription:
      "What LiveAudio is and what it needs: a free, open-source (MIT) app that generates real-time Whisper captions 100% locally and streams them to OBS over a local WebSocket. Windows x64 native Rust + Tauri 2 build; GPU optional.",
    eyebrow: "// docs / overview",
    h1: "LiveAudio documentation",
    lede:
      "LiveAudio is a free, open-source (MIT) desktop app that generates real-time Whisper speech captions 100% locally and streams them to OBS over a local WebSocket. v1.5.0 runs on Windows x64 as a native Rust + Tauri 2 build — no cloud, no API key, no per-minute cost.",
    blocks: [
      {
        type: "heading",
        id: "what-it-is",
        text: "What LiveAudio is",
      },
      {
        type: "prose",
        html: "<strong>Plynte LiveAudio</strong> is a local-first speech-recognition engine for streamers and creators. It transcribes with <strong>Whisper</strong> (<code>tiny</code>, <code>base</code>, <code>small</code>, <code>turbo</code>), trims silence with <strong>Silero VAD</strong>, and broadcasts subtitle JSON over a local WebSocket so OBS — or any localhost client — can render live captions. v1.5.0 is a native <strong>Rust + Tauri 2</strong> desktop app: faster startup, lower RAM, and no Python runtime.",
      },
      {
        type: "list",
        items: [
          "<strong>Local processing.</strong> No audio or transcribed text leaves your machine. No telemetry.",
          "<strong>Memory-safe core.</strong> The transcription engine is written in Rust, so entire classes of memory bugs are ruled out at compile time.",
          "<strong>Hot-swap.</strong> Change the audio device or model size without restarting the app.",
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
            "Windows 10/11 x64. <strong>No macOS.</strong> Linux: legacy Python v1.2.7 tarball.",
          ],
          [
            "GPU",
            "<strong>Optional</strong> — CPU works. NVIDIA CUDA is recommended and auto-detected; needs driver <code>&ge; 525</code> and VRAM <code>&ge; 4 GiB</code>.",
          ],
          ["RAM", "8 GB minimum, 16 GB recommended."],
          [
            "Disk",
            "Installer ~23.9 MB (portable exe ~15.6 MB), plus transcription-model storage.",
          ],
          [
            "Runtime",
            "None — v1.5.0 is a native binary. No Python runtime.",
          ],
          [
            "Internet",
            "First run only (downloads transcription models). Fully offline afterward.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "first run: internet",
        html: "Only the first run needs a connection, to download transcription models (Silero VAD ~2 MB; Whisper <code>tiny</code> ~150 MB / <code>base</code> ~300 MB / <code>small</code> ~480 MB / <code>turbo</code> ~1.5 GB). Every run after that is 100% offline.",
      },
      {
        type: "heading",
        id: "capture-and-platforms",
        text: "Capture and platforms",
      },
      {
        type: "prose",
        html: "LiveAudio captures from a <strong>physical microphone</strong>. On Windows it can also capture <strong>system audio</strong> via WASAPI loopback.",
      },
      {
        type: "callout",
        flag: "windows-only",
        html: "<strong>System-audio loopback (WASAPI) is Windows-only.</strong> v1.5.0 focuses on Windows x64; on the legacy Linux v1.2.7 build, capture from the microphone and install <code>libportaudio2</code> first (<code>sudo apt install libportaudio2</code>).",
      },
      {
        type: "heading",
        id: "how-it-installs",
        text: "How it installs (native build)",
      },
      {
        type: "prose",
        html: "What you download is the whole app — a native Rust + Tauri 2 binary, not a bootstrapper. The Windows installer (<code>LiveAudio_1.5.0_x64-setup.exe</code>, ~23.9 MB) sets up the desktop app directly: no Python runtime, no dependency provisioning. On first transcription it downloads only the transcription models, then runs fully offline.",
      },
      {
        type: "code",
        label: "native install flow",
        code: NATIVE_INSTALL_FLOW,
      },
      {
        type: "prose",
        html: "Your settings and sessions live in <code>%APPDATA%\\LiveAudio</code> and survive updates. Coming from a Python build (v1.0.0–v1.2.7)? The installer removes it silently first — your data is preserved.",
      },
      {
        type: "heading",
        id: "where-data-lives",
        text: "Where your data lives",
      },
      {
        type: "prose",
        html: "v1.5.0 keeps your data in one place — no virtual environments, no managed Python:",
      },
      {
        type: "table",
        head: ["Location", "Content"],
        rows: [
          [
            "<code>%APPDATA%\\LiveAudio</code>",
            "Your settings (<code>config.json</code>) and <code>sessions/</code> — preserved across installs and the Python-to-Rust migration.",
          ],
          [
            "Legacy Python installs (v1.0.0–v1.2.7)",
            "Detected via the Windows registry and removed silently by the v1.5.0 installer.",
          ],
        ],
      },
      {
        type: "heading",
        id: "hardware-detection",
        text: "Hardware detection",
      },
      {
        type: "prose",
        html: "The app chooses between <code>cuda</code> and <code>cpu</code> with a first-match-wins ladder:",
      },
      {
        type: "list",
        items: [
          "Your explicit choice in the <strong>Advanced</strong> tab (compute-device selector) — picking CUDA dims the CPU-threads control because inference runs on the GPU.",
          "Otherwise NVML + <code>nvidia-smi</code>: if the driver is <code>&ge; 525</code> and VRAM is <code>&ge; 4096 MiB</code> &rarr; <code>cuda</code>.",
          "Anything else (no NVML, smi failure, or a GPU below requirements) &rarr; <code>cpu</code>, with a note when a GPU was found but did not qualify.",
        ],
      },
      {
        type: "heading",
        id: "updates",
        text: "Updates",
      },
      {
        type: "prose",
        html: `Update in one click from inside the app. New releases — installer, portable exe, changelog and hashes — are published on <a href="${REPO}/releases/latest" target="_blank" rel="noopener noreferrer">GitHub Releases</a>. Your settings and sessions in <code>%APPDATA%\\LiveAudio</code> are preserved.`,
      },
    ],
  },

  getting_started: {
    slug: "getting_started",
    navLabel: "getting-started",
    metaTitle: "LiveAudio docs — Getting started",
    metaDescription:
      "Install and run LiveAudio v1.5.0 on Windows x64: the native installer or portable exe, legacy Python auto-migration, first-run GPU auto-detect, FPS-aware profiles, the verbatim hallucination blacklist, and session files.",
    eyebrow: "// docs / getting-started",
    h1: "Getting started",
    lede:
      "Two ways to run LiveAudio v1.5.0 on Windows: the prebuilt installer (recommended) or the portable standalone exe. No Python installed, no runtime to provision — the app is a native binary.",
    blocks: [
      {
        type: "heading",
        id: "option-a-installer",
        text: "Option A — Installer (recommended)",
      },
      {
        type: "prose",
        html: `Download the latest release from <a href="${REPO}/releases/latest" target="_blank" rel="noopener noreferrer">GitHub Releases</a>:`,
      },
      {
        type: "list",
        items: [
          "<strong>Windows x64:</strong> <code>LiveAudio_1.5.0_x64-setup.exe</code> (graphical installer, ~23.9 MB).",
          "<strong>Windows portable:</strong> <code>liveaudio-desktop.exe</code> (~15.6 MB) — standalone, no install.",
          "<strong>Linux:</strong> legacy <code>LiveAudio-1.2.7-linux-x64.tar.gz</code> — extract, then run <code>./liveaudio-launcher</code>.",
        ],
      },
      {
        type: "prose",
        html: "The <strong>first run</strong> downloads transcription models and auto-detects your GPU. Later runs start instantly. Coming from v1.0.0–v1.2.7? The installer removes the legacy Python build silently and preserves your settings in <code>%APPDATA%\\LiveAudio</code>.",
      },
      {
        type: "callout",
        flag: "legacy linux",
        html: "On the legacy Linux build, install the PortAudio runtime before launching: <code>sudo apt install libportaudio2</code>.",
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
        html: "Open the app — the header shows the live status (listening / VAD state) and the <strong>Advanced</strong> tab shows the active compute device (CUDA or CPU). Speak, and captions appear in the live subtitle feed and stream to OBS.",
      },
      {
        type: "heading",
        id: "updates-recovery",
        text: "Updates & recovery",
      },
      {
        type: "prose",
        html: "v1.5.0 configures everything from the GUI — the <strong>Advanced</strong> tab picks the compute device (CUDA/CPU) and model without a restart. <strong>Updates</strong> arrive in one click from inside the app. If an install ever breaks, re-run <code>LiveAudio_1.5.0_x64-setup.exe</code>: it repairs the install and preserves your settings and sessions in <code>%APPDATA%\\LiveAudio</code>.",
      },
      {
        type: "heading",
        id: "gpu-auto-detect",
        text: "GPU auto-detection",
      },
      {
        type: "prose",
        html: "On startup LiveAudio checks for an NVIDIA GPU. If one is available it defaults to <code>cuda</code>; otherwise it falls back to <code>cpu</code> automatically. CUDA needs driver <code>&ge; 525</code> and VRAM <code>&ge; 4 GiB</code> — no manual configuration required.",
      },
      {
        type: "heading",
        id: "profiles",
        text: "Profiles",
      },
      {
        type: "prose",
        html: "Profiles are FPS-aware presets. Editing a built-in profile turns it into <strong>Custom</strong>; changes only take effect after you click <strong>Apply changes</strong>.",
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
        text: "Hallucination blacklist",
      },
      {
        type: "prose",
        html: "Whisper can invent phrases during silence. LiveAudio filters them with an editable blacklist. The default list (from <code>config.json.example</code>) is:",
      },
      {
        type: "code",
        label: "config.json.example · blacklist",
        code: BLACKLIST_VERBATIM,
      },
      {
        type: "prose",
        html: "Words and phrases are comma-separated and fully editable from the <strong>Subtitles</strong> tab — add the filler your stream tends to hallucinate, or clear entries you want to keep.",
      },
      {
        type: "heading",
        id: "models",
        text: "Models",
      },
      {
        type: "prose",
        html: "Pick a model in the <strong>Model &amp; Hardware</strong> tab. Larger models are more accurate but slower and use more VRAM; each one downloads once on first use, then runs offline.",
      },
      {
        type: "table",
        head: ["Model", "First-run download", "Notes"],
        rows: [
          ["<code>tiny</code>", "~150 MB", "Fastest; good on low-end CPUs."],
          ["<code>base</code>", "~300 MB", "A step up in accuracy, still light."],
          [
            "<code>small</code>",
            "~480 MB",
            "Balanced default for CPU.",
          ],
          [
            "<code>turbo</code>",
            "~1.5 GB",
            "Highest accuracy here; best on a GPU.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "first use: internet",
        html: "On a metered connection, note that <code>turbo</code> pulls ~1.5 GB the first time you transcribe with it — over a gigabyte more than <code>tiny</code>. Silero VAD (~2 MB) also downloads once. After that, everything runs offline.",
      },
      {
        type: "heading",
        id: "session-files",
        text: "Session files",
      },
      {
        type: "prose",
        html: "Every session is saved to disk as a transcript (<code>transcript.jsonl</code>) and WebVTT subtitles (<code>subtitles.vtt</code>), plus a <code>session.json</code> manifest:",
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
    navLabel: "websocket-obs",
    metaTitle: "LiveAudio docs — WebSocket & OBS",
    metaDescription:
      "The LiveAudio WebSocket: ws://127.0.0.1:8765 (configurable ws_port, ?port=XXXX in OBS), the JSON payload schema, OBS backlog policy (auto / live_only / send_all), localhost-only security, and OBS Browser Source setup.",
    eyebrow: "// docs / websocket-obs",
    h1: "WebSocket & OBS",
    lede:
      "LiveAudio runs a local WebSocket server that broadcasts subtitle JSON in real time. OBS is the built-in target via the included subtitulos_obs.html overlay, but any HTML or WebSocket client on localhost can connect and receive the same broadcast.",
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
            "<code>8765</code> by default, configurable via <code>ws_port</code>",
          ],
          ["Format", "JSON"],
          ["Auth", "None — bound to localhost only"],
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
            "Stable identifier for the phrase within the session.",
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
            "Total delay from audio capture to a ready subtitle (sub-second to ~1 s on a typical setup).",
          ],
          [
            "<code>latency</code>",
            "number",
            "Seconds Whisper spent transcribing the segment.",
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
        html: "<code>total_delay</code> and <code>latency</code> are measured in <strong>seconds</strong> — typically sub-second to about one second. LiveAudio does not publish a fixed millisecond figure.",
      },
      {
        type: "prose",
        html: "The built-in OBS overlay only consumes <code>text</code> and <code>style</code>. The remaining fields are metadata for diagnostics and backlog control — useful if you build your own client, ignorable if you do not.",
      },
      {
        type: "heading",
        id: "subtitle-styles",
        text: "Subtitle styles",
      },
      {
        type: "prose",
        html: "The <code>style</code> field selects one of seven built-in looks, switchable from the <strong>Subtitles</strong> tab:",
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
          "Localhost only — the server rejects any connection that is not from <code>127.0.0.1</code>, <code>::1</code> or <code>localhost</code>.",
          "No authentication required, because it is bound to localhost.",
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
          "Choose <strong>Local file</strong> and select <code>subtitulos_obs.html</code> (in <code>liveaudio/assets/</code>). Set size <strong>1920&times;200</strong>.",
          "Set <strong>FPS</strong> to <code>30</code> or <code>60</code>, and place the source <strong>bottom-center</strong> in your scene.",
          'Disable <strong>"Shut down source when not visible"</strong> and "Refresh browser when scene becomes active" — both can drop the WebSocket connection.',
          "For a custom port, set <code>ws_port</code> in <code>config.json</code>; the OBS HTML reads <code>?port=XXXX</code> from its URL (default <code>8765</code>).",
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
          "<strong>Reconnect.</strong> A client that loses the connection retries about every <strong>3 seconds</strong> until the server is back — the bundled overlay does this for you.",
          "<strong>Broadcast.</strong> Every connected client receives every message. Multiple clients (OBS plus a debug browser tab) all see the same stream, and a slow client does not block the others.",
          "<strong>No backpressure.</strong> On <code>websockets &ge; 16</code> the server uses <code>broadcast()</code>, which fans out without waiting on any single client.",
        ],
      },
      {
        type: "heading",
        id: "test-client",
        text: "Build your own client",
      },
      {
        type: "prose",
        html: "Any localhost WebSocket client can subscribe to the same broadcast OBS reads. A minimal browser client — open the file directly, or load it as an OBS Browser Source:",
      },
      {
        type: "code",
        label: "client.html",
        code: WS_HTML_CLIENT,
      },
      {
        type: "prose",
        html: "Or a minimal Python client, to print every payload as it arrives (requires the <code>websockets</code> package):",
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
        html: "Open the overlay in a browser and press <strong>F12</strong> &rarr; Console. These messages tell you where a stalled overlay is stuck:",
      },
      {
        type: "table",
        head: ["Console message", "Meaning"],
        rows: [
          [
            "<code>Conectado al motor ASR</code>",
            "Connected successfully — the WebSocket is live.",
          ],
          [
            "<code>Desconectado. Reintentando…</code>",
            "Cannot connect: LiveAudio is not started, the port is busy, or the <code>?port=</code> in the URL does not match <code>ws_port</code>.",
          ],
          [
            "<code>Error parseando WebSocket</code>",
            "A non-JSON / non-dict message reached the overlay — the payload was not a valid subtitle object.",
          ],
        ],
      },
    ],
  },

  troubleshooting: {
    slug: "troubleshooting",
    navLabel: "troubleshooting",
    metaTitle: "LiveAudio docs — Troubleshooting",
    metaDescription:
      "Fixes for common LiveAudio issues: no captions, CUDA out-of-memory, OBS not connecting on port 8765, upgrading from the Python version, audio cutting out — plus local-first diagnostics export.",
    eyebrow: "// docs / troubleshooting",
    h1: "Troubleshooting",
    lede:
      "Root-cause fixes for the most common setup issues — capture, CUDA, the WebSocket connection, and Python-version upgrades — followed by the local-first diagnostics export.",
    blocks: [
      {
        type: "heading",
        id: "no-captions",
        text: "Captions are not appearing",
      },
      {
        type: "prose",
        html: "Verify the selected audio device in the panel. If you are capturing desktop sound on Windows, make sure you enabled the correct <strong>WASAPI loopback</strong> channel.",
      },
      {
        type: "callout",
        flag: "windows-only",
        html: "System-audio loopback is Windows-only. On Linux, capture from the microphone instead.",
      },
      {
        type: "heading",
        id: "cuda-oom",
        text: "CUDA error / out of memory",
      },
      {
        type: "prose",
        html: "LiveAudio monitors VRAM before each transcription. When free memory drops below about <strong>500 MB</strong> it frees the CUDA cache automatically and surfaces <strong>“GPU saturada - VRAM baja”</strong>. If it still fails: switch the inference device from <strong>cuda</strong> to <strong>cpu</strong>, or load a smaller model (<code>tiny</code> or <code>base</code>), and close other VRAM-heavy programs (OBS with NVENC, games). Updating your NVIDIA driver resolves most CUDA runtime failures.",
      },
      {
        type: "heading",
        id: "upgrading-from-python",
        text: "Upgrading from the Python version (v1.0.0–v1.2.7)",
      },
      {
        type: "prose",
        html: "v1.5.0 replaces the Python builds with a native Rust + Tauri 2 app. The installer detects legacy installs through the Windows registry (32- and 64-bit views), runs the old uninstaller silently (NSIS and Inno Setup), stops leftover processes, and removes the obsolete Python folders — while your settings and sessions in <code>%APPDATA%\\LiveAudio</code> are preserved.",
      },
      {
        type: "heading",
        id: "obs-not-connecting",
        text: "OBS does not connect",
      },
      {
        type: "prose",
        html: "Make sure the engine is running — port <code>8765</code> must be listening. If your firewall or antivirus blocks local traffic, add a rule to allow localhost connections on the WebSocket port.",
      },
      {
        type: "heading",
        id: "legacy-process-still-running",
        text: "Installer reports a running copy",
      },
      {
        type: "prose",
        html: "Close every LiveAudio window first — the v1.5.0 installer stops leftover Python-era processes automatically, but stop a transcription in progress from the app (<strong>Stop Transcription</strong>) before upgrading.",
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
        html: `The installer is not code-signed yet, so SmartScreen may warn. Choose <strong>More info &rarr; Run anyway</strong>. The exact files and hashes are published on the <a href="${REPO}/releases/tag/v1.5.0" target="_blank" rel="noopener noreferrer">v1.5.0 release page</a>.`,
      },
      {
        type: "heading",
        id: "install-recovery",
        text: "Install &amp; download recovery",
      },
      {
        type: "prose",
        html: "Most install problems are fixed by re-running the installer — it repairs the app and preserves your settings and sessions:",
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
            "Re-run <code>LiveAudio_1.5.0_x64-setup.exe</code> — it repairs the install and keeps <code>%APPDATA%\\LiveAudio</code> intact.",
          ],
          [
            "Coming from the Python version",
            "The installer removes legacy v1.0.0–v1.2.7 builds automatically and preserves your settings.",
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
          "<strong>How:</strong> reproduce the issue, click <strong>Export diagnostics</strong> in the app, then review the exported JSON (process states, queue sizes, audio/asr/ws states).",
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
    navLabel: "config",
    metaTitle: "LiveAudio docs — Configuration",
    metaDescription:
      "The LiveAudio config.json reference: file location on Windows, every option key with its type, and a full example.",
    eyebrow: "// docs / config",
    h1: "Configuration",
    lede:
      "LiveAudio writes a config.json with sensible defaults on first run. Change everything from the GUI, or edit the file directly. This page is the full key reference.",
    blocks: [
      {
        type: "heading",
        id: "file-location",
        text: "File location",
      },
      {
        type: "prose",
        html: "v1.5.0 keeps your settings and sessions under <code>%APPDATA%\\LiveAudio</code> on Windows — the installer preserves this folder when it removes legacy Python builds.",
      },
      {
        type: "table",
        head: ["Build", "Path"],
        rows: [
          ["Windows x64 (v1.5.0, Rust)", "<code>%APPDATA%\\LiveAudio</code>"],
          ["Linux (legacy Python v1.2.7)", "<code>~/.local/share/liveaudio/data</code>"],
        ],
      },
      {
        type: "callout",
        flag: "migration",
        html: "Upgrading from v1.0.0–v1.2.7? The installer migrates this folder automatically — your <code>config.json</code> and <code>sessions/</code> survive the move to Rust.",
      },
      {
        type: "prose",
        html: "<strong>Portable:</strong> prefer no install? Run <code>liveaudio-desktop.exe</code> (~15.6 MB) — the standalone Windows build needs no setup.",
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
          ["<code>output_dir</code>", "string", "Path to the sessions folder."],
          ["<code>device</code>", "string", '"cuda" or "cpu".'],
          [
            "<code>cpu_threads</code>",
            "number",
            "Number of CPU threads for inference.",
          ],
          [
            "<code>model_size</code>",
            "string",
            '"tiny", "base", "small" or "turbo".',
          ],
          [
            "<code>blacklist</code>",
            "string",
            "Comma-separated filter words (see the getting-started blacklist).",
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
            "Seconds of silence before cutting a segment.",
          ],
          [
            "<code>max_chunk_duration</code>",
            "number",
            "Max seconds before forcing a cut.",
          ],
          [
            "<code>audio_device</code>",
            "string | null",
            "Selected device, or null for the system default.",
          ],
          [
            "<code>selected_profile_id</code>",
            "string",
            '"fast", "balanced", "quality" or "stable".',
          ],
          [
            "<code>profile_mode</code>",
            "string",
            '"preset" or "custom" — set to "custom" automatically when you edit a built-in profile.',
          ],
          [
            "<code>ws_port</code>",
            "number",
            "WebSocket server port (default: 8765).",
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
            'Language code for Whisper (e.g. "en", "es").',
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
    ],
  },
};

/* ================================================================== */
/* SPANISH (neutral / professional — no Rioplatense slang)             */
/* ================================================================== */

const DOCS_ES: Record<DocSection, DocSectionContent> = {
  overview: {
    slug: "overview",
    navLabel: "introducción",
    metaTitle: "Docs de LiveAudio — Introducción",
    metaDescription:
      "Qué es LiveAudio y qué necesita: una app gratuita y de código abierto (MIT) que genera subtítulos Whisper en tiempo real 100% en tu equipo y los envía a OBS por un WebSocket local. Build nativa Rust + Tauri 2 para Windows x64; GPU opcional.",
    eyebrow: "// docs / introducción",
    h1: "Documentación de LiveAudio",
    lede:
      "LiveAudio es una app de escritorio gratuita y de código abierto (MIT) que genera subtítulos de voz Whisper en tiempo real 100% en tu equipo y los envía a OBS por un WebSocket local. La v1.5.0 corre en Windows x64 como build nativa Rust + Tauri 2: sin nube, sin API key, sin costo por minuto.",
    blocks: [
      {
        type: "heading",
        id: "que-es",
        text: "Qué es LiveAudio",
      },
      {
        type: "prose",
        html: "<strong>Plynte LiveAudio</strong> es un motor de reconocimiento de voz local-first para streamers y creadores. Transcribe con <strong>Whisper</strong> (<code>tiny</code>, <code>base</code>, <code>small</code>, <code>turbo</code>), recorta silencios con <strong>Silero VAD</strong> y emite los subtítulos en JSON por un WebSocket local para que OBS — o cualquier cliente en localhost — muestre los subtítulos en vivo. La v1.5.0 es una app de escritorio nativa <strong>Rust + Tauri 2</strong>: arranque más rápido, menos RAM y sin runtime de Python.",
      },
      {
        type: "list",
        items: [
          "<strong>Procesamiento local.</strong> Ningún audio ni texto transcrito sale de tu equipo. Sin telemetría.",
          "<strong>Núcleo con memoria segura.</strong> El motor de transcripción está escrito en Rust, así que clases enteras de errores de memoria quedan descartadas en compilación.",
          "<strong>Hot-swap.</strong> Cambia el dispositivo de audio o el tamaño del modelo sin reiniciar la app.",
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
            "Windows 10/11 x64. <strong>Sin macOS.</strong> Linux: tarball heredado Python v1.2.7.",
          ],
          [
            "GPU",
            "<strong>Opcional</strong> — la CPU funciona. NVIDIA CUDA es recomendada y se detecta sola; necesita driver <code>&ge; 525</code> y VRAM <code>&ge; 4 GiB</code>.",
          ],
          ["RAM", "8 GB mínimo, 16 GB recomendados."],
          [
            "Disco",
            "Instalador ~23.9 MB (portable ~15.6 MB), más el almacenamiento de modelos de transcripción.",
          ],
          [
            "Runtime",
            "Ninguno — la v1.5.0 es un binario nativo. Sin runtime de Python.",
          ],
          [
            "Internet",
            "Solo en la primera ejecución (descarga los modelos de transcripción). Después funciona sin conexión.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "primera ejecución: internet",
        html: "Solo la primera ejecución necesita conexión, para descargar los modelos de transcripción (Silero VAD ~2 MB; Whisper <code>tiny</code> ~150 MB / <code>base</code> ~300 MB / <code>small</code> ~480 MB / <code>turbo</code> ~1.5 GB). Cada ejecución posterior es 100% offline.",
      },
      {
        type: "heading",
        id: "captura-y-plataformas",
        text: "Captura y plataformas",
      },
      {
        type: "prose",
        html: "LiveAudio captura desde un <strong>micrófono físico</strong>. En Windows también puede capturar el <strong>audio del sistema</strong> mediante WASAPI loopback.",
      },
      {
        type: "callout",
        flag: "solo Windows",
        html: "<strong>El loopback de audio del sistema (WASAPI) es solo de Windows.</strong> La v1.5.0 se enfoca en Windows x64; en la versión heredada Linux v1.2.7, captura desde el micrófono e instala <code>libportaudio2</code> primero (<code>sudo apt install libportaudio2</code>).",
      },
      {
        type: "heading",
        id: "como-se-instala",
        text: "Cómo se instala (build nativa)",
      },
      {
        type: "prose",
        html: "Lo que descargas es la app completa — un binario nativo Rust + Tauri 2, no un bootstrapper. El instalador de Windows (<code>LiveAudio_1.5.0_x64-setup.exe</code>, ~23.9 MB) instala la app de escritorio directamente: sin runtime de Python, sin provisión de dependencias. En la primera transcripción descarga solo los modelos, y después funciona sin conexión.",
      },
      {
        type: "code",
        label: "native install flow",
        code: NATIVE_INSTALL_FLOW,
      },
      {
        type: "prose",
        html: "Tu configuración y sesiones viven en <code>%APPDATA%\\LiveAudio</code> y sobreviven a las actualizaciones. ¿Vienes de una versión Python (v1.0.0–v1.2.7)? El instalador la elimina en silencio primero — tus datos se conservan.",
      },
      {
        type: "heading",
        id: "donde-viven-tus-datos",
        text: "Dónde viven tus datos",
      },
      {
        type: "prose",
        html: "La v1.5.0 guarda tus datos en un solo lugar — sin entornos virtuales, sin Python gestionado:",
      },
      {
        type: "table",
        head: ["Ubicación", "Contenido"],
        rows: [
          [
            "<code>%APPDATA%\\LiveAudio</code>",
            "Tu configuración (<code>config.json</code>) y <code>sessions/</code> — se conservan entre instalaciones y en la migración de Python a Rust.",
          ],
          [
            "Instalaciones Python heredadas (v1.0.0–v1.2.7)",
            "Detectadas vía el registro de Windows y eliminadas en silencio por el instalador v1.5.0.",
          ],
        ],
      },
      {
        type: "heading",
        id: "deteccion-de-hardware",
        text: "Detección de hardware",
      },
      {
        type: "prose",
        html: "La app elige entre <code>cuda</code> y <code>cpu</code> con una escalera de “primera coincidencia gana”:",
      },
      {
        type: "list",
        items: [
          "Tu elección explícita en la pestaña <strong>Avanzado</strong> (selector de dispositivo de cómputo) — elegir CUDA atenúa el control de hilos de CPU porque la inferencia corre en la GPU.",
          "Si no, NVML + <code>nvidia-smi</code>: si el driver es <code>&ge; 525</code> y la VRAM es <code>&ge; 4096 MiB</code> &rarr; <code>cuda</code>.",
          "Cualquier otro caso (sin NVML, fallo de smi o una GPU por debajo de los requisitos) &rarr; <code>cpu</code>, con un aviso cuando se encontró una GPU pero no calificó.",
        ],
      },
      {
        type: "heading",
        id: "actualizaciones",
        text: "Actualizaciones",
      },
      {
        type: "prose",
        html: `Actualiza con un clic desde la app. Las versiones nuevas — instalador, portable, changelog y hashes — se publican en <a href="${REPO}/releases/latest" target="_blank" rel="noopener noreferrer">GitHub Releases</a>. Tu configuración y sesiones en <code>%APPDATA%\\LiveAudio</code> se conservan.`,
      },
    ],
  },

  getting_started: {
    slug: "getting_started",
    navLabel: "primeros-pasos",
    metaTitle: "Docs de LiveAudio — Primeros pasos",
    metaDescription:
      "Instala y ejecuta LiveAudio v1.5.0 en Windows x64: el instalador nativo o el portable, la migración automática desde Python, la detección automática de GPU en la primera ejecución, los perfiles, la blacklist de alucinaciones verbatim y los archivos de sesión.",
    eyebrow: "// docs / primeros-pasos",
    h1: "Primeros pasos",
    lede:
      "Dos maneras de ejecutar LiveAudio v1.5.0 en Windows: el instalador prearmado (recomendado) o el portable standalone. Sin Python instalado, sin runtime por provisionar — la app es un binario nativo.",
    blocks: [
      {
        type: "heading",
        id: "opcion-a-instalador",
        text: "Opción A — Instalador (recomendado)",
      },
      {
        type: "prose",
        html: `Descarga la última versión desde <a href="${REPO}/releases/latest" target="_blank" rel="noopener noreferrer">GitHub Releases</a>:`,
      },
      {
        type: "list",
        items: [
          "<strong>Windows x64:</strong> <code>LiveAudio_1.5.0_x64-setup.exe</code> (instalador gráfico, ~23.9 MB).",
          "<strong>Windows portable:</strong> <code>liveaudio-desktop.exe</code> (~15.6 MB) — standalone, sin instalación.",
          "<strong>Linux:</strong> <code>LiveAudio-1.2.7-linux-x64.tar.gz</code> heredado — extrae y ejecuta <code>./liveaudio-launcher</code>.",
        ],
      },
      {
        type: "prose",
        html: "La <strong>primera ejecución</strong> descarga los modelos de transcripción y detecta tu GPU automáticamente. Las ejecuciones siguientes arrancan al instante. ¿Vienes de v1.0.0–v1.2.7? El instalador elimina la versión Python heredada en silencio y conserva tu configuración en <code>%APPDATA%\\LiveAudio</code>.",
      },
      {
        type: "callout",
        flag: "linux heredado",
        html: "En la versión heredada de Linux, instala el runtime de PortAudio antes de iniciar: <code>sudo apt install libportaudio2</code>.",
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
        html: "Abre la app — la cabecera muestra el estado en vivo (escuchando / estado VAD) y la pestaña <strong>Avanzado</strong> muestra el dispositivo de cómputo activo (CUDA o CPU). Habla, y los subtítulos aparecen en el feed en vivo y se envían a OBS.",
      },
      {
        type: "heading",
        id: "actualizaciones-recuperacion",
        text: "Actualizaciones y recuperación",
      },
      {
        type: "prose",
        html: "La v1.5.0 configura todo desde la GUI — la pestaña <strong>Avanzado</strong> elige el dispositivo de cómputo (CUDA/CPU) y el modelo sin reiniciar. Las <strong>actualizaciones</strong> llegan en un clic desde la app. Si una instalación se rompe, vuelve a ejecutar <code>LiveAudio_1.5.0_x64-setup.exe</code>: repara la instalación y conserva tu configuración y sesiones en <code>%APPDATA%\\LiveAudio</code>.",
      },
      {
        type: "heading",
        id: "deteccion-gpu",
        text: "Detección automática de GPU",
      },
      {
        type: "prose",
        html: "Al iniciar, LiveAudio busca una GPU NVIDIA. Si hay una disponible usa <code>cuda</code> por defecto; si no, cambia a <code>cpu</code> automáticamente. CUDA necesita driver <code>&ge; 525</code> y VRAM <code>&ge; 4 GiB</code> — no hace falta configurar nada a mano.",
      },
      {
        type: "heading",
        id: "perfiles",
        text: "Perfiles",
      },
      {
        type: "prose",
        html: "Los perfiles son presets sensibles a los FPS. Editar un perfil integrado lo convierte en <strong>Personalizado</strong>; los cambios solo se activan al pulsar <strong>Aplicar cambios</strong>.",
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
        text: "Blacklist de alucinaciones",
      },
      {
        type: "prose",
        html: "Whisper puede inventar frases durante el silencio. LiveAudio las filtra con una blacklist editable. La lista por defecto (de <code>config.json.example</code>) es:",
      },
      {
        type: "code",
        label: "config.json.example · blacklist",
        code: BLACKLIST_VERBATIM,
      },
      {
        type: "prose",
        html: "Las palabras y frases se separan por comas y son totalmente editables desde la pestaña <strong>Subtítulos</strong> — agrega el relleno que tu stream tiende a alucinar, o borra entradas que quieras conservar.",
      },
      {
        type: "heading",
        id: "modelos",
        text: "Modelos",
      },
      {
        type: "prose",
        html: "Elige un modelo en la pestaña <strong>Modelo y Hardware</strong>. Los modelos más grandes son más precisos pero más lentos y usan más VRAM; cada uno se descarga una vez en el primer uso y después funciona sin conexión.",
      },
      {
        type: "table",
        head: ["Modelo", "Descarga inicial", "Notas"],
        rows: [
          ["<code>tiny</code>", "~150 MB", "El más rápido; bien en CPUs modestas."],
          ["<code>base</code>", "~300 MB", "Un escalón más de precisión, todavía liviano."],
          [
            "<code>small</code>",
            "~480 MB",
            "Default equilibrado para CPU.",
          ],
          [
            "<code>turbo</code>",
            "~1.5 GB",
            "La mayor precisión aquí; mejor con GPU.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "primer uso: internet",
        html: "En una conexión con límite de datos, ten en cuenta que <code>turbo</code> descarga ~1.5 GB la primera vez que transcribes con él — más de un gigabyte más que <code>tiny</code>. Silero VAD (~2 MB) también se descarga una vez. Después, todo funciona sin conexión.",
      },
      {
        type: "heading",
        id: "archivos-de-sesion",
        text: "Archivos de sesión",
      },
      {
        type: "prose",
        html: "Cada sesión se guarda en disco como un transcript (<code>transcript.jsonl</code>) y subtítulos WebVTT (<code>subtitles.vtt</code>), más un manifiesto <code>session.json</code>:",
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
    navLabel: "websocket-obs",
    metaTitle: "Docs de LiveAudio — WebSocket y OBS",
    metaDescription:
      "El WebSocket de LiveAudio: ws://127.0.0.1:8765 (ws_port configurable, ?port=XXXX en OBS), el esquema del payload JSON, la política de backlog (auto / live_only / send_all), la seguridad solo-localhost y la configuración del Browser Source en OBS.",
    eyebrow: "// docs / websocket-obs",
    h1: "WebSocket y OBS",
    lede:
      "LiveAudio levanta un servidor WebSocket local que emite subtítulos en JSON en tiempo real. OBS es el destino integrado mediante el overlay incluido subtitulos_obs.html, pero cualquier cliente HTML o WebSocket en localhost puede conectarse y recibir la misma transmisión.",
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
            "<code>8765</code> por defecto, configurable con <code>ws_port</code>",
          ],
          ["Formato", "JSON"],
          ["Autenticación", "Ninguna — limitado a localhost"],
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
            "Identificador estable de la frase dentro de la sesión.",
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
            "Atraso total desde la captura hasta el subtítulo listo (de sub-segundo a ~1 s en un equipo típico).",
          ],
          [
            "<code>latency</code>",
            "number",
            "Segundos que Whisper usó para transcribir el segmento.",
          ],
          [
            "<code>is_replay</code>",
            "boolean",
            "Si es un subtítulo de backlog / catch-up.",
          ],
          [
            "<code>catchup_interval_sec</code>",
            "number",
            "Pacing recomendado entre ítems de backlog en modo auto.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "timing",
        html: "<code>total_delay</code> y <code>latency</code> se miden en <strong>segundos</strong> — normalmente de sub-segundo a alrededor de un segundo. LiveAudio no publica una cifra fija en milisegundos.",
      },
      {
        type: "prose",
        html: "El overlay de OBS integrado solo consume <code>text</code> y <code>style</code>. Los demás campos son metadata para diagnóstico y control de backlog — útiles si construyes tu propio cliente, ignorables si no.",
      },
      {
        type: "heading",
        id: "estilos-de-subtitulos",
        text: "Estilos de subtítulos",
      },
      {
        type: "prose",
        html: "El campo <code>style</code> selecciona uno de siete looks integrados, conmutables desde la pestaña <strong>Subtítulos</strong>:",
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
            "Envía subtítulos frescos más un backlog corto con pacing. Omite lo que supere el atraso máximo.",
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
          "Solo localhost — el servidor rechaza cualquier conexión que no sea de <code>127.0.0.1</code>, <code>::1</code> o <code>localhost</code>.",
          "No requiere autenticación, porque está limitado a localhost.",
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
          "Elige <strong>Archivo local</strong> y selecciona <code>subtitulos_obs.html</code> (en <code>liveaudio/assets/</code>). Tamaño <strong>1920&times;200</strong>.",
          "Pon los <strong>FPS</strong> en <code>30</code> o <code>60</code> y ubica la fuente en la parte <strong>inferior central</strong> de la escena.",
          'Desactiva <strong>"Apagar la fuente cuando no esté visible"</strong> y "Actualizar el navegador cuando la escena se active" — ambas pueden cortar la conexión WebSocket.',
          "Para un puerto personalizado, configura <code>ws_port</code> en <code>config.json</code>; el HTML de OBS lee <code>?port=XXXX</code> de su URL (default <code>8765</code>).",
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
          "<strong>Reconexión.</strong> Un cliente que pierde la conexión reintenta cada <strong>3 segundos</strong> aproximadamente hasta que el servidor vuelve — el overlay incluido ya lo hace por ti.",
          "<strong>Broadcast.</strong> Cada cliente conectado recibe cada mensaje. Varios clientes (OBS más una pestaña de depuración) ven el mismo flujo, y un cliente lento no bloquea a los demás.",
          "<strong>Sin backpressure.</strong> Con <code>websockets &ge; 16</code> el servidor usa <code>broadcast()</code>, que reparte sin esperar a ningún cliente en particular.",
        ],
      },
      {
        type: "heading",
        id: "cliente-de-prueba",
        text: "Construir tu propio cliente",
      },
      {
        type: "prose",
        html: "Cualquier cliente WebSocket en localhost puede suscribirse a la misma transmisión que lee OBS. Un cliente mínimo en navegador — ábrelo directamente, o cárgalo como Browser Source en OBS:",
      },
      {
        type: "code",
        label: "client.html",
        code: WS_HTML_CLIENT,
      },
      {
        type: "prose",
        html: "O un cliente mínimo en Python, para imprimir cada payload a medida que llega (requiere el paquete <code>websockets</code>):",
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
        html: "Abre el overlay en un navegador y presiona <strong>F12</strong> &rarr; Consola. Estos mensajes indican dónde se traba un overlay que no muestra nada:",
      },
      {
        type: "table",
        head: ["Mensaje en consola", "Significado"],
        rows: [
          [
            "<code>Conectado al motor ASR</code>",
            "Conexión exitosa — el WebSocket está activo.",
          ],
          [
            "<code>Desconectado. Reintentando…</code>",
            "No conecta: LiveAudio no está iniciado, el puerto está ocupado, o el <code>?port=</code> de la URL no coincide con <code>ws_port</code>.",
          ],
          [
            "<code>Error parseando WebSocket</code>",
            "Llegó al overlay un mensaje que no es JSON / no es un dict — el payload no era un objeto de subtítulo válido.",
          ],
        ],
      },
    ],
  },

  troubleshooting: {
    slug: "troubleshooting",
    navLabel: "solución-de-problemas",
    metaTitle: "Docs de LiveAudio — Solución de problemas",
    metaDescription:
      "Soluciones a los problemas más comunes de LiveAudio: sin subtítulos, CUDA sin memoria, OBS que no conecta en el puerto 8765, actualización desde la versión Python, audio que se corta — más la exportación de diagnóstico local-first.",
    eyebrow: "// docs / solución-de-problemas",
    h1: "Solución de problemas",
    lede:
      "Soluciones de raíz para los problemas de configuración más comunes — captura, CUDA, la conexión WebSocket y actualizaciones desde Python — seguidas de la exportación de diagnóstico local-first.",
    blocks: [
      {
        type: "heading",
        id: "sin-subtitulos",
        text: "No aparecen subtítulos",
      },
      {
        type: "prose",
        html: "Verifica el dispositivo de audio seleccionado en el panel. Si capturas el sonido del escritorio en Windows, asegúrate de haber activado el canal de <strong>WASAPI loopback</strong> correcto.",
      },
      {
        type: "callout",
        flag: "solo Windows",
        html: "El loopback de audio del sistema es solo de Windows. En Linux, captura desde el micrófono.",
      },
      {
        type: "heading",
        id: "cuda-sin-memoria",
        text: "Error de CUDA / sin memoria",
      },
      {
        type: "prose",
        html: "LiveAudio monitorea la VRAM antes de cada transcripción. Cuando la memoria libre baja de unos <strong>500 MB</strong>, libera la caché de CUDA automáticamente y muestra <strong>“GPU saturada - VRAM baja”</strong>. Si aún así falla: cambia el dispositivo de inferencia de <strong>cuda</strong> a <strong>cpu</strong>, o carga un modelo más chico (<code>tiny</code> o <code>base</code>), y cierra otros programas que consuman VRAM (OBS con NVENC, juegos). Actualizar el driver de NVIDIA resuelve la mayoría de los fallos de runtime de CUDA.",
      },
      {
        type: "heading",
        id: "actualizar-desde-python",
        text: "Actualizar desde la versión Python (v1.0.0–v1.2.7)",
      },
      {
        type: "prose",
        html: "La v1.5.0 reemplaza las versiones Python con una app nativa Rust + Tauri 2. El instalador detecta instalaciones heredadas vía el registro de Windows (vistas de 32 y 64 bits), ejecuta el desinstalador viejo en silencio (NSIS e Inno Setup), detiene procesos restantes y elimina las carpetas Python obsoletas — mientras tu configuración y sesiones en <code>%APPDATA%\\LiveAudio</code> se conservan.",
      },
      {
        type: "heading",
        id: "obs-no-conecta",
        text: "OBS no conecta",
      },
      {
        type: "prose",
        html: "Asegúrate de que el motor esté iniciado — el puerto <code>8765</code> debe estar a la escucha. Si tu cortafuegos o antivirus bloquea el tráfico local, agrega una regla para permitir conexiones de localhost en el puerto del WebSocket.",
      },
      {
        type: "heading",
        id: "instalador-informa-copia-en-ejecucion",
        text: "El instalador informa una copia en ejecución",
      },
      {
        type: "prose",
        html: "Cierra todas las ventanas de LiveAudio primero — el instalador v1.5.0 detiene automáticamente los procesos restantes de la era Python, pero conviene detener una transcripción en curso desde la app (<strong>Detener Transcripción</strong>) antes de actualizar.",
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
        html: `El instalador aún no está firmado, así que SmartScreen puede avisar. Elige <strong>Más información &rarr; Ejecutar de todas formas</strong>. Los archivos exactos y sus hashes están publicados en la <a href="${REPO}/releases/tag/v1.5.0" target="_blank" rel="noopener noreferrer">página del release v1.5.0</a>.`,
      },
      {
        type: "heading",
        id: "recuperacion-de-instalacion",
        text: "Recuperación de instalación y descargas",
      },
      {
        type: "prose",
        html: "La mayoría de los problemas de instalación se arreglan volviendo a ejecutar el instalador — repara la app y conserva tu configuración y sesiones:",
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
            "Vuelve a ejecutar <code>LiveAudio_1.5.0_x64-setup.exe</code> — repara la instalación y mantiene <code>%APPDATA%\\LiveAudio</code> intacto.",
          ],
          [
            "Vienes de la versión Python",
            "El instalador elimina las versiones heredadas v1.0.0–v1.2.7 automáticamente y conserva tu configuración.",
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
          "<strong>Cómo:</strong> reproduce el problema, pulsa <strong>Export diagnostics</strong> en la app y revisa el JSON exportado (estados de procesos, tamaños de colas, estados audio/asr/ws).",
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
    navLabel: "configuración",
    metaTitle: "Docs de LiveAudio — Configuración",
    metaDescription:
      "Referencia de config.json de LiveAudio: ubicación del archivo en Windows, cada clave de opción con su tipo y un ejemplo completo.",
    eyebrow: "// docs / configuración",
    h1: "Configuración",
    lede:
      "LiveAudio escribe un config.json con valores por defecto sensatos en la primera ejecución. Cambia todo desde la GUI o edita el archivo directamente. Esta página es la referencia completa de claves.",
    blocks: [
      {
        type: "heading",
        id: "ubicacion-del-archivo",
        text: "Ubicación del archivo",
      },
      {
        type: "prose",
        html: "La v1.5.0 guarda tu configuración y sesiones en <code>%APPDATA%\\LiveAudio</code> en Windows — el instalador conserva esta carpeta cuando elimina las versiones Python heredadas.",
      },
      {
        type: "table",
        head: ["Build", "Ruta"],
        rows: [
          ["Windows x64 (v1.5.0, Rust)", "<code>%APPDATA%\\LiveAudio</code>"],
          ["Linux (heredado Python v1.2.7)", "<code>~/.local/share/liveaudio/data</code>"],
        ],
      },
      {
        type: "callout",
        flag: "migración",
        html: "¿Actualizas desde v1.0.0–v1.2.7? El instalador migra esta carpeta automáticamente — tu <code>config.json</code> y <code>sessions/</code> sobreviven el paso a Rust.",
      },
      {
        type: "prose",
        html: "<strong>Portable:</strong> ¿prefieres no instalar? Ejecuta <code>liveaudio-desktop.exe</code> (~15.6 MB) — la versión standalone de Windows no necesita instalación.",
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
          ["<code>output_dir</code>", "string", "Ruta a la carpeta de sesiones."],
          ["<code>device</code>", "string", '"cuda" o "cpu".'],
          [
            "<code>cpu_threads</code>",
            "number",
            "Número de hilos de CPU para inferencia.",
          ],
          [
            "<code>model_size</code>",
            "string",
            '"tiny", "base", "small" o "turbo".',
          ],
          [
            "<code>blacklist</code>",
            "string",
            "Palabras de filtro separadas por coma (ver la blacklist en primeros-pasos).",
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
            "Pacing entre ítems de backlog.",
          ],
          [
            "<code>silence_timeout</code>",
            "number",
            "Segundos de silencio antes de cortar un segmento.",
          ],
          [
            "<code>max_chunk_duration</code>",
            "number",
            "Segundos máximos antes de forzar el corte.",
          ],
          [
            "<code>audio_device</code>",
            "string | null",
            "Dispositivo seleccionado, o null para el default del sistema.",
          ],
          [
            "<code>selected_profile_id</code>",
            "string",
            '"fast", "balanced", "quality" o "stable".',
          ],
          [
            "<code>profile_mode</code>",
            "string",
            '"preset" o "custom" — pasa a "custom" automáticamente cuando editas un perfil integrado.',
          ],
          [
            "<code>ws_port</code>",
            "number",
            "Puerto del servidor WebSocket (default: 8765).",
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
            'Código de idioma para Whisper (ej. "en", "es").',
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
