# Route B: raster first, then strokes

Natural, figurative people and animals are hard to build anchor by anchor: placed by hand from coordinates, a figure comes out stiff and simplified — a gingerbread figure, not an Entur figure — and an animal comes out geometric, without the observed detail of the library animals. For people, animals and scenes with them, generate a PNG first with an image model that takes the library's own illustrations as style references, review it, then turn it into strokes.

Use route A (the script) for objects, vehicles, signs and landscapes; it is exact and needs no credits.

## 1. Gather references

- **Style references** (image inputs): two to four standard-mode PNGs from the library that are closest to the motif, from `apps/documentation/src/downloads/illustrations/<Category>/<Motif>/PNG/`. For people pick people of the same kind and pose: Woman holding package, Man checking the time, Man and woman hugging, Woman walking with luggage; for staff add `Entur staff/Woman/PNG/Woman staff.png` or the man. For animals use animal PNGs, and so on. Never mix in illustrations from outside the library.
- **Content reference:** the user's own photo, or a freely licensed one, may go in as an image input for pose and situation. A stock illustration or another illustrator's work (watermark, credit line) never goes in as an image input: the model copies what it is shown. Describe the scene in words instead and tell the user so in one line.

## 2. Generate

### Default: Nano Banana 2.1 in Weave

[Weave](https://app.weavy.ai/) is Figma's platform for image models, and its tools come with the Figma MCP server. It runs Nano Banana 2.1 (Google's Gemini image model) with the library PNGs as reference images, which keeps the line, the proportions and the colours closest to the library. Use it for every draft unless it is unavailable.

- **Account:** the user signs in at app.weavy.ai and links Weave to their Figma account (profile settings). The free plan allows two model runs; after that a run returns a message asking to upgrade and spends nothing. Tell the user, and fall back to Figma `generate_image` below until they upgrade.
- **Model:** `weave_find_model` with "nano banana 2" returns two candidates. Use **Nano Banana 2.1** (`fal-ai/nano-banana-2/edit`). Nano Banana 2 Lite costs less but only makes 1K images.
- **Reference images:** upload each local PNG with `weave_upload_asset`. It returns a submit URL and a token: post the file with `curl -F "file=@<png>" -H "X-Weave-Upload-Token: <token>" <submitUrl>`, and pass the whole asset object it returns. The `images` input takes up to 14: the two to four style references, and in an edit round the draft first.
- **Settings:** `model: "Nano Banana 2.1"`, `resolution: "2K"`, `aspect_ratio: "1:1"`, `output_format: "png"`. About 10 Weave credits per run at 2K.
- **Running:** `weave_run_model` without `acknowledgedCost` only returns the price. Show it to the user as an Approve/Cancel choice, and run again with `acknowledgedCost` once they approve. Wait for the result with `weave_get_model_run_output` and download it with the curl command it gives.

### Fallback: Figma `generate_image`

**Figma `generate_image`**, which takes a prompt only and places the image in a Figma file (`gemini-3.1-flash-image` comes back at 1024 px, enough to trace a square motif). Without references the style drifts further; spell out every rule, including the line ("dark navy ink like a dip pen, swelling slightly in the middle and thinning at both ends") and the colours with their hex values. Weave allows only a few free model runs; when they are used up, this is the fallback.

Both spend the user's credits, and each run needs its own approval, reruns included: the Weave tool requires it. So that this is one decision and not many, tell the user the whole plan before the first run — one generation plus up to two edit rounds, about 10 Weave credits each — and then ask for each run as it comes.

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
- People are drawn naturally, like an observed drawing: realistic adult proportions about 7.5 heads tall, a small head, a relaxed pose with weight on one leg or a slight turn, loose clothes with only 2–5 tapered fold marks, hands with fingers, shoes with soles.
- Faces are white and have NO EYES and NO MOUTH: only a nose line. Glasses are allowed.
- [Entur staff: dark navy uniform with coral shoulder and sleeve panels and a small white name badge.]
- Furniture is simplified: a table has four legs or none, and no leg crosses a person.
- [Animals: drawn naturally, like an observed sketch of the real animal — correct anatomy, fur only as a few short tapered strokes. The animal keeps a small dot eye and a small dark nose; no smile, no big cartoon eyes, no clothes. The line swells slightly in the middle and thins at both ends, like a dip pen.]
- Plain white background. A broken horizontal navy ground line under the subject. [Optional for objects and animals: a soft pale grey-lavender disc (#EAEAF1) behind the upper body.]
- No text, no logos, no frame. Square, 1:1.

Use the references only for line, proportion and colour. Do not copy any figure or composition from them.
```

## 3. Review the PNG — before the user sees it

Review every draft yourself; never show a first draft as a result or wait for the user to point out what this review catches. Look at it next to the style references at the same size and run the Step 5 checklist in `SKILL.md`. Write down every deviation, fix them in an edit round, and review again. Up to two edit rounds; then trace. Models tend to slip on the same things:

- eyes or a mouth drawn anyway, or a cartoon face
- accessories drawn twice (two earcups, a split headband)
- big heads, blocky bodies, mitten hands — the corporate-illustration habit
- gradients, soft shadows, extra colours, a coloured background
- lines too thick or too even, like a vector icon
- text or logos
- animals: geometric or blobby shapes, a cartoon face, big eyes or a smile, soft grey gradients in the fur, the subject small in the frame (library animals fill about 60–75 % of the height)
- a sign, prop or tail closer than 16 units to the canvas edge

Do not repair pixels, and do not start over. Send the draft back to the model as the **first image**, with the library reference that shows the fix as the second, and ask for only the changes:

```text
Edit the first image. Keep everything else exactly as it is: [pose, hands, face, props, line, colours].
Make only these changes:
1. [UNIFORM: coral ONLY as a shoulder yoke and one narrow sleeve stripe, like the second image.]
2. [...]
The face keeps NO EYES and NO MOUTH, only the nose. No text. Square 1:1.
```

An edit round keeps what already works; a new generation throws it away. One or two edit rounds are normal, and each costs the same as a generation. Near-white noise in the background (values around 249–255) is invisible and does not survive tracing; it needs no cleaning.

The approved PNG is a **draft**: fine for a sketch, a concept or a review, never as the final library asset.

## 4. Turn it into strokes

Final assets are live strokes in three colour modes.

**In Illustrator, automated** (macOS, Illustrator running; no plugin):

```bash
node scripts/illustrator-trace.mjs <draft.png> --out <dir> --name <Name>
```

For an animal or object add `--construction animals --carriers <profiles.ai> --backdrop --underlay` (details below).

It drives Illustrator through AppleScript `do javascript` and writes `<Name>.ai` with live strokes, `<Name>.svg`, `<Name>-darkmode.svg` and `<Name>-contrast.svg`. Options: `--app` for another Illustrator install (default Illustrator 2026), `--size` (artboard in pt, default 360, which puts a figure at library scale), `--threshold` (line darkness, default 110), `--max-stroke` (widest line traced as a stroke, default 20; at 14 the thicker pieces of a contour drop out), `--contour-share` (share of lines that get the contour weight, default 0.25), `--roughen` (add Roughen to the strokes; off by default), `--fill-rough` and `--ink-shift` (rough fill edges and offset ink clothing; off, and not in the reference drawings), `--no-features` (leave out the eyes and noses put back on animals, below). A 2048 px draft can take several minutes, more with other large documents open. The same work, and the finishing steps below, are available to agents as MCP tools (`illustrator_status`, `illustrator_run_jsx`, `illustrator_trace_draft`, `illustrator_scale_head`, `illustrator_smooth_region`, `illustrator_add_details`):

```bash
claude mcp add -s local illustrator-bridge -- node <skill folder>/scripts/illustrator-mcp.mjs
```

What the script does, and why — the same steps apply when you trace by hand:

- **Line layer:** Black and White trace, **Strokes only**, method **Abutting**. With Fills on, the lines merge with the ink areas they touch (uniform, hair) into one filled region. With Overlapping, white areas are shapes stacked on a solid silhouette, and Ignore White deletes them, leaving a filled silhouette.
- **Fill layer:** Limited colours, Abutting, Fills. Every area snaps to the nearest palette colour. Enclosed white is kept as `paper`, because it turns light grey in dark mode; only the white background that touches the artboard edge is removed. Ink areas stay only when they are wide (mean width over ~4 pt: a uniform, hair, shoes); thin line-like ink is dropped, since the line layer draws it.
- **Strokes:** ink colour, round caps and joins. The thickest quarter of the lines gets 1.5 pt, the rest 1.0 pt — by traced width, or by length (long outer contours) when the draft's lines are all equally thick. Library people land at about that mix; an all-1.5 figure looks heavy and coarse next to them.
- **Fills smooth, lightly shifted.** A low path fidelity keeps colour areas to a few anchors instead of a jagged edge, and no Roughen goes on fills. Colour areas (not ink) are shifted 0.6 pt right and 0.3 pt down, the size of the offsets in hand-made reference people.
- **No Roughen by default.** The draft already carries the hand tremor; Roughen on top makes lines bumpy, and on large fills a relative Roughen makes edges hairy. Use `--roughen` only when the traced lines look too clean.
- **Modes by palette mapping.** Every white becomes `paper`; recolour white clothing to `cloth` (and vehicle bodies to `vehicle`) by hand in the dark file if the motif has them. The backdrop circle shares its standard colour with `tint`; in the dark and contrast files give the Circle layer the `backdrop` values from `palette.md`.

With `--construction animals`, for animals and objects:

- **Artboard and weights:** 320 pt, contour 2.1 and detail 1.7 at the widest point.
- **Width profiles** (`--carriers`): every traced line gets a live width profile, copied from the strokes named `swell` and `point` in the carriers file (`handoff.md`); lines shorter than 12 pt, such as fur marks, get `point`.
- **Backdrop** (`--backdrop`): the traced disc is lumpy and often traces as a white interior inside a grey rim. It is replaced by the library's 4-anchor circle with Roughen 0.65 % on a Circle layer, and the traced white interior and rim fragments are removed.
- **Underlay** (`--underlay`): one paper shape under the whole animal, traced from its silhouette in the draft. Without it, white areas the colour trace cannot tell from the background — a tail that reaches past the disc — stay unfilled, and the ground line shows through.
- **Eyes and noses** (on by default): a small dark eye or nose is too thin for the colour trace and too round for the line trace, so it drops out of both. The script finds them in the draft — dots that stand free, and thick spots left once the lines are eroded away, such as a nose at the end of the snout line — and puts each back as an ink ellipse on a Features layer on top. People never get them: an Entur person has no eyes (rule 13), and glasses are lines the line trace keeps.

**In Illustrator, by hand:**

1. Place the PNG on a 360 pt artboard and lock it on a layer at 50 % opacity.
2. Line layer: Object > Image Trace, Mode Black and White, threshold so only the navy line survives, method Abutting. Under Advanced, create **Strokes** only, with a stroke width limit around 20 px for a 2048 px draft. Expand.
3. Select all lines. Stroke panel: 1.0 pt, Cap Round, Corner Round, Profile Uniform; then select the long outer contours and set them to 1.5 pt (about a quarter of the lines). Join broken pieces, delete specks; aim for few anchors.
4. Fill layer: trace the PNG again with Mode Limited colours, method Abutting, a low path fidelity and the palette as the swatch set, create Fills, delete the background white, nudge one to three colour areas 0.6 pt right and 0.3 pt down, and put the layer under the lines.
5. Build the dark and contrast versions with Recolor Artwork and the mapping in `palette.md`. Add the Roughen graphic style from `handoff.md` only if the lines look too clean.

**Finish** — the trace gives the construction; these steps give it the reference drawings' simplicity, proportions and life. Points are Illustrator points, y up; read them off a grid render of the traced file.

1. **Simplify accessories:** a traced headset, pair of glasses or strap often comes out doubled — a cushion plus a ring, a band split in two by a line. Delete the extra parts and redraw each as one shape (one band stroke, one earcup). Where a removed part cut through a silhouette, the silhouette keeps a slot; close it by removing those anchors (`illustrator_run_jsx`).
2. **Head size:** compare with a library person at the same height. If the head is bigger, run `illustrator_scale_head` with the neck point, the scale (0.8–0.9) and the head column. It scales head parts as wholes and moves the head anchors of any silhouette that runs into the body with a soft blend, so hair inside a hair-and-uniform shape shrinks too. Scaling parts one by one misses that hair, and the head keeps looking big.
3. **Smooth the hair:** `illustrator_smooth_region` over the hair (default: every fourth anchor kept, three passes) gives one smooth edge. It also flattens small bumps inside the region, such as a microphone tip; redraw those afterwards.
4. **Fold and sheen marks:** add 2–5 tapered marks with the MCP tool `illustrator_add_details` (points in Illustrator points, y up; read them off a grid render of the traced file), or by hand with a width profile or a small filled shape. Paper-white on ink or colour, ink on light fills.
5. **Simplify props:** remove a lone table leg, or any leg that crosses a person; four legs or none.
6. **Animals — eyes and noses:** the trace puts them back on the Features layer. Check that each is there and the right size; draw one it missed as a small ink ellipse, and delete one that is not a feature (a dark button or hoof the colour trace already kept).
7. **Animals — ground:** drafts often draw the ground as short dashes. Replace them with two to four long segments on a layer under the fills, so the animal's underlay covers the ground behind it, plus a shorter Blue 50 line below.

**In code** (no Illustrator): `node scripts/grid.mjs <draft.png> --format square`, render the grid, and redraw the centre lines with the script (route A), 12–25 anchors per contour of a person. Slower, and it loses some of the PNG's life, but it stays in the repository and gives all three modes at once.

**In Figma:** there is no tracing. Vectorise with one of the two above, then import the SVG (`handoff.md`).
