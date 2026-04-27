# Entur Linje — Component Reference

Full API docs: https://linje.entur.no/komponenter

## Quick lookup — package → components

| Package             | Key exports                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `@entur/button`     | `PrimaryButton`, `SecondaryButton`, `TertiaryButton`, `NegativeButton`, `SuccessButton`, `IconButton`, `ButtonGroup` |
| `@entur/typography` | `Heading1`–`Heading6`, `Paragraph`, `LeadParagraph`, `SmallText`, `Label`, `Link`                                    |
| `@entur/form`       | `TextField`, `TextArea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Fieldset`                                     |
| `@entur/alert`      | `BannerAlertBox`, `SmallAlertBox`, `ToastProvider`, `useToast`                                                       |
| `@entur/menu`       | `SideNavigation`, `BreadcrumbNavigation`, `Pagination`, `Stepper`                                                    |
| `@entur/layout`     | `Contrast`, `NavigationCard`, `BaseCard`, `Badge`, `StatusBadge`, `Tag`                                              |
| `@entur/grid`       | `GridContainer`, `GridItem`                                                                                          |
| `@entur/modal`      | `Modal`, `ModalContent`, `Drawer`                                                                                    |
| `@entur/tooltip`    | `Tooltip`, `Popover`                                                                                                 |
| `@entur/table`      | `Table`, `TableHead`, `TableBody`, `TableRow`, `HeaderCell`, `DataCell`                                              |
| `@entur/expand`     | `Accordion`, `AccordionItem`, `ExpandablePanel`                                                                      |
| `@entur/tab`        | `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`                                                                    |
| `@entur/travel`     | `TravelHeader`, `TravelTag`, `LegLine`, `LegBone`, `TravelLeg`                                                       |
| `@entur/loader`     | `Loader`, `Spinner`, `SkeletonRectangle`                                                                             |
| `@entur/chip`       | `ChoiceChip`, `ChoiceChipGroup`, `FilterChip`, `ActionChip`                                                          |
| `@entur/dropdown`   | `Dropdown`, `SearchableDropdown`, `MultiSelect`, `NativeDropdown`                                                    |
| `@entur/a11y`       | `SkipToContent`, `VisuallyHidden`                                                                                    |

Common patterns: all imports are named exports. Buttons are polymorphic (`as="a"`). TextField variants: `"success"` | `"information"` | `"warning"` | `"negative"` (omit for default). Alert variants: `"information"` | `"success"` | `"warning"` | `"negative"`. Transport modes: `"rail"` | `"bus"` | `"metro"` | `"tram"` | `"ferry"` | `"plane"` | `"bicycle"` | `"walk"` + others.

---

## Detailed usage examples

Read below only when you need code examples for a specific component category.

---

## Buttons

Package: `@entur/button`

Use the right variant for the action's importance. Avoid multiple primaries in the same view — they compete for attention.

```tsx
import { PrimaryButton, SecondaryButton, TertiaryButton, NegativeButton, SuccessButton, IconButton, ButtonGroup } from '@entur/button';

// Primary — main call to action
<PrimaryButton onClick={handleSubmit}>Kjøp billett</PrimaryButton>

// Secondary — alternative actions
<SecondaryButton onClick={handleCancel}>Avbryt</SecondaryButton>

// Tertiary — low-emphasis, often in dense UIs
<TertiaryButton>Les mer</TertiaryButton>

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

Use semantic heading levels (`Heading1`–`Heading6`) for document structure, not for visual sizing. Pair with `Paragraph`, `LeadParagraph`, `SmallText`, and `Label` for body content.

```tsx
import { Heading1, Heading2, Paragraph, LeadParagraph, SmallText, Label, SubLabel, Link } from '@entur/typography';

<Heading1>Finn din neste reise</Heading1>
<LeadParagraph>Søk blant tusenvis av avganger i Norge.</LeadParagraph>
<Paragraph>Bruk reiseplanleggeren for å finne beste rute.</Paragraph>
<SmallText>* Avgangstider kan avvike</SmallText>
<Label>Velg dato</Label>
<Link href="/hjelp">Trenger du hjelp?</Link>
```

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

// Radio group
<RadioGroup label="Reisemåte">
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
addToast({ title: 'Lagret!', variant: 'success' });
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

// Badges
<Badge>3</Badge>
<StatusBadge variant="success">Aktiv</StatusBadge>

// Tag chips for labeling
<Tag>Regional</Tag>
```

---

## Overlays

Package: `@entur/modal`

```tsx
import { Modal, ModalContent, Drawer } from '@entur/modal';
import { Tooltip, Popover } from '@entur/tooltip';

// Modal dialog
<Modal open={isOpen} onDismiss={() => setOpen(false)}>
  <ModalContent title="Bekreft kjøp" size="small">
    Er du sikker på at du vil kjøpe billetten?
  </ModalContent>
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

---

## Travel-specific

Package: `@entur/travel`

Specialized components for public transport UIs. Use these for any travel-related UI to ensure consistency with Entur's travel products.

```tsx
import { TravelHeader, TravelTag, LegLine, LegBone, TravelLeg, TravelSwitch } from '@entur/travel';

// Transport mode tags (colored by mode)
<TravelTag transport="rail">Tog</TravelTag>
<TravelTag transport="bus">Buss</TravelTag>
<TravelTag transport="metro">T-bane</TravelTag>

// Journey leg visualization
<TravelLeg>
  <LegBone direction="vertical" pattern="line" color="var(--standard-train)" />
</TravelLeg>
```

Transport modes: `"rail"` | `"bus"` | `"metro"` | `"tram"` | `"ferry"` | `"plane"` | `"bicycle"` | `"walk"` | `"mobility"` | `"cableway"` | `"funicular"` | `"helicopter"` | `"taxi"`

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
