---
name: code-review
description: Reviews pull requests in the Entur Linje design system monorepo — consumer impact, design-token and CSS-layer correctness, accessibility, and repo conventions. Terse, actionable comments only.
---

# Linje Code Review

Review the pull request in this repo (`entur/design-system` — the Entur Linje
design system). Every package here is published as a versioned `@entur/*` npm
package consumed by many product teams, so the bar is "what does this do to
consumers", not "is this pretty".

Read [AGENTS.md](../../AGENTS.md) first, plus any `AGENTS.md` in the packages
the PR touches.

## How to comment

- One comment per finding. Format: **what is wrong → why it matters → the fix.**
  One or two sentences. No preamble, no restating the diff, no praise.
- Only comment on things you have verified by reading the code. If you are
  guessing, say so explicitly or stay silent.
- Suggest concrete code when the fix is short.
- Rank by consumer impact. If there are more than ~8 findings, post the most
  important ones and summarize the rest in one comment.
- Do **not** comment on: Prettier formatting, import order, quote style, or
  anything ESLint/stylelint/commitlint already fails on in CI.

## What to look for

### 1. Consumer impact and versioning (highest priority)

- Any change to a public prop, prop type, default value, exported name, DOM
  structure, or CSS class name is a potential breaking change. Say so, and
  check the commit type matches: `fix` → patch, `feat` → minor, breaking →
  `BREAKING CHANGE` footer with a migration note.
- `fix` and `feat` are only for code under `packages/` or `skills/`. Anything
  else (docs site, config, tests) must use `chore`, `refactor`, `test`, `docs`.
- `feat`/`fix` descriptions land in the changelog: they must be
  consumer-focused ("adds a `size` prop for compact tables"), not internal
  ("refactor size handling"). Flag internal-sounding changelog lines.
- Commit scope must be `package/component` lowercase, `package/beta/component`
  for beta components; `website` for the docs site; `root` for repo-wide.
- Removing or renaming an export, or tightening a type, without a deprecation
  path is a breaking change even if it "should never have been used".
- Flag unrelated changes bundled into one commit — commits should be separated
  by concern, and cross-package refactors committed per package.

### 2. CSS, tokens, and the cascade

- **Never depend on user-agent styles a consumer reset can remove.** Consumers
  use Tailwind Preflight and similar resets, which zero out margin, padding and
  border on every element and win over UA styles regardless of specificity.
  Anything the component needs for layout must be stated in its own CSS. This
  has already broken production once (native `<dialog>` centering).
- Specificity: component CSS must stay reachable for consumer overrides — flag
  `!important`, ID selectors, and selectors above the repo's specificity budget
  unless there is a `stylelint-disable` with a reason comment.
- Cascade layers: component CSS is consumed through `@entur/utils/styles/layers`.
  Check that new stylesheets keep the documented layer order and that nothing
  unlayered is added that would outrank consumer overrides by accident. See
  `skills/entur-web-development/references/css-layers.md`.
- Hardcoded colors, spacing, radii, timings or font values are a bug — use
  `@entur/tokens` SCSS variables or the `--components-*` CSS custom properties,
  mapped in the package's `componentVariables.scss`.
- BEM with the `eds-` prefix. New classes must follow the existing block name.
- Check both `.eds-contrast` (dark/contrast) context and the reduced-motion
  media query when animation or color is added.

### 3. HTML and API design

- Prefer native HTML elements and browser APIs over React-specific
  abstractions when both work (`<dialog>`, `popover`, `:has()`, form
  validation, `inert`). Flag reintroduced JS focus traps, portals or hooks that
  a native feature already covers.
- Semantic HTML5 elements over `<div>`. Minimize wrappers — composition via the
  `as` prop instead of extra `<div>`s.
- New components: `React.forwardRef`, spread remaining props onto the root
  element, accept `className` and merge it, support the `as` prop where element
  composition makes sense.
- Prop names should match existing components in the library — flag a new name
  for a concept that already has one.

### 4. Accessibility

- Keyboard: focus order, visible focus, Escape/Enter handling, focus returned
  to the trigger after close.
- Correct roles and labels; no ARIA where native semantics already say it.
- Announcements for dynamic content; `aria-live` only where needed.
- Color and state must not be the only signal.
- Reference `skills/entur-accessibility/` for the repo's patterns.

### 5. Tests and hygiene

- Tests co-located as `[Component].test.tsx`, React Testing Library, queried by
  role/label rather than class names or test ids.
- New behavior needs a test; pure CSS changes usually cannot be tested in jsdom
  — do not demand one there.
- `TestBench.tsx` and other local scratch files must never be committed.
- Flag leftover `console.log`, unused imports, `.only` in tests, and committed
  build output.

### 6. Documentation

- Documentation must stay generic across teams — flag any team-specific
  component, domain, or product name that has leaked into docs or examples.
- Consumer-facing prop or behavior changes need the docs page updated
  (`apps/documentation`, or Sanity content). Beta components use `tag: "beta"`.
- Norwegian text must be Bokmål, and use en-dash (–), not em-dash (—).

### 7. Pull request form

- Branch name starts with the Jira issue ID, e.g. `ETU-12345-short-name`.
- PR description follows `.github/pull_request_template.md` (Norwegian) with the
  correct "Type endring" boxes; breaking changes need the migration section.
- AI attribution, when the majority of the change is AI-produced:
  `AI-assistant: <tool> (<model>)`. Never `Co-authored-by` for an AI tool.

## Output

Post inline comments where they belong in the diff, then one short summary:
the consumer-facing risk in this PR, whether the version bump implied by the
commit types is correct, and anything that must be fixed before merge. If the
PR is clean, say that in one line — do not invent findings.
