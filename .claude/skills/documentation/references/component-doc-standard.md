# Component Documentation Standard

This is the standard for _what to write and where_, not how to call Sanity tools (see
[sanity-schema.md](sanity-schema.md), [sanity-querying.md](sanity-querying.md),
[sanity-patching.md](sanity-patching.md) for mechanics). Read this before writing or
editing any `componentDoc` content.

## The 3 standard tabs

Every component doc should have exactly these tabs, in this order. Custom extra tabs (e.g.
a "Figma" tab) are tolerated but are not the target — don't add one unless the user asks.

| Tab                 | Purpose                                                                       | Audience question it answers |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| **Oversikt**        | Why the component exists and when to reach for it                             | "Should I use this?"         |
| **Kode**            | How to implement it                                                           | "How do I use this?"         |
| **Tilgjengelighet** | What accessibility guarantees it gives, and what the consumer still has to do | "What do I need to check?"   |

Content goes into `tabs[].sections[]` (`docSection`). Never add new content to the
deprecated `tabs[].content` field, and never add to the deprecated top-level `beskrivelse`/
`utvikling` fields — those only exist for docs not yet migrated.

## Standard sections per tab

Use these titles where the content fits — they exist so every component's docs have the
same shape, which is what makes the docs skimmable across the whole design system. A custom
title is fine when the standard ones genuinely don't fit the content, but reach for a custom
title as the exception, not the default.

### Oversikt

1. **"Bruk `<ComponentName>` når"** — the component's own name is substituted automatically
   in Sanity Studio's suggestion, so write it out with the real name in prose too (e.g. "Bruk
   Knapp når"). Content: a short list or a few sentences of concrete situations where this
   component is the right choice — not a restatement of what the component _is_.
2. **"Retningslinjer"** — do/don't guidance. Prefer `guideline` blocks (with `variant`
   `success`/`negative`) over plain prose so the do/don't framing is visually distinct, not
   just implied by wording.
3. **"Eksempler"** — one or more runnable examples via `codeExample` with
   `codeDisplayType: "playground"`. Show realistic usage, not a contrived minimal case.

### Kode

1. **"Kom i gang"** — the smallest complete example that renders the component correctly:
   import statement + minimal JSX. This is what a developer copy-pastes first.
2. **"Eksempler"** — additional `codeExample` playgrounds covering realistic variations
   beyond the minimal case: common prop combinations, composition with other components,
   relevant states/edge cases. "Kom i gang" is the minimal starting point; "Eksempler" is
   where the less trivial usage lives.
3. **"Komponentprops"** — a `propsTable` block (just `componentName`), not hand-written prose
   describing props. The props table is generated live from the component's actual prop
   types, so don't duplicate that information in text elsewhere in the tab.

### Tilgjengelighet

1. **"Sjekkliste"** — a bullet list of accessibility guarantees the component already
   handles (e.g. focus indicator, ARIA labeling) so the consumer knows what they don't need
   to re-implement themselves.
2. **"WCAG-kriterier"** — which WCAG success criteria are relevant/satisfied, referenced by
   number and name where possible (e.g. "1.4.3 Kontrast (minimum)").

## Writing principles

- **One concern per section.** If a section is covering two different questions, split it —
  don't let "Kom i gang" drift into prop documentation, or "Sjekkliste" drift into WCAG
  citations.
- **Prefer the right block type over prose.** A checklist is a bullet list, not a paragraph
  describing a list. A runnable example is a `codeExample` playground, not a code-formatted
  paragraph. A do/don't is a `guideline` block, not a sentence starting with "Husk at...".
  Plain prose (`block`) is for things that genuinely need explaining in sentences — context,
  rationale, exceptions.
- **Concise and scannable.** Component docs are reference material a developer skims under
  time pressure, not an article read start to finish. Short paragraphs, headings where a
  section has sub-parts, lists over dense prose.
- **Write for the reader making a decision**, not for someone documenting the component's
  existence. "Bruk X når ..." should read as advice ("use this when you need durable
  primary actions"), not as a definition ("X is a component that ...").
- **Don't repeat what's already generated.** The props table, code playground output, and
  the Figma link are already sourced live — don't hand-write a second copy of that
  information in a text block nearby.

## Custom section titles: when they're appropriate

Use a custom title when the content genuinely doesn't map to one of the standard sections —
e.g. a component with a non-obvious composition pattern that needs its own explanatory
section, or a migration note that only applies to one component. Don't invent a custom title
just to avoid deciding which standard section something belongs in; that's usually a sign
the content needs to be split across the standard sections instead.

## Migrating a tab from legacy `content` to `sections`

Many docs are mid-migration: a tab may have both a populated (or empty, placeholder) legacy
`content` field and a `sections` array being built up alongside it. To migrate a tab:

1. Read the tab's legacy `content.items` in full.
2. Group the content by which standard section it belongs to (see tables above). Content
   that doesn't fit a standard section keeps its own heading as a custom section title.
3. For each group, `setIfMissing` the tab's `sections` array if it doesn't exist yet, then
   `insert` a new `docSection` (`{title, items}`) built from that group's blocks. Reuse
   existing `_key`s on blocks you're moving unchanged; only generate new `_key`s for the new
   `docSection` wrapper itself and for genuinely new content.
4. Leave the legacy `content` field in place until **every** section from it has been moved
   — the schema still validates fine either way, and the docs site renders `sections` when
   present, falling back to `content` otherwise (`ComponentDocTemplate.tsx` resolves
   `_rawSections ?? _rawContent`). Only remove `content` once nothing in it is still needed.
5. Confirm the result with the user before publishing.

A partially migrated tab typically looks like this: legacy `content` still holds several
original sections (e.g. "Kom i gang", "Produktnavn", "Størrelse"), while `sections` contains
only the ones moved so far — often just the first one or two. Blocks not yet split into their
own section (e.g. a `propsTable` block still under "Komponentprops") stay in `content` until
moved.

## Pre-publish self-check

Before telling the user a doc is ready to publish, verify:

- [ ] Every tab has at least one `sections` entry (or, if not yet migrated, legacy `content`)
- [ ] Standard section titles are used wherever the content fits them
- [ ] No leftover placeholder text (e.g. "TODO", lorem ipsum, copy-pasted text from another
      component that wasn't adapted)
- [ ] All new `_key` values are unique within the document
- [ ] Props tables reference the correct `componentName`
- [ ] Code examples actually run (correct import path/prop names for the current component API)
- [ ] Changes are still in draft — publishing is a separate, explicit step the user confirms
