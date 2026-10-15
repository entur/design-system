# AGENTS.md – syncing Entur Linje to Claude Design

Follow this whenever a `/design-sync` run starts in this repo, or someone asks to update the Design System artifact. The goal: the artifact "Entur Linje (beta)" (https://claude.ai/artifact/SQBrPb5Ln58H4NwvXbnCHV) matches the packages in this repo. The repo is the source of truth.

Fix what the steps below find yourself, without asking. Ask the user only about product decisions: whether to include a beta component, whether to hide a component, how a component should be used. Record each answer in NOTES.md.

Read `NOTES.md` and `README.md` (Updating the design system) first. NOTES.md has the known warnings, preview techniques and re-sync risks.

## 1. Build

Run the build commands in README.md. `config.json` has no `projectId`: never create a Claude Design project or upload with DesignSync.

## 2. Bring the sources up to date

Check each item. Every fix goes into the repo files under `.design-sync/`, never only into the output.

- **New component**: exported by a package but no `previews/<Name>.tsx`. Write the preview: stories that show its main variants and states, imported from `@entur/linje` and `@entur/icons` only, with Norwegian Bokmål text. Take the composition from `apps/code-playground/src/snippets`, the package tests and `apps/documentation/mdxArchive`. Use the techniques in NOTES.md (fixed dates, opened overlays, card overrides in `config.json`).
- **Deprecated component**: marked `@deprecated` in its package source. Add it to `EXCLUDE` in `umbrella.mjs` and delete its preview.
- **Removed component**: has a preview but is no longer exported. Delete the preview, and any `config.json` entries for it (`overrides`, `dtsPropsFor`, `componentSrcMap`).
- **Changed API**: a preview that fails to compile or render, or that uses a prop that is gone or renamed. Rewrite it against the new `.d.ts`. Also compare the hand-written `dtsPropsFor` bodies in `config.json` with the package source.
- **Build output warnings**:
  - `not re-exported` from `umbrella.mjs`: the names left out on purpose (`EXCLUDE`, `PREFER_BETA`). Expected; new exports are picked up automatically.
  - A package missing from `apps/code-playground/src/index.scss`: add it there.
  - `[GRID_OVERFLOW]`: add a card override in `config.json`.
  - Any other warning not listed in NOTES.md: fix the cause.
- **Tokens**: 0 missing across the six `@entur/tokens/dist/*.css` files.
- **Usage guidance**: when a preview needs a workaround the design agent must also know, add one line to `conventions.md`.

Rebuild after changes. `package-validate.mjs` must exit 0 with only the warnings NOTES.md lists.

## 3. Check the result

- Screenshot every new or changed card with playwright (installed in `.ds-sync/node_modules`), in light and dark theme, and fix what looks wrong: clipped overlays, overflow, icons off centre, English text.
- Read the live artifact and diff it against `.design-sync/.cache/design-system/project/`. Every difference must trace to a code change. Edits made on the artifact page (README, tokens) go back into the sources first.

## 4. Publish

Follow README.md step 5: send only the changed files, `null` for removed ones, `.d.ts` as `text/plain`, and never the generated `design-system.json`. Then re-read a few published files to confirm they match.

## 5. Wrap up

- Add new learnings and decisions to NOTES.md, dated.
- Tell the user what changed: added, removed and changed components, and anything left unfixed.
- Offer to commit the changes in `.design-sync/` (and `index.scss` if touched) on a branch named after a Jira issue the user gives you, with `chore(root)` commits.
