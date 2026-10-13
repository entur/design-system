# Building with Entur Linje

Entur's design system. Every component, hook and `@entur/icons` icon (`SearchIcon`, `AddIcon`, `ForwardIcon`, `BusIcon`, ...) is on `window.EnturLinje`. In production code each name maps 1:1 to its npm package, for example `Button` from `@entur/button`, `TextField` from `@entur/form`, and icons from `@entur/icons`. Write UI text in Norwegian Bokmål.

## Setup

- Load `styles.css` once. Components are then fully styled; no root provider is needed.
- Add a provider only where a component needs context:
  - `ToastProvider` wraps the app when you use `useToast()` or `CopyableText`. `CopyableText` throws without it.
  - `Contrast` renders its children on the dark-blue contrast surface. Components inside switch to their contrast styling automatically. Use it for dark headers, footers and hero panels.
  - `VariantProvider variant="negative"` (or `success`, `warning`, `information`) sets the validation state of every form field nested inside it.
- Dark mode: set `data-color-mode="dark"` on a root element. All `--basecolors-*` tokens switch; light is the default.
- The stylesheet sets no font on `body`. Put text in the typography components (`Heading1`–`Heading6`, `LeadParagraph`, `Paragraph`, `SubParagraph`, `SmallText`, `Label`), or set `font-family: Nationale, Arial, sans-serif` on your app root.

## Styling

- Style components through their props (`variant`, `size`, `width`, `margin`, ...). Never target the internal `eds-*` classes.
- `SideNavigation` is the beta version (`@entur/menu/beta`). Compose it from its own parts: `SideNavigation.Group` (a heading), `SideNavigation.Item` and `SideNavigation.ExpandableItem` (a submenu). A collapsible sidebar comes from the app shell, `Template.Portal.Sidebar` with its `collapsed` prop.
- For form fields, use the complete components (`TextField`, `TextArea`, `Dropdown`, `DatePicker`, ...), which move the floating label themselves. `BaseFormControl` is only the frame: when you use it directly, keep the value in state and pass `isFilled={value !== ''}`, or the label stays up after the field is emptied.
- Icons from `@entur/icons` take the text colour, except transport icons (`BusIcon`, `TrainIcon`, `FerryIcon`, ...), which carry their own transport colour. Inside controls such as `SegmentedChoice`, give them the base colour with `color="currentColor"`, and put icon and label in an `inline-flex` row with `gap: var(--space-extra-small)`.
- The icon prop `inline` is only for icons in running text. Components that lay out their own icons, such as `Tag`, take the icon as a plain child next to the text (`<Tag><ClockIcon aria-hidden />14:32</Tag>`); `inline` there pushes the icon below the centre line.
- Components with an `as` prop are polymorphic. They forward every native attribute of the element they render (`href`, `type`, `target`, ...).
- For your own layout glue, use inline styles with the token custom properties:

| Purpose         | Tokens                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spacing         | `--space-extra-small2` 0.25rem, `--space-extra-small` 0.5, `--space-small` 0.75, `--space-default` 1, `--space-large` 1.5, `--space-extra-large` 2 … `--space-extra-large9` 6rem |
| Surfaces        | `--basecolors-frame-default`, `-tint`, `-subdued`, `-elevated`, `-contrast`                                                                                                      |
| Text colour     | `--basecolors-text-accent` (primary), `-subdued`, `-light` (on contrast), `-disabled`                                                                                            |
| Borders         | `--basecolors-stroke-default`, `-subdued`, `-light`; `--border-radiuses-small`/`-medium`/`-large`; `--border-widths-default`                                                     |
| Type            | `--font-weights-body`, `--font-weights-heading` (sizes come from the typography components)                                                                                      |
| Elevation       | `--shadows-card-shadow`, `--shadows-focus`                                                                                                                                       |
| Transport modes | `--colors-transport-default-<mode>`, `--colors-transport-contrast-<mode>` (`bus`, `metro`, `tram`, `ferry`, ...)                                                                 |

- Page layout: `GridContainer` + `GridItem` (12-column grid), or `Flex`/`Grid` with the `gap` prop.

## Illustrations

Entur's illustration library ships as CSS classes. The full list of names is in `illustrations/README.md`.

```jsx
<div
  className="linje-illustration linje-illustration--sheep"
  role="img"
  aria-label="Sau som ser seg rundt"
  style={{ width: 240 }}
/>
```

- Give the element a width; height follows the illustration's aspect ratio (by default it fills its container). Use `aria-hidden` instead of `role`/`aria-label` when the text next to it already says the same.
- Dark mode and `Contrast` swap in the matching variant automatically. Names ending in `-background` or `-circle` add a soft round shape behind the motif.
- Use illustrations freely as part of the interface wherever they support the content: beside a section heading, on cards and feature blocks, in onboarding steps, on landing and information pages, as well as in modals, messages and empty states. Pick a motif that matches the content, e.g. `bus` or `train` for a travel section, `tap-card` for payment, `man-standing-with-dog` for travelling with pets.
- Entur's guidelines, as recommendations rather than rules: they work best to soften and humanise a page; around three per view keeps a page calm, and a multi-column grid suits several at once; dense, data-heavy views such as tables and dashboards usually read better without them.
- `frontpage-summer` / `frontpage-winter` are wide banners, well suited to intro and onboarding pages or a page hero.
- Status messages always use these fixed illustrations:

| Situation                             | Illustration       |
| ------------------------------------- | ------------------ |
| Ingen treff / systemfeil              | `sheep`            |
| Fant ikke siden (404) / ingen tilgang | `musk`             |
| Ingen nett                            | `beaver`           |
| Pålogging og profil                   | `squirrel`         |
| Sesjon utløpt                         | `hedgehog`         |
| Innhold mangler                       | `leaves`, `rabbit` |
| Betaling pågår                        | `ducks`            |
| Leter etter plass                     | `doves`            |
| Behandler refusjon                    | `goat`             |
| Personvern og cookies                 | `kitty`, `mouse`   |

## Where the truth lives

- `tokens/*.css`: `base.css` (light and dark surface/text/stroke), `semantic.css`, `primitive.css`, `styles.css` (spacing, radius, type, shadows), `transport.css`, `data.css`. Read them before styling.
- `components/<group>/<Name>/<Name>.d.ts` is the props contract; `<Name>.prompt.md` shows usage.

## Example

```jsx
const { Heading2, TextField, Button, ButtonGroup, SearchIcon } =
  window.EnturLinje;

<section
  style={{
    display: 'grid',
    gap: 'var(--space-large)',
    padding: 'var(--space-extra-large)',
    background: 'var(--basecolors-frame-tint)',
    borderRadius: 'var(--border-radiuses-large)',
    maxWidth: 480,
  }}
>
  <Heading2 margin="none">Finn reise</Heading2>
  <TextField
    label="Fra"
    prepend={<SearchIcon inline />}
    placeholder="F.eks. Oslo S"
  />
  <TextField label="Til" prepend={<SearchIcon inline />} />
  <ButtonGroup>
    <Button variant="primary">Søk etter reise</Button>
  </ButtonGroup>
</section>;
```
