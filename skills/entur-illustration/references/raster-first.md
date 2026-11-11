# Route B: raster first, then strokes

Natural, figurative people and animals are hard to build anchor by anchor: placed by hand from coordinates, a figure comes out stiff and simplified — a gingerbread figure, not an Entur figure — and an animal comes out geometric, without the observed detail of the library animals. For people, animals and scenes with them, generate a PNG first with an image model that takes the library's own illustrations as style references, review it, then turn it into strokes.

Use route A (the script) for objects, vehicles, signs and landscapes; it is exact and needs no credits.

## 1. Gather references

- **Style references** (image inputs): two to four standard-mode PNGs from the library that are closest to the motif, from `apps/documentation/src/downloads/illustrations/<Category>/<Motif>/PNG/`. For people pick people of the same kind and pose: Woman holding package, Man checking the time, Man and woman hugging, Woman walking with luggage; for staff add `Entur staff/Woman/PNG/Woman staff.png` or the man. For animals use animal PNGs, and so on. Never mix in illustrations from outside the library.
- **Content reference:** the user's own photo, or a freely licensed one, may go in as an image input for pose and situation. A stock illustration or another illustrator's work (watermark, credit line) never goes in as an image input: the model copies what it is shown. Describe the scene in words instead and tell the user so in one line.

## 2. Generate

Use only tools Entur has approved: **Figma, Claude and Illustrator**. Figma's own image generation makes the draft and spends AI credits on the Figma plan; nothing else needs an account.

### Default: Figma image generation

- **In the Figma app** (a designer making the draft): Actions › Make an image, with two or three library PNGs attached through **+** as references and the prompt template below. References keep the line, the proportions and the colours closest to the library. Corrections go through Edit image on the draft (§3), which keeps what already works.
- **From Claude** (an agent making the draft): the Figma MCP tool `generate_image`, `model: "gemini-3.1-flash-image"`, `width` and `height` 2048, into a Figma file the user names or a new one (`create_new_file`). It takes a prompt only — no reference images, no draft to edit — so write the prompt as below under Fallback, and download the result from the `image.url` it returns. The gpt-image models it also offers are untested for this style.
- **Credits:** every run spends Figma AI credits on the file's plan, and each needs the user's approval, reruns included. So that this is one decision and not many, tell the user the whole plan before the first run — one generation plus up to two correction rounds — and then ask for each run as it comes.

### Fallback: prompt only

Without reference images (`generate_image`, or Make an image with nothing attached) the style drifts further; spell out every rule, including the line ("dark navy ink like a dip pen, swelling slightly in the middle and thinning at both ends") and the colours with their hex values. Drop the template's lines about attached references.

### Only where approved: Weave

Weave (app.weavy.ai, owned by Figma) runs Nano Banana 2.1 with reference images through the Figma MCP's `weave_*` tools, but it is a separate service with its own account, plan and credits, not part of the Figma licence. It is not approved at Entur: do not use it or offer it. Where an organisation has approved it, its runs ask for a cost approval each, like Figma's.

Ask for a square PNG, 2048 × 2048 where the model allows it. Use JPG only if the user asks for it: compression smears thin lines and makes tracing worse.

### Prompt template

Fill in the brackets; keep every rule, even the ones that seem obvious. For an animal, the Peach element is never left out: name the prop or the marking (rule 19). For coral take the first option — no coral or red — for animals, people, objects and scenes; the second only for a vehicle on its line, the third only for Entur staff (rule 8).

