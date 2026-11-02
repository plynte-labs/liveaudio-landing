import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const oldPlaceholder = "contact@opencohost.com";
const privacyPages = [
  join(root, "src/pages/privacy.astro"),
  join(root, "src/pages/es/privacy.astro"),
];

function extractVisibleMailto(source) {
  const match = source.match(/<a\s+href="mailto:([^\"]+)">([^<]+)<\/a>/);
  assert.ok(match, "privacy page should expose a visible email mailto link");
  assert.equal(match[1], match[2], "visible contact must match the mailto destination");
  return match[2];
}

test("English and Spanish privacy contact mailto addresses match without the placeholder", () => {
  const contacts = privacyPages.map((path) => {
    const source = readFileSync(path, "utf8");
    assert.equal(source.includes(oldPlaceholder), false, `${path} must not use the placeholder address`);
    return extractVisibleMailto(source);
  });

  assert.equal(contacts[0], contacts[1]);
});
