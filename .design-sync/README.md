# Claude Design sync

This folder imports Entur Linje into [Claude Design](https://claude.ai/design) as a design system, so its design agent builds screens with the real `@entur/*` components, tokens, fonts and illustrations. The import is run with the `/design-sync` skill in [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## What is here

| File                | Purpose                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `config.json`       | Sync settings: target project, build command, card layouts and hand-written prop contracts                     |
| `conventions.md`    | Usage guide for the design agent, added to the top of the uploaded README                                      |
| `previews/`         | One preview per component; each named export is one example on the component's card                            |
| `umbrella.mjs`      | Combines the built `@entur/*` packages into one package for the converter                                      |
| `illustrations.mjs` | Optimises the SVGs in `apps/documentation/src/downloads/illustrations` and copies them into the upload         |
| `patch-dts.mjs`     | Writes `overrides/dts.mjs`, the converter's type extractor with two fixes for long unions and polymorphic `as` |
| `NOTES.md`          | Decisions, fixes and known issues from earlier syncs; read it before the next one                              |
| `design-system.mjs` | Turns the built `ds-bundle/` into the file layout of a Design System artifact on claude.ai                     |
| `design-system/`    | Hand-written files for that layout: `cover.html` is the cover shown above the brand book                       |

`.cache/` (including `.cache/design-system/`), `overrides/dts.mjs`, `/.ds-sync/` and `/ds-bundle/` are generated on every sync and ignored by git.

## Running a sync

Requires Node 24.14.0, `corepack yarn`, Claude Code, and access to the Claude organization that owns the target project.

1. Run `/design-sync` in Claude Code from the repo root. It reads `config.json` and `NOTES.md`, rebuilds, checks every preview that changed, and uploads the result.
2. The build command in `config.json` runs `yarn build:packages`, `patch-dts.mjs`, the illustration import and `umbrella.mjs`, in that order.
3. After the build, `node .design-sync/illustrations.mjs publish ./ds-bundle` copies the illustrations into the upload, and the upload must include `illustrations/**`.

New illustrations reach Claude Design once their SVGs are in `apps/documentation/src/downloads/illustrations`.

## Syncing to another organization

`config.json` pins the Entur Linje project. To sync to a project in another organization, use a copy of the config without `projectId` and log in to that organization with `/design-login`, so the pinned project stays unchanged.

## Publishing as a Design System artifact

The Linje design system also lives as a Design System artifact on claude.ai, which keeps its content as files (`tokens.json`, `components/<Name>/`, `assets/illustrations/`, ...) instead of the bundle layout above.

1. Build as for a sync (step 2 above), then run `node .design-sync/illustrations.mjs publish ./ds-bundle`.
2. Run `node .design-sync/design-system.mjs ./ds-bundle`. It writes the artifact's files to `.design-sync/.cache/design-system/project/`:
   - `tokens.json` and the first `tokens.css` from the six `tokens/*.css` files, light and dark themes, with a usage note per token
   - `components/bundle.css` with those token declarations removed, so a token edited on the page takes effect; `outlines-*` and `timings-*` stay in it
   - `components/<Name>/README.md`, `<Name>.d.ts` and `preview.html` (the card with its `_preview` script inlined), `components/index.d.ts`, `components/bundle.js` and React in `components/lib/`
   - the fonts, the illustrations under `assets/illustrations/`, the cover, the README with its paths updated, and a `design-system.json` for a new artifact
3. Ask Claude (Claude Code or Cowork) to publish that folder to the artifact, following the Design System type's `SKILL.md`:
   - **Existing artifact:** send only the changed files; `project/design-system.json` is read again and goes last, keeping its keys and `title`, with `lastChange` updated.
   - **Another organization:** create a Design System artifact there, then publish the whole folder to it.
