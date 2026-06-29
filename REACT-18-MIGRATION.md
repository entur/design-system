# React 18 Migration Guide

This document outlines the changes made to upgrade `@entur/*` packages from React 17 to React 18, and what consumers need to know.

## Overview

All `@entur/*` packages now require **React 18.0.0 or higher** as a peer dependency. This is a **breaking change** for consumers still using React 17.

## Required Changes for Consumers

### 1. Upgrade React

Update your project's React dependencies:

```bash
npm install react@^18 react-dom@^18 @types/react@^18 @types/react-dom@^18
```

### 2. Update Your Entry Point (createRoot)

React 18 introduces a new root API. Update your application entry point:

**Before (React 17):**

```tsx
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

**After (React 18):**

```tsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

### 3. TypeScript Configuration

If you use TypeScript, update your `tsconfig.json` to use the new JSX transform:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

This enables the automatic JSX runtime, so you no longer need `import React from 'react'` at the top of every file that uses JSX.

## Breaking Changes

### Quick Summary: Will There Be Breaking API Changes?

**No breaking API changes** for `@entur/modal`. The `@entur/tab` package has **stricter TypeScript types** and **changed DOM output** (see [@entur/tab](#enturtab) below). The `@entur/expand` package has **new props** and a **behavioral change** (content now stays in the DOM when collapsed instead of being unmounted). See [@entur/expand](#enturexpand) below.

| Component         | Public API changed? | Props changed?    | Behavior changed?  |
| ----------------- | ------------------- | ----------------- | ------------------ |
| `Modal`           | ❌ No               | ❌ No             | ❌ No              |
| `ModalOverlay`    | ❌ No               | ❌ No             | ❌ No              |
| `ModalContent`    | ❌ No               | ❌ No             | ❌ No              |
| `Drawer`          | ❌ No               | ❌ No             | ❌ No              |
| `Tabs`            | ❌ No               | ✅ Stricter types | ❌ No              |
| `TabList`         | ❌ No               | ✅ Stricter types | ❌ No              |
| `Tab`             | ❌ No               | ✅ Stricter types | ❌ No              |
| `TabPanel`        | ❌ No               | ✅ Stricter types | ❌ No              |
| `TabPanels`       | ❌ No               | ✅ New props      | ❌ No              |
| `ExpandablePanel` | ❌ No               | ✅ New props      | ✅ Yes (see below) |
| `ExpandableText`  | ❌ No               | ✅ New props      | ✅ Yes (see below) |
| `Accordion`       | ❌ No               | ✅ New props      | ✅ Yes (see below) |
| `AccordionItem`   | ❌ No               | ✅ New props      | ✅ Yes (see below) |
| `BaseExpand`      | ❌ No               | ✅ New props      | ✅ Yes (see below) |
| `useRandomId`     | ⚠️ Deprecated       | ❌ No             | ❌ No              |

All existing props — including the `as` prop for polymorphic rendering — continue to work as before.

### Peer Dependencies

All packages now require:

- `react: >=18.0.0` (previously `>=16.8.0`)
- `react-dom: >=18.0.0` (previously `>=16.8.0`)

### @entur/modal

The internal implementation of `@entur/modal` has been migrated from `@reach/dialog` (deprecated, unmaintained) to `@react-aria/dialog` + `@react-aria/overlays` (actively maintained, React 18 compatible). See [Provider Choice Analysis](#provider-choice-analysis) for reasoning.

**What changed internally:**

- `@reach/dialog` → `@react-aria/dialog` + `@react-aria/overlays` + `@react-aria/focus`
- Focus trapping now uses `FocusScope` from `@react-aria/focus` (previously `@reach/dialog`'s built-in)
- Overlay management now uses `useModalOverlay` + `OverlayContainer` (previously `@reach/dialog`'s `DialogOverlay`)

**What is preserved for consumers:**

- ✅ `Modal` component with `open`, `onDismiss`, `size`, `title`, `closeLabel`, `closeOnClickOutside`, `initialFocusRef`, `align` props
- ✅ `ModalOverlay` component with `open`, `onDismiss`, `initialFocusRef` props
- ✅ `ModalContent` component with `size`, `title`, `align` props
- ✅ `Drawer` component with `open`, `onDismiss`, `title`, `closeLabel`, `contrast`, `overlay` props
- ✅ Focus trapping and restoration
- ✅ Escape key to close
- ✅ Click-outside-to-close (when `closeOnClickOutside` is true)
- ✅ All CSS class names (`eds-modal__*`, `eds-drawer__*`)

**What consumers need to do:** No changes required if you are using the documented API.

### @entur/tab

The internal implementation of `@entur/tab` has been migrated from `@reach/tabs` (deprecated, unmaintained) to a native ARIA tab implementation with no third-party dependency. See [Provider Choice Analysis](#provider-choice-analysis) for reasoning.

**What changed internally:**

- `@reach/tabs` → Native ARIA implementation (zero dependencies)
- Tab state management now uses React Context (`TabsContext`) instead of Reach's internal state
- ARIA attributes (`role`, `aria-selected`, `aria-controls`, `aria-labelledby`) are applied directly
- Keyboard navigation (ArrowLeft, ArrowRight, Home, End) is implemented natively in `TabList`

**What is preserved for consumers:**

- ✅ `Tabs` component with `index`, `defaultIndex`, `onChange`, `as` props (controlled and uncontrolled)
- ✅ `TabList` component with `width`, `as` props
- ✅ `Tab` component with `disabled`, `as` props
- ✅ `TabPanel` and `TabPanels` components with `as` prop
- ✅ Keyboard navigation (Arrow Left/Right, Home, End)
- ✅ ARIA roles and attributes (tablist, tab, tabpanel, aria-selected, aria-controls)
- ✅ All CSS class names (`eds-tabs`, `eds-tab`, `eds-tab-list`, `eds-tab-panel`, `eds-tab-panels`)

**What consumers need to do:**

1. **Remove `data-reach-*` selectors** — If your CSS or tests target `[data-reach-tab]`, `[data-reach-tab-list]`, etc., replace them with `.eds-tab`, `.eds-tab-list`, `.eds-tab-panel`, or role selectors (`[role="tab"]`, `[role="tablist"]`, `[role="tabpanel"]`).

2. **Remove non-standard props** — Components previously accepted arbitrary props via `[key: string]: any`. Now types are strict. All standard HTML attributes (`className`, `style`, `id`, event handlers) still work. Remove any Reach-specific or unknown props.

3. **Don't hardcode generated IDs in tests** — Tab and panel IDs now use React's `useId()` format instead of Reach's ID scheme. Use `aria-controls`/`aria-labelledby` to find linked elements instead of matching specific ID strings.

**New features:**

- `keepMounted` prop on `TabPanels` — keeps all panels in the DOM with `hidden` attribute instead of unmounting
- SSR-compatible — `useId()` produces stable IDs across server and client rendering
- `aria-label` and `aria-labelledby` are now explicitly typed on `TabList`

### @entur/expand

The internal implementation of `@entur/expand` has been migrated from `react-collapse` (unmaintained, last published 2021) to a CSS grid animation with zero dependencies.

**Breaking behavioral change — content stays in the DOM when collapsed:**

Previously, collapsed content was unmounted (removed from the DOM). Now, collapsed content **stays in the DOM** but is hidden with `aria-hidden="true"` and `inert`. This is the new default behavior, matching how native `<details>` elements work.

**If you relied on content being removed from the DOM when collapsed** (e.g., checking `document.querySelector` for elements inside collapsed sections, or relying on unmounting to reset component state), you can restore the old behavior with `unmountOnClose={true}`:

```tsx
// Old behavior: content is removed from DOM when collapsed
<ExpandablePanel unmountOnClose={true} title="...">
  {children}
</ExpandablePanel>
```

This also affects `SideNavigationGroup` in `@entur/menu`, which uses `BaseExpand` internally. Content inside collapsed side navigation groups now stays in the DOM (hidden with `aria-hidden`).

**New props:**

| Component         | New props                                                     |
| ----------------- | ------------------------------------------------------------- |
| `ExpandablePanel` | `open`, `onToggle` (proper controlled mode), `unmountOnClose` |
| `ExpandableText`  | `unmountOnClose`                                              |
| `AccordionItem`   | `unmountOnClose`                                              |
| `Accordion`       | `openId`, `onToggle`, `defaultOpenId` (controlled mode)       |
| `BaseExpand`      | `unmountOnClose`                                              |

**All expand components now support `ref` forwarding** via `React.forwardRef`.

**What consumers need to do:**

- Most consumers need no changes — the new default behavior is better for accessibility and performance
- If you depend on collapsed content being removed from the DOM, add `unmountOnClose={true}`
- If you want controlled accordion behavior, you can now use `openId` and `onToggle` on `Accordion`

### @entur/utils

#### `useRandomId` is deprecated

`useRandomId` from `@entur/utils` is now deprecated. React 18 provides `useId()` natively, which serves the same purpose. Replace usages as follows:

**Before:**

```tsx
import { useRandomId } from '@entur/utils';

const MyComponent = () => {
  const id = useRandomId('eds-my-component');
  return <div id={id}>...</div>;
};
```

**After:**

```tsx
import { useId } from 'react';

const MyComponent = () => {
  const id = `eds-my-component${useId()}`;
  return <div id={id}>...</div>;
};
```

`useRandomId` will continue to work (it delegates to `useId()` internally), but will be removed in a future major version.

### React 18 Behavioral Changes

React 18 introduces several behavioral changes that may affect your application:

#### Automatic Batching

React 18 automatically batches state updates in all contexts (previously only in React event handlers). This means:

- Fewer re-renders, which improves performance
- Intermediate states may not be visible during rapid state updates
- If you rely on seeing intermediate states (e.g., loading indicators during quick operations), you may need to use `ReactDOM.flushSync()` to force synchronous updates

#### Strict Mode

React 18's `<StrictMode>` now simulates component mounting, unmounting, and re-mounting in development. This helps find bugs related to:

- Missing cleanup in `useEffect`
- Components not being resilient to being mounted twice

If you see double renders in development, this is expected behavior when using `<StrictMode>`.

## Provider Choice Analysis

### Why Not @radix-ui?

Initially, the migration from `@reach/*` considered `@radix-ui` as a replacement. While Radix UI is an excellent library, introducing it would have added a **new third-party UI provider** to the project. After analysis, we chose to use existing providers instead:

| Criterion               | @radix-ui (rejected)  | @react-aria (chosen for modal)          | Native ARIA (chosen for tabs) |
| ----------------------- | --------------------- | --------------------------------------- | ----------------------------- |
| **Already in project?** | ❌ New provider       | ✅ Used by @entur/datepicker            | ✅ No dependency needed       |
| **Packages added**      | 21 new packages       | 3 new packages (shared infrastructure)  | 0 new packages                |
| **API approach**        | Component-based       | Hook-based (consistent with datepicker) | Standard HTML + ARIA          |
| **Control**             | Moderate              | High (hooks give full control)          | Full control                  |
| **Maintenance burden**  | New provider to track | Already tracked                         | None                          |

### Why @react-aria for Modal?

The `@entur/datepicker` package already depends on `@react-aria/*` (6 packages: button, calendar, datepicker, i18n + stately). Using `@react-aria/dialog` and `@react-aria/overlays` for the modal:

1. **Reuses existing provider** — `@react-aria` is already a trusted, maintained dependency
2. **Shares infrastructure** — `@react-aria/utils`, `@react-aria/focus`, `@react-aria/ssr` are already transitive dependencies. Adding dialog/overlays only adds 3 new packages
3. **Consistent architecture** — Hook-based approach matches how the datepicker uses @react-aria
4. **Full accessibility** — `useDialog`, `useModalOverlay`, and `FocusScope` provide complete dialog accessibility (ARIA roles, focus trapping, Escape key, click-outside dismissal)

### Why Native ARIA for Tabs?

Instead of using `@react-aria/tabs`, tabs are implemented with native ARIA attributes:

1. **@react-aria/tabs uses Collections API** — Its `useTabListState` requires `Item` components from `@react-stately/collections`, which is fundamentally incompatible with the existing consumer API pattern (`<Tab>`, `<TabPanel>` children). Adapting it would require complex adapter code that's harder to maintain
2. **Tabs are simple** — The ARIA tab pattern is well-defined (WAI-ARIA Authoring Practices) and straightforward to implement: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, and keyboard navigation
3. **No new dependencies** — Zero additional packages needed
4. **Full control** — We control the exact DOM output, keyboard behavior, and styling hooks

### What About @floating-ui?

`@floating-ui` (already used by @entur/tooltip, @entur/dropdown, @entur/menu, @entur/datepicker) is a **positioning library**. It handles where floating elements appear relative to their reference elements. It is not suitable for modals or tabs because:

- Modals need focus trapping, scroll prevention, overlay management — not positioning
- Tabs need selection state management and keyboard navigation — not positioning

`@floating-ui` remains the correct choice for tooltips, dropdowns, menus, and popovers.

### What About @digdir/designsystemet-react (Designsystemet.no)?

[Designsystemet.no](https://designsystemet.no) is Norway's national design system from DigDir (Digitaliseringsdirektoratet). It provides React components via `@digdir/designsystemet-react`, including both [Tabs](https://designsystemet.no/no/components/docs/tabs/overview) and [Dialog](https://designsystemet.no/no/components/docs/dialog/overview) components. Here is an evaluation of using these as replacements for our current implementations:

#### Bundle Size Impact

Using `@digdir/designsystemet-react` would bring in these **hard dependencies** (not peer deps):

| Dependency                                | Size concern                                      | Overlap with Entur?          |
| ----------------------------------------- | ------------------------------------------------- | ---------------------------- |
| `@digdir/designsystemet-web`              | Custom element definitions for tabs, dialog, etc. | ❌ None                      |
| `@digdir/designsystemet-types`            | Type definitions                                  | ❌ None                      |
| `@navikt/aksel-icons`                     | NAV's entire icon set                             | ❌ Entur uses `@entur/icons` |
| `@radix-ui/react-slot`                    | Re-introduces Radix UI                            | ❌ Just removed              |
| `@tanstack/react-virtual`                 | Virtualization library                            | ❌ Not currently used        |
| `@floating-ui/react` + `@floating-ui/dom` | Positioning library                               | ✅ Already used              |
| `clsx`                                    | Class names utility                               | ❌ Entur uses `classnames`   |

Even with tree-shaking, the hard dependencies are all installed. Using just 2 components from `@digdir/designsystemet-react` would pull in NAV's icon library, re-introduce `@radix-ui`, and add a virtualization library — none of which Entur needs.

Additionally, Designsystemet requires global CSS imports:

```js
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-css/theme';
```

These would conflict with Entur's existing `eds-*` BEM styling system and design tokens from `@entur/tokens`.

#### Technical Conflicts

**CSS/Design language clash**: Designsystemet has its own design tokens, color palette, typography, and spacing system. Entur has its own brand identity with distinct tokens. Running two design systems side-by-side would create visual inconsistency and CSS specificity conflicts.

**Web components in Tabs**: Designsystemet's Tabs uses custom elements (`<ds-tabs>`, `<ds-tab>`, `<ds-tablist>`, `<ds-tabpanel>`) from `@digdir/designsystemet-web`. This introduces:

- Custom element registration side-effects on import
- `suppressHydrationWarning` requirements (SSR complexity)
- Non-standard DOM output that doesn't match Entur's testing patterns
- Potential conflicts with other custom element registrations

**Dialog uses native `<dialog>`**: Their Dialog wraps the native HTML `<dialog>` element, which is good for standards but has a different mental model than our overlay-based approach. Their Dialog also uses `@radix-ui/react-slot` for the `asChild` pattern.

#### API Mismatch

| Feature               | Entur (current)                              | Designsystemet                                   |
| --------------------- | -------------------------------------------- | ------------------------------------------------ |
| **Tab selection**     | Index-based (`index={0}`)                    | Value-based (`value="tab1"`)                     |
| **Tab onChange**      | `onChange(index: number)`                    | `onChange(value: string)`                        |
| **Modal open/close**  | `open` + `onDismiss` props                   | `open` prop + `ref.close()` or `command` pattern |
| **Focus management**  | `initialFocusRef` prop                       | `autofocus` attribute                            |
| **Tab keyboard nav**  | Handled internally                           | Handled by custom element                        |
| **Tab panel wrapper** | `<TabPanels>` component                      | No wrapper needed                                |
| **Modal sizes**       | `size="small" \| "medium" \| "large" \| ...` | `data-placement` attribute                       |

Adopting Designsystemet's API would require breaking changes to all consumer code for both `@entur/modal` and `@entur/tab`.

#### Maintenance Considerations

- **Two design systems to track**: Entur would need to follow Designsystemet releases, test for regressions, and handle breaking changes from an external team with different release cadences
- **Not a headless library**: Unlike `@react-aria` (which provides behavior without styling), Designsystemet is a full design system with opinionated visuals. Using individual components from it treats it as a utility library, which is not its intended use
- **Rapid iteration**: Designsystemet is actively evolving (v1.12.1 as of early 2026). The Tabs component recently moved from React-only to custom elements, showing significant architectural changes between versions

#### Verdict: Not Recommended

`@digdir/designsystemet-react` is excellent for projects that adopt Designsystemet as their **primary** design system (e.g., Norwegian public sector services). However, for Entur's design system:

1. ❌ **Bundle overhead**: Pulls in 7 hard dependencies including NAV icons and @radix-ui
2. ❌ **CSS conflicts**: Two competing design systems with different tokens and styling approaches
3. ❌ **API breaking changes**: Different prop patterns would break all consumer code
4. ❌ **Re-introduces @radix-ui**: Which was just removed to reduce the provider footprint
5. ❌ **Not a headless library**: It's a complete design system, not a utility to cherry-pick from
6. ❌ **Web component complexity**: Custom elements add SSR/hydration/testing concerns

The current approach ([@react-aria for Modal](#why-react-aria-for-modal), [native ARIA for Tabs](#why-native-aria-for-tabs)) is better suited because it provides accessible behavior primitives without imposing external design opinions or unnecessary dependencies.

### Provider Summary

After the migration, the design system uses **3 UI providers**, each for its strengths:

| Provider         | Used in                             | Purpose                                               |
| ---------------- | ----------------------------------- | ----------------------------------------------------- |
| **@react-aria**  | datepicker, modal                   | Accessible form components, dialog/overlay management |
| **@floating-ui** | tooltip, dropdown, menu, datepicker | Floating element positioning                          |
| **downshift**    | dropdown                            | Combobox/select state management                      |

### @reach Package Audit

All `@reach/*` packages have been migrated:

| @reach package  | Migrated to                                                   | When                |
| --------------- | ------------------------------------------------------------- | ------------------- |
| `@reach/dialog` | `@react-aria/dialog` + `@react-aria/overlays`                 | This migration      |
| `@reach/tabs`   | Native ARIA implementation                                    | This migration      |
| `@reach/menu`   | `@floating-ui/react`                                          | Previously migrated |
| `@reach/router` | N/A — Gatsby's internal dependency (`@gatsbyjs/reach-router`) | Not ours to migrate |

### Other Deprecated Dependencies

| Package          | Migrated to        | Notes                                                                                                 |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `react-collapse` | CSS grid animation | Unmaintained since 2021. Replaced with zero-dependency CSS `grid-template-rows: 0fr → 1fr` transition |

## Third-Party Dependencies

### Updated Dependencies

| Package                  | Previous | New     | Notes                                                     |
| ------------------------ | -------- | ------- | --------------------------------------------------------- |
| `@reach/dialog`          | 0.16.2   | Removed | Replaced by `@react-aria/dialog` + `@react-aria/overlays` |
| `@reach/tabs`            | 0.15.3   | Removed | Replaced by native ARIA implementation                    |
| `react-collapse`         | 5.1.1    | Removed | Replaced by CSS grid animation (zero dependencies)        |
| `@testing-library/react` | 10.4.9   | 16.3.0  | React 18 support                                          |
| `@testing-library/dom`   | —        | 10.4.1  | New peer dependency                                       |

### Unchanged Dependencies (React 18 Compatible)

| Package                  | Version | Status                                   |
| ------------------------ | ------- | ---------------------------------------- |
| `react-dropzone`         | 11.7.1  | Works with React 18 (peer dep: `>=16.8`) |
| `react-focus-lock`       | 2.13.6  | Works with React 18                      |
| `downshift`              | 9.0.10  | Works with React 18                      |
| `@floating-ui/react`     | 0.26.28 | Works with React 18                      |
| `@floating-ui/react-dom` | 2.1.6   | Works with React 18                      |
| `@react-aria/*`          | 3.x     | Works with React 18                      |
| `@react-stately/*`       | 3.x     | Works with React 18                      |

## Testing Changes

If you use `@testing-library/react` in your tests, upgrade to version 14 or higher:

```bash
npm install --save-dev @testing-library/react@^16 @testing-library/dom@^10
```

### Key Testing Changes

1. **`act()` is automatically handled** by `@testing-library/react` 14+ in most cases
2. **`waitFor` may need longer timeouts** for async operations due to React 18's automatic batching
3. **Intermediate state assertions may be unreliable** — avoid asserting on loading states that appear and disappear rapidly
4. **`react-dom/test-utils`**: The `act` function should be imported from `react` directly instead of `react-dom/test-utils`

## Why React 18?

- **Performance**: Automatic batching reduces unnecessary re-renders
- **Concurrent Features**: Enables future use of `useTransition`, `useDeferredValue`, and Suspense for data fetching
- **Maintained Dependencies**: Allows use of actively maintained libraries instead of deprecated ones (Reach UI)
- **Ecosystem Alignment**: Most React libraries now require or recommend React 18+
