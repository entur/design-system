---
name: migrate-react-18
description: Migrate a consumer project from @entur/* packages on React 17 to the new React 18 major versions. Handles React upgrade, createRoot entry point, package-specific breaking changes (modal, tabs, expand, layout, utils), ESM exports, testing-library, and TypeScript config. Use when upgrading @entur packages, migrating to React 18, or fixing breakage after updating @entur dependencies.
disable-model-invocation: true
---

# Migrate @entur/\* packages to React 18

All `@entur/*` packages now require React 18. This skill walks through the full migration: React upgrade, entry point, package-specific breaking changes, and verification.

## Steps

### 1. Inventory

Scan `package.json` (and monorepo workspace `package.json` files if applicable) for:

- Current React and React-DOM versions
- All `@entur/*` packages and their versions
- `@testing-library/react` version (if present)
- `tsconfig.json` `jsx` setting

Report what you found before proceeding.

**Done when:** every `@entur/*` package, React version, and testing-library version is listed.

### 2. Upgrade React

If React is below 18, upgrade:

```bash
npm install react@^18 react-dom@^18 @types/react@^18 @types/react-dom@^18
```

Yarn/pnpm equivalent as appropriate for the project.

**Done when:** `react` and `react-dom` in package.json are `^18` or higher.

### 3. Update entry point to createRoot

Search for `ReactDOM.render` across the project. Replace with the `createRoot` API:

```tsx
// Before
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// After
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

Also search for `ReactDOM.hydrate` — replace with `hydrateRoot` from `react-dom/client` if found.

**Done when:** no `ReactDOM.render` or `ReactDOM.hydrate` calls remain.

### 4. Upgrade @entur/\* packages

Update all `@entur/*` packages to their latest versions:

```bash
npm install @entur/button@latest @entur/modal@latest ...
```

List every `@entur/*` package in the project and upgrade them all in one command.

**Done when:** all `@entur/*` packages are at their latest versions.

### 5. Fix breaking changes per package

Load **[references/breaking-changes.md](references/breaking-changes.md)** and work through each section that applies to this project. Only process sections for packages the project actually uses.

The reference covers:

| Package                      | Key changes                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| ESM `exports` (all packages) | Deep `dist/` imports break; clean subpaths for CSS/SCSS                   |
| `@entur/modal`               | `onDismiss` required, `<div>` → `<dialog>`, `data-reach-*` selectors gone |
| `@entur/tab`                 | `data-reach-*` selectors gone, stricter types, ID format changed          |
| `@entur/expand`              | Content stays in DOM when collapsed; `unmountOnClose` opt-out             |
| `@entur/layout`              | `LayoutWrapper` removed, breakpoint keys renamed, no default gap          |
| `@entur/utils`               | `useRandomId` deprecated → use React `useId()`                            |

For each applicable section: grep for the affected patterns, fix them, and confirm no instances remain.

**Done when:** every pattern listed in breaking-changes.md has been searched for and resolved for each used package.

### 6. Update testing-library

If `@testing-library/react` is below version 14, upgrade:

```bash
npm install --save-dev @testing-library/react@^16 @testing-library/dom@^10
```

Then search for:

- `import { act } from 'react-dom/test-utils'` → change to `import { act } from 'react'`
- `import ReactTestUtils from 'react-dom/test-utils'` → remove, use testing-library equivalents

**Done when:** testing-library is v14+ and no `react-dom/test-utils` imports remain.

### 7. Update TypeScript config

If `tsconfig.json` has `"jsx": "react"`, change to `"jsx": "react-jsx"`. This enables the automatic JSX runtime — explicit `import React from 'react'` is no longer needed in every file.

Optionally: search for and remove bare `import React from 'react'` statements that exist only for JSX (keep those that use `React.*` APIs like `React.memo`, `React.forwardRef`, etc.).

**Done when:** tsconfig uses `react-jsx` and unused React imports are cleaned up.

### 8. Report behavioral changes

After all code changes are applied, inform the user about behavioral differences they should be aware of. Load **[references/behavioral-changes.md](references/behavioral-changes.md)** and present every section relevant to the packages this project uses.

These are changes that require no code fix but alter how the application behaves at runtime, in tests, or during development. The user needs to know about them to avoid surprise.

**Done when:** every relevant behavioral change has been communicated to the user.

### 9. Verify

Run the project's build and test suite:

```bash
npm run build
npm test
```

Fix any remaining type errors or test failures. Common issues:

- **Type errors from stricter props** — `@entur/tab` components no longer accept arbitrary props. Remove unknown props.
- **Test failures from ID changes** — Tab/panel IDs now use `useId()` format. Don't match specific ID strings; use `aria-controls`/`aria-labelledby` to find linked elements.
- **Test failures from batched updates** — React 18 batches all state updates. Wrap assertions that depend on intermediate states in `act()` or use `waitFor`.
- **Double renders in dev** — `<StrictMode>` now mounts, unmounts, and re-mounts components. This is expected; fix missing `useEffect` cleanups it reveals.

**Done when:** build succeeds and tests pass.
