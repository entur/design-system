# From the old components to the new typography

Import the new components from `@entur/typography/beta`, and `@entur/typography/beta/styles` next to `@entur/typography/styles`. The old ones and the new ones can live side by side, so this can be done one page at a time.

| Old                                         | New                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Heading1`                                  | `<Heading as="h1" variant="title-1">`                                                      |
| `Heading2`                                  | `<Heading as="h2" variant="title-2">`                                                      |
| `Heading3`                                  | `<Heading as="h3" variant="subtitle-1">`                                                   |
| `Heading4`                                  | `<Heading as="h4" variant="subtitle-2">`                                                   |
| `Heading5`                                  | `<Heading as="h5" variant="section-1">`                                                    |
| `Heading6`                                  | `<Heading as="h6" variant="section-2">`                                                    |
| `Paragraph`                                 | `<Text variant="paragraph">`                                                               |
| `LeadParagraph`                             | `<Text variant="leading">`                                                                 |
| `SubParagraph`                              | `<Text variant="subparagraph">`                                                            |
| `SmallText`                                 | `<Text variant="caption" as="span">` (12px; the old one was 10–12px)                       |
| `SubLabel`                                  | `<Text variant="sublabel" as="span">`                                                      |
| `Label`                                     | `<Label>` when it labels a field, otherwise `<Text variant="label">`                       |
| `EmphasizedText`                            | `<Text variant="emphasized">`                                                              |
| `StrongText`                                | `<Text as="strong" weight="bold">`                                                         |
| `CodeText`                                  | `<Text variant="code">`                                                                    |
| `PreformattedText`                          | `<Text variant="preformatted">`                                                            |
| `Link`                                      | `Link` from `@entur/typography/beta`                                                       |
| `Blockquote`, `BlockquoteFooter`            | `figure` + `<Text variant="quote">` + `figcaption`, see [beta-changes.md](beta-changes.md) |
| `UnorderedList`, `NumberedList`, `ListItem` | The same names from `@entur/typography/beta`                                               |

Keep `as` when the old component had it. Heading level (`as`) and look (`variant`) are separate, so pick the variant from the design, not from the level.

- **Aliased imports** (`Link as LinkText`, `ListItem as LI`): find them in step 1 and replace them by alias.
- **Name clashes:** the new `Link` clashes with the old `Link` and with router links (`Link as GatsbyLink`, Next.js `Link`). Rename on import, for example `import { Link as TextLink } from '@entur/typography/beta'`.
- **Headings used as something else:** `<Heading5 as="label" htmlFor>` is a field label, so use `Label`. `<Heading3 as="a">` is a link styled as a heading, so put `<Link>` or the router link inside a `Heading` instead, or keep `as="a"` if it isn't a heading in the outline.
- **Inline styles:** move `style={{ marginTop }}` to `spacing`, and `fontWeight: 500/600` to `weight="medium"`/`"bold"` on `Text`. `Heading`, `Link` and `Label` have no `weight`: see step 7 in SKILL.md.

## `margin`

The old components had margins by default (`margin="both"` on most, `"bottom"` on `Paragraph`). The new ones have none. Drop `margin` and follow "No default spacing" in [spacing.md](spacing.md):

- `margin="none"`: remove it, nothing to replace.
- `margin="top"`, `"bottom"` or `"both"`, or no `margin`: decide whether it is running text (`TextContainer`) or UI (`Flex gap` or `spacing`).

## Old CSS class names

CSS that targets the old classes stops matching after the swap.

| Old                                                           | New                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `.eds-h1` … `.eds-h6`                                         | `.eds-heading--<variant>` (`title-1` … `section-2`)                             |
| `.eds-paragraph`                                              | `.eds-text--paragraph`                                                          |
| `.eds-lead-paragraph`                                         | `.eds-text--leading`                                                            |
| `.eds-sub-paragraph`                                          | `.eds-text--subparagraph`                                                       |
| `.eds-small-text`                                             | `.eds-text--caption`                                                            |
| `.eds-label`, `.eds-sub-label`                                | `.eds-text--label`, `.eds-text--sublabel`                                       |
| `.eds-emphasized-text`, `.eds-strong-text`                    | `.eds-text--emphasized`, `.eds-text--weight-bold`                               |
| `.eds-code-text`, `.eds-preformatted-text`                    | `.eds-text--code`, `.eds-text--preformatted`                                    |
| `.eds-link`                                                   | `.eds-text--link`                                                               |
| `.eds-blockquote`                                             | `.eds-text--quote`                                                              |
| `.eds-unordered-list`, `.eds-numbered-list`, `.eds-list-item` | `.eds-text--unordered-list`, `.eds-text--numbered-list`, `.eds-text--list-item` |

Unscoped rules on these classes (`.eds-small-text { font-size }`) restyled every use, so check whether the new default already looks right before carrying them over.

## Check after replacing

- `Heading` with an explicit `as` and a `variant` that matches the design.
- No `margin` props left.
- Text that sat inside a `<p>` or a button is still inline (`as="span"`).
- Small uppercase text made with `toUpperCase()`, or `text-transform` and `letter-spacing`, is `Text variant="overline"`.
- Renderers that map tags to components (Markdown, Portable Text) and check the component type, for example to group blocks, need named components instead of inline functions.
