import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const pages = ["home", "download", "getting-started", "faq", "docs", "obs-setup", "product-tour"];
const content = pages.map((page) => read(`src/i18n/pages/${page}.ts`)).join("\n");
const llms = ["src/pages/llms.txt.ts", "src/pages/llms-full.txt.ts"].map(read).join("\n");
const excludes = (text, pattern) => assert.equal(pattern.test(text), false, `Unexpected claim: ${pattern}`);

test("bilingual copy does not deny the Python inference runtime", () => {
  excludes(content, /no Python runtime|sin (?:ningún )?runtime de Python|sin runtime de Python|no hay runtime de Python|no necesita ningún runtime de Python/i);
  assert.match(content, /Python.*(?:worker|inferencia)|(?:worker|inferencia).*Python/i);
});

test("download copy does not describe the incomplete executable as standalone", () => {
  excludes(content, /portable standalone|standalone, no install|portable de Windows x64 — standalone|standalone de Windows no necesita/i);
  assert.match(read("src/i18n/pages/download.ts"), /LiveAudio_1\.5\.1_x64-setup\.exe/);
});

test("copy does not guarantee first-run-only internet or universal latency", () => {
  excludes(content, /internet (?:is )?(?:needed|required) only|internet solo (?:en|la)|well under a second|sub-second to about one second/i);
});

test("OBS instructions use copied URL without local-file mode", () => {
  const obs = read("src/i18n/pages/obs-setup.ts");
  assert.match(obs, /Local File unchecked/i);
  assert.match(obs, /Archivo local.*desmarcad/i);
  excludes(obs, /%LOCALAPPDATA%\\\\LiveAudio\\\\data/);
});

test("LLM endpoints reflect the hybrid runtime and official installer", () => {
  excludes(llms, /no Python runtime|portable standalone|first run only|well under a second/i);
  assert.match(llms, /Python.*worker/i);
  assert.match(llms, /LiveAudio_1\.5\.1_x64-setup\.exe/);
});

test("comparison does not publish undated competitor pricing", () => {
  excludes(read("src/i18n/pages/vs.ts"), /\$0\.006/);
});

test("update and migration guidance does not promise unverified outcomes", () => {
  const text = ["src/i18n/pages/home.ts", "src/i18n/pages/docs.ts", "src/i18n/pages/download.ts", "src/pages/llms-full.txt.ts"].map(read).join("\n");
  excludes(text, /one.click (?:in.app )?update|updates? (?:arrive|in one click)|actualiz(?:a|aciones).*un clic|(?:settings|sessions).* (?:are preserved|survive)|(?:configuración|sesiones).*(?:se conservan|sobreviven)|repairs the install|repara la instalación/i);
});

test("OBS guidance says to start the system before copying the URL in both languages", () => {
  for (const path of ["src/i18n/pages/obs-setup.ts", "src/i18n/pages/docs.ts", "src/i18n/pages/getting-started.ts"]) {
    const text = read(path);
    assert.match(text, /start (?:the )?system[^.]*copy/i, path);
    assert.match(text, /inicia (?:el )?sistema[^.]*copia/i, path);
  }
  assert.match(read("src/pages/llms-full.txt.ts"), /start (?:the )?system[^.]*copy/i);
});

test("product-tour historical capture is labeled v1.5.0 without unsupported comparisons", () => {
  const tour = read("src/i18n/pages/product-tour.ts");
  assert.equal((tour.match(/eyebrow: "\/\/ v1\.5\.0 · rust \+ tauri 2"/g) ?? []).length, 2);
  excludes(tour, /faster, lighter, safer|más rápid[oa], más liger[oa], más segur[oa]|including the v1\.5\.1 Rust|incluido el espacio v1\.5\.1/i);
});
