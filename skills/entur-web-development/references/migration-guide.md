# Entur Linje — Migration Guide

Use this when upgrading `@entur/*` packages or fixing deprecation warnings. Each entry has the old API, the replacement, and a before/after code pair.

---

## Deprecated props and components

### `@entur/button`

| Deprecated                       | Replacement                          | Notes                                                                               |
| -------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| `TertiaryButton`                 | `SecondaryButton size="small"`       | `TertiaryButton` still exported but deprecated                                      |
| `TertiarySquareButton`           | `SecondarySquareButton size="small"` | Stay on the square variant — `SecondarySquareButton` is current API, not deprecated |
| `variant="tertiary"` on `Button` | `variant="secondary" size="small"`   | Internal variant string deprecated                                                  |

`SecondarySquareButton` and `SuccessSquareButton` are **not** deprecated — only `TertiarySquareButton` is.

```tsx
// Before
<TertiaryButton onClick={fn}>Avbryt</TertiaryButton>

// After
<SecondaryButton size="small" onClick={fn}>Avbryt</SecondaryButton>
```

---

### `@entur/form` — variant strings

`TextField`, `TextArea` and `FeedbackText` all share the same variant rename. (`SegmentedControl` has no `variant` prop and is unaffected.)

| Deprecated variant | Replacement     |
| ------------------ | --------------- |
| `"info"`           | `"information"` |
| `"error"`          | `"negative"`    |

```tsx
// Before
<TextField variant="info" label="E-post" />
<TextField variant="error" label="E-post" />

// After
<TextField variant="information" label="E-post" />
<TextField variant="negative" label="E-post" />
```

---

### `@entur/dropdown` — variant strings

Same rename as `@entur/form`.

```tsx
// Before
<Dropdown variant="info" {...rest} />
<NativeDropdown variant="error" {...rest} />

// After
<Dropdown variant="information" {...rest} />
<NativeDropdown variant="negative" {...rest} />
```

---

### `@entur/table` — `DataCell` and `EditableCell`

| Deprecated                    | Replacement          |
| ----------------------------- | -------------------- |
| `status="positive"`           | `variant="success"`  |
| `status="negative"`           | `variant="negative"` |
| `status="neutral"`            | `variant="neutral"`  |
| `DataCell` variant `"info"`   | `"information"`      |
| `DataCell` variant `"danger"` | `"negative"`         |

```tsx
// Before
<DataCell status="positive">OK</DataCell>
<DataCell status="negative">Feil</DataCell>

// After
<DataCell variant="success">OK</DataCell>
<DataCell variant="negative">Feil</DataCell>
```

---

### `@entur/layout` — `StatusBadge`

| Deprecated variant | Replacement     |
| ------------------ | --------------- |
| `"info"`           | `"information"` |
| `"danger"`         | `"negative"`    |

```tsx
// Before
<StatusBadge variant="info">Informasjon</StatusBadge>

// After
<StatusBadge variant="information">Informasjon</StatusBadge>
```

---

### `@entur/layout` — `NavigationCard`

| Deprecated prop | Replacement                                          |
| --------------- | ---------------------------------------------------- |
| `externalLink`  | Drop it — still exported and working, but deprecated |

```tsx
// Before
<NavigationCard title="Lenke" externalLink />

// After
<NavigationCard title="Lenke" />
```

---

### `@entur/menu` — `OverflowMenu`

| Deprecated prop             | Replacement                              |
| --------------------------- | ---------------------------------------- |
| `position="left"`           | `placement="bottom-end"`                 |
| `position="right"`          | `placement="bottom-start"` (the default) |
| `OverflowMenuLink.onSelect` | Use `href` prop instead                  |

`position` only ever accepted `"left"` or `"right"`. `placement` takes the full Floating UI `Placement` union (`"bottom-start"`, `"bottom-end"`, `"top-start"`, …) and defaults to `"bottom-start"`.

```tsx
// Before
<OverflowMenu position="left">
  <OverflowMenuLink onSelect={fn}>Rediger</OverflowMenuLink>
</OverflowMenu>

// After
<OverflowMenu placement="bottom-end">
  <OverflowMenuLink href="/rediger">Rediger</OverflowMenuLink>
</OverflowMenu>
```

---

## Common migration patterns

### Variant string normalisation (applies across packages)

Most `@entur/*` packages renamed variant strings for consistency. Apply this find-replace across all `@entur/*` usages:

| Old                | New                     |
| ------------------ | ----------------------- |
| `variant="info"`   | `variant="information"` |
| `variant="error"`  | `variant="negative"`    |
| `variant="danger"` | `variant="negative"`    |

### Button size refactor

`TertiaryButton` was a stylistic alias for a small secondary button. Replace all occurrences:

```
TertiaryButton → SecondaryButton size="small"
TertiarySquareButton → SecondarySquareButton size="small"
```

---

