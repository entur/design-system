# Entur Visual Identity

Full identity docs: https://linje.entur.no/identitet

## Brand positioning

Entur is Norway's national public transport data platform. The visual identity reflects:

- **Clarity** — information is the hero; design doesn't compete with content
- **Contrast** — the tension between old and new Norway, urban and rural transit
- **Trust** — reliable, professional, accessible to all

---

## Core graphic elements

### Colors

The Lavender 90–white–coral triad is the visual foundation. See `colors.md` for full guidance.

### Typography

Nationale is the brand typeface. Clean weight hierarchy, minimal variation. See `typography.md`.

### Logo

- The Entur logotype is the primary brand mark
- In digital products, the logo appears on the Lavender 90 (`#181c56`) Contrast component or on white
- The animated logo (opening motion) is the hero of Entur's brand storytelling

---

## Layout principles for digital surfaces

- **Content first** — design frames content, doesn't decorate it
- **Blue and white structure** — use `Contrast` sections (Lavender 90 bg) for headers and hero areas; white for content
- **Coral as punctuation** — one coral element per view maximum (focus point, CTA, accent)
- **Generous white space** — Entur's digital surfaces are calm, not busy

```tsx
import { Contrast } from '@entur/layout';

// Lavender 90 header section
<Contrast>
  <Heading1>Planlegg reisen din</Heading1>
  <PrimaryButton>Søk etter avganger</PrimaryButton>
</Contrast>

// White content section below
<section>
  <Heading2>Populære ruter</Heading2>
  ...
</section>
```

---

## Animation

Entur uses animation as a storytelling device — not decoration. The animated logo sequence is the primary motion identity.

**For UI animations**:

- Use motion to communicate state changes, not to entertain
- Transitions should be fast (150–300ms) and purposeful
- Avoid animation that delays the user from their task
- Animated illustrations are available in the illustration library (requires Google Drive access via Entur)

Animation assets: available at Google Drive (internal access required — contact the design system team via #talk-designsystem on Slack).

---

## Illustrations

Entur has a custom illustration library developed with SDG. Illustrations can be used across all Entur surfaces.

**When to use**:

- Onboarding / empty states
- Marketing materials
- Explanatory content

**Not** for dense information interfaces — keep illustrations out of data-heavy views.

Illustration library access: requires Google Drive access (internal Entur use).

---

## Presentations and documents

When creating Entur presentations:

- Use the official presentation templates (available in Google Drive / Confluence)
- Lead with Lavender 90 sections for structure, white for content
- Coral accents for key points only
- Use Arial if Nationale is not available (Nationale requires a license)
- For charts and data in presentations, follow the data visualization color order from `data-visualization.md`

---

## What to avoid

- Purple gradients or trendy colors outside the palette
- Busy backgrounds competing with content
- Multiple coral elements on a single page
- Mixing the Entur palette with other brand palettes without clear separation
- Comic or playful illustration styles that conflict with Entur's professional tone
