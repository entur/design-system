---
name: entur-brand-design
description: Apply Entur's visual identity correctly in designs, presentations, data visualizations, and web UI. Use when the user asks about Entur colors, Entur branding, Entur typography, Entur data visualization, creating charts or graphs for Entur, making a presentation that looks like Entur, building a branded web page or document for Entur, or anything that should follow Entur's visual identity. Trigger even if the user doesn't say "design system" — if they mention Entur and are making something visual, this skill applies.
---

> **Audience:** AI coding agents. Entur employees should visit [linje.entur.no/identitet](https://linje.entur.no/identitet).

# Entur Brand Design

This skill helps you apply Entur's visual identity correctly across web design, presentations, data visualizations, and branded content.

The Entur identity is built around clarity and trust. Blue, white, and coral are the foundation. The design serves the content — it never competes with the information users need.

**Identity documentation**: https://linje.entur.no/identitet  
**Design tokens**: https://linje.entur.no/tokens

---

## Brand-led surfaces vs. product UI

The rules below differ by context. Apply the right set:

**Brand-led surfaces** — marketing pages, presentations, documents, splash screens, campaign material:

- All three core colors (Lavender 90, white, coral) must be present
- Blue and white are dominant; coral is a detail accent
- Nationale typeface (or Arial fallback)

**Product UI** — application screens, dashboards, forms, data tables, travel planning:

- Prefer semantic tokens and component defaults from `@entur/*`
- Do not force brand colors manually — components are already on-brand
- Only reach for explicit brand colors when building a Contrast section or a branded hero area

---

## Core rules

1. **In brand-led surfaces, include all three core colors** — Lavender 90 (`#181c56`), white (`#ffffff`), and coral (`#ff5959`) must be present. A design without any of them stops feeling like Entur.
2. **Never use coral as a large background fill** — it is a detail color. Maximum one coral accent per view (accent line, logo mark, CTA highlight).
3. **Weight blue and white as dominant** — blue for structure/headers, white for content. Secondary colors add depth but never overpower.
4. **Never use data visualization colors for UI elements** (buttons, status indicators) — data colors are for charts only.
5. **Apply data colors in the specified order** — Blue first, Coral second, then Jungle, Azure, Lavender, Peach, Spring, Lilac. Never rearrange arbitrarily.
6. **Use Arial** when Nationale is unavailable (Office, email, external collaborators without a license).
7. **Never build presentations from scratch** — always start from `Entur_Powerpointmal.pptx`. It embeds the correct 7 Entur slide masters.
8. **In code, always use tokens — not hex values.** Brand docs and design specs list canonical hex values as references; translate them to CSS tokens when writing code.
9. **Content is the hero** — blue structures the layout, white hosts the content. Design recedes so information leads.
10. **Restraint** — two font weights, limited secondary colors, generous whitespace. Avoid busyness.
11. **Use `Contrast` from `@entur/layout`** for Lavender 90 sections in web UI, and `@entur/typography` for type hierarchy. Semantic tokens adapt to dark mode on their own.
12. **Digital type weights** — Medium (500) for body, Demibold (600) for headings.
13. **Test data visualizations for colorblind accessibility** — never let color be the only way to tell two series apart.

---

## Reference files

Read these for specifics:

- **`references/colors.md`** — full color system, primary/secondary palettes, CSS tokens, color weighting, status colors, contrast requirements
- **`references/typography.md`** — Nationale typeface, two weights for digital, Arial fallback, hierarchy guidelines, font loading
- **`references/data-visualization.md`** — data color palette (ordered), colorblind accessibility, light/dark variants, combining with transport colors. Import from `@entur/tokens/dist/data.css`
- **`references/visual-identity.md`** — layout principles, Contrast component, animation, illustrations, presentation guidelines
- **`references/presentations-pptx.md`** — step-by-step python-pptx workflow, layout index, 5 slide patterns, helper functions, QA
- **`references/catalog.json`** — machine-readable index of all 51 layouts + 7 masters in Entur_Powerpointmal.pptx with python-pptx references

> **Resolving these files:** if you are reading this over HTTP rather than from an installed skill folder, resolve each `references/<file>` above against `https://raw.githubusercontent.com/entur/design-system/main/skills/entur-brand-design/`

## Beyond Entur

For general creative design beyond Entur brand guidelines, the community skill `frontend-design` covers free-form aesthetics — but Entur work should follow identity guidelines here first.
