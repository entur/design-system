# Entur Data Visualization

Full docs: https://linje.entur.no/identitet/verktoykassen/datavisualisering

## Core principle

Data visualization colors have different requirements than UI colors: they must be visually distinct from each other (easy to tell apart in charts), accessible for colorblind users, and still convey Entur's visual identity.

**Use data colors only for charts, graphs, and data displays.** Don't use them for UI elements like buttons or status indicators.

---

## Data color palette

Import: `@entur/tokens/dist/data.css`

Use colors **in order** — the sequence also determines weighting. Use more of the early colors (Blue, Coral) and progressively less of the later ones.

| Order | Name     | Light/Standard                  | Contrast (on dark)              |
| ----- | -------- | ------------------------------- | ------------------------------- |
| 1     | Blue     | `#181c56` `--standard-blue`     | `#6c6eb7` `--contrast-blue`     |
| 2     | Coral    | `#ff5959` `--standard-coral`    | `#ff5959` `--contrast-coral`    |
| 3     | Jungle   | `#0ea2a8` `--standard-jungle`   | `#0fc2b3` `--contrast-jungle`   |
| 4     | Azure    | `#2f98fa` `--standard-azure`    | `#64b2fb` `--contrast-azure`    |
| 5     | Peach    | `#ca825b` `--standard-peach`    | `#ffbf9e` `--contrast-peach`    |
| 6     | Lavender | `#8692ca` `--standard-lavender` | `#aeb7e2` `--contrast-lavender` |
| 7     | Lilac    | `#8e57e3` `--standard-lilac`    | `#ea8bea` `--contrast-lilac`    |
| 8     | Spring   | `#57a257` `--standard-spring`   | `#7bc00b` `--contrast-spring`   |

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

For 5+ series → continue down the ordered list.

### Weighting in a single chart

Even within one chart, use proportionally more of the early colors. In a pie chart with 3 slices, the Blue slice should be the largest if possible.

### Respect the order

Don't rearrange colors arbitrarily — the order reflects both visual weight and Entur identity priority. Starting with Spring and using Blue last would look inconsistent with Entur's palette.

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

Use `--contrast-*` variants when displaying charts on dark/Lavender 90 backgrounds. These are lighter tints of each color that maintain visibility and contrast on dark surfaces.

`data.css` auto-resolves token values to their dark color mode equivalents inside `data-color-mode="dark"`. This is color mode adaptation — it is **not** an automatic switch to `--contrast-*` variants. Use `--contrast-*` explicitly when you need the lighter tints for legibility on dark backgrounds.

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
