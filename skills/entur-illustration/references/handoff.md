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

### Bind the colours to Illustration colors

The library components carry no hex: every fill and stroke is bound to a variable in the collection **Illustration colors**, from the library _Tokens-Illustration colors_ (collection key `39f9aa47d16a56792a17d75d8b1a3d49bee723c2`). Measured on Dog, Ducks, Doves and Sheep in the Illustration Library, November 2026. The collection has two modes, Light and Dark; there is no dark variant of a component, only the Dark mode on its frame or instance. A new motif in Figma is not done until it works the same way, so a frame switches colours like a library component.

Insert the three mode SVGs as frames, then bind each frame:

- **Which set:** the standard and the darkmode frame bind to the `…/Standard/…` variables, the contrast frame to `…/Contrast/…`.
- **Which mode:** set the darkmode frame to Dark and the other two to Light, with `frame.setExplicitVariableModeForCollection(collection, modeId)`.
- **Which variable:** match each solid paint by its hex in that frame's mode (`palette.md`):

| Colour in the SVG            | Animals and objects (`Animal/<set>/…`) | People (`People/<set>/…`)                    |
| ---------------------------- | -------------------------------------- | -------------------------------------------- |
| `ink`, stroke                | `Line/Body`                            | `Line/Default`                               |
| `ink`, fill                  | `Line/Body` (the lines are outlined)   | `Fill/Default` (hair, a uniform)             |
| `paper`                      | `Fill/Body`                            | `Fill/Skin`; clothes by hand to `Fill/Cloth` |
| `tint`                       | `Fill/BodyShadow`                      | —                                            |
| anything in the Circle group | `Fill/Circle`                          | —                                            |
| `peach`                      | `Fill/Highlight`                       | `Fill/Highlight 1`                           |
| `lavender`                   | —                                      | `Fill/Highlight 2`                           |
| `coral` (staff panels only)  | —                                      | `Fill/Highlight 3`                           |

The variables resolve to the palette's own values: `Animal/Standard/Fill/Circle` is `#EAEAF1` in Light and `#CCCDD4` at 30 % in Dark, and the alpha lives in the variable, so the bound paint itself gets opacity 1. In Dark, people's `Fill/Cloth` and `Fill/Shoe` turn Ebony 30 while `Fill/Skin` turns Ebony 5: the cloth and skin split of `palette.md`. A trace cannot tell skin from clothes, so all paper on a person starts as `Fill/Skin`; rebind the clothes by hand. Report a colour with no role (lavender on an animal, tint on a person) instead of guessing.

With the Figma MCP server, after loading `figma-use`, inside `use_figma`:

```js
// frame: one mode frame; group: 'Animal' or 'People'; set: 'Standard' or
// 'Contrast'; mode: 'Light' or 'Dark'; roleOf(hex, node, prop): the variable
// name from the table (by the hex in this frame's mode), or null.
const hex = c =>
  '#' +
  [c.r, c.g, c.b]
    .map(x =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase();
async function bind(frame, group, set, mode, roleOf) {
  const cache = {};
  const v = name =>
    cache[name] ||
    (cache[name] = figma.variables.importVariableByKeyAsync(KEYS[name]));
  const left = new Set();
  for (const node of frame.findAll(n => 'fills' in n))
    for (const prop of ['fills', 'strokes']) {
      if (!Array.isArray(node[prop])) continue;
      const next = [];
      for (const paint of node[prop]) {
        const role =
          paint.type === 'SOLID' && roleOf(hex(paint.color), node, prop);
        if (!role) {
          if (paint.type === 'SOLID') left.add(hex(paint.color));
          next.push(paint);
          continue;
        }
        const variable = await v(`${group}/${set}/${role}`);
        next.push(
          figma.variables.setBoundVariableForPaint(
            { ...paint, opacity: 1 },
            'color',
            variable,
          ),
        );
      }
      node[prop] = next;
    }
  const any = await v(
    `${group}/${set}/${group === 'Animal' ? 'Fill/Body' : 'Fill/Skin'}`,
  );
  const collection = await figma.variables.getVariableCollectionByIdAsync(
    any.variableCollectionId,
  );
  frame.setExplicitVariableModeForCollection(
    collection,
    collection.modes.find(m => m.name === mode).modeId,
  );
  return [...left];
}
```

