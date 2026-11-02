# Website changes and verification

The website copy was updated against [the evidence matrix](WEB_AUDIT_EVIDENCE.md), preserving the layout, existing analytics and historical media. English and Spanish content covers the same corrections; source-content tests do not prove exhaustive parity or runtime behavior.

## P0 — Architecture and download

- `src/i18n/pages/home.ts`, `faq.ts`, `getting-started.ts`, `download.ts`, `docs.ts`, `product-tour.ts`: corrected no-Python and single-binary claims to describe the hybrid architecture.
- `src/i18n/pages/download.ts`, `getting-started.ts`, `docs.ts`: prioritized the official installer and labeled the separate desktop executable as incomplete. Publisher checksum metadata remains unverified locally.
- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`: corrected the corresponding machine-readable claims.

## P1 — First use and OBS

- `src/i18n/pages/obs-setup.ts`, `docs.ts`, `getting-started.ts`: corrected overlay URL sequencing and qualified provisioning and model downloads; clean-install verification remains pending.
- `src/i18n/pages/home.ts`, `docs.ts`, `faq.ts`, `obs-setup.ts`, `src/i18n/islands/features.ts`: corrected unsupported performance assurances and qualified CUDA readiness.
- `src/i18n/pages/home.ts`, `product-tour.ts`: retained historical media and corrected version labels.

## P2 — Consistency and trust

- `src/i18n/pages/vs.ts`: retained the v1.5.1/legacy Linux distinction and removed the undated competitor price.
- `src/i18n/jsonld.ts`, page metadata, LLM endpoints and `README.md`: updated selected claims. Remaining configuration and backlog details require runtime verification where noted in the checklist.
- Existing analytics, styling, dependencies and application source were unchanged.

## Test-first scope

Dependency-free `tests/web-content.test.mjs` checks selected claims, OBS sequencing and historical screenshot labels. The initial six tests failed before corrections and passed afterward. A second bounded correction added three tests, which failed before that batch. Content tests do not substitute for installation or OBS execution. Updates and migration guidance now advises backups and directs readers to release notes; OBS instructions start the system before copying the overlay URL and recopy when the port changes.

Final local results: an independent verifier confirmed the four corrected findings in source and generated output, and independently ran 9/9 tests and `git diff --check`. An earlier independent build produced 29 pages. `pnpm lint` failed with the same seven baseline errors: six generated `.astro` declaration errors and one existing `OsDetect.tsx` React hook error. Static inspection of 18 generated EN/ES pages found no missing simple root-relative targets; it did not test redirects or external links. Browser, clean-VM, OBS, offline and CUDA checks remain pending; release acceptance is incomplete.
