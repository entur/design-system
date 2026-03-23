# Figma MCP Integration Rules — Entur Linje Design System

These rules define how to translate Figma designs into code for the Entur Linje design system. They must be followed for every Figma-driven change.

---

## Required Figma-to-Code Flow (do not skip)

1. Run `get_design_context` first to fetch the structured representation for the exact node(s)
2. If the response is too large or truncated, run `get_metadata` to get the high-level node map, then re-fetch only the required node(s) with `get_design_context`
3. Run `get_screenshot` for a visual reference of the node variant being implemented
4. Only after you have both `get_design_context` and `get_screenshot`, download any assets needed and start implementation
5. Translate the output (usually React + Tailwind) into this project's conventions — see rules below
6. Validate against the Figma screenshot for 1:1 visual and behavioral fidelity before marking complete

---

## Component Organization

- IMPORTANT: UI components live in `packages/[package-name]/src/`. Never create components outside this structure.
- Each package is published as `@entur/[package-name]` with independent versioning.
- New components go into the most appropriate existing package. Only create a new package if the component represents a clearly new domain.
- Follow the standard file structure per package:
  ```
  src/
    [Component].tsx           # Main component
    [Component].test.tsx      # Co-located Jest + RTL tests
    [Component].scss          # BEM styles with eds- prefix
    componentVariables.scss   # Auto-generated token mappings (DO NOT EDIT)
    index.tsx                 # Barrel exports
    index.scss                # Style barrel
  ```

---

## Component Patterns

### forwardRef (Required)
All components MUST use `React.forwardRef`:
```tsx
export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ children, className, ...rest }, ref) => {
    return <div ref={ref} className={cx('eds-my-component', className)} {...rest}>{children}</div>;
  }
);
```

### Polymorphic `as` Prop
Many components accept an `as` prop for element composition. Use the `PolymorphicComponentPropsWithRef` type from `@entur/utils`:
```tsx
import { PolymorphicComponentPropsWithRef } from '@entur/utils';

export type MyComponentProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, MyBaseProps>;
```

### Variant Prop
Use the standard `VariantType` from `@entur/utils` for feedback/status variants:
```tsx
import { VariantType } from '@entur/utils';
// VariantType = 'success' | 'negative' | 'warning' | 'information'
```

### Size Prop
Common sizes: `'small' | 'medium' | 'large'`. Default to `'medium'`.

### className Composition
Use the `cx` classnames utility for conditional classes:
```tsx
import cx from 'classnames';
className={cx('eds-button', `eds-button--variant-${variant}`, {
  'eds-button--loading': loading,
  'eds-button--width-fluid': width === 'fluid',
}, className)}
```

IMPORTANT: Always spread the consumer's `className` prop last to allow overrides.

### Context for Grouped Components
Use React Context for parent-child component groups (e.g., ChoiceChipGroup/ChoiceChip, RadioGroup/RadioPanel).

---

## Styling Rules

### BEM with `eds-` Prefix (Mandatory)
All CSS classes MUST follow BEM with the `eds-` prefix:
```
.eds-[block]                          /* Block */
.eds-[block]--[modifier]              /* Modifier */
.eds-[block]--variant-[name]          /* Variant modifier */
.eds-[block]--size-[name]             /* Size modifier */
.eds-[block]__[element]               /* Element */
```

### IMPORTANT: Never Hardcode Colors
Always use CSS custom properties mapped from design tokens. Never use hex values, rgb(), or named colors directly in component SCSS.

### CSS Custom Properties Pattern
Components define local CSS variables that reference component tokens:
```scss
.eds-button {
  --eds-button-background: var(--components-button-primary-standard-default);
  --eds-button-text: var(--components-button-primary-standard-text);

  background-color: var(--eds-button-background);
  color: var(--eds-button-text);
}
```

### State Styling with `:where()` for Zero Specificity
Use `:where()` pseudo-class for state selectors to keep specificity at `0,1,0`:
```scss
&:where(:hover) {
  --eds-button-background: var(--components-button-primary-standard-hover);
}

&:where(:active) {
  --eds-button-background: var(--components-button-primary-standard-active);
}

&:where([disabled]) {
  cursor: not-allowed;
  --eds-button-background: var(--components-button-disabled-standard-fill);
}
```

### Contrast Mode Support
Support contrast mode using `:where(.eds-contrast)` parent selector:
```scss
:where(.eds-contrast) & {
  --eds-button-background: var(--components-button-primary-contrast-default);
}
```

### Focus Styling
Use token-based outline styles:
```scss
&:where(:focus-visible) {
  outline: t.$outlines-focus;
  outline-color: var(--basecolors-stroke-focus-standard);
  outline-offset: t.$outline-offsets-focus;

  :where(.eds-contrast) & {
    outline-color: var(--basecolors-stroke-focus-contrast);
  }
}
```

### SCSS Token Imports
```scss
@use '@entur/tokens/dist/styles.scss' as t;
@use '@entur/utils/dist/color-utils.scss' as util;
```

### Stylelint Constraints
- Max specificity: `0,1,0` — only class selectors allowed
- No IDs in selectors
- BEM naming pattern enforced

