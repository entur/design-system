# WCAG 2.2 A and AA rubric

One row per success criterion, plus 4.1.1 Parsing: it was removed from WCAG 2.2 but is still law through WCAG 2.1, so it is audited and labelled like the rest. Check each criterion against its pass condition, using only the evidence listed. Before labelling a finding, open the criterion's Understanding page from the [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) and confirm the number, level and exceptions. For 4.1.1, use the WCAG 2.1 Understanding page.

**Scope** says who can settle the criterion:

- **K** – the component decides it, so we test it.
- **S** – linje.entur.no decides it, so we test it on the site.
- **B** – _Betinget_: it depends on how the consumer uses the component, for example their headings, labels or link text. Test that the component makes it possible, and list it as Betinget in the matrix.
- **–** – not applicable: no media, timing or authentication in the packages. Mark it _Ikke relevant_ with the reason.

**Evidence:**

- **M** – measured: computed style, bounding box, contrast ratio or viewport. Only a measurement decides these criteria, never the model's judgement.
- **A** – an axe rule result.
- **I** – an interaction trace: key presses, focus sequence, before and after.
- **T** – the accessibility tree (`ariaSnapshot()`), the virtual screen reader's spoken output, or what a live region announces.
- **C** – code reading. This is only a lead. It never confirms a finding on its own.

**Manuell** marks criteria where both the model and automation are known to be unreliable. A finding there is _Må verifiseres manuelt_ unless an M, I or T observation confirms it.

