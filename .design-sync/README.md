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
| `publish.mjs`       | Plans the publish calls for each team's artifact from what was last published there                            |
| `published/`        | One fingerprint per artifact (`<id>.json`): team, link and a hash of every file last published                 |

`.cache/` (including `.cache/design-system/`), `overrides/dts.mjs`, `/.ds-sync/` and `/ds-bundle/` are generated on every sync and ignored by git.

## Updating the design system

The Linje design system lives as Design System artifacts on claude.ai, all named "Entur Linje". An artifact belongs to the Claude team (organization) it was created in, so each team has its own copy, built from the same repo:

| Team   | Artifact                                          |
| ------ | ------------------------------------------------- |
| Team 1 | https://claude.ai/artifact/EhuUKLgq5NT1dQoNVfMQSA |
| Team 2 | https://claude.ai/artifact/5EBRs6WiU748Rhrm9uU9hW |
| Team 3 | https://claude.ai/artifact/JhNaq5GuypdJvwh22jypQa |
| Team 4 | https://claude.ai/artifact/RAYg2HgDTG2Jcj6YrEdXRc |

Add a row here, and in AGENTS.md, for each new team.

Each artifact keeps its content as files (`tokens.json`, `components/<Name>/`, `assets/illustrations/`, ...). The `/design-sync` skill only builds `ds-bundle/`; `design-system.mjs` turns that into the artifacts' files, and Claude publishes them to each artifact in turn.

Requires Node 24.14.0, `corepack yarn`, Claude Code logged in to claude.ai, and edit access to every artifact in the table (which means a login to each team).

1. Type `/design-sync` in Claude Code from the repo root (Claude can't start it for you), and ask for a sync to the artifacts, or name the teams to update. Claude follows `.design-sync/AGENTS.md`: it builds, adds or fixes previews for new, changed and removed components, checks the cards and publishes. `config.json` has no `projectId`, so `/design-sync` has no standalone project to upload to; decline if it offers to create one.
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
4. Check where each team stands:

   ```sh
   node .design-sync/publish.mjs status
   ```

   It lists every artifact in `published/` with the number of files changed and removed since its last publish.

5. Repeat steps 5–8 for each team in the table. Switch Claude Code to that team first with `/login`: a publish goes to the team you are logged in to, and an artifact from another team refuses it.
6. Carry page edits back: Claude reads the team's `project/README.md` and `project/tokens.json` and compares them with the folder. Edits made on the page go into the repo sources (`conventions.md`, the token packages) and the build is rerun, or the publish overwrites them. An edit carried back reaches every team on its next publish.
7. Plan the publish:

   ```sh
   node .design-sync/publish.mjs plan <artifact-url>
   ```

   It compares the folder with the artifact's fingerprint in `published/` and writes the publish calls to `.design-sync/.cache/publish/<id>/call-<n>.json`, in order. Each file holds the Artifact tool's `url`, `root`, `file_path` and `files`, ready to send as they are:

   - only the changed files, and `null` for files that are gone
   - `.d.ts` as `text/plain` and `.jsx` as `text/javascript`, which the artifact refuses otherwise
   - at most 250 paths and 14 MiB per call (the limit is 255 paths and 16 MiB)
   - never `project/design-system.json`, whose keys the page also writes; when one of the index's own keys has to change, Claude reads it again, keeps its keys and updates `lastChange`
   - never files under `assets/notes/`, which are placed on an artifact by hand

   An artifact without a fingerprint gets every file, since nothing is known about it. To also remove stale files from it, save a listing of its files (Artifact tool, `action: "list"`, `scope: "files"`), one path per line, and pass it with `--remote <file>`.

   **New team:** log in to that team and ask Claude to create a Design System artifact titled "Entur Linje". Then run `plan <url> --new --by "<your name>"`: it adds a `lastChange` to the index (`design-system.mjs` doesn't write one) and sends it in a last call of its own, after the 1,007 other files (about 9 calls). Add the team to the table above and to AGENTS.md.

8. Claude sends the calls in order, re-reads a few published files (the read reports each file's sha256, which can be checked against `published/`), and then records what was published:

   ```sh
   node .design-sync/publish.mjs record <artifact-url> --team "<team>"
   ```

   Only record after every call went through. `--team` is needed the first time. Commit the updated `published/<id>.json` with the sync, so the next sync from any machine starts from it.

An artifact holds at most 1,008 files, and the folder is at that limit (NOTES.md, 2026-10-27); `plan` warns when the folder goes over it.

New illustrations reach the design system once their SVGs are in `apps/documentation/src/downloads/illustrations`.
