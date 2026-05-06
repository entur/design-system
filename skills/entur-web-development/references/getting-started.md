# Getting Started with Entur Linje

Full docs: https://linje.entur.no/kom-i-gang/for-utviklere/komponentbibliotek

## Install packages

Packages are installed individually from npm. Use only what you need:

```bash
yarn add @entur/button @entur/tokens
# or
npm install @entur/button @entur/tokens
```

## Import CSS (required)

Components need their CSS to render correctly. Import globally in `App.tsx`, `index.js`, or a global stylesheet. **The order is critical** — token CSS must come first, then component CSS in the exact order below. Wrong order causes style conflicts and visual regressions.

### CSS (in `.css` or `.tsx` files)

```css
/* 1. Base tokens — always first */
@import '@entur/tokens/dist/base.css';

/* 2. Component styles — in this exact order */
@import '@entur/a11y/dist/styles.css';
@import '@entur/grid/dist/styles.css';
@import '@entur/icons/dist/styles.css';
@import '@entur/tab/dist/styles.css';
@import '@entur/typography/dist/styles.css';
@import '@entur/layout/dist/styles.css';
@import '@entur/loader/dist/styles.css';
@import '@entur/expand/dist/styles.css';
@import '@entur/button/dist/styles.css';
@import '@entur/alert/dist/styles.css';
@import '@entur/menu/dist/styles.css';
@import '@entur/fileupload/dist/styles.css';
@import '@entur/modal/dist/styles.css';
@import '@entur/tooltip/dist/styles.css';
@import '@entur/form/dist/styles.css';
@import '@entur/chip/dist/styles.css';
@import '@entur/datepicker/dist/styles.css';
@import '@entur/travel/dist/styles.css';
@import '@entur/table/dist/styles.css';
@import '@entur/dropdown/dist/styles.css';
```

Other token files (`semantic.css`, `data.css`, `transport.css`) should be imported on demand in the files that use them — not globally.

### SCSS (in `.scss` files)

In SCSS, use `@use` with a namespace alias instead of `@import` (Sass `@import` is deprecated):

```scss
/* 1. Base tokens — always first */
@use '@entur/tokens/dist/base.scss' as eds;

/* 2. Component styles — in this exact order, each with a namespace */
@use '@entur/a11y/dist/styles.css' as a11y;
@use '@entur/grid/dist/styles.css' as grid;
@use '@entur/icons/dist/styles.css' as icons;
@use '@entur/tab/dist/styles.css' as tab;
@use '@entur/typography/dist/styles.css' as typography;
@use '@entur/layout/dist/styles.css' as layout;
@use '@entur/loader/dist/styles.css' as loader;
@use '@entur/expand/dist/styles.css' as expand;
@use '@entur/button/dist/styles.css' as button;
@use '@entur/alert/dist/styles.css' as alert;
@use '@entur/menu/dist/styles.css' as menu;
@use '@entur/fileupload/dist/styles.css' as fileupload;
@use '@entur/modal/dist/styles.css' as modal;
@use '@entur/tooltip/dist/styles.css' as tooltip;
@use '@entur/form/dist/styles.css' as form;
@use '@entur/chip/dist/styles.css' as chip;
@use '@entur/datepicker/dist/styles.css' as datepicker;
@use '@entur/travel/dist/styles.css' as travel;
@use '@entur/table/dist/styles.css' as table;
@use '@entur/dropdown/dist/styles.css' as dropdown;
```

Import only the component styles you actually use — but keep the order.

## Import components

All packages use named exports only — never default exports:

```tsx
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { TextField, Checkbox } from '@entur/form';
import { Heading1, Paragraph } from '@entur/typography';
```

## TypeScript types

All packages ship with TypeScript types. Props types follow the pattern `ComponentNameProps`:

```tsx
import { TextField } from '@entur/form';
import type { TextFieldProps } from '@entur/form';
```

## Use tokens for styling

Avoid hardcoded colors and spacing. Use `@entur/tokens` instead:

```tsx
import { colors, space } from '@entur/tokens';
// or CSS variables: var(--fill-primary-default-light)
```

See `tokens-and-variables.md` for the full token reference.

## Polymorphic components

Many components accept an `as` prop for element composition:

```tsx
import { PrimaryButton } from '@entur/button';
<PrimaryButton as="a" href="/booking">
  Book now
</PrimaryButton>;
```

## Dark/light mode

Apply `data-color-mode="dark"` or `data-color-mode="light"` to a parent element. Token CSS variables respond automatically.

```html
<div data-color-mode="dark">
  <!-- tokens adapt to dark values here -->
</div>
```

## Accessibility note

`@entur/a11y` provides `SkipToContent` and `VisuallyHidden`. Always add `SkipToContent` at the top of pages and ensure `id="main-content"` exists on the main element. See `entur-accessibility` skill.

## Troubleshooting

### Styles look wrong after upgrading

If components look broken or misaligned after a version upgrade, check for **duplicate `@entur/*` packages**. Two versions of the same package in the dependency tree causes CSS and JS incompatibilities:

```bash
# Check for duplicates
yarn list --pattern "@entur" | grep -E "@entur/[a-z]+"
# or
npm ls @entur/tokens
```

If you see the same package at multiple versions, deduplicate to the latest:

```bash
yarn dedupe @entur/tokens
# dedupe all @entur packages
yarn dedupe --pattern "@entur"
# or with npm
npm dedupe
```

Then rebuild and verify styles load in the correct order.

### Missing styles / unstyled components

Ensure CSS is imported globally (not inside a component file) and in the correct order. See "Import CSS" section above. A missing CSS import for one package can break dependent packages lower in the order.

### CSS import order matters

The order listed above is not arbitrary — some component styles build on base styles from earlier packages (e.g. `@entur/form` depends on `@entur/icons` and `@entur/typography`). Importing in the wrong order causes visual regressions.

### Components look slightly different from the design

If a component's borders, spacing, or colors do not match a design mockup, do **not** add CSS overrides. The discrepancy is usually one of:

1. CSS imports are in the wrong order — fix the order (see above)
2. The design uses a different component variant — use the correct variant
3. The design has diverged from the design system — flag this in `#talk-designsystem`

Adding custom borders, shadows, text-decoration, or color overrides to `@entur/*` components causes maintenance issues and breaks dark mode. Use a wrapper element for layout adjustments; use tokens for custom (non-DS) elements.

## Questions?

Slack: #talk-designsystem
