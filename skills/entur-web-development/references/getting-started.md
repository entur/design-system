# Getting Started with Entur Linje

Full docs: https://linje.entur.no/kom-i-gang/for-utviklere/komponentbibliotek

## Install packages

Packages are installed individually from npm. Use only what you need:

```bash
yarn add @entur/button @entur/tokens @entur/styles
# or
npm install @entur/button @entur/tokens @entur/styles
```

## Import CSS (required)

Components need their CSS to render correctly. Import globally in `App.tsx`, `index.js`, or a global `.scss` file.

Recommended import order (avoids style conflicts):

```css
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

## Questions?

Slack: #talk-designsystem
