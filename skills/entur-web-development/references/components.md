# Entur Linje — Component Reference

Full API docs: https://linje.entur.no/komponenter

## Quick lookup — package → components

| Package                  | Key exports                                                                                                                                                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@entur/button`          | `PrimaryButton`, `SecondaryButton`, `NegativeButton`, `SuccessButton`, `IconButton`, `ButtonGroup`, `FloatingButton`, `SecondarySquareButton`, `SuccessSquareButton` — plus deprecated `TertiaryButton`, `TertiarySquareButton`          |
| `@entur/typography`      | `Heading1`–`Heading6`, `Paragraph`, `LeadParagraph`, `SubParagraph`, `SmallText`, `Label`, `SubLabel`, `Link`, `StrongText`, `EmphasizedText`, `Blockquote`, `CodeText`, `PreformattedText`, `ListItem`, `UnorderedList`, `NumberedList` |
| `@entur/form`            | `TextField`, `TextArea`, `Checkbox`, `Radio`, `RadioGroup`, `RadioPanel`, `CheckboxPanel`, `Switch`, `Fieldset`, `FeedbackText`, `InputGroupLabel`, `SegmentedControl`                                                                   |
| `@entur/alert`           | `BannerAlertBox`, `SmallAlertBox`, `ToastAlertBox`, `BannerExpandableAlertBox`, `SmallExpandableAlertBox`, `CopyableText`, `ToastProvider`, `useToast`                                                                                   |
| `@entur/menu`            | `SideNavigation`, `SideNavigationItem`, `SideNavigationGroup`, `CollapsibleSideNavigation`, `TopNavigationItem`, `BreadcrumbNavigation`, `BreadcrumbItem`, `OverflowMenu`, `Pagination`, `Stepper`                                       |
| `@entur/layout`          | `Contrast`, `NavigationCard`, `MediaCard`, `Badge`, `BulletBadge`, `NotificationBadge`, `StatusBadge`, `Tag`                                                                                                                             |
| `@entur/layout/beta`     | `Grid`, `GridItem`, `Flex`, `FlexSpacer`, `Template` (`Template.Portal` app shell) — **beta, API may change**                                                                                                                            |
| `@entur/typography/beta` | `Heading`, `Text`, `TextContainer`, `Link`, `Label`, `UnorderedList`, `NumberedList`, `ListItem` — **beta, API may change**                                                                                                              |
| `@entur/menu/beta`       | `SideNavigation` (`SideNavigation.Group`, `.Item`, `.ExpandableItem`) — supersedes the stable `SideNavigation`; `Footer` (`Footer.Brand`, `.LinkGroup`). **beta, API may change**                                                        |
| `@entur/grid`            | `GridContainer`, `GridItem`                                                                                                                                                                                                              |
| `@entur/modal`           | `Modal`, `Drawer`                                                                                                                                                                                                                        |
| `@entur/tooltip`         | `Tooltip`, `Popover`                                                                                                                                                                                                                     |
| `@entur/table`           | `Table`, `TableHead`, `TableBody`, `TableFooter`, `TableRow`, `HeaderCell`, `DataCell`, `EditableCell`, `ExpandableRow`, `ExpandRowButton`, `useSortableData`, `useTableKeyboardNavigation`                                              |
| `@entur/expand`          | `Accordion`, `AccordionItem`, `ExpandablePanel`, `ExpandableText`, `ExpandableTextButton`, `ExpandArrow`                                                                                                                                 |
| `@entur/tab`             | `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`                                                                                                                                                                                        |
| `@entur/travel`          | `TravelHeader`, `TravelTag`, `LegLine`, `TravelLeg`, `TravelSwitch`                                                                                                                                                                      |
| `@entur/loader`          | `Loader`, `Spinner`, `LoadingDots`, `SkeletonRectangle`, `SkeletonCircle`, `SkeletonWrapper`                                                                                                                                             |
| `@entur/chip`            | `ChoiceChip`, `ChoiceChipGroup`, `FilterChip`, `ActionChip`, `TagChip`                                                                                                                                                                   |
| `@entur/dropdown`        | `Dropdown`, `SearchableDropdown`, `MultiSelect`, `NativeDropdown`                                                                                                                                                                        |
| `@entur/datepicker`      | `DatePicker`, `TimePicker`                                                                                                                                                                                                               |
| `@entur/fileupload`      | `FileUpload`                                                                                                                                                                                                                             |
| `@entur/a11y`            | `SkipToContent`, `VisuallyHidden`                                                                                                                                                                                                        |

Common patterns: all imports are named exports. Buttons are polymorphic (`as="a"`). TextField variants: `"success"` | `"information"` | `"warning"` | `"negative"` (omit for default). Alert variants: `"information"` | `"success"` | `"warning"` | `"negative"`. Transport modes: `"rail"` | `"bus"` | `"metro"` | `"tram"` | `"ferry"` | `"plane"` | `"bicycle"` | `"walk"` + others.

---

## Detailed usage examples

Read below only when you need code examples for a specific component category.

---

## Buttons

Package: `@entur/button`

Use the right variant for the action's importance. Avoid multiple primaries in the same view — they compete for attention.

```tsx
import { PrimaryButton, SecondaryButton, NegativeButton, SuccessButton, IconButton, ButtonGroup } from '@entur/button';

