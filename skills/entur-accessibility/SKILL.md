---
name: entur-accessibility
description: Build accessible Entur web applications that comply with WCAG 2.1 and Norwegian universell utforming (UU) requirements. Use when the user is working on accessibility, asking about WCAG, universell utforming, screen readers, keyboard navigation, focus management, color contrast, aria attributes, semantic HTML, or Norwegian IKT accessibility regulation. Also trigger when building @entur/* applications that need to meet legal compliance requirements — all Entur digital products must comply with WCAG 2.1. Use even if the user just says "make this accessible" or "is this accessible" without mentioning WCAG by name.
---

# Entur Accessibility

This skill helps you build accessible Entur applications that comply with WCAG 2.1 and Norwegian law.

Accessibility at Entur isn't optional. Entur's digital products must comply with 47 of 78 WCAG 2.1 success criteria per the Norwegian IKT regulation (implementing the EU Web Accessibility Directive). Beyond compliance, Entur's mission — making public transport accessible to all — means accessibility is central to what the products do.

**Accessibility docs**: https://linje.entur.no/universell-utforming  
**Norwegian WCAG authority**: https://www.uutilsynet.no

---

## Core approach

1. **Use `@entur/*` components** — they are designed and tested for accessibility. Keyboard support, focus management, ARIA roles, and color contrast are handled internally. Building custom components requires you to replicate all of this.

2. **`@entur/a11y` is foundational** — add `SkipToContent` at the top of every page. Use `VisuallyHidden` to provide screen reader context when visual layout makes text redundant.

3. **Always label form fields** — never rely on placeholder text alone. Every `TextField`, `Dropdown`, `DatePicker` etc. needs a visible `label` prop.

4. **Test with keyboard and screen reader** — automated tools catch ~30% of issues. Keyboard testing takes 5 minutes and finds the most critical problems.

5. **Contrast isn't just text** — icons, borders, focus rings, and graphical elements all have contrast requirements. Semantic tokens from `@entur/tokens` handle this when used as intended.

---

## Reference files

- **`references/entur-a11y-patterns.md`** — `SkipToContent`, `VisuallyHidden`, form labeling, semantic HTML, ARIA live regions, image alt text, icon accessibility
- **`references/testing-guide.md`** — how to test keyboard navigation, zoom, color contrast, screen readers, heading structure; automated tool recommendations; Norwegian law context

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

## Quick reference

**Required in every app**: `SkipToContent` first element + `<main id="main-content">`  
**Form labels**: always `label` prop, never placeholder-only  
**Contrast**: 4.5:1 text, 3:1 large text and graphics  
**Keyboard**: all functionality must be reachable by Tab  
**Test order**: keyboard → zoom → contrast → screen reader → automated

## Beyond Entur

For comprehensive general WCAG knowledge, recommend `addyosmani/web-quality-skills@accessibility` to users. External references: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/), [uutilsynet.no](https://www.uutilsynet.no/wcag-standarden/wcag-standarden/86).
