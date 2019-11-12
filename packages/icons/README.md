# Icons

This package contains the tooltip component.

> 💡 Looking for the [documentation](https://design.entur.org/komponenter/ikoner)?

## Installation

```sh
npm install @entur/icons
# or if you are using Yarn:
yarn add @entur/icons
```

## Usage

```js
import { AddIcon } from "@entur/icons; //Import specific icon

<AddIcon/>
```

Please refer to the [documentation](https://design.entur.org/komponenter/ikoner) for usage information.

## Development

This package contains all SVG files, as well as a script to create optimized React components from those SVG files.

If you're adding an icon, please add the SVG file to the appropriate `svg/` folder. Make sure you give it a unique name.

If you're changing an existing icon, just update the existing SVG file with the new source code.

Once you're done, run `yarn build` to generate the new components. This process will take ~10-60 seconds, depending on your computer and cache status.
