---
name: entur-brand-design
description: Apply Entur's visual identity correctly in designs, presentations, data visualizations, and web UI. Use when the user asks about Entur colors, Entur branding, Entur typography, Entur data visualization, creating charts or graphs for Entur, making a presentation that looks like Entur, building a branded web page or document for Entur, or anything that should follow Entur's visual identity. Trigger even if the user doesn't say "design system" — if they mention Entur and are making something visual, this skill applies.
---

# Entur Brand Design

This skill helps you apply Entur's visual identity correctly across web design, presentations, data visualizations, and branded content.

The Entur identity is built around clarity and trust. Blue, white, and coral are the foundation. The design serves the content — it never competes with the information users need.

**Identity documentation**: https://linje.entur.no/identitet  
**Design tokens**: https://linje.entur.no/tokens

---

## Core principles

- **Three-color foundation**: Lavender 90 (`#181c56`), white, and coral (`#ff5959`) must always be present. Everything else supports them.
- **Coral is punctuation**: use it sparingly. One coral accent per view. It's a detail color — it appears in the logo and in focus points, not as a large fill.
- **Content is the hero**: blue structures the layout, white hosts the content. Design recedes so information leads.
- **Restraint**: two font weights, limited secondary colors, generous whitespace. Avoid busyness.

---

## Reference files

Read these for specifics:

- **`references/colors.md`** — full color system, primary/secondary palettes, CSS tokens, color weighting, status colors, contrast requirements
- **`references/typography.md`** — Nationale typeface, two weights for digital, Arial fallback, hierarchy guidelines, font loading
- **`references/data-visualization.md`** — data color palette (ordered), colorblind accessibility, light/dark variants, combining with transport colors
- **`references/visual-identity.md`** — layout principles, Contrast component, animation, illustrations, presentation guidelines

---

## By use case

**Web design / UI development**  
Read `references/colors.md` for the token system. Use `Contrast` from `@entur/layout` for Lavender 90 sections. Use `@entur/typography` for correct type hierarchy. Semantic color tokens auto-adapt to dark mode.

**Data visualizations / charts**  
Read `references/data-visualization.md`. Use the 8-color palette in order. Start with Blue and Coral for 2 series. Always test for colorblind accessibility. Import from `@entur/tokens/dist/data.css`.

**Presentations and documents**  
Read `references/typography.md` (use Arial if Nationale is unlicensed) and `references/visual-identity.md`. Lead with Lavender 90 sections, white for content, coral only as accents on key points.

**Branding questions**  
Read `references/colors.md` and `references/visual-identity.md` together. The identity section explains the brand positioning and what to avoid.

---

## Quick reference

**Primary colors**: `#181c56` (Lavender 90), `#ffffff` (white), `#ff5959` (coral)  
**Main typeface**: Nationale (licensed) / Arial (fallback)  
**Digital weights**: Medium (500) body, Demibold (600) headings  
**Color token import**: `@import '@entur/tokens/dist/semantic.css'`  
**Data viz import**: `@import '@entur/tokens/dist/data.css'`  
**Full docs**: https://linje.entur.no/identitet

## Beyond Entur

For general creative design beyond Entur brand guidelines, the `frontend-design` skill handles free-form aesthetics — but Entur work should follow identity guidelines here first.
