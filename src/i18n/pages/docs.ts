/**
 * Docs content model — LiveAudio v1.6.0 · 5 sections, bilingual.
 *
 * This is the CONTENT source for /docs/[section]/ (EN) + /es/docs/[section]/ (ES).
 * v1.6.0 is 100% native Rust + Tauri 2 with ONNX Runtime DirectML/CPU.
 * The legacy Python line (v1.0.0–v1.2.7) is covered only as a
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

const REPO = "https://github.com/plynte-labs/LiveAudio";

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

/** Installer and provisioning overview; actual recovery requires verification. */
const NATIVE_INSTALL_FLOW = `LiveAudio-Setup-1.6.0.exe
  │
  ├─ Back up custom settings and sessions before upgrading
  ├─ Consult the release notes and run the installer
  └─ 100% native Rust, zero Python setup; models download on first selection`;

/** config.json example — §8 values, blacklist trimmed to verbatim words. */
const CONFIG_EXAMPLE_EN = `{
    "output_dir": "C:\\\\streams\\\\sessions",
    "device": "cpu",
    "cpu_threads": 8,
    "model_size": "small (Balance CPU)",
    "blacklist": "amara.org, subtítulos por, gracias por ver",
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
    "cpu_threads": 8,
    "model_size": "small (Balance CPU)",
    "blacklist": "amara.org, subtítulos por, gracias por ver",
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
    navLabel: "overview",
    metaTitle: "LiveAudio docs — Overview",
    metaDescription:
      "What LiveAudio is and what it needs: a free, open-source (MIT) app that generates real-time Whisper captions 100% locally and streams them to OBS over a local WebSocket. Windows x64 native 100% Rust + Tauri 2 build; GPU optional.",
    eyebrow: "// docs / overview",
    h1: "LiveAudio documentation",
    lede:
      "LiveAudio is a free, open-source (MIT) desktop app that generates real-time Whisper speech captions 100% locally and streams them to OBS over a local WebSocket. v1.6.0 runs on Windows x64 as a native Rust + Tauri 2 build with ONNX Runtime DirectML/CPU — no cloud, no API key, no per-minute cost.",
    blocks: [
      {
        type: "heading",
        id: "what-it-is",
        text: "What LiveAudio is",
      },
      {
        type: "prose",
        html: "<strong>Plynte LiveAudio</strong> transcribes speech locally with Whisper and sends captions to OBS or other local WebSocket clients. Its architecture is 100% native Rust and Tauri 2 with an ONNX Runtime inference worker.",
      },
      {
        type: "list",
        items: [
          "<strong>Local transcription.</strong> Audio is transcribed on your machine without a cloud transcription service or API key.",
          "<strong>100% Native Rust pipeline.</strong> Rust handles audio capture, voice activity detection, and native Whisper inference over ONNX Runtime DirectML/CPU.",
          "<strong>Live settings.</strong> Change the audio device or model size from the app. Applying a change restarts transcription and reconnects OBS, and the app asks you to confirm first.",
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
            "Windows 10/11 x64 (installer), Linux x86_64 (AppImage / .deb). <strong>No macOS.</strong>",
          ],
          [
            "GPU",
            "<strong>Optional</strong> — DirectX 12 (DirectML) hardware acceleration for NVIDIA, AMD, and Intel GPUs, or CPU fallback. Optional CTranslate2 CUDA worker for NVIDIA.",
          ],
          ["RAM", "4 GB minimum, 8 GB+ recommended."],
          [
            "Disk",
            "250 MB for the app plus about 500 MB per model cache; models are stored locally in <code>%LOCALAPPDATA%\\LiveAudio\\models\\onnx</code>.",
          ],
          [
            "Runtime",
            "100% native Rust and ONNX Runtime — zero Python runtime dependencies.",
          ],
          [
            "Internet",
            "Only needed to download selected transcription models. Transcription runs 100% offline once models are stored locally.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "models: internet needed to download models",
        html: "No Python setup or virtual environment downloads are required. A newly selected model is downloaded on first selection; transcription runs completely offline once models are on disk.",
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
        html: "<strong>System-audio loopback (WASAPI) is Windows-only.</strong> On Linux (AppImage / .deb) capture from a microphone or a virtual audio source.",
      },
      {
        type: "heading",
        id: "how-it-installs",
        text: "How it installs (native build)",
      },
      {
        type: "prose",
        html: "Use the official Windows installer (<code>LiveAudio-Setup-1.6.0.exe</code>). The VC++ runtime is bundled, so it works on a clean Windows, and the app starts instantly with zero Python provisioning wait.",
      },
      {
        type: "code",
        label: "native install flow",
        code: NATIVE_INSTALL_FLOW,
      },
      {
        type: "prose",
        html: "Before upgrading, back up your settings and sessions and consult the release notes for installation guidance.",
      },
      {
        type: "heading",
        id: "where-data-lives",
        text: "Where your data lives",
      },
      {
        type: "prose",
        html: "LiveAudio stores configuration and session data locally. The following locations describe application data:",
      },
      {
        type: "table",
        head: ["Location", "Content"],
        rows: [
          [
            "<code>%APPDATA%\\LiveAudio</code>",
            "Settings (<code>config.json</code>) and <code>sessions/</code> — back these up before upgrading.",
          ],
          [
            "<code>%LOCALAPPDATA%\\LiveAudio</code>",
            "Downloaded models (<code>models\\onnx</code>) and the optional CUDA runtime. The uninstaller's &ldquo;delete app data&rdquo; option removes both folders (never during an update).",
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
        html: "By default LiveAudio runs Whisper on ONNX Runtime with DirectML (DirectX 12 GPUs) or the CPU. An NVIDIA CUDA engine is optional:",
      },
      {
        type: "list",
        items: [
          "Your explicit choice in the <strong>Advanced</strong> tab (compute device and ASR engine) — picking CUDA dims the CPU-threads control because inference runs on the GPU.",
          "The NVIDIA CUDA engine is used only after you explicitly install it (the NVIDIA card in the <strong>Setup</strong> tab). It needs an NVIDIA GPU and a driver that supports <strong>CUDA 12.8 or newer</strong>.",
          "Without an NVIDIA GPU, a supported driver or the installed engine, LiveAudio stays on ONNX Runtime (DirectML or CPU).",
        ],
      },
      {
        type: "heading",
        id: "updates",
        text: "Updates",
      },
      {
        type: "prose",
        html: `Find the installer, changelog and publisher hashes on <a href="${REPO}/releases/latest" target="_blank" rel="noopener noreferrer">GitHub Releases</a>. Back up your settings and sessions before upgrading.`,
      },
    ],
  },

  getting_started: {
    slug: "getting_started",
    navLabel: "getting-started",
    metaTitle: "LiveAudio docs — Getting started",
    metaDescription:
      "Install and run LiveAudio v1.6.0 on Windows x64, start instantly with 100% native Rust, and choose an audio device and profile.",
    eyebrow: "// docs / getting-started",
    h1: "Getting started",
    lede:
      "Use the official Windows installer. The 100% native Rust and Tauri desktop starts instantly with zero Python setup; only newly selected models require a download.",
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
          "<strong>Windows x64:</strong> <code>LiveAudio-Setup-1.6.0.exe</code> (graphical installer).",
          "<strong>Linux x86_64:</strong> the <code>.AppImage</code> or <code>.deb</code> from the v1.6.0 release page (updates are manual).",
          "<strong>CLI only:</strong> <code>liveaudio-cli-1.6.0-windows-x64.zip</code> and <code>liveaudio-cli-1.6.0-linux-x64.tar.gz</code> contain the CLI and ASR worker, not the desktop app.",
        ],
      },
      {
        type: "prose",
        html: "Zero Python dependencies are downloaded or installed. Whisper models download locally upon first selection.",
      },
      {
        type: "callout",
        flag: "updates",
        html: "On v1.5.1 or older, install v1.6.0 manually once: those versions have no in-app updater. From v1.6.0 the Windows app updates itself (signed with Minisign, never while you are transcribing or OBS is connected); on Linux, download new releases manually.",
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
        html: "Consult GitHub Releases for current installation guidance. Back up settings and sessions before upgrading or attempting recovery.",
      },
      {
        type: "heading",
        id: "gpu-auto-detect",
        text: "GPU auto-detection",
      },
      {
        type: "prose",
        html: "LiveAudio can detect an NVIDIA GPU. CUDA inference also needs compatible runtime libraries; detection alone does not establish that CUDA is ready. CPU transcription is available.",
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
        html: "Words and phrases are comma-separated and fully editable from the <strong>Advanced</strong> tab (<strong>Vocabulary and filters</strong>) — add the filler your stream tends to hallucinate, or clear entries you want to keep.",
      },
      {
        type: "heading",
        id: "models",
        text: "Models",
      },
      {
        type: "prose",
        html: "Pick a model in the <strong>Advanced</strong> tab (<strong>Engine and performance</strong>, Whisper Model Size). The audio device and profile are in the <strong>Setup</strong> tab. Larger models can need more memory and processing time. A newly selected model may require a download.",
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
        html: "On a metered connection, allow for runtime dependencies and model downloads. The required storage and download size depend on the components selected.",
      },
      {
        type: "heading",
        id: "session-files",
        text: "Session files",
      },
      {
        type: "prose",
        html: "Every session is saved to disk as a transcript (<code>transcript.jsonl</code>) WebVTT subtitles (<code>subtitles.vtt</code>) and SubRip subtitles (<code>subtitles.srt</code>):",
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
      "The LiveAudio WebSocket: ws://127.0.0.1:8765 (configurable ws_port, port fallback), the overlay URL, the JSON payload schema, OBS backlog policy (auto / live_only / send_all), loopback and Origin-allowlist security, and OBS Browser Source setup.",
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
          "<strong>Reconnect.</strong> The bundled overlay retries with exponential backoff from 1 s up to 8 s and cycles through the ports <code>ws_port</code> to <code>ws_port + 9</code>, so it also connects if OBS opens before LiveAudio. A client you write needs its own retry logic.",
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
    navLabel: "troubleshooting",
    metaTitle: "LiveAudio docs — Troubleshooting",
    metaDescription:
      "Fixes for common LiveAudio issues: no captions, GPU fallback, OBS not connecting on port 8765, loopback allowlist, upgrading from the Python version, audio cutting out — plus local-first diagnostics export.",
    eyebrow: "// docs / troubleshooting",
    h1: "Troubleshooting",
    lede:
      "Root-cause fixes for the most common setup issues — capture, DirectML/CUDA, the WebSocket connection, and Python-version upgrades — followed by the local-first diagnostics export.",
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
        html: "If transcription fails with a GPU error or runs out of memory, switch the compute device from <strong>cuda</strong> to <strong>cpu</strong> or load a smaller model (<code>tiny</code> or <code>base</code>) in the <strong>Advanced</strong> tab, and close other GPU-heavy programs (OBS with NVENC, games). Updating your GPU driver resolves many runtime failures.",
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
        html: `The installer is not code-signed yet, so SmartScreen may warn. Choose <strong>More info &rarr; Run anyway</strong>. The exact files and hashes are published on the <a href="${REPO}/releases/tag/v1.6.0" target="_blank" rel="noopener noreferrer">v1.6.0 release page</a>.`,
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
        html: "Settings and sessions may be stored under <code>%APPDATA%\\LiveAudio</code> on Windows. Back them up before upgrading.",
      },
      {
        type: "table",
        head: ["Build", "Path"],
        rows: [
          ["Windows x64 (v1.6.0, Rust)", "<code>%APPDATA%\\LiveAudio</code>"],
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
        html: "Use the official Windows installer; the CLI archives contain only the CLI and ASR worker, not the desktop app.",
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
          ["<code>device</code>", "string", '"cpu" (default) or "cuda".'],
          [
            "<code>cpu_threads</code>",
            "number",
            "Number of CPU threads for inference (default: half the logical cores, minimum 1).",
          ],
          [
            "<code>model_size</code>",
            "string",
            'Whisper model, stored as the label chosen in Advanced: it starts with tiny, base, small or turbo. Default: "small (Balance CPU)".',
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
    navLabel: "introducción",
    metaTitle: "Docs de LiveAudio — Introducción",
    metaDescription:
      "Qué es LiveAudio y qué necesita: una app gratuita y de código abierto (MIT) que genera subtítulos Whisper en tiempo real 100% en tu equipo y los envía a OBS por un WebSocket local. Build 100% nativa Rust + Tauri 2 para Windows x64; GPU opcional.",
    eyebrow: "// docs / introducción",
    h1: "Documentación de LiveAudio",
    lede:
      "LiveAudio es una app de escritorio gratuita y de código abierto (MIT) que genera subtítulos de voz Whisper en tiempo real 100% en tu equipo y los envía a OBS por un WebSocket local. La v1.6.0 corre en Windows x64 como build 100% nativa Rust + Tauri 2 con ONNX Runtime DirectML/CPU: sin nube, sin API key, sin costo por minuto.",
    blocks: [
      {
        type: "heading",
        id: "que-es",
        text: "Qué es LiveAudio",
      },
      {
        type: "prose",
        html: "<strong>Plynte LiveAudio</strong> transcribe voz localmente con Whisper y envía subtítulos a OBS u otros clientes WebSocket locales. Su arquitectura es 100% Rust nativo y Tauri 2 con un worker de inferencia sobre ONNX Runtime.",
      },
      {
        type: "list",
        items: [
          "<strong>Transcripción local.</strong> El audio se transcribe en tu equipo sin un servicio de transcripción en la nube ni claves API.",
          "<strong>Pipeline 100% Rust nativo.</strong> Rust gestiona la captura, la detección de voz y la inferencia Whisper nativa con ONNX Runtime DirectML/CPU.",
          "<strong>Ajustes en vivo.</strong> Cambia el dispositivo de audio o el tamaño del modelo desde la app. Aplicar un cambio reinicia la transcripción y reconecta OBS, y la app te pide confirmar antes.",
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
            "Windows 10/11 x64 (instalador), Linux x86_64 (AppImage / .deb). <strong>Sin macOS.</strong>",
          ],
          [
            "GPU",
            "<strong>Opcional</strong> — aceleración por hardware DirectX 12 (DirectML) para GPUs NVIDIA, AMD e Intel, o fallback a CPU. Worker opcional CTranslate2 CUDA para NVIDIA.",
          ],
          ["RAM", "4 GB mínimo, 8 GB+ recomendados."],
          [
            "Disco",
            "250 MB para la app más unos 500 MB por caché de modelo; los modelos se guardan en local en <code>%LOCALAPPDATA%\\LiveAudio\\models\\onnx</code>.",
          ],
          [
            "Runtime",
            "100% Rust nativo y ONNX Runtime — cero dependencias del runtime de Python.",
          ],
          [
            "Internet",
            "Solo necesaria para descargar los modelos de transcripción seleccionados. La transcripción funciona 100% sin conexión una vez guardados los modelos en local.",
          ],
        ],
      },
      {
        type: "callout",
        flag: "modelos: internet solo necesaria para descarga",
        html: "No se requieren descargas de configuración de Python ni de entornos virtuales. Un modelo recién seleccionado se descarga en su primera selección; la transcripción funciona 100% sin conexión una vez que los modelos están en disco.",
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
        html: "<strong>El loopback de audio del sistema (WASAPI) es solo de Windows.</strong> En Linux (AppImage / .deb) captura desde un micrófono o una fuente de audio virtual.",
      },
      {
        type: "heading",
        id: "como-se-instala",
        text: "Cómo se instala (build nativa)",
      },
      {
        type: "prose",
        html: "Usa el instalador oficial de Windows (<code>LiveAudio-Setup-1.6.0.exe</code>). Incluye el runtime VC++, así que funciona en un Windows limpio, y la app arranca instantáneamente sin fases de aprovisionamiento de Python.",
      },
      {
        type: "code",
        label: "native install flow",
        code: NATIVE_INSTALL_FLOW,
      },
      {
        type: "prose",
        html: "Antes de actualizar, respalda tu configuración y sesiones y consulta las notas de la versión para obtener instrucciones de instalación.",
      },
      {
        type: "heading",
        id: "donde-viven-tus-datos",
        text: "Dónde viven tus datos",
      },
      {
        type: "prose",
        html: "LiveAudio almacena la configuración y los datos de sesión localmente. Estas ubicaciones describen los datos de la aplicación:",
      },
      {
        type: "table",
        head: ["Ubicación", "Contenido"],
        rows: [
          [
            "<code>%APPDATA%\\LiveAudio</code>",
            "Tu configuración (<code>config.json</code>) y <code>sessions/</code> — haz una copia de seguridad antes de actualizar.",
          ],
          [
            "<code>%LOCALAPPDATA%\\LiveAudio</code>",
            "Modelos descargados (<code>models\\onnx</code>) y el runtime CUDA opcional. La opción &ldquo;borrar datos de la app&rdquo; del desinstalador elimina ambas carpetas (nunca durante una actualización).",
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
        html: "Por defecto LiveAudio ejecuta Whisper sobre ONNX Runtime con DirectML (GPUs DirectX 12) o la CPU. Un motor NVIDIA CUDA es opcional:",
      },
      {
        type: "list",
        items: [
          "Tu elección explícita en la pestaña <strong>Avanzado</strong> (dispositivo de cómputo y motor ASR) — elegir CUDA atenúa el control de hilos de CPU porque la inferencia corre en la GPU.",
          "El motor NVIDIA CUDA solo se usa después de instalarlo de forma explícita (la tarjeta NVIDIA en la pestaña <strong>Inicio</strong>). Requiere una GPU NVIDIA y un driver compatible con <strong>CUDA 12.8 o superior</strong>.",
          "Sin GPU NVIDIA, sin un driver compatible o sin el motor instalado, LiveAudio se queda en ONNX Runtime (DirectML o CPU).",
        ],
      },
      {
        type: "heading",
        id: "actualizaciones",
        text: "Actualizaciones",
      },
      {
        type: "prose",
        html: `Encontrarás el instalador, los cambios y los hashes publicados en <a href="${REPO}/releases/latest" target="_blank" rel="noopener noreferrer">GitHub Releases</a>. Respalda tu configuración y sesiones antes de actualizar.`,
      },
    ],
  },

  getting_started: {
    slug: "getting_started",
    navLabel: "primeros-pasos",
    metaTitle: "Docs de LiveAudio — Primeros pasos",
    metaDescription:
      "Instala LiveAudio v1.6.0 en Windows x64, arranca de forma instantánea con 100% Rust nativo y elige un dispositivo de audio y un perfil.",
    eyebrow: "// docs / primeros-pasos",
    h1: "Primeros pasos",
    lede:
      "Usa el instalador oficial de Windows. El escritorio 100% Rust nativo y Tauri arranca instantáneamente sin setup de Python; solo los modelos seleccionados requieren descarga.",
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
          "<strong>Windows x64:</strong> <code>LiveAudio-Setup-1.6.0.exe</code> (instalador gráfico).",
          "<strong>Linux x86_64:</strong> el <code>.AppImage</code> o el <code>.deb</code> de la página del release v1.6.0 (las actualizaciones son manuales).",
          "<strong>Solo CLI:</strong> <code>liveaudio-cli-1.6.0-windows-x64.zip</code> y <code>liveaudio-cli-1.6.0-linux-x64.tar.gz</code> contienen la CLI y el worker ASR, no la app de escritorio.",
        ],
      },
      {
        type: "prose",
        html: "Cero dependencias de Python se descargan o instalan. Los modelos Whisper se descargan localmente en su primera selección.",
      },
      {
        type: "callout",
        flag: "actualizaciones",
        html: "Si estás en la v1.5.1 o anterior, instala la v1.6.0 manualmente una vez: esas versiones no tienen actualizador integrado. Desde la v1.6.0 la app de Windows se actualiza sola (firmada con Minisign, nunca mientras transcribes o OBS está conectado); en Linux, descarga las nuevas versiones manualmente.",
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
        html: "Consulta GitHub Releases para conocer las instrucciones de instalación. Respalda la configuración y las sesiones antes de actualizar o intentar recuperar la instalación.",
      },
      {
        type: "heading",
        id: "deteccion-gpu",
        text: "Detección automática de GPU",
      },
      {
        type: "prose",
        html: "LiveAudio puede detectar una GPU NVIDIA. La inferencia CUDA también requiere bibliotecas compatibles; la detección no garantiza que CUDA esté preparado. La transcripción puede usar la CPU.",
      },
      {
        type: "heading",
        id: "perfiles",
        text: "Perfiles",
      },
      {
        type: "prose",
        html: "Los perfiles son presets sensibles a los FPS. Editar un perfil integrado lo convierte en <strong>Personalizado</strong>; los cambios solo se activan al pulsar <strong>Guardar</strong>.",
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
        html: "Las palabras y frases se separan por comas y son totalmente editables desde la pestaña <strong>Avanzado</strong> (<strong>Vocabulario y filtros</strong>) — agrega el relleno que tu stream tiende a alucinar, o borra entradas que quieras conservar.",
      },
      {
        type: "heading",
        id: "modelos",
        text: "Modelos",
      },
      {
        type: "prose",
        html: "Elige un modelo en la pestaña <strong>Avanzado</strong> (<strong>Motor y rendimiento</strong>, Tamaño de Modelo Whisper). El dispositivo de audio y el perfil están en la pestaña <strong>Inicio</strong>. Los modelos más grandes pueden necesitar más memoria y tiempo de procesamiento. Un modelo recién seleccionado puede requerir una descarga.",
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
        html: "En una conexión con límite de datos, considera las descargas de dependencias y modelos. El tamaño y el almacenamiento necesarios dependen de los componentes seleccionados.",
      },
      {
        type: "heading",
        id: "archivos-de-sesion",
        text: "Archivos de sesión",
      },
      {
        type: "prose",
        html: "Cada sesión se guarda en disco como un transcript (<code>transcript.jsonl</code>) subtítulos WebVTT (<code>subtitles.vtt</code>) y subtítulos SubRip (<code>subtitles.srt</code>):",
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
      "El WebSocket de LiveAudio: ws://127.0.0.1:8765 (ws_port configurable, puertos alternativos), la URL del overlay, el esquema del payload JSON, la política de backlog (auto / live_only / send_all), la seguridad loopback con lista de orígenes permitidos y la configuración del Browser Source en OBS.",
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
          "<strong>Reconexión.</strong> El overlay incluido reintenta con espera exponencial de 1 s hasta 8 s y recorre los puertos <code>ws_port</code> a <code>ws_port + 9</code>, así que también conecta si OBS abre antes que LiveAudio. Un cliente propio necesita su propia lógica de reintento.",
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
    navLabel: "solución-de-problemas",
    metaTitle: "Docs de LiveAudio — Solución de problemas",
    metaDescription:
      "Soluciones a los problemas más comunes de LiveAudio: sin subtítulos, fallback de GPU, OBS que no conecta en el puerto 8765, allowlist loopback, actualización desde la versión Python, audio que se corta — más la exportación de diagnóstico local-first.",
    eyebrow: "// docs / solución-de-problemas",
    h1: "Solución de problemas",
    lede:
      "Soluciones de raíz para los problemas de configuración más comunes — captura, DirectML/CUDA, la conexión WebSocket y actualizaciones desde versiones heredadas — seguidas de la exportación de diagnóstico local-first.",
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
        html: "Si la transcripción falla con un error de GPU o se queda sin memoria, cambia el dispositivo de cómputo de <strong>cuda</strong> a <strong>cpu</strong> o carga un modelo más chico (<code>tiny</code> o <code>base</code>) en la pestaña <strong>Avanzado</strong>, y cierra otros programas que usen mucho la GPU (OBS con NVENC, juegos). Actualizar el driver de la GPU resuelve muchos fallos de runtime.",
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
        html: `El instalador aún no está firmado, así que SmartScreen puede avisar. Elige <strong>Más información &rarr; Ejecutar de todas formas</strong>. Los archivos exactos y sus hashes están publicados en la <a href="${REPO}/releases/tag/v1.6.0" target="_blank" rel="noopener noreferrer">página del release v1.6.0</a>.`,
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
        html: "La configuración y las sesiones pueden estar en <code>%APPDATA%\\LiveAudio</code> en Windows. Haz una copia de seguridad antes de actualizar.",
      },
      {
        type: "table",
        head: ["Build", "Ruta"],
        rows: [
          ["Windows x64 (v1.6.0, Rust)", "<code>%APPDATA%\\LiveAudio</code>"],
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
        html: "Usa el instalador oficial de Windows; el ejecutable de escritorio separado no incluye la CLI ni los recursos.",
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
          ["<code>device</code>", "string", '"cpu" (por defecto) o "cuda".'],
          [
            "<code>cpu_threads</code>",
            "number",
            "Número de hilos de CPU para inferencia (por defecto: la mitad de los núcleos lógicos, mínimo 1).",
          ],
          [
            "<code>model_size</code>",
            "string",
            'Modelo Whisper, guardado como la etiqueta elegida en Avanzado: empieza con tiny, base, small o turbo. Por defecto: "small (Balance CPU)".',
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
