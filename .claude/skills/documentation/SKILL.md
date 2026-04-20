---
name: documentation
description: Use when reading, updating, or creating documentation for design system components. Triggers on tasks involving Sanity content, component docs, documentation pages, or the documentation website. Use this skill whenever the user mentions docs, component documentation, Sanity content, the documentation website, or wants to update descriptions for components in the design system.
---

# Documentation Skill

Documentation in the Entur Design System lives in **two places**:

## 1. Sanity CMS — component docs and articles

- **MCP server:** `Sanity-linje` (tools are prefixed `mcp__Sanity-linje__*`)
- **Project ID:** `npa0lfls` | **Dataset:** `production`
- **Studio app:** `apps/studio-linje/`
- **Document types:** `componentDoc` (component docs with tabs) and `page` (articles)

All Sanity tools are deferred. Load each via ToolSearch before first use:

```
ToolSearch: select:mcp__Sanity-linje__query_documents
ToolSearch: select:mcp__Sanity-linje__patch_document_from_json
ToolSearch: select:mcp__Sanity-linje__publish_documents
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

Read [references/sanity-querying.md](references/sanity-querying.md) for GROQ patterns, strategic querying, and drafts handling.

Read [references/sanity-patching.md](references/sanity-patching.md) for how to update documents — critical rules for `set`, `append`, `unset`, portable text structure, `_key` generation, publishing, and error handling.

Read [references/sanity-schema.md](references/sanity-schema.md) for document structure, schema types, and the componentDoc tree.

## Common tasks

### Update component docs after a release

1. `git log` between release commits — focus on `feat` and `fix` for consumer-facing changes
2. Query the `componentDoc` by title in Sanity
3. Get tab content structure with `_key` values (see querying reference)
4. Get full block structures for blocks to modify
5. Patch with updated text (see patching reference)
6. Tell user changes are saved as draft; confirm before publishing

### Add a new section

1. Get the current items array for the target tab
2. Create new blocks with unique `_key` values (random 12-char hex)
3. Use `append` to add to the end, or `set` the entire array to insert at a specific position

### Fix duplicate or broken content

1. Query the full items array for the affected tab
2. Filter out duplicates or fix broken blocks
3. `set` the entire `tabs[N].content.items` array with the corrected version
