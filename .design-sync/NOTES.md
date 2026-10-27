# design-sync notes (Entur Linje)

The sync procedure is in AGENTS.md. Follow it on every run.

## Setup

- Monorepo with 21 component packages + @entur/icons; the converter bundles ONE package, so `.design-sync/umbrella.mjs` generates a synthetic `@entur/linje` package in `.design-sync/.cache/linje/` (gitignored) after `yarn build:packages`. `cfg.buildCmd` runs both.
- yarn isn't on PATH on the maintainer's machine - use `corepack yarn` (packageManager pins yarn 4).
- Icons are kept out of the umbrella's types (412 icons would become component cards) and merged onto `window.EnturLinje` via the converter's auto `[ICON_PKG]` detection (umbrella package.json depends on @entur/icons).
- Beta entries (layout/beta, typography/beta, menu/beta): user decisions 2026-09-30. Stable exports win name clashes (GridItem, Link, Blockquote, BlockquoteFooter, ListItem, NumberedList, UnorderedList) EXCEPT `SideNavigation`: the beta compound version replaces the stable one in place (card group `menu`, via `PREFER_BETA` + docs category), and the stable SideNavigationItem, SideNavigationGroup, CollapsibleSideNavigation and useSideNavigationContext are removed from the bundle (`EXCLUDE` in umbrella.mjs; @entur/menu is then re-exported by explicit name list, since `export *` can't drop names and a same-name explicit beta export would be a duplicate). SideNavigation's doc is the beta README minus its Architecture section; `dtsPropsFor.SideNavigation` holds the beta root contract because the extractor finds the stable `SideNavigationProps` interface first. Non-clashing beta components (Grid, Flex, FlexSpacer, Template, Heading, Text) are included.
- Deprecated components (TertiaryButton, TertiarySquareButton, StatusBadge) are left out of the bundle (`EXCLUDE` in umbrella.mjs, user decision 2026-10-13), so the design agent only sees their replacements.
- Tokens: package stylesheets only inline tokens they use; semantic.css + data.css are in none of them, and base.css dark-mode tokens reference semantic ones. umbrella.mjs prepends every @entur/tokens/dist/\*.css so all tokens (incl. dark mode via `data-color-mode="dark"`) ship. User requires tokens to match code exactly - verify 0 missing after each sync.
- Preview scope: user chose to author previews for ALL components (2026-09-30).
- Composition sources: apps/code-playground/src/snippets (Playroom), apps/documentation/mdxArchive (archived docs - content now lives in Sanity, may lag the API), package tests.
- Types: the built .d.ts files import siblings by relative monorepo path (`../../utils`, `../../../form`), so umbrella.mjs mirrors `packages/<pkg>/dist` as `types/<pkg>/dist` (icons included, but not re-exported). Flattening the layout silently turned 36 prop contracts (Button, Badge, Tag, ...) into `[key: string]: unknown` stubs - after any umbrella change, grep emitted .d.ts for that stub.
- CSS order: the merged stylesheet follows `apps/code-playground/src/index.scss` import order (dependencies first). Alphabetical order made loader's blue dots override button's white ones (invisible loading state in PrimaryButton). New packages not listed there are appended last with a `!` warning - add them to the playground file.
- Groups: the converter's src-derived group is `general` when a component's dir equals its name; umbrella.mjs writes `docs/<Name>.mdx` with `category: <package>` (body = the matching mdxArchive page, if any). Subdir groups (badge, inputpanel, segmentedcontrol, sidenavigation, timepicker) come from src paths.
- `Template` (layout/beta) is a namespace object used as `Template.Portal`; its props contract stays a stub by design.
- Previews import from `@entur/linje` (the umbrella) and `@entur/icons` only - those are rewritten to `window.EnturLinje`.
- Review sheets are downscaled; verify suspicious sizes with `node .design-sync/.cache/probe.mjs '<components/...html?story=X>' '<js expr>'` (computed styles in headless chromium). Solo check: H1 40px, H2 32px, lead 20px, paragraph 16px, Nationale.

## Known render warns

- `[FONT_MISSING] "Gotham Rounded", "oxygen-sans"`: fallback entries after Nationale/Arial in the typography stack; Nationale ships (fonts/). Not brand fonts - intentionally not shipped.

## Illustrations (added 2026-09-30, source moved 2026-10-13)

- Source: the docs app's committed copy, `apps/documentation/src/downloads/illustrations/`, so the repo holds one copy of each illustration. New illustrations must be added to that docs folder to reach Claude Design.
- Only SVGs are used (user decision); PNG/PDF skipped. `Landscape` and `Utviklingsprinsipper` are PNG-only and left out until SVG versions exist.
- `.design-sync/illustrations.mjs import [folder]` (default: the docs folder; part of cfg.buildCmd, before umbrella.mjs) normalises names (theme words appear anywhere: `dark`, `dark mode`, `darkmode`, `contrast`, `default`, `in-circle`; CamelCase is split so `MooseSpring` = `Moose_Spring`), optimises with SVGO (multipass) and keeps the original for any file whose headless render differs (>0.1% of pixels by >24/255). Output goes to the gitignored `.design-sync/.cache/illustrations/` + `manifest.json`; unchanged sources (sha1 in the manifest) are reused, so a repeat run takes ~1 s and a fresh clone ~70 s. Needs svgo + playwright in .ds-sync/node_modules: `(cd .ds-sync && npm i svgo playwright)`. Result: 410 SVG -> 145 sets, 163.6 MB -> 73.0 MB, byte-identical to the earlier import.
- EVERY SYNC: after the driver run, `node .design-sync/illustrations.mjs publish ./ds-bundle` (the build empties ds-bundle), and the upload's writes/deletes must include `illustrations/**`. The driver's `_ds_sync.json` diff does not know about illustrations.
- umbrella.mjs appends `illustrationsCss()` to the stylesheet: `.linje-illustration` + `.linje-illustration--<slug>` with `aspect-ratio` and `background-image: url("illustrations/...")` (relative to `_ds_bundle.css`), swapping to the dark variant under `[data-color-mode=dark]` and the contrast variant under `.eds-contrast`. Delivered via the styles.css closure like the fonts - chosen over `<img src>` because designs are only guaranteed that closure.
- 5 sets have no light version (calendar-/clock-/leaves-/ticket-background: dark mode only; train-station-woman-walking-with-luggage: dark mode + contrast only); they render nothing in the missing themes and are marked in `illustrations/README.md`.
- Usage guidance in conventions.md comes from apps/documentation/src/pages/identitet/verktoykassen/illustrasjoner.mdx, with a user decision (2026-09-30): illustrations may be used freely anywhere they support the content; the Entur guidelines (around three per view, not in data-heavy views) are recommendations, not rules. The status-message mapping (sheep = no results/system error, musk = 404/no access, beaver = no connection, etc.) stays fixed.

## Preview techniques (from wave 1)

- Date values: `new CalendarDate(2026, 10, 14)` / `CalendarDateTime` / `Time` from '@entur/linje' - fixed dates, never today().
- DatePicker open state: `defaultOpen` + `disableModal` (below 1000px viewport it otherwise opens a Modal).
- Dropdown family and OverflowMenu have no `open` prop: previews click the `[aria-expanded]` trigger in a useEffect/setTimeout and reserve `minHeight` so the list stays in the card. No cardMode override was needed; if Claude Design clips them, use `{"cardMode":"single","viewport":"480x520"}` (dropdowns) / `"480x360"` (OverflowMenu\*).
- SkipToContent is position:fixed until focus - preview wraps it in a `transform: translateZ(0)` frame and focuses on mount.
- Loader uses `margin: 0 auto` + max-width 20rem; stack it in a block container, not grid/flex.
- HeaderCell sort state: pass sortable/sortConfig/name/sortableButtonProps directly (no useSortableTable) for a static render.
- `dtsPropsFor` covers Contrast, BreadcrumbItem, TopNavigationItem (and SideNavigation, see above): their shipped types carry `children`/`href` only via an index signature or the polymorphic element, which the extractor drops. Re-check these bodies against source on every sync (they are hand-maintained).

- Modal/ModalOverlay use native `<dialog>.showModal()` (top layer) and Drawer is position:fixed: cfg.overrides give them `cardMode: single` + 900px viewports. ToastProvider likewise (toasts are fixed-position). Popover/Tooltip stay in grid mode - previews reserve minHeight and the probe confirmed the floating element stays inside its cell.
- CopyableText calls useToast() and throws outside a ToastProvider - every usage must be wrapped.
- Toasts only exist after `useToast().addToast(...)`; previews call it on mount with `delay: 2e9`.
- Expandable alert boxes have no open prop: "Open" stories click `.eds-expandable-alert-box__button` on mount.
- Modal/ModalOverlay/Drawer focus their title on open; previews blur activeElement after 150ms to show the resting look.
- Popover is controlled only when BOTH showPopover and setShowPopover are passed; Tooltip `isOpen` shows a close button unless `showCloseButton={false}`.

- BaseCard is a row flexbox with no padding - stacked children need a column wrapper plus padding.
- Badge/NotificationBadge are position:static - consumers set `position:absolute` on the badge and `relative` on the anchor.
- LegLine uses flex-grow:1 - wrap each vertical LegLine in its own column-flex div.
- MediaCard media expects an `<img>`; previews use inline SVG data-URIs (no external assets allowed).
- Template.Portal defaults to 100dvh; previews pin `--eds-viewport-height: 560px` and cfg.overrides gives Template `cardMode: column` at 1280x800. Real API: Template.Portal with .StatusBar, .Sidebar (.Logo/.User/.Data/.Navigation/.Footer) and .Main.
- Grid previews use `Grid.Item` (stable GridItem owns the top-level name).
- `.design-sync/overrides/dts.mjs` (fork, declared in cfg.libOverrides): the stock extractor turned any type >240 chars into `unknown`, which hid `transport` (21-member Transport union) on TravelLeg/TravelTag/TravelSwitch, Flex/Grid ResponsiveValue props, and polymorphic `as`. On re-sync, diff the fork against the bundled lib/dts.mjs and re-apply the typeText tail. Needs the gitignored symlink `.design-sync/node_modules -> ../.ds-sync/node_modules` (recreate per clone).

- BaseFormControl only positions its label from the `isFilled` prop and does not watch its input. Its preview keeps the value in state and passes `isFilled={value !== ''}` (a hard-coded `isFilled` left the label stuck at the top after clearing - reported by the user 2026-09-30); conventions.md tells the design agent the same.

- Dropdown-family lists use floating-ui `shift({ padding: 8px })` with `strategy: 'fixed'`; a field flush against the card edge made the list shift 8px right and overhang (user report 2026-09-30). DatePicker uses the same shift. The Open previews of MultiSelect, Dropdown, SearchableDropdown and DatePicker pad their wrapper with `var(--space-default)`; keep any new open-state preview off the card edge.

- SegmentedChoice WithIcons: transport icons default to their transport colours; user decision (2026-10-12) that icons in SegmentedChoice use the base blue - preview passes `color="currentColor"` and lays icon + label out with `inline-flex` + `gap: var(--space-extra-small)`; conventions.md says the same.

- Icon `inline` (eds-icon--inline) shifts the icon down for running text; inside Tag it sat 3-4px below centre (user report 2026-10-12). Tag sizes, spaces and centres icons itself - previews pass icons without `inline`; conventions.md says so.

## Known render warns (states skipped deliberately)

- Switch Disabled, NativeDatePicker/NativeTimePicker Disabled, SimpleTimePicker padding, EditableCell warning/information + feedback tooltip (hover-only), TableRow hover: not previewed - no static visual difference.
- `[RENDER_THIN] InputGroupLabel`: a standalone floating label is tiny by design (internal BaseFormControl part).

## Re-sync risks (watch-list for the next sync)

- `.design-sync/overrides/dts.mjs` is a fork of the bundled lib/dts.mjs (typeText long-union tail + `as` -> React.ElementType in emitBody). Diff it against the new bundled version on every sync; re-apply the two edits onto upstream rather than keeping a stale copy.
- `cfg.dtsPropsFor` (Contrast, BreadcrumbItem, TopNavigationItem, SideNavigation) is hand-written. If those components' props change upstream, these bodies go stale silently - compare with packages/menu/src and packages/layout/src.
- umbrella.mjs parses `apps/code-playground/src/index.scss` for CSS order and reads `apps/documentation/mdxArchive` for docs. Moving or reformatting either breaks the umbrella (a new package missing from the playground file is appended last with a warning).
- Docs come from the ARCHIVED MDX pages (content now lives in Sanity). They lag the live docs; Sanity content is not synced.
- Beta handling: stable wins name clashes. If typography/beta replaces the stable components upstream, revisit the BETA list in umbrella.mjs.
- Card-layout overrides (`cfg.overrides`, 48 entries) were derived from `[GRID_OVERFLOW]`; new preview content can make other cards overflow - check validate warns.
- Tokens coverage must stay at 0 missing for all six @entur/tokens/dist/\*.css files (the user requires exact token parity) - re-run the coverage check after any tokens change.
- Build assumptions: Node 24.14.0, `corepack yarn` 4.13.0. Playwright must match the cached Chromium: read the `chromium_headless_shell-<rev>` folder in ~/Library/Caches/ms-playwright and install the playwright release whose `browsers.json` pins that revision (1234 = playwright 1.62.1, 1243 = 1.63.0); check with `curl -s https://unpkg.com/playwright-core@<v>/browsers.json`.
- Previews that open overlays on mount (dropdowns, OverflowMenu, expandable alerts, toasts) use timers/clicks; a component behaviour change can make them render closed - watch those cards on regrade.
- EXCLUDE/PREFER_BETA in umbrella.mjs switch @entur/button, @entur/layout and @entur/menu to explicit export lists: a NEW export added upstream is still picked up (the list is computed from its .d.ts each run), but check the `not re-exported` lines after upstream changes to those packages. When another component is deprecated, add it to EXCLUDE and delete its preview.
- Illustrations: Claude Design only sees what is in apps/documentation/src/downloads/illustrations; new illustrations from the design team must be added there. The class-based delivery (url() in the stylesheet) is verified locally; if Claude Design ever stops shipping url() assets from the stylesheet closure, illustrations will render empty while fonts may also break - check both.

## Design System artifact (added 2026-10-14)

- The Claude Design project was migrated to a Design System artifact on claude.ai; `design-system.mjs` reproduces that artifact's files from `ds-bundle/` (checked byte-for-byte against the published artifact on 2026-10-14).
- Tokens are read from `ds-bundle/tokens/*.css`, not from `_ds_bundle.css`: the bundle's copies resolve aliases to literals and write 8-digit hex as rgba(), which hides the token structure. Values are the same.
- 635 of 640 tokens go to tokens.json. `outlines-*` (composite values) and `timings-*` (no motion family) stay in bundle.css.
- Text styles in tokens.json come from the `.eds-h1` … `.eds-sub-label` rules in `_ds_bundle.css`: mobile from the base rule, desktop from `@media screen and (min-width: 50rem)`.
- Dark mode switches on `data-color-mode` only. tokens.css uses it, and bundle.css keeps its `[data-color-mode=dark]` token values, since the page regenerates tokens.css on its own selectors after a token edit. Only light values are cut from bundle.css, so a dark token edited on the page does not win. Previews set their background to `--basecolors-frame-default` so they work in the dark theme.
- The `.jsx` re-export stubs go to `components/src/<group>/<Name>/`, and the bundle header's `sourcePath`s are rewritten to match.
- A system the page edits can drift from the repo (token edits, README edits). Before re-publishing, read the artifact's `tokens.json` and `README.md` and carry page edits back into the sources, or they are overwritten.

## Artifact update run (2026-10-15)

- `projectId` was removed from config.json: the standalone project (closes 2026-12-14) is no longer a sync target, so `/design-sync` only builds. Publishing goes to the artifact (README, Updating the design system).
- `/design-sync` can only be started by the user (the skill is not model-invocable); Claude then stages `.ds-sync/` from the skill's folder and runs the README's commands.
- Create `.design-sync/.cache/` before redirecting logs into it; a missing folder made `yarn build:packages` fail silently while the later steps ran on stale `dist/`.
- `design-system.mjs` skips dot-files: Finder's `.DS_Store` in `ds-bundle/components/` crashed it.
- The live artifact's index has keys `design-system.mjs` does not write (a `notes` asset group, `lastChange`, `docs.sections`). Never publish the generated `design-system.json` over it.
- The live artifact holds `assets/notes/COMPONENTS.md` and `MIGRATION-REPORT.md` from the migration; they are not in the repo. Leave them unless the owner asks to remove them.
- The commit hook runs prettier on `design-system/cover.html`, so the cover differs from the live one in formatting only.
- The live README's first paragraph was edited on the page ("the 147 components plus all `@entur/icons` icons"). conventions.md keeps the original wording, which has no count to go stale.
- `yarn build:packages` prints ~90 TypeScript errors from vite:dts (`forwardRef`/`PolymorphicRef` in button, layout, tag and others). They are upstream, don't fail the build and don't change the output; ignore them.
- When only `design-system.mjs` or `design-system/` changed, skip the full build: run `node .design-sync/design-system.mjs ./ds-bundle` on the existing `ds-bundle/`.
- Republishing `tokens.css` is accepted, although the type's spec calls it page-generated.
- Card screenshots: write the preview to a file with `tokens.css`, `components/bundle.css`, `components/lib/react.js` and `components/bundle.js` linked in `<head>` and `data-color-mode` on `<html>`, then `page.goto('file://…')`. `page.setContent` renders blank, because it can't load `file://` resources.

## Publish to another organization (2026-10-27)

- Created a new Design System artifact "Entur Linje" for Team 1 (https://claude.ai/artifact/EhuUKLgq5NT1dQoNVfMQSA) and published the whole `project/` folder to it. The original artifact (SQBrPb5Ln58H4NwvXbnCHV, from 2026-10-14) was not touched, so it is one sync behind. Its team is not known yet: it is not reachable from Team 1 or Team 2.
- Each team gets its own artifact (README.md lists them). `publish.mjs` plans the calls per artifact from a fingerprint in `published/<id>.json`, so a sync doesn't have to read 1,008 files back from each team. Team 1's fingerprint was recorded right after this publish. Team 2 (https://claude.ai/artifact/5EBRs6WiU748Rhrm9uU9hW) and Team 3 (https://claude.ai/artifact/JhNaq5GuypdJvwh22jypQa) were created and published the same day with `publish.mjs plan --new` (9 calls each) and recorded. Team 3's default design system is a different one ("Entur Reisevaner Design System"); Entur Linje sits next to it and does not replace it.
- Opening a newly published artifact makes the page re-save `design-system.json` with its keys sorted. The values are unchanged; `plan` never sends the index to an existing artifact, so this causes no drift. The original artifact has no fingerprint yet: its first `plan` sends every file; pass `--remote` with its file listing to also remove stale files.
- The folder is 1,008 files, exactly the type's per-system cap (1,008 files, 256 MiB). One more component or illustration needs room: drop the `.woff` fonts (the `.woff2` copies are enough) or the `tokens/*.css` copies before adding files.
- Publish limits: at most 255 paths and 16 MiB per call, so the 79 MiB folder went in 9 calls (illustrations first, the index last). `.jsx` stubs under `components/src/` need `contentType: "text/javascript"`; the artifact refuses the extension otherwise, like `.d.ts` (`text/plain`).
- `design-system.mjs` writes a new `createdOnFiles.at` on every run. For a new artifact, add `lastChange` to the generated index just before the last call.
- Typography beta changed upstream (PR #504–#507): `Heading` lost `label`/`sublabel` (now on `Text` only), `Text` `code-text` became `code`, `weight` takes only `medium`/`bold`, and `spacing` uses the shared scale (`'xs'`, `{ top, bottom }`) instead of `sm-bottom`. Heading and Text have no spacing outside a `TextContainer`, so previews stack them in a `Flex` with `gap` (conventions.md tells the design agent the same). The Heading and Text previews were rewritten, and a preview was added for the new beta `TextContainer` (included under the 2026-09-30 decision on non-clashing beta components).
- typography/beta now exports `Label`. The stable `Label` still wins the name in the umbrella, but the converter took the beta source path, so the card went to group `beta` with the beta README. `componentSrcMap.Label` pins it to `packages/typography/src/Label.tsx`. Check for this whenever a beta package adds a name the stable package already has.
- Tooltip, Popover and OverflowMenu now escape scroll containers (PR #516), so their open states overflow grid cells (`[GRID_OVERFLOW]`). `cfg.overrides` gives them and their parts `cardMode: single` at 480x360.
- Validate warnings after this run: only `[FONT_MISSING]` and `[RENDER_THIN] InputGroupLabel`, both listed above.
