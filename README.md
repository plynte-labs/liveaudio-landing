# LiveAudio Web — THE SIGNAL DESK

Marketing site and documentation surface for **Plynte LiveAudio** — a free, open-source
(MIT) desktop app that generates real-time Whisper speech captions **100% locally** and
streams them to OBS over a local WebSocket. This repository is the Astro 6 static site;
the root is unambiguously the Astro project.

---

## Product facts (v1.2.0)

LiveAudio runs on **Windows and Linux** (not macOS). It transcribes with Whisper
(`tiny` / `base` / `small` / `turbo`), trims silence with Silero VAD, and broadcasts
subtitle JSON over `ws://127.0.0.1:8765` to OBS Browser Source or any HTML/WebSocket
client on localhost.

- **Free & open-source (MIT).** No subscription, no API key, no per-minute cost.
- **Platforms:** Windows 10/11 x64 (mic + WASAPI system loopback) and Linux x86_64
  (mic capture; needs `libportaudio2`). System-audio loopback is **Windows-only**.
- **GPU optional;** CPU works. NVIDIA CUDA is optional but recommended (driver ≥ 525,
  VRAM ≥ 4 GiB), auto-detected.
- **100% local processing;** no telemetry. Internet only on first run to download
  Python, deps and models — fully offline afterward.
- **New in v1.2.0:** configurable Silero VAD onset pre-roll + threshold, and an OBS
  overlay with an adaptive vertical "ribbon" subtitle buffer, improved legibility and
  capped reveal-animation timing.

Real v1.2.0 download assets live at
`https://github.com/plynte-labs/LiveAudio/releases/download/v1.2.0/` (Windows installer
`.exe`, Linux x64 tarball, pip wheel, source, checksums); always-latest at
`https://github.com/plynte-labs/LiveAudio/releases/latest`.

---

## Tech stack

- **Framework:** [Astro 6](https://astro.build) — static output, EN-default +
  ES-prefixed i18n, thin route wrappers over shared page bodies.
- **Interactive islands:** React 19 via `@astrojs/react`, hydrated `client:*` only where
  needed (hero, cost slider, feature sandboxes, OS detection, mobile nav).
- **Styling:** design tokens and classes in `src/styles/global.css` (no hardcoded hex).
- **Fonts:** self-hosted Inter + JetBrains Mono (`@fontsource-variable/*`).
- **SEO / agents:** `@astrojs/sitemap`, JSON-LD (SoftwareApplication / FAQPage / HowTo),
  `llms.txt` + `llms-full.txt`, OG image generated with `sharp`.
- **Analytics / deploy:** `@vercel/analytics/astro` on Vercel. Build only — deploys are
  triggered by the maintainer.
- **Package manager:** **pnpm** (`pnpm-lock.yaml`). There is no `package-lock.json`.

---

## Route map

EN lives at `/`; every marketing page is mirrored under `/es/…`.

| Route | Page |
|---|---|
| `/` · `/es/` | Home — answer-first hero + conversion funnel |
| `/download/` · `/es/download/` | Real v1.2.0 download assets, OS detection, SmartScreen + checksum notes, system requirements |
| `/getting-started/` · `/es/getting-started/` | Activation: installer vs. `uv`, first run, GPU auto-detect, profiles |
| `/obs-setup/` · `/es/obs-setup/` | OBS Browser Source step-by-step |
| `/docs/[section]/` · `/es/docs/[section]/` | overview · getting_started · websocket_obs · troubleshooting · config |
| `/faq/` · `/es/faq/` | Citable Q&A |
| `/vs/` · `/es/vs/` | LiveAudio vs. OBS plugins / browser tools / cloud ASR |
| `/llms.txt` · `/llms-full.txt` · `/robots.txt` · `/sitemap-index.xml` | Crawl / agent surfaces |

---

## Commands

```bash
pnpm install      # install dependencies (pnpm only)
pnpm dev          # astro dev  — local dev server with HMR
pnpm build        # astro build — static output to dist/
pnpm preview      # astro preview — serve the built dist/
pnpm lint         # eslint
pnpm og           # regenerate the OG image (scripts/gen-og.mjs)
```

The production build emits 22 pages to `dist/`.

---

## Project structure

```
liveaudio-landing/
├── astro.config.mjs          # Astro 6 config (React, sitemap, Vercel analytics)
├── tsconfig.json             # extends astro/tsconfigs/strict
├── package.json              # pnpm scripts (dev/build = astro)
├── pnpm-lock.yaml
├── public/                   # brand assets, favicon, static files
├── scripts/gen-og.mjs        # OG image generator (sharp)
└── src/
    ├── pages/                # thin route wrappers (EN at /, ES under /es/) + endpoints
    ├── components/           # .astro sections + components/islands/*.tsx (React)
    ├── layouts/Layout.astro  # shared <head>, JSON-LD, chrome
    ├── i18n/                 # routes, ui chrome, per-page copy, island strings, jsonld
    └── styles/global.css     # design tokens + classes (single styling source)
```

---

## Content rules

- Use only design tokens and classes from `src/styles/global.css` — never hardcode hex.
- Keep EN/ES parity and keep every claim faithful to the real LiveAudio v1.2.0 product facts.
- Spanish artifacts use neutral/professional Spanish.
