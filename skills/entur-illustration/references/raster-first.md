# Route B: raster first, then strokes

Natural, figurative people are hard to build anchor by anchor: placed by hand from coordinates, a figure comes out stiff and simplified — a gingerbread figure, not an Entur figure. For people and scenes with people, generate a PNG first with an image model that takes the library's own illustrations as style references, review it, then turn it into strokes.

Use route A (the script) for objects, animals, vehicles, signs and landscapes; it is exact and needs no credits.

## 1. Gather references

- **Style references** (image inputs): two to four standard-mode PNGs from the library that are closest to the motif, from `apps/documentation/src/downloads/illustrations/<Category>/<Motif>/PNG/`. For people pick people of the same kind and pose: Woman holding package, Man checking the time, Man and woman hugging, Woman walking with luggage; for staff add `Entur staff/Woman/PNG/Woman staff.png` or the man. For animals use animal PNGs, and so on. Never mix in illustrations from outside the library.
- **Content reference:** the user's own photo, or a freely licensed one, may go in as an image input for pose and situation. A stock illustration or another illustrator's work (watermark, credit line) never goes in as an image input: the model copies what it is shown. Describe the scene in words instead and tell the user so in one line.

## 2. Generate

Tools, in order of preference:

1. **An image model that accepts reference images**, such as Gemini image ("nano banana") through Figma Weave: `weave_find_model` for the id and contract, `weave_upload_asset` for each local PNG, `weave_run_model` to run. Needs a Weave account linked to the user's Figma account (app.weavy.ai, profile settings).
2. **Figma `generate_image`**, which takes a prompt only and places the image in a Figma file. Without references the style drifts further; spell out every rule.

Both spend the user's AI credits. Quote the cost and get an explicit approval before every run, reruns included.

Ask for a square PNG, 2048 × 2048 where the model allows it. Use JPG only if the user asks for it: compression smears thin lines and makes tracing worse.

### Prompt template

Fill in the brackets; keep every rule, even the ones that seem obvious.

```text
Line illustration in exactly the style of the attached reference images (the Entur Linje illustration library).
Scene: [one sentence: who, doing what, with which one prop].

Style rules:
- Plain dark navy line (#181C56), even width, round line ends, a very slight hand-drawn tremor; some contours are left open.
- Flat fills only. No gradients, no shadows, no texture, no outlines thicker than the line.
- White (#FFFFFF) is the main fill. Lavender (#AEB7E2) for one garment. Peach (#FFBF9E) for exactly one element: [which]. Coral (#FF5959) only for [a small detail | the Entur staff shoulder and sleeve panels].
- Colour fills sit slightly offset from their line, so a thin sliver of white shows along one side.
- People are drawn naturally, like an observed drawing: realistic adult proportions about 7.5 heads tall, a small head, a relaxed pose with weight on one leg or a slight turn, loose clothes with a few fold lines, hands with fingers, shoes with soles.
- Faces are white and have NO EYES: only a nose line and at most a short mouth line. Glasses are allowed.
- [Entur staff: dark navy uniform with coral shoulder and sleeve panels and a small white name badge.]
- Plain white background. A broken horizontal navy ground line under the subject. [Optional for objects and animals: a soft pale grey-lavender disc (#EAEAF1) behind the upper body.]
- No text, no logos, no frame. Square, 1:1.

Use the references only for line, proportion and colour. Do not copy any figure or composition from them.
```

## 3. Review the PNG

Look at it next to the style references at the same size and run the Step 5 checklist in `SKILL.md`. Models tend to slip on the same things:

- eyes drawn anyway, or a cartoon face
- big heads, blocky bodies, mitten hands — the corporate-illustration habit
- gradients, soft shadows, extra colours, a coloured background
- lines too thick or too even, like a vector icon
- text or logos

Do not repair pixels, and do not start over. Send the draft back to the model as the **first image**, with the library reference that shows the fix as the second, and ask for only the changes:

