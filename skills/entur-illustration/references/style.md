# Entur illustration style — anatomy

Measurements come from two sources:

- **Library exports** — the 410 SVGs on linje.entur.no (140 standard, 135 dark, 135 contrast). Flattened, but colours, canvas sizes and proportions are exact.
- **Raw Illustrator files** — the `.ai` sources in the Design Guild illustration library, where the line construction is still live (stroke weights, caps, joins, effects).
- **Figma Illustration Library** — the components, read node by node through figma-console in November 2026 (see "In the Figma library" below).

Numbers are in SVG units on the library canvases (320 × 320 square) unless noted.

---

## 1. Line

### Construction

| Property   | Value                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Type       | Live stroke on a Bézier path, 6–12 anchors per contour as a designer would place them                                                  |
| Width      | Uniform along the line. No brush, no width profile                                                                                     |
| Cap / join | Round / round                                                                                                                          |
| Effect     | Roughen — Size 0.2 % (range 0.1–0.4), Relative, Detail 42–47 per inch at source size (≈ 63 per inch on the 320 canvas), Points: Smooth |
| Colour     | Ink (Lavender 90) for everything in the foreground                                                                                     |

Roughen is relative, so the wobble scales with the object: a long body contour wobbles visibly, a 10-unit eyebrow barely moves. It reads as a steady hand with a fine-liner on slightly toothy paper — not as a sketch. On very large objects (a counter, a train, a building across the canvas) 0.2 % would push the line half a unit and saw its long edges; keep the push under about 0.35 units there. The generator caps it with ROUGHEN.max.

### In the Figma library

