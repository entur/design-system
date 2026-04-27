# Entur Tokens & CSS Variables

Full token docs: https://linje.entur.no/tokens

Package: `@entur/tokens`

## Quick lookup

**Layer priority**: semantic → base → transport/data → primitive (last resort).

**CSS imports**:

```css
@import '@entur/tokens/dist/semantic.css'; /* recommended — adapts to light/dark */
@import '@entur/tokens/dist/base.css'; /* mode-aware brand structure */
@import '@entur/tokens/dist/transport.css'; /* transport mode colors */
@import '@entur/tokens/dist/data.css'; /* chart/graph colors */
@import '@entur/tokens/dist/primitive.css'; /* raw hex — last resort */
```

**JS imports**:

```ts
import { colors, space, borderWidths, fontWeights } from '@entur/tokens';
import { base, semantic, transport, data } from '@entur/tokens';
```

**Most-used tokens**:
| Purpose | Token | Value |
|---|---|---|
| Page bg | `--fill-background-standard-light` | `#ffffff` |
| Lavender 90 bg | `--fill-background-contrast-light` | `#181c56` |
| Primary fill | `--fill-primary-default-light` | `#181c56` |
| Coral accent | `--shape-highlight` | `#ff5959` |
| Body text | `--text-dark` | `#08091c` |
| Secondary text | `--text-subdued` | `#626493` |
| Border | `--stroke-neutral` | `#e3e6e8` |
| Success | `--fill-success-deep` | `#1a8e60` |
| Error | `--fill-negative-deep` | `#d31b1b` |
| Focus ring | `--stroke-focus-standard` | (= `--stroke-accent`) |

Type definitions in `@entur/tokens/dist/generated-js-objects/`.

---

## Full token reference

Read below only when you need the complete token list for a specific category.

---

## Semantic tokens (recommended)

Import `semantic.css` — these map to primitives and support light/dark switching.

```css
@import '@entur/tokens/dist/semantic.css';
```

### Fill / Backgrounds

```css
/* Backgrounds */
--fill-background-standard-light    /* #ffffff — default page bg */
--fill-background-standard-dark     /* #08091c — dark mode page bg */
--fill-background-tint-light        /* #f6f6f9 — subtle tint */
--fill-background-tint-dark         /* #141527 */
--fill-background-contrast-light    /* #181c56 — Entur Lavender 90 header/hero */
--fill-background-contrast-dark     /* #212233 */
--fill-background-subdued-light     /* #d9dae8 */
--fill-background-overlay-solid     /* #393a49 — modal backdrops */
--fill-background-overlay-transparent /* rgba — lighter overlay */

/* Primary (Entur Lavender 90) */
--fill-primary-default-light        /* #181c56 */
--fill-primary-hover-light          /* #393d79 */
--fill-primary-active-light         /* #11143c */
--fill-primary-default-contrast     /* #aeb7e2 — on dark bg */
--fill-primary-hover-contrast       /* #c7cdeb */

/* Secondary */
--fill-secondary-hover-light        /* #d9ddf2 */
--fill-secondary-active-light       /* #aeb7e2 */

/* Selected state */
--fill-selected-default-light       /* #f6f6f9 */
--fill-selected-hover-light         /* #eaeaf1 */

/* Status fills */
--fill-success-tint                 /* #9cd9c2 */
--fill-success-muted                /* #d0f1e3 */
--fill-success-deep                 /* #1a8e60 */
--fill-warning-tint                 /* #ffeeb3 */
--fill-warning-muted                /* #fff4cd */
--fill-negative-tint                /* #ff9494 */
--fill-negative-muted               /* #ffcece */
--fill-negative-deep                /* #d31b1b */
--fill-information-tint             /* #acd7f1 */
--fill-information-muted            /* #e1eff8 */
```

### Shape (icons, illustrations, decorative fills)

