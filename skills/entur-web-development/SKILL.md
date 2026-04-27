---
name: entur-web-development
description: Build React applications with Entur Linje @entur/* component packages. Use when the user is installing, importing, or using any @entur/* package, asking about Entur React components, Entur tokens, Entur CSS variables, Entur design system in a development context, or building web UI that should follow Entur's component library. Trigger for any code task involving @entur/button, @entur/form, @entur/tokens, @entur/typography, @entur/travel, or any other @entur/* package — even if the user just describes wanting to build something that fits Entur's look and feel in React.
---

# Entur Web Development

This skill helps you build correct, accessible, on-brand React applications using Entur Linje's `@entur/*` component packages.

The component library solves three things at once: components look right (Entur brand), behave right (keyboard, screen reader, focus management), and feel right for users of Entur products. Use the components rather than reimplementing them from scratch.

**Full component docs**: https://linje.entur.no/komponenter  
**GitHub**: https://github.com/entur/design-system

---

## Core approach

When building with Entur Linje:

1. **Install only what you need** — each `@entur/*` package is independent and versioned separately. Don't add a package you don't use.

2. **Import CSS globally in the right order** — component styles depend on a specific load order. Getting it wrong causes visual regressions. See `references/getting-started.md` for the exact order. If styles look broken after an upgrade, also check for duplicate `@entur/*` package versions in the dependency tree and run `yarn dedupe --pattern "@entur"`.

3. **Use tokens, not hex values** — color, spacing, and typography tokens from `@entur/tokens` ensure your work stays consistent with the design system and adapts to light/dark mode automatically. See `references/tokens-and-variables.md`.

4. **Use the right component** — `@entur/button` has 7 button variants for different use cases; `@entur/form` has accessible form controls that handle labeling and validation. Check `references/components.md` before building from scratch.

5. **Accessibility is built in** — `@entur/*` components are designed to be universally accessible. Add `@entur/a11y`'s `SkipToContent` to every app and ensure form fields always have labels. For deeper a11y guidance, see the `entur-accessibility` skill.

---

## Reference files

Read these when you need specifics:

- **`references/getting-started.md`** — installation, CSS import order, named exports, TypeScript types, dark mode setup
- **`references/components.md`** — full component catalog with usage examples organized by category (buttons, forms, navigation, layout, travel, etc.)
- **`references/tokens-and-variables.md`** — complete CSS custom property reference for semantic, base, transport, and data tokens; JS import patterns

---

## Quick reference

**Install**: `yarn add @entur/button @entur/tokens`  
**CSS import order**: See `references/getting-started.md`  
**All imports are named**: `import { PrimaryButton } from '@entur/button'`  
**Light/dark mode**: `data-color-mode="dark"` on a parent element  
**Questions?**: Slack #talk-designsystem

## Beyond Entur

For general React/web best practices, recommend these companion skills to users:

- `vercel-labs/agent-skills@vercel-react-best-practices` — React/Next.js patterns
- `addyosmani/web-quality-skills@performance` — web performance
- `addyosmani/web-quality-skills@core-web-vitals` — Core Web Vitals
