# Entur design tokens

This package contains all design tokens used throughout the design system. You'l find all of them in the `src/tokens.ts` file.

## Installation

```sh
npm install @entur/tokens
# or if you are using Yarn:
yarn add @entur/tokens
```

## Usage

This package has several main exports:

- a CSS file with all tokens as kebab-cased CSS properties
- a SCSS file with all tokens as kebab-cased SCSS variables
- a LESS file with all tokens as kebab-cased LESS variables
- a JavaScript file with all tokens as nested objects.

### CSS

To use the CSS file, import it into your bundle like so:

```js
import '@entur/tokens/dist/styles.css';
```

You'll then have access to all design tokens as CSS variables. You can then use them like so:

```css
.custom-box {
  background-color: var(--colors-greys-grey10);
  color: var(--colors-brand-coral);
  font-size: var(--font-sizes-medium);
  margin: var(--space-medium) var(--space-large);
}
```

Please refer to the design system documentation for which ones are available.

### LESS / SCSS

To use the LESS or SCSS files, import it into your LESS or SCSS file. The method is the same:

```less
@import '~@entur/tokens/dist/styles.less';
```

```scss
@import '~@entur/tokens/dist/styles.scss';
```

You'll then be able to use the variables in your code as usual.

```less
// LESS
.custom-box {
  background-color: @colors-greys-grey10;
  color: @colors-brand-coral;
  font-size: @font-sizes-medium;
  margin: @space-medium @space-large;
}
```

```scss
// SCSS
.custom-box {
  background-color: $colors-greys-grey10;
  color: $colors-brand-coral;
  font-size: $font-sizes-medium;
  margin: $space-medium $space-large;
}
```

### JavaScript

To use the design tokens in JavaScript, import the ones you need like so:

```js
import { StyleSheet } from 'react-native';
import { colors, breakpoints, fontSizes } from '@entur/tokens';

StyleSheet.create({
  example: {
    fontSize: fontSizes.medium,
    color: colors.brand.coral,
  },
});
```
