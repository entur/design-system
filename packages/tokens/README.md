# Entur Linje design tokens

This package contains all design tokens and design variables used throughout the design system. We are currently in a process to migrate over to a new design variable system based on [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma).

Since not all values are available as a variable yet and to avoid breaking changes, all previous design tokens will be kept around for a while. These are built from the `src/legacy-tokens.ts` file.

> 💡 Looking for the [documentation](https://linje.entur.no/tokens)?

## Installation

```sh
npm install @entur/tokens
# or if you are using Yarn:
yarn add @entur/tokens
```

## Usage

Please refer to the [documentation](https://linje.entur.no/tokens) for in-depth usage information.

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
@import '@entur/tokens/dist/styles.less';
```

```scss
@import '@entur/tokens/dist/styles.scss';
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

#### px vs rem

These values are mainly provided in pixels. If you need the values in rem instead, add a `.rem` after the token name, e.g. `space.rem.large` for rem value and `space.large` for pixel value.

## [For maintainers] Updating design variables

There are three steps needed to update the set of available designs variables in this repo:

1. generate a JSON-export of the variable set from Figma
2. Update the corresponding JSON-file in the `src` folder
3. Build the new variables and commit the changes

### 1. Generate a JSON export

The JSON is exported from Figma using the [variabels2css-plugin](https://www.figma.com/community/plugin/1261234393153346915), download the plugin if you haven't already. Go to the Figma file containing the variables you want to export, eg. [Semantic Colors](https://www.figma.com/file/zFFjH3gKGON6vFJZQK5ltr/Tokens-Semantic-colors?type=design&mode=design&t=M9cT0w0kaaxyBHiq-1). In you menu bar, select 'Plugins' and choose 'variables2css' – this opens a modal. Under 'choose your collection' choose the variable set you want to export. Under 'type' choose 'JSON', and under 'color' and 'unit' choose 'hex' and 'rem'. Then click 'Generate' and copy the result.

### 2. Update JSON file

Back in this repo, find the JSON-variables file you want to update, eg. `semantic.json`, delete its content and paste the generated result you copied in step 1. Then save the file.

### 3. Build variables

When the JSON-file content is updated, run the script `yarn build` inside this package or `yarn build:packages` from root. This will generate new files with updated values in both this package and in all other packages where the component color value has been updated. Once the build is finished, commit all changes and push the commit.