Variable keys (the KEYS object in the snippet), for `importVariableByKeyAsync`:

| Variable                           | Key                                        |
| ---------------------------------- | ------------------------------------------ |
| `Animal/Standard/Line/Body`        | `c4a3807746623384338234bebb55158d26254a9d` |
| `Animal/Standard/Fill/Body`        | `86ea167577c9d57b36ddf8864a05713d13853766` |
| `Animal/Standard/Fill/BodyShadow`  | `fdcb539b577d320c90b770d52a47e880a99a0207` |
| `Animal/Standard/Fill/Circle`      | `cb61bb02ccb4114070b6fc9bae018ea0baa9aca4` |
| `Animal/Standard/Fill/Highlight`   | `c33b7e2226821c5f9e051ecfced183fb0cd6d9a4` |
| `Animal/Contrast/Line/Body`        | `19256c8d16feaa57cdd7275bfb31041b82b8d281` |
| `Animal/Contrast/Fill/Body`        | `2b4ac057bb2a0926839cf3a83f2e78566a2f8fef` |
| `Animal/Contrast/Fill/BodyShadow`  | `5979d4ddce9a996d395bd5bb3bba3e12025dc8d5` |
| `Animal/Contrast/Fill/Circle`      | `6466b65d71ed0e209f51bebcf04ac3b21b68740a` |
| `Animal/Contrast/Fill/Highlight`   | `3ca2026fcd0f6d69c337608f97ff3c164d204de3` |
| `People/Standard/Line/Default`     | `191e2d6aa67d3210f825d79a58e3a9ad0b98df54` |
| `People/Standard/Fill/Default`     | `3d6e2615479d714ec058eae3ba2e4ab87835f68f` |
| `People/Standard/Fill/Skin`        | `98b0fc4b0699fad3bf56cacc5366fc2f2031d361` |
| `People/Standard/Fill/Highlight 1` | `fa2fef38c1fc97bb04dde3a9dd8cbe37d7f83f18` |
| `People/Standard/Fill/Highlight 2` | `855806aab5ac92ca907feb6ee60e673b6de4ef06` |
| `People/Standard/Fill/Highlight 3` | `e6d4ef9ade0472110b9d84a259e5ee08e016ea66` |
| `People/Contrast/Line/Default`     | `d76a431b54f0acf20903a67ccbf4d01f1f18d04a` |
| `People/Contrast/Fill/Default`     | `623a7dedbb47ce44b7f26940f359ad583cde6c03` |
| `People/Contrast/Fill/Skin`        | `786a109a0f749d6d2b9363f1b2e0a805305c332b` |
| `People/Contrast/Fill/Highlight 1` | `de64f4e7666bdcb18c130786f6eb0b4c3f3cd971` |
| `People/Contrast/Fill/Highlight 2` | `9d2142dc548e4b3041701bc87af60ecca1190f2b` |
| `People/Contrast/Fill/Highlight 3` | `a604c2de4bf3ae53750f44f84ad785ee4940d136` |

`Fill/Cloth`, `Fill/Shoe` and the rest of the People set (`Line/Subdued` and the Light, Mask, Reflex and Brakelight variables) are in the same collection; look a key up with `search_design_system` or on a library component when a motif needs one. Check the result: switch the standard frame to Dark and every colour should change, and the list of colours left over should be empty. The Figma illustration plugin (`tools/figma-illustrasjon/code.js`, `bindColours`, on its own branch `figma-illustrasjon-plugin`) does the same when it places a traced motif.

## Web

- **Decorative by default.** Next to a heading and text that say the same thing (an empty state, an error page), the illustration is decoration: `alt=""`, or `aria-hidden="true"` on an inline SVG.
- **Meaningful when it carries information** the text does not: give Norwegian alt text that says what is shown, for example `alt="Rev som venter ved en bussholdeplass"`.
- **Colour modes:** serve the `-darkmode` file in dark mode and the `-contrast` file inside a `Contrast` section from `@entur/layout`. With static files, swap the `src`; with a `<picture>` element, use a `prefers-color-scheme: dark` source only if the page itself follows the system setting.
- **Size:** square motifs display between 120 and 320 px wide. Below 120 px the line work turns to noise — use an icon instead.
- **Placement:** above or beside the message, never behind text. At most three square illustrations per page view.
