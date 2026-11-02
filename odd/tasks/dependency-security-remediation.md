# Dependency Security Remediation

**Objective:** Remove confirmed current dependency vulnerabilities with the smallest compatible dependency changes, avoiding unnecessary toolchain churn.

**Problem:** The baseline lockfile audit reported nine findings: eight in transitive `undici@8.11.2` and one in transitive `minimatch@10.2.6`. The corrected local graph audits clean. GitHub's 43 open Dependabot records have not been rescanned through a new push; many refer to older requirements already beyond their advisory fix versions in the baseline lockfile.

**Why:** The user asked to address website security vulnerabilities. Current advisory data and resolved dependency paths must guide the fix rather than alert counts alone.

**Scope:** `package.json`, `pnpm-lock.yaml`, and focused tests or documentation only if needed to demonstrate compatibility. A root `pnpm-workspace.yaml` is in-scope only if a scoped pnpm override is selected, because pnpm 11 reads overrides there rather than from `package.json#pnpm`. No unrelated lint, app, analytics, UI, or design changes. The initial authorization excluded remote push, merge, deploy, and alert dismissal; that boundary is superseded for integrated delivery by the user's later explicit request to include their English privacy contact change in the master merge/push. Alert dismissal, deploy, issue creation, and PR creation remain unauthorized.

**Authorized scope:** Local dependency remediation and local work-unit commits are authorized under ODD. The user later explicitly authorized merging/pushing the security fixes together with their owner-provided contact update to `master` in `plynte-labs/liveaudio-landing`, using the current GitHub CLI session; no alert dismissal, deployment, issue creation, or PR creation was authorized. This agent performs no commit or remote operation; parent owns that delivery.

**Route:** Delegated direct. Evidence: resolving the transitive dependency paths and writing dependency/lock changes needs multi-file preparation and compatibility analysis.

**TDD:** Strict TDD enabled by user configuration. Source of mode: user-provided project instructions. Security baseline command: `pnpm audit --json` (observed exit 1). Do not invent an application exploit test for a transitive package advisory. If an override is considered, add/identify meaningful compatibility proof for each affected consumer before changing dependency state.

**Delivery strategy:** `ask-on-risk`; initial forecast is under 400 authored changed lines. Generated lockfile churn is excluded from the authored-line heuristic but must be reviewed in full. No size exception is authorized by this strategy.

## Tasks

- [x] **T1 — Diagnose current dependency alerts.** Read-only baseline: clean `master` at `7d4718b52bc111a0b688a180cf1c1646f0edf8c8`, same as remote master; Node `v22.23.4`, pnpm `11.6.0`; `pnpm audit --json` exits 1 with 8 undici findings and 1 minimatch finding. GitHub lists 43 alerts (2 critical, 20 high, 17 medium, 4 low), with stale examples tied to Astro `6.4.8` despite current manifest/lock at Astro `7.3.8`. `undici` path is Astro → unifont 0.7.5 → undici 8.11.2; minimatch consumers are ESLint, `@eslint/config-array`, and `@typescript-eslint/typescript-estree`. Evidence: delegated diagnosis, 2026-11-01.
- [x] **T2 — Select and implement the smallest compatible dependency remediation.** Refreshed undici within unifont's existing range from 8.11.2 to 8.12.3 using `pnpm update undici --lockfile-only --depth Infinity`. Added exact 11.0.3 pnpm overrides only for ESLint, `@eslint/config-array`, and `@typescript-eslint/typescript-estree`; the latter was added only after full audit paths and installed caller source were checked and its project-service allowlist behavior was covered by a focused test. `package.json` is unchanged. Writer verification: frozen install passes; audit now reports 0 vulnerabilities; focused compatibility tests pass 3/3; existing web-content tests pass 9/9; build passes. Lint remains at the known 7 baseline errors. Independent verification remains T3.
- [x] **T3 — Independently verify local result and delivery boundary.** A fresh Luna verifier inspected the complete config/lock/test diff, verified actual consumer resolutions, and observed audit 0 findings, combined tests 12/12, build 29 pages, and clean diff check. Lint retained exactly seven baseline errors (six generated Astro declarations and one OsDetect hook). Parent independently repeated audit and all 12 tests successfully. No remote mutations occurred; local work-unit commit evidence follows below.
- [ ] **T4 — Integrate the owner's contact update and prepare authorized delivery.** Local parity is implemented and verified: the existing English owner edit was preserved; the same supplied address now appears only in the Spanish privacy contact's visible text and `mailto`, with the Spanish label retained. Added a focused route-pair regression test. Its RED run failed because the Spanish route still contained the placeholder; after the Spanish change it passed. Both generated routes contain the correct mailto. Local checks are complete; the parent-owned authorized master merge/push remains pending. This agent performed no commit or remote operation.

## Acceptance criteria

