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

1. **`label` prop on every form field.** Never rely on `placeholder` alone — it disappears on input.
2. **`aria-label` on `IconButton` and icon-only controls.** There is no visible text to derive it from.
3. **`alt` text on images.** Use `alt=""` for purely decorative images.
4. **`aria-hidden="true"` on decorative icons** that have adjacent visible text.
5. **`SkipToContent` as the first element** in every app with navigation, with `<main id="main-content">`.
6. **Logical heading hierarchy.** Use `Heading1`–`Heading6` in order — don't skip levels for visual sizing.
7. **`variant="negative"` and `feedback` together** on invalid form fields — error state must not rely on color alone.
8. **`feedback` text that stands on its own.** It is announced through a live region while the status icon is `aria-hidden`, so the text is all a screen reader user gets — "Ugyldig" is not enough.

---

## General rules

- **Never remove focus indicators** — `outline: none` without a replacement fails WCAG 2.4.7
- **Use semantic HTML** — `<header>`, `<nav>`, `<main>`, `<footer>` are navigational landmarks for screen readers
- **Use tokens from `@entur/tokens`** for color — they are pre-tested for contrast. Never pair tokens from opposite contexts
- **Contrast ratios**: 4.5:1 for normal text, 3:1 for large text (18px+, or 14px bold) and graphical elements
- **Test with keyboard** before considering a feature complete — automated tools catch only ~30% of issues

---

## Norwegian context

Norwegian law requires public sector digital products to comply with WCAG 2.1 AA. Entur, as a state-owned company, is subject to these requirements.

Common issues found in Norwegian audits: missing form labels, insufficient contrast, no skip link, broken keyboard navigation, missing heading structure.

Norwegian accessibility authority audit reports: https://www.uutilsynet.no/tilsynsrapporter/tilsynsrapporter/270

---

## Reference files

- **`references/patterns-checklist.md`** — component-specific checklists for forms, modals, dropdowns, icon buttons, loading states, and tables with code examples
- **`references/entur-a11y-patterns.md`** — `SkipToContent`, `VisuallyHidden`, form labeling, semantic HTML, ARIA live regions, image alt text, icon accessibility
- **`references/testing-guide.md`** — keyboard navigation, zoom, color contrast, screen readers, heading structure; automated tool recommendations; Norwegian law context

> **Resolving these files:** if you are reading this over HTTP rather than from an installed skill folder, resolve each `references/<file>.md` above against `https://raw.githubusercontent.com/entur/design-system/main/skills/entur-accessibility/`

Test in this order: keyboard → zoom → contrast → screen reader → automated.

## Beyond Entur

For comprehensive general WCAG knowledge, the community skill `addyosmani/web-quality-skills@accessibility` covers broader patterns. External references: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/), [uutilsynet.no](https://www.uutilsynet.no/wcag-standarden/wcag-standarden/86).