```css
--shape-accent                      /* #181c56 — primary brand */
--shape-light                       /* #ffffff */
--shape-dark                        /* #08091c */
--shape-subdued                     /* #626493 */
--shape-highlight                   /* #ff5959 — coral accent */
--shape-success                     /* #1a8e60 */
--shape-negative                    /* #d31b1b */
--shape-warning                     /* #ffca28 */
--shape-information                 /* #067eb2 */
--shape-neutral                     /* #6e6f73 */
--shape-disabled                    /* #515254 */
```

### Stroke (borders, dividers)

```css
--stroke-accent                     /* #181c56 */
--stroke-contrast                   /* #aeb7e2 */
--stroke-highlight                  /* #ff5959 — coral */
--stroke-light                      /* #ffffff */
--stroke-dark                       /* #b3b4bd */
--stroke-neutral                    /* #e3e6e8 */
--stroke-subdued                    /* #8284ab */
--stroke-success                    /* #1a8e60 */
--stroke-negative                   /* #d31b1b */
--stroke-warning                    /* #e9b10c */
--stroke-information                /* #067eb2 */
--stroke-focus-standard: var(--stroke-accent)
--stroke-focus-contrast: var(--stroke-contrast)
```

### Text

```css
--text-accent                       /* #181c56 — primary text */
--text-dark                         /* #08091c */
--text-light                        /* #ffffff */
--text-subdued                      /* #626493 — secondary text */
--text-highlight                    /* #aeb7e2 — on dark bg */
--text-neutral                      /* #6e6f73 */
--text-disabled                     /* #515254 */
--text-negative                     /* #d31b1b */
--text-success                      /* #1a8e60 */
```

---

## Spacing tokens

```css
@import '@entur/tokens/dist/primitive.css';

/* Size scale (rem) */
--size-0:   0rem
--size-1:   0.0625rem   /* 1px */
--size-2:   0.125rem    /* 2px */
--size-3:   0.25rem     /* 4px */
--size-4:   0.375rem    /* 6px */
--size-5:   0.5rem      /* 8px */
--size-6:   0.75rem     /* 12px */
--size-7:   0.875rem    /* 14px */
--size-8:   1rem        /* 16px */
--size-9:   1.25rem     /* 20px */
--size-10:  1.5rem      /* 24px */
--size-11:  1.75rem     /* 28px */
--size-12:  2rem        /* 32px */
--size-13:  2.25rem     /* 36px */
--size-14:  2.5rem      /* 40px */
--size-16:  3rem        /* 48px */
--size-19:  4rem        /* 64px */
--size-21:  5rem        /* 80px */
--size-23:  6rem        /* 96px */
```

---

## Base color tokens (light/dark mode)

Import `base.css` — these respond to `data-color-mode` attribute.

```css
@import '@entur/tokens/dist/base.css';
```

```css
/* In [data-color-mode='light'] / :root */
--basecolors-frame-default          /* white bg */
--basecolors-frame-contrast         /* Lavender 90 bg (#181c56) */
--basecolors-frame-tint             /* subtle tint (#f6f6f9) */
--basecolors-frame-elevated         /* card/elevated surface */
--basecolors-shape-accent           /* primary icon/shape color */
--basecolors-shape-highlight        /* coral accent */
--basecolors-text-accent            /* primary text color */
--basecolors-text-subdued           /* secondary text */
--basecolors-stroke-default         /* border color */
--basecolors-stroke-focus-standard  /* keyboard focus ring */
```

Transport mode base tokens (also in base.css):

```css
--basecolors-shape-train-default    /* #00367f */
--basecolors-shape-train-contrast   /* #42a5f5 */
--basecolors-shape-bus-default      /* #c5044e */
--basecolors-shape-bus-contrast     /* #ff6392 */
--basecolors-shape-metro-default    /* #bf5826 */
--basecolors-shape-tram-default     /* #78469a */
--basecolors-shape-ferry-default    /* #0c6693 */
/* ...etc for all modes */
```