```text
Edit the first image. Keep everything else exactly as it is: [pose, hands, face, props, line, colours].
Make only these changes:
1. [UNIFORM: coral ONLY as a shoulder yoke and one narrow sleeve stripe, like the second image.]
2. [...]
The face keeps NO EYES. No text. Square 1:1.
```

An edit round keeps what already works; a new generation throws it away. One or two edit rounds are normal, and each costs the same as a generation. Near-white noise in the background (values around 249–255) is invisible and does not survive tracing; it needs no cleaning.

The approved PNG is a **draft**: fine for a sketch, a concept or a review, never as the final library asset.

## 4. Turn it into strokes

Final assets are live strokes in three colour modes.

**In Illustrator, automated** (macOS, Illustrator running; no plugin):

```bash
node scripts/illustrator-trace.mjs <draft.png> --out <dir> --name <Name>
```

It drives Illustrator through AppleScript `do javascript` and writes `<Name>.ai` with live strokes and the Roughen effect, `<Name>.svg`, `<Name>-darkmode.svg` and `<Name>-contrast.svg`. Options: `--app` for another Illustrator install (default Illustrator 2026), `--threshold` (line darkness, default 110), `--max-stroke` (widest line traced as a stroke; use 20 for a 2048 px draft), `--no-roughen`. The same work is available to agents as MCP tools (`illustrator_status`, `illustrator_run_jsx`, `illustrator_trace_draft`):

```bash
claude mcp add -s local illustrator-bridge -- node <skill folder>/scripts/illustrator-mcp.mjs
```

What the script does, and why — the same steps apply when you trace by hand:

- **Line layer:** Black and White trace, **Strokes only**, method **Abutting**. With Fills on, the lines merge with the ink areas they touch (uniform, hair) into one filled region. With Overlapping, white areas are shapes stacked on a solid silhouette, and Ignore White deletes them, leaving a filled silhouette.
- **Fill layer:** Limited colours, Abutting, Fills. Every area snaps to the nearest palette colour. Enclosed white is kept as `paper`, because it turns light grey in dark mode; only the white background that touches the artboard edge is removed. Ink areas stay only when they are wide (mean width over ~4 pt: a uniform, hair, shoes); thin line-like ink is dropped, since the line layer draws it.
- **Strokes:** ink colour, round caps and joins, 1.5 pt or 1.0 pt by traced width. Check faces and small details by hand; they often want 1.0.
- **Roughen on strokes only.** On large traced fills a relative Roughen makes the edges hairy, and the draft already carries the hand tremor.
- **Modes by palette mapping.** Every white becomes `paper`; recolour white clothing to `cloth` (and vehicle bodies to `vehicle`) by hand in the dark file if the motif has them.

**In Illustrator, by hand:**

1. Place the PNG on a 320 pt artboard and lock it on a layer at 50 % opacity.
2. Line layer: Object > Image Trace, Mode Black and White, threshold so only the navy line survives, method Abutting. Under Advanced, create **Strokes** only, with a stroke width limit around 20 px for a 2048 px draft. Expand.
3. Select all lines. Stroke panel: 1.5 pt for contours (1.0 for interior lines), Cap Round, Corner Round, Profile Uniform. Join broken pieces, delete specks; aim for few anchors.
4. Fill layer: trace the PNG again with Mode Limited colours, method Abutting and the palette as the swatch set, create Fills, delete the background white, and put the layer under the lines.
5. Apply the Roughen graphic style from `handoff.md` to the strokes, then build the dark and contrast versions with Recolor Artwork and the mapping in `palette.md`.

**In code** (no Illustrator): `node scripts/grid.mjs <draft.png> --format square`, render the grid, and redraw the centre lines with the script (route A), 12–25 anchors per contour of a person. Slower, and it loses some of the PNG's life, but it stays in the repository and gives all three modes at once.

**In Figma:** there is no tracing. Vectorise with one of the two above, then import the SVG (`handoff.md`).
