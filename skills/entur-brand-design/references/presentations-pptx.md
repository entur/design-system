# Building Entur Presentations with python-pptx

Full identity docs: https://linje.entur.no/identitet  
Template files: available internally (contact #talk-designsystem on Slack)

Use this guide when programmatically generating `.pptx` presentations for Entur — e.g. via Claude cowork, automated reporting, or script-based deck generation.

---

## Template files

| File                   | Purpose                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `template.pptx`        | Base for all new presentations — 7 slide masters, 51 named layouts, correct fonts, logo, and closing slides |
| `visual-elements.pptx` | Demo library of pre-built visuals — reference only, do NOT use as base                                      |
| `catalog.json`         | Machine-readable index of all 51 layouts + 7 masters (read this before building)                            |

> **Note:** Always start from `template.pptx`. Building from `visual-elements.pptx` gives the wrong masters and a mismatched layout palette.

---

## Slide dimensions

- **Size**: 13.33" × 7.50" (16:9 widescreen)
- **EMU**: 12 192 000 × 6 858 000
- **Font**: Arial (fallback for Nationale — use Arial unless you have a Nationale license)

---

## Type scale for presentations

| Element             | Size    | Weight  |
| ------------------- | ------- | ------- |
| Slide title         | 36–44pt | Bold    |
| Section/sub-heading | 24–28pt | Bold    |
| Ingress/intro text  | 18–20pt | Regular |
| Body text           | 14–16pt | Regular |
| Caption / footer    | 10–11pt | Regular |

---

## Layout index

Catalog layout numbers are globally sequential (01–51). python-pptx uses 0-indexed `masters[m].slide_layouts[l]` where `m` is master index and `l` is layout index within that master.

**Mapping rule**: layout number within a master = (catalog layout number) − (first catalog layout number in that master), 0-indexed.

| Use case                            | `masters[m]` | `.slide_layouts[l]` | Catalog name                                      |
| ----------------------------------- | ------------ | ------------------- | ------------------------------------------------- |
| Cover with image                    | `[0]`        | `[0]`               | Tittel, inngress og bilde                         |
| Cover, navy, no image               | `[0]`        | `[3]`               | 3 Tittel og ingress_blå                           |
| Agenda                              | `[1]`        | `[1]`               | Agenda + bullets                                  |
| Section divider                     | `[1]`        | `[2]`               | 1_Kapittelside                                    |
| Content — white canvas + title      | `[2]`        | `[22]`              | Tittel_blank ← **default for all custom content** |
| Content — fully blank white         | `[2]`        | `[25]`              | Blank_innholdsslide                               |
| Content — title + text + image area | `[2]`        | `[0]`               | Tittel, innhold og bilde_blank                    |
| Content — two columns               | `[2]`        | `[15]`              | Tittel, innhold og bilde (two-column)             |
| Content — navy canvas + title       | `[2]`        | `[23]`              | Tittel_blank blå                                  |
| Content — fully blank navy          | `[2]`        | `[24]`              | Blank blå_innholdsslide                           |
| Closing — tagline                   | `[6]`        | `[0]`               | Avslutning_Vi kommer lenger                       |
| Closing — thank you                 | `[6]`        | `[1]`               | Avslutning_Tusen takk!                            |

**Tittel_blank `[2][22]` content bounds** (safe area for custom shapes):

- Title placeholder (idx=0): x=0.49", y=0.51", w=12.36", h=1.23"
- Safe content area: x=0.55"–12.75", y=1.85"–6.90"
- Footer strip at y≥7.14" — do not overlap

---

## Step 1 — Read the catalog

Before building, read `catalog.json` from the skill base directory. It lists all 51 layouts with their master index, placeholder indices, and use cases. Do NOT generate slide thumbnails unless necessary.

---

## Step 2 — Plan the deck

Map a layout to every slide before writing any code:

```
1. COVER (required)
   masters[0].slide_layouts[0]  — cover with image
   masters[0].slide_layouts[3]  — navy text-only cover

2. AGENDA (optional — recommended for 4+ sections)
   masters[1].slide_layouts[1]  — idx 21–28 = individual agenda items

3. [Repeat per section]
   a. SECTION DIVIDER
      masters[1].slide_layouts[2]  — idx=0 title, idx=21 chapter number
   b. CONTENT SLIDES
      masters[2].slide_layouts[22] — Tittel_blank (primary content layout)
      masters[2].slide_layouts[25] — fully blank white (custom layout)

4. CLOSING (required)
   masters[6].slide_layouts[1]  — "Tusen takk!" — do NOT add title text, it's baked in
```

---

## Step 3 — Build with python-pptx

```python
from pptx import Presentation
from pptx.util import Emu, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

prs = Presentation('/path/to/template.pptx')
masters = prs.slide_masters

# Add a slide using the correct layout
slide = prs.slides.add_slide(masters[1].slide_layouts[2])  # section divider

# Safe placeholder access — always check idx exists before setting
def set_placeholder(slide, idx, text):
    for ph in slide.placeholders:
        if ph.placeholder_format.idx == idx:
            ph.text = text
            return
    # placeholder not found in this layout — skip silently

set_placeholder(slide, 0, "Section title")
set_placeholder(slide, 21, "01")

prs.save('output.pptx')
```

---

## Step 4 — Add visual content

Every content slide needs visual structure. Never dump raw paragraphs into a single textbox.

### Color and layout constants

```python
NAVY    = RGBColor(0x18, 0x1C, 0x56)
CORAL   = RGBColor(0xFF, 0x59, 0x59)
LAVLITE = RGBColor(0xE8, 0xEB, 0xF5)  # card backgrounds
LAVMID  = RGBColor(0xAE, 0xB7, 0xE2)  # medium lavender
WHITE   = RGBColor(0xFF, 0xFF, 0xFF)
GREY    = RGBColor(0x55, 0x55, 0x59)   # body text

W  = Emu(12192000)  # slide width
H  = Emu(6858000)   # slide height
LM = Emu(503000)    # left margin (0.55")
TM = Emu(1692000)   # top of content area (1.85")
CW = Emu(11161000)  # content width
```

### Helper functions

```python
def add_rect(slide, x, y, w, h, fill=None, line=None, line_pt=0.75):
    shape = slide.shapes.add_shape(1, x, y, w, h)
    if fill:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill
    else:
        shape.fill.background()
    if line:
        shape.line.color.rgb = line
        shape.line.width = Pt(line_pt)
    else:
        shape.line.fill.background()
    return shape


def add_textbox(slide, text, x, y, w, h, pt, bold=False, color=NAVY,
                wrap=True, align=PP_ALIGN.LEFT, italic=False, font='Arial'):
    txb = slide.shapes.add_textbox(x, y, w, h)
    tf = txb.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.name = font
    run.font.size = Pt(pt)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return txb


def add_image(slide, image_path, x, y, w, h):
    return slide.shapes.add_picture(image_path, x, y, w, h)
```

### Coral accent line (required on every content slide)

Every custom content slide using `Tittel_blank [2][22]` must have a coral accent line directly below the title:

```python
# Always add this after setting the title
add_rect(slide, LM, Emu(1692000), Emu(1800000), Emu(45000), fill=CORAL)
```

---

### Pattern 1: Title + coral line + bullet list

Use for: product descriptions, methodology, feature explanations.

```python
slide = prs.slides.add_slide(masters[2].slide_layouts[22])
set_placeholder(slide, 0, "API Statistikk")
add_rect(slide, LM, Emu(1692000), Emu(1800000), Emu(45000), fill=CORAL)

add_textbox(slide, "Bruksmønster fra Journeyplanner API",
            LM, Emu(1780000), CW, Emu(380000), pt=16, color=GREY)

bullets = [
    ("Aggregert statistikk", "Søkevolum, tidspunkt, søketyper og popularitet"),
    ("Bruksområde", "Kapasitetsplanlegging og trendanalyse"),
    ("Anonymisering", "k-anonymitet ≥ 5"),
]
y = Emu(2250000)
for label, detail in bullets:
    add_rect(slide, LM, y + Emu(110000), Emu(90000), Emu(90000), fill=NAVY)
    add_textbox(slide, label + ":", LM + Emu(160000), y,
                Emu(2200000), Emu(380000), pt=14, bold=True, color=NAVY)
    add_textbox(slide, detail, LM + Emu(2400000), y,
                Emu(8700000), Emu(380000), pt=14, color=GREY)
    y += Emu(500000)
```

---

### Pattern 2: Card grid (2×3)

Use for: overview of 5–6 parallel items.

```python
slide = prs.slides.add_slide(masters[2].slide_layouts[22])
set_placeholder(slide, 0, "Seks dataprodukter")
add_rect(slide, LM, Emu(1692000), Emu(1800000), Emu(45000), fill=CORAL)

items = [
    ("API Statistikk", "Bruksmønster i API"),
    ("Stoppesteder", "Data om holdeplasser og stasjoner"),
    ("Rutedata", "Planlagte avganger og linjer"),
    ("Sanntid", "Avvik og forsinkelser"),
    ("Billettsalg", "Aggregerte salgsdata"),
    ("Reisesøk", "Anonymiserte søkemønstre"),
]

CARD_W = Emu(3600000)
CARD_H = Emu(2050000)
GAP = Emu(130000)

for i, (title, desc) in enumerate(items):
    col = i % 3
    row = i // 3
    x = LM + col * (CARD_W + GAP)
    y = Emu(1820000) + row * (CARD_H + GAP)

    add_rect(slide, x, y, CARD_W, CARD_H, fill=LAVLITE, line=LAVMID, line_pt=0.75)
    add_rect(slide, x, y, CARD_W, Emu(160000), fill=NAVY)
    add_textbox(slide, title, x + Emu(160000), y + Emu(220000),
                CARD_W - Emu(320000), Emu(430000), pt=14, bold=True)
    add_textbox(slide, desc, x + Emu(160000), y + Emu(700000),
                CARD_W - Emu(320000), Emu(1200000), pt=12, color=GREY)
```

---

### Pattern 3: Flow diagram

Use for: pipeline or process slides with 3–5 sequential steps.

```python
slide = prs.slides.add_slide(masters[2].slide_layouts[22])
set_placeholder(slide, 0, "Fra søk til dataprodukter")
add_rect(slide, LM, Emu(1692000), Emu(1800000), Emu(45000), fill=CORAL)

steps = [
    ("Reisesøk",      "Journeyplanner\nAPI",             CORAL),
    ("Anonymisering", "k≥5 + romlig\ngeneralisering",    NAVY),
    ("Mellomlagring", "Daily base\n-clean / -rowbased",  NAVY),
    ("Dataprodukter", "6 pseudonymiserte\nprodukter",    NAVY),
]

BOX_W = Emu(2400000)
BOX_H = Emu(1600000)
ARROW_W = Emu(300000)
total_w = len(steps) * BOX_W + (len(steps) - 1) * ARROW_W
start_x = (W - total_w) // 2
y_box = Emu(2700000)

for i, (label, sub, fill) in enumerate(steps):
    x = start_x + i * (BOX_W + ARROW_W)
    add_rect(slide, x, y_box, BOX_W, BOX_H, fill=fill)
    add_textbox(slide, label, x, y_box + Emu(280000), BOX_W, Emu(500000),
                pt=14, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_textbox(slide, sub, x, y_box + Emu(850000), BOX_W, Emu(600000),
                pt=11, color=WHITE, align=PP_ALIGN.CENTER)
    if i < len(steps) - 1:
        add_rect(slide, x + BOX_W, y_box + BOX_H // 2 - Emu(40000),
                 ARROW_W, Emu(80000), fill=CORAL)
```

---

### Pattern 4: Stat highlight

Use for: key metric, threshold, or single statistic.

```python
slide = prs.slides.add_slide(masters[2].slide_layouts[22])
set_placeholder(slide, 0, "K-anonymitet")
add_rect(slide, LM, Emu(1692000), Emu(1800000), Emu(45000), fill=CORAL)

add_rect(slide, LM, TM, Emu(4200000), Emu(4200000), fill=NAVY)
add_textbox(slide, "k ≥ 5", LM, TM + Emu(1400000), Emu(4200000), Emu(1400000),
            pt=72, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
add_textbox(slide, "anonymitetskrav", LM, TM + Emu(2900000), Emu(4200000), Emu(600000),
            pt=14, color=LAVMID, align=PP_ALIGN.CENTER)

rx = LM + Emu(4500000)
add_textbox(slide, "Hva betyr dette?", rx, TM + Emu(200000),
            Emu(6600000), Emu(500000), pt=16, bold=True)
# Add bullet details below rx, incrementing y
```

---

### Pattern 5: Hierarchy / graduated bars

Use for: nested levels or graduated scales (e.g. geographic aggregation levels).

```python
slide = prs.slides.add_slide(masters[2].slide_layouts[22])
set_placeholder(slide, 0, "Romlig generalisering")
add_rect(slide, LM, Emu(1692000), Emu(1800000), Emu(45000), fill=CORAL)

levels = [
    ("Grunnkrets", "Fineste nivå — ~12 000 enheter",  Emu(5200000),  LAVLITE, NAVY),
    ("Delområde",  "Mellomnivå — ~3 500 enheter",     Emu(7200000),  LAVMID,  NAVY),
    ("Kommune",    "Groveste nivå — ~356 kommuner",   Emu(10400000), NAVY,    WHITE),
]
bar_h = Emu(900000)
gap = Emu(250000)

for i, (name, desc, width, fill, text_color) in enumerate(levels):
    y = Emu(2000000) + i * (bar_h + gap)
    cx = (W - width) // 2
    add_rect(slide, cx, y, width, bar_h,
             fill=fill, line=NAVY if fill == LAVLITE else None)
    add_textbox(slide, name, cx + Emu(200000), y + Emu(200000),
                Emu(2500000), Emu(500000), pt=16, bold=True, color=text_color)
    add_textbox(slide, desc, cx + Emu(2800000), y + Emu(200000),
                width - Emu(3000000), Emu(500000), pt=13, color=text_color)

add_textbox(slide, "← Finere                                       Grovere →",
            LM, Emu(5200000), CW, Emu(350000),
            pt=12, color=GREY, italic=True, align=PP_ALIGN.CENTER)
```

---

### Chart borders (4+ series)

When a chart uses more than 3 data series in a stacked, pie, donut, or treemap layout, add a light grey border to every segment to prevent visually similar colors from blurring together:

```python
from pptx.dml.color import RGBColor

GREY_BORDER = RGBColor(0xD0, 0xD3, 0xD2)

for series in chart.series:
    series.format.line.color.rgb = GREY_BORDER
    series.format.line.width = Pt(0.75)
```

In Chart.js (HTML/React):

```js
datasets: data.map(d => ({
  ...d,
  borderColor: '#D0D3D2',
  borderWidth: 1,
}));
```

---

## Step 5 — QA

Visually inspect all slides before delivering. Options:

```bash
# LibreOffice (if installed)
soffice --headless --convert-to pdf output.pptx
pdftoppm -r 150 output.pdf slides/slide

# If LibreOffice is unavailable, ask the user to open in PowerPoint
# and export to PDF manually for visual review
```

---

## Key rules

- **Always start from `template.pptx`** — it embeds the 7 correct Entur masters and all 51 layouts
- **Never text-dump** — every content slide needs visual hierarchy (use patterns above)
- **Default content layout**: `masters[2].slide_layouts[22]` (Tittel_blank)
- **Coral accent line** — always add below the title on every Tittel_blank slide
- **Closing**: use `masters[6].slide_layouts[1]` — do NOT set title text, it is baked into the master
- **Section dividers**: `masters[1].slide_layouts[2]` — idx=0 for title, idx=21 for chapter number
- **Agenda items**: `masters[1].slide_layouts[1]` — idx=21–28 for individual item labels
- **Never overlap** the footer strip at y≥7.14" (Emu≥6553000)
