# Utils

This package contains the different utils shared across the Entur Linje packages.

> ## Think twice before adding stuff here
>
> We don't want this to be a dumping ground for code that's no longer used. To combat that, please avoid adding stuff here unless it's used by at least three consumers. Duplicating code ain't no crime!

This package will probably change with lots of breaking changes as we move along. It's meant for internal consumption only, so please excuse our mess. It will only be documented via its code.

## Linje Normalize (Opt-in global defaults)

For consumers who want automatic global defaults (font-family, color, background-color, etc.), you can optionally import the normalize stylesheet:

**SCSS:**

```scss
// In your main stylesheet
@use '@entur/utils/dist/normalize.scss';
// or
@import '@entur/utils/dist/normalize.scss';
```

**CSS:**

```css
/* In your main stylesheet */
@import '@entur/utils/dist/normalize.css';
```

**JavaScript/TypeScript:**

```ts
import '@entur/utils/dist/normalize.scss'; // or .css
```

This will automatically set:

- Global `box-sizing: border-box`
- Global `font-family` (Nationale)
- Global `color` and `background-color` based on design tokens
- Global `font-size`, `line-height`, and `font-weight` defaults

**Note:** This is optional. If you prefer to set your own defaults, simply don't import this file. All styles are wrapped in `@layer core.base` so they can be overridden in `@layer app` if needed.

## Linje Setup (Complete setup)

For consumers who want to import everything at once (normalize + all component styles), use the setup stylesheet:

**SCSS:**

```scss
// In your main stylesheet
@use '@entur/utils/dist/setup-linje.scss';
// or
@import '@entur/utils/dist/setup-linje.scss';
```

**CSS:**

```css
/* In your main stylesheet */
@import '@entur/utils/dist/setup-linje.css';
```

**JavaScript/TypeScript:**

```ts
import '@entur/utils/dist/setup-linje.scss'; // or .css
```

This will automatically:

1. Import normalize (global defaults)
2. Import all component stylesheets (a11y, grid, icons, typography, buttons, forms, etc.)

**Note:** This is the easiest way to get started, but gives you less control. If you need to customize which components to include or the order they're loaded, import components individually instead.

## Installation

```sh
npm install @entur/utils
# or if you are using Yarn:
yarn add @entur/utils
```
