# Entur Linje — Page Composition Patterns

Complete page layouts showing how to compose `@entur/*` components together. Use these as starting points — adapt to your specific needs.

All patterns assume CSS imports are set up per `getting-started.md`.

---

## Pattern 1: Travel Search Page

The most common Entur page. Search form in a Contrast hero, results below.

```tsx
import { Contrast, NavigationCard } from '@entur/layout';
import { GridContainer, GridItem } from '@entur/grid';
import { Heading1, Paragraph, LeadParagraph } from '@entur/typography';
import { TextField } from '@entur/form';
import { SearchableDropdown } from '@entur/dropdown';
import { PrimaryButton, SecondaryButton, ButtonGroup } from '@entur/button';
import { DatePicker, TimePicker } from '@entur/datepicker';
import { ChoiceChipGroup, ChoiceChip } from '@entur/chip';
import { BannerAlertBox } from '@entur/alert';
import { Loader } from '@entur/loader';
import { TravelHeader, TravelTag } from '@entur/travel';
import { SkipToContent } from '@entur/a11y';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab';

function TravelSearchPage() {
  return (
    <>
      <SkipToContent>Til hovedinnhold</SkipToContent>
      <nav aria-label="Hovedmeny">{/* top navigation */}</nav>

      <main id="main-content">
        {/* Hero with search form */}
        <Contrast>
          <div
            style={{
              maxWidth: '48rem',
              margin: '0 auto',
              padding: 'var(--space-extra-large) var(--space-medium)',
            }}
          >
            <Heading1>Planlegg reisen din</Heading1>
            <LeadParagraph>
              Søk blant tusenvis av avganger i hele Norge
            </LeadParagraph>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-large)',
              }}
            >
              <SearchableDropdown
                label="Fra"
                items={fromStops}
                selectedItem={from}
                onChange={setFrom}
              />
              <SearchableDropdown
                label="Til"
                items={toStops}
                selectedItem={to}
                onChange={setTo}
              />

              <div style={{ display: 'flex', gap: 'var(--space-medium)' }}>
                <DatePicker
                  label="Dato"
                  selectedDate={date}
                  onChange={setDate}
                />
                <TimePicker
                  label="Tid"
                  selectedTime={time}
                  onChange={setTime}
                />
              </div>

              <ChoiceChipGroup
                name="when"
                value={whenFilter}
                onChange={setWhenFilter}
              >
                <ChoiceChip value="now">Nå</ChoiceChip>
                <ChoiceChip value="departure">Avgang</ChoiceChip>
                <ChoiceChip value="arrival">Ankomst</ChoiceChip>
              </ChoiceChipGroup>

              <PrimaryButton onClick={handleSearch}>Søk</PrimaryButton>
            </div>
          </div>
        </Contrast>

        {/* Results */}
        <section
          style={{
            maxWidth: '48rem',
            margin: '0 auto',
            padding: 'var(--space-large) var(--space-medium)',
          }}
        >
          {isLoading && <Loader>Søker etter reiser…</Loader>}

          {error && (
            <BannerAlertBox variant="negative" title="Feil ved søk">
              {error.message}
            </BannerAlertBox>
          )}

          {results.map(trip => (
            <NavigationCard
              key={trip.id}
              title={`${trip.from} → ${trip.to}`}
              href={`/reise/${trip.id}`}
            >
              <div style={{ display: 'flex', gap: 'var(--space-small)' }}>
                {trip.legs.map(leg => (
                  <TravelTag key={leg.id} transport={leg.mode}>
                    {leg.line}
                  </TravelTag>
                ))}
              </div>
              <Paragraph>
                {trip.duration} — {trip.transfers} bytte(r)
              </Paragraph>
            </NavigationCard>
          ))}
        </section>
      </main>
    </>
  );
}
```

---

## Pattern 2: Settings / Admin Form

Form-heavy page with sections, validation, and save/cancel actions.

