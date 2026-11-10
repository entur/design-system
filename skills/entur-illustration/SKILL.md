---
name: entur-illustration
description: Draw new illustrations in the Entur Linje illustration style — hand-drawn strokes with round caps and a Roughen tremor (uniform on people and vehicles, swelling on animals and objects), flat Linje colours, a grainy backdrop disc — as editable SVG strokes for web, Figma or Illustrator, with people and animals going through a PNG draft from an image model first. Use when the user wants a new Entur illustration, an empty-state, error, onboarding or info-message illustration, a spot illustration of a person, animal, object, vehicle or scene "in Entur's style", or wants to extend or pick from the Linje illustration library. Trigger even if the user only says "tegn en illustrasjon" or "lag en illustrasjon til tom-tilstand" in an Entur context.
---

> **Audience:** AI coding agents. Entur employees should visit [linje.entur.no/identitet/verktoykassen/illustrasjoner](https://linje.entur.no/identitet/verktoykassen/illustrasjoner).

> **Resolving `references/` and `scripts/` paths:** if you are reading this over HTTP rather than from an installed skill folder, resolve them against `https://raw.githubusercontent.com/entur/design-system/main/skills/entur-illustration/`.

# Entur Illustration

Entur's illustration library (made with SDG) shows everyday meetings in Norwegian public transport, set in Norwegian nature and towns. Its job is to soften and humanise digital surfaces. This skill draws **new** motifs that sit next to the library without anyone noticing a seam.

Everything here is measured, not guessed: colours and proportions from the 410 exported library SVGs, line construction from the raw Illustrator `.ai` source files and the live strokes in the Figma Illustration Library.

## Two constructions, and what is not the design system

The design system's source files build lines in two ways, by subject. Marketing and print use a third style that is not used here.

|                     | **People** — people, Entur staff, vehicles, scenes, landscapes | **Animals** — animals and objects (the square status motifs) | Marketing / print — do **not** use      |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| Line                | Live stroke, one uniform width                                 | Live stroke with a width profile: swells in the middle       | Brush strokes (calligraphic, art brush) |
| Weights on 320      | 1.5 contour, 1.0 detail, 0.85 fine                             | 2.1 contour, 1.7 detail, 1.3 fine, at the widest point       | —                                       |
| Contour             | One stroke per part, often left open                           | Several short strokes that overlap                           | —                                       |
| Roughen             | 0.2 % relative on the lines                                    | 0.2 % on lines and fills; 0.5–2 % on fur, wool and spines    | Roughen on top of brush strokes         |
| Fills               | On the line's own path, smooth edge                            | Separate shapes under the lines                              | —                                       |
| In the working file | Live strokes, never outlined or expanded                       | Live strokes, never outlined or expanded                     | —                                       |

On people, only the small fold and sheen marks inside clothing taper (rule 12); their contours never do. On animals, nearly every line swells.

The library SVGs on the web are flattened exports: every stroke has been expanded into a filled outline. In the Figma Illustration Library the people and transport components still have live strokes; the animal and object components are outlined, because a width profile cannot be a Figma or SVG stroke. Their construction was measured in the raw Illustrator source of the square motifs instead.

## The process — run all of it, every time

Every new illustration goes through the same steps, and you run all of them without being asked. The user should get a finished, checked illustration, not a first draft to find faults in.

1. **Reuse** a library motif if one fits (Step 1).
2. **Pick** the format (Step 2) and the route by subject (Step 4): people and animals go raster first; objects, vehicles, signs and landscapes go through the script.
3. **Draft** (raster first): two to four library PNGs of the same kind as references, the prompt template, Nano Banana 2.1 in [Weave](https://app.weavy.ai/) at 2K, square (`references/raster-first.md`).
4. **Review the draft yourself** against the references and the checklist in `references/raster-first.md` §3. List every deviation and fix it with an edit round, up to two, before going on.
5. **Trace** in Illustrator with the mode for the subject, then the finishing steps (Step 4b).
6. **Check the result** next to two library motifs of the same kind at the same size, in all three colour modes, against the Step 5 checklist. Fix what fails and check again.
7. **Show** the result with that comparison, and say what is left or unverified.

The only stops are the approval each image-model run needs (Weave asks per run: tell the user the whole plan once — one generation plus up to two edit rounds, about 10 Weave credits each — then ask for each run) and the plan before drawing from a reference image.

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

1. Every line is a live stroke with `stroke-linecap: round` and `stroke-linejoin: round`. On people, vehicles and scenes the width is uniform: contour 1.5, interior detail 1.0, fine 0.85. Animals and objects swell instead (rule 15).
2. Lines carry the Roughen tremor (size 0.2 % of the object, relative; an anchor about every 1 unit on these canvases; smooth). It is a quiet wobble, not a sketchy scribble. Fur, wool and spines on animals take more (rule 16).
3. Contours are often left open — a short gap where a line would close — and interior lines (folds, creases, the split between two legs) float inside the shape without touching the contour.
4. Main lines are ink (Lavender 90). Background and distant elements use the secondary line colour (Blue 50), thinner, with no fill or the palest fill.

**Fill**

5. Flat colour only. No gradients, no drop shadows, no textures except the backdrop's grain. The one effect in the library is the dark-mode glow on reflectors (`references/style.md` §7).
6. On people, most fills sit exactly under their line — in Illustrator one path carries both fill and stroke — with a smooth edge. One to three colour fills per figure are shifted 0.5–0.7 off their line, all in one direction, and two or three paper-white strokes just inside an edge give the same hand-printed look. People's fill edges are never roughened. Animals and objects build fills differently (rule 16).
7. White is the main fill, but pick its role by what the area is: `paper` for skin, faces, animals and objects; `cloth` for what people wear and carry (coats, bags, a bike frame); `vehicle` for bus, train and boat bodies. All three are white in standard mode. In dark mode `cloth` and `vehicle` turn grey; in contrast mode only `cloth` changes (to pale blue) and vehicle bodies stay white. That way a face still separates from a coat. Skin is never tinted. Hair and deep shadow shapes are ink fills with no outline.
8. Colour is rationed: one warm Peach 40 element per motif (a sign, a pin, trousers, a scarf); Lavender 40 for secondary clothing; Coral 40 only as a small detail (a rail line, a dotted path). The one exception is Entur staff, whose ink uniform has Coral shoulder and sleeve panels. **Every animal has its Peach too** (rule 19).

**Composition**

9. One clear subject, large, centred on the optical axis, standing on broken horizontal ground lines that run past it.
10. Square motifs: the Blue 20 backdrop disc is 62 % of the canvas wide and centred on it, a plain circle whose ragged edge comes from a coarser Roughen (0.65 %). The subject sits over it and breaks out of it.
11. Generous empty space. The illustration supports a message — it never competes with it.

**People**

12. People are drawn naturally and figuratively, like observed drawing — not the flat, childlike "corporate" style. Real proportions (about 7–7.5 heads tall, a small head), a relaxed pose with weight on one leg or a slight turn, loose clothes that drape, with **2–5 fold marks** per figure, hands with fingers, shoes with a sole. Check the head against a library person: generated drafts tend to make it about 10 % too big. Contours are organic and asymmetric; a torso is never a rectangle and a hand never a mitten.
13. **No eyes, no mouth.** A face carries only a nose — a nose line in profile, a small nose stroke from the front — and glasses if the person wears them. Never eye dots, eye arcs, pupils or a mouth line. Animals keep their eyes.
14. **Hair and accessories are simple shapes.** Hair is one smooth ink-filled shape of about 16–24 anchors, no outline. A headset is one band and one earcup, glasses one frame, a strap one band — never a part drawn twice.

**Animals and objects**

15. **Lines swell.** Each stroke has a width profile: widest near the middle and about half as wide at the ends (the most used profile runs 0.47 – 1 – 0.75 – 0.47). Spines, whiskers and short marks taper to a point. Weights at the widest point: contour 2.1, detail 1.7, fine 1.3. A contour is two to four long strokes with a gap or a short overlap between them: not one closed path, and not a row of short fragments.
16. **Fills sit apart, and fur is rougher.** Paper underlay shapes go under the lines, one per body part, with one or two Blue 20 (`tint`) shading shapes (a far body, a wing, the shadow side) and small ink fills for eyes, noses and hooves. Fills carry the same 0.2 % Roughen as the lines. Fur, wool and spines get a coarser Roughen, 0.5–2 %, and so does a Peach marking on the body (1.5 %).
17. **Animals keep their eyes** — a dot or a short arc — and stay calm and a little dry, never cartoonish.
18. **Minimal line.** Library animals have less line than a sketch: long smooth contours with a few gaps, and detail only where it says what the animal is (the hedgehog's spines, the goat's beard, wool as a scalloped edge). No fur ticks along a contour and no clusters of short fur marks; one line for a fold (the neck, a shoulder) says it instead. An ear gets at most one inner line. A sitting bear cub on the 320 canvas has about 50 strokes, toes, grass and ground included; its raw trace had 80.
19. **One Peach accent.** Every library animal has one small Peach 40 area, about 1 % of the canvas (0.2–4 %): on a prop it holds, wears or has beside it (a collar, a ball, a nut, a key, a ticket, a bowl, a leaf) or on one marking of its own (horns, a chest patch). Never the body fill, never spread over several places; a tiny echo, like crumbs beside a bowl, is the most. A prop keeps its ink outline with the Peach shifted off it; a marking has no outline and a rough edge.

The full anatomy, with measurements and per-format layout, is in `references/style.md`. The colour roles and how they map per mode are in `references/palette.md`.

## Step 4 — pick a route

| Route                  | Use for                                                                    | How                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **A. Vector directly** | Objects, vehicles, signs, landscapes, simple props                         | Draw strokes with the script (Step 4a), with `construction: 'animals'` for objects. Exact, no credits   |
| **B. Raster first**    | People, animals, and scenes with them; any time a natural figure is needed | Generate a PNG with an image model, the library as style reference, then turn it into strokes (Step 4b) |

Natural, figurative people and animals do not survive being placed anchor by anchor from coordinates: they come out stiff, simplified and geometric, like gingerbread figures, and lose the observed detail of the library animals (a chest ruff, the turn of a paw, a tail that lies in front of the body). That is why people and animals go through route B.

## Step 4a — route A: draw with the script

`scripts/linje-ink.mjs` (Node 18+, no dependencies) turns anchor points into either construction: Bézier strokes with baked Roughen, swelling lines for animals, fills, the backdrop, ground lines, and all three colour modes from one drawing. Start from `scripts/example.mjs`: it shows the animal construction on a deliberately simple fox, not the form to aim for — a real animal goes through route B. Drawing from a photo or a picture the user sent? Read **Working from a reference image** below first.

```js
import { Drawing, circle, rect } from './linje-ink.mjs';

const ink = new Drawing({
  format: 'square',
  seed: 7,
  title: 'Fjellrev ved holdeplassen',
  construction: 'animals', // swelling lines; 'people' (default) for uniform
});
const W = ink.weights; // contour, detail, fine for this construction
ink.backdrop(); // Blue 20 disc, 62 % of the canvas, centred
ink.group('bus-stop', d => {
  d.line([
    [232, 266],
    [231, 180],
    [232, 110],
  ]); // open stroke, contour weight
  d.shape(rect(204, 64, 58, 46), { fill: 'peach', corners: true }); // the one Peach element
});
ink.group('fox', d => {
  d.shape(bodyPoints, { fill: 'paper', gap: 2 }); // fill under a few overlapping strokes, contour left open
  d.line(foldPoints, { width: W.detail }); // interior line, floats inside
  d.line(furPoints, { width: W.fine, profile: 'point', roughen: 1 }); // pointed fur mark
  d.dot(194, 147, 2.6); // nose
});
ink.ground({ y: 266, x1: 30, x2: 296 });
ink.save('out', 'Fox-bus-stop'); // standard, -darkmode, -contrast + preview.html
```

| Call                                                                                              | Draws                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new Drawing({ format, seed, title, construction, misregister, roughen, profiles })`              | Canvas. `construction: 'animals'` for animals and objects. `roughen: false` gives clean anchors and `profiles: 'stroke'` keeps swelling lines as named centre-line strokes, both for finishing in Illustrator. `ink.weights` holds the construction's weights |
| `ink.shape(points, { fill, stroke, width, gap, corners, misregister, profile, pieces, roughen })` | Fill under a stroke. `gap` opens the contour; `corners` keeps sharp corners; `misregister` shifts this colour fill off its line (one to three shapes per figure); `pieces` is how many overlapping strokes draw an animal contour (default 3)                 |
| `ink.line(points, { role, width, corners, dash, profile, roughen })`                              | Open stroke — the main tool. `profile`: `'swell'` (animal default), `'thin'`, `'point'` or null for uniform; `roughen`: Roughen size in % for this line                                                                                                       |
| `ink.fill(points, { role })`                                                                      | Fill without line: hair, shadow shapes, colour blocks                                                                                                                                                                                                         |
| `ink.dot(x, y, r)`                                                                                | Animal eye, nostril, button, wheel hub (people have no eyes or mouth)                                                                                                                                                                                         |
| `ink.backdrop({ cx, cy, r })`                                                                     | Backdrop disc; defaults to the library's: centred, 62 % of the canvas                                                                                                                                                                                         |
| `ink.ground({ y, x1, x2, rows })`                                                                 | Broken ground lines (ink, then a Blue 50 row)                                                                                                                                                                                                                 |
| `ink.marks(...)`, `ink.hatch(...)`, `ink.cloud(...)`, `ink.text(...)`                             | Attention marks, short shading strokes, scalloped cloud, sign lettering                                                                                                                                                                                       |
| `ink.group(name, fn)`                                                                             | Named layer — becomes the layer name in Illustrator and Figma                                                                                                                                                                                                 |
| `ink.save(dir, name)`                                                                             | Writes the three mode files with library naming, plus a preview page                                                                                                                                                                                          |

Points are anchor points, not samples: 6–12 per contour, as a designer would click them. A line with a width profile cannot be an SVG stroke, so the web SVG gets it as a filled outline, as in the library's own exports. `circle`, `ellipse`, `arc` and `rect` return anchor lists. Colours are **roles** (`ink`, `paper`, `cloth`, `vehicle`, `line2`, `backdrop`, `tint`, `lavender`, `mid`, `peach`, `coral`, `glow`), never hex — that is what makes the dark and contrast modes come out right.

Draw back to front: backdrop → background (Blue 50 lines) → props behind → subject → things in front of the subject → ground.

## Step 4b — route B: raster first

1. **References:** two to four library PNGs of the same kind as style references (for people: Woman holding package, Man checking the time, the Entur staff figures; for animals: Dog, Rabbit, Squirrel, Sheep). The user's own photo may go in for pose; a stock illustration never goes in as an image, only as a description.
2. **Generate** a square PNG with **Nano Banana 2.1 in [Weave](https://app.weavy.ai/)**, the library PNGs as reference images, at 2K. Fall back to Figma `generate_image` (prompt only) when Weave is unavailable or its free runs are used up. Use the prompt template in `references/raster-first.md`; it spells out every rule, including **no eyes, no mouth** on people and natural anatomy on animals. Runs cost the user's credits: quote the cost and get approval each time.
3. **Review it yourself before the user sees it**, against the Step 5 checklist and the references. Fix every deviation with an edit round: send the draft back as the first image and ask for only the changes, so what already works stays. Never edit pixels.
4. **Turn it into strokes:** on macOS with Illustrator open, `node scripts/illustrator-trace.mjs <draft.png> --out <dir> --name <Name>` traces it into live round-capped strokes (a quarter at contour weight, the rest detail weight) and smooth palette fills, and writes the `.ai` and the three SVG modes (also available as MCP tools through `scripts/illustrator-mcp.mjs`). For an animal or object add `--construction animals --carriers <profiles.ai> --backdrop --underlay`: swelling lines at 2.1 / 1.7, fewer fur marks (rule 18), the library's backdrop circle and one paper underlay under the whole animal (`references/raster-first.md`). Then finish it: simplify doubled accessories, scale the head with `illustrator_scale_head`, smooth the hair with `illustrator_smooth_region`, and add 2–5 fold marks with `illustrator_add_details` (`references/raster-first.md`). Without Illustrator, redraw the centre lines in code over `scripts/grid.mjs`. The PNG alone is a draft, never the final asset.

## Step 5 — look at it

Do this yourself before showing anything. Render to PNG and compare it side by side, at the same size, with one or two library motifs of the same category, and show the user that comparison with the result. On macOS: `qlmanage -t -s 900 -o <dir> <file>.svg`. Or open the generated `<name>-preview.html`, which shows each mode on its intended surface.

Check before delivering:

- [ ] Every line is a stroke with round caps and no brush; nothing outlined in the working file
- [ ] The construction fits the subject: uniform lines on people, staff and vehicles; swelling lines (width profile) on animals and objects
- [ ] Line weights follow the hierarchy (contour > detail > fine); background lines are Blue 50
- [ ] Paper dominates; one Peach accent, on animals too (a prop or one marking, about 1 % of the canvas); Coral absent or tiny
- [ ] Fills are flat with smooth edges; most sit exactly under their line, one to three colour fills are offset 0.5–0.7
- [ ] At least one contour is left open; interior lines float
- [ ] Subject reads at 120 px wide (squint test)
- [ ] Subject as large in the frame as the library motifs next to it (square animals fill about 60–75 % of the height); props at least 16 units from the edge
- [ ] People: natural proportions and pose, hands with fingers, only a nose on the face (no eyes, no mouth); side by side with a library person, the head is not bigger and the body not blockier
- [ ] Clothes carry 2–5 tapered fold marks, not more
- [ ] Hair is one smooth shape; headset, glasses and straps are single shapes, nothing doubled
- [ ] Props are simplified: a table has four legs or none, and nothing crosses a person's legs
- [ ] Line weight hierarchy on people: about a quarter of the lines (the long outer contours) at 1.5, the rest at 1.0; an all-1.5 figure looks coarse next to library people
- [ ] Animals and objects: contours as a few long swelling strokes at 2.1, details at 1.7–1.3, paper underlays and at most two Blue 20 shading shapes, eyes kept; side by side with the library sheep or hedgehog, the lines are as heavy
- [ ] Animals: no more line than the library animal next to it — no fur ticks along the contours, no cluster of fur marks on the chest or neck, at most one inner line per ear
- [ ] Dark and contrast files checked on Ebony 100 and Lavender 90 surfaces
- [ ] Layers named; file names follow `<Name>.svg`, `<Name>-darkmode.svg`, `<Name>-contrast.svg`

## Step 6 — deliver

- **Web:** inline the SVG or use it as an image. Most illustrations next to explanatory text are decorative: `alt=""`. Give alt text in Norwegian only when the image carries meaning the text does not. Swap to the `-darkmode` file in dark mode and the `-contrast` file inside a Lavender 90 contrast section.
- **Figma:** `figma.createNodeFromSvg(svgString)` via the Figma MCP `use_figma` tool (load the `figma-use` skill first) or figma-console's execute tool. Strokes arrive as editable vector strokes.
- **Illustrator:** draw with `roughen: false` (and `profiles: 'stroke'` for animals), then run the MCP tool `illustrator_import_drawing`: it gives the swelling lines real width profiles and puts Roughen on as a live effect. Or open the SVG and apply the Roughen graphic style by hand. Settings and the profile carriers are in `references/handoff.md`.

## Working from a reference image

The reference supplies the idea — subject, pose, situation. The skill supplies everything else. Never carry over the reference's colours, line or composition.

1. **Check what the image is.** Use the user's own photos or freely licensed ones. A stock illustration or another illustrator's work (a watermark is the giveaway) gives the scene, not the drawing: keep who is there, what they do and the props ("a customer service agent with a headset at a desk with a laptop, speech bubbles"), and draw the pose and layout anew. Do not make a real person recognisable. Tell the user in one line when you treat an image this way. For people, a **photo** is the better reference: a flat vector illustration pulls the drawing toward big heads, mitten hands and blocky bodies, which is exactly what rule 12 rules out. With only an illustration as reference, take the pose from a library person instead (`People/` and `Entur staff/` in the library folder).
2. **Still check the library first** (Step 1).
3. **Reduce, then show the plan.** Before drawing, write down and show the user: the one subject and at most one prop, the view (profile or a simple three-quarter, facing right), what hides what (a counter can hide legs), the format and whether it gets a backdrop, and the colour roles — `paper` for skin, `cloth` for clothes, one Peach element, Entur staff in the ink uniform with Coral panels. Corrections are cheap here.
4. **Put a grid over the reference.** `node scripts/grid.mjs <image> ref-grid.svg --format square` writes the image fitted to the canvas under a 20-unit grid with labels every 40, in canvas units. Render it and read anchors off the grid: 6–12 per contour for objects and animals, 12–25 for the contours of a person, whose silhouette turns more often. Then correct the proportions to the library's (§5 in `references/style.md`), not the reference's.
5. **Draw, render, compare.** For people and animals, go through route B (Step 4b) and use the grid on the approved PNG; for everything else draw with the script (Step 4a). Then look at the result next to the reference and a library motif at the same size (Step 5). Expect two or three rounds; fix the silhouette before details.

## Reference files

- **`references/style.md`** — full anatomy: line and fill construction with measured values for both constructions, the backdrop, ground, per-format composition (square, scene, landscape), motif vocabulary, drawing people, animals and vehicles, what to avoid
- **`references/palette.md`** — colour roles with hex values and primitive token names, the standard → dark → contrast mapping, colour proportions
- **`references/handoff.md`** — Illustrator graphic style and export, Figma import, web use and accessibility, file naming
- **`references/raster-first.md`** — route B: style references, image tools and credits, the prompt template, reviewing the PNG, and turning it into strokes in Illustrator or in code
