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

## Lists

No API change.

- **Look:** bullets are dots (rings on the second level), numbers are bold, and items have a small gap. The list uses the body text style. Remove overrides that set line height on `ListItem`.
- **Semantics:** `UnorderedList` sets `role="list"` so Safari keeps announcing it as a list.
- **Numbering:** `start`, `reversed` and `type` work.
- **New:** `NumberedList variant="steps"` shows the numbers in badges, for step-by-step instructions.

## Exports

- Removed: `Blockquote`, `BlockquoteFooter`.
- New: `Label`, `TextContainer`, and `*Props`/`*OwnProps` types for each component.
- `TypographySpacing` now includes the object form `{ top, bottom }`.

## CSS class names

| Old                                                                             | New                                                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `.eds-text--code-text`                                                          | `.eds-text--code`                                                                                       |
| `.eds-text--preformatted-text`                                                  | `.eds-text--preformatted`                                                                               |
| `.eds-text--blockquote`, `.eds-text--blockquote__footer`                        | `.eds-text--quote` (source: your own `figcaption`)                                                      |
| `.eds-text--spacing-*`, `.eds-heading--spacing-*`, `.eds-text--link--spacing-*` | No classes. `spacing` sets `--eds-text-spacing-top` and `--eds-text-spacing-bottom` inline              |
| `.eds-text--list-item::before` (dash and number rings)                          | Bullets: `::before` on `.eds-text--unordered-list > li`. Numbers: `::marker`. Steps: `.eds-text--steps` |
| `.eds-heading--<variant>` alone                                                 | `Heading` with `size` gets both `.eds-heading--<variant>` and `.eds-heading--<size>`                    |

The styles live in `@layer components.primitives`, so unlayered project CSS wins without extra specificity. Overrides that only reset margins can go.
