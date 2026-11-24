import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const release = JSON.parse(read("src/config/release.json"));
const releaseModule = read("src/config/release.ts");
const pages = ["home", "download", "getting-started", "faq", "docs", "obs-setup", "product-tour", "vs"];
const content = pages.map((page) => read(`src/i18n/pages/${page}.ts`)).join("\n");
const llms = ["src/pages/llms.txt.ts", "src/pages/llms-full.txt.ts"].map(read).join("\n");
const excludes = (text, pattern) => assert.equal(pattern.test(text), false, `Unexpected claim: ${pattern}`);

function walkFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

test("centralized release config sets version 1.6.5 with no stray 1.6.0 installer or sponsors links", () => {
  assert.equal(release.version, "1.6.5");
  assert.match(releaseModule, /LiveAudio-Setup-\$\{LIVEAUDIO_VERSION\}\.exe/);
  assert.match(releaseModule, /CHECKSUMS_URL\s*=\s*RELEASE_LATEST_URL/);

  const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
  const files = [...walkFiles(join(root, "src")), ...walkFiles(join(root, "scripts"))];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.equal(
      /LiveAudio-Setup-1\.6\.0\.exe|liveaudio-cli-1\.6\.0-|releases\/(?:download|tag)\/v1\.6\.0/i.test(text),
      false,
      `Stray 1.6.0 release link in ${file}`,
    );
    assert.equal(
      /github\.com\/sponsors\/plynte-labs/i.test(text),
      false,
      `Broken sponsors link in ${file}`,
    );
  }
});

test("bilingual copy describes the native Rust runtime (no Python inference worker)", () => {
  excludes(content, /supervised Python (?:inference )?worker|worker de inferencia (?:en )?Python supervisado|libportaudio2|liveaudio-launcher|LiveAudio-1\.2\.7/i);
  assert.match(content, /zero Python/i);
  assert.match(content, /cero Python|sin Python|sin runtimes de Python/i);
});

test("NVIDIA Parakeet-TDT coverage spans EN/ES home, faq, download, vs, docs, and llms endpoints", () => {
  for (const file of [
    "src/i18n/pages/home.ts",
    "src/i18n/pages/faq.ts",
    "src/i18n/pages/download.ts",
    "src/i18n/pages/vs.ts",
    "src/i18n/pages/docs.ts",
    "src/pages/llms.txt.ts",
    "src/pages/llms-full.txt.ts",
  ]) {
    const text = read(file);
    assert.match(text, /Parakeet-TDT/i, `Missing Parakeet-TDT coverage in ${file}`);
  }
});

test("download copy uses centralized installer and does not claim standalone", () => {
  excludes(content, /portable standalone|standalone, no install|portable de Windows x64 — standalone|standalone de Windows no necesita/i);
  assert.match(read("src/i18n/pages/download.ts"), /WINDOWS_INSTALLER_FILENAME/);
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

test("LLM endpoints reflect the native runtime, Parakeet-TDT, and centralized installer", () => {
  excludes(llms, /portable standalone|first run only|well under a second|libportaudio2|LiveAudio-1\.2\.7/i);
  assert.match(llms, /zero Python/i);
  assert.match(llms, /WINDOWS_INSTALLER_FILENAME/);
  assert.match(llms, /WINDOWS_INSTALLER_URL/);
});

test("comparison does not publish undated competitor pricing or overclaim Linux exclusivity", () => {
  const vs = read("src/i18n/pages/vs.ts");
  excludes(vs, /\$0\.006|only offline Linux live captioner/i);
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

test("product-tour historical capture is labeled v1.5.0 and dialog heading is non-empty", () => {
  const tour = read("src/i18n/pages/product-tour.ts");
  assert.equal((tour.match(/eyebrow: "\/\/ v1\.5\.0 · rust \+ tauri 2"/g) ?? []).length, 2);
  excludes(tour, /faster, lighter, safer|más rápid[oa], más liger[oa], más segur[oa]|including the v1\.5\.1 Rust|incluido el espacio v1\.5\.1/i);

  const tourPage = read("src/components/ProductTourPage.astro");
  assert.match(tourPage, /aria-labelledby="tour-dialog-title"/);
  assert.match(tourPage, /<h2 id="tour-dialog-title" data-dialog-title>\{copy\.dialogLabel\}<\/h2>/);
});

test("privacy and terms disclosures are accurate, have no Vulkan/GGML/GGUF, and disclose outbound scope + Clarity only", () => {
  const privacyEn = read("src/pages/privacy.astro");
  const privacyEs = read("src/pages/es/privacy.astro");
  const termsEn = read("src/pages/terms.astro");
  const termsEs = read("src/pages/es/terms.astro");
  const legal = [privacyEn, privacyEs, termsEn, termsEs].join("\n");

  excludes(legal, /Vulkan|GGML|GGUF|Vercel Analytics|Speed Insights/i);
  assert.match(privacyEn, /Outbound Network Scope \(Desktop App\)/);
  assert.match(privacyEs, /Alcance de red saliente \(Aplicación de escritorio\)/);
  assert.match(privacyEn, /Audio and transcripts never leave your machine/i);
  assert.match(privacyEs, /El audio y las transcripciones nunca salen de tu equipo/i);
  assert.match(privacyEn, /Microsoft Clarity/i);
  assert.match(privacyEs, /Microsoft Clarity/i);
  assert.match(privacyEn, /privacy\.microsoft\.com\/privacystatement/);
  assert.match(privacyEs, /privacy\.microsoft\.com\/privacystatement/);
  assert.equal(/<main\b/.test(read("src/components/LegalPage.astro")), false, "LegalPage.astro must not nest <main>");

  const layout = read("src/layouts/Layout.astro");
  excludes(layout, /@vercel\/analytics/);
  assert.match(layout, /import\.meta\.env\.PROD/);
  assert.match(layout, /ytopmwq4lc/);
});

test("vercel.json enforces security headers, Clarity CSP, and /sitemap.xml redirect", () => {
  const vercel = JSON.parse(read("vercel.json"));
  const rootRule = vercel.headers.find((h) => h.source === "/(.*)");
  assert.ok(rootRule, "vercel.json must define /(.*) headers");

  const headerMap = Object.fromEntries(rootRule.headers.map((h) => [h.key, h.value]));
  assert.match(headerMap["Content-Security-Policy"], /https:\/\/www\.clarity\.ms https:\/\/scripts\.clarity\.ms/);
  assert.match(headerMap["Content-Security-Policy"], /https:\/\/\*\.clarity\.ms/);
  assert.match(headerMap["Content-Security-Policy"], /https:\/\/c\.clarity\.ms https:\/\/c\.bing\.com/);
  assert.equal(/vercel-scripts|vercel-insights/i.test(headerMap["Content-Security-Policy"]), false);
  assert.equal(headerMap["X-Content-Type-Options"], "nosniff");
  assert.equal(headerMap["X-Frame-Options"], "DENY");
  assert.equal(headerMap["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(headerMap["Permissions-Policy"], "camera=(), microphone=(), geolocation=()");

  const sitemapRedirect = (vercel.redirects ?? []).find((r) => r.source === "/sitemap.xml");
  assert.deepEqual(sitemapRedirect, {
    source: "/sitemap.xml",
    destination: "/sitemap-index.xml",
    permanent: true,
  });
});

test("404 emits noindex, nofollow via Layout.astro", () => {
  const layout = read("src/layouts/Layout.astro");
  const notFound = read("src/pages/404.astro");
  assert.match(layout, /<meta name="robots" content="noindex, nofollow" \/>/);
  assert.match(notFound, /noindex=\{true\}/);
});