```tsx
import { Heading1, Heading2, Paragraph, Label } from '@entur/typography';
import {
  TextField,
  TextArea,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Fieldset,
} from '@entur/form';
import { Dropdown } from '@entur/dropdown';
import { PrimaryButton, SecondaryButton, ButtonGroup } from '@entur/button';
import { BannerAlertBox, SmallAlertBox } from '@entur/alert';
import { Stepper } from '@entur/menu';
import { SkipToContent } from '@entur/a11y';

function SettingsPage() {
  return (
    <>
      <SkipToContent>Til hovedinnhold</SkipToContent>
      <nav aria-label="Hovedmeny">{/* navigation */}</nav>

      <main id="main-content">
        <div
          style={{
            maxWidth: '40rem',
            margin: '0 auto',
            padding: 'var(--space-extra-large) var(--space-medium)',
          }}
        >
          <Heading1>Innstillinger</Heading1>

          {saveSuccess && (
            <BannerAlertBox variant="success" title="Lagret">
              Endringene dine er lagret.
            </BannerAlertBox>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile section */}
            <Fieldset
              label="Profil"
              style={{ marginBlockEnd: 'var(--space-extra-large)' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-large)',
                }}
              >
                <TextField
                  label="Navn"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <TextField
                  label="E-post"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  variant={emailError ? 'negative' : undefined}
                  feedback={emailError}
                />
                <TextField
                  label="Telefon"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </Fieldset>

            {/* Notification preferences */}
            <Fieldset
              label="Varsler"
              style={{ marginBlockEnd: 'var(--space-extra-large)' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-medium)',
                }}
              >
                <Switch
                  checked={emailNotifs}
                  onChange={e => setEmailNotifs(e.target.checked)}
                >
                  Varsler på e-post
                </Switch>
                <Switch
                  checked={pushNotifs}
                  onChange={e => setPushNotifs(e.target.checked)}
                >
                  Push-varsler
                </Switch>

                <Dropdown
                  label="Varselsfrekvens"
                  items={frequencyOptions}
                  selectedItem={frequency}
                  onChange={setFrequency}
                />
              </div>
            </Fieldset>

            {/* Language preference */}
            <Fieldset
              label="Språk"
              style={{ marginBlockEnd: 'var(--space-extra-large)' }}
            >
              <RadioGroup
                name="lang"
                label="Foretrukket språk"
                value={lang}
                onChange={e => setLang(e.target.value)}
              >
                <Radio value="nb">Norsk (bokmål)</Radio>
                <Radio value="nn">Norsk (nynorsk)</Radio>
                <Radio value="en">English</Radio>
              </RadioGroup>
            </Fieldset>

            <ButtonGroup>
              <PrimaryButton type="submit">Lagre endringer</PrimaryButton>
              <SecondaryButton type="button" onClick={handleCancel}>
                Avbryt
              </SecondaryButton>
            </ButtonGroup>
          </form>
        </div>
      </main>
    </>
  );
}
```

---

## Pattern 3: Data Table Dashboard

Admin dashboard with filters, sortable table, and pagination.

