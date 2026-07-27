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
- `initialFocusRef` still works, but if omitted the browser decides which element receives initial focus (typically the first focusable element, or the dialog itself)

### Scroll lock

Body scroll is prevented with CSS (`html:has(dialog[open]) { overflow: hidden }`) instead of JavaScript.

**What you'll notice:**

- No layout shift from scrollbar disappearing — the CSS approach is cleaner
- If your app has custom scroll-lock logic that conflicts, you may see double-locking or no locking

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

## @entur/layout (beta Grid)

### No default gap

The beta `Grid` no longer has any default gap. If you relied on an implicit gap (e.g. inherited from a parent's CSS), items will be flush against each other.

**What you'll notice:**

- Grid items touching each other where they previously had spacing
- This is intentional — explicit `gap`, `rowGap`, or `columnGap` is now required

### Breakpoint key names

Responsive value objects use different key names (`sm` → `base`, `md` → `m`). If you missed updating one, the value will be silently ignored and the grid will fall back to its non-responsive default.

**What you'll notice:**

- Layout looks correct on some screen sizes but wrong on others — check for leftover `sm`/`md` keys in responsive value objects
- Console warnings for invalid breakpoint keys (the new version warns instead of silently ignoring)
