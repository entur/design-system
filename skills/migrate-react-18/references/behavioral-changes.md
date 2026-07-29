# Behavioral Changes After Migration

These changes require no code fix but alter how components behave. Review each section for packages your project uses.

---

## @entur/modal

### Native `<dialog>` top-layer rendering

The modal now renders in the browser's **top layer** via `showModal()`. This is above all other content regardless of z-index.

**What you'll notice:**

- Z-index conflicts with the modal are eliminated — it always renders on top
- Custom z-index values on modal-related elements may no longer have any effect (the top layer ignores the stacking context)
- The backdrop is now a `::backdrop` pseudo-element, not a separate DOM node — CSS that targeted the overlay div directly (beyond `.eds-modal__overlay`) may not apply

### Focus behavior

Focus trapping and restoration are now handled natively by `<dialog>`, not by JavaScript.

**What you'll notice:**

- Focus moves into the dialog on open and returns to the trigger on close — same as before, but the browser handles it
- Edge cases where JavaScript focus trapping conflicted with other focus management (e.g. third-party widgets inside modals) may resolve themselves
- `initialFocusRef` still works. If omitted, focus goes to the modal title (or the dialog itself when there is no title) rather than the first interactive element

### Scroll lock

Body scroll is prevented with CSS (`html:has(.eds-modal__overlay[open]) { overflow: hidden }`) instead of JavaScript.

**What you'll notice:**

- No layout shift from scrollbar disappearing — the CSS approach is cleaner
- If your app has custom scroll-lock logic that conflicts, you may see double-locking or no locking

### Server rendering

The overlay is portalled into `document.body`, which cannot be server-rendered, so it renders nothing on the server and nothing on the first client render — it appears right after hydration.

**What you'll notice:**

- No `<dialog>` in server-rendered HTML, even for a modal that starts `open`
- Tests that assert on markup before effects have flushed won't find the dialog; use `await waitFor(...)` or let your testing library's `render` flush effects
- This is deliberate: rendering the portal during hydration made React discard the server HTML for the entire root (hydration error #418/#423)

---

## @entur/tab

### Generated ID format

Tab and panel IDs now use React's `useId()` format (e.g. `:r1:`) instead of Reach's scheme (e.g. `tabs--tab--0`).

**What you'll notice:**

- Any external code that references tab/panel IDs by string will break — use `aria-controls` and `aria-labelledby` attributes to find linked elements instead
- Browser devtools will show the new ID format in the DOM
- Deep links or URL fragments pointing to specific tab panel IDs will stop working

---

## @entur/expand

### Collapsed content remains in DOM

Previously, collapsed content was unmounted (removed from DOM). Now it stays in the DOM with `aria-hidden="true"` and `inert`.

**What you'll notice:**

- `document.querySelector` will find elements inside collapsed sections — previously it would not
- Component state inside collapsed sections is preserved across open/close cycles — previously it reset on every expand
- Form inputs inside collapsed panels retain their values when collapsed and re-expanded
- `SideNavigationGroup` from `@entur/menu` is also affected — collapsed groups keep their content in DOM
- Page-level `querySelectorAll` counts (e.g. counting all buttons on the page) may include hidden elements inside collapsed sections
- Search-in-page (Ctrl+F) may find text inside collapsed sections (browser-dependent)

Use `unmountOnClose={true}` on any component where you need the old unmounting behavior.

### Animation

The expand/collapse animation now uses CSS `grid-template-rows` transition instead of JavaScript height calculation.

**What you'll notice:**

- Smoother animation, especially on lower-end devices
- No height recalculation flicker on content that changes size during animation

---

## @entur/layout (beta Grid and Flex)

### Responsive props resolve in CSS, not JavaScript

Responsive values are emitted as CSS custom properties and resolved by media queries, instead of being computed from a JS breakpoint hook.

**What you'll notice:**

- Correct layout in server-rendered HTML and on first paint — no flash of the mobile layout while JS boots
- No re-render on viewport resize; the browser handles the switch
- Breakpoints are fixed (`base` 0, `s` 600px, `m` 800px, `lg` 1200px, `xl` 1400px) and can no longer be configured

### Breakpoint key names

The base key is now `base` (was `s`), and `s` has been reused for a new 600px breakpoint. A responsive object without `base` is ignored entirely, with a console warning in development.

**What you'll notice:**

- Layout correct on some screen sizes but wrong on others — check for leftover `s:` keys that were meant as the mobile base
- Console warnings naming unknown or missing keys during development
- Console warnings for invalid breakpoint keys (the new version warns instead of silently ignoring)