---

## Transport color tokens

For transport mode coloring. Import `transport.css`:

```css
@import '@entur/tokens/dist/transport.css';
```

Tokens follow the pattern: `--{variant}-{mode}` where variant is `standard`, `contrast`, or `dark`.

```css
/* Standard (use on light backgrounds, meets contrast) */
--standard-train: #00367f
--standard-bus: #c5044e
--standard-bus-regional: #427500
--standard-metro: #bf5826
--standard-tram: #78469a
--standard-ferry: #0c6693
--standard-carferry: #0c6693
--standard-plane: #800664
--standard-bicycle: #0d827e
--standard-citybike: #0d827e
--standard-mobility: #0d827e
--standard-cableway: #78469a
--standard-funicular: #78469a
--standard-helicopter: #800664
--standard-taxi: #3d3e40
--standard-walk: #8d8e9c
--standard-airportlinkbus: #800664
--standard-airportlinkrail: #800664

/* Contrast (use on dark/colored backgrounds) */
--contrast-train: #42a5f5
--contrast-bus: #ff6392
--contrast-bus-regional: #b8db48
--contrast-metro: #f08901
--contrast-tram: #b482fb
--contrast-ferry: #6fdfff
--contrast-plane: #fbafea
--contrast-bicycle: #00dbb6
--contrast-walk: #9ea0bd
--contrast-taxi: #ffe082
```

Transparent variants available for overlays, e.g. `--standard-bus-transparent: #c5044e26`.

---

## Data visualization tokens

For charts, graphs, and data displays. Import `data.css`. These respond to `data-color-mode`.

```css
@import '@entur/tokens/dist/data.css';
```

Use in priority order (weight more of the first colors):

```css
/* Light mode */
--standard-blue: #181c56      /* 1st — use most */
--standard-coral: #ff5959     /* 2nd */
--standard-jungle: #0ea2a8    /* 3rd */
--standard-azure: #2f98fa     /* 4th */
--standard-peach: #ca825b     /* 5th */
--standard-lavender: #8692ca  /* 6th */
--standard-lilac: #8e57e3     /* 7th */
--standard-spring: #57a257    /* 8th — use least */

/* Contrast variants (for dark backgrounds) */
--contrast-blue: #6c6eb7
--contrast-coral: #ff5959
--contrast-jungle: #0fc2b3
--contrast-azure: #64b2fb
--contrast-peach: #ffbf9e
--contrast-lavender: #aeb7e2
--contrast-lilac: #ea8bea
--contrast-spring: #7bc00b
```

All data colors meet WCAG 3:1 contrast for graphical elements and are tested for colorblind accessibility.

---

## Primitive palette (raw colors)

Direct hex values — no semantic meaning. Use as last resort. Import `primitive.css`.

Key Entur brand colors:

```css
/* Lavender (primary brand) */
--lavender-90: #181c56   /* primary Lavender 90 */
--lavender-80: #262f7d
--lavender-70: #3b46ab
--lavender-60: #5a68c4
--lavender-40: #aeb7e2   /* light lavender */

/* Blue */
--blue-90: #393d79
--blue-10: #f6f6f9       /* very light tint */

/* Coral (brand accent) */
--coral-40: #ff5959      /* primary coral */
--coral-30: #ff9494
--coral-60: #d31b1b      /* dark/error coral */

/* Ebony (dark mode) */
--ebony-100: #08091c     /* dark bg */
--ebony-90: #212233

/* Grey */
--grey-70: #6e6f73       /* body text */
--grey-30: #e3e6e8       /* borders */

/* Mint (success) */
--mint-60: #1a8e60
--mint-40: #5ac39a

/* Sky (information) */
--sky-50: #067eb2
--sky-30: #64b3e7

/* Canary (warning) */
--canary-60: #ffca28
--canary-40: #ffe082
```
