// gen-og.mjs — generate localized LiveAudio Open Graph images (1200x630).
//
// THE SIGNAL DESK palette: carbon background, emerald "LiveAudio" wordmark,
// off-white/muted tagline, and a small green signal motif (waveform bars +
// neon live-dot). Tokens mirror src/styles/global.css — no off-palette colors.
//
// Outputs: public/og.png (EN), public/og-es.png (ES), public/og.svg.
// Run with: node scripts/gen-og.mjs
//
// FONT HANDLING: sharp's text API honors an explicit `fontfile` through
// freetype and loads the bundled variable .woff2 files directly. We render the
// background as a pure-vector SVG (no text) and composite each text layer.

import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const FONTS = join(PUBLIC, "fonts");
const RELEASE_JSON = join(ROOT, "src", "config", "release.json");

const INTER = join(FONTS, "Inter-Variable.woff2");
const MONO = join(FONTS, "JetBrainsMono-Variable.woff2");

// SIGNAL DESK tokens (from global.css) — keep in sync, never hardcode off-palette.
const COLOR = {
  bg: "#05080c", // Carbon — page
  surface: "#091411", // Deep Emerald Black — panel
  green: "#10b981", // primary accent / wordmark
  neon: "#00ff88", // RESERVED large/bold: live-dot, signal edge
  amber: "#ffb454", // operator attention
  textStrong: "#f4f7f5", // display
  text: "#e5e7eb", // body
  textMuted: "#8aa39b", // captions/labels
  border: "#122c22", // instrument hairline
};

const W = 1200;
const H = 630;
const PAD_X = 90;

/**
 * Render a text run via sharp's text engine (freetype loads the variable
 * .woff2 by fontfile). Returns { buffer, width, height }.
 */
async function textLayer({ text, fontfile, font, spacing }) {
  const markup = spacing
    ? `<span letter_spacing="${spacing}">${text}</span>`
    : text;
  const img = sharp({
    text: { text: markup, fontfile, font, dpi: 72, rgba: true },
  });
  const buf = await img.png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buffer: buf, width: meta.width ?? 0, height: meta.height ?? 0 };
}

function signalBars(x, y, height) {
  const heights = [10, 22, 38, 54, 30, 46, 64, 40, 24, 50, 34, 18, 28, 44, 20];
  const barW = 6;
  const gap = 10;
  let out = "";
  heights.forEach((hRaw, i) => {
    const h = Math.round((hRaw / 64) * height);
    const bx = x + i * (barW + gap);
    const by = y + (height - h);
    const isPeak = hRaw === 64;
    const fill = isPeak ? COLOR.neon : COLOR.green;
    const opacity = isPeak ? 1 : 0.85;
    out += `<rect x="${bx}" y="${by}" width="${barW}" height="${h}" rx="3" fill="${fill}" opacity="${opacity}"/>`;
  });
  return out;
}

async function renderCard(bg, outPath, copy) {
  const eyebrow = await textLayer({
    text: `<span foreground="${COLOR.textMuted}">${copy.eyebrow}</span>`,
    fontfile: MONO,
    font: "JetBrains Mono 21",
    spacing: 2400,
  });
  const wordmark = await textLayer({
    text: `<span foreground="${COLOR.green}">LiveAudio</span>`,
    fontfile: INTER,
    font: "Inter 800 118",
    spacing: -2000,
  });
  const taglineA = await textLayer({
    text: `<span foreground="${COLOR.textStrong}">${copy.taglineA}</span>`,
    fontfile: INTER,
    font: "Inter 700 40",
  });
  const taglineB = await textLayer({
    text: `<span foreground="${COLOR.text}">${copy.taglineB}</span>`,
    fontfile: INTER,
    font: "Inter 500 28",
  });
  const specA = await textLayer({
    text: `<span foreground="${COLOR.textMuted}">${copy.specA}</span>`,
    fontfile: MONO,
    font: "JetBrains Mono 22",
    spacing: 800,
  });
  const specB = await textLayer({
    text: `<span foreground="${COLOR.green}">${copy.specB}</span>`,
    fontfile: MONO,
    font: "JetBrains Mono 22",
    spacing: 800,
  });

  const composites = [
    { input: eyebrow.buffer, left: PAD_X + 28, top: 100 },
    { input: wordmark.buffer, left: PAD_X - 4, top: 168 },
    { input: taglineA.buffer, left: PAD_X, top: 344 },
    { input: taglineB.buffer, left: PAD_X, top: 408 },
    { input: specA.buffer, left: PAD_X, top: 486 },
    { input: specB.buffer, left: PAD_X, top: 530 },
  ];

  await sharp(Buffer.from(bg))
    .composite(composites)
    .png()
    .toFile(outPath);

  console.log(`[gen-og] wrote ${outPath} (${W}x${H})`);
}

async function build() {
  if (!existsSync(INTER) || !existsSync(MONO)) {
    throw new Error(
      `Bundled fonts missing in ${FONTS} (need Inter-Variable.woff2 + JetBrainsMono-Variable.woff2).`,
    );
  }

  const release = JSON.parse(await readFile(RELEASE_JSON, "utf8"));
  const versionTag = `v${release.version}`;

  const barsX = W - PAD_X - 15 * 16;

  const bg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="22%" cy="34%" r="60%">
      <stop offset="0%" stop-color="${COLOR.green}" stop-opacity="0.16"/>
      <stop offset="70%" stop-color="${COLOR.green}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hair" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${COLOR.green}" stop-opacity="0"/>
      <stop offset="12%" stop-color="${COLOR.green}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${COLOR.green}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${COLOR.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${COLOR.border}" stroke-width="2"/>
  <circle cx="${PAD_X + 7}" cy="112" r="7" fill="${COLOR.neon}"/>
  <rect x="${PAD_X}" y="300" width="${W - PAD_X * 2}" height="2" fill="url(#hair)"/>
  ${signalBars(barsX, 92, 56)}
</svg>`;

  if (!existsSync(PUBLIC)) await mkdir(PUBLIC, { recursive: true });

  await renderCard(bg, join(PUBLIC, "og.png"), {
    eyebrow: `PLYNTE LIVEAUDIO ${versionTag} · WINDOWS X64 &amp; LINUX X86_64`,
    taglineA: "Real-time local captions for OBS",
    taglineB: "NVIDIA Parakeet-TDT + Whisper · Rust · MIT · No API key",
    specA: "onnx runtime · directml / cpu / opt. cuda · ws://127.0.0.1:8765",
    specB: "100% local · Zero data collected · Zero Python",
  });

  await renderCard(bg, join(PUBLIC, "og-es.png"), {
    eyebrow: `PLYNTE LIVEAUDIO ${versionTag} · WINDOWS X64 Y LINUX X86_64`,
    taglineA: "Subtítulos locales en tiempo real para OBS",
    taglineB: "NVIDIA Parakeet-TDT + Whisper · Rust · MIT · Sin clave API",
    specA: "onnx runtime · directml / cpu / cuda opc. · ws://127.0.0.1:8765",
    specB: "100% local · Cero datos recopilados · Cero Python",
  });

  await writeFile(join(PUBLIC, "og.svg"), bg, "utf8");
}

build().catch((err) => {
  console.error("[gen-og] failed:", err);
  process.exit(1);
});
