# API changes in `@entur/typography/beta`

For spacing values and default margins, see [spacing.md](spacing.md).

## `margin` is removed

`margin` is no longer a prop, so TypeScript reports it. Remove it. If the space is still needed, use `spacing` (see spacing.md).

## Renamed variants

| Old                           | New                      |
| ----------------------------- | ------------------------ |
| `variant="code-text"`         | `variant="code"`         |
| `variant="preformatted-text"` | `variant="preformatted"` |

Code text now follows the size and weight of the text around it, and has no border. Remove overrides that set its font size.

## `variant="link"` is removed from `Text`

Use `Link`:

```tsx
// Before
<Text variant="link" href="/vilkar">
  Vilkår
</Text>;

// After
import { Link } from '@entur/typography/beta';
<Link href="/vilkar">Vilkår</Link>;
```

## `external` is removed from `Link`

The icon was read as both "another site" and "opens in a new tab". Remove `external` and `ariaLabelExternalIcon`, and say it in the link text when it matters:

- **Opens in a new tab** (`target="_blank"`): add "(åpnes i ny fane)" to the link text. Ask the team whether the link needs a new tab at all; keep it only where leaving would lose the user's input or session.
- **Another site:** the text or the context usually says so already. If not, name the site, for example "Les mer på regjeringen.no".

```tsx
// Before
<Link href="https://regjeringen.no" external target="_blank" rel="noreferrer">
  Les mer
</Link>

// After
<Link href="https://regjeringen.no">Les mer på regjeringen.no</Link>
```

## `Blockquote` and `BlockquoteFooter` are removed

Use `Text variant="quote"`. Put a source in `figure` + `figcaption`:

```tsx
// Before
<Blockquote>
  Sitat
  <BlockquoteFooter>Kilde</BlockquoteFooter>
</Blockquote>

// After
<figure>
  <Text variant="quote">Sitat</Text>
  <figcaption>
    <Text variant="caption">Kilde</Text>
  </figcaption>
</figure>
```

Without a source, `<Text variant="quote">` alone is enough.

## New HTML elements

| Variant                           | Old element | New element |
| --------------------------------- | ----------- | ----------- |
| `caption`, `overline`, `sublabel` | `<span>`    | `<p>`       |
| `label`                           | `<label>`   | `<p>`       |
| `emphasized`                      | `<p>`       | `<em>`      |

`as` still wins over the variant, so code with `as` keeps its element.

- **Inline use:** a `caption`, `overline` or `sublabel` without `as` inside a `<p>`, `<button>`, `<label>`, `<a>` or another inline element now gives invalid HTML. Add `as="span"`.
- **`emphasized` as its own line:** where it was a block, add `as="p"`.
- **Form labels:** `Text variant="label"` with `htmlFor`, or with `as="label"`, becomes `Label`:

  ```tsx
  // Before
  <Text variant="label" htmlFor="navn">Navn</Text>
  <Text variant="label" as="label" htmlFor="navn">Navn</Text>

  // After
  import { Label } from '@entur/typography/beta';
  <Label htmlFor="navn">Navn</Label>
  ```

  `Label` takes `htmlFor`, `spacing`, `className` and the other `<label>` attributes. Keep `Text variant="label"` for label-styled text that doesn't label a field.

  `Label` is a block, so `spacing` works. Something that sat next to an inline label, such as a tooltip trigger, now wraps below it. Put both in `<Flex align="center" gap="xs">`.

## `label` and `sublabel` are removed from `Heading`

Use `Text variant="label"` or `Text variant="sublabel"`, or `Label` when the text labels a form field.

## `weight`

Only `medium` (500) and `bold` (600) are valid. The other values are removed, so TypeScript reports them.

| Old               | New      |
| ----------------- | -------- |
| `regular`, `400`  | `medium` |
| `500`             | `medium` |
| `semibold`, `600` | `bold`   |
| `700`             | `bold`   |

## `size`

