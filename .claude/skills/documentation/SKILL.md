---
name: documentation
description: Use when reading, updating, or creating documentation for design system components. Triggers on tasks involving Sanity content, component docs, documentation pages, or the documentation website. Use this skill whenever the user mentions docs, component documentation, Sanity content, the documentation website, or wants to update descriptions for components in the design system.
---

# Documentation Skill

Documentation in the Entur Design System lives in **two places**:

## 1. Sanity CMS — component docs and articles

- **MCP server:** `Sanity` (tools are prefixed `mcp__Sanity__*`)
- **Project ID:** `npa0lfls` | **Dataset:** `production`
- **Studio app:** `apps/studio-linje/`
- **Document types:** `componentDoc` (component docs with tabs) and `page` (articles)

All Sanity tools are deferred. Load each via ToolSearch before first use:

```
ToolSearch: select:mcp__Sanity__query_documents
ToolSearch: select:mcp__Sanity__patch_documents
ToolSearch: select:mcp__Sanity__publish_documents
```

If the MCP server is disconnected, ask the user to reconnect via `/mcp`.

Always pass `resource` on every call:

```json
{ "resource": { "projectId": "npa0lfls", "dataset": "production" } }
```

## 2. Local MDX files — design guides and identity pages

- **Location:** `apps/documentation/src/pages/` (file-based Gatsby routing)
- **Format:** MDX with frontmatter (`title`, `description`, `route`, `menu`, `order`)
- These are **not** in Sanity. Edit them directly.

## How the website works

The docs site (`apps/documentation/`) is a Gatsby 5 app:

- Sanity content pulled at build time via `gatsby-source-sanity`
- MDX files processed via `gatsby-plugin-mdx`
- Portable text rendered with custom resolvers in `PortableText.tsx`
- Templates: `ComponentDocTemplate.tsx` (componentDoc) and `ContentTemplate.tsx` (page)

## Working with Sanity

Read [references/component-doc-standard.md](references/component-doc-standard.md) **first**
for what to write and where — the standard tabs, standard section titles per tab, writing
principles, and how to migrate a tab from legacy `content` to the current `sections` model.
The files below cover mechanics only, not what "correct" documentation looks like.

Read [references/sanity-querying.md](references/sanity-querying.md) for GROQ patterns, strategic querying, and drafts handling.

Read [references/sanity-patching.md](references/sanity-patching.md) for how to update documents — critical rules for `set`, `insert`, `unset`, portable text structure, `_key` generation, publishing, and error handling.

Read [references/sanity-schema.md](references/sanity-schema.md) for document structure, schema types, and the componentDoc tree.

## Writing Norwegian docs

All documentation prose is Bokmål, never Nynorsk.

**Do not translate technical terms.** Keep the English word when it is:

- the name of a prop, function, keyword, type, HTML element, or CSS feature — `children`, `ref`, `disabled`, `useEffect`, `aria-live`, `role="status"`, `cascade layer`
- a framework or platform concept a Norwegian developer would say in English anyway — `parent`, `state`, `hook`, `callback`, `default`, `token`, `wrapper`, `live region`

Translate only ordinary words: component → komponent, page → side, button → knapp, width → bredde.

Inflect around the English term rather than Norwegianising it: `props`-ene, `prop`-en, `children`-en, `items`-prop-en. Never `proppene`, and never invent a Norwegian noun for something the API calls something else — the reader has to map the word back to the code.

Rule of thumb: if a Norwegian developer would say the English word out loud, keep the English word.

Other prose rules:

- No literally translated English idioms. Describe the goal plainly instead.
- Prefer a comma or full stop over a dash when joining clauses. When a dash is right, use an en-dash (–), never an em-dash.
- Keep it generic — never bake one team's component or domain names into the docs.

## Common tasks

### Write or update a component doc section

1. Read [references/component-doc-standard.md](references/component-doc-standard.md) to
   decide which tab and section title the content belongs to.
2. Query the `componentDoc` by title in Sanity; get the tab's current `sections` (see
   querying reference) so you know whether the target section already exists.
3. Write content using the standard's guidance on which block type to use (prose vs. list vs.
   `guideline` vs. `codeExample` vs. `propsTable`).
4. Patch with `insert` (new section) or `set` (editing an existing block) — see patching
   reference.
5. Tell the user changes are saved as draft; confirm before publishing.

### Migrate a tab from legacy `content` to `sections`

Follow the step-by-step migration procedure in
[references/component-doc-standard.md](references/component-doc-standard.md#migrating-a-tab-from-legacy-content-to-sections).
Leave `content` in place until every section from it has been moved; confirm with the user
before publishing.

### Update component docs after a release

1. `git log` between release commits — focus on `feat` and `fix` for consumer-facing changes
2. Query the `componentDoc` by title in Sanity
3. Get the tab's `sections` with `_key` values (see querying reference) — or `content.items`
   if the tab isn't migrated yet
4. Get full block structures for blocks to modify
5. Patch with updated text (see patching reference)
6. Tell user changes are saved as draft; confirm before publishing

### Add a new section

1. Read the standard ([component-doc-standard.md](references/component-doc-standard.md)) to
   pick the right section title for the content
2. `setIfMissing` the tab's `sections` array if it doesn't exist yet
3. `insert` a new `docSection` (`{_key, title, items}`) with unique `_key` values (random 12-char hex)

### Fix duplicate or broken content

1. Query the full `sections` (or legacy `content.items`) for the affected tab
2. Filter out duplicates or fix broken blocks
3. `set` the entire array with the corrected version
