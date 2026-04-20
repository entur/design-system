# Sanity Patching Reference

Use `mcp__Sanity-linje__patch_document_from_json` to update documents.

## Critical rules

### 1. Always fetch before patching

Get the full block structure (with `_key`, `_type`, `children`, `marks`, `markDefs`) for every block you intend to modify. You need the exact structure to set it correctly.

### 2. Use `set` to replace blocks by `_key`

```json
{
  "set": [
    {
      "path": "tabs[0].content.items[_key==\"abc123\"]",
      "value": {
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
  ]
}
```

### 3. You CANNOT `unset` individual array items by `_key`

This **will error**:

```json
{ "unset": ["tabs[0].content.items[_key==\"abc123\"]"] }
```

Instead, **replace the entire array** via `set`, including only the items you want to keep:

```json
{
  "set": [
    {
      "path": "tabs[0].content.items",
      "value": [
        /* all items to keep, without the deleted ones */
      ]
    }
  ]
}
```

### 4. Use `append` to add items to the end of an array

```json
{
  "append": [
    {
      "path": "tabs[0].content.items",
      "items": [
        {
          "_key": "f1e2d3c4b5a6",
          "_type": "block",
          "style": "h2",
          "markDefs": [],
          "children": [
            {
              "_key": "a9b8c7d6e5f4",
              "_type": "span",
              "marks": [],
              "text": "New heading"
            }
          ]
        },
        {
          "_key": "1a2b3c4d5e6f",
          "_type": "block",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_key": "f4e5d6c7b8a9",
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
```

Use `append` for adding content to the end. Use `set` on the full array when inserting at a specific position or removing items.

### 5. Generating `_key` values

Every block and span needs a unique `_key`. Use random 12-character hex strings (e.g. `"a1b2c3d4e5f6"`). They only need to be unique within the document. When modifying existing blocks, **preserve** original `_key` values. Only generate new keys for new blocks/spans.

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

### 7. Bullet list items

Add `"level": 1` and `"listItem": "bullet"` on the block object (not the span).

## Publishing

Patches create **drafts only**. The published document is unchanged until you explicitly publish:

```json
{
  "resource": { "projectId": "npa0lfls", "dataset": "production" },
  "documentIds": ["doc-id-here"]
}
```

Always confirm with the user before publishing.

## Error handling

If a patch fails:

1. Read the error — common causes: invalid path, missing `_key`, wrong type
2. Re-query the document (use `perspective: "drafts"` if you've already patched once)
3. Fix and retry
4. If the structure seems wrong, verify with `get_schema` using `type: "componentDoc"`
