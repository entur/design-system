# Styles

This package contains global application-level styles for the Entur Design System. These styles are intended for use in applications, not by other packages (to avoid cyclic dependencies).

**Note:** For utility styles used by packages (breakpoints, color-utils, layers), see `@entur/utils`.

## Linje Normalize (Opt-in global defaults)

For consumers who want automatic global defaults (font-family, color, background-color, etc.), you can optionally import the normalize stylesheet:

**SCSS:**

```scss
// In your main stylesheet
// Note: Layers and tokens must be imported first if using normalize standalone
@use '@entur/utils/dist/layers.scss' as *;
@use '@entur/tokens/dist/base.scss' as *;
@use '@entur/styles/dist/scss/normalize.scss';
// or
@import '@entur/styles/dist/scss/normalize.scss';
```

**CSS:**

```css
/* In your main stylesheet */
@import '@entur/styles/dist/css/normalize.css';
```

**JavaScript/TypeScript:**

```ts
import '@entur/styles/dist/scss/normalize.scss'; // or dist/css/normalize.css
```

This will automatically:

- Import `modern-normalize` (comprehensive browser reset)
- Set global `font-family` (Nationale) with fallbacks
- Set global `color` and `background-color` based on design tokens
- Set global `font-size`, `line-height`, and `font-weight` defaults
- Provide contrast mode overrides

**Note:** This is optional. If you prefer to set your own defaults, simply don't import this file. All styles are wrapped in CSS layers (`@layer core.reset` and `@layer core.base`) so they can be overridden in `@layer app` if needed.

## Linje Setup (Complete setup)

For consumers who want to import everything at once, use the index stylesheet. This is the recommended way to get started:

**SCSS:**

```scss
// In your main stylesheet
@use '@entur/styles';
// or with full path
@use '@entur/styles/dist/scss/index.scss';
// or using @import (legacy)
@import '@entur/styles/dist/scss/index.scss';
```

**CSS:**

```css
/* In your main stylesheet */
@import '@entur/styles';
/* or with full path */
@import '@entur/styles/dist/css/index.css';
```

**JavaScript/TypeScript:**

```ts
import '@entur/styles'; // or '@entur/styles/dist/scss/index.scss' or '@entur/styles/dist/css/index.css'
```

This will automatically load (in order):

1. **CSS layers definition** - Sets up the layer structure for proper cascade (from `@entur/utils`)
2. **Design tokens** - CSS variables for colors, spacing, typography, etc.
3. **Normalize** - Browser reset (`modern-normalize`) + global defaults
4. **Fonts** - Nationale font-face declarations (shared by stable and beta typography)
5. **Component styles** - All stable component stylesheets (a11y, grid, icons, typography, buttons, forms, etc.)

**Important notes:**

- This only includes **stable component styles**. Beta component styles (e.g., `@entur/typography/beta`) are loaded dynamically by their respective components to allow selective opt-in usage.
- If you need to customize which components to include or the order they're loaded, import components individually instead.
- Fonts are included globally, so beta typography components will work without additional font imports.

## Installation

```sh
npm install @entur/styles
# or if you are using Yarn:
yarn add @entur/styles
```
