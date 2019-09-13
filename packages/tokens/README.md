# Entur design tokens

This package contains all design tokens used throughout the design system. You'l find all of them in the `src/tokens.ts` file.

## Installation

```sh
npm install @entur/tokens
# or if you are using Yarn:
yarn add @entur/tokens
```

## Usage

This package has two main exports - a CSS file and a JavaScript file. The CSS file will specify all tokens as kebab-cased CSS properties, and the JS file contains all variables in nested objects.

### CSS

To use the CSS file, import it into your bundle like so:

```js
import '@entur/tokens/dist/tokens.css';
```

You'll then have access to all design tokens as CSS variables. You can then use them like so:

````css
.custom-box {
  background-color: var(--colors-greys-grey10);
  color: var(--colors-brand-coral);
  font-size: var(--font-sizes-medium);
  margin: var(--space.medium) var(--space.large);
}
```

Please refer to the design system documentation for which ones are available.

### JS

To use the design tokens in JavaScript, import the ones you need like so:

```js
import { colors, breakpoints, fontSizes } from '@entur/tokens';

StyleSheet.create({
  example: {
    fontSize: fontSizes.medium,
    color: colors.brand.coral,
  }
})
````
