# Typography (beta): before graduation

Temporary checklist for moving the new typography out of beta (epic ETU-65393). Delete this file
when it graduates.

## Decide first

- [ ] What happens to the legacy typography (`Heading1`–`6`, `Paragraph`, stable `Link` with
      `external` …): deprecate, remove or keep, the timeline, and how consumers are told.
- [ ] Fixed line heights per size, or support for own `font-size` (unitless line heights or display
      sizes above `2xl`).

## Code

- [ ] Move beta to the main entry of `@entur/typography` (BREAKING CHANGE). Keep
      `@entur/typography/beta` as an alias for a while.
- [ ] Remove the `./beta` and `./beta/styles` exports, `build:beta`, `start:beta`,
      `vite.config.beta.ts` and the `src/beta**` path in `lint:styles` once the alias goes.
- [ ] Make the CSS self-contained: `index.tsx` still warns about and relies on the base typography
      styles.
- [ ] Remove `@beta Experimental component …` from the components and the "experimental" comments
      at the top of the stylesheets and `index.tsx`.
- [ ] Cleanup pass over everything changed in PRs 504–509: dead CSS, unused props, types, exports
      and helpers.
- [ ] Commit scope `typography/beta` → `typography`, so the changelog no longer files the changes
      under "(beta)".

## Docs and skills

- [ ] Rewrite the typography docs, and remove `tag: "beta"` from the Sanity documents.
- [ ] Playground (`packages-scope.ts`): drop the `*Beta` aliases (`LinkBeta`, `ListItemBeta` …) and
      the stable-wins rule for name clashes.
- [ ] Skills: imports from `@entur/typography/beta` in `migrate-typography`,
      `entur-web-development` and `entur-linje`, and the advice to stay on the stable typography.
- [ ] Add `migrate-typography` to the entur/ai plugin marketplace.

## Figma

- [ ] Rename the file "Βeta Typography variables" (with a Greek Β), or move the collection into
      the tokens files.
- [ ] Remove "Beta" from the component names: "Text Beta" and "Heading Beta" in Entur UI Library,
      "Body text Beta" and "Label text Beta" in UI Beta, and the page "Typography (Beta)".
- [ ] Publish Tokens-Component, Βeta Typography variables and UI Beta, and accept the updates in
      Entur UI Library.
- [ ] Import exports only for the tokens a PR owns. `Font/Weight-style/*` exists only in Figma
      (the font style names), so leave it out of `component.json`.

## After graduation

- [ ] Migrate our own components to the new typography, one PR per package, before any deprecation
      warnings.
- [ ] Contact the consumer teams with overrides or rare usage (reisevaner, omtur, Team
      Kassasystem).
