# Entur Accessibility — Pattern Checklists

Component-specific checklists and code examples. The component handles interaction mechanics; you are responsible for these items.

---

## Forms

- [ ] Every field has a visible `label` prop — not just `placeholder`
- [ ] Invalid fields set both `variant="negative"` and `feedback="…"` — error communicated in text, not color alone
- [ ] Related fields grouped with `Fieldset` and a descriptive `label`
- [ ] Required fields are indicated (via `label` text or equivalent — not color alone)

```tsx
// Good — label + feedback + variant together
<TextField
  label="Mobilnummer"
  variant="negative"
  feedback="Ugyldig format. Bruk 8 siffer."
  value={phone}
  onChange={e => setPhone(e.target.value)}
/>

// Avoid — placeholder-only, no error text
<TextField placeholder="Mobilnummer" />
```

---

## Modals and dialogs

`Modal` and `Drawer` from `@entur/modal` handle focus trapping, Escape-to-close, and ARIA dialog role automatically.

- [ ] Do not use `autoFocus` on a destructive action (e.g. "Slett"-button) — focus should land on a safe target or the dialog title
- [ ] Trigger element exists in the DOM when the modal closes so focus can return to it
- [ ] Give `Modal` a `title` — it becomes the dialog's accessible name. Without a `title`, pass `aria-label` instead

```tsx
// Good — Modal handles focus management; the title becomes the dialog's accessible name
<Modal
  open={isOpen}
  onDismiss={() => setOpen(false)}
  size="small"
  title="Bekreft kjøp"
>
  <p>Er du sikker på at du vil kjøpe billetten?</p>
  <ButtonGroup>
    <PrimaryButton>Bekreft</PrimaryButton>
    <SecondaryButton onClick={() => setOpen(false)}>Avbryt</SecondaryButton>
  </ButtonGroup>
</Modal>
```

---

## Dropdowns and comboboxes

`Dropdown`, `SearchableDropdown`, and `MultiSelect` from `@entur/dropdown` handle keyboard navigation, ARIA combobox roles, and selection announcement automatically.

- [ ] Provide a visible `label` prop — the component cannot generate it
- [ ] On validation failure, set `variant="negative"` and `feedback` on the dropdown

---

## Icon buttons and icon-only controls

- [ ] Every `IconButton` has an `aria-label` describing the action
- [ ] Decorative icons adjacent to visible text have `aria-hidden="true"`
- [ ] Where the icon's meaning is not obvious, wrap the button in a `Tooltip` so sighted users get the same label on hover and keyboard focus

```tsx
// Good
<IconButton aria-label="Lukk"><CloseIcon aria-hidden="true" /></IconButton>

// Better where the icon is ambiguous — Tooltip surfaces the label visually too
<Tooltip content="Last ned kvittering" placement="top">
  <IconButton aria-label="Last ned kvittering">
    <DownloadIcon aria-hidden="true" />
  </IconButton>
</Tooltip>

// Avoid — no label, screen reader announces nothing useful
<IconButton><CloseIcon /></IconButton>
```

`Tooltip` sets `aria-describedby` on its child, which is a _description_, not a name — so keep the `aria-label` on the button even when a tooltip is present.

---

## Loading states

- [ ] Use `Loader` with descriptive text for meaningful loading states — `Spinner` alone is not announced to screen readers
- [ ] For async results appearing in the page (search results, filtered lists), wrap the region in `aria-live="polite"`

```tsx
// Good — text is announced to screen readers
<Loader>Laster avganger…</Loader>

// Avoid for meaningful state changes — spinner alone is silent
<Spinner />
```

```tsx
// Good — async results announced when they arrive
<div aria-live="polite" aria-atomic="false">
  {results.map(r => (
    <Paragraph key={r.id}>{r.label}</Paragraph>
  ))}
</div>
```

---

## Tables

- [ ] Use `<caption>` or `aria-label` on `<Table>` to describe the data
- [ ] Use `<HeaderCell scope="col">` for column headers
- [ ] Interactive rows (expandable, selectable) must be keyboard operable

---

## Skip links and landmarks

Every app with navigation needs:

```tsx
// First element in the app — children is the link text
<SkipToContent>Til hovedinnhold</SkipToContent>

// Matching target in the main layout
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

`SkipToContent` targets `#main-content` by default; pass `mainId` if your main element uses a different id.

`tabIndex={-1}` on `<main>` allows programmatic focus (for route changes) without making it tab-reachable.
