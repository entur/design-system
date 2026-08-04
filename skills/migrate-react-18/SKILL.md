---
name: migrate-react-18
description: Upgrade a consumer project to the latest major @entur/* design system packages. Covers breaking changes (ESM exports, modal, tabs, expand, layout, utils) and verifies the project meets the React 18 minimum. Use when upgrading @entur packages, fixing breakage after updating @entur dependencies, or migrating to the newest design system versions.
disable-model-invocation: true
---

# Upgrade @entur/\* packages to latest major versions

The latest major versions of all `@entur/*` packages require React 18 as a minimum. Most consumer projects are already on React 18+ — the main work is handling package-specific breaking changes.

## Steps

### 1. Inventory

Scan `package.json` (and monorepo workspace `package.json` files if applicable) for:

- All `@entur/*` packages and their current versions
- Current React and React-DOM versions
- `@testing-library/react` version (if present)
- `tsconfig.json` `jsx` setting

Report what you found before proceeding.

**Done when:** every `@entur/*` package, React version, and testing-library version is listed.

### 2. Check React version

If React is already 18+, skip to step 3.

If React is below 18:

```bash
npm install react@^18 react-dom@^18 @types/react@^18 @types/react-dom@^18
```

Then search for `ReactDOM.render` — replace with `createRoot`:

```tsx
// Before
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// After
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

Also search for `ReactDOM.hydrate` — replace with `hydrateRoot` from `react-dom/client`.

If `tsconfig.json` has `"jsx": "react"`, change to `"jsx": "react-jsx"`.

**Done when:** React is 18+ and entry points use the new API (or were already there).

### 3. Upgrade @entur/\* packages

Update all `@entur/*` packages to their latest versions:

```bash
npm install @entur/button@latest @entur/modal@latest ...
```

List every `@entur/*` package in the project and upgrade them all in one command.

**Done when:** all `@entur/*` packages are at their latest versions.

### 4. Fix breaking changes

> **Resolving reference files:** if you are reading this over HTTP rather than from an installed skill folder, resolve each `references/<file>.md` below against `https://raw.githubusercontent.com/entur/design-system/main/skills/migrate-react-18/`

Load **[references/breaking-changes.md](references/breaking-changes.md)** and work through each section that applies to this project. Only process sections for packages the project actually uses.

The reference covers:

| Package                      | Key changes                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| ESM `exports` (all packages) | Deep `dist/` imports break; built files renamed to `.mjs`/`.cjs`          |
| `@entur/modal`               | `onDismiss` required, `<div>` → `<dialog>`, `data-reach-*` selectors gone |
| `@entur/tab`                 | `data-reach-*` selectors gone, stricter types, ID format changed          |
| `@entur/expand`              | Content stays in DOM when collapsed; `unmountOnClose` opt-out             |
| `@entur/layout` (beta)       | `LayoutProvider` removed; responsive base key `s` → `base`                |
| `@entur/utils`               | `useRandomId` deprecated → use React `useId()`                            |

For each applicable section: grep for the affected patterns, fix them, and confirm no instances remain.

**Done when:** every pattern listed in breaking-changes.md has been searched for and resolved for each used package.

### 5. Report behavioral changes

After all code changes are applied, inform the user about behavioral differences they should be aware of. Load **[references/behavioral-changes.md](references/behavioral-changes.md)** and present every section relevant to the packages this project uses.

These are changes that require no code fix but alter how the application behaves at runtime, in tests, or during development.

**Done when:** every relevant behavioral change has been communicated to the user.

### 6. Verify

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
