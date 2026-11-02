---
name: code-review
description: Reviews pull requests in the Entur Linje design system monorepo — consumer impact, versioning, consistency across components, React and accessibility. Few, verified, actionable comments.
---

# Linje Code Review

Every package in `entur/design-system` is published as a versioned `@entur/*`
npm package used by many product teams. Judge each change by what it does to
consumers. Path-specific rules for SCSS, tests and docs live in
`.github/instructions/`.

## Before commenting

- Read the PR description. Do not re-raise a trade-off it already explains.
- Check whether the PR introduced the problem. A problem already on `main`, or
  an improvement outside the PR's purpose, is a follow-up: mention it once and
  do not block on it.
- Check "Deliberate decisions" below before flagging something that looks like
  a mistake.
- Only comment on what you verified in the code. Wrong claims about selectors,
  regexes or the cascade cost more review time than they save.
- One comment per finding: what is wrong, why it matters, the fix. If the PR is
  clean, say so in one line.

## Do not comment on

- Formatting, import or export order, or anything oxlint, Prettier or
  commitlint fail on in CI.
- `useCallback`/`useMemo` for cheap handlers, or new functions per render.
- Adding callback props to effect dependency arrays; that re-runs the effect on
  every render.
- Speculative edge cases with no realistic trigger.
- Keys generated from the array index.
- Optimizations in code the PR replaces.

## Public API and versioning

- Breaking for stable components: removing or renaming an export, prop or
  union value; shifting a size scale; changing a default value or default
  size; changing DOM structure or a `data-*` attribute; tightening a type;
  lowering a selector's specificity; moving CSS into or out of a cascade layer.
  Each needs a `BREAKING CHANGE` footer with a migration note. Ask: if a
  consumer only upgrades, does anything break?
- Beta components (`*/beta/*`, scope `package/beta/component`) may break in a
  minor. The break still needs a `BREAKING CHANGE` note so it lands under
  "BREAKING CHANGES (beta)". Do not demand a major for a beta-only break.
- Stable code must not import from `beta/`. Graduating a component or removing
  a `./beta` export changes the stable API.
- Deprecate before removing. A stable export or prop is removed only after a
  release that marked it `@deprecated` with its replacement named. Flag a PR
  that deprecates and removes in one go.
- A new `exports` subpath, `files` entry, dist file or public attribute is
  permanent API. Removing or renaming one is breaking. New `exports` entries
  list `types`, `import` and `require` like the existing ones.
- Prefer additive, optional props over changing existing behavior.
- `eds-*` classes are internal. Public hooks are `data-*` attributes such as
  `data-color-mode` and `data-view-mode`. There is no `data-theme`.
- Optional union props need a default in the destructuring and a `@default`
  JSDoc tag. Flag class names built from a prop that can be `undefined`. Every
  union value must have a visible effect.
- User-facing and screen-reader text in `packages/` is a prop with a Norwegian
  default, never hardcoded.
- Commit type matches consumer impact: `fix`/`feat` only for `packages/` and
  `skills/`, and their message says accurately what consumers get. Flag lines a
  later commit in the same PR removes or rewrites; squash them.

## Consistency with the library

Most findings here are inconsistencies, not crashes. Compare with sibling
components before judging a change on its own.

- New prop, class and token names match what siblings use for the same concept
  (`ariaLabelRemoved*` next to `ariaLabelChosen*`). Rename while unreleased.
- Size names come in two forms today (`small`/`medium`/`large` and the token
  scale `xs`, `s`, `m`, `lg`, `xl`), and unifying them is an open decision.
  Do not suggest renaming existing values; flag a component family that mixes
  the two forms.
- A prop added to one component in a family (`tone`, `spacing`, `size`)
  probably belongs on its siblings.
- Reuse existing props and components instead of re-implementing them (raw
  tokens instead of `tone="subdued"` miss the contrast value; a clear button
  should be an `IconButton`).
- Interaction states match siblings: disabled cursor, focus ring, readOnly.
- Fix a shared bug on the shared base, not on one variant.
- A kept deprecated prop needs a reason and a `@deprecated` note naming the
  replacement.

## React and TypeScript

- Polymorphic components pass the generic through so `as` gives correct prop
  types. No new `React.FC`.
- Do not re-pass props `{...rest}` already forwards. Handlers the component
  needs must not be overwritten by `{...rest}`; compose them.
- No module-level side effects: no top-level DOM access, global listeners or
  mutation of shared objects. Do not add `sideEffects: false` to a package
  whose JS imports `.scss`.
- SSR: no `window`, `document` or `navigator` at module scope or during render.
  IDs come from React `useId`, not `Math.random()`, counters or the deprecated
  `useRandomId`.
- Prefer native HTML and browser APIs (`<dialog>`, `popover`, `inert`, form
  validation) over JS re-implementations. Flag a reintroduced JS focus trap.
- Heading levels follow the document outline, not the visual size.

## Accessibility

- No ARIA is better than wrong ARIA: flag ARIA that duplicates native
  semantics (`aria-disabled` next to `disabled`), empty `aria-label`, stray
  `tabindex`. Invalid states set `aria-invalid`; decorative icons are hidden.
- Keyboard: focus order, visible focus, arrow keys, Escape, focus returned to
  the trigger and kept after clearing. `readOnly` controls stay focusable.
- Disabled and readOnly content stays in the accessibility tree with its state
  announced.
- Announce only what the user did, and the state that was accepted. Changes
  made by the parent are not announced; an empty status update must not cancel
  a pending one. Error text is announced.
- Sticky or fixed elements must not cover the focused element (WCAG 2.2).
- Color is never the only signal.

## Review configuration

Changes to `.github/skills/**`, `.github/instructions/**` or `AGENTS.md` change
how this PR itself is reviewed. Say so in a comment.

## Deliberate decisions — do not flag

- The dropdown menu has no floating-ui `hide()`; it stays anchored and may
  extend outside its scroll container.
- Modal uses native `<dialog>` with an explicit `.focus()` after `showModal()`;
  no JS focus trap.
- Partner icons keep their brand fills instead of `currentColor`.
- `index` means the selected tab on `Tabs` and the position on `Tab`/`TabPanel`.
  A rename waits for a possible value-based Tab API.
