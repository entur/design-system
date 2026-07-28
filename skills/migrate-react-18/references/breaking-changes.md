# Breaking Changes Reference

Work through each section below for packages the project uses. For each section: search for the affected patterns, apply the fix, confirm no instances remain.

## ESM `exports` (all @entur/\* packages)

All packages now declare strict `exports` in `package.json`. Deep imports into `dist/` that aren't explicitly listed will break.

### Fix deep `dist/` imports

Search for imports matching `@entur/*/dist/*`. Replace with public API imports:

```tsx
// ❌ Breaks
import { Button } from '@entur/button/dist/Button';

// ✅ Fix
import { Button } from '@entur/button';
```

### CSS/SCSS imports

Both old and new paths work, but prefer the clean subpaths:

```tsx
// ✅ New (recommended)
import '@entur/button/styles';

// ✅ Still works
import '@entur/button/dist/styles.css';
```

**`@entur/tokens`** style imports:

```scss
// ✅ New (recommended)
@use '@entur/tokens/styles/base.scss' as *;
@use '@entur/tokens/styles/semantic.scss' as *;
@use '@entur/tokens/styles/styles.scss' as t;

// ✅ Still works
@use '@entur/tokens/dist/base.scss' as *;
```

**`@entur/utils`** SCSS imports:

```scss
// ✅ New (recommended)
@use '@entur/utils/styles/breakpoints' as breakpoint;
@use '@entur/utils/styles/color-utils' as util;

// ✅ Still works
@use '@entur/utils/dist/breakpoints.scss' as breakpoint;
```

### Remove bundler aliases

If the project has custom alias/resolve configuration to handle `@entur/*` ESM entry points, remove it. The `exports` field handles resolution natively.

**Search patterns:** `@entur/*/dist/`, bundler alias config referencing `@entur`.

---

## @entur/modal

The modal moved from `@reach/dialog` to the native HTML `<dialog>` element.

### `onDismiss` is now required

`Modal` requires `onDismiss`. If it's already passed (most common), no change needed. If missing, add it:

```tsx
// ❌ Missing onDismiss
<Modal open={isOpen} title="...">

// ✅ Add onDismiss
<Modal open={isOpen} onDismiss={() => setIsOpen(false)} title="...">
```

### DOM output changed: `<div>` → `<dialog>`

`ModalOverlay` now renders a `<dialog>` element instead of a `<div>`. Update any CSS or tests that target the overlay's element type:

```css
/* ❌ Breaks */
div.eds-modal__overlay {
  ...;
}

/* ✅ Fix — use the class without element qualifier */
.eds-modal__overlay {
  ...;
}
```

### Remove `data-reach-dialog-*` selectors

Remove any CSS selectors or test queries targeting `[data-reach-dialog-overlay]`, `[data-reach-dialog-content]`, etc. Replace with:

- `.eds-modal__overlay` / `.eds-modal__content` (CSS)
- `role="dialog"` (test queries)

### New `showCloseButton` prop

Default `true`. If you previously rendered a close button inside `ModalContent` manually, you may now have duplicates. Either remove the manual button or pass `showCloseButton={false}`.

**Search patterns:** `data-reach-dialog`, `div.eds-modal`, `<Modal` without `onDismiss`.

---

## @entur/tab

Tabs moved from `@reach/tabs` to a native ARIA implementation.

### Remove `data-reach-*` selectors

Replace Reach-specific selectors in CSS and tests:

| Old selector             | Replacement                             |
| ------------------------ | --------------------------------------- |
| `[data-reach-tab]`       | `.eds-tab` or `[role="tab"]`            |
| `[data-reach-tab-list]`  | `.eds-tab-list` or `[role="tablist"]`   |
| `[data-reach-tab-panel]` | `.eds-tab-panel` or `[role="tabpanel"]` |
| `[data-reach-tabs]`      | `.eds-tabs`                             |

### Remove non-standard props

Components previously accepted arbitrary props via `[key: string]: any`. Types are now strict. All standard HTML attributes (`className`, `style`, `id`, event handlers) still work. Remove any Reach-specific or unknown props.

### Don't hardcode generated IDs in tests

Tab and panel IDs now use React's `useId()` format instead of Reach's scheme. Instead of matching specific ID strings, query via ARIA relationships:

```tsx
// ❌ Fragile
expect(tab).toHaveAttribute('id', 'tabs--tab--0');

// ✅ Robust
const panel = document.getElementById(tab.getAttribute('aria-controls')!);
```

