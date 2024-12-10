# Icons

This package contains the icon components.

> 💡 Looking for the [documentation](https://design.entur.no/komponenter/ressurser/icons)?

## Installation

```sh
npm install @entur/icons
# or if you are using Yarn:
yarn add @entur/icons
```

## Usage

```js
import { AddIcon } from '@entur/icons'; // Import specific icon

<AddIcon />;
```

Please refer to the [documentation](https://design.entur.no/komponenter/ressurser/icons) for usage information.

## Development

This package contains all SVG files, as well as a script to create optimized React components from those SVG files.

If you're adding an icon, please add the SVG file to the appropriate `svg/` folder. Make sure you give it a unique name, and make sure it looks correct in a browser after exporting it.

If you're changing an existing icon, just update the existing SVG file with the new source code.

Unlike most other packages in our design system, this one doesn't use DTS-CLI or TypeScript. This is because DTS-CLI doesn't support the tools we need to optimize our SVG files. Instead, we've opted for configuring Rollup directly.
