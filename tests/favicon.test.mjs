import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";

const root = process.cwd();
const publicDir = join(root, "public");
const layoutPath = join(root, "src/layouts/Layout.astro");

const PNG_FAVICONS = [
  { filename: "favicon-48x48.png", size: 48 },
  { filename: "favicon-96x96.png", size: 96 },
  { filename: "favicon-192x192.png", size: 192 },
];

const EXPECTED_ICO_SIZES = [16, 32, 48, 64];

const EXPECTED_ICON_LINKS = [
  '<link rel="icon" href="/favicon.ico?v=2" sizes="any" />',
  '<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />',
  '<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />',
  '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />',
  '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
];

function readIcoDirectoryEntries(icoBuffer) {
  assert.ok(icoBuffer.length >= 6, "favicon.ico must contain a 6-byte ICONDIR header");

  const reserved = icoBuffer.readUInt16LE(0);
  const type = icoBuffer.readUInt16LE(2);
  const count = icoBuffer.readUInt16LE(4);

  assert.equal(reserved, 0, "favicon.ico ICONDIR reserved field must be 0");
  assert.equal(type, 1, "favicon.ico ICONDIR type field must be 1 (icon)");
  assert.ok(count > 0, "favicon.ico must contain at least one icon entry");
  assert.ok(
    icoBuffer.length >= 6 + count * 16,
    "favicon.ico buffer must cover all declared ICONDIRENTRY records",
  );

  const entries = [];
  for (let i = 0; i < count; i += 1) {
    const offset = 6 + i * 16;
    const width = icoBuffer.readUInt8(offset) || 256;
    const height = icoBuffer.readUInt8(offset + 1) || 256;
    const bytesInRes = icoBuffer.readUInt32LE(offset + 8);
    const imageOffset = icoBuffer.readUInt32LE(offset + 12);

    assert.ok(bytesInRes > 0, `ICO entry ${i} must have a positive payload size`);
    assert.ok(
      imageOffset + bytesInRes <= icoBuffer.length,
      `ICO entry ${i} payload must lie within favicon.ico bounds`,
    );

    entries.push({ width, height });
  }

  return entries;
}

test("public/favicon.ico exists with valid 16, 32, 48, and 64 px entries", () => {
  const icoPath = join(publicDir, "favicon.ico");
  assert.equal(existsSync(icoPath), true, "public/favicon.ico must exist");

  const entries = readIcoDirectoryEntries(readFileSync(icoPath));
  const squareSizes = entries
    .filter(({ width, height }) => width === height)
    .map(({ width }) => width);

  for (const expectedSize of EXPECTED_ICO_SIZES) {
    assert.ok(
      squareSizes.includes(expectedSize),
      `public/favicon.ico must include a ${expectedSize}x${expectedSize} entry`,
    );
  }
});

for (const { filename, size } of PNG_FAVICONS) {
  test(`public/${filename} exists as a ${size}x${size} RGBA PNG`, async () => {
    const iconPath = join(publicDir, filename);
    assert.equal(existsSync(iconPath), true, `public/${filename} must exist`);

    const metadata = await sharp(iconPath).metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
    assert.equal(metadata.hasAlpha, true);
  });
}

test("public/apple-touch-icon.png exists as a 180x180 opaque PNG on #05080c", async () => {
  const appleIconPath = join(publicDir, "apple-touch-icon.png");
  assert.equal(existsSync(appleIconPath), true, "public/apple-touch-icon.png must exist");

  const image = sharp(appleIconPath);
  const metadata = await image.metadata();
  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, 180);
  assert.equal(metadata.height, 180);
  assert.equal(metadata.hasAlpha, false);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 3);
  assert.deepEqual([data[0], data[1], data[2]], [5, 8, 12]);
});

test("Layout.astro declares updated favicon links and omits deprecated favicon.svg", () => {
  assert.equal(existsSync(join(publicDir, "favicon.svg")), false, "public/favicon.svg must not exist");

  const layoutSource = readFileSync(layoutPath, "utf8");
  assert.equal(
    layoutSource.includes("/favicon.svg"),
    false,
    "src/layouts/Layout.astro must not reference /favicon.svg",
  );

  for (const expectedLink of EXPECTED_ICON_LINKS) {
    assert.ok(
      layoutSource.includes(expectedLink),
      `src/layouts/Layout.astro must declare ${expectedLink}`,
    );
  }
});