```tsx
import { Heading1, Heading2, Paragraph, SmallText } from '@entur/typography';
import { TextField } from '@entur/form';
import { Dropdown } from '@entur/dropdown';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
  useSortableData,
} from '@entur/table';
import { Pagination } from '@entur/menu';
import { StatusBadge, Badge } from '@entur/layout';
import { FilterChip } from '@entur/chip';
import { SecondaryButton, IconButton } from '@entur/button';
import { BannerAlertBox } from '@entur/alert';
import { SkeletonRectangle } from '@entur/loader';
import { SkipToContent } from '@entur/a11y';
import { SearchIcon, DownloadIcon } from '@entur/icons';

function DashboardPage() {
  const { sortedData, getSortableHeaderProps, getSortableTableProps } =
    useSortableData(data, { key: 'date', order: 'descending' });

  return (
    <>
      <SkipToContent>Til hovedinnhold</SkipToContent>
      <nav aria-label="Sidemeny">{/* side navigation */}</nav>

      <main
        id="main-content"
        style={{ padding: 'var(--space-extra-large) var(--space-large)' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Heading1>Bestillinger</Heading1>
          <SecondaryButton onClick={handleExport}>
            <DownloadIcon />
            Eksporter
          </SecondaryButton>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-medium)',
            marginBlock: 'var(--space-large)',
            flexWrap: 'wrap',
          }}
        >
          <TextField
            label="Søk"
            value={search}
            onChange={e => setSearch(e.target.value)}
            prepend={<SearchIcon />}
            style={{ minWidth: '16rem' }}
          />
          <Dropdown
            label="Status"
            items={statusOptions}
            selectedItem={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterChip
            value="today"
            checked={dateFilter === 'today'}
            onChange={() => setDateFilter('today')}
          >
            I dag
          </FilterChip>
          <FilterChip
            value="week"
            checked={dateFilter === 'week'}
            onChange={() => setDateFilter('week')}
          >
            Siste 7 dager
          </FilterChip>
        </div>

        {/* Summary badges */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-large)',
            marginBlockEnd: 'var(--space-large)',
          }}
        >
          <div>
            <SmallText>Totalt</SmallText>
            <Badge variant="primary">{totalCount}</Badge>
          </div>
          <div>
            <SmallText>Aktive</SmallText>
            <StatusBadge variant="success">{activeCount}</StatusBadge>
          </div>
          <div>
            <SmallText>Kansellert</SmallText>
            <StatusBadge variant="negative">{cancelledCount}</StatusBadge>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <SkeletonRectangle width="100%" height={400} />
        ) : (
          <Table aria-label="Bestillinger" {...getSortableTableProps()}>
            <TableHead>
              <TableRow>
                <HeaderCell
                  scope="col"
                  {...getSortableHeaderProps({ name: 'id' })}
                >
                  Bestillingsnr.
                </HeaderCell>
                <HeaderCell
                  scope="col"
                  {...getSortableHeaderProps({ name: 'customer' })}
                >
                  Kunde
                </HeaderCell>
                <HeaderCell
                  scope="col"
                  {...getSortableHeaderProps({ name: 'date' })}
                >
                  Dato
                </HeaderCell>
                <HeaderCell scope="col">Status</HeaderCell>
                <HeaderCell scope="col">Beløp</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map(row => (
                <TableRow key={row.id}>
                  <DataCell>{row.id}</DataCell>
                  <DataCell>{row.customer}</DataCell>
                  <DataCell>{row.date}</DataCell>
                  <DataCell>
                    <StatusBadge variant={statusVariant(row.status)}>
                      {row.status}
                    </StatusBadge>
                  </DataCell>
                  <DataCell>{row.amount} kr</DataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Pagination
          currentPage={page}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </main>
    </>
  );
}
```

---

## Pattern 4: Landing / Hero Page

Marketing or onboarding page with hero, feature cards, and call-to-action.

