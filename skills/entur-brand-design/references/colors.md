# Entur Color System

Full docs: https://linje.entur.no/identitet/verktoykassen/farger

## The core principle

Blue, white, and coral are Entur's main colors and should always be present. Coral is weighted low — it's a detail color used for accents, often just in the logo. Secondary colors add depth and variety but never dominate.

**Digital surfaces**: lean and clean. Blue and white dominate, coral reinforces the brand. The design serves the content — don't let color compete with information.

**Print**: more room to experiment. Core colors must still anchor the design. Typography can be used as a graphic element.

---

## Brand color palette

### Primary colors (always include these)

| Color           | Hex       | Usage                                      |
| --------------- | --------- | ------------------------------------------ |
| **Lavender 90** | `#181c56` | Primary backgrounds, headers, buttons      |
| **White**       | `#ffffff` | Page background, text on dark              |
| **Coral**       | `#ff5959` | Accent, highlights, call-to-action details |

### Secondary colors (decorative, add depth)

| Name        | Hex       | Notes                          |
| ----------- | --------- | ------------------------------ |
| Lavender 40 | `#aeb7e2` | Light lavender, good for tints |
| Blue 10     | `#f6f6f9` | Subtle page tint               |
| Blue 30     | `#d9dae8` | Subdued surfaces               |
| Mint 40     | `#5ac39a` | Success states                 |
| Sky 30      | `#64b3e7` | Information states             |
| Canary 40   | `#ffe082` | Warning states                 |

---

## Color weighting for digital

The balance matters — small shifts change the feel significantly:

1. **Blue dominant** — large areas (nav, hero, headers)
2. **White dominant** — content areas, cards, forms
3. **Coral minimal** — details, accents, focus points (never large fills)

Secondary colors support individual elements and create depth. They should never overpower blue or white.

---

## Light/dark mode

Base tokens and semantic tokens support both modes. Apply `data-color-mode="dark"` or `data-color-mode="light"` to a container:

```html
<div data-color-mode="dark">
  <!-- Lavender 90 background context — tokens auto-shift -->
</div>
```

Dark mode uses the **Ebony** palette as backgrounds:

- Dark page bg: `#08091c` (Ebony 100)
- Dark tint: `#141527` (Ebony 95)
- Dark contrast: `#212233` (Ebony 90)

---

## CSS tokens to use

Always use tokens over raw hex values. Prefer base tokens (`@entur/tokens/dist/base.css`) — they support light/dark mode automatically. Use semantic tokens (`@entur/tokens/dist/semantic.css`) as fallback when base tokens don't fit:

```css
/* Backgrounds */
var(--fill-background-standard-light)   /* white */
var(--fill-background-contrast-light)   /* #181c56 Lavender 90 */
var(--fill-background-tint-light)       /* #f6f6f9 */

/* Shapes / fills */
var(--shape-accent)                      /* primary Lavender 90 */
var(--shape-highlight)                   /* coral */

/* Text */
var(--text-accent)                       /* primary text */
var(--text-subdued)                      /* secondary text */
var(--text-light)                        /* white text on dark */

/* Strokes */
var(--stroke-accent)                     /* primary border */
var(--stroke-highlight)                  /* coral border */
var(--stroke-neutral)                    /* subtle divider */
```

---

## Status colors

For feedback states in UI:

```css
/* Success */
var(--fill-success-tint)    /* #9cd9c2 — bg */
var(--shape-success)        /* #1a8e60 — icon */
var(--text-success)         /* #1a8e60 — text */

/* Warning */
var(--fill-warning-tint)    /* #ffeeb3 */
var(--shape-warning)        /* #ffca28 */

/* Negative/error */
var(--fill-negative-tint)   /* #ff9494 */
var(--shape-negative)       /* #d31b1b */
var(--text-negative)        /* #d31b1b */

/* Information */
var(--fill-information-tint) /* #acd7f1 */
var(--shape-information)    /* #067eb2 */
```

---

## Accessibility — contrast requirements

- **Text on background**: minimum 4.5:1 (normal text), 3:1 (large text / 18px+ or 14px bold)
- **Graphical elements**: minimum 3:1

All Entur semantic tokens are designed to meet these ratios within their intended pairings. Don't pair tokens from opposite contexts (e.g. `--text-light` on a white background).

Use the contrast checker at https://linje.entur.no/universell-utforming/kontrastsjekker to verify custom combinations.