// Primary — main call to action
<PrimaryButton onClick={handleSubmit}>Kjøp billett</PrimaryButton>

// Secondary — alternative actions
<SecondaryButton onClick={handleCancel}>Avbryt</SecondaryButton>

// Low-emphasis, often in dense UIs — TertiaryButton is deprecated, use size="small"
<SecondaryButton size="small">Les mer</SecondaryButton>

// Destructive action
<NegativeButton onClick={handleDelete}>Slett</NegativeButton>

// Icon-only button — always provide aria-label
<IconButton aria-label="Lukk"><CloseIcon /></IconButton>

// Group related buttons
<ButtonGroup>
  <PrimaryButton>Bekreft</PrimaryButton>
  <SecondaryButton>Avbryt</SecondaryButton>
</ButtonGroup>
```

Polymorphic — renders as `<a>` when needed:

```tsx
<PrimaryButton as="a" href="/reiseplanlegger">
  Planlegg reise
</PrimaryButton>
```

---

## Typography

Package: `@entur/typography`

Use semantic heading levels (`Heading1`–`Heading6`) for document structure, not for visual sizing. Pair with `Paragraph`, `LeadParagraph`, `SmallText`, and `Label` for body content. Don't wrap button, checkbox or other component text in typography components to restyle it — components set their own text styles.

```tsx
import { Heading1, Heading2, Paragraph, LeadParagraph, SmallText, Label, SubLabel, Link } from '@entur/typography';

<Heading1>Finn din neste reise</Heading1>
<LeadParagraph>Søk blant tusenvis av avganger i Norge.</LeadParagraph>
<Paragraph>Bruk reiseplanleggeren for å finne beste rute.</Paragraph>
<SmallText>* Avgangstider kan avvike</SmallText>
<Label>Velg dato</Label>
<Link href="/hjelp">Trenger du hjelp?</Link>
```

### Running text with `@entur/typography/beta`

Text components in the new typography have no margins. Put running text (articles, help pages, terms, rich text from a CMS) in a `TextContainer`, which spaces its children like the Figma text styles. Outside it, use `Flex gap` or `spacing`.

```tsx
import {
  TextContainer,
  Heading,
  Text,
  UnorderedList,
  ListItem,
} from '@entur/typography/beta';

<TextContainer>
  <Heading as="h2" variant="title-2">
    Før du reiser
  </Heading>
  <Text variant="paragraph">Sjekk dette før avgang:</Text>
  <UnorderedList>
    <ListItem>Gyldig billett</ListItem>
  </UnorderedList>
