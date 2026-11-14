# Astro Dependency & Favicon Remediation

**Objective:** Resolve all confirmed current dependency vulnerabilities (`astro@7.3.8` -> `^7.4.12`) and add multi-resolution LiveAudio PNG favicons with cache-busting HTML `<link>` declarations so browsers, Vercel, and Google Search replace any stale Vite/Astro default icon.

**Problem:**
1. GitHub Dependabot lists 48 open alerts (#1–#53). Reconciliation shows 44 are stale (their packages are already patched in `pnpm-lock.yaml`, or `js-yaml` is absent, while GitHub Dependency Graph reports `dependencyGraphManifests: 0` and SBOM HTTP 404, frozen on June commit `7bb4e76` `astro@^6.4.8`). Exactly 2 real vulnerabilities remain in the current lockfile (`astro@7.3.8`): `GHSA-mh32-jxcr-mh9f` (`<= 7.4.4`, patched `7.4.5`, Low) and `GHSA-r3h5-4585-7x3w` (`>= 5.14.3, <= 7.4.6`, patched `7.4.7`, Medium).
2. Although `public/favicon.ico` already contains the LiveAudio chihuahua-with-microphone icon (`454d8bd`), `public/favicon.svg` (which held the Astro/Vite lightning icon in `7bb4e76`) was deleted (HTTP 404 in prod), and `src/layouts/Layout.astro` only declares `<link rel="icon" type="image/x-icon" href="/favicon.ico" />` with max ICO size 64x64 and no high-res PNG (`48x48`, `96x96`, `192x192`), `apple-touch-icon` (`180x180`), or cache-busting query/URLs for Vercel/Google Search crawlers.

**Why:** User requested Flash/Hydrogen subagent review, fixing the vulnerabilities, replacing/updating the stale Vite favicon seen on Vercel/Google with LiveAudio's app icon, and pushing the fixes to GitHub.

**Scope:**
- `package.json` (`astro` minimum range `^7.4.12`, plus minimal compatible `@astrojs/react` / `@astrojs/sitemap` patch alignment if clean) and `pnpm-lock.yaml` (preserving `pnpm-workspace.yaml` scoped `minimatch` overrides).
- `public/favicon-48x48.png`, `public/favicon-96x96.png`, `public/favicon-192x192.png`, `public/apple-touch-icon.png` generated from `public/LiveAudio-Fran.png` via `sharp`, preserving `public/favicon.ico`.
- `src/layouts/Layout.astro` `<head>` icon link tags.
- `tests/dependency-security.test.mjs` and `tests/favicon.test.mjs`.
- No unrelated lint fixes, UI changes, Dependabot alert dismissals, or edits outside `E:\LiveAudio.plynte`.

**Authorized scope:** User explicitly authorized reviewing vulnerabilities with subagents, applying dependency fixes, updating the landing favicon for Vercel/Google, and pushing to GitHub (`plynte-labs/liveaudio-landing`, `master`).

**TDD:** Strict TDD enabled (global user config). Test runners: `node --test tests/dependency-security.test.mjs tests/privacy-contact.test.mjs tests/web-content.test.mjs tests/favicon.test.mjs`, `pnpm audit --json`, `ASTRO_TELEMETRY_DISABLED=1 pnpm build` (sandbox requires `ASTRO_TELEMETRY_DISABLED=1` because `@astrojs/telemetry` writes outside workspace), `pnpm lint` (known 7 baseline errors).

**Delivery strategy:** `ask-on-risk` (authored changed lines forecast ~110 lines across `package.json`, `Layout.astro`, `tests/`, and `odd/tasks/`, well under 400 lines; binary PNG assets and generated `pnpm-lock.yaml` excluded from authored-line count).

## Tasks

- [x] **T1 — Reconcile 48 Dependabot alerts and establish baseline/compatibility surface.**
  - **Route:** Delegated (`vuln-alert-analyst` on Flash, `baseline-compat-analyst` on Hydrogen) + parent `gh api` / live production verification.
  - **Trigger evidence:** 4+ files and broad dependency/manifest analysis (Mapping trigger).
  - **Outcome:** Confirmed 44 stale alerts vs 2 active advisories in `astro@7.3.8`; baseline `13/13` tests pass, `pnpm build` generates 29 pages (`ASTRO_TELEMETRY_DISABLED=1`), `pnpm lint` has 7 known baseline errors; live prod `/favicon.ico` serves the chihuahua ICO while `/favicon.svg` returns 404 and `Layout.astro` lacks PNG/`apple-touch-icon` links.

- [x] **T2 — Upgrade `astro` to `^7.4.12` and remediate local vulnerabilities with TDD.**
  - **Route:** Delegated direct (`Model: 'inherit'` Hydrogen writer).
  - **Trigger evidence:** Multi-file prep + manifest/lockfile/test edits (`package.json`, `pnpm-lock.yaml`, `tests/dependency-security.test.mjs`).
  - **Outcome:** Observed RED (`node --test tests/dependency-security.test.mjs` exit 1 on `^7.3.8`/`7.3.8`; `pnpm audit --json` exit 1 with 2 Astro advisories). Upgraded `astro` to `^7.4.12`, `@astrojs/sitemap` to `^3.7.5`, and pinned `@astrojs/react` to `7.1.5` (later `7.1.6+` drops direct `vite: ^8` dependency and breaks build against root `devDependencies.vite@7.3.7`). Preserved `pnpm-workspace.yaml` scoped `minimatch: 11.0.3` overrides. Observed GREEN: `pnpm install --frozen-lockfile` exit 0; `pnpm audit --json` exit 0 (0 vulnerabilities across 525 entries); tests 16/16 pass; `pnpm build` (host Node `v22.23.4`) built 29 pages; `pnpm lint` retained only the 7 baseline errors. Committed on `fix/deps-and-favicon` as `93ee391`.

- [x] **T3 — Generate LiveAudio PNG favicons and update `Layout.astro` with TDD.**
  - **Route:** Delegated direct (`Model: 'inherit'` Hydrogen writer).
  - **Trigger evidence:** Multi-file edit across `tests/favicon.test.mjs`, `public/*.png`, and `src/layouts/Layout.astro`.
  - **Outcome:** Observed RED (`node --test tests/favicon.test.mjs` exit 1: 5 failures for missing PNGs and `Layout.astro` icon links). Generated `public/favicon-48x48.png` (3,787 B, 48x48 RGBA), `public/favicon-96x96.png` (10,978 B, 96x96 RGBA), `public/favicon-192x192.png` (33,609 B, 192x192 RGBA), and `public/apple-touch-icon.png` (22,675 B, 180x180 RGB on `#05080c`) from `public/LiveAudio-Fran.png` via `sharp`. Updated `src/layouts/Layout.astro` (`<!-- Icons -->`) with `/favicon.ico?v=2`, PNG links (`48x48`, `96x96`, `192x192`), and `apple-touch-icon`. Observed GREEN: all 22 tests pass; `pnpm build` (host Node `v22.23.4`) generated all 29 pages with all icons in `dist/` and updated links in `dist/index.html`; `pnpm lint` retained only the 7 baseline errors. Committed on `fix/deps-and-favicon` as `17d1f2b`.

- [x] **T4 — Independent verification of full diff, security audit, tests, build, and lint.**
  - **Route:** Delegated fresh verifier (`Model: 'inherit'` Hydrogen, read-only verification) + parent spot check.
  - **Trigger evidence:** RDD state `unknown` (`gentle-ai` not in PATH); requires independent verification.
  - **Outcome:** Fresh verifier inspected `7f236d9..HEAD` (`93ee391`, `17d1f2b`), confirmed `pnpm-workspace.yaml` scoped `minimatch: 11.0.3` overrides untouched, `public/favicon*.png` + `apple-touch-icon.png` + `favicon.ico` metadata/SHA-256 parity with all 29 built pages in `dist/`, `pnpm audit --json` exit 0 (0 vulnerabilities across 525 entries), `22/22` tests passing, `pnpm lint` unchanged at 7 baseline errors, and `git diff --check` clean. Parent independently spot-checked `22/22` tests, `pnpm build` (exit 0, 29 pages on host Node `v22.23.4`), and `pnpm install --frozen-lockfile` (exit 0). Note: `astro@7.4.12` and `@astrojs/react@7.1.5` enforce `engines.node >= 22.23.4` (sandbox Node `v22.18.0` exits 1 on engine check; host Node `v22.23.4` builds cleanly).

- [ ] **T5 — Work-unit commits, fast-forward to `master`, push to GitHub, and verify production.**
  - **Route:** Parent inline (`git`, `gh`, live HTTP check).
  - **Plan:** Commit this tracker on `fix/deps-and-favicon`, fast-forward merge `fix/deps-and-favicon` into `master`, push `master` to `origin`, verify Vercel production deployment status (including Node `>=22.23.4` compatibility) and live `https://liveaudio.opencohost.com/` HTML + icon endpoints, and record final outcome in Engram (`odd/astro-deps-and-favicon-remediation/tasks`).

## Acceptance criteria

- [x] `pnpm audit --json` exits 0 with 0 vulnerabilities across all dependencies.
- [x] `package.json` declares `astro` `^7.4.12` (or `>=7.4.7`), `pnpm-workspace.yaml` scoped `minimatch` overrides remain intact, and `pnpm install --frozen-lockfile` succeeds.
- [x] `public/` contains `favicon-48x48.png`, `favicon-96x96.png`, `favicon-192x192.png`, `apple-touch-icon.png` derived from `public/LiveAudio-Fran.png`, alongside `favicon.ico`.
- [x] `src/layouts/Layout.astro` exposes cache-busted `/favicon.ico?v=2`, PNG icon links (`48x48`, `96x96`, `192x192`), and `apple-touch-icon` (`180x180`).
- [x] All tests (`tests/dependency-security.test.mjs`, `tests/privacy-contact.test.mjs`, `tests/web-content.test.mjs`, `tests/favicon.test.mjs`) pass and `pnpm build` succeeds without regressions on Node `>= 22.23.4`.
- [ ] Changes committed as clean Conventional Commit work units, merged to `master`, pushed to `origin`, and verified live on `https://liveaudio.opencohost.com/`.
