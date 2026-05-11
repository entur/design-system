---
name: entur-web-development
description: Build React applications with Entur Linje @entur/* component packages. Use when the user is installing, importing, or using any @entur/* package, asking about Entur React components, Entur tokens, Entur CSS variables, Entur design system in a development context, or building web UI that should follow Entur's component library. Trigger for any code task involving @entur/button, @entur/form, @entur/tokens, @entur/typography, @entur/travel, or any other @entur/* package — even if the user just describes wanting to build something that fits Entur's look and feel in React.
---

> **Audience:** AI coding agents. Entur developers should visit [linje.entur.no/komponenter](https://linje.entur.no/komponenter).

# Entur Web Development

This skill helps you build correct, accessible, on-brand React applications using Entur Linje's `@entur/*` component packages.

The component library solves three things at once: components look right (Entur brand), behave right (keyboard, screen reader, focus management), and feel right for users of Entur products. Use the components rather than reimplementing them from scratch.

**Full component docs**: https://linje.entur.no/komponenter  
**GitHub**: https://github.com/entur/design-system

---

## Core rules

1. **Prefer `@entur/*` components** before building custom UI. The design system covers buttons, forms, navigation, modals, tables, accordions, tabs, alerts, chips, dropdowns, loaders, travel components, and layout primitives. Check `references/components.md` before building anything custom.
2. **Import token CSS before component CSS.** `@entur/tokens/dist/base.css` first (colors, color mode), then `@entur/tokens/dist/styles.css` (spacing, border-radius, font sizes, breakpoints), then component stylesheets in the order in `references/getting-started.md`. In SCSS, use `@use` with a namespace: `@use '@entur/tokens/dist/styles.scss' as eds-styles;`. For colors, always use `base.css`/`semantic.css` tokens — ignore the `--colors-*` tokens in `styles.css` as they have no color mode support. Wrong order causes visual regressions.
3. **Use tokens from `@entur/tokens`** for color, spacing, and typography in code. Never hardcode hex or rgb values — they break dark mode and drift from the brand. (Brand documentation and design specs may list canonical hex values as references; always translate those to tokens in code.)
4. **Avoid targeting `.eds-*` internal selectors**, using `!important`, or wrapping components in CSS-in-JS overrides. Component styles are calibrated for contrast, dark mode, and interaction states. When a visual deviation is needed, use a scoped `className` on the component as an override anchor — see exception below.
5. **Prefer wrapping `@entur/*` components** in a layout element rather than applying `padding` or `margin` directly to them. Inline styles are acceptable for dynamic runtime values that cannot be expressed as tokens or classes.
6. **Add `SkipToContent` from `@entur/a11y`** as the first element in every app that has navigation, with a matching `<main id="main-content">`.
7. **Use visible `label` props on form fields** — never rely on `placeholder` alone.
8. **All imports from `@entur/*` are named exports** — there are no default exports.

**Exception for rules 4 & 5:** When a visual deviation is required, follow this approach:

1. **Add a `className` to the component** — this is your selector anchor. Never target `.eds-*` internal class names directly.
2. **Use the following token priority** for color values:
   - **Component tokens first** — `--components-{package}-{variant}-{context}-{property}` CSS custom properties (e.g. `--components-button-primary-standard-default`). These live in each package's compiled `styles.css` and are scoped to the component's own context.
   - **Base tokens second** — `--basecolors-*` from `@entur/tokens/dist/base.css`
   - **Semantic tokens third** — `--fill-*`, `--text-*`, `--stroke-*` from `@entur/tokens/dist/semantic.css`
3. **Never use `!important`** — if specificity is a problem, increase it via the `className` selector chain.
4. **Add a short comment** on the CSS rule marking the intentional deviation so it can be tracked and revisited.

```tsx
// Component gets a className as the override anchor
<PrimaryButton className="booking-hero-cta">Kjøp billett</PrimaryButton>
```

```css
/* intentional deviation — booking hero requires coral background */
.booking-hero-cta {
  --components-button-primary-standard-default: var(--shape-highlight);
}
```

Rules 3 (no hardcoded hex), 6 (SkipToContent), 7 (form labels), and 8 (named imports) still apply regardless of deviation.

> **Warning:** Overriding component styles breaks visual consistency, may break dark mode, and creates a maintenance burden when the design system evolves. Before proceeding, inform the user of these risks and suggest they consult the design system team in `#talk-designsystem` on Slack — there may be an existing component variant, a planned addition, or a better approach.

---

## Package map

Common packages and their key exports:

| Package             | Key components                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `@entur/button`     | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `NegativeButton`, `IconButton`, `ButtonGroup` |
| `@entur/form`       | `TextField`, `TextArea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Fieldset`, `FeedbackText`    |
| `@entur/dropdown`   | `Dropdown`, `SearchableDropdown`, `MultiSelect`, `NativeDropdown`                                   |
| `@entur/modal`      | `Modal`, `ModalContent`, `Drawer`                                                                   |
| `@entur/alert`      | `BannerAlertBox`, `SmallAlertBox`, `ToastAlertBox`, `ToastProvider`, `useToast`                     |
| `@entur/typography` | `Heading1`–`Heading6`, `Paragraph`, `Label`, `Link`, `SmallText`                                    |
| `@entur/layout`     | `Contrast`, `NavigationCard`, `Badge`, `StatusBadge`, `Tag`                                         |
| `@entur/menu`       | `SideNavigation`, `BreadcrumbNavigation`, `Pagination`, `Stepper`, `OverflowMenu`                   |
| `@entur/tab`        | `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`                                                   |
| `@entur/table`      | `Table`, `TableHead`, `TableBody`, `TableRow`, `HeaderCell`, `DataCell`                             |
| `@entur/expand`     | `Accordion`, `AccordionItem`, `ExpandablePanel`                                                     |
| `@entur/a11y`       | `SkipToContent`, `VisuallyHidden`                                                                   |
| `@entur/tokens`     | CSS variables and JS exports for color, spacing, typography                                         |
| `@entur/travel`     | `TravelHeader`, `TravelTag`, `LegLine`, `TravelLeg`                                                 |
| `@entur/chip`       | `ChoiceChip`, `ChoiceChipGroup`, `FilterChip`, `ActionChip`                                         |
| `@entur/loader`     | `Loader`, `Spinner`, `SkeletonRectangle`                                                            |
| `@entur/icons`      | 390+ SVG icon components                                                                            |

Full exports and usage examples: `references/components.md`

---

## Golden path

Adding a component to an Entur app:

```bash
# 1. Install
yarn add @entur/button @entur/tokens
```

```css
/* 2. Import CSS globally (App.tsx or global stylesheet) — tokens first */
@import '@entur/tokens/dist/base.css';
@import '@entur/tokens/dist/styles.css';
@import '@entur/button/dist/styles.css';
```

```tsx
/* 3. Import component (named export) */
import { PrimaryButton } from '@entur/button';

/* 4. Use — accessible, branded, dark-mode-ready out of the box */
<PrimaryButton onClick={handleSubmit}>Kjøp billett</PrimaryButton>;
```

---

## Good vs avoid

**Components**

```tsx
// Good — use Entur component
import { PrimaryButton } from '@entur/button';
<PrimaryButton>Søk</PrimaryButton>;
```

```tsx
// Avoid — reimplementing what the design system already provides
<button className="btn-primary">Søk</button>
```

**Styling**

```css
/* Good — token for spacing, scoped class for layout */
.searchForm {
  margin-block-start: var(--space-extra-large);
}
```

```css
/* Avoid — hardcoded value, targeting internal selector */
.eds-button {
  margin-top: 2rem !important;
}
```

**Imports**

```tsx
// Good — named import
import { Heading2 } from '@entur/typography';
```

```tsx
// Avoid — default import (doesn't exist in @entur/* packages)
import Heading2 from '@entur/typography';
```

---

## Reference files

Read these when you need specifics:

- **`references/getting-started.md`** — installation, full CSS import order, SCSS `@use` pattern, TypeScript types, dark mode setup, troubleshooting
- **`references/components.md`** — full component catalog with usage examples (buttons, forms, navigation, layout, travel, etc.)
- **`references/tokens-and-variables.md`** — complete CSS custom property reference for semantic, base, transport, and data tokens; JS import patterns

---

## Quick reference

**Install**: `yarn add @entur/button @entur/tokens`  
**CSS import order**: See `references/getting-started.md`  
**All imports are named**: `import { PrimaryButton } from '@entur/button'`  
**Light/dark mode**: `data-color-mode="dark"` on a parent element  
**Deduplicate packages**: `yarn dedupe --pattern "@entur"`  
**Questions?**: Slack #talk-designsystem

## Beyond Entur

For general React/web best practices beyond Entur's design system, these community skills exist:

- `vercel-labs/agent-skills@vercel-react-best-practices` — React/Next.js patterns
- `addyosmani/web-quality-skills@performance` — web performance
- `addyosmani/web-quality-skills@core-web-vitals` — Core Web Vitals