```tsx
import { Contrast, NavigationCard, BaseCard } from '@entur/layout';
import { GridContainer, GridItem } from '@entur/grid';
import {
  Heading1,
  Heading2,
  Paragraph,
  LeadParagraph,
  Link,
} from '@entur/typography';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { SkipToContent } from '@entur/a11y';
import { TrainIcon, BusIcon, FerryIcon } from '@entur/icons';

function LandingPage() {
  return (
    <>
      <SkipToContent>Til hovedinnhold</SkipToContent>
      <nav aria-label="Hovedmeny">{/* top navigation */}</nav>

      <main id="main-content">
        {/* Hero */}
        <Contrast>
          <div
            style={{
              maxWidth: '64rem',
              margin: '0 auto',
              padding: 'var(--space-extra-large3) var(--space-medium)',
              textAlign: 'center',
            }}
          >
            <Heading1>Reis smartere med Entur</Heading1>
            <LeadParagraph>
              Planlegg reiser, kjøp billetter og få sanntidsinformasjon — alt på
              ett sted.
            </LeadParagraph>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-medium)',
                justifyContent: 'center',
                marginBlockStart: 'var(--space-extra-large)',
              }}
            >
              <PrimaryButton as="a" href="/reiseplanlegger">
                Planlegg reise
              </PrimaryButton>
              <SecondaryButton as="a" href="/om">
                Les mer
              </SecondaryButton>
            </div>
          </div>
        </Contrast>

        {/* Feature cards */}
        <section
          style={{
            maxWidth: '64rem',
            margin: '0 auto',
            padding: 'var(--space-extra-large3) var(--space-medium)',
          }}
        >
          <Heading2
            style={{
              textAlign: 'center',
              marginBlockEnd: 'var(--space-extra-large)',
            }}
          >
            Hva kan du gjøre?
          </Heading2>
          <GridContainer>
            <GridItem small={12} medium={4}>
              <NavigationCard title="Tog" href="/tog">
                <TrainIcon size={40} />
                <Paragraph>Finn togavganger over hele Norge.</Paragraph>
              </NavigationCard>
            </GridItem>
            <GridItem small={12} medium={4}>
              <NavigationCard title="Buss" href="/buss">
                <BusIcon size={40} />
                <Paragraph>Sjekk lokale og regionale bussruter.</Paragraph>
              </NavigationCard>
            </GridItem>
            <GridItem small={12} medium={4}>
              <NavigationCard title="Ferje" href="/ferje">
                <FerryIcon size={40} />
                <Paragraph>Se ferjetider langs kysten.</Paragraph>
              </NavigationCard>
            </GridItem>
          </GridContainer>
        </section>

        {/* Info section */}
        <Contrast>
          <section
            style={{
              maxWidth: '48rem',
              margin: '0 auto',
              padding: 'var(--space-extra-large3) var(--space-medium)',
              textAlign: 'center',
            }}
          >
            <Heading2>Åpne data for alle</Heading2>
            <Paragraph>
              Entur tilbyr åpne API-er for rutedata, sanntid og billettpriser.
              Bygg din egen reiseapp med våre data.
            </Paragraph>
            <SecondaryButton
              as="a"
              href="https://developer.entur.org"
              style={{ marginBlockStart: 'var(--space-extra-large)' }}
            >
              Se utviklerportalen
            </SecondaryButton>
          </section>
        </Contrast>
      </main>
    </>
  );
}
```

---

## Pattern 5: Detail / Result Page

Trip detail, order confirmation, or any single-item view with structured data.

```tsx
import {
  Heading1,
  Heading2,
  Paragraph,
  SmallText,
  Label,
  Link,
} from '@entur/typography';
import { Contrast, StatusBadge, Tag, BaseCard } from '@entur/layout';
import { GridContainer, GridItem } from '@entur/grid';
import {
  TravelHeader,
  TravelTag,
  LegLine,
  LegBone,
  TravelLeg,
} from '@entur/travel';
import { Accordion, AccordionItem } from '@entur/expand';
import { BannerAlertBox } from '@entur/alert';
import { PrimaryButton, SecondaryButton, ButtonGroup } from '@entur/button';
import { BreadcrumbNavigation, BreadcrumbItem } from '@entur/menu';
import { SkipToContent } from '@entur/a11y';

function TripDetailPage({ trip }) {
  return (
    <>
      <SkipToContent>Til hovedinnhold</SkipToContent>
      <nav aria-label="Hovedmeny">{/* navigation */}</nav>

      <main
        id="main-content"
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          padding: 'var(--space-large) var(--space-medium)',
        }}
      >
        <BreadcrumbNavigation>
          <BreadcrumbItem href="/">Hjem</BreadcrumbItem>
          <BreadcrumbItem href="/reiser">Reiseresultater</BreadcrumbItem>
          <BreadcrumbItem>Reisedetaljer</BreadcrumbItem>
        </BreadcrumbNavigation>

        <div style={{ marginBlock: 'var(--space-large)' }}>
          <Heading1>
            {trip.from} → {trip.to}
          </Heading1>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-small)',
              alignItems: 'center',
            }}
          >
            <StatusBadge variant={trip.onTime ? 'success' : 'warning'}>
              {trip.onTime ? 'I rute' : 'Forsinket'}
            </StatusBadge>
            <SmallText>
              {trip.date} · {trip.duration}
            </SmallText>
          </div>
        </div>

        {trip.alert && (
          <BannerAlertBox variant="warning" title="Avvik">
            {trip.alert}
          </BannerAlertBox>
        )}

        {/* Journey legs */}
        <section style={{ marginBlock: 'var(--space-extra-large)' }}>
          <Heading2>Reiserute</Heading2>
          {trip.legs.map((leg, i) => (
            <BaseCard
              key={i}
              style={{
                marginBlockEnd: 'var(--space-medium)',
                padding: 'var(--space-large)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-small)',
                    alignItems: 'center',
                  }}
                >
                  <TravelTag transport={leg.mode}>{leg.line}</TravelTag>
                  <div>
                    <Paragraph>
                      <strong>{leg.departureTime}</strong> {leg.from}
                    </Paragraph>
                    <Paragraph>
                      <strong>{leg.arrivalTime}</strong> {leg.to}
                    </Paragraph>
                  </div>
                </div>
                <SmallText>{leg.duration}</SmallText>
              </div>
            </BaseCard>
          ))}
        </section>

        {/* Extra info */}
        <Accordion>
          <AccordionItem title="Billettinformasjon">
            <Paragraph>{trip.ticketInfo}</Paragraph>
          </AccordionItem>
          <AccordionItem title="Regler og vilkår">
            <Paragraph>{trip.terms}</Paragraph>
          </AccordionItem>
        </Accordion>

        <ButtonGroup style={{ marginBlockStart: 'var(--space-extra-large)' }}>
          <PrimaryButton onClick={handleBuy}>Kjøp billett</PrimaryButton>
          <SecondaryButton onClick={handleSave}>Lagre reise</SecondaryButton>
        </ButtonGroup>
      </main>
    </>
  );
}
```