</TextContainer>;
```

- The gap between two elements is the first one's space after plus the second one's space before (more above a heading, except right after another heading or an `overline`), the same sum as auto layout in Figma. Each gap is one top margin, so nothing collapses.
- Only direct children are spaced: wrap the element whose children are the text blocks. Raw `h1`–`h6`, `p`, lists, `blockquote` and `pre` (Markdown, CMS HTML) get the same rhythm. Other elements get the paragraph space, and tables and loose text get the body text style. Inline elements, buttons, floats and loose text behave as normal text.
- Adjust a gap with `spacing` on the child, not with CSS margins: `{ top }` replaces the space before, `{ bottom }` the space after. Project CSS is unlayered and wins over the rhythm. If both sides of a gap set `spacing`, the larger one wins.
- Global element rules in the app (`* { margin: 0 }`, `a { … }`, `p { margin }`, `h2 { font-size }`) also win over the typography components: the gaps disappear, links get a double underline, headings ignore `variant`. Move them into `core.reset` or `core.base`, see [css-layers.md](css-layers.md#the-beta-typography-and-your-global-css).
- Group a heading with an overline or subtitle in `hgroup`: it is spaced as one heading, and its children get the same rhythm inside.
- A heading that links somewhere: put the link inside the heading, `<Heading as="h2"><Link href="/billetter">Billetter</Link></Heading>`. The link takes the heading's size. Never `Heading as="a"`, which removes the heading from the outline that screen readers navigate by (WCAG 1.3.1). A router link goes in `Link as={RouterLink}`.
- A paragraph right before a list is close to it, since it usually introduces the list. If it doesn't, give the paragraph `spacing={{ bottom: 'xl' }}`.
- Put an image, table or quote with its caption or source in `figure` + `figcaption`. The caption gets a small gap. A `caption` directly after an image or table gets the same gap without a `figure`.
- Mark a decorative first child (an absolutely positioned background) `aria-hidden="true"`, so the first text gets no space above.

Entur font: **Nationale** (licensed). In production apps, use the token-based font stack from `@entur/tokens`.

---

## Forms

Package: `@entur/form`

All form components are accessible by default. Always pair inputs with visible labels.

```tsx
import { TextField, TextArea, Checkbox, Radio, RadioGroup, Switch, Fieldset } from '@entur/form';

// Text input
<TextField
  label="E-postadresse"
  value={email}
  onChange={e => setEmail(e.target.value)}
  placeholder="navn@eksempel.no"
/>

// With validation feedback
// feedback is announced to screen readers via role="status" — no aria-live of your own.
// Pass ariaAlertOnFeedback for role="alert", or ariaAlertOnFeedback={false} to stay silent.
<TextField
  label="Mobilnummer"
  value={phone}
  onChange={e => setPhone(e.target.value)}
  variant="negative"
  feedback="Ugyldig mobilnummer"
/>

// Textarea
<TextArea label="Kommentar" rows={4} />

// Checkbox
<Checkbox checked={accepted} onChange={e => setAccepted(e.target.checked)}>
  Jeg godtar vilkårene
</Checkbox>

// Radio group — name is required; onChange receives the event
<RadioGroup
  name="reisemate"
  label="Reisemåte"
  value={mode}
  onChange={e => setMode(e.target.value)}
>
  <Radio value="tog">Tog</Radio>
  <Radio value="buss">Buss</Radio>
</RadioGroup>

// Toggle
<Switch checked={notifications} onChange={e => setNotifications(e.target.checked)}>
  Varsler på e-post
</Switch>
```

TextField `variant` values: `"success"` | `"information"` | `"warning"` | `"negative"` (omit for default)

---

## Alerts

Package: `@entur/alert`

```tsx
import { BannerAlertBox, SmallAlertBox, ToastProvider, useToast } from '@entur/alert';

// Banner (page-level messages)
<BannerAlertBox variant="information" title="Planlagt vedlikehold">
  Tjenesten vil være nede 22. april kl. 02–04.
</BannerAlertBox>

// Inline/small alert
<SmallAlertBox variant="negative">Reisen er ikke lenger tilgjengelig.</SmallAlertBox>

// Toast notifications — wrap app in provider
<ToastProvider>
  <App />
</ToastProvider>

// Use toast in any component
const { addToast } = useToast();
addToast({ title: 'Lagret!', content: 'Endringene er lagret.', variant: 'success' });
```

Variants: `"information"` | `"success"` | `"warning"` | `"negative"`

---

## Navigation

Package: `@entur/menu`

```tsx
import { SideNavigation, SideNavigationItem, SideNavigationGroup, BreadcrumbNavigation, BreadcrumbItem, Pagination, Stepper } from '@entur/menu';

// Sidebar nav
<SideNavigation>
  <SideNavigationItem href="/hjem" active>Hjem</SideNavigationItem>
  <SideNavigationGroup title="Reiser">
    <SideNavigationItem href="/reiser">Mine reiser</SideNavigationItem>
    <SideNavigationItem href="/bestillinger">Bestillinger</SideNavigationItem>
  </SideNavigationGroup>
</SideNavigation>

// Breadcrumbs
<BreadcrumbNavigation>
  <BreadcrumbItem href="/">Hjem</BreadcrumbItem>
  <BreadcrumbItem href="/reiser">Reiser</BreadcrumbItem>
  <BreadcrumbItem>Detaljer</BreadcrumbItem>
</BreadcrumbNavigation>

// Pagination
<Pagination
  currentPage={3}
  pageCount={10}
  onPageChange={setPage}
/>

