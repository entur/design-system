# Sanity Patching Reference

Use `mcp__Sanity__patch_documents` to update documents. Input shape:

```json
{
  "resource": { "projectId": "npa0lfls", "dataset": "production" },
  "documents": {
    "doc-id-here": {
      "patches": [
        /* one or more operations, applied as a single transaction */
      ]
    }
  }
}
```

Each entry under `documents` is keyed by document ID (published, `drafts.<id>`, or
`versions.<releaseId>.<id>`) and applies its `patches` atomically — they all succeed or all
fail together. Up to 25 documents per call.

## Critical rules

### 1. Always fetch before patching

Get the full block structure (with `_key`, `_type`, `children`, `marks`, `markDefs`) for every block you intend to modify, and the exact `_key` of the section/array you're targeting. You need the exact structure to set it correctly.

### 2. Use `set` to replace a value by path

```json
{
  "set": {
    "tabs[_key==\"tabKey\"].sections[_key==\"sectionKey\"].items[_key==\"abc123\"]": {
      "_key": "abc123",
      "_type": "block",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_key": "x1y2z3",
          "_type": "span",
          "marks": [],
          "text": "Updated text"
        }
      ]
    }
  }
}
```

`set` takes an object mapping path → new value, not an array — you can update multiple paths in one `set`.

### 3. You CANNOT `unset` individual array items and expect siblings preserved automatically

`unset` takes an array of paths and removes each one:

```json
{
  "unset": [
    "tabs[_key==\"tabKey\"].sections[_key==\"sectionKey\"].items[_key==\"abc123\"]"
  ]
}
```

This works for removing one array item by `_key`. If you need to remove several items or
reorder what remains, it's simpler and less error-prone to `set` the entire array to the
items you want to keep.

### 4. Use `insert` to add items into an array

```json
{
  "insert": {
    "after": "tabs[_key==\"tabKey\"].sections[-1]",
    "items": [
      {
        "_key": "f1e2d3c4b5a6",
        "_type": "docSection",
        "title": "Kom i gang",
        "items": [
          {
            "_key": "a9b8c7d6e5f4",
            "_type": "block",
            "style": "normal",
            "markDefs": [],
            "children": [
              {
                "_key": "1a2b3c4d5e6f",
                "_type": "span",
                "marks": [],
                "text": "Paragraph text."
              }
            ]
          }
        ]
      }
    ]
  }
}
```

- `{"after": "field[-1]"}` appends to the end of an array; `{"before": "field[0]"}` prepends.
- `{"replace": "field[_key==\"k\"]"}` replaces one existing item in place.
- The target array must already exist. If a tab has no `sections` array yet, first
  `setIfMissing: { "tabs[_key==\"tabKey\"].sections": [] }` before inserting into it.

### 5. Generating `_key` values

Every block, span, and array item (including `docSection` entries) needs a unique `_key`. Use random 12-character hex strings (e.g. `"a1b2c3d4e5f6"`). They only need to be unique within the document. When modifying existing blocks, **preserve** original `_key` values. Only generate new keys for new items.

### 6. Portable text span structure

Every span must have `_key`, `_type: "span"`, `marks` (array), and `text`:

```json
{ "_key": "a1b2c3d4e5f6", "_type": "span", "marks": [], "text": "Plain text" }
```

| Mark       | Effect      |
| ---------- | ----------- |
| `"code"`   | Inline code |
| `"strong"` | Bold        |
| `"em"`     | Italic      |

### 7. Bullet/numbered list items

Add `"level": 1` and `"listItem": "bullet"` (or `"listItem": "number"`) on the block object (not the span).

## Publishing

Patches are saved to the draft (or a specified release version) only — the published document is unchanged until you explicitly publish:

```json
{
  "resource": { "projectId": "npa0lfls", "dataset": "production" },
  "ids": ["doc-id-here"]
}
```

via `mcp__Sanity__publish_documents`. Always confirm with the user before publishing.

## Error handling

If a patch fails:

1. Read the error — common causes: invalid path, missing `_key`, wrong `_type`, targeting an array that doesn't exist yet (use `setIfMissing` first)
2. Re-query the document (use `perspective: "drafts"` if you've already patched once)
3. Fix and retry
4. If the structure seems wrong, verify with `mcp__Sanity__get_schema` (or `get_document` on the doc itself)
