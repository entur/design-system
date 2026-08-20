# Accessibility Testing Guide

Source: https://linje.entur.no/universell-utforming/testguide  
Norwegian authority: https://www.uutilsynet.no/regelverk/sjekk-nettstedet-ditt-selv/708

Entur must comply with WCAG 2.1, 47 of 78 success criteria, per Norwegian law (EUs webdirektiv / WAD implemented in Norwegian IKT regulation). More requirements are expected to come.

---

## 1. Keyboard navigation

Many users depend on keyboard only — motor impairments, screen reader users, and power users.

**How to test**: Press Tab repeatedly through the page. Check:

- Is there a skip link (SkipToContent) at the very top?
- Is the focus indicator clearly visible on every step?
- Does Tab order follow a logical reading sequence?
- Can you reach and activate all interactive elements (links, buttons, form fields)?
- For modals/drawers: does focus move inside when opened, and does it return to the trigger when closed?
- For expanded/collapsed UI (accordions, dropdowns): does focus end up in the right place?

Reference: https://www.uutilsynet.no/wcag-standarden/tastaturnavigasjon/37

---

## 2. Zoom and responsive design

Users with low vision use browser zoom to enlarge text. Responsive design breaks in at zoom because the browser reports a smaller viewport.

**How to test**:

- Full screen → zoom to 200% → verify all content and actions are still accessible
- Zoom further to 400% if possible
- Slowly shrink the browser window from full width to minimum — check layout throughout
- On mobile: verify zoom works (don't use `user-scalable=no` in the meta viewport tag)

---

## 3. Color and contrast

Low contrast affects users with low vision, dyslexia, and anyone in poor lighting.

**How to test**:

- Measure contrast with browser DevTools (Chrome: Elements panel shows contrast ratio in color picker)
- Tool: [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/) — free, Windows/Mac
- Minimum ratios: 4.5:1 (normal text), 3:1 (large text ≥18px regular or 14px bold)
- Check links in text: must differ from surrounding text by more than color alone, OR meet 3:1 contrast with surrounding text

**Colorblindness simulation**:

- Chrome: DevTools → Rendering → Emulate vision deficiencies
- CCA (Windows): Image → Screen → select colorblindness type
- [Funkify](https://www.funkify.org/) browser extension

Particularly important for data visualizations — test with deuteranopia (red-green). Use the ordered data color palette from `data-visualization.md`.

Reference: https://linje.entur.no/universell-utforming/kontrastsjekker

---

## 4. Heading structure

Screen reader users navigate by headings to orient in a page.

**How to test**:

- Read through a page's headings — do they describe the content sections?
- Is there exactly one `<h1>` per page?
- Do heading levels increment logically (h1 → h2 → h3, not h1 → h3)?
- Are headings meaningful (not "Click here")?

Browser extension: [Headings Map](https://chromewebstore.google.com/detail/headings-map/flbjommegcjonpdmenkdiocclhjacmbi) shows the heading outline.

---

## 5. Screen reader testing

Screen readers convert page content to speech and braille. Test with real screen readers, not just automated tools.

**Recommended combinations**:

- VoiceOver + Safari (Mac/iOS) — most common for Apple users
- NVDA + Firefox or Chrome (Windows) — free
- JAWS + Chrome or Edge (Windows) — most used in enterprise

**What to check**:

- Page title is descriptive
- Images have meaningful alt text (or `alt=""` if decorative)
- Form fields have visible, associated labels
- Error messages are announced when they appear — and only once. Two announcements of the same text usually means an `aria-live` wrapper around a field that already announces its `feedback`
- A field's error message says what is wrong without relying on the status icon, which is `aria-hidden`
- Status updates (loading, results) use `aria-live` regions
- Interactive elements have accessible names (especially icon-only buttons)

---

## 6. Automated tools (catch ~30% of issues)

Use automated checks as a first pass, not a complete test:

- **axe DevTools** (Chrome extension) — best free automated checker
- **Lighthouse** (Chrome DevTools → Lighthouse → Accessibility) — quick scan
- **WAVE** (wave.webaim.org or extension) — visual annotations on the page

Automated tools can't catch: missing alt text meaning, logical heading structure, keyboard focus management, or whether aria-labels make sense.

---

## 7. Who to design for

Accessibility covers many situations — not just permanent disabilities:

- **Visual**: blindness, low vision, color blindness, and situational (bright sun on screen)
- **Motor**: tremors, paralysis, broken arm — anything limiting precise mouse use
- **Cognitive**: dyslexia, attention, memory — simplified language and clear structure help everyone
- **Auditory**: deafness or hearing loss — relevant if using audio/video

Design for the edge case and you improve it for everyone. An app that works with only keyboard works better for everyone using a TV remote, game controller, or mobile without touchscreen.

Reference: https://linje.entur.no/universell-utforming/hvem-designer-vi-for  
More: https://www.uutilsynet.no/veiledning/hvem-er-brukerne/239

---

## External resources

- W3C WCAG 2.1 quick reference: https://www.w3.org/WAI/WCAG21/quickref/
- MDN accessibility guide: https://developer.mozilla.org/en-US/docs/Learn/Accessibility
- Norwegian WCAG authority: https://www.uutilsynet.no/wcag-standarden/wcag-standarden/86
- Past Norwegian audit reports (patterns to avoid): https://www.uutilsynet.no/tilsynsrapporter/tilsynsrapporter/270

For comprehensive WCAG knowledge, also reference the `addyosmani/web-quality-skills@accessibility` skill (19.6K installs).
