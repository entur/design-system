# Claude Design sync

This folder imports Entur Linje into [Claude Design](https://claude.ai/design) as a design system, so its design agent builds screens with the real `@entur/*` components, tokens, fonts and illustrations. The import is run with the `/design-sync` skill in [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## What is here

| File                | Purpose                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `config.json`       | Sync settings: build command, card layouts and hand-written prop contracts                                     |
| `conventions.md`    | Usage guide for the design agent, added to the top of the uploaded README                                      |
| `previews/`         | One preview per component; each named export is one example on the component's card                            |
| `umbrella.mjs`      | Combines the built `@entur/*` packages into one package for the converter                                      |
| `illustrations.mjs` | Optimises the SVGs in `apps/documentation/src/downloads/illustrations` and copies them into the upload         |
| `patch-dts.mjs`     | Writes `overrides/dts.mjs`, the converter's type extractor with two fixes for long unions and polymorphic `as` |
| `NOTES.md`          | Decisions, fixes and known issues from earlier syncs; read it before the next one                              |
| `design-system.mjs` | Turns the built `ds-bundle/` into the file layout of a Design System artifact on claude.ai                     |
| `design-system/`    | Hand-written files for that layout: `cover.html` is the cover shown above the brand book                       |

`.cache/` (including `.cache/design-system/`), `overrides/dts.mjs`, `/.ds-sync/` and `/ds-bundle/` are generated on every sync and ignored by git.

## Updating the design system

The Linje design system lives as a Design System artifact on claude.ai, "Entur Linje (beta)" (https://claude.ai/artifact/SQBrPb5Ln58H4NwvXbnCHV). It keeps its content as files (`tokens.json`, `components/<Name>/`, `assets/illustrations/`, ...). The `/design-sync` skill only builds `ds-bundle/`; `design-system.mjs` turns that into the artifact's files, and Claude publishes them.

Requires Node 24.14.0, `corepack yarn`, Claude Code logged in to claude.ai, and edit access to the artifact.

1. Type `/design-sync` in Claude Code from the repo root (Claude can't start it for you), and ask for a sync to the artifact. Claude follows `.design-sync/AGENTS.md`: it builds, adds or fixes previews for new, changed and removed components, checks the cards and publishes. `config.json` has no `projectId`, so `/design-sync` has no standalone project to upload to; decline if it offers to create one.
2. Build. Claude stages the converter from the skill's folder and runs, from the repo root:

   ```sh
   mkdir -p .design-sync/.cache
   (cd .ds-sync && npm i esbuild ts-morph @types/react svgo playwright@<version>)
   ln -sfn ../.ds-sync/node_modules .design-sync/node_modules
   corepack yarn build:packages && node .design-sync/patch-dts.mjs && node .design-sync/illustrations.mjs import && node .design-sync/umbrella.mjs
   node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry .design-sync/.cache/linje/index.mjs --out ./ds-bundle
   node .ds-sync/package-validate.mjs ./ds-bundle
   node .design-sync/illustrations.mjs publish ./ds-bundle
   node .design-sync/design-system.mjs ./ds-bundle
   ```

   `playwright@<version>` must match the Chromium in `~/Library/Caches/ms-playwright/` (see NOTES.md, Build assumptions). Validate must exit 0; its warns are listed in NOTES.md.

3. `design-system.mjs` writes the artifact's files to `.design-sync/.cache/design-system/project/`:
   - `tokens.json` and the first `tokens.css` from the six `tokens/*.css` files, light and dark themes, with a usage note per token
   - `components/bundle.css` with those token declarations removed, so a token edited on the page takes effect; `outlines-*` and `timings-*` stay in it
   - `components/<Name>/README.md`, `<Name>.d.ts` and `preview.html` (the card with its `_preview` script inlined), `components/index.d.ts`, `components/bundle.js` and React in `components/lib/`
   - the fonts, the illustrations under `assets/illustrations/`, the cover, the README with its paths updated, and a `design-system.json` for a new artifact
4. Compare before publishing: Claude reads the live artifact's files and diffs them against the folder. Differences should come from code changes only; edits made on the page (README, tokens) are carried back into the repo first, or the publish overwrites them.
5. Claude publishes the folder, following the Design System type's `SKILL.md`:
   - `.d.ts` files need `contentType: "text/plain"` in the publish call; the artifact refuses the `.ts` extension otherwise.
   - **Existing artifact:** send only the changed files, plus `null` for files whose component or illustration is gone. Leave `project/design-system.json` alone unless one of its own keys changes; then read it again, keep its keys, and update `lastChange`.
   - **Another organization:** log in to that organization, create a Design System artifact there, then publish the whole folder to it.

New illustrations reach the design system once their SVGs are in `apps/documentation/src/downloads/illustrations`.
