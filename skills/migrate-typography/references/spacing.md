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

1. **Running text.** Several headings, paragraphs and lists in a row: articles, help pages, terms, empty states with a heading and some text. Rich-text renderers (Portable Text, HTML parsers, Markdown) count too, even though each block is its own component. Wrap the group in `<TextContainer>` and remove `spacing` props that only recreated the rhythm. `TextContainer` spaces its **direct** children, so wrap the element whose children are the text blocks, not a component that adds its own wrapper. Raw `h1`–`h6`, `p`, lists, `blockquote` and `pre` from a parser get the same rhythm, and inline elements, floats and loose text behave as normal text. Keep `spacing` where the design differs from the rhythm. `TextContainer` adds more space above headings than between paragraphs.

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

3. **Pairs and small stacks in UI.** A title and a description, a label and a value. If the space came from the old margins, put them in a `Flex` and set the gap there. Use `spacing` on one of them only if a layout component doesn't fit. Menus and link lists count too: a link whose text was a heading got the space between links from the heading's margins. Give the list a gap, and use `Text` for link text that isn't a heading.

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

### Inside `TextContainer`

- **Project margins win.** The rhythm lives in a CSS layer, so a margin your own CSS sets on a child (a card, a code example, a button) replaces it, and can collapse with the next gap. Remove those margins and let the rhythm space the blocks.
- **Empty blocks from a CMS.** An empty line in a rich-text editor gives an empty paragraph, which used to collapse into the margins but now adds a full gap. Skip blocks without text in the renderer.
- **Headings must be direct children.** A heading inside a wrapper is spaced like any other block, without the extra space above it. To link to a section, put the link inside the heading (`<Heading id="x"><a href="#x">…</a></Heading>`) instead of wrapping the heading and a link together. To group a heading with an overline or subtitle, use `hgroup`, which is spaced as one heading.
- **Nested blocks need their own container.** A card, callout or panel with several text blocks needs its own `TextContainer`, since the outer one only reaches its direct children. The same goes for wrappers a parser keeps (`div`, `section`) and for a rich-text renderer reused somewhere else: put the `TextContainer` in the renderer, so every caller gets it. If a caller adds blocks after the rendered content, such as cards, related links or a footer, let the renderer leave out its container there and put both in one `TextContainer`, or the added blocks get no spacing. Where a layout keeps blocks apart, such as a page grid with one item per block, its gap replaces the rhythm between them. Set it to the space the rhythm puts above the headings that start the blocks, and check in the browser that the page reads as one flow. Don't wrap a single block, though: a card that fills its grid cell with `height: 100%` stops stretching inside an extra wrapper.
- **Media with a caption** goes in `figure` + `figcaption`, so the caption sits close to the image or video. Outside a `TextContainer`, reset the browser's `figure` margin.
- **Prefer the rhythm to the old margins.** Recreating every old margin with `spacing` gives many one-off values. Use the table below only where the design needs a specific space.

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
