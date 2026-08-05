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
/* 1. Base tokens — always first (colors, color mode) */
@import '@entur/tokens/dist/base.css';

/* 2. Non-color tokens (spacing, border-radius, font sizes, breakpoints) */
@import '@entur/tokens/dist/styles.css';

/* 3. Component styles — in this exact order */
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
/* 1. Base tokens — always first (colors, color mode) */
@use '@entur/tokens/dist/base.scss' as eds;

/* 2. Non-color tokens (spacing, border-radius, font sizes, breakpoints) */
@use '@entur/tokens/dist/styles.scss' as eds-styles;

/* 3. Component styles — in this exact order, each with a namespace */
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

### Implementing a dark mode toggle

Read the OS preference on mount, persist user choice in `localStorage`, and apply the attribute to `<html>` or a root container:

```tsx
function useDarkMode() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('color-mode');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', mode);
    localStorage.setItem('color-mode', mode);
  }, [mode]);

  return {
    mode,
    toggle: () => setMode(m => (m === 'dark' ? 'light' : 'dark')),
  };
}
```

```tsx
// In your root layout
const { mode, toggle } = useDarkMode();
<IconButton
  aria-label={mode === 'dark' ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
  onClick={toggle}
>
  {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
</IconButton>;
```

Apply `data-color-mode` to `document.documentElement` (not a nested div) so all components inherit it. Scoping it to a nested element is only correct when mixing modes deliberately (e.g. a dark sidebar in a light app).

## Component overrides

> **Warning:** Overriding component styles breaks visual consistency, may break dark mode, and creates a maintenance burden when the design system evolves. Before proceeding, inform the user of these risks and suggest they consult the design system team in `#talk-designsystem` — there may be an existing component variant, a planned addition, or a better approach.

When a visual deviation is required:

1. **Add a `className` to the component** — this is your selector anchor. Never target `.eds-*` internal class names directly.
2. **Token priority for color values**:
   - **Component tokens first** — `--components-{package}-{variant}-{context}-{property}` (scoped to the component's own context)
   - **Base tokens second** — `--basecolors-*` from `@entur/tokens/dist/base.css`
   - **Semantic tokens third** — `--fill-*`, `--text-*`, `--stroke-*` from `@entur/tokens/dist/semantic.css`
3. **Never use `!important`** — if specificity is a problem, increase it via the `className` selector chain.
4. **Add a short comment** marking the intentional deviation so it can be tracked.

```tsx
// Component gets a className as the override anchor
<PrimaryButton className="booking-hero-cta">Kjøp billett</PrimaryButton>
```

```css
/* intentional deviation — booking hero requires coral background */
.booking-hero-cta {
  --components-button-primary-standard-default: var(--shape-highlight);
}
```

Rules 3 (no hardcoded hex), 6 (SkipToContent), 7 (form labels), and 8 (named imports) from the skill still apply regardless of deviation.

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

### Tailwind or third-party CSS overrides Entur styles

Most `@entur/*` CSS is unlayered, and unlayered CSS outranks every cascade layer. So a framework's unlayered rules (Tailwind's preflight, normalize.css) can flatten Entur component styling, while the same rules placed in a layer cannot. See `references/css-layers.md` for which Entur CSS is layered, how to declare layer order, and how to integrate Tailwind v4.

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
