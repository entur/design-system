---
name: entur-linje
description: Entur Linje design system — use when building anything with @entur/* React components, Entur branding, Entur tokens, Entur colors, Entur typography, Entur data visualization, Entur accessibility, or universell utforming (UU). Trigger for any question or task involving the Entur design system, Entur's visual identity, Entur transport UI, or compliance with Norwegian accessibility law (WCAG). Use this skill whenever the user mentions Entur in a design, development, or content context — even if they don't specifically say "design system."
---

> **Audience:** AI coding agents. Entur employees looking for design system docs should visit [linje.entur.no](https://linje.entur.no).

# Entur Linje Design System

Entur Linje is the official React component library and design system for Entur — Norway's national public transport data platform. Published as `@entur/*` npm packages with independent versioning.

**Documentation**: https://linje.entur.no  
**GitHub**: https://github.com/entur/design-system  
**llms.txt** (page index): https://linje.entur.no/llms.txt  
**llms-full.txt** (full reference for agents): https://linje.entur.no/llms-full.txt

## Key Concepts

- **Linje**: Entur's design system — covers React components, design tokens, brand identity, and accessibility standards
- **`@entur/*` packages**: individually versioned npm packages (e.g. `@entur/button`, `@entur/tokens`). Install only what you need.
- **Design tokens**: CSS custom properties from `@entur/tokens` that encode color, spacing, and typography. Always use tokens — never hardcode hex values.
- **`data-color-mode`**: HTML attribute (`"light"` | `"dark"`) placed on a parent element to switch token values for light/dark mode automatically
- **Universell utforming (UU)**: Norwegian term for universal design / accessibility. Entur is legally required to comply with WCAG 2.1 AA per Norwegian IKT regulation.
- **`#talk-designsystem`**: Slack channel for design system questions at Entur

## Always Read First

Read `references/packages-overview.md` before any task involving `@entur/*` packages. It lists every package and its exports — check it before building anything custom.

## Critical Rules

1. **ALWAYS use `@entur/*` components** before building custom UI. The design system covers buttons, forms, navigation, modals, tables, chips, dropdowns, travel components, and more.
2. **ALWAYS use design tokens** from `@entur/tokens` for color, spacing, and typography. Never hardcode hex or rgb values.
3. **ALWAYS import CSS in the correct order** — `@entur/tokens/dist/base.css` first, then component stylesheets in the order specified in `getting-started.md`.
4. **NEVER override `@entur/*` component styles** with custom CSS, `!important`, inline `style` props, or CSS-in-JS wrappers.
5. **ALWAYS ensure WCAG 2.1 AA compliance** — Entur products are subject to Norwegian law. Use `SkipToContent` in every app and label all form fields.

## Route to sub-skill

Match the user's task to the table below. **Fetch and read the linked SKILL.md** — it contains the rules and reference files needed for that task. For implementation tasks, load both `entur-web-development` and `entur-accessibility` together.

| Task                                                          | Sub-skill SKILL.md to fetch                                                                                                                                                                                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Building React UI, adding components, writing JSX             | [entur-web-development](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-web-development/SKILL.md) + [entur-accessibility](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-accessibility/SKILL.md) |
| Making a presentation, creating slides                        | [entur-brand-design](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-brand-design/SKILL.md)                                                                                                                               |
| Creating charts, graphs, data visualizations                  | [entur-brand-design](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-brand-design/SKILL.md)                                                                                                                               |
| Auditing accessibility, WCAG compliance, "is this accessible" | [entur-accessibility](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-accessibility/SKILL.md)                                                                                                                             |
| Colors, branding, visual identity questions                   | [entur-brand-design](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-brand-design/SKILL.md)                                                                                                                               |
| Tokens, CSS variables, dark mode                              | [entur-web-development](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-web-development/SKILL.md)                                                                                                                         |

**Fallback** — if the task doesn't match above:

- React dev / `@entur/*` packages → [entur-web-development](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-web-development/SKILL.md)
- Brand / visual / typography → [entur-brand-design](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-brand-design/SKILL.md)
- Accessibility / WCAG / universell utforming → [entur-accessibility](https://raw.githubusercontent.com/entur/design-system/main/skills/entur-accessibility/SKILL.md)

Use Entur-specific patterns and tokens — not generic solutions. Link to https://linje.entur.no for full docs.