- `size` now always overrides `variant` on both `Text` and `Heading`. Before, `Text` with both looked like the variant. Where `Text` has both, check whether the size or the variant was meant, and remove the other.
- `Text` sizes are `xs | s | m | lg | xl`. `size="2xl"` is removed: use `xl`, or a `Heading` if it is a heading. `size="lg"` now has a style (before, it had none).

## `Text` without `variant`

- **On its own line** (no `as`, or `as="p" | "div" | "li" | "dd" | "dt" | "figcaption"`): it is now a paragraph (body-m). Before, it had no size of its own. Remove CSS that set body text on it.
- **Inside other text** (`as="span"`, `"strong"`, a heading element or a component): it now inherits colour and weight as well as size. Before, it set the text colour and medium weight. `weight` and `size` still apply.

## `Heading` defaults to `h2`

`Heading` without `as` is now an `h2` with `title-2` (before: `h1` with `title-1`). A non-heading `as` without `variant` also gets `title-2`. Where the page title relied on the default, add `as="h1"`.

## Lists

No API change.

- **Look:** bullets are dots (rings on the second level), numbers are bold, and items have a small gap. The list uses the body text style. Remove overrides that set line height on `ListItem`.
- **Semantics:** `UnorderedList` sets `role="list"` so Safari keeps announcing it as a list.
- **Numbering:** `start`, `reversed` and `type` work.
- **New:** `NumberedList variant="steps"` shows the numbers in badges, for step-by-step instructions.

## Exports

- Removed: `Blockquote`, `BlockquoteFooter`, and the `external` and `ariaLabelExternalIcon` props on `Link`.
- New: `Label`, `TextContainer`, `tone="subdued"` on `Text` and `Heading` (replaces CSS that sets the subdued text colour), `maxLines` on `Text` and `Heading` (replaces your own `text-overflow` or `line-clamp`), and `*Props`/`*OwnProps` types for each component.
- `TypographySpacing` now includes the object form `{ top, bottom }`.

## CSS class names

| Old                                                                             | New                                                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `.eds-text--code-text`                                                          | `.eds-text--code`                                                                                       |
| `.eds-text--preformatted-text`                                                  | `.eds-text--preformatted`                                                                               |
| `.eds-text--blockquote`, `.eds-text--blockquote__footer`                        | `.eds-text--quote` (source: your own `figcaption`)                                                      |
| `.eds-text--link--ext-icon`                                                     | Removed with `external`                                                                                 |
| `.eds-text--spacing-*`, `.eds-heading--spacing-*`, `.eds-text--link--spacing-*` | No classes. `spacing` sets `--eds-text-spacing-top` and `--eds-text-spacing-bottom` inline              |
| `.eds-text--list-item::before` (dash and number rings)                          | Bullets: `::before` on `.eds-text--unordered-list > li`. Numbers: `::marker`. Steps: `.eds-text--steps` |
| `.eds-heading--<variant>` alone                                                 | `Heading` with `size` gets both `.eds-heading--<variant>` and `.eds-heading--<size>`                    |

The styles live in `@layer components.primitives`, so unlayered project CSS wins without extra specificity. Overrides that only reset margins can go.

This also goes for global element rules that never targeted typography: `* { margin: 0 }` removes every gap in `TextContainer`, and `a`, `p`, `h1`–`h6`, list and `code` rules restyle the components. Move resets into `@layer core.reset` and element styles into `@layer core.base`, with the layer order declared first in the app's first stylesheet. The recipe and the symptoms are in [the CSS layers guide](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-web-development/references/css-layers.md), section "The beta typography and your global CSS".

Also watch for:

- **`background` on links.** `Link` draws its underline as a background image, so a reset like `background: none` on a link, or on a button rendered as one, removes it. Reset `background-color` only.
- **A font size of your own.** Line heights are fixed per variant, so a custom `font-size` on a heading or text can put the lines too close. Use `size`, or set `line-height` with it.
- **Colour on a wrapper** doesn't reach the text components, which set their own colour. Set it on the component.
- **Rules that already did nothing.** Code that was partly migrated before can have CSS for class names that no longer render. Remove it instead of renaming it.