---

## Composition principles

These rules apply across all page patterns:

1. **SkipToContent first** — always include from `@entur/a11y` with matching `id="main-content"` on `<main>`
2. **Name every landmark and table** — `aria-label` on each `<nav>` and `<aside>`, `aria-label` or `aria-labelledby` on every `<Table>`, `scope="col"` on every `HeaderCell`. See `entur-accessibility/references/patterns-checklist.md`
3. **Headings describe sections, never values** — a metric card's number is `<Heading2 as="p">`, not `<Heading2>`; a sidebar brand name is `<Heading3 as="p">`. Both keep the type scale and leave the heading outline intact (`h1` → `h2` → `h3`, no skips, nothing above the page `h1`)
4. **`SideNavigationItem` needs an `href`** — it renders an `<a>`, and an anchor without `href` is not focusable or announced as a link. Pass `href`, or `as="button" onClick`
5. **`BaseCard` is `display: flex; align-items: flex-start`** — stacked card content needs a `<Flex direction="column" gap="s">` wrapper, otherwise every child lands on one row
6. **Contrast for hero sections** — wraps content in dark branded background; tokens adapt automatically
7. **GridContainer + GridItem for responsive layouts** — use `small`, `medium`, `large` breakpoints. For a CSS-grid template (`templateColumns`, `templateAreas`), flexbox props, or a portal app shell, use `Grid`, `Flex` and `Template.Portal` from `@entur/layout/beta` instead — beta, so its API can change between minors. Import its CSS from `@entur/layout/beta/styles`
8. **Spacing via tokens** — use `var(--space-*)` values, not hardcoded rem/px. Wrap components in layout elements for margin/padding rather than applying directly to `@entur/*` components
9. **One PrimaryButton per view** — use `SecondaryButton` for secondary actions, `SecondaryButton size="small"` where you want a lighter weight. Two competing primaries dilute the call-to-action
10. **Cap prose line length at 65ch** — add `max-width: 65ch` to prose containers to keep text readable
11. **BannerAlertBox for page-level messages** — success, error, warning at the top of relevant section
12. **Loader and Skeleton for loading states** — use `Loader` for full-page, `SkeletonRectangle` for inline placeholders
13. **Empty states should teach** — don't just say "nothing here"; explain what to do next or show a helpful illustration
