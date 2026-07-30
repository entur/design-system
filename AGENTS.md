# AGENTS.md

Entur Linje — a React component library and design system monorepo. Published as scoped `@entur/*` npm packages with independent versioning.

## Entur Standards

Read and follow: https://github.com/entur/ai/blob/main/AGENTS.md

## Tech Stack

- **Monorepo:** Lerna (independent versioning) + Yarn 4.9.3 workspaces + Nx (task caching)
- **Build:** Vite (packages), Gatsby 5 (docs), Playroom (playground)
- **Language:** TypeScript 5.9, React 18, SCSS
- **Test:** Jest 29 + React Testing Library
- **Node:** 24.14.0 required

## Common Commands

```bash
yarn setup                    # Install deps + build all packages
yarn start:package [name]     # Watch mode for a package
yarn start:documentation      # Gatsby dev server
yarn build:packages           # Build all npm packages
yarn build:package [name]     # Build single package
yarn test                     # Run all tests (TZ=UTC)
yarn test:package [name]      # Test single package
yarn lint                     # Lint all packages
yarn lint:fix                 # Auto-fix lint issues
```

## Architecture

```
packages/       # 23 published @entur/* npm packages
  button/       # Example: @entur/button
  tokens/       # Design tokens (JS + SCSS generation)
  utils/        # Shared utilities and types
  icons/        # Icon components
  styles/       # Base styles
  ...           # alert, chip, datepicker, dropdown, expand, fileupload,
                # form, grid, layout, loader, menu, modal, tab, table,
                # tooltip, travel, typography, a11y
apps/
  documentation/    # Gatsby docs site (linje.entur.no)
  code-playground/  # Playroom for local component testing
  studio-linje/     # Sanity CMS studio
```

## Package Structure Convention

Each package under `packages/[name]/` follows this pattern:

```
src/
  [Component].tsx          # Main component
  [Component].test.tsx     # Co-located tests
  [Component].scss         # Styles (BEM with eds- prefix)
  [Variant].tsx            # Variant components (e.g. PrimaryButton.tsx)
  componentVariables.scss  # Token-to-CSS-variable mappings
  index.tsx                # Barrel exports
  index.scss               # Style barrel
vite.config.ts
jest.config.js
tsconfig.json
package.json
```

## HTML & Markup Principles

- **Minimize wrappers:** Avoid unnecessary wrapper elements. Prefer composing via the `as` prop (e.g. `<GridItem as={Footer}>`) over adding wrapping `<div>`s.
- **Semantic HTML5:** Use the correct element for the job — `<header>`, `<footer>`, `<nav>`, `<main>`, `<section>`, `<aside>`, etc. — rather than generic `<div>`s wherever semantics apply.

## Architecture & Patterns

- **Polymorphic components:** Many components accept an `as` prop for element composition (e.g. Button can render as `<a>`)
- **Forward refs:** All components use `React.forwardRef`
- **CSS:** BEM naming with `eds-` prefix, SCSS modules, cascade layers via `@entur/utils/styles/layers`
- **Dual output:** Each package builds to ESM + CJS with separate CSS bundle and `.d.ts` files
- **Design tokens:** `@entur/tokens` provides shared tokens as CSS custom properties, SCSS variables, and JS exports

## Formatting

Prettier: single quotes, trailing commas, semicolons, `arrowParens: avoid`, 80 char width (160 for SCSS). ESLint extends recommended + React + TypeScript rules.

## Further Reading

For domain-specific guidance, see:

- [docs/commits.md](docs/commits.md) — commit conventions, scopes, branch naming, AI attribution
- [docs/icons.md](docs/icons.md) — icon build pipeline, adding/renaming icons, SVG format
