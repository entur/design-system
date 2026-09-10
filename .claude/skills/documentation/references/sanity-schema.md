# Sanity Schema Reference

## componentDoc structure

```
componentDoc
  ├── title, description, category, subcategory
  ├── npmPackage, figmaLink, tag
  ├── intro: textBlocks (optional, shown above the tabs — typically a playground example)
  ├── tabs[]: componentDocTab
  │     ├── title (standard: "Oversikt", "Kode", "Tilgjengelighet" — custom titles allowed)
  │     ├── sections[]: docSection            ← current standard, use this for new/edited content
  │     │     ├── title (optional but recommended — see standard section titles below)
  │     │     └── items[]: portable text blocks (see block types below)
  │     └── content: textBlocks (deprecated)  ← legacy freeform blob, do not add to
  └── legacyTabs fieldset (deprecated, collapsed): beskrivelse, utvikling — both textBlocks,
        predate the tabs/sections model entirely. Only present on not-yet-migrated docs.
```

`tag` is a free-text string, not a boolean. There's no `isBeta` field — "beta" status is
inferred at render time by the docs site (`isBetaTag()` in
`apps/documentation/src/utils/utils.ts`) checking whether `tag === "beta"` (case-insensitive).
Setting `tag: "beta"` renders the tag badge in the warning color and appends `/beta` to the
npm-package link/URL.

A tab must have at least one `sections` entry OR legacy `content` — the schema rejects an
empty tab. See [component-doc-standard.md](component-doc-standard.md) for what belongs in
each tab and section, and how to migrate a tab from `content` to `sections`.

Source of truth in the repo:

- `apps/studio-linje/schemaTypes/documents/componentDoc.tsx`
- `apps/studio-linje/schemaTypes/objects/componentDocTab.ts`
- `apps/studio-linje/schemaTypes/objects/docSection.tsx`
- `apps/studio-linje/components/TitleSuggestionsInput.tsx` (tab → section-title suggestions)

## Standard tab and section titles

The Sanity Studio input suggests these titles (custom titles are still accepted, but prefer
these for consistency across components):

| Tab                 | Standard section titles                                     |
| ------------------- | ----------------------------------------------------------- |
| **Oversikt**        | "Bruk `<ComponentName>` når", "Retningslinjer", "Eksempler" |
| **Kode**            | "Kom i gang", "Eksempler", "Komponentprops"                 |
| **Tilgjengelighet** | "Sjekkliste", "WCAG-kriterier"                              |

The first Oversikt section title is dynamic — it's always "Bruk `<title>` når" where
`<title>` is the component's own `title` field (e.g. "Bruk Knapp når").

## Block types in portable text items (inside `docSection.items` or legacy `content.items`)

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

- `style`: `"normal"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`
- For bullet/numbered lists, add `"level": 1` and `"listItem": "bullet"` or `"listItem": "number"` to the block

### codeExample (`_type: "codeExample"`)

- `codeDisplayType`: `"playground"` (interactive), `"plain"` (static), or `"copyable"` (copy-to-clipboard snippet)
- `playgroundCode.code`: interactive example source
- `playgroundCode.containerStyle`: optional CSS variable overrides
- `playgroundCode.hideCode`: optional, hides the source code panel
- `plainCode.code` / `plainCode.language`: static code string and language (e.g. `"jsx"`, `"bash"`, `"css"`)
- `copyableText`: text shown with a copy button

### Other block types

- `propsTable` — takes just a `componentName`; renders that component's live props table
- `guideline` — do/don't design guidance: `variant` (`success` | `information` | `warning` | `negative` | `none`), `title`, `text` (portable text), optional `image`/`alt`
- `media` — images and video
- `imageAndText` — side-by-side layout (deprecated)
- `link`, `group` — link blocks and generic content grouping

## Document types

| Type           | Description                                             |
| -------------- | ------------------------------------------------------- |
| `componentDoc` | Component documentation with tabs, code examples, props |
| `page`         | General articles and content pages                      |

## Object types

| Type              | Purpose                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| `textBlocks`      | Legacy content container (variants: normal, information, contrast, alert)   |
| `componentDocTab` | Tab container in component docs (`title`, `sections`, deprecated `content`) |
| `docSection`      | Titled content section within a tab — the current standard content unit     |
| `codeExample`     | Code display block (playground, plain, or copyable)                         |
| `guideline`       | Do/don't design guidelines                                                  |
| `propsTable`      | Component props documentation                                               |
| `media`           | Images and video embeds                                                     |
| `imageAndText`    | Side-by-side layout (deprecated)                                            |
| `link`            | Internal/external links                                                     |
| `group`           | Content grouping                                                            |

## Utility objects

| Type             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `inlineIcon`     | Icon references in text                                  |
| `copyableText`   | Copyable code snippets                                   |
| `plainCode`      | Static code display                                      |
| `playgroundCode` | Interactive code examples with optional `containerStyle` |
| `playgroundProp` | Prop controls for playground                             |
