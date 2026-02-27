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

### Peer Dependencies

All packages now require:

- `react: >=18.0.0` (previously `>=16.8.0`)
- `react-dom: >=18.0.0` (previously `>=16.8.0`)

### @entur/modal

The internal implementation of `@entur/modal` has been migrated from `@reach/dialog` (deprecated, unmaintained) to `@radix-ui/react-dialog` (actively maintained, React 18 compatible).

**What changed:**

- The public API (`Modal`, `ModalOverlay`, `ModalContent`, `Drawer`) remains the same
- Props (`open`, `onDismiss`, `initialFocusRef`, `size`, `title`, etc.) are unchanged
- The `as` prop on `ModalContent` is no longer supported. If you were using it, please use standard composition patterns instead
- Focus management and keyboard interactions (Escape to close) work the same way

**What consumers need to do:** No changes required if you are using the documented API.

### @entur/tab

The internal implementation of `@entur/tab` has been migrated from `@reach/tabs` (deprecated, unmaintained) to `@radix-ui/react-tabs` (actively maintained, React 18 compatible).

**What changed:**

- The public API (`Tabs`, `TabList`, `Tab`, `TabPanel`, `TabPanels`) remains the same
- Props (`index`, `defaultIndex`, `onChange`, `disabled`, `width`, etc.) are unchanged
- The `as` prop on Tab components is no longer supported. If you were using it, please use standard composition patterns instead
- Keyboard navigation and ARIA attributes work the same way

**What consumers need to do:** No changes required if you are using the documented API.

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

## Third-Party Dependencies

### Updated Dependencies

| Package | Previous | New | Notes |
| --- | --- | --- | --- |
| `@reach/dialog` | 0.16.2 | Removed | Replaced by `@radix-ui/react-dialog` 1.1.15 |
| `@reach/tabs` | 0.15.3 | Removed | Replaced by `@radix-ui/react-tabs` 1.1.13 |
| `@testing-library/react` | 10.4.9 | 16.3.0 | React 18 support |
| `@testing-library/dom` | — | 10.4.1 | New peer dependency |

### Unchanged Dependencies (React 18 Compatible)

| Package | Version | Status |
| --- | --- | --- |
| `react-dropzone` | 11.7.1 | Works with React 18 (peer dep: `>=16.8`) |
| `react-collapse` | 5.1.1 | Works with React 18 (peer dep: `>=16.3.0`) |
| `react-focus-lock` | 2.13.6 | Works with React 18 |
| `downshift` | 9.0.10 | Works with React 18 |
| `@floating-ui/react` | 0.26.28 | Works with React 18 |
| `@floating-ui/react-dom` | 2.1.6 | Works with React 18 |
| `@react-aria/*` | 3.x | Works with React 18 |
| `@react-stately/*` | 3.x | Works with React 18 |

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
- **Maintained Dependencies**: Allows use of actively maintained libraries (Radix UI) instead of deprecated ones (Reach UI)
- **Ecosystem Alignment**: Most React libraries now require or recommend React 18+