### `@entur/modal`

| Old                                  | New                     |
| ------------------------------------ | ----------------------- |
| `<Modal isOpen={…}>`                 | `<Modal open={…}>`      |
| Top-level `<Heading>` inside `Modal` | `title` prop on `Modal` |

`size` is **required** on `Modal` (`'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge'`); `title` is optional. Modal content is passed as children — `Modal` renders the overlay and the content wrapper itself.

```tsx
// Before
<Modal isOpen={showModal} onDismiss={close}>
  <Heading2>Bekreft kjøp</Heading2>
  …
</Modal>

// After
<Modal open={showModal} onDismiss={close} size="small" title="Bekreft kjøp">
  …
</Modal>
```

---

### `@entur/travel` — transport types

Four transport type names are deprecated and log a runtime warning. They apply to every component taking a `transport` prop — `TravelTag`, `TravelLeg`, `LegLine` and friends all share the same `Transport` type.

| Old (deprecated, warns) | New          |
| ----------------------- | ------------ |
| `'scooter'`             | `'mobility'` |
| `'bike'`                | `'bicycle'`  |
| `'car'`                 | `'taxi'`     |
| `'foot'`                | `'walk'`     |

`'plane'`, `'train'` and `'ferry'` are **not** deprecated — they are first-class members of the `Transport` union, handled as silent aliases for `'air'`, `'rail'` and `'water'`. Prefer the newer names in new code, but there is nothing to migrate.

`TravelSwitch` moved packages:

```tsx
// Before
import { TravelSwitch } from '@entur/form';

// After
import { TravelSwitch } from '@entur/travel';
```

---

### `@entur/expand`

| Old                            | New                             |
| ------------------------------ | ------------------------------- |
| `ExpandableGroup`              | `Accordion`                     |
| `ExpandableTextButton onClick` | `ExpandableTextButton onToggle` |

```tsx
// Before
import { ExpandableGroup } from '@entur/expand';
<ExpandableGroup>…</ExpandableGroup>
<ExpandableTextButton onClick={toggle}>Se mer</ExpandableTextButton>

// After
import { Accordion } from '@entur/expand';
<Accordion>…</Accordion>
<ExpandableTextButton onToggle={toggle}>Se mer</ExpandableTextButton>
```

---

### `@entur/table` — breaking prop renames

| Old                                       | New                                            |
| ----------------------------------------- | ---------------------------------------------- |
| `<Table density="middle">`                | `<Table spacing="middle">`                     |
| `<Table compact>`                         | `<Table spacing="middle">`                     |
| `<EditableCell value={…} onChange={…} />` | `<EditableCell><TextField … /></EditableCell>` |

```tsx
// Before
<Table compact>{rows}</Table>
<EditableCell value={cellValue} onChange={handleChange} />

// After
<Table spacing="middle">{rows}</Table>
<EditableCell>
  <TextField label="Verdi" value={cellValue} onChange={e => handleChange(e.target.value)} />
</EditableCell>
```

---

### `@entur/menu` — Stepper

`interactive` default flipped — was `true`, now `false`.

```tsx
// Before (interactive by default)
<Stepper activeIndex={step} steps={steps} />

// After — must be explicit
<Stepper activeIndex={step} steps={steps} interactive />
```

---

### `@entur/tooltip`

| Old                    | New                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `popperModifiers` prop | Drop it — deprecated, no replacement. Ask in #talk-designsystem if you need placement overrides |
| Plain text children    | Must wrap in an element                                                                         |

`placement` is a **required** prop on `Tooltip`.

```tsx
// Before
<Tooltip content="Info" popperModifiers={[…]}>
  Vis mer
</Tooltip>

// After
<Tooltip content="Info" placement="top">
  <span>Vis mer</span>
</Tooltip>
```

---

### `@entur/datepicker`

`maxDate` is now **inclusive** — remove +1 day workarounds.

`onChange` can be called with `null` (when the field is cleared), so null-check before setting state. The value type follows `selectedDate`: a `CalendarDate` when `selectedDate` is `null`, otherwise the same type as `selectedDate`. Pass `forcedReturnType` if you need to pin it to `ZonedDateTime`.

```tsx
<DatePicker
  label="Sluttdato"
  selectedDate={endDate}
  onChange={date => {
    if (date) setEndDate(date);
  }}
/>
```

---

### `@entur/utils`

```tsx
// Before
import { debounce } from '@entur/utils';

// After
import { useDebounce } from '@entur/utils';
```

---

## Finding deprecation warnings in a codebase

```bash
# Find all usages of deprecated variant strings
grep -rn 'variant="info"\|variant="error"\|variant="danger"' src/

# Find TertiaryButton usages
grep -rn 'TertiaryButton\|TertiarySquareButton' src/

# Find deprecated DataCell status prop
grep -rn 'status="positive"\|status="negative"\|status="neutral"' src/
```