- [x] Every currently confirmed advisory is resolved with patched dependencies; scoped minimatch overrides remain outside upstream consumer semver ranges and have explicit behavioral proof. No advisory was dismissed or hidden.
- [x] Existing tests and build results were observed; three focused tests cover the overridden consumers and matching paths.
- [x] No broad latest-major upgrades or unrelated app/toolchain changes.
- [x] Local dependency work-unit commit `642e703867861d11419f4ddaeffe1147b3599387` contains the fixes, compatibility tests and recovery tracker after observed checks.
- [x] The owner-provided privacy contact is synchronized across English and Spanish privacy routes and regression-tested; parent delivery to master is pending.

## Baseline checks

- `pnpm audit --json` — observed RED, exit 1; 9 findings across undici and minimatch.
- `node --test tests/web-content.test.mjs` — existing suite (9 tests), not run during diagnosis.
- `pnpm build` — not run during diagnosis.
- `pnpm lint` — known baseline of 7 failures; not run during diagnosis.

## T2 preparation — minimatch compatibility (read-only, 2026-11-01)

- Current registry metadata: latest ESLint is 10.14.0 and still declares `minimatch: ^10.2.6`; latest `@eslint/config-array` is 0.23.5 and declares `minimatch: ^10.2.4`. Neither currently accepts v11 by its declared range. Exact metadata was checked with `pnpm view`.
- The upstream ESLint request to move to minimatch 11 remains open. An ESLint maintainer thread confirms the semver issue and describes a forced override working for ESLint 10.14.0, while warning that `eslint-plugin-import-x` uses removed `makeRe()` and breaks. This repository has no `eslint-plugin-import` or `eslint-plugin-import-x`; full `pnpm why minimatch` and `pnpm audit --json` identify three vulnerable consumers: ESLint, `@eslint/config-array`, and `@typescript-eslint/typescript-estree`.
- Exact installed caller APIs: ESLint and `@eslint/config-array` use `new Minimatch(...)` and `.match(...)`; TypeScript-ESTree `useProgramFromProjectService.js` calls `(0, minimatch.minimatch)(filePath, pattern, { dot: true })`. None call removed `makeRe()`, `Minimatch#regexp`, `AST`, or `debug` APIs. TypeScript-ESTree uses this in its `projectService.allowDefaultProject` path. A persistent test exercises both ESLint/config matching and the TypeScript parser's out-of-project allowlist path on the baseline and after the override.
- Latest TypeScript-ESTree is 8.72.1 and still declares `minimatch: ^10.2.2`; this project uses 8.71.2. The override is therefore also out-of-range/unsupported for this consumer. `minimatch@11.0.3` supports Node `18 || 20 || >=22`, compatible with runtime Node `v22.23.4`. GHSA describes the 10.2.6 defect with `optimizationLevel >= 2`; current call sites do not set that option, but that does not justify suppressing the audit finding.
- A narrow override is **technically defensible but remains out-of-range/unsupported**: all three installed consumers use retained APIs, and official tests/discussion show ESLint 10.14.0 works with 11.0.3. The remaining risk is semantic drift in v11 glob matching or an unexamined future consumer. The parent authorized exact scoped selectors `eslint>minimatch`, `@eslint/config-array>minimatch`, and `@typescript-eslint/typescript-estree>minimatch`, each pinned to `11.0.3`; no global override is used.
- pnpm 11 moved config out of `package.json#pnpm`; the repository already has a root `pnpm-workspace.yaml` with build approvals, minimum-release-age policy, and nine existing dependency overrides. The earlier statement that the file was absent was a read omission. Its original settings remain; only the three scoped minimatch overrides were added.
- A first exact-target attempt, `pnpm update undici@8.12.2 --lockfile-only`, exited 0 but did not change the indirect undici resolution. Current pnpm docs explain exact target versions cannot update a transitive-only dependency; use the range-respecting `pnpm update undici --lockfile-only --depth Infinity` instead. This changed only the transitive range resolution from 8.11.2 to 8.12.3, the current v8 patch release; advisory fixes begin at 8.12.2. Official release evidence: [undici 8.12.2 security release](https://github.com/nodejs/undici/releases/tag/v8.12.2) and [8.12.3 release](https://github.com/nodejs/undici/releases/tag/v8.12.3). Both commands have been run; the full lockfile diff is still pending final readback.
- On the first lock-only attempt, my initial workspace-config overwrite temporarily removed existing `allowBuilds` policy and caused `ERR_PNPM_IGNORED_BUILDS` for esbuild/sharp. I restored the exact HEAD policy/config, discarded the generated lockfile churn from that failed attempt, and reran updates successfully. No package build scripts were run during lock-only commands, no approvals/security checks were disabled, and a later `pnpm install --frozen-lockfile` passed with the original approvals intact.
- Verification is complete for the writer pass: `pnpm install --frozen-lockfile` exited 0; `pnpm audit --json` reports zero findings; `node --test tests/dependency-security.test.mjs` passes 3/3; `node --test tests/web-content.test.mjs` passes 9/9; `pnpm build` exits 0; `pnpm exec eslint --print-config src/components/islands/OsDetect.tsx` exits 0; ignored-file check exits 0 with the expected warning; `git diff --check` exits 0. `pnpm lint` still reports the known 7 errors (six generated `.astro` diagnostics and one OsDetect hook); no unrelated lint change was made. No application exploit test was added.
- Primary sources: [minimatch advisory](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249), [minimatch v11 changelog](https://github.com/isaacs/minimatch/blob/main/changelog.md), [ESLint upstream compatibility request and discussion](https://github.com/eslint/eslint/issues/21463), [pnpm 11 migration/configuration](https://pnpm.io/migration), [pnpm overrides syntax](https://pnpm.io/settings#overrides).

## Verification evidence and next step

TDD evidence: baseline `pnpm audit --json` was RED (9 findings); baseline compatibility tests had version assertions fail at minimatch 10.2.6 while semantic behavior passed. A test-harness path mistake initially resolved `@eslint/config-array` from the root hoist (10.2.5); the test was corrected to resolve it through ESLint's actual `createRequire` path. The third TypeScript parser version assertion was also RED at 10.2.6 while its project-service allowlist semantic test passed. After scoped overrides and lock refresh, `pnpm install --frozen-lockfile` exited 0; `pnpm audit --json` reports zero findings; `node --test tests/dependency-security.test.mjs` passes 3/3; `node --test tests/web-content.test.mjs` passes 9/9; `pnpm build` exits 0; `pnpm exec eslint --print-config src/components/islands/OsDetect.tsx` exits 0; ignored-file check exits 0 with expected ignored warning; `git diff --check` exits 0. `pnpm lint` still fails with 7 known errors (6 generated `.astro` errors and 1 OsDetect hook error); no unrelated lint changes made.

An initial config overwrite accidentally removed existing `allowBuilds` policy and caused `ERR_PNPM_IGNORED_BUILDS`; the original HEAD policy and nine existing overrides were restored before continuing. The file was never absent; the earlier absence statement was a read omission. A frozen install and all final checks ran after the corrected config. No package build approvals were disabled. Engram mirror remains pending because the host session is unregistered; no session ID was invented. No remote writes occurred. `src/pages/privacy.astro` is a separate user-owned edit and remains untouched/excluded. Independent T3 verification found no blockers. Native risk assessment returned high/unassessable because untracked files require a declared inventory; RDD is off, no review lifecycle was started, and independent verification was performed rather than treating the failure as low risk. Parent repeated audit and 12 tests successfully before the local commit.

## Delivery and maintenance boundary

- Local commit includes only `pnpm-workspace.yaml`, `pnpm-lock.yaml`, the focused dependency test, and this tracker. Rollback is the inverse of that single dependency work unit; preserve the unrelated owner email edit.
- Commit evidence: `642e703867861d11419f4ddaeffe1147b3599387` (`fix(deps): patch undici and scoped minimatch consumers`), 4 paths, 169 additions and 10 deletions. The owner email edit remains uncommitted and excluded.
- Current local work preserves the user's English privacy edit and adds only corresponding Spanish contact parity plus its test. Parent owns the authorized master merge/push; no remote action has yet been performed by this writer. GitHub alert closure remains unverified until that push and a rescan.
- Remove the three scoped overrides when upstream consumers accept a patched minimatch range, and rerun the compatibility tests and audit; passing the current tests is not universal API-compatibility proof.

## T4 local verification (2026-11-01)

- `node --test tests/privacy-contact.test.mjs` — RED before the Spanish change: expected failure because `src/pages/es/privacy.astro` contained `contact@opencohost.com`; GREEN after changing only the Spanish contact anchor to the owner-provided `gitrafuh@gmail.com` (the localized “Correo electrónico” label was unchanged).
- `node --test tests/privacy-contact.test.mjs tests/dependency-security.test.mjs tests/web-content.test.mjs` — passed, 13/13.
- `pnpm audit --json` — passed, 0 vulnerabilities across 503 dependency entries.
- `pnpm build` — passed, 29 pages generated; `dist/privacy/index.html` and `dist/es/privacy/index.html` both contain `mailto:gitrafuh@gmail.com` and neither contains the placeholder.
- `pnpm lint` — failed with the same 7 known baseline errors (6 generated `.astro` diagnostics and 1 `OsDetect.tsx` hook error); no unrelated lint fixes were made.
- `git diff --check` — passed. English owner edit was read and preserved unchanged; no commit or remote operation was performed by this agent. Parent merge/push remains pending.

## Relevant files

- `odd/tasks/dependency-security-remediation.md` — feature task, scope, baseline, progress, verification, and recovery state.
- `package.json` — root manifest and package manager/runtime dependency declarations; unchanged.
- `pnpm-workspace.yaml` — existing pnpm policy and dependency overrides; added three exact package-scoped minimatch overrides, preserved prior policy.
- `pnpm-lock.yaml` — replaces minimatch 10.2.6 with 11.0.3 for the three consumers and undici 8.11.2 with 8.12.3.
- `tests/dependency-security.test.mjs` — verifies patched minimatch resolution in each consumer and ESLint/TypeScript parser matching behavior.
- `tests/privacy-contact.test.mjs` — verifies the two privacy routes expose the same visible mailto address and neither contains the prior placeholder.