---

## Design Token Architecture (4 Layers)

Understand the token hierarchy when mapping Figma values to code:

1. **Primitive** → Raw color values (e.g., `Blue/50: #9ea0bd`)
2. **Semantic** → Meaningful roles (e.g., `Fill/Primary/Default/Light`)
3. **Base** → Base-level element tokens (e.g., `Base colors/Frame/Default`)
4. **Component** → Component-specific CSS vars (e.g., `--components-button-primary-standard-default`)

IMPORTANT: `componentVariables.scss` files are **auto-generated** from Figma tokens. DO NOT manually edit them.

When implementing a Figma design:
- Map Figma color styles/variables to the corresponding component-level CSS custom property
- If no component token exists, use the semantic token
- If the Figma design uses a primitive color directly, map it to the closest semantic token

---

## Existing Components — Reuse First

IMPORTANT: Before creating any new component, check if an existing `@entur/*` package already provides it. Key packages:

| Package | Components |
|---------|-----------|
| `@entur/button` | Button, PrimaryButton, SecondaryButton, IconButton, FloatingButton |
| `@entur/form` | TextField, TextArea, Checkbox, RadioPanel, Switch, Select, etc. |
| `@entur/typography` | Heading1-6, Paragraph, LeadParagraph, SmallText, Label, Link, etc. |
| `@entur/grid` | Grid (12-col responsive), GridContainer, GridItem |
| `@entur/layout` | BaseCard, MediaCard, NavigationCard, Tag, Badge, ContrastProvider |
| `@entur/icons` | 200+ icons organized by category (UI, Transport, Travel, etc.) |
| `@entur/alert` | BaseAlertBox, SmallAlertBox, ToastProvider |
| `@entur/chip` | Chip, ChoiceChip, ChoiceChipGroup, FilterChip |
| `@entur/modal` | Modal |
| `@entur/dropdown` | Dropdown, NativeSelect, SearchableDropdown |
| `@entur/datepicker` | DatePicker, TimePicker |
| `@entur/table` | Table, TableHead, TableBody, TableRow, TableCell |
| `@entur/tab` | TabGroup, Tab, TabPanel |
| `@entur/menu` | SideNavigation, TopNavigation, OverflowMenu |
| `@entur/tooltip` | Tooltip, Popover |
| `@entur/expand` | ExpandablePanel, Accordion |
| `@entur/loader` | Loader, SkeletonRectangle, SkeletonCircle |
| `@entur/travel` | TravelHeader, TravelTag, TravelSwitch, TravelLeg |
| `@entur/tokens` | Design tokens (SCSS + JS exports) |
| `@entur/utils` | PolymorphicComponentProps, VariantType, useOnClickOutside, etc. |
| `@entur/a11y` | VisuallyHidden, SkipToContent |

---

## Import Conventions

```tsx
// Cross-package imports use @entur/ scope
import { Button } from '@entur/button';
import { TextField } from '@entur/form';
import { Heading1, Paragraph } from '@entur/typography';
import { Grid } from '@entur/grid';
import { CloseIcon, SearchIcon } from '@entur/icons';
import { VariantType } from '@entur/utils';
```

---

## Icon Usage

- Icons come from `@entur/icons` — IMPORTANT: DO NOT install or use external icon libraries
- Icon components accept: `size`, `width`, `height`, `color`, `inline`, `className`
- Decorative icons: use `aria-hidden="true"`
- Meaningful icons: use `role="img"` and `aria-label`

---

## Responsive Design

- Grid uses responsive breakpoint props: `small` (mobile), `medium` (desktop), `large` (large desktop)
- Responsive values are column spans 1-12:
  ```tsx
  <Grid item small={12} medium={6} large={4}>Content</Grid>
  ```

---

## Asset Handling

- IMPORTANT: If the Figma MCP server returns a localhost source for an image or SVG, use that source directly
- IMPORTANT: DO NOT import new icon packages — all icon assets come from `@entur/icons`
- IMPORTANT: DO NOT use or create placeholder images if a localhost source is provided
- Store downloaded static assets in the appropriate package's `src/` directory

---

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Use semantic HTML elements (preserve with polymorphic `as` prop)
- Form controls require associated labels
- Color must not be the only means of conveying information
- Focus outlines must be visible in both standard and contrast modes
- Follow the existing `@entur/a11y` patterns (VisuallyHidden, SkipToContent)

---

## Implementation Translation Guide

When Figma MCP returns React + Tailwind code:

1. **Replace Tailwind classes** with BEM SCSS classes using the `eds-` prefix
2. **Replace inline colors** with CSS custom properties from the token system
3. **Replace generic HTML** with existing `@entur/*` components where possible
4. **Add `forwardRef`** wrapper to all new components
5. **Add `className` prop** support with `cx()` composition
6. **Add contrast mode** support in SCSS
7. **Map Figma spacing** to token-based spacing values
8. **Map Figma typography** to `@entur/typography` components (Heading1-6, Paragraph, etc.)
9. **Map Figma icons** to `@entur/icons` components
10. **Validate** the final result visually against the Figma screenshot
