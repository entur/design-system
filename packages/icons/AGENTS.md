# @entur/icons

SVG source files live in `packages/icons/src/svgs/<Category>/`. The build script (`bin/build.ts`) generates React components automatically. Component names are derived from the **filename only** (not the path), PascalCased and suffixed with `Icon` (e.g. `Alert.svg` → `AlertIcon`).

After any SVG file changes, run `yarn build:package icons`.

## Icon categories

Categories that should **not** use brand-blue by default are listed in `OUTLIER_CATEGORIES` in `build.ts`:

- `Partner` — operator/partner logos
- `Flag` — country flags
- `Entur` — Entur brand logos
- `NonPartnerLogo` — external app/tool logos (Figma, Mural, Apple, Google Play)
- `Payment` — payment brand logos (Visa, Mastercard, Vipps, etc.)

Individual one-off exceptions go in `SPECIAL_OUTLIERS`.

## Renaming or moving icons

When an icon is **renamed**, the old name must be kept alive as deprecated:

1. Keep the old SVG file in its original location.
2. Add an entry to `DEPRECATED_ICONS` in `bin/build.ts`:
   ```ts
   const DEPRECATED_ICONS = new Map([['OldNameIcon', 'NewNameIcon']]);
   ```
3. This automatically adds a `@deprecated` JSDoc comment and a `console.warn` to the generated component.

When an icon is **moved to a different category folder** without a name change, no deprecation is needed — the component name stays the same.

## Adding new icons

1. Export the SVG from Figma and normalize it:
   - `<svg width="16" height="16" viewBox="..." fill="none" xmlns="...">`
   - Use `fill="#181C56"` directly (not CSS variables).
   - No `preserveAspectRatio`, `overflow`, or `style` attributes on `<svg>`.
   - No `<g id="Icon Fill">` wrapper.
2. Place the file in the correct category folder under `src/svgs/`.
3. If the icon belongs to an outlier category, ensure the category is in `OUTLIER_CATEGORIES`.
