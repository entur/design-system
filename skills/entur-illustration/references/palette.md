# Illustration palette and colour modes

Illustrations use a fixed subset of the Linje primitive colours. Draw with **roles**, never hex values: a role says what a colour does in the drawing, and each role has one value per colour mode. Every library motif ships in three modes built from the same drawing.

The values below were measured from the library SVGs; the standard → dark → contrast mapping was derived by matching 144 standard files element by element against their dark and contrast versions.

## Roles

| Role       | Does                                                       | Standard  | Primitive   | Dark      | Primitive | Contrast  | Primitive   |
| ---------- | ---------------------------------------------------------- | --------- | ----------- | --------- | --------- | --------- | ----------- |
| `ink`      | All foreground lines; hair, shadow shapes, dark windows    | `#181C56` | Lavender 90 | `#5E5F6C` | Ebony 65  | `#626493` | Blue 70     |
| `paper`    | Main fill: skin and faces, animals, objects                | `#FFFFFF` | White       | `#F2F2F5` | Ebony 5   | `#FFFFFF` | White       |
| `cloth`    | White clothing and gear on people: coats, bags, bike frame | `#FFFFFF` | White       | `#B3B4BD` | Ebony 30  | `#BCBDD2` | Blue 40     |
| `vehicle`  | White bodies of buses, trains, trams, boats, scooters      | `#FFFFFF` | White       | `#999AA7` | Ebony 40  | `#FFFFFF` | White       |
| `line2`    | Background and distant line art, second ground line        | `#9EA0BD` | Blue 50     | `#999AA7` | Ebony 40  | `#9EA0BD` | Blue 50     |
| `backdrop` | The grainy disc behind square motifs                       | `#EAEAF1` | Blue 20     | `#CCCDD4` | Ebony 20  | `#393D79` | Blue 90     |
| `tint`     | Pale fills: ground planes, far silhouettes, light details  | `#EAEAF1` | Blue 20     | `#B3B4BD` | Ebony 30  | `#BCBDD2` | Blue 40     |
| `lavender` | Secondary clothing, helmets, shrubs                        | `#AEB7E2` | Lavender 40 | `#81828F` | Ebony 50  | `#AEB7E2` | Lavender 40 |
| `mid`      | Mid-dark details (seat, strap, tyre)                       | `#54568C` | Blue 80     | `#81828F` | Ebony 50  | `#BCBDD2` | Blue 40     |
| `peach`    | The one warm accent per motif                              | `#FFBF9E` | Peach 40    | `#FFBF9E` | Peach 40  | `#FFBF9E` | Peach 40    |
| `coral`    | Only the line under a vehicle and staff uniform panels     | `#FF5959` | Coral 40    | `#FF9494` | Coral 30  | `#FF5959` | Coral 40    |
| `glow`     | Light sources: lit windows, lamps, sun in a scene          | `#9EA0BD` | Blue 50     | `#FFEEB3` | Canary 30 | `#9EA0BD` | Blue 50     |

A bike or scooter lamp beam in dark mode uses Canary 20 (`#FFF4CD`) at 30 % opacity; it does not exist in the other two modes, so add it by hand to the dark file only.

`tint` and `backdrop` share a value in standard mode but split in the other two: the disc must read against a dark or Lavender 90 surface, small pale fills must not. In dark mode the library disc is Ebony 20 at **30 % opacity** (`fill-opacity="0.3"` in Dog, Ducks, Doves and Sheep), so it sits back on the dark surface; at full opacity it comes out far too light. The trace and `linje-ink.mjs` write it that way.

`paper`, `cloth` and `vehicle` are all white in standard mode, so pick by **what the area is**, not by its colour. The library keeps skin, animals and objects light in every mode, but greys what people wear and ride. Across the People files, about half the white fills turn Ebony 30 in dark mode (137 of 269) and Blue 40 in contrast mode (138): the hoodie, the coat, the bag and the bike frame do, the face and hands do not. Vehicle bodies turn Ebony 40 in dark mode and stay white in contrast mode. Without this split, a person in dark mode becomes one flat light shape and the face no longer separates from the clothes.

## Surfaces

Each mode is designed for one surface. Preview on it before delivering.

| Mode     | File suffix | Surface                                  |
| -------- | ----------- | ---------------------------------------- |
| Standard | (none)      | White `#FFFFFF`                          |
| Dark     | `-darkmode` | Ebony 100 `#08091C` (dark mode frame)    |
| Contrast | `-contrast` | Lavender 90 `#181C56` (Contrast section) |

## Proportions

The drawing is ink on paper with a little Lavender and one touch of Peach. Rough share of filled areas across the library, standard mode:

| Ink  | Paper | Blue 50 | Peach 40 | Lavender 40 | Blue 20 | Blue 80 | Coral 40 |
| ---- | ----- | ------- | -------- | ----------- | ------- | ------- | -------- |
| 48 % | 25 %  | 12 %    | 8 %      | 3.5 %       | 3 %     | 0.6 %   | 0.25 %   |

## Not in the illustration palette

Do not use these in illustrations, even though they are Linje colours: the data visualisation palette, transport mode colours (bus, train, ferry and so on), status colours (success, warning, error), Jungle, Azure, Spring, Lilac. They have jobs elsewhere and would make an illustration read as UI.

## In code

The illustration files carry hex values, because they ship as static SVG. When an illustration is built inline in a React component and must follow the theme, map the roles to the matching primitive tokens from `@entur/tokens` and switch the whole set with `data-color-mode`, as the library's three files do.
