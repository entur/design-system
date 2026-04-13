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
*[_type == "componentDoc"]{_id, title, category, subcategory, isBeta} | order(title asc)
```

## Query strategically

Full documents can be very large (50KB+). Always query in stages — never fetch the full document unless absolutely necessary.

**Step 1 — Structure overview:**

```groq
*[_id == "doc-id"]{
  title,
  "tab_titles": tabs[].title,
  "tab_item_count": count(tabs[].content.items[])
}
```

**Step 2 — Tab content with `_key` values:**

```groq
*[_id == "doc-id"]{
  "items": tabs[0].content.items[]{ _key, _type, style, "text": children[].text }
}
```

**Step 3 — Full block structure for specific blocks you need to modify:**

```groq
*[_id == "doc-id"]{
  "block": tabs[0].content.items[_key == "abc123"][0]
}
```

**Fetch multiple blocks at once:**

```groq
*[_id == "doc-id"]{
  "block_a": tabs[0].content.items[_key == "abc"][0],
  "block_b": tabs[0].content.items[_key == "def"][0]
}
```

## Drafts and document IDs

Sanity uses a `drafts.` prefix on `_id` for unpublished changes. When you patch a published document, Sanity creates a draft at `drafts.<original-id>`.

- **Published:** `_id == "abc-123"`
- **Draft:** `_id == "drafts.abc-123"`

By default, queries return **published** documents. To see drafts after patching, use `perspective: "drafts"` or query the `drafts.`-prefixed ID directly.
