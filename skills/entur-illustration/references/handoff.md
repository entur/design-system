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

The design system construction in Illustrator, for people, staff, vehicles and scenes:

1. **Stroke panel:** weight 1.5 pt for contours on a 320 pt artboard (1.88 pt on a ~470 pt artboard), Cap: Round, Corner: Round, Profile: Uniform. No brush (Basic only).
2. **Effect > Distort & Transform > Roughen:** Size 0.2 %, Relative, Detail 47 /in on the ~470 pt source artboards (about 63 /in on a 320 pt artboard, an anchor every ~1.1 pt), Points: Smooth. Apply it to the strokes; fills on people stay smooth. Save it as a graphic style so every path gets the same one.
3. One path carries fill and stroke. The one to three colour fills that sit off their line are separate paths below the lines, nudged about 0.6 pt right and 0.3 pt down.
4. Keep strokes live. Do not run Expand, Expand Appearance or Outline Stroke before handing the file over; the `.ai` stays editable and the SVG export can flatten later if a consumer needs it.

For animals and objects, as in the square source file:

1. **Layers:** Circle (the backdrop), Fill (paper underlays), Blue fill (Blue 20 shading), Outline (the lines), bottom to top.
2. **Stroke panel:** 2.1 pt contours, 1.7 pt detail, 1.3 pt fine on a 320 pt artboard (5, 4 and 3 pt on 750 pt), Cap: Round, and a width profile. The three in use, as width at position along the line: `swell` 0.47 at 0 – 1 at 0.44 – 0.75 at 0.83 – 0.47 at 1 (the default); `thin` 0.27 – 1 at 0.47 – 0.27; `point` 0 – 1 at 0.5 – 0. Draw them once with the Width tool and save each with Add to Profiles in the Stroke panel, or copy a stroke from the source file.
3. **Roughen:** 0.2 % Relative, Smooth on the lines and on the underlay and shading fills; 0.5–2 % on fur, wool and spines. The backdrop is a 4-anchor circle with Roughen 0.65 %, about 61 /in on a 320 pt artboard (26 /in on 750 pt).

Brush strokes are the marketing/print style. Do not use them for design system illustrations, and keep width profiles off people, staff and vehicles.

**From the script to Illustrator:** draw with `new Drawing({ roughen: false })` so paths keep only the anchors you placed — for animals also `profiles: 'stroke'`, which keeps each swelling line as a centre-line stroke named `profile-<name>-<n>` instead of an outline. Then run the MCP tool `illustrator_import_drawing` with the SVG, an output folder and a carriers file. It opens the standard, dark and contrast SVGs, gives each named line a live width profile, applies Roughen as a live effect (0.2 % on lines, on fills too for animals, 0.65 % on the backdrop, more where a line set `roughen`), and saves `<Name>.ai` plus an Illustrator-exported SVG per mode. The carriers file is a small `.ai` with three plain strokes named `swell`, `thin` and `point`, each carrying its width profile and no effects: make it once from the source file or with the Width tool. Illustrator's scripting cannot create a width profile, so the tool copies the carrier's stroke onto each line's anchors. Without the tool, open the SVG, select all and apply the Roughen graphic style; the roles come through as plain hex swatches, so recolour per mode with Edit > Edit Colors > Recolor Artwork or save all three modes from the script.

**Driving Illustrator from an agent:** on macOS, Illustrator can be scripted without a plugin through AppleScript `do javascript`, which runs ExtendScript in the open app. `scripts/illustrator-trace.mjs` uses it to turn a PNG draft into this construction (see `raster-first.md`), and `scripts/illustrator-mcp.mjs` exposes it as MCP tools — status, running an ExtendScript snippet, tracing a draft, the finishing steps (scaling a head, smoothing a region, adding fold marks) and importing a script drawing with width profiles. Register it once per project with `claude mcp add -s local illustrator-bridge -- node <skill folder>/scripts/illustrator-mcp.mjs`; set `ILLUSTRATOR_APP` to target another Illustrator install than 2026.

## Figma

Strokes import as editable vector strokes; fills as vector fills. Layer names come from `ink.group()` names. Swelling animal lines arrive as filled outlines, like the animal components already in the Figma Illustration Library: Figma has no width profile.

With the Figma MCP server, load the `figma-use` skill and run this through `use_figma`; with figma-console, the same code goes through its execute tool:

```js
const svg = '<svg …>…</svg>'; // file contents of Fox-bus-stop.svg
const node = figma.createNodeFromSvg(svg);
node.name = 'Fox at bus stop';
node.x = figma.viewport.center.x;
node.y = figma.viewport.center.y;
figma.currentPage.selection = [node];
```

Figma has no Roughen effect, so the baked tremor in the path is what carries the hand-drawn look there. The people and transport components in the Figma Illustration Library are built exactly this way. Do not convert uniform strokes to outlines in Figma; only the swelling animal lines are outlines, because Figma cannot hold them as strokes.

## Web

- **Decorative by default.** Next to a heading and text that say the same thing (an empty state, an error page), the illustration is decoration: `alt=""`, or `aria-hidden="true"` on an inline SVG.
- **Meaningful when it carries information** the text does not: give Norwegian alt text that says what is shown, for example `alt="Rev som venter ved en bussholdeplass"`.
- **Colour modes:** serve the `-darkmode` file in dark mode and the `-contrast` file inside a `Contrast` section from `@entur/layout`. With static files, swap the `src`; with a `<picture>` element, use a `prefers-color-scheme: dark` source only if the page itself follows the system setting.
- **Size:** square motifs display between 120 and 320 px wide. Below 120 px the line work turns to noise — use an icon instead.
- **Placement:** above or beside the message, never behind text. At most three square illustrations per page view.
