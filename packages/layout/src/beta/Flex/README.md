# Flex (beta)

Flexbox container component with responsive props. All layout props accept either a flat value (same across all breakpoints) or a `{ base, s?, m?, lg?, xl? }` responsive object.

## Components

- **`Flex`** — flex container
- **`FlexSpacer`** — `flex: 1 1 0%` spacer element for pushing siblings apart

## Usage

```tsx
import { Flex, FlexSpacer } from '@entur/layout/beta';

// Stack vertically on mobile, row on large screens
<Flex direction={{ base: 'column', lg: 'row' }} gap="m">
  <div>Item 1</div>
  <FlexSpacer />
  <div>Item 2</div>
</Flex>;
```

## Responsive props

All props on `Flex` accept `ResponsiveValue<T>`:

```tsx
// Flat — same at every breakpoint
<Flex gap="m" />

// Responsive — base is required, all others optional and inherit from previous
<Flex direction={{ base: 'column', m: 'row' }} />
```

Breakpoints: `base` (0px+) → `s` (600px+) → `m` (800px+) → `lg` (1200px+) → `xl` (1400px+).

## Gap values

`gap`, `rowGap`, and `columnGap` accept spacing tokens from `@entur/tokens`:
`'2xs' | 'xs' | 's' | 's-m' | 'm' | 'm-l' | 'l' | 'xl' | '2xl' ... '11xl' | 'none'`

`gap` sets both row and column gap. `rowGap`/`columnGap` override it per axis. This fallback is resolved in JS — setting `gap` is equivalent to setting both `rowGap` and `columnGap` to the same value.

## Architecture

### Why CSS custom properties instead of CSS-in-JS or style injection

Responsive props need to produce different CSS at different viewport widths. The two common approaches — CSS-in-JS (Emotion, styled-components) and runtime style injection — both require the browser to be running when styles are generated, which breaks server-side rendering or requires complex hydration workarounds.

This implementation avoids both: React writes inline CSS custom properties (`style={{ '--flex-direction-base': 'column', '--flex-direction-m': 'row' }}`), and the SCSS ships as a static stylesheet that reads those variables at each breakpoint. No JS runs at render time to produce CSS, no `<style>` tags are injected, and the component works identically in SSR and client rendering.

### CSS custom property cascade

Responsive props work without any JS media query detection. Each prop maps to five CSS custom properties (`--flex-direction-base`, `-s`, `-m`, `-lg`, `-xl`), all initialized to `initial` (the "not set" sentinel for custom properties).

React writes only the breakpoints that were explicitly passed. The SCSS then reads each breakpoint variable and falls back to the previous one:

```scss
@media (min-width: 800px) {
  flex-direction: var(
    --flex-direction-m,
    var(--flex-direction-s, var(--flex-direction-base, row))
  );
}
```

So if only `base` is set, all larger breakpoints inherit it automatically. If `m` is also set, `lg` and `xl` inherit from `m`. No JS resize listener needed.

### Zero-specificity styles via `:where()`

All layout rules live inside `:where(&)`, which has zero specificity. Any consumer class will override Flex styles without needing `!important`.

### Polymorphic `as` prop

`Flex` defaults to `<div>` but accepts any HTML element or React component via `as`:

```tsx
<Flex as="section" direction="column">...</Flex>
<Flex as={MyCard} gap="s">...</Flex>
```

TypeScript enforces that HTML attribute props match the element passed to `as`.

## Limitations

- **No `initial` or CSS-keyword values as prop values.** The `initial` keyword is used internally as the "not set" sentinel. Setting a prop to the string `"initial"` will behave as if the prop was not set.
- **`rowGap`/`columnGap` do not fall back to `gap` in CSS.** That fallback is handled in JS (by passing `rowGap ?? gap`). External CSS that sets `--flex-gap-base` directly must also set `--flex-row-gap-base` and `--flex-column-gap-base` explicitly.
- **Nested `Flex` components do not inherit responsive vars from a parent `Flex`.** Variables are scoped per element; each `Flex` instance resets all variables to `initial`.
