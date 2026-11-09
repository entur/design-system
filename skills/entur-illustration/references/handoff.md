# Handoff: Illustrator, Figma and web

## Files and naming

Follow the library layout so a new motif can be dropped next to the existing ones:

```
<Category>/<Motif>/SVG/<Motif>.svg
<Category>/<Motif>/SVG/<Motif>-darkmode.svg
<Category>/<Motif>/SVG/<Motif>-contrast.svg
<Category>/<Motif>/SVG/<Motif>-background.svg            (square motifs with the backdrop disc)
<Category>/<Motif>/SVG/<Motif>-background-darkmode.svg
<Category>/<Motif>/SVG/<Motif>-background-contrast.svg
```

The library also ships PNG and PDF for square motifs (PNG at 4×, 1280 × 1280) and PNG only for landscapes (7680 × 2160). Motif names are English, title case, describing what is shown: `Fox at bus stop`, `Woman walking with luggage`.

`ink.save(dir, name)` writes the three mode files. For the with/without-backdrop pair, draw twice from the same script, toggling the `ink.backdrop()` call, and save the second under `<Motif>-background`.

## Illustrator

The design system construction in Illustrator:

1. **Stroke panel:** weight 1.5 pt for contours on a 320 pt artboard (1.88 pt on a ~470 pt artboard), Cap: Round, Corner: Round, Profile: Uniform. No brush (Basic only).
2. **Effect > Distort & Transform > Roughen:** Size 0.2 %, Relative, Detail 47 /in on the ~470 pt source artboards (about 63 /in on a 320 pt artboard, an anchor every ~1.1 pt), Points: Smooth. Apply to strokes and to the colour fills. Save it as a graphic style so every path gets the same one.
3. Colour fills are separate paths below the lines, nudged about 1 pt right and 0.5 pt down.
4. Keep strokes live. Do not run Expand, Expand Appearance or Outline Stroke before handing the file over; the `.ai` stays editable and the SVG export can flatten later if a consumer needs it.

Brush strokes and width profiles (Width Profile 1 and the like) are the marketing/print style. Do not use them for design system illustrations.

**From the script to Illustrator:** draw with `new Drawing({ roughen: false })` so paths keep only the anchors you placed, open the SVG in Illustrator, select all and apply the Roughen graphic style. The roles come through as plain hex swatches; recolour per mode with Edit > Edit Colors > Recolor Artwork if needed, or save all three modes from the script.

**Driving Illustrator from an agent:** on macOS, Illustrator can be scripted without a plugin through AppleScript `do javascript`, which runs ExtendScript in the open app. `scripts/illustrator-trace.mjs` uses it to turn a PNG draft into this construction (see `raster-first.md`), and `scripts/illustrator-mcp.mjs` exposes it as MCP tools — status, running an ExtendScript snippet, tracing a draft, and the finishing steps: scaling a head, smoothing a region, adding fold marks. Register it once per project with `claude mcp add -s local illustrator-bridge -- node <skill folder>/scripts/illustrator-mcp.mjs`; set `ILLUSTRATOR_APP` to target another Illustrator install than 2026.

## Figma

Strokes import as editable vector strokes; fills as vector fills. Layer names come from `ink.group()` names.

With the Figma MCP server, load the `figma-use` skill and run this through `use_figma`; with figma-console, the same code goes through its execute tool:

```js
const svg = '<svg …>…</svg>'; // file contents of Fox-bus-stop.svg
const node = figma.createNodeFromSvg(svg);
node.name = 'Fox at bus stop';
node.x = figma.viewport.center.x;
node.y = figma.viewport.center.y;
figma.currentPage.selection = [node];
```

Figma has no Roughen effect, so the baked tremor in the path is what carries the hand-drawn look there. The people and transport components in the Figma Illustration Library are built exactly this way. Do not convert strokes to outlines in Figma either; the outlined animal and object components are older imports, not the model.

## Web

- **Decorative by default.** Next to a heading and text that say the same thing (an empty state, an error page), the illustration is decoration: `alt=""`, or `aria-hidden="true"` on an inline SVG.
- **Meaningful when it carries information** the text does not: give Norwegian alt text that says what is shown, for example `alt="Rev som venter ved en bussholdeplass"`.
- **Colour modes:** serve the `-darkmode` file in dark mode and the `-contrast` file inside a `Contrast` section from `@entur/layout`. With static files, swap the `src`; with a `<picture>` element, use a `prefers-color-scheme: dark` source only if the page itself follows the system setting.
- **Size:** square motifs display between 120 and 320 px wide. Below 120 px the line work turns to noise — use an icon instead.
- **Placement:** above or beside the message, never behind text. At most three square illustrations per page view.