### New `keepMounted` prop on `TabPanels`

Keeps all panels in the DOM with `hidden` attribute instead of unmounting inactive ones. No action required unless you want this behavior.

**Search patterns:** `data-reach-tab`, `data-reach-tabs`, hardcoded tab/panel IDs in tests.

---

## @entur/expand

Expand components moved from `react-collapse` to a CSS grid animation.

### Content now stays in DOM when collapsed

Previously, collapsed content was unmounted. Now it stays in the DOM, hidden with `aria-hidden="true"` and `inert`.

**If you depend on content being removed from the DOM when collapsed** (e.g., `document.querySelector` checks, relying on unmount to reset state), restore old behavior:

```tsx
<ExpandablePanel unmountOnClose={true} title="...">
  {children}
</ExpandablePanel>
```

This also affects `SideNavigationGroup` from `@entur/menu` — collapsed groups keep content in DOM.

### `ExpandableText` spreads extra props on the wrapper, not the button

Props that aren't part of `ExpandableTextProps` used to land on the toggle button. They now land on the outer `<div>`:

```tsx
// data-testid, onClick, aria-* etc. now sit on the wrapper div
<ExpandableText title="..." data-testid="my-expandable">
```

Update tests and handlers that expected these on the button — target the button by its role instead: `getByRole('button', { name: 'title' })`.

### New controlled mode

`ExpandablePanel` now accepts `open` and `onToggle` for controlled mode. `Accordion` now accepts `openId`, `onToggle`, and `defaultOpenId`. No action required — these are additive.

**Search patterns:** `ExpandablePanel`, `ExpandableText`, `AccordionItem`, `BaseExpand`, `SideNavigationGroup` — review whether any rely on content unmounting when collapsed.

---

## @entur/layout (beta)

Beta `Grid` and `Flex` resolve responsive props through a CSS custom property cascade instead of a JS breakpoint hook. Everything below concerns `@entur/layout/beta` only.

### `LayoutProvider` and `useLayoutValues` removed

Both are gone, along with the `LayoutProviderProps` type. Breakpoints are now fixed in CSS and no longer configurable:

| Key    | Applies from |
| ------ | ------------ |
| `base` | 0px          |
| `s`    | 600px        |
| `m`    | 800px        |
| `lg`   | 1200px       |
| `xl`   | 1400px       |

```tsx
// ❌ Removed — delete the wrapper entirely
<LayoutProvider breakpoints={{ m: 600, lg: 1024, xl: 1280 }}>
  {children}
</LayoutProvider>;

// ✅ Children work unchanged without it
{
  children;
}
```

If the project relied on custom breakpoint values, those viewport widths now come from the table above — rework the affected responsive objects, or add your own media queries around the component.

### Responsive object keys: `s` → `base`, and `s` now means something else

The old base key was `s` (0px). It is now `base`, and `s` has been reused for a new 600px breakpoint. **Renaming is mandatory** — leaving `s` in place compiles under plain JS but silently applies the value from 600px up instead of from 0px.

```tsx
// ❌ Old — s was the mobile base
<Grid.Item colSpan={{ s: '1 / -1', m: '1 / -1', lg: '3 / -3' }}>

// ✅ New — base is required, s is now the 600px breakpoint
<Grid.Item colSpan={{ base: '1 / -1', m: '1 / -1', lg: '3 / -3' }}>
```

`base` is required on every responsive object. TypeScript flags a missing `base`; at runtime the object is ignored and a console warning is logged. Unknown keys are warned about and dropped.

### Spacing value types renamed

`GridSpacingValue` and `FlexSpacingValue` are replaced by a single `SpacingValue`, still exported from `@entur/layout/beta`.

**Search patterns:** `LayoutProvider`, `useLayoutValues`, `LayoutProviderProps`, `GridSpacingValue`, `FlexSpacingValue`, responsive objects with an `s:` key.

---

## @entur/utils

### `useRandomId` deprecated

Replace with React 18's native `useId()`:

```tsx
// ❌ Deprecated
import { useRandomId } from '@entur/utils';
const id = useRandomId('eds-my-component');

// ✅ Replacement
import { useId } from 'react';
const id = `eds-my-component${useId()}`;
```

`useRandomId` still works (delegates to `useId()` internally) but will be removed in a future major version.

**Search patterns:** `useRandomId`.