```text
Line illustration in exactly the style of the attached reference images (the Entur Linje illustration library).
Scene: [one sentence: who, doing what, with which one prop].

Style rules:
- Plain dark navy line (#181C56), even width, round line ends, a very slight hand-drawn tremor; some contours are left open.
- Flat fills only. No gradients, no shadows, no texture, no outlines thicker than the line.
- White (#FFFFFF) is the main fill. Lavender (#AEB7E2) for one garment. Peach (#FFBF9E) for exactly one element: [which]; it is the only highlight colour. [No coral or red anywhere, not on a comb, a wattle, a tongue, cheeks or clothes | Coral (#FF5959) only for the line under the vehicle | Coral (#FF5959) only for the Entur staff shoulder and sleeve panels].
- Colour fills sit slightly offset from their line, so a thin sliver of white shows along one side.
- People are drawn naturally, like an observed drawing: realistic adult proportions about 7.5 heads tall, a small head, a relaxed pose with weight on one leg or a slight turn, loose clothes with only 2–5 tapered fold marks, hands with fingers, shoes with soles.
- Faces are white and have NO EYES and NO MOUTH: only a nose line. Glasses are allowed.
- [Entur staff: dark navy uniform with coral shoulder and sleeve panels and a small white name badge.]
- Furniture is simplified: a table has four legs or none, and no leg crosses a person.
- [Animals: drawn naturally, like an observed sketch of the real animal — correct anatomy, but minimal: long smooth contours with a few gaps, no fur ticks along the outline, no cluster of fur strokes on the chest or neck, at most three or four short fur marks in all and only where they show the species, one inner line per ear. The animal keeps a small dot eye and a small dark nose; no smile, no big cartoon eyes, no clothes. It has exactly one small peach (#FFBF9E) area, about 1 % of the image: a prop it holds, wears or has beside it (a collar, a ball, a ticket, a leaf), or one marking of its own (a chest patch, horns) as a flat shape with a rough edge and no outline. The line swells slightly in the middle and thins at both ends, like a dip pen.]
- Plain white background. One simple thin navy ground line under the subject, in one or two long pieces, running a little past it: no row of dashes, no second line, no grass unless the scene asks for it — and then only one small tuft of two or three blades at the foot of something. [Optional for objects and animals: a soft pale grey-lavender disc (#EAEAF1) behind the upper body.]
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
- the ground as a row of dashes, as two lines or heavier than the contours; grass tufts along it or on both sides when the scene does not need nature
- animals: geometric or blobby shapes, a cartoon face, big eyes or a smile, soft grey gradients in the fur, the subject small in the frame (library animals fill about 60–75 % of the height)
- animals: more line than the library animal next to it — fur ticks along the back, a cluster of fur strokes on the chest or neck, several lines inside an ear (rule 18)
- animals: no Peach at all, or Peach spread over the body instead of one prop or marking (rule 19)
- coral or red on an animal, a person or an object — a hen's comb and wattle, a tongue, cheeks, a garment: make it Peach or paper in an edit round (rule 8)
- a sign, prop or tail closer than 16 units to the canvas edge

Do not repair pixels, and do not start over. **In the Figma app**, select the draft, choose Edit image, attach the library reference that shows the fix, and ask for only the changes with the prompt below. **Through `generate_image`**, which has no image input, run the full prompt again with the same numbered changes appended as "Corrections from the last attempt", the pose and what worked described in words, and keep whichever draft is closer:

```text
Edit the first image. Keep everything else exactly as it is: [pose, hands, face, props, line, colours].
Make only these changes:
1. [UNIFORM: coral ONLY as a shoulder yoke and one narrow sleeve stripe, like the second image.]
2. [...]
The face keeps NO EYES and NO MOUTH, only the nose. No text. Square 1:1.
```

An edit keeps what already works; a new generation throws it away, which is why Edit image in the app is the better correction when a designer is at hand. One or two correction rounds are normal, and each costs the same as a generation. Near-white noise in the background (values around 249–255) is invisible and does not survive tracing; it needs no cleaning.

The approved PNG is a **draft**: fine for a sketch, a concept or a review, never as the final library asset.

## 4. Turn it into strokes

Final assets are live strokes in three colour modes.

**In Illustrator, automated** (macOS, Illustrator running; no plugin):

```bash
node scripts/illustrator-trace.mjs <draft.png> --out <dir> --name <Name>
```

For an animal or object add `--construction animals --carriers <profiles.ai> --backdrop --underlay` (details below).

It drives Illustrator through AppleScript `do javascript` and writes `<Name>.ai` with live strokes, `<Name>.svg`, `<Name>-darkmode.svg` and `<Name>-contrast.svg`. Options: `--app` for another Illustrator install (default Illustrator 2026), `--size` (artboard in pt, default 360, which puts a figure at library scale), `--threshold` (line darkness, default 110), `--max-stroke` (widest line traced as a stroke, default 20; at 14 the thicker pieces of a contour drop out), `--contour-share` (share of lines that get the contour weight, default 0.25), `--roughen` (add Roughen to the strokes; off by default), `--fill-rough` and `--ink-shift` (rough fill edges and offset ink clothing; off, and not in the reference drawings), `--no-features` (leave out the eyes and noses put back on animals, below), `--no-simplify` (keep every traced line on an animal, below). A 2048 px draft can take several minutes, more with other large documents open. The same work, and the finishing steps below, are available to agents as MCP tools (`illustrator_status`, `illustrator_run_jsx`, `illustrator_trace_draft`, `illustrator_scale_head`, `illustrator_smooth_region`, `illustrator_add_details`):

```bash
claude mcp add -s local illustrator-bridge -- node <skill folder>/scripts/illustrator-mcp.mjs
```

What the script does, and why — the same steps apply when you trace by hand:

- **Line layer:** Black and White trace, **Strokes only**, method **Abutting**. With Fills on, the lines merge with the ink areas they touch (uniform, hair) into one filled region. With Overlapping, white areas are shapes stacked on a solid silhouette, and Ignore White deletes them, leaving a filled silhouette.
- **Fill layer:** Limited colours, Abutting, Fills. Every area snaps to the nearest palette colour. Enclosed white is kept as `paper`, because it turns light grey in dark mode; only the white background that touches the artboard edge is removed. Ink areas stay only when they are wide (mean width over ~4 pt: a uniform, hair, shoes); thin line-like ink is dropped, since the line layer draws it.
- **Strokes:** ink colour, round caps and joins. The thickest quarter of the lines gets 1.5 pt, the rest 1.0 pt — by traced width, or by length (long outer contours) when the draft's lines are all equally thick. Library people land at about that mix; an all-1.5 figure looks heavy and coarse next to them.
- **Fills smooth, lightly shifted.** A low path fidelity keeps colour areas to a few anchors instead of a jagged edge, and no Roughen goes on fills. Colour areas (not ink) are shifted 0.6 pt right and 0.3 pt down, the size of the offsets in hand-made reference people.
- **No Roughen by default.** The draft already carries the hand tremor; Roughen on top makes lines bumpy, and on large fills a relative Roughen makes edges hairy. Use `--roughen` only when the traced lines look too clean.
- **Modes by palette mapping.** Every white becomes `paper`; recolour white clothing to `cloth` (and vehicle bodies to `vehicle`) by hand in the dark file if the motif has them. The backdrop circle shares its standard colour with `tint`, but the script gives the Circle layer the `backdrop` values from `palette.md` in the dark and contrast files: Ebony 20 at 30 % opacity and Blue 90, where small tint fills turn Ebony 30 and Blue 40.

With `--construction animals`, for animals and objects:

- **Artboard and weights:** 320 pt, contour 2.1 and detail 1.7 at the widest point.
- **Width profiles** (`--carriers`): every traced line gets a live width profile, copied from the strokes named `swell` and `point` in the carriers file (`handoff.md`); lines shorter than 12 pt, such as fur marks, get `point`.
- **Backdrop** (`--backdrop`): the traced disc is lumpy and often traces as a white interior inside a grey rim. It is replaced by the library's 4-anchor circle with Roughen 0.65 % on a Circle layer, and the traced white interior and rim fragments are removed. The circle is measured in the draft's pixels — the largest connected area of the disc's pale grey-lavender, its radius from the longer side, measured from the top — so it still comes in when the subject covers a third of the disc or more (Hens family), and a grey wing beside it does not stretch it. Only a plausible disc counts — at least 30 % of the width, round, at least a third filled, near the middle — so a draft without one (two seagulls in flight, with pale wings) gets no circle: the library has animals with and without the disc.
- **Underlay** (`--underlay`): paper under the animal, traced from its silhouette in the draft. Without it, white areas the colour trace cannot tell from the background — a tail that reaches past the disc — stay unfilled, and the ground line shows through. Every figure gets its own shape (a chick standing apart from the hen too), holes in the silhouette stay open, the paper stops at the top of the ground line, and pockets closed off between grass blades and the line are left out; each would show as a pale patch in dark mode.
- **Eyes and noses** (on by default): a small dark eye or nose is too thin for the colour trace and too round for the line trace, so it drops out of both. The script finds them in the draft — dots that stand free, and thick spots left once the lines are eroded away, such as a nose at the end of the snout line — and puts each back as an ink ellipse on a Features layer on top. People never get them: an Entur person has no eyes (rule 13), and glasses are lines the line trace keeps. Spots in the band just above the ground line are never taken: there they are grass clumps, not eyes (Hens family had nine).
- **Simplify** (on by default; `--no-simplify` turns it off): the draft usually has more line than a library animal (rule 18). Before the weights go on, the script drops specks under 3 pt, joins a contour broken into pieces end to end (within 4 pt, running on within 45°), replaces the ground with one plain line, and thins short fur marks (under 20 pt): a mark lying along a contour goes, and of marks within 20 pt of each other only the longest stays. Marks within 20 pt of an eye or nose (a mouth, an inner ear line), toes and grass stay. On the bear cub it took the trace from 80 to about 50 strokes. The ground: where the draft has a ground line (one dark run across a quarter of the width, found in its pixels), the traced dashes and short grass marks in that band go, and one plain line takes their place — ink, detail weight, Roughen 0.2 %, from the first to the last piece of the drawn line — on a Ground layer under the fills, so the figures hide it where they stand. A short mark there that touches a leg is a foot and stays. Without a ground line in the draft, the dashes are joined into pieces at detail weight instead.

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
7. **Ground:** one simple line at detail weight, in one to three pieces (`style.md` §4). On animals the trace replaces it with one plain line on a Ground layer; on people, join the dashes and set the weight by hand. Grass is not removed automatically (a toe and a blade look alike to the trace): keep at most one tuft of two or three blades, where the scene gives it a reason (a pole, a bench leg), and delete the rest. The ground goes on a layer under the fills, so the underlay covers it behind the subject.
8. **Animals — less line:** look at the result next to a library animal at the same size. Delete what the simplify step left that the library would not draw: a fur tick on the back, a second mark on the chest, a staircase of short pieces along a contour (join those into one stroke). One fold line at the neck or shoulder can replace a run of fur.
9. **Animals — Peach:** the trace keeps a Peach area from the draft and shifts it off its line. If the draft brought none, add one now on the Fill layer, about 1 % of the canvas: a prop gets its own ink outline with the Peach shifted 0.6 pt off it; a marking on the body (a chest patch) has no outline and Roughen 1.5 %, relative, detail 51.

**In code** (no Illustrator): `node scripts/grid.mjs <draft.png> --format square`, render the grid, and redraw the centre lines with the script (route A), 12–25 anchors per contour of a person. Slower, and it loses some of the PNG's life, but it stays in the repository and gives all three modes at once.

**In Figma:** there is no tracing. Vectorise with one of the two above, then import the SVG (`handoff.md`).
