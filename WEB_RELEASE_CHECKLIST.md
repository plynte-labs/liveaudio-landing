# Website release checklist

## Automated local checks

- [x] Observe RED then GREEN: `node --test tests/web-content.test.mjs` (initial 0/6 to 6/6; correction batch 6/9 to 9/9).
- [x] `pnpm build` passed (29 pages); `git diff --check` passed.
- [ ] `pnpm lint` failed with seven baseline errors: six generated `.astro` declarations and one `OsDetect.tsx` React hook error.
- [x] Independent targeted EN/ES source and generated-output checks confirmed the four corrected findings. These do not establish exhaustive parity or runtime behavior.
- [ ] Verify external download links and redirects; independently hash the downloaded installer. Publisher checksum metadata is not a locally verified hash.

## Manual website checks

- [x] Static inspection of 18 generated EN/ES pages found no missing simple root-relative link targets. This did not test redirects or external links.
- [ ] Navigate changed routes and check external links and redirects in a browser.
- [ ] Check keyboard navigation, visible focus, basic accessibility and mobile layout. No controllable browser was available for these checks.
- [ ] Confirm historical media is accurately labeled and existing layout and analytics remain unchanged.
- [x] Targeted generated-output scan confirmed start-before-copy guidance in EN/ES OBS, WebSocket and getting-started pages, the LLM full reference, and v1.5.0 product-tour labels in both languages. This is not a complete semantic or visual audit.

## Clean Windows validation — pending

- [ ] In an explicitly authorized clean Windows x64 VM, download and independently hash the installer; compare with the publisher checksum.
- [ ] Record installed files, provisioning, model downloads, storage, errors and recovery; test the incomplete executable separately only in the authorized environment.
- [ ] Select microphone, start transcription, save a session and confirm real labels and controls.
- [ ] Start the system, copy the overlay URL, and add the OBS Browser Source with Local File unchecked; verify captions, port changes and reconnect after reopening OBS.
- [ ] Record effective WebSocket port and fallback behavior; verify third-party clients and backlog behavior.
- [ ] After provisioning, test offline startup and transcription; test missing-model and recovery cases.
- [ ] Verify CUDA runtime dependencies on suitable hardware; distinguish GPU detection from successful inference.
- [ ] Verify updates, configuration preservation, legacy Linux support and remaining claims before asserting them.

## Delivery

- [ ] Report executed, failed, skipped and pending checks honestly.
- [x] No application changes, commit, push or deployment were made; existing analytics were untouched.
