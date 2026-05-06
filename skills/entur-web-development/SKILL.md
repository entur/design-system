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

## Critical Rules

1. **ALWAYS check `references/components.md` before building custom UI.** The design system covers buttons (7 variants), forms, navigation, modals, tables, accordions, tabs, alerts, chips, dropdowns, loaders, travel components, and layout primitives.
2. **ALWAYS import `@entur/tokens/dist/base.css` first**, before any component stylesheets. Then import component CSS in the exact order in `references/getting-started.md`. Wrong order causes visual regressions.
3. **ALWAYS use tokens from `@entur/tokens`** for color, spacing, and typography. Never hardcode hex or rgb values — they break dark mode and drift from the brand.
4. **NEVER override `@entur/*` component styles** by targeting `.eds-*` internal selectors, using `!important`, wrapping in CSS-in-JS, or applying inline `style` props. DS components have calibrated styles for contrast, dark mode, and interaction states. Adding a `className` as a scoped override anchor is only permitted via the exception below.
5. **NEVER apply `padding` or `margin` directly to `@entur/*` components** — wrap them in a layout element instead.
6. **ALWAYS add `SkipToContent` from `@entur/a11y`** as the first element in every app, with a matching `<main id="main-content">`.
7. **ALWAYS use visible `label` props on form fields** — never rely on `placeholder` alone.
8. **NEVER use `default` imports** from `@entur/*` packages — all exports are named.

**Exception for rules 4 & 5:** When the user explicitly asks for a visual deviation, you may override component styles. Follow this approach:

1. **Add a `className` to the component** — this is your selector anchor. Never target `.eds-*` internal class names directly.
2. **Use the following token priority** for color values:
   - **Component tokens first** — `--components-{package}-{variant}-{context}-{property}` CSS custom properties (e.g. `--components-button-primary-standard-fill`). These live in each package's compiled `styles.css` and are scoped to the component's own context. Not officially documented for consumers but preferred when deviating.
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
  --components-button-primary-standard-fill: var(--shape-highlight);
}
```

Rules 3 (no hardcoded hex), 6 (SkipToContent), 7 (form labels), and 8 (named imports) still apply regardless of deviation.

> **Warning:** Overriding component styles breaks visual consistency, may break dark mode, and creates a maintenance burden when the design system evolves. Before proceeding, inform the user of these risks and suggest they consult the design system team in `#talk-designsystem` on Slack — there may be an existing component variant, a planned addition, or a better approach.

---

## Golden Path

Adding a component to an Entur app:

```bash
# 1. Install
yarn add @entur/button @entur/tokens
```

```css
/* 2. Import CSS globally (App.tsx or global stylesheet) — tokens first */
@import '@entur/tokens/dist/base.css';
@import '@entur/button/dist/styles.css';
```

```tsx
/* 3. Import component (named export) */
import { PrimaryButton } from '@entur/button';

/* 4. Use — accessible, branded, dark-mode-ready out of the box */
<PrimaryButton onClick={handleSubmit}>Kjøp billett</PrimaryButton>;
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
