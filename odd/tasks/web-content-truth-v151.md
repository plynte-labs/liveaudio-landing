# LiveAudio v1.5.1 website content truth

## Objective and problem

Make the English and Spanish website explain the released product and installation accurately. Current copy conflates the Rust desktop and core with the Python inference worker, describes an incomplete executable as standalone, and makes installation, performance, and OBS claims beyond the available evidence.

## Authorized scope and constraints

- Correct existing website content, download guidance, metadata and LLM endpoints without redesign or new dependencies.
- Preserve existing website analytics; do not change the application, install it, add dependencies, or use Vercel credentials.
- **History:** the initial request prohibited commits, pushes and deployment; T1–T3 were completed under that restriction.
- **Superseding authorization:** the user now authorizes the parent to commit, merge locally into `master`, and push to `origin` at `https://github.com/plynte-labs/liveaudio-landing.git` using the current CLI session. This does not authorize claiming a production deployment or using Vercel credentials.
- Delivery strategy: `exception-ok`; the maintainer approved `size:exception` for a single delivery above 400 changed lines. No PR, issue or label is requested.
- RDD is off. Use published release and tagged source as evidence; do not describe source inspection as a clean-install or runtime test.
- Clean Windows VM, installer execution, OBS, offline and CUDA runtime checks remain pending. Do not run the installer on this host.
- Planning estimate: about 300–600 authored changed lines; this is a heuristic, not a reason to split or omit proof.
- Engram recovery mirror `odd/web-content-truth-v151/tasks` is pending: the host session is unregistered. Do not create a session identity.

## Tasks

- [x] **T1 — Evidence and scope.** Route: delegated; evidence and documentation preparation across multiple files. Evidence matrix, proposed changes, and release checklist created and read back; untested runtime behavior flagged. No commit by explicit instruction.
- [x] **T2 — Website content and regression tests.** Route: delegated; non-trivial changes across bilingual copy, metadata, and LLM endpoints. Initial tests RED 0/6 then GREEN 6/6; bounded correction tests RED 6/9 then GREEN 9/9. Build passed; lint retained seven baseline errors. No commit.
- [x] **T3 — Independent checks and readiness.** Route: delegated; the corrected candidate received independent source and generated-output checks. Results and unperformed acceptance checks are recorded below. No commit, push, or deploy.
- [x] **T4 — Authorized delivery.** Route: parent; committed `84f886d416295cc105764721b89d252790374c44`, fast-forward merged into `master`, and pushed to the authorized `origin` using the current CLI session. GitHub API and remote ref confirmed the commit. Vercel Production deployment `7482656626` reported success; fresh public EN/ES home and OBS setup responses returned HTTP 200 with corrected content.

## TDD and verification

Strict TDD: **enabled**, from user-provided session instructions. Authorized new dependency-free runner: `node --test tests/web-content.test.mjs`. Observe RED before production changes and GREEN afterwards. Also run `pnpm build`, `pnpm lint`, and `git diff --check`; record actual results and any failures.

## Acceptance criteria

- Website avoids unsupported architecture, portable-executable, provisioning, latency, GPU, benchmark, and OBS instructions.
- Official installer is the primary Windows path; EN/ES, metadata, LLM output, and download guidance agree.
- Remaining claims trace to evidence; clean-install, functional OBS, offline and CUDA checks remain explicitly pending until actually performed.
- Existing layout and analytics are unchanged; no application changes, deployment operation, or new dependencies.

## Progress and next step

T1–T4 are complete for the authorized website correction and GitHub delivery; **full runtime acceptance remains incomplete**. An independent verifier confirmed the four corrected findings in source and generated output, ran tests (9/9) and `git diff --check`, and found no missing simple root-relative targets across 18 generated EN/ES pages. An earlier independent build passed (29 pages); lint failed with seven unchanged baseline errors. The static link check did not verify redirects or external links. No controllable browser was available, so desktop, mobile and keyboard checks were not performed. Clean-VM, installer hash, OBS, offline and CUDA checks remain pending. Native risk assessment of the earlier candidate returned high/unassessable due to untracked files; RDD is off and no review lifecycle was started. The Engram mirror remains pending. No application change or direct Vercel operation was performed; the GitHub push triggered the observed production deployment.

Fresh pre-delivery checks: `node --test tests/web-content.test.mjs` exit 0 (9/9); `pnpm build` exit 0 (29 pages); `pnpm lint` exit 1 with the same seven baseline errors (six generated `.astro` declaration errors and the existing `OsDetect.tsx` React hook error); `git diff --check` exit 0 with the README LF/CRLF warning. No new failure was observed.

Delivery evidence: content commit `84f886d416295cc105764721b89d252790374c44` includes tests and audit documents (686 authored changed lines after recording authorization; approved `size:exception`). GitHub deployment status reported success, and fresh cache-busted public requests confirmed updated Python-worker/provisioning and OBS start-before-copy guidance in both languages. No Vercel credentials were used. GitHub's push response reported 43 dependency vulnerabilities (2 critical, 20 high, 17 moderate, 4 low); dependency remediation is outside this content delivery and remains follow-up work. Rollback boundary: revert the content commit as one coherent unit; this delivery record is independently removable.