| What                 | People and transport (28 motifs)                                                                       | Animals and objects (29 motifs)                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Lines                | Live strokes, about 1,000 in all, stroke align centre                                                  | Outlined: filled ink shapes, only a handful of live strokes                                        |
| Weights              | 1.5 (458 strokes), 1.0 (339), fine 0.5–0.86, accent 2–3                                                | Outlined widths ≈ 1.3–2.3, even along the line                                                     |
| Caps                 | Round on 94 % of open strokes                                                                          | —                                                                                                  |
| Joins                | Paths are smooth, so joins rarely show; at the few real corners round and miter are used about equally | —                                                                                                  |
| Roughen              | Baked into the path: an anchor every 0.85–1.8 units (median 1.15), tremor ≈ 0.1–0.3 % of the object    | Baked in the same way before outlining                                                             |
| Brush, width profile | None. Every vector is a Basic stroke                                                                   | A few short details taper to a point (beaver whiskers, the clock's strap lines); contours never do |
| Effects              | Only the dark-mode reflector glow (§7)                                                                 | None                                                                                               |
| Layers               | One group holding lines and fills                                                                      | Three groups named Circle (the backdrop), Fill and Outline                                         |

The people and transport construction is the one to copy. The outlined animals and objects came in from older `.ai` files.

### Weight hierarchy

| Role    | Figma live strokes (320) | Library SVG (320, outlined) | Raw `.ai` (figure ~410 pt tall) | Used for                                                          |
| ------- | ------------------------ | --------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| Contour | 1.5                      | 1.5                         | 1.88 – 2.0                      | Outer silhouette of subject and props, ground line                |
| Detail  | 1.0                      | 1.1 – 1.26                  | 1.22 – 1.5                      | Folds, creases, seams, the inner leg, facial lines                |
| Fine    | 0.5 – 0.86               | 0.85 – 0.93                 | 1.0                             | Hatching, small background details                                |
| Accent  | 2 – 3                    | 2.4 – 4                     | 2.4 – 3.9                       | Rare: a coloured stroke used as an object (a dog collar, a strap) |

The heavier contour against lighter interior lines is what gives the drawings their clarity at small sizes. Keep the same absolute weights on all three canvases; figures in scenes and landscapes are smaller, so their lines read bolder, as in the library.

### How lines behave

- **Open contours.** Silhouettes are built from several strokes that overlap or stop just short of each other. At least one gap per subject — at a shoulder, a hip, where a tail meets a body.
- **Floating interior lines.** A fold line starts inside the shape and ends inside it. The line separating two legs stops short of the crotch.
- **Overlaps resolve by fill.** A front object's paper fill covers the lines of whatever is behind it; never erase lines by hand.
- **Straight things are not ruled.** Poles, sign edges and rails have a slight bow and the Roughen tremor.
- **Faces have only a nose.** Profile: one nose line. Front or three-quarter: a small nose stroke. Glasses if the person wears them; an ear may show beside the hair. Never eyes (dots, arcs, pupils) and never a mouth on people. Animals keep their eyes.

### Background lines

Everything behind the subject's plane — buildings, trees, hills, clouds, distant vehicles — is drawn in the secondary line colour (Blue 50) at detail or fine weight, with either no fill or the palest fill (Blue 20). This is the only depth cue besides overlap: there is no perspective blur, no fading opacity.

---

## 2. Fill

- **Flat**, one colour per area. No gradients, no shading ramps, no shadows under objects.
- **Under the lines**, as a separate object from the stroke.
- **Rough edge** — the same Roughen settings as the lines.
- **Misregistered** — coloured fills are shifted about 1–1.5 units off their outline, the same direction across the whole drawing (the generator default is right and slightly down). A sliver of paper shows on one side, the colour slips past the line on the other. Paper fills are not shifted. Not every motif does it: in the Figma library about one colour fill in five on people is an exact copy of its line path, sitting exactly under it.
- **Shadow shapes** — where depth needs it (inside a hood, between legs, under a hem), use a small ink-filled shape with no outline. Never a grey or a darker tint.
- **Hair** — an ink-filled mass with a rough edge, no outline; a few paper or detail strokes for strands if needed.
- **Same fill over same fill** — an ink line on an ink fill disappears. Where two shapes with the same fill overlap (an ink sleeve over an ink uniform), give the front shape a `paper` stroke at detail weight instead of ink, so the two separate.

### Coverage

Counted across all standard-mode library files (number of filled areas):

| Fill              | Share                        | Typical use                                                        |
| ----------------- | ---------------------------- | ------------------------------------------------------------------ |
| Ink (Lavender 90) | ≈ 50 % (mostly line artwork) | Line art, hair, dark windows, shadow shapes                        |
| Paper (white)     | ≈ 25 %                       | Bodies, faces, coats, animals, most objects                        |
| Blue 50           | ≈ 12 %                       | Background line art, distant buildings                             |
| Peach 40          | ≈ 8 %                        | The warm accent: trousers, signs, pins, harnesses, sun             |
| Lavender 40       | ≈ 3.5 %                      | Secondary clothing (trousers, helmets), shrubs in landscapes       |
| Blue 20           | ≈ 3 %                        | Backdrop disc, ground planes, far silhouettes                      |
| Blue 80           | < 1 %                        | Mid-dark details                                                   |
| Coral 40          | < 0.3 %                      | A rail line under a train, dotted path lines, staff uniform panels |

Read it as: the drawing is ink on paper, with a little lavender and one touch of peach.

---

## 3. Backdrop disc

The square motifs come in two variants, with and without a backdrop (`-background` in the file name). Animals, objects, concepts and hands have both; people, transport, devices and lost property have none.

- Blue 20, roughly circular, diameter about 60–65 % of the canvas (≈ 200 on 320).
- Centre slightly above the canvas middle, under the subject's head or upper body — not under its feet.
- Edge: ragged, with fine specks breaking off outward, like dry brush on paper. This is the only texture in the system.
- The subject **breaks out** of the disc: ears, signs, tails and the ground line run past its edge.
- "In circle" object variants put a small object fully inside a disc instead (Clock, Leaves, Send, Notification).

---

## 4. Ground

- One to three horizontal lines under the subject, broken into segments with small gaps, running well past the subject on both sides.
- The top line is ink at contour weight; lines below are shorter, inset and in Blue 50.
- Optional small tufts or pebbles in Blue 50 at the ends.
- In scenes, the ground is a Blue 20 plane or a single long line; in landscapes, water and roads are Blue 20 bands with coral dotted or wavy lines.

---

## 5. Composition per format

### Square — 320 × 320

- Subject spans 60–80 % of the width; ground line at about 83 % of the height (≈ 266).
- Keep 16+ units of air to the canvas edge for everything except the ground line and backdrop grain.
- One subject, at most one prop (a sign, a pole, a bench, a phone).
- Read order is left to right: subjects often face or move right, toward the content.
- An attention cue — three short radiating strokes — is allowed once, near the head.

### Scene — 356 × 291

- A person (or two) in the foreground, full colour, standing on the ground line, slightly left of centre.
- Behind them, a place in Blue 50 line art: city blocks with window grids, a station canopy, a bus or tram, a tree, scalloped clouds, a peach outline sun.
- Foreground figures overlap background lines; nothing in the background gets ink lines.

### Landscape — 1280 × 360 (32:9; library exports at 7680 × 2160)

- Horizon at about 55–60 % of the height; a Blue 20 water or ground band across the middle.
- Large ink-filled foliage masses (trees, bushes) framing one or both ends, with paper detail lines inside — the only place big ink areas appear.
- Lavender 40 shrub masses in the middle distance; Blue 20 flat building silhouettes far back.
- Small figures and vehicles (boat, train, scooter, bench, ducks) spread along the horizontal band like a frieze, each a small story.
- Coral as thin dotted or wavy lines marking paths and water only.

---

## 6. Motif vocabulary

The illustrations are about **meetings in everyday traffic**, set in **Norwegian nature and towns**.

- **Animals** carry the status messages: sheep at a cattle grid, a beaver with a cut cable, a hedgehog, a goat, ducks crossing, a moose in spring or winter, a muskox. They are drawn calmly and a little dry-humoured, never cartoonish — no big eyes, no smiles, no anthropomorphic clothing.
- **People** are ordinary travellers: walking with luggage, on a bike or scooter, with a child, a dog, a guide dog, in a wheelchair, reading a paper, checking the time. Diversity of age, body and ability is part of the brief.
- **Objects** are the props of travel: ticket, ticket machine, tap card, clock, calendar, letter, phone.
- **Transport**: bus, train, tram, boat, scooter — side view, simple, white body in the `vehicle` role, ink-filled windows with paper glints.
- **Concepts** combine objects with dashed route lines and peach map pins on a Blue 20 field.

### Drawing people

The people are **natural and figurative**: drawn as if from life, with the economy of a line drawing. That is what separates them from the flat "corporate" illustration style, and the difference is mostly proportion and form, not detail.

- **Proportions:** about 7–7.5 heads tall. The head is small; legs are long; shoulders are narrower than a cartoon's. A seated person's back curves and the shoulders slope.
- **Pose:** relaxed and observed — mid-step, weight on one leg, a slight turn of the torso, a head tilted toward what the person looks at. Never stiff, symmetric or frontal-and-flat.
- **Form:** organic, asymmetric contours. A torso narrows at the waist and breaks at the hips; a sleeve is wider at the elbow than the wrist. Never rectangles, ovals or blobs standing in for body parts.
- **Clothes:** loose and draping, with a few detail-weight fold lines where fabric bends (elbow, hip, knee, under the arm), cuffs, collars and hems as separate shapes, ribbing as short hatching. White as the base, drawn with the `cloth` role (not `paper`), Lavender 40 for one garment, Peach 40 for at most one. Bags, helmets and the frame of a bike or scooter the person rides are `cloth` too.
- **Hands:** small, with fingers — a thumb and two or three finger lines, wrapping round what they hold. Never a mitten.
- **Feet:** shoes with a separate sole shape; trousers break over them.
- **Face:** paper, only a nose, glasses optional — no eyes, no mouth (see §1); skin always paper.
- **Hair:** an ink mass with a rough edge and real volume — a bun, a bob, a ponytail that falls — plus a few paper or detail strokes for strands.

Check by putting the new figure next to a library person (Woman holding package, Man and woman hugging, Man checking the time) at the same height. If the head is bigger, the body blockier or the hands simpler, it is the wrong form.

- Entur staff wear an ink-filled uniform with Coral 40 shoulder and sleeve panels and a small paper name badge — the one place Coral covers more than a detail.

### Drawing animals

- Paper body, ink contour, small ink features (nose, eye dot, inner ear).
- Fur shown with a few detail strokes or short hatching on the belly — never all over.
- Posture tells the message: waiting, startled (attention marks), busy.

### Drawing vehicles

- Strict side view, long and low; contour slightly bowed.
- Windows as ink fills with one or two short paper glint strokes.
- Rail, road or water as a single line under it — a coral line under trains.

### Small vocabulary

| Element     | How                                                              |
| ----------- | ---------------------------------------------------------------- |
| Attention   | Three short ink strokes radiating above the head                 |
| Motion      | A loose Blue 50 loop or puff behind wheels or feet               |
| Route       | Dashed ink line, winding                                         |
| Destination | Peach map pin                                                    |
| Cloud       | Scalloped open Blue 50 line                                      |
| Sun         | Peach outline circle                                             |
| Tree (far)  | Blue 50 outline crown on a trunk; Lavender 40 fill in landscapes |
| Sign text   | Nationale Demibold, ink, Norwegian first ("Billetter Tickets")   |

---

## 7. Dark and contrast modes

Never redraw for a mode — swap colour roles (see `palette.md`).

- **Dark** (on Ebony 100): the drawing becomes a light, warm-grey object. Ink turns Ebony 65, paper (skin, animals, objects) turns Ebony 5, but white clothing and gear turn Ebony 30 and vehicle bodies Ebony 40, so a person reads as a light face on a mid-grey coat. The backdrop turns Ebony 20. Lit windows, lamps and the sun turn Canary 30 (the `glow` role) — the one dark-mode-only colour.
- **Reflectors** (dark only): people carry reflector shapes — bands on sleeves and trouser legs, patches on a jacket, stripes on a white cane. In standard and contrast they are there but invisible (white at 0 % opacity). In dark they turn white with a soft glow: six stacked white drop shadows, no offset, blur radius from about 0.2 to 12. A bike lamp adds a pale yellow beam (`#FFF4CD` at 30 %) and a Coral 30 tail light. This glow is the only effect in the library.
- **Contrast** (inside a Lavender 90 section): ink turns Blue 70, the backdrop disc turns Blue 90 so it reads against Lavender 90, white clothing and gear turn Blue 40; paper (skin, animals, objects), vehicle bodies, Peach and Lavender stay.

---

## 8. Avoid

- Outlined or expanded strokes, brush strokes, width profiles (marketing/print style)
- Gradients, drop shadows, blur, opacity fades, noise overlays (except the backdrop grain and the dark-mode reflector glow)
- The flat "corporate" figure: big head, eye dots, mitten hands, rectangle torso, tube limbs
- Eyes or a mouth on people of any kind, skin tones, rosy cheeks, smiling mascots
- Coral areas (except Entur staff uniforms), more than one Peach element, colours outside the palette
- Perspective views of vehicles and buildings; isometric scenes
- Text inside illustrations beyond a short sign
- Busy compositions: more than one subject plus one prop on a square
