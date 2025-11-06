# Utils

This package contains the different utils shared across the Entur Linje packages.

> ## Think twice before adding stuff here
>
> We don't want this to be a dumping ground for code that's no longer used. To combat that, please avoid adding stuff here unless it's used by at least three consumers. Duplicating code ain't no crime!

This package will probably change with lots of breaking changes as we move along. It's meant for internal consumption only, so please excuse our mess. It will only be documented via its code.

## Style Utilities

This package includes utility stylesheets that are used by other packages (to avoid cyclic dependencies):

### Breakpoints

Media query mixins for responsive design:

```scss
@use '@entur/utils/dist/breakpoints.scss' as *;

.my-component {
  @include for-desktop {
    // Desktop styles
  }

  @include for-large-desktop {
    // Large desktop styles
  }
}
```

### Color Utilities

SCSS functions for color manipulation:

```scss
@use '@entur/utils/dist/color-utils.scss' as *;

.my-component {
  color: tint(#ff0000, 20%);
  background-color: shade(#ff0000, 20%);
}
```

### CSS Layers

Layer definitions for organizing CSS cascade:

```scss
@use '@entur/utils/dist/layers.scss' as *;
```

This sets up the following layer structure:

- `core` - Foundation styles (reset, tokens, base)
- `third-party` - Vendor CSS
- `components` - Component styles (primitives, composites, overrides)
- `utilities` - Utility classes
- `app` - Application-specific styles

## Installation

```sh
npm install @entur/utils
# or if you are using Yarn:
yarn add @entur/utils
```
