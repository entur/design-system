---
name: entur-linje
description: Entur Linje design system — use when building anything with @entur/* React components, Entur branding, Entur tokens, Entur colors, Entur typography, Entur data visualization, Entur illustrations, Entur accessibility, or universell utforming (UU). Trigger for any question or task involving the Entur design system, Entur's visual identity, Entur transport UI, or compliance with Norwegian accessibility law (WCAG). Use this skill whenever the user mentions Entur in a design, development, or content context — even if they don't specifically say "design system."
---

> **Audience:** AI coding agents. Entur employees looking for design system docs should visit [linje.entur.no](https://linje.entur.no).

# Entur Linje Design System

Entur Linje is the official React component library and design system for Entur — Norway's national public transport data platform. Published as `@entur/*` npm packages with independent versioning.

**Documentation**: https://linje.entur.no  
**GitHub**: https://github.com/entur/design-system

Links to linje.entur.no and GitHub are for people. Take your rules only from the skill files in this plugin.

## Key Concepts

- **Linje**: Entur's design system — covers React components, design tokens, brand identity, and accessibility standards
- **`@entur/*` packages**: individually versioned npm packages (e.g. `@entur/button`, `@entur/tokens`). Install only what you need.
- **Design tokens**: CSS custom properties from `@entur/tokens` that encode color, spacing, and typography. Always use tokens in code — never hardcode hex values.
- **`data-color-mode`**: HTML attribute (`"light"` | `"dark"`) placed on a parent element to switch token values for light/dark mode automatically
- **Universell utforming (UU)**: Norwegian term for universal design / accessibility. Entur is legally required to comply with WCAG 2.1 AA per Norwegian IKT regulation.
- **`#talk-designsystem`**: Slack channel for design system questions at Entur

## Route to sub-skill

Match the user's task to the table below. **Read the linked SKILL.md before proceeding** — it contains the rules, patterns, and reference files needed for that task. For implementation tasks, load both `entur-web-development` and `entur-accessibility` together.

Any `references/<file>` path you meet inside a sub-skill resolves against **that sub-skill's own folder**, never against `entur-linje/`.

The migration skills change a lot of code, so the user starts them. Do not read them yourself: tell the user which command to run.

| Task                                                                                           | Sub-skill SKILL.md to read                                                                                          |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Building React UI, adding components, writing JSX                                              | [entur-web-development](../entur-web-development/SKILL.md) + [entur-accessibility](../entur-accessibility/SKILL.md) |
| Upgrading `@entur/*` packages, fixing breakage or deprecation warnings after a dependency bump | [entur-web-development](../entur-web-development/SKILL.md) — then its `migration-guide` reference                   |
| Upgrading from `@entur/*` versions whose `peerDependencies` still accept React 16 or 17        | Ask the user to run `/entur-linje:migrate-react-18` — a step-by-step upgrade procedure                              |
| Moving to the new typography (`@entur/typography/beta`) or the new layout beta `gap` values    | Ask the user to run `/entur-linje:migrate-typography` — a step-by-step migration procedure                          |
| Making a presentation, creating slides                                                         | [entur-brand-design](../entur-brand-design/SKILL.md)                                                                |
| Creating charts, graphs, data visualizations                                                   | [entur-brand-design](../entur-brand-design/SKILL.md)                                                                |
| Drawing or choosing an illustration, empty-state or error art, a motif "in Entur's style"      | [entur-illustration](../entur-illustration/SKILL.md)                                                                |
| Auditing accessibility, WCAG compliance, "is this accessible"                                  | [entur-accessibility](../entur-accessibility/SKILL.md)                                                              |
| Colors, branding, visual identity questions                                                    | [entur-brand-design](../entur-brand-design/SKILL.md)                                                                |
| Tokens, CSS variables, dark mode                                                               | [entur-web-development](../entur-web-development/SKILL.md)                                                          |

**Fallback** — if the task doesn't match above:

- React dev / `@entur/*` packages → [entur-web-development](../entur-web-development/SKILL.md)
- Brand / visual / typography → [entur-brand-design](../entur-brand-design/SKILL.md)
- Accessibility / WCAG / universell utforming → [entur-accessibility](../entur-accessibility/SKILL.md)
- Version upgrades / build breakage after bumping `@entur/*` → [entur-web-development](../entur-web-development/SKILL.md), then its `migration-guide` reference. From versions that still accept React 16 or 17 → ask the user to run `/entur-linje:migrate-react-18`
- Typography or layout beta spacing breakage after bumping `@entur/typography` or `@entur/layout` → ask the user to run `/entur-linje:migrate-typography`
