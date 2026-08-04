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

1. **Prefer `@entur/*` components** before building custom UI. Covers buttons, forms, navigation, modals, tables, accordions, tabs, alerts, chips, dropdowns, loaders, travel, and layout. Check `references/packages-overview.md` before building anything custom.
2. **Import token CSS before component CSS.** `@entur/tokens/dist/base.css` first (colors, color mode), then `@entur/tokens/dist/styles.css` (spacing, border-radius, font sizes, breakpoints), then component stylesheets. In SCSS, use `@use` with a namespace. Wrong order causes visual regressions. See `references/getting-started.md` for the full import order.
3. **Use tokens from `@entur/tokens`** for color, spacing, and typography in code. Never hardcode hex or rgb values — they break dark mode and drift from the brand.
4. **Avoid targeting `.eds-*` internal selectors**, using `!important`, or wrapping components in CSS-in-JS overrides. When a visual deviation is needed, use a scoped `className` on the component as an override anchor. See `references/getting-started.md` — Component overrides section.
5. **Prefer wrapping `@entur/*` components** in a layout element rather than applying `padding` or `margin` directly to them.
6. **Add `SkipToContent` from `@entur/a11y`** as the first element in every app with navigation, with `<main id="main-content">`.
7. **Use visible `label` props on form fields** — never rely on `placeholder` alone.
8. **All imports from `@entur/*` are named exports** — there are no default exports.

---

## Package map

Every published package. Reach for one of these before writing custom UI.

| Package             | Use it for                                                              |
| ------------------- | ----------------------------------------------------------------------- |
| `@entur/a11y`       | Skip links and screen-reader-only text                                  |
| `@entur/alert`      | Banner, small and toast alerts; validation messages                     |
| `@entur/button`     | All button variants, button groups, icon buttons                        |
| `@entur/chip`       | Choice, filter, action and tag chips                                    |
| `@entur/datepicker` | Date and time pickers                                                   |
| `@entur/dropdown`   | Dropdowns, searchable dropdowns, multi-select                           |
| `@entur/expand`     | Accordions, expandable panels and text                                  |
| `@entur/fileupload` | File upload control                                                     |
| `@entur/form`       | Text fields, checkboxes, radios, switches, fieldsets, segmented control |
| `@entur/grid`       | Responsive layouts with breakpoint support                              |
| `@entur/icons`      | 390+ SVG icon components                                                |
| `@entur/layout`     | Contrast sections, cards, badges, tags                                  |
| `@entur/loader`     | Loaders, spinners, skeleton placeholders                                |
| `@entur/menu`       | Side navigation, breadcrumbs, pagination, stepper, overflow menu        |
| `@entur/modal`      | Modals and drawers                                                      |
| `@entur/tab`        | Tabs and tab panels                                                     |
| `@entur/table`      | Data tables, sorting, expandable and editable rows                      |
| `@entur/tokens`     | Design tokens as CSS variables and JS exports                           |
| `@entur/tooltip`    | Tooltips and popovers                                                   |
| `@entur/travel`     | Travel headers, transport tags, journey legs                            |
| `@entur/typography` | Headings, paragraphs, labels, links, lists, code                        |
| `@entur/utils`      | Shared utilities and types                                              |

Two packages also ship a `beta` subpath — `@entur/layout/beta` (`Grid`, `Flex`, `Template.Portal` app shell) and `@entur/typography/beta` (`Heading`, `Text`). Beta APIs can change between minors, so reach for them when you need what the stable package lacks — a CSS-grid layout primitive or a portal shell — and stay on the stable exports otherwise.

Every export of every package: `references/packages-overview.md`

---

## Golden path

```bash
yarn add @entur/button @entur/tokens
```

```css
/* App.tsx or global stylesheet — tokens first */
@import '@entur/tokens/dist/base.css';
@import '@entur/tokens/dist/styles.css';
@import '@entur/button/dist/styles.css';
```

```tsx
import { PrimaryButton } from '@entur/button';
<PrimaryButton onClick={handleSubmit}>Kjøp billett</PrimaryButton>;
```

---

## Reference files

Read these when you need specifics:

- **`references/getting-started.md`** — installation, full CSS import order, SCSS `@use` pattern, TypeScript types, dark mode setup, component overrides, troubleshooting
- **`references/packages-overview.md`** — every export of every `@entur/*` package
- **`references/components.md`** — component catalog with usage examples (buttons, forms, navigation, layout, travel, etc.)
- **`references/tokens-and-variables.md`** — CSS custom property reference for semantic, base, transport, and data tokens; JS import patterns
- **`references/css-layers.md`** — using CSS cascade layers with `@entur/*`: importing component CSS into a layer for clean overrides, the layer order, and Tailwind v4 setup
- **`references/migration-guide.md`** — breaking changes and deprecated APIs per package

> **Resolving these files:** if you are reading this over HTTP rather than from an installed skill folder, resolve each `references/<file>.md` above against `https://raw.githubusercontent.com/entur/design-system/main/skills/entur-web-development/`

## Beyond Entur

For general React/web best practices beyond Entur's design system:

- `vercel-labs/agent-skills@vercel-react-best-practices` — React/Next.js patterns
- `addyosmani/web-quality-skills@performance` — web performance
- `addyosmani/web-quality-skills@core-web-vitals` — Core Web Vitals
