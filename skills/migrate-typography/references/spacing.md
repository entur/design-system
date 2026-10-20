# Spacing

Typography `spacing` and layout beta `gap` now use one scale. The values follow `data-view-mode`. Sizes below are for the standard view mode.

| Name | `2xs` | `xs` | `s` | `m` | `lg` | `xl` | `2xl` | `3xl` | `4xl` | `5xl` | `6xl` |
| ---- | ----- | ---- | --- | --- | ---- | ---- | ----- | ----- | ----- | ----- | ----- |
| px   | 4     | 8    | 12  | 16  | 20   | 24   | 28    | 32    | 36    | 40    | 48    |

## Rename: typography `spacing`

Applies to `Heading`, `Text`, `Link` and the lists.

| Old   | New   | Size |
| ----- | ----- | ---- |
| `xs2` | `2xs` | 4px  |
| `xs`  | `xs`  | 8px  |
| `sm`  | `s`   | 12px |
| `md`  | `m`   | 16px |
| `lg`  | `xl`  | 24px |
| `xl`  | `3xl` | 32px |

`lg` and `xl` exist in both, but mean a smaller size now. Rename `xl` → `3xl` before `lg` → `xl`, or `lg` is renamed twice.

The `-top` and `-bottom` values become an object. The other side is 0, as before:

```tsx
// Before
<Text spacing="sm-top">…</Text>
<Heading spacing="lg-bottom">…</Heading>

// After
<Text spacing={{ top: 's' }}>…</Text>
<Heading spacing={{ bottom: 'xl' }}>…</Heading>
```

Inside a `TextContainer`, a side that isn't set gets the container's rhythm. Add `bottom: 'none'` or `top: 'none'` there if the old 0 matters.

## Rename: layout beta `gap`

Applies to `gap`, `rowGap` and `columnGap` on `Flex` and `Grid`. Every size kept its value but got a new name:

| Old | `2xs` | `xs` | `s` | `s-m` | `m`  | `m-l` | `l`   | `xl`  | `2xl` | …   | `11xl` |
| --- | ----- | ---- | --- | ----- | ---- | ----- | ----- | ----- | ----- | --- | ------ |
| New | `2xs` | `xs` | `s` | `m`   | `lg` | `xl`  | `2xl` | `3xl` | `4xl` | …   | `13xl` |

From `m` upwards the old names now mean a smaller size, and they still type-check. Rename in one pass, highest first. In responsive objects, rename only the values. The breakpoint keys (`base`, `s`, `m`, `lg`, `xl`) are unchanged.

```tsx
// Before
<Flex gap="m" rowGap={{ base: 's-m', lg: 'l' }}>…</Flex>

// After
<Flex gap="lg" rowGap={{ base: 'm', lg: '2xl' }}>…</Flex>
```

## Rename: CSS variables

The layout spacing variables moved to `@entur/tokens` (`@entur/tokens/styles/spacing`) and got a `spacing-` prefix. Use the layout table: `--m` → `var(--spacing-lg)`, `--s-m` → `var(--spacing-m)`, `--l` → `var(--spacing-2xl)`.

The typography variables (`--font-size-*`, `--font-line-height-*` …) keep their names. They now come from `@entur/tokens/styles/typography`, which `@entur/typography` loads. Replace imports of `@entur/typography/src/beta/typographyTokens.scss` with that.

## No default spacing

Before, every text component had margins. Now none have, unless they are in a `TextContainer` or have `spacing`. About two thirds of typography sits alone in UI, where the old margins were removed with `spacing="none"` anyway.

For each text component, decide which case it is:

1. **Running text.** Several headings, paragraphs and lists in a row: articles, help pages, terms, empty states with a heading and some text. Rich-text renderers (Portable Text, HTML parsers, Markdown) count too, even though each block is its own component. Wrap the group in `<TextContainer>` and remove `spacing` props that only recreated the rhythm. `TextContainer` is a grid that spaces its **direct** children, images and divs included, so wrap the element whose children are the text blocks, not a component that adds its own wrapper. Keep `spacing` where the design differs from the rhythm. `TextContainer` adds more space above headings than between paragraphs.

   ```tsx
   <TextContainer>
     <Heading as="h2" variant="title-2">
       Personvern
     </Heading>
     <Text variant="paragraph">…</Text>
     <UnorderedList>…</UnorderedList>
     <Text variant="paragraph">…</Text>
   </TextContainer>
   ```

2. **Text alone in UI.** In a card, modal, button, table cell or form. Remove `spacing="none"`, since it's the default now. Nothing else to do.

3. **Pairs and small stacks in UI.** A title and a description, a label and a value. If the space came from the old margins, put them in a `Flex` and set the gap there. Use `spacing` on one of them only if a layout component doesn't fit.

   ```tsx
   <Flex direction="column" gap="xs">
     <Heading as="h3" variant="section-1">
       Billett
     </Heading>
     <Text variant="subparagraph">Gyldig til 23:59</Text>
   </Flex>
   ```

4. **Can't tell.** For example, a component that gets its content from props. Leave it and list it in the report.

Keep `spacing="none"` inside a `TextContainer`, where it overrides the rhythm.

### Old default margins

To recreate a space exactly, use these values (standard view mode). Headings only had the top margin when they weren't the first child.

| Variant                   | Old margin         | `spacing` today              |
| ------------------------- | ------------------ | ---------------------------- |
| `title-1`                 | 24 above, 24 below | `xl`                         |
| `title-2`                 | 20 / 20            | `lg`                         |
| `subtitle-1`              | 16 / 16            | `m`                          |
| `subtitle-2`, `section-1` | 12 / 12            | `s`                          |
| `section-2`               | 8 / 8              | `xs`                         |
| `leading`                 | 32 below           | `{ bottom: '3xl' }`          |
| `quote`                   | 28 below           | `{ bottom: '2xl' }`          |
| `paragraph`               | 24 below           | `{ bottom: 'xl' }`           |
| `subparagraph`            | 20 below           | `{ bottom: 'lg' }`           |
| `caption`                 | 16 below           | `{ bottom: 'm' }`            |
| `label`, `sublabel`       | 8 below            | `{ bottom: 'xs' }`           |
| `overline`                | 8 above, 16 below  | `{ top: 'xs', bottom: 'm' }` |
| `preformatted-text`       | 44 below           | `{ bottom: '5xl' }` (40)     |

Text directly before a heading had 16px more below it.
