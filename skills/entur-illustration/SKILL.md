---
name: entur-illustration
description: Draw new illustrations in the Entur Linje illustration style — plain hand-drawn strokes with round caps and a Roughen tremor, flat Linje colours, a grainy backdrop disc — as editable SVG strokes for web, Figma or Illustrator. Use when the user wants a new Entur illustration, an empty-state, error, onboarding or info-message illustration, a spot illustration of a person, animal, object, vehicle or scene "in Entur's style", or wants to extend or pick from the Linje illustration library. Trigger even if the user only says "tegn en illustrasjon" or "lag en illustrasjon til tom-tilstand" in an Entur context.
---

> **Audience:** AI coding agents. Entur employees should visit [linje.entur.no/identitet/verktoykassen/illustrasjoner](https://linje.entur.no/identitet/verktoykassen/illustrasjoner).

> **Resolving `references/` and `scripts/` paths:** if you are reading this over HTTP rather than from an installed skill folder, resolve them against `https://raw.githubusercontent.com/entur/design-system/main/skills/entur-illustration/`.

# Entur Illustration

Entur's illustration library (made with SDG) shows everyday meetings in Norwegian public transport, set in Norwegian nature and towns. Its job is to soften and humanise digital surfaces. This skill draws **new** motifs that sit next to the library without anyone noticing a seam.

Everything here is measured, not guessed: colours and proportions from the 410 exported library SVGs, line construction from the raw Illustrator `.ai` source files and the live strokes in the Figma Illustration Library.

## Design system style, not marketing style

The source files contain two line styles. Use only the first:

| Design system (this skill)                                             | Marketing / print — do **not** use here                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| Plain stroke, one uniform width per line                               | Brush strokes (calligraphic, art brush)                 |
| Round caps, round joins                                                | Width profiles: thin–thick–thin tapered lines           |
| Effect > Roughen: size 0.2 % relative, smooth, an anchor every ~1 unit | Roughen on top of brush strokes                         |
| Lines stay live strokes — never outlined or expanded                   | Outlined/expanded art, as in the flattened library SVGs |

The library SVGs on the web are flattened exports: every stroke has been expanded into a filled outline. So are the animal and object components in the Figma Illustration Library. Its people and transport components still have live strokes, and they are the construction to copy. Draw strokes.

## Step 1 — reuse before you draw

A library motif is always more on-brand than a new one. Check first:

- Browse: https://linje.entur.no/identitet/verktoykassen/illustrasjoner
- Files (in the design-system repo): `apps/documentation/src/downloads/illustrations/<Category>/<Motif>/SVG/`, named `<Motif>.svg`, `<Motif>-darkmode.svg`, `<Motif>-contrast.svg`, plus `-background` variants for motifs with a backdrop disc
- Categories: People, Entur staff, Animals, Objects, Concepts, Hands, Devices, Transport, Travel (lost property), Scenario, landscape

Status messages already have assigned motifs — use these, do not draw new ones:

| Situation                        | Motif          |
| -------------------------------- | -------------- |
| No results / system error        | Sheep          |
| Page not found (404) / no access | Musk (muskox)  |
| No network                       | Beaver         |
| Login and profile                | Squirrel       |
| Session expired                  | Hedgehog       |
| Missing content                  | Leaves, Rabbit |
| Payment in progress              | Ducks          |
| Looking for a seat               | Doves          |
| Processing refund                | Goat           |
| Privacy and cookies              | Kitty, Mouse   |

Draw new only when nothing fits. New motifs meant for the shared library should be reviewed by the design system team in `#talk-designsystem`.

## Step 2 — pick the format

| Format    | Canvas            | Use                                                   | Backdrop disc      |
| --------- | ----------------- | ----------------------------------------------------- | ------------------ |
| Square    | 320 × 320         | Info pages, modals, info/error messages, empty states | Optional (variant) |
| Scene     | 356 × 291         | A person in a place (city, station), richer context   | No                 |
| Landscape | 1280 × 360 (32:9) | Full-width hero on landing pages; crop for two-column | No                 |

Rules of use: at most **three** square illustrations per page view; more than one goes in a multi-column grid. Keep illustrations out of dense data views.

## Step 3 — the non-negotiables

**Line**

1. Every line is a live stroke: uniform width, `stroke-linecap: round`, `stroke-linejoin: round`. Weights on these canvases: contour 1.5, interior detail 1.0, fine 0.85.
2. Lines carry the Roughen tremor (size 0.2 % of the object, relative; an anchor about every 1 unit on these canvases; smooth). It is a quiet wobble, not a sketchy scribble.
3. Contours are often left open — a short gap where a line would close — and interior lines (folds, creases, the split between two legs) float inside the shape without touching the contour.
4. Main lines are ink (Lavender 90). Background and distant elements use the secondary line colour (Blue 50), thinner, with no fill or the palest fill.

**Fill**

5. Flat colour only. No gradients, no drop shadows, no textures except the backdrop's grain. The one effect in the library is the dark-mode glow on reflectors (`references/style.md` §7).
6. Fills sit under the strokes, with the same Roughen edge, shifted about 1 unit off the line in one consistent direction for the whole drawing, so a sliver of paper shows on one side.
7. White is the main fill, but pick its role by what the area is: `paper` for skin, faces, animals and objects; `cloth` for what people wear and carry (coats, bags, a bike frame); `vehicle` for bus, train and boat bodies. All three are white in standard mode. In dark mode `cloth` and `vehicle` turn grey; in contrast mode only `cloth` changes (to pale blue) and vehicle bodies stay white. That way a face still separates from a coat. Skin is never tinted. Hair and deep shadow shapes are ink fills with no outline.
8. Colour is rationed: one warm Peach 40 element per motif (a sign, a pin, trousers, a scarf); Lavender 40 for secondary clothing; Coral 40 only as a small detail (a rail line, a dotted path). The one exception is Entur staff, whose ink uniform has Coral shoulder and sleeve panels.

**Composition**

9. One clear subject, large, centred on the optical axis, standing on broken horizontal ground lines that run past it.
10. Square motifs: the grainy Blue 20 backdrop disc sits behind the subject's upper body, about 60–65 % of the canvas wide; the subject breaks out of it.
11. Generous empty space. The illustration supports a message — it never competes with it.

The full anatomy, with measurements and per-format layout, is in `references/style.md`. The colour roles and how they map per mode are in `references/palette.md`.

## Step 4 — draw with the script

`scripts/linje-ink.mjs` (Node 18+, no dependencies) turns anchor points into this construction: Bézier strokes with baked Roughen, offset rough-edged fills, the grainy backdrop, ground lines, and all three colour modes from one drawing. Start from `scripts/example.mjs`.

```js
import { Drawing, WEIGHTS, circle, rect } from './linje-ink.mjs';

const ink = new Drawing({
  format: 'square',
  seed: 7,
  title: 'Fjellrev ved holdeplassen',
});
ink.backdrop({ cx: 166, cy: 150, r: 104 }); // grainy Blue 20 disc
ink.group('bus-stop', d => {
  d.line([
    [232, 266],
    [231, 180],
    [232, 110],
  ]); // open stroke, contour weight
  d.shape(rect(204, 64, 58, 46), { fill: 'peach', corners: true }); // the one Peach element
});
ink.group('fox', d => {
  d.shape(bodyPoints, { fill: 'paper', gap: 2 }); // fill under stroke, contour left open
  d.line(foldPoints, { width: WEIGHTS.detail }); // interior line, floats inside
  d.dot(194, 147, 2.6); // nose
});
ink.ground({ y: 266, x1: 30, x2: 296 });
ink.save('out', 'Fox-bus-stop'); // standard, -darkmode, -contrast + preview.html
```

| Call                                                                  | Draws                                                                       |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `new Drawing({ format, seed, title, misregister, roughen })`          | Canvas. `roughen: false` gives clean anchors for finishing in Illustrator   |
| `ink.shape(points, { fill, stroke, width, gap, corners })`            | Fill under a stroke. `gap` opens the contour; `corners` keeps sharp corners |
| `ink.line(points, { role, width, corners, dash })`                    | Open stroke — the main tool                                                 |
| `ink.fill(points, { role })`                                          | Fill without line: hair, shadow shapes, colour blocks                       |
| `ink.dot(x, y, r)`                                                    | Eye, nostril, button, wheel hub                                             |
| `ink.backdrop({ cx, cy, r })`                                         | Grainy backdrop disc                                                        |
| `ink.ground({ y, x1, x2, rows })`                                     | Broken ground lines (ink, then a Blue 50 row)                               |
| `ink.marks(...)`, `ink.hatch(...)`, `ink.cloud(...)`, `ink.text(...)` | Attention marks, short shading strokes, scalloped cloud, sign lettering     |
| `ink.group(name, fn)`                                                 | Named layer — becomes the layer name in Illustrator and Figma               |
| `ink.save(dir, name)`                                                 | Writes the three mode files with library naming, plus a preview page        |

Points are anchor points, not samples: 6–12 per contour, as a designer would click them. `circle`, `ellipse`, `arc` and `rect` return anchor lists. Colours are **roles** (`ink`, `paper`, `cloth`, `vehicle`, `line2`, `backdrop`, `tint`, `lavender`, `mid`, `peach`, `coral`, `glow`), never hex — that is what makes the dark and contrast modes come out right.

Draw back to front: backdrop → background (Blue 50 lines) → props behind → subject → things in front of the subject → ground.

## Step 5 — look at it

Render to PNG and compare it side by side, at the same size, with one or two library motifs of the same category. On macOS: `qlmanage -t -s 900 -o <dir> <file>.svg`. Or open the generated `<name>-preview.html`, which shows each mode on its intended surface.

Check before delivering:

- [ ] Every line is a stroke with round caps; nothing outlined, no brush or width profile
- [ ] Line weights follow the hierarchy (contour > detail > fine); background lines are Blue 50
- [ ] Paper dominates; one Peach accent; Coral absent or tiny
- [ ] Fills are flat, sit under the lines and are offset in one direction
- [ ] At least one contour is left open; interior lines float
- [ ] Subject reads at 120 px wide (squint test)
- [ ] Dark and contrast files checked on Ebony 100 and Lavender 90 surfaces
- [ ] Layers named; file names follow `<Name>.svg`, `<Name>-darkmode.svg`, `<Name>-contrast.svg`

## Step 6 — deliver

- **Web:** inline the SVG or use it as an image. Most illustrations next to explanatory text are decorative: `alt=""`. Give alt text in Norwegian only when the image carries meaning the text does not. Swap to the `-darkmode` file in dark mode and the `-contrast` file inside a Lavender 90 contrast section.
- **Figma:** `figma.createNodeFromSvg(svgString)` via the Figma MCP `use_figma` tool (load the `figma-use` skill first) or figma-console's execute tool. Strokes arrive as editable vector strokes.
- **Illustrator:** draw with `roughen: false`, open the SVG, select all strokes and apply the Roughen graphic style. Exact settings in `references/handoff.md`.

## Reference files

- **`references/style.md`** — full anatomy: line and fill construction with measured values, the backdrop, ground, per-format composition (square, scene, landscape), motif vocabulary, drawing people, animals and vehicles, what to avoid
- **`references/palette.md`** — colour roles with hex values and primitive token names, the standard → dark → contrast mapping, colour proportions
- **`references/handoff.md`** — Illustrator graphic style and export, Figma import, web use and accessibility, file naming
