# Entur Data Visualization

Full docs: https://linje.entur.no/identitet/verktoykassen/datavisualisering

## Core principle

Data visualization colors have different requirements than UI colors: they must be visually distinct from each other (easy to tell apart in charts), accessible for colorblind users, and still convey Entur's visual identity.

**Use data colors only for charts, graphs, and data displays.** Don't use them for UI elements like buttons or status indicators.

---

## Data color palette

Import: `@entur/tokens/dist/data.css`

Every hue comes in three tiers. Pick the tier by what the colour is for:

- **Standard** — the fill for bars, lines and areas on a normal light surface. This is the default.
- **Tint** — the pale variants, meant as a background behind text or an icon (this is what `Tag` uses). Too low-contrast to carry data on its own.
- **Contrast** — the variants for dark surfaces (inside `Contrast`).

Each tier also ships `--<tier>-text-default`, `--<tier>-stroke-default` and `--<tier>-icon-default` for whatever is drawn on top of the fill. Tint additionally has a per-hue stroke, `--tint-stroke-<hue>`.

Use colors **in order** — the sequence also determines weighting. Use more of the early colors (Blue, Coral) and progressively less of the later ones.

> The ranking below is the old eight-colour order with chalk, lime and mystic appended. Design has not ranked the expanded palette yet.

| Order | Name     | Standard  | Tint      | Contrast (on dark) |
| ----- | -------- | --------- | --------- | ------------------ |
| 1     | Blue     | `#4b58e4` | `#c5e0fc` | `#6ea5f7`          |
| 2     | Coral    | `#d31b1b` | `#ffe5e5` | `#ff9494`          |
| 3     | Jungle   | `#078388` | `#c2f0ec` | `#0fc2b3`          |
| 4     | Azure    | `#1193d4` | `#cdeefe` | `#64c9fb`          |
| 5     | Lavender | `#181c56` | `#ced4ee` | `#aeb7e2`          |
| 6     | Peach    | `#ba5620` | `#ffe4d6` | `#ffbf9e`          |
| 7     | Spring   | `#4a842d` | `#d7ecb6` | `#7bc00b`          |
| 8     | Lilac    | `#a529c7` | `#f9dcf9` | `#ea8bea`          |
| 9     | Chalk    | `#6a6b78` | `#eeeff1` | `#cccdd4`          |
| 10    | Lime     | `#807900` | `#f0f98b` | `#e6f53d`          |
| 11    | Mystic   | `#680dd7` | `#ebdefc` | `#c6a2f7`          |

The variable for any cell is `--<tier>-<hue>`, e.g. `--standard-blue`, `--tint-coral`, `--contrast-mystic`.

CSS usage:

```css
/* In a chart with 3 data series */
.series-1 {
  color: var(--standard-blue);
}
.series-2 {
  color: var(--standard-coral);
}
.series-3 {
  color: var(--standard-jungle);
}
```

---

## How to apply

### Start with fewer colors

For 2 data series → use Blue and Coral (positions 1 and 2). These are the most visually distinct and most "Entur."

For 3–4 series → add Jungle and Azure.

For 5+ series → continue down the ordered list. Eleven hues is the ceiling; past that, group the tail into an "Other" category rather than reusing a hue.

### Weighting in a single chart

Even within one chart, use proportionally more of the early colors. In a pie chart with 3 slices, the Blue slice should be the largest if possible.

### Respect the order

Don't rearrange colors arbitrarily — the order reflects both visual weight and Entur identity priority. Starting with Spring and using Blue last would look inconsistent with Entur's palette.

### Don't use Tint for the data itself

Tint is a surface tier. Filling a bar or a pie slice with `--tint-*` drops below the 3:1 graphical contrast requirement. Use it behind a label, not as the label's subject.

---

## Accessibility

All data colors meet **WCAG 3:1** contrast ratio for graphical elements.

Additionally, the palette is designed for colorblind users — particularly deuteranopia (red-green). The combination of Coral, Jungle, and Azure is chosen for distinguishability even with reduced color perception.

**Don't rely on color alone** to encode information in charts:

- Add patterns, shapes, or textures as secondary encodings
- Label data series directly (rather than only in a legend)
- Use tooltips that show values on hover

Test with colorblind simulators:

- Chrome DevTools → Rendering → Emulate vision deficiency
- [Funkify](https://www.funkify.org/) browser extension

---

## Dark backgrounds

Use `--contrast-*` variants when displaying charts on dark/Lavender 90 backgrounds. These are lighter versions of each hue that stay legible on a dark surface. Don't confuse them with the Tint tier, which is a pale surface colour for light backgrounds.

`data.css` auto-resolves token values to their dark color mode equivalents inside `data-color-mode="dark"`. This is color mode adaptation — it is **not** an automatic switch to `--contrast-*` variants. Use `--contrast-*` explicitly when you need the lighter variants for legibility on dark backgrounds.

```css
[data-color-mode='dark'] .chart {
  /* data.css resolves to dark color mode values here automatically */
}

/* Use --contrast-* explicitly for lighter tints on dark backgrounds */
.dark-background-chart .series-1 {
  color: var(--contrast-blue);
}
```

---

## Combining with transport colors

When visualizing transport-specific data (e.g. ridership by mode), use **transport tokens** instead of data tokens, so that Bus is always pink, Train is always blue, etc. This preserves the recognized color coding across all Entur products.

```css
@import '@entur/tokens/dist/transport.css';

.bus-bar {
  fill: var(--standard-bus);
} /* #c5044e */
.train-bar {
  fill: var(--standard-train);
} /* #00367f */
.metro-bar {
  fill: var(--standard-metro);
} /* #bf5826 */
```

Full transport token list: see `tokens-and-variables.md` in `entur-web-development` references.

---

## In React with @entur/tokens

```ts
import { data } from '@entur/tokens';

const CHART_COLORS = [
  data.light.standard.blue,
  data.light.standard.coral,
  data.light.standard.jungle,
  data.light.standard.azure,
];
```