// Step indicator
<Stepper activeIndex={1} steps={['Velg reise', 'Passasjerer', 'Betaling', 'Bekreftelse']} />
```

`SideNavigationItem` renders an `<a>`, and an anchor without `href` is neither focusable nor announced as a link. Give it an `href`, or `as="button" onClick`.

### Footer (`@entur/menu/beta`)

Footer for Entur products: sites for travellers, documentation and simpler tools. Don't add one to heavy work tools used for most of the working day — put links like the accessibility statement and privacy in the help menu or side menu there instead.

```tsx
import { Footer } from '@entur/menu/beta';
import { Link } from '@entur/typography/beta';

<Footer>
  <Footer.Brand productName="Navn">
    Entur gjør det enklere å reise kollektivt i hele Norge.
  </Footer.Brand>
  <Footer.LinkGroup title="Tjenester">
    <Link href="/reiseplanlegger">Reiseplanlegger</Link>
  </Footer.LinkGroup>
  <Footer.LinkGroup title="Om nettstedet">
    <Link href="/tilgjengelighet">Tilgjengelighetserklæring</Link>
    <Link href="/personvern">Personvern</Link>
    <Link as="button" type="button" onClick={openConsent}>
      Informasjonskapsler
    </Link>
  </Footer.LinkGroup>
</Footer>;
```

- Load both `@entur/menu/styles` (the logo lives there) and `@entur/menu/beta/styles`, plus the styles of `@entur/button` and `@entur/typography/beta`.
- `Footer.Brand` renders the Entur logo with `productName`; the text under it goes in `children` (no default, write it yourself). Put an address or org number in an `<address>` there if needed.
- At most three `Footer.LinkGroup`s, with «Om nettstedet» on the far right. More groups fit but every column gets narrower.
- The subfooter (copyright, entur.no) is built in and can't be changed. Add Entur's social media with `showSocialMedia` only in services for travellers and other private individuals (B2C), not in B2B. Translate their list name with `socialMediaLabel`.
- Place `<Footer>` after `<main>`, full width — on pages with a side menu, below both the side menu and the content. Never inside `<main>`, or it is no longer the `contentinfo` landmark.
- The layout follows the footer's own width (container queries): one column, two from 800px, one row from 1200px. Its content should line up with the top bar: match a centered top bar with `--eds-footer-max-width`, and a different side padding with `--eds-footer-padding-inline`.
- Use `contrast` for the dark variant. Inside a `Contrast` wrapper the footer is always contrast.

---

## Layout & Cards

Package: `@entur/layout`

```tsx
import { Contrast, NavigationCard, Badge, StatusBadge, Tag } from '@entur/layout';
import { GridContainer, GridItem } from '@entur/grid';

// Contrast section (dark background using Entur brand colors)
<Contrast>
  <Heading1>Planlegg reisen din</Heading1>
</Contrast>

// Responsive grid
<GridContainer>
  <GridItem small={12} medium={6} large={4}>
    <NavigationCard title="Tog" href="/tog" />
  </GridItem>
</GridContainer>

// Badges — variant is required
<Badge variant="primary">3</Badge>
<StatusBadge variant="success">Aktiv</StatusBadge>

// Tag chips for labeling
<Tag>Regional</Tag>
```

---

## Overlays

Package: `@entur/modal`

```tsx
import { Modal, Drawer } from '@entur/modal';
import { Tooltip, Popover } from '@entur/tooltip';

// Modal dialog — content goes straight in as children; size is required
<Modal
  open={isOpen}
  onDismiss={() => setOpen(false)}
  size="small"
  title="Bekreft kjøp"
>
  Er du sikker på at du vil kjøpe billetten?
</Modal>

// Drawer (slides from side)
<Drawer title="Filter" open={drawerOpen} onDismiss={() => setDrawerOpen(false)}>
  <p>Filterinnstillinger</p>
</Drawer>

// Tooltip
<Tooltip placement="top" content="Vis priser inkl. mva.">
  <InfoIcon />
</Tooltip>
```

---

## Data Display

Package: `@entur/table`, `@entur/expand`, `@entur/tab`

```tsx
import { Table, TableHead, TableBody, TableRow, HeaderCell, DataCell } from '@entur/table';
import { Accordion, AccordionItem } from '@entur/expand';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab';

// Table
<Table>
  <TableHead>
    <TableRow>
      <HeaderCell>Avgang</HeaderCell>
      <HeaderCell>Ankomst</HeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <DataCell>Oslo S 08:00</DataCell>
      <DataCell>Bergen 13:30</DataCell>
    </TableRow>
  </TableBody>