| Criterion                                         | Level | Scope | Evidence | Pass condition                                                                                                                      | Manuell |
| ------------------------------------------------- | ----- | ----- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1.1.1 Ikke-tekstlig innhold                       | A     | K, B  | A, T     | Icons that convey meaning have a name; decorative icons are hidden                                                                  |         |
| 1.2.1–1.2.5 Tidsbaserte medier                    | A/AA  | –     | –        | No media in the packages                                                                                                            |         |
| 1.3.1 Informasjon og relasjoner                   | A     | K, S  | T, A     | Structure, groups, table headers and label–field links are in the tree                                                              |         |
| 1.3.2 Meningsfylt rekkefølge                      | A     | K     | T, I     | Reading and focus order match the visual order                                                                                      | ja      |
| 1.3.3 Sensoriske egenskaper                       | A     | B, S  | C        | Instructions do not rely on shape, position or sound alone                                                                          |         |
| 1.3.4 Visningsretning                             | AA    | K, S  | M        | Works in both orientations (iPhone 15, portrait and landscape)                                                                      |         |
| 1.3.5 Identifiser formål med input                | AA    | K, B  | T, C     | Input fields pass `autoComplete` through                                                                                            |         |
| 1.4.1 Bruk av farge                               | A     | K     | M        | Each state is still distinguishable under achromatopsia emulation                                                                   | ja      |
| 1.4.2 Styring av lyd                              | A     | –     | –        | No audio                                                                                                                            |         |
| 1.4.3 Kontrast (minimum)                          | AA    | K, S  | M, A     | Text at least 4.5:1, large text 3:1, in light, dark and contrast mode                                                               |         |
| 1.4.4 Endring av tekststørrelse                   | AA    | K, S  | M        | Nothing is clipped or overlapping at 200 % text size                                                                                |         |
| 1.4.5 Bilder av tekst                             | AA    | K, S  | C        | No text rendered as an image                                                                                                        |         |
| 1.4.10 Dynamisk tilpasning (reflow)               | AA    | K, S  | M        | No horizontal scroll at 320 CSS px, apart from exempt content such as tables                                                        | ja      |
| 1.4.11 Kontrast for ikke-tekstlig innhold         | AA    | K     | M        | Borders, icons, focus indicators and states at least 3:1 against what is next to them                                               |         |
| 1.4.12 Tekstavstand                               | AA    | K, S  | M        | Nothing is lost with the text spacing override                                                                                      | ja      |
| 1.4.13 Pekerfølsomt innhold eller innhold i fokus | AA    | K     | I        | Hover and focus content can be dismissed with Escape, can be hovered, and stays until dismissed                                     |         |
| 2.1.1 Tastatur                                    | A     | K, S  | I        | Every function works by keyboard, with the keys the role expects                                                                    | ja      |
| 2.1.2 Ingen tastaturfelle                         | A     | K     | I        | Focus can always leave with Tab, Shift+Tab or Escape                                                                                | ja      |
| 2.1.4 Hurtigtaster                                | A     | K     | I, C     | No single-character shortcuts, or they can be turned off                                                                            |         |
| 2.2.1 Justerbar hastighet                         | A     | K     | I, C     | Toasts and alerts that disappear can be extended or stopped                                                                         |         |
| 2.2.2 Pause, stopp, skjul                         | A     | K, S  | M, I     | Motion that starts automatically and lasts over 5 s can be paused                                                                   |         |
| 2.3.1 Terskelverdi på maksimalt tre glimt         | A     | –     | –        | Nothing in the packages flashes; test only if something does                                                                        |         |
| 2.4.1 Hoppe over blokker                          | A     | S     | I, T     | A skip link and landmarks on the site                                                                                               |         |
| 2.4.2 Sidetitler                                  | A     | S     | T        | Each page has a unique, descriptive `<title>`                                                                                       |         |
| 2.4.3 Fokusrekkefølge                             | A     | K, S  | I        | Focus moves in a logical order; it returns after a dialog or popover closes                                                         | ja      |
| 2.4.4 Formål med lenke (i kontekst)               | A     | B, S  | T        | Link texts on the site say where they go                                                                                            |         |
| 2.4.5 Flere måter                                 | AA    | S     | I        | Search and navigation on the site                                                                                                   |         |
| 2.4.6 Overskrifter og ledetekster                 | AA    | B, S  | T        | Headings and labels describe their content                                                                                          |         |
| 2.4.7 Synlig fokus                                | AA    | K, S  | M        | Computed style differs visibly between focused and unfocused (a forced-colors failure is Anbefaling)                                |         |
| 2.4.11 Fokus ikke skjult (minimum)                | AA    | K, S  | M        | The focused element is not fully covered by sticky or fixed content                                                                 |         |
| 2.5.1 Pekerbevegelser                             | A     | K     | I, C     | Multipoint or path gestures have a single-pointer alternative                                                                       |         |
| 2.5.2 Pekeravbrytelse                             | A     | K     | I, C     | Actions fire on up-event, or can be cancelled                                                                                       |         |
| 2.5.3 Ledetekst i navn                            | A     | K, B  | T, M     | The accessible name contains the visible label text                                                                                 | ja      |
| 2.5.4 Bevegelsesaktivering                        | A     | –     | –        | No motion sensors                                                                                                                   |         |
| 2.5.7 Drabevegelser                               | AA    | K     | I        | Dragging has a single-pointer alternative, for example in sliders and file upload                                                   | ja      |
| 2.5.8 Målstørrelse (minimum)                      | AA    | K     | M        | At least 24×24 CSS px, or covered by the spacing exception                                                                          |         |
| 3.1.1 Språk på siden                              | A     | S     | T        | `<html lang="nb">`                                                                                                                  |         |
| 3.1.2 Språk på deler av innholdet                 | AA    | S     | T        | Text in other languages has `lang`                                                                                                  |         |
| 3.2.1 Fokus                                       | A     | K     | I        | Focus alone causes no change of context                                                                                             |         |
| 3.2.2 Inndata                                     | A     | K     | I        | Input causes no unexpected change of context                                                                                        |         |
| 3.2.3 Konsekvent navigering                       | AA    | S     | I        | Navigation is in the same order on every page                                                                                       |         |
| 3.2.4 Konsekvent identifikasjon                   | AA    | K, S  | T        | The same function has the same name across components                                                                               |         |
| 3.2.6 Konsekvent hjelp                            | A     | S     | I        | Help is in the same place on every page                                                                                             |         |
| 3.3.1 Identifikasjon av feil                      | A     | K, B  | T        | The error is described in text and linked to the field                                                                              |         |
| 3.3.2 Ledetekster eller instruksjoner             | A     | K, B  | T        | A visible label; the format is explained where needed                                                                               |         |
| 3.3.3 Forslag ved feil                            | AA    | B     | C        | The consumer writes the error text; the component must show it                                                                      |         |
| 3.3.4 Forhindring av feil                         | AA    | –     | –        | Not decided by the components                                                                                                       |         |
| 3.3.7 Overflødig inntasting                       | A     | B     | C        | Not decided by the components                                                                                                       |         |
| 3.3.8 Tilgjengelig autentisering (minimum)        | AA    | –     | –        | No authentication                                                                                                                   |         |
| 4.1.1 Parsing (oppdeling, kun 2.1)                | A     | K, S  | A, T     | No duplicate IDs that ARIA or labels refer to, and no element nested where the spec forbids it (such as a `div` directly in a `ul`) |         |
| 4.1.2 Navn, rolle, verdi                          | A     | K     | T, A     | Role, name, state and value are correct before and after interaction                                                                |         |
| 4.1.3 Statusbeskjeder                             | AA    | K     | T        | Status and error messages are announced without moving focus                                                                        |         |

Beyond AA, so **Anbefaling** at most:

- 2.3.3 Animasjon fra interaksjoner (AAA): `prefers-reduced-motion`.
- 2.5.5 Målstørrelse (forbedret) (AAA): 44×44 px.
- 1.4.6 Kontrast (forbedret) (AAA).
- Complex widgets, such as data grids, drag and drop, tree views and toasts. Their keyboard and screen reader behaviour is always _Må verifiseres manuelt_.
