---
name: entur-accessibility
description: Build accessible Entur web applications that comply with WCAG 2.1 and Norwegian universell utforming (UU) requirements. Use when the user is working on accessibility, asking about WCAG, universell utforming, screen readers, keyboard navigation, focus management, color contrast, aria attributes, semantic HTML, or Norwegian IKT accessibility regulation. Also trigger when building @entur/* applications that need to meet legal compliance requirements — all Entur digital products must comply with WCAG 2.1. Use even if the user just says "make this accessible" or "is this accessible" without mentioning WCAG by name.
---

> **Audience:** AI coding agents. Entur developers should visit [linje.entur.no/universell-utforming](https://linje.entur.no/universell-utforming).

# Entur Accessibility

This skill helps you build accessible Entur applications that comply with WCAG 2.1 and Norwegian law.

Accessibility at Entur isn't optional. Entur's digital products must comply with 47 of 78 WCAG 2.1 success criteria per the Norwegian IKT regulation (implementing the EU Web Accessibility Directive). Beyond compliance, Entur's mission — making public transport accessible to all — means accessibility is central to what the products do.

**Accessibility docs**: https://linje.entur.no/universell-utforming  
**Norwegian WCAG authority**: https://www.uutilsynet.no

---

## What the components handle for you

All `@entur/*` interactive components provide out of the box:

- Keyboard support (Tab, Enter/Space, arrow keys, Escape)
- Focus management (trapping in modals, returning focus on close)
- ARIA roles and attributes (combobox, dialog, tablist, etc.)
- Color contrast-compliant styling
- Visible focus indicators

Use the components instead of building custom alternatives — doing so correctly requires replicating all of the above.

---

## What you must provide

These things cannot be automated by components — you must supply them:

1. **`label` prop on every form field.** Components wire up the label-to-input association, but cannot invent the text. Never rely on `placeholder` alone — it disappears on input.
2. **`aria-label` on `IconButton` and icon-only controls.** There is no visible text to derive it from.
3. **`alt` text on images.** Use `alt=""` for purely decorative images.
4. **`aria-hidden="true"` on decorative icons** that have adjacent visible text.
5. **`SkipToContent` as the first element** in every app that has navigation, with a matching `<main id="main-content">`.
6. **Logical heading hierarchy.** Use `Heading1`–`Heading6` from `@entur/typography` in order — don't skip levels for visual sizing.
7. **`document.title` updates on route changes** in SPAs — screen readers announce the title on navigation.
8. **`variant="negative"` and `feedback` together** on invalid form fields — error state must not rely on color alone.

---

## Pattern checklists

These are implementation requirements. The component handles the interaction mechanics; you are responsible for the items below.

### Forms

- [ ] Every field has a visible `label` prop — not just `placeholder`
- [ ] Invalid fields set both `variant="negative"` and `feedback="…"` — error is communicated in text, not color alone
- [ ] Related fields are grouped with `Fieldset` and a descriptive `label`
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

### Modals and dialogs

`Modal` and `Drawer` from `@entur/modal` handle focus trapping, Escape-to-close, and ARIA dialog role automatically.

- [ ] Do not use `autoFocus` on a destructive action (e.g. "Slett"-button) — focus should land on a safe target or the dialog title
- [ ] Trigger element exists in the DOM when the modal closes so focus can return to it

```tsx
// Good — Modal handles focus management; provide a safe initial focus
<Modal open={isOpen} onDismiss={() => setOpen(false)}>
  <ModalContent title="Bekreft kjøp" size="small">
    <p>Er du sikker på at du vil kjøpe billetten?</p>
    <ButtonGroup>
      <PrimaryButton>Bekreft</PrimaryButton>{' '}
      {/* focus lands here or on title */}
      <SecondaryButton onClick={() => setOpen(false)}>Avbryt</SecondaryButton>
    </ButtonGroup>
  </ModalContent>
</Modal>
```

### Dropdowns and comboboxes

`Dropdown`, `SearchableDropdown`, and `MultiSelect` from `@entur/dropdown` handle keyboard navigation, ARIA combobox roles, and selection announcement automatically.

- [ ] Provide a visible `label` prop — the component cannot generate it
- [ ] On validation failure, set `variant="negative"` and `feedback` on the dropdown

### Icon buttons and icon-only controls

- [ ] Every `IconButton` has an `aria-label` describing the action
- [ ] Decorative icons adjacent to visible text have `aria-hidden="true"`

```tsx
// Good
<IconButton aria-label="Lukk"><CloseIcon aria-hidden="true" /></IconButton>

// Avoid — no label, screen reader announces nothing useful
<IconButton><CloseIcon /></IconButton>
```

### Loading states

- [ ] Use `Loader` with descriptive text for meaningful loading states — `Spinner` alone is not announced to screen readers
- [ ] For async results appearing in the page (search results, filtered lists), wrap the region in `aria-live="polite"`

```tsx
// Good — text is announced to screen readers
<Loader>Laster avganger…</Loader>

// Avoid for meaningful state changes — spinner alone is silent
<Spinner />
```

### Single-page apps (route changes)

- [ ] Update `document.title` on every route change — screen readers announce the title to orient the user
- [ ] Move focus to the main heading or top of content area after navigation

---

## General rules

- **Never remove or suppress focus indicators** — `outline: none` without a replacement fails WCAG 2.4.7
- **Use semantic HTML** — `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` are navigational landmarks for screen readers
- **Use tokens from `@entur/tokens`** for color — they are pre-tested for contrast. Never pair tokens from opposite contexts (e.g. `--text-light` on white)
- **Contrast ratios**: 4.5:1 for normal text, 3:1 for large text (18px+, or 14px bold) and graphical elements
- **Test with keyboard** before considering a feature complete — automated tools catch only ~30% of issues

---

## Norwegian context

Norwegian law requires public sector digital products to comply with WCAG 2.1, level AA. Entur, as a state-owned company, is subject to these requirements.

Common issues found in Norwegian audits (from uutilsynet.no tilsynsrapporter):

- Missing or incorrect form labels
- Insufficient color contrast
- No skip link to main content
- Broken keyboard navigation
- Missing heading structure

The Norwegian accessibility authority publishes regular audit reports: https://www.uutilsynet.no/tilsynsrapporter/tilsynsrapporter/270

---

## Reference files

- **`references/entur-a11y-patterns.md`** — `SkipToContent`, `VisuallyHidden`, form labeling, semantic HTML, ARIA live regions, image alt text, icon accessibility
- **`references/testing-guide.md`** — how to test keyboard navigation, zoom, color contrast, screen readers, heading structure; automated tool recommendations; Norwegian law context

---

## Quick reference

**Required in every app with navigation**: `SkipToContent` first element + `<main id="main-content">`  
**Form labels**: always `label` prop, never placeholder-only  
**Form errors**: `variant="negative"` + `feedback` together — not color alone  
**Icon buttons**: always `aria-label`  
**Contrast**: 4.5:1 text, 3:1 large text and graphics  
**Keyboard**: all functionality must be reachable by Tab  
**Test order**: keyboard → zoom → contrast → screen reader → automated

## Beyond Entur

For comprehensive general WCAG knowledge, the community skill `addyosmani/web-quality-skills@accessibility` covers broader patterns. External references: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/), [uutilsynet.no](https://www.uutilsynet.no/wcag-standarden/wcag-standarden/86).
