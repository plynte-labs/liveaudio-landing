// gen-og.mjs — generate the LiveAudio Open Graph image (1200x630).
//
// THE SIGNAL DESK palette: carbon background, emerald "LiveAudio" wordmark,
// off-white/muted tagline, and a small green signal motif (waveform bars +
// neon live-dot). Tokens mirror src/styles/global.css — no off-palette colors.
//
// Output: public/og.png. Run with: node scripts/gen-og.mjs
//
// FONT HANDLING: sharp renders SVG via its bundled librsvg, which resolves
// fonts through fontconfig BY FAMILY NAME and (in this build) does NOT index
// our .woff2 files — so SVG <text> falls back to a serif. sharp's TEXT API,
// however, honors an explicit `fontfile` through freetype and DOES load the
// variable .woff2 directly. So we render the background as a pure-vector SVG
// (no text) and COMPOSITE each text run as a sharp text layer using the real
// Inter / JetBrains Mono faces. Fully deterministic, no system fonts.

import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const FONTS = join(PUBLIC, "fonts");

const INTER = join(FONTS, "Inter-Variable.woff2");
const MONO = join(FONTS, "JetBrainsMono-Variable.woff2");

// SIGNAL DESK tokens (from global.css) — keep in sync, never hardcode off-palette.
const COLOR = {
  bg: "#05080c", // Carbon — page
  surface: "#091411", // Deep Emerald Black — panel
  green: "#10b981", // primary accent / wordmark
  neon: "#00ff88", // RESERVED large/bold: live-dot, signal edge
  amber: "#ffb454", // operator attention (timing chip)
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
 * .woff2 by fontfile). `text` may contain Pango markup (e.g. <span
 * foreground="#..."> for per-token color). Returns { buffer, width, height }.
 *
 * @param {object} o
 * @param {string} o.text   Pango markup or plain text.
 * @param {string} o.fontfile Absolute path to the .woff2.
 * @param {string} o.font   Pango font string, e.g. "Inter 800 46" (size in px @ 72dpi).
 * @param {number} [o.spacing] Letter-spacing in 1/1024th em units (Pango letter_spacing). Omit for none.
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

// Build the green "signal motif": a row of waveform bars in emerald with a
// single neon peak — the reserved bold accent. Pure geometry, in-palette.
function signalBars(x, y, height) {
  const heights = [10, 22, 38, 54, 30, 46, 64, 40, 24, 50, 34, 18, 28, 44, 20];
  const barW = 6;
  const gap = 10;
  let out = "";
  heights.forEach((hRaw, i) => {
    const h = Math.round((hRaw / 64) * height);
    const bx = x + i * (barW + gap);
    const by = y + (height - h);
    const isPeak = hRaw === 64; // tallest bar carries the neon accent
    const fill = isPeak ? COLOR.neon : COLOR.green;
    const opacity = isPeak ? 1 : 0.85;
    out += `<rect x="${bx}" y="${by}" width="${barW}" height="${h}" rx="3" fill="${fill}" opacity="${opacity}"/>`;
  });
  return out;
}

async function build() {
  if (!existsSync(INTER) || !existsSync(MONO)) {
    throw new Error(`Bundled fonts missing in ${FONTS} (need Inter-Variable.woff2 + JetBrainsMono-Variable.woff2).`);
  }

  const barsX = W - PAD_X - 15 * 16; // top-right cluster, aligned to the right gutter

  // --- Pure-vector background (carbon plane + one emerald glow + hairline + bars + live-dot) ---
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
  <!-- eyebrow live-dot (neon — reserved bold) -->
  <circle cx="${PAD_X + 7}" cy="112" r="7" fill="${COLOR.neon}"/>
  <!-- accent hairline under the wordmark -->
  <rect x="${PAD_X}" y="300" width="${W - PAD_X * 2}" height="2" fill="url(#hair)"/>
  <!-- signal motif (top-right) -->
  ${signalBars(barsX, 92, 56)}
</svg>`;

  // --- Real-font text layers (composited over the background) ---
  const eyebrow = await textLayer({
    text: `<span foreground="${COLOR.textMuted}">PLYNTE LIVEAUDIO v1.2.0 · WINDOWS &amp; LINUX</span>`,
    fontfile: MONO,
    font: "JetBrains Mono 24",
    spacing: 3000,
  });
  const wordmark = await textLayer({
    text: `<span foreground="${COLOR.green}">LiveAudio</span>`,
    fontfile: INTER,
    font: "Inter 800 118",
    spacing: -2000,
  });
  const taglineA = await textLayer({
    text: `<span foreground="${COLOR.textStrong}">Real-time local captions for OBS</span>`,
    fontfile: INTER,
    font: "Inter 700 46",
  });
  const taglineB = await textLayer({
    text: `<span foreground="${COLOR.text}">Windows + Linux · MIT · 100% local · no API key</span>`,
    fontfile: INTER,
    font: "Inter 500 34",
  });
  const specA = await textLayer({
    text: `<span foreground="${COLOR.textMuted}">whisper · silero vad · ws://127.0.0.1:8765</span>`,
    fontfile: MONO,
    font: "JetBrains Mono 23",
    spacing: 1000,
  });
  const specB = await textLayer({
    text: `<span foreground="${COLOR.textMuted}">latency </span><span foreground="${COLOR.amber}">&lt; 1s · tunable</span>`,
    fontfile: MONO,
    font: "JetBrains Mono 23",
    spacing: 1000,
  });

  // Composite. `top` is the layer's top edge; values chosen to match the
  // background hairline at y=300 and keep an editorial vertical rhythm.
  const composites = [
    { input: eyebrow.buffer, left: PAD_X + 28, top: 100 },
    { input: wordmark.buffer, left: PAD_X - 4, top: 168 },
    { input: taglineA.buffer, left: PAD_X, top: 344 },
    { input: taglineB.buffer, left: PAD_X, top: 408 },
    { input: specA.buffer, left: PAD_X, top: 488 },
    { input: specB.buffer, left: PAD_X, top: 532 },
  ];

  if (!existsSync(PUBLIC)) await mkdir(PUBLIC, { recursive: true });
  const out = join(PUBLIC, "og.png");

  await sharp(Buffer.from(bg))
    .composite(composites)
    .png()
    .toFile(out);

  // Persist the vector background for traceability/regeneration.
  await writeFile(join(PUBLIC, "og.svg"), bg, "utf8");

  console.log(`[gen-og] wrote ${out} (${W}x${H})`);
}

build().catch((err) => {
  console.error("[gen-og] failed:", err);
  process.exit(1);
});
