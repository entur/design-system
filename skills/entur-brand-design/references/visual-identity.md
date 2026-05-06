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

For programmatic presentation generation (python-pptx), see `presentations-pptx.md` and `catalog.json` in this references directory.

### Templates

Three official formats are available — always start from one of these:

| Format               | Source                                                                                      | Use when                                     |
| -------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| PowerPoint (.pptx)   | https://linje.entur.no/identitet/maler/presentasjon                                         | Sharing with external parties, offline use   |
| Google Slides        | Available in the shared Entur Google Drive                                                  | Internal collaboration, real-time editing    |
| Figma design toolkit | https://www.figma.com/design/ChQfEl7lEhiyaLJSGfBuoG/Design-verkt%C3%B8ykasse?node-id=6-2136 | Designing new slide layouts or visual assets |

Never build slides from scratch. The templates have correct fonts, colors, logo placement, and slide masters.

---

### Slide layout system

The template provides these slide types — use each for its intended purpose:

**Cover / title slide** — Lavender 90 (`#181c56`) background, coral title text, white subtitle, Entur logo bottom-right. First slide only.

**Section divider** — Lavender 90 background, small coral label above a large white heading. Separates major sections.

**Content slide (white)** — White background, navy text. Small coral accent bar top-left corner. Entur logo bottom-right. Default for most content.

**Split slide** — Half Lavender 90 / half white. Title on the dark panel, content on the light panel (or vice versa). Good for two-column contrast.

**Photo slide** — Full-bleed photo with text overlay. Use sparingly for emotional impact.

**Agenda slide** — White background, minimal layout. Bullet list of agenda items.

---

### Visual rules

- **Coral accent bar** — appears in the top-left corner of white slides. Do not remove or reposition it; it's a fixed brand mark, not decorative.
- **Logo placement** — always bottom-right. White version on dark backgrounds, dark version on white backgrounds.
- **One coral element per slide** — if coral is already used for the accent bar, don't add coral text or shapes on the same slide.
- **Lavender 90 for structure, white for content** — section openers and cover use dark bg; working content uses white.
- **Typography** — Nationale for headings and emphasis. Arial as fallback if Nationale is unavailable (Nationale requires a license). Never mix decorative typefaces.
- **Text weight** — titles bold or semi-bold; body regular weight. Avoid italic except for fine print.

---

### Data visualization in presentations

On dark (Lavender 90) slides, use contrast data colors (see `data-visualization.md`):

- Donut/ring charts: Azure (`#64b2fb`) as primary fill, Lavender (`#aeb7e2`) for secondary/empty arc
- Text labels: white
- Background: Lavender 90 (`#181c56`)

On white slides, use standard data colors starting with Blue then Coral.

Always follow the full color order from `data-visualization.md` when adding multiple data series.

For the Google Slides data visualization resource (chart templates, donut charts, bar charts, KPI layouts):  
https://docs.google.com/presentation/d/1-iX6nB5aShZ-LByEn9UlN1bjxLWkxTtoE5pfsbypME4/edit

---

## What to avoid

- Purple gradients or trendy colors outside the palette
- Busy backgrounds competing with content
- Multiple coral elements on a single page
- Mixing the Entur palette with other brand palettes without clear separation
- Comic or playful illustration styles that conflict with Entur's professional tone
