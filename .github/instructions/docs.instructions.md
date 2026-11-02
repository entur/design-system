---
applyTo: 'apps/documentation/**,packages/**/*.tsx'
---

# Reviewing documentation

- Props tables come from generated JSON in
  `apps/documentation/src/utils/componentProps/eds-component-props/`
  (`yarn generate-props`). Never hand-edit it. A prop change regenerates it,
  without unrelated drift, and the prop must actually appear: subtypes that do
  not extend the own-props type drop it from the table.
- Playground controls in `apps/documentation/src/data/props/*-props.tsx` are
  written by hand; update them when a prop is added or changed.
- A new exported component comes with its props JSON, a playground entry, and a
  note in the PR about its Sanity page (`tag: "beta"` for beta components).
- JSDoc says when to use an option, not how it is implemented.
- When tokens or classes are deleted, search `apps/documentation` and other
  packages for remaining uses.
- The docs site uses the library's own components, never deprecated ones, and
  no hand-rolled badges, cards or navigation.
- Docs stay generic and proportionate: no other team's internal names (the
  repo is public), no counts that go stale, no progress notes, no section
  longer than the component's own guidelines.
- Norwegian text is Bokmål with en-dash (–), and keeps English technical terms
  as AGENTS.md "Norwegian Text" describes.
