# Sanity Querying Reference

## GROQ cheatsheet

```groq
// Find component doc by title (fuzzy)
*[_type == "componentDoc" && title match "Portal*"]{_id, title, category}

// Find by category/subcategory
*[_type == "componentDoc" && category == "Mønster"]{_id, title, subcategory}

// Find page by slug
*[_type == "page" && slug.current == "my-slug"]{_id, title}

// List all component docs
*[_type == "componentDoc"]{_id, title, category, subcategory} | order(title asc)
```

## Query strategically

Full documents can be very large (50KB+). Always query in stages — never fetch the full document unless absolutely necessary.

**Step 1 — Structure overview:**

```groq
*[_id == "doc-id"]{
  title,
  "tab_titles": tabs[].title,
  "tab_section_titles": tabs[].sections[].title,
  "tab_section_count": count(tabs[].sections[]),
  "tab_has_legacy_content": tabs[].content != null
}
```

**Step 2 — Sections and their content with `_key` values, for one tab:**

```groq
*[_id == "doc-id"]{
  "sections": tabs[0].sections[]{ _key, title, items[]{ _key, _type, style, "text": children[].text } }
}
```

**Step 3 — Full block structure for specific items you need to modify:**

```groq
*[_id == "doc-id"]{
  "block": tabs[0].sections[_key == "sectionKey"][0].items[_key == "abc123"][0]
}
```

**Fetch multiple blocks at once:**

```groq
*[_id == "doc-id"]{
  "block_a": tabs[0].sections[_key == "sectionKey"][0].items[_key == "abc"][0],
  "block_b": tabs[0].sections[_key == "sectionKey"][0].items[_key == "def"][0]
}
```

**Legacy tabs** (not yet migrated) still use `content.items` instead of `sections`:

```groq
*[_id == "doc-id"]{
  "items": tabs[0].content.items[]{ _key, _type, style, "text": children[].text }
}
```

## When a query misbehaves

- **Timeouts.** A broad projection over a large document times out rather than truncating.
  Narrow the projection and query one tab or one section at a time.
- **An empty result is not proof of absence.** The same query can return rows once and
  `0 documents` a moment later — if a result contradicts what you saw earlier, re-run it
  before concluding the content is gone. Confirm a document still exists with a cheap
  `*[_type == "componentDoc" && title == "X"]{_id, _rev, _updatedAt}`.
- **A missing draft means someone published.** Querying `drafts.<id>` and getting nothing
  back, while the published `<id>` holds your edits, means the draft was published — often
  by the user in Studio while you were working. Check `_updatedAt` before assuming your
  patch went missing.
- **Probe unknown field shapes with `count()`** (`{"n": count(field.items)}`) instead of
  fetching the field and guessing whether it's an array or an object wrapper.

## Drafts and document IDs

Sanity uses a `drafts.` prefix on `_id` for unpublished changes. When you patch a published document, Sanity creates a draft at `drafts.<original-id>`.

- **Published:** `_id == "abc-123"`
- **Draft:** `_id == "drafts.abc-123"`

By default (`perspective: "raw"`), `mcp__Sanity__query_documents` returns whatever is stored under that exact `_id` — draft or published, whichever you queried for. Use `perspective: "drafts"` to see the draft version of a document you queried by its published ID, or `perspective: "published"` to see only published content.
