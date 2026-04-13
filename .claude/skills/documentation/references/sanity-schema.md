# Sanity Schema Reference

## componentDoc structure

```
componentDoc
  ├── title, description, category, subcategory
  ├── npmPackage, figmaLink, isBeta
  ├── intro: textBlocks (with portable text items, often a playground example)
  └── tabs[]: componentDocTab
        ├── title (e.g. "Beskrivelse", "Bruke mal i React", "Tilgjengelighet")
        └── content: textBlocks
              └── items[]: portable text blocks (see block types below)
```

## Block types in portable text items

### block (`_type: "block"`) — text content

```json
{
  "_key": "abc123",
  "_type": "block",
  "style": "normal",
  "markDefs": [],
  "children": [
    { "_key": "x1y2z3", "_type": "span", "marks": [], "text": "Some text" },
    {
      "_key": "a4b5c6",
      "_type": "span",
      "marks": ["code"],
      "text": "inline code"
    }
  ]
}
```

- `style`: `"normal"`, `"h2"`, `"h3"`, `"h4"`
- For bullet lists, add `"level": 1` and `"listItem": "bullet"` to the block

### codeExample (`_type: "codeExample"`)

- `codeDisplayType`: `"playground"` (interactive) or `"plain"` (static)
- `playgroundCode.code`: interactive example source
- `playgroundCode.containerStyle`: optional CSS variable overrides
- `plainCode.code`: static code string
- `plainCode.language`: e.g. `"jsx"`, `"bash"`, `"css"`

### Other block types

- `propsTable` — component props documentation
- `guideline` — do/don't design guidelines
- `media` — images and video
- `imageAndText` — side-by-side layout

## Document types

| Type           | Description                                             |
| -------------- | ------------------------------------------------------- |
| `componentDoc` | Component documentation with tabs, code examples, props |
| `page`         | General articles and content pages                      |

## Object types

| Type              | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `textBlocks`      | Main content container (variants: normal, information, contrast, alert) |
| `componentDocTab` | Tab container in component docs                                         |
| `codeExample`     | Code display block (playground or plain)                                |
| `guideline`       | Do/don't design guidelines                                              |
| `propsTable`      | Component props documentation                                           |
| `media`           | Images and video embeds                                                 |
| `imageAndText`    | Side-by-side layout                                                     |
| `link`            | Internal/external links                                                 |
| `group`           | Content grouping                                                        |

## Utility objects

| Type             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `inlineIcon`     | Icon references in text                                  |
| `copyableText`   | Copyable code snippets                                   |
| `plainCode`      | Static code display                                      |
| `playgroundCode` | Interactive code examples with optional `containerStyle` |
| `playgroundProp` | Prop controls for playground                             |