</Table>

// Accordion
<Accordion>
  <AccordionItem title="Regler for bagasje">
    Du kan ta med inntil 23 kg innsjekket bagasje.
  </AccordionItem>
</Accordion>

// Tabs
<Tabs>
  <TabList>
    <Tab>Avganger</Tab>
    <Tab>Ankomster</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>…avgangsliste…</TabPanel>
    <TabPanel>…ankomstliste…</TabPanel>
  </TabPanels>
</Tabs>
```

### Tabs: keep the tabs and panels in the markup

`TabList` and `TabPanels` number their children by position, and the panel at position _n_ belongs to the tab at position _n_. Render both directly, one `TabList` and one `TabPanels` per `Tabs`, and build them from the same data so they cannot drift apart:

```tsx
<Tabs>
  <TabList>
    {views.map(view => (
      <Tab key={view.id}>{view.title}</Tab>
    ))}
  </TabList>
  <TabPanels>
    {views.map(view => (
      <TabPanel key={view.id}>{view.content}</TabPanel>
    ))}
  </TabPanels>
</Tabs>
```

Fragments, `Suspense` boundaries and plain elements are transparent, so nesting tabs or panels inside them is fine. A component of your own is not: it counts as one child whether it renders one panel, several, or none at all. So don't put a wrapper component, a heading component, or a component-per-panel inside `TabPanels` — and put conditionals on the tab and its panel together, never on just one.

When a panel genuinely has to live inside a component of your own, pass the position explicitly with the `index` prop on `Tab` and `TabPanel`; it wins over the inherited one. In development the components log a warning or error when the indices cannot line up.

---

## Travel-specific

Package: `@entur/travel`

Specialized components for public transport UIs. Use these for any travel-related UI to ensure consistency with Entur's travel products.

```tsx
import { TravelHeader, TravelTag, LegLine, TravelLeg, TravelSwitch } from '@entur/travel';

// Transport mode tags (colored by mode)
<TravelTag transport="rail">Tog</TravelTag>
<TravelTag transport="bus">Buss</TravelTag>
<TravelTag transport="metro">T-bane</TravelTag>

// Journey leg visualization — transport and direction are both required.
// TravelLeg draws the line itself and takes no children.
<TravelLeg transport="rail" direction="vertical" />
```

Transport modes: `"rail"` | `"bus"` | `"metro"` | `"tram"` | `"ferry"` | `"plane"` | `"bicycle"` | `"walk"` | `"mobility"` | `"cableway"` | `"funicular"` | `"helicopter"` | `"taxi"` | `"railReplacementBus"` (buss for tog)

---

## Date & Time

Package: `@entur/datepicker`

```tsx
import { DatePicker, TimePicker } from '@entur/datepicker';

// Date picker — selectedDate is required; onChange may be called with null
<DatePicker label="Reisedato" selectedDate={date} onChange={setDate} />

// Time picker — selectedTime is required
<TimePicker label="Avgangstid" selectedTime={time} onChange={setTime} />
```

---

## File Upload

Package: `@entur/fileupload`

```tsx
import { FileUpload } from '@entur/fileupload';

const [files, setFiles] = useState<File[]>([]);

<FileUpload
  label="Last opp vedlegg"
  accept=".pdf,.jpg,.png"
  files={files}
  onDrop={newFiles => setFiles(prev => [...prev, ...newFiles])}
  onDelete={file => setFiles(prev => prev.filter(f => f !== file))}
/>;
```

---

## Utility

```tsx
// Loading states
import { Loader, Spinner, SkeletonRectangle } from '@entur/loader';

<Loader>Laster avganger…</Loader>
<Spinner />
<SkeletonRectangle width="100%" height={40} />

// Chips for selection/filtering
import { ChoiceChip, ChoiceChipGroup, FilterChip, ActionChip, TagChip } from '@entur/chip';

<ChoiceChipGroup name="transportmode" value={selected} onChange={setSelected}>
  <ChoiceChip value="tog">Tog</ChoiceChip>
  <ChoiceChip value="buss">Buss</ChoiceChip>
</ChoiceChipGroup>

// Dropdown/select
import { Dropdown, SearchableDropdown, MultiSelect } from '@entur/dropdown';

<Dropdown
  label="Fra"
  items={stations}
  selectedItem={selectedStation}
  onChange={setSelectedStation}
/>
```
