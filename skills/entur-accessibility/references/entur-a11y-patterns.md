# Entur Accessibility Patterns

Full docs: https://linje.entur.no/universell-utforming

## Package: @entur/a11y

```bash
yarn add @entur/a11y
```

```css
@import '@entur/a11y/dist/styles.css'; /* import first — before other @entur packages */
```

---

## SkipToContent

Allows keyboard users to skip past navigation and jump directly to main content. This is a WCAG 2.1 requirement (2.4.1 Bypass Blocks).

Place it as the **first focusable element** in the page. It's visually hidden until focused.

```tsx
import { SkipToContent } from '@entur/a11y';

// In your App or layout component — must be first in DOM
<SkipToContent>Hopp til hovedinnhold</SkipToContent>

<header>…nav…</header>

<main id="main-content">  {/* mainId prop default is "main-content" */}
  …
</main>
```

Props:

- `children` — the visible link text when focused (use Norwegian: "Hopp til hovedinnhold")
- `mainId` — ID of the main content element, defaults to `"main-content"`

Custom target ID:

```tsx
<SkipToContent mainId="content">Hopp til innhold</SkipToContent>
<main id="content">…</main>
```

---

## VisuallyHidden

Hides content visually while keeping it readable by screen readers. Use for supplementary context that sighted users get from visual layout but screen reader users need explicitly.

```tsx
import { VisuallyHidden } from '@entur/a11y';

// Add screen-reader-only context to an icon button
<button onClick={handleClose}>
  <CloseIcon aria-hidden="true" />
  <VisuallyHidden>Lukk dialog</VisuallyHidden>
</button>

// Clarify a standalone number
<span>
  3 <VisuallyHidden>uleste varsler</VisuallyHidden>
</span>

// Different element type
<VisuallyHidden as="p">
  Tabellen viser avganger sortert etter tid.
</VisuallyHidden>
```

Props:

- `as` — element type, defaults to `"span"`
- `children` — content for screen readers

---

## Contrast component

From `@entur/layout`. Places content on the Entur Lavender 90 (`#181c56`) background. Ensures white text is used, meeting contrast requirements automatically.

```tsx
import { Contrast } from '@entur/layout';

<Contrast>
  <Heading1>This text will be white on Lavender 90</Heading1>
</Contrast>;
```

---

## Form accessibility patterns

All `@entur/form` components handle labeling automatically. Always pass a `label` prop — never rely on `placeholder` alone:

```tsx
// Correct — label always visible
<TextField label="E-postadresse" placeholder="navn@eksempel.no" />

// Never do this — placeholder vanishes on input
<TextField placeholder="E-postadresse" /> // no label!
```

For custom validation, use the `feedback` and `variant` props:

```tsx
<TextField
  label="Mobilnummer"
  variant="negative"
  feedback="Ugyldig format. Bruk 8 siffer."
/>
```

The `feedback` prop renders inline validation text near the field, paired with visual `variant` styling.

For grouping related fields:

```tsx
import { Fieldset } from '@entur/form';

<Fieldset label="Reisedato">
  <DatePicker label="Fra" />
  <DatePicker label="Til" />
</Fieldset>;
```

---

## Semantic HTML patterns

Use structural HTML elements — screen readers navigate by landmarks:

```html
<header><!-- site header / top nav --></header>
<nav aria-label="Hovedmeny"><!-- navigation --></nav>
<main>
  <!-- primary content -->
  <section aria-labelledby="section-heading">
    <!-- thematic grouping -->
  </section>
  <aside><!-- supplementary content --></aside>
</main>
<footer><!-- page footer --></footer>
```

For interactive components not using native elements:

- Use ARIA roles: `role="dialog"`, `role="alert"`, `role="status"`, `role="tablist"`
- All interactive ARIA elements need keyboard support and focus management
- The `@entur/*` components handle this internally — use them rather than rolling your own

---

## Keyboard navigation

All `@entur/*` interactive components support full keyboard navigation out of the box:

- Tab to navigate, Enter/Space to activate
- Arrow keys for composite widgets (tabs, dropdowns, radio groups)
- Escape to close overlays

If building custom interactive elements:

- Ensure all functionality is reachable with Tab
- Visible focus ring is required (never `outline: none` without a replacement)
- Modal dialogs must trap focus inside while open

---

## Color contrast in code

Entur's semantic tokens are tested for correct contrast. When using raw hex values or custom styles:

- Text on background: 4.5:1 minimum (normal), 3:1 (large 18px+ or 14px bold)
- Graphical elements (icons, borders): 3:1 minimum

Contrast checker: https://linje.entur.no/universell-utforming/kontrastsjekker

---

## ARIA live regions

For dynamic content updates (alerts, toast notifications, results):

```tsx
// Use ToastProvider from @entur/alert for toast messages
// For custom live regions:
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// For urgent announcements (errors):
<div role="alert">
  {errorMessage}
</div>
```

---

## Images and icons

```tsx
// Informative image
<img src="…" alt="Togavgang fra Oslo S til Bergen, mandag 08:00" />

// Decorative image (hidden from screen readers)
<img src="…" alt="" role="presentation" />

// Informative icon — always label
<TrainIcon aria-label="Tog" />

// Decorative icon with adjacent text
<TrainIcon aria-hidden="true" />
<span>Tog</span>
```
