# Grid (beta)

CSS Grid container with responsive props. Defaults to a 12-column grid. Pair with `GridItem` to control column and row placement.

## Components

- **`Grid`** — grid container (defaults to `repeat(12, 1fr)`)
- **`GridItem`** — grid child with placement props (`colSpan`, `rowSpan`, `colStart`, `colEnd`, `rowStart`, `rowEnd`)

## Usage

```tsx
import { Grid, GridItem } from '@entur/layout/beta';

// Full-width on mobile, half-width on m, third on lg
<Grid gap="m">
  <GridItem colSpan={{ base: 12, m: 6, lg: 4 }}>
    Content
  </GridItem>
</Grid>

// Custom column template
<Grid templateColumns={{ base: 'repeat(4, 1fr)', lg: 'repeat(12, 1fr)' }} gap="m">
  <GridItem colSpan={{ base: 4, lg: 6 }}>...</GridItem>
</Grid>
```

## Responsive props

All props accept `ResponsiveValue<T>`:

```tsx
// Flat — same at every breakpoint
<Grid gap="l" />

// Responsive — base is required, all others optional and inherit from previous
<GridItem colSpan={{ base: 12, m: 6 }} />
```

Breakpoints: `base` (0px+) → `s` (600px+) → `m` (800px+) → `lg` (1200px+) → `xl` (1400px+).

## GridItem placement props

| Prop       | CSS property        | Notes                                                  |
| ---------- | ------------------- | ------------------------------------------------------ |
| `colSpan`  | `grid-column`       | Number → `span N`. String used as-is (e.g. `"1 / -1"`) |
| `rowSpan`  | `grid-row`          | Number → `span N`. String used as-is                   |
| `colStart` | `grid-column-start` | Number = line number. String used as-is                |
| `colEnd`   | `grid-column-end`   | Number = line number. String used as-is (e.g. `"-1"`)  |
| `rowStart` | `grid-row-start`    | Number = line number                                   |
| `rowEnd`   | `grid-row-end`      | Number = line number                                   |

`colSpan`/`rowSpan` set the `grid-column`/`grid-row` shorthand, which the browser expands into start/end. If you set both `colSpan` and `colStart`/`colEnd`, the SCSS places the shorthand first so the individual start/end props override it.

## Architecture

### Why CSS custom properties instead of CSS-in-JS or style injection

Same rationale as `Flex` — see that README for the full explanation. In short: CSS-in-JS and runtime style injection require the browser at render time, which breaks SSR. By writing responsive values as inline CSS custom properties and reading them in a static SCSS stylesheet, the components work identically in SSR and client rendering with no style injection, no hydration mismatch, and no runtime CSS generation.

### CSS custom property cascade

Same pattern as `Flex`. Each prop maps to five CSS custom properties (`-base`, `-s`, `-m`, `-lg`, `-xl`), all initialized to `initial`. The SCSS media queries use nested `var()` fallbacks:

```scss
@media (min-width: 800px) {
  grid-template-columns: var(
    --grid-template-columns-m,
    var(
      --grid-template-columns-s,
      var(--grid-template-columns-base, repeat(12, 1fr))
    )
  );
}
```

Only explicitly-set breakpoints are written by React. Unset breakpoints automatically inherit from the previous one without JS.

### Zero-specificity styles via `:where()`

All layout rules live inside `:where(&)`, giving them zero specificity. Any consumer class overrides `Grid`/`GridItem` styles without `!important`.

### Polymorphic `as` prop

Both `Grid` and `GridItem` default to `<div>` but accept any element or component:

```tsx
<Grid as="main" gap="m">
  <GridItem as="article" colSpan={8}>
    ...
  </GridItem>
  <GridItem as="aside" colSpan={4}>
    ...
  </GridItem>
</Grid>
```

TypeScript enforces that HTML attributes match the element passed to `as`.

## Limitations

- **No `initial` as a prop value.** `initial` is used internally as the CSS custom property "not set" sentinel. Passing `"initial"` as a string prop will behave as if the prop was not set.
- **`colSpan`/`rowSpan` conflict with `colStart`/`colEnd`/`rowStart`/`rowEnd`.** The shorthand (`grid-column`) and individual properties (`grid-column-start`, `grid-column-end`) are written separately. Setting both `colSpan` and `colStart` on the same `GridItem` at the same breakpoint may produce unexpected results — prefer one approach per item.
- **Subgrid requires explicit opt-in, and responsive spanning needs inline style.** Pass `templateColumns="subgrid"` on a nested `Grid` to align it to the parent's tracks (Chrome 117+, Firefox 71+, Safari 16+). However, the subgrid element must be a direct child of the parent grid — wrapping it in a `GridItem` breaks track inheritance. To control how many columns the subgrid spans, use an inline style: `<Grid templateColumns="subgrid" style={{ gridColumn: 'span 6' }}>`. There is no way to use the responsive `colSpan` prop in this case.
- **CSS variable inheritance between nested grids.** Grid/GridItem CSS variables are scoped per element. A `GridItem` inside a `Grid` that is itself inside another `Grid` does not inherit the outer grid's variables — each element resets all variables to `initial`.
