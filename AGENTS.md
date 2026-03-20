# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Entur Standards

Read and follow the Entur platform standards at:
https://github.com/entur/ai/blob/main/AGENTS.md

When working on a specific task, also read the relevant guides
linked from that file (e.g. code-review.md, markdown.md).

## Project Overview

Entur Linje — a React component library and design system monorepo. Published as scoped `@entur/*` npm packages with independent versioning. Includes a Gatsby documentation site and a Playroom code playground.

## Tech Stack

- **Monorepo:** Lerna (independent versioning) + Yarn 4.9.3 workspaces + Nx (task caching)
- **Build:** Vite (packages), Gatsby 5 (docs), Playroom (playground)
- **Language:** TypeScript 5.9, React 17, SCSS
- **Test:** Jest 29 + React Testing Library
- **Node:** 24.14.0 required

## Common Commands

```bash
# Initial setup
yarn setup                    # Install deps + build all packages

# Development
yarn start:package [name]     # Watch mode for a package (e.g. button)
yarn start:code-playground    # Start Playroom for live testing
yarn start:code-playground-for-package [name]  # Both at once
yarn start:documentation      # Gatsby dev server

# Build
yarn build:packages           # Build all npm packages
yarn build:package [name]     # Build single package

# Test
yarn test                     # Run all tests (TZ=UTC)
yarn test:package [name]      # Test single package (e.g. yarn test:package button)

# Lint
yarn lint                     # Lint all packages
yarn lint:fix                 # Auto-fix lint issues
yarn lint:styles              # Stylelint on CSS/SCSS

# Commits (conventional-commits via Commitizen)
yarn gc:format                # Interactive commit formatter
```

## Repository Structure

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

## Architecture & Patterns

- **Polymorphic components:** Many components accept an `as` prop for element composition (e.g. Button can render as `<a>`)
- **Forward refs:** All components use `React.forwardRef`
- **CSS:** BEM naming with `eds-` prefix (e.g. `eds-button`, `eds-button--variant-primary`, `eds-button__loading-dots`)
- **Stylelint enforces:** max specificity `0,1,0`, BEM class pattern, no IDs
- **Cross-package imports:** `@entur/[package]` resolved via path aliases in tsconfig and jest config
- **Dual output:** Each package builds to ESM + CJS with separate CSS bundle and `.d.ts` files
- **Design tokens:** `@entur/tokens` provides shared design tokens consumed as SCSS variables and JS exports

## Commit Conventions

Uses conventional-commits enforced by Commitizen + commitlint (Husky lints on push).

`yarn gc:format` is the standard way to commit (interactive Commitizen prompt). AI agents that cannot use interactive input should manually craft commit messages following this format:

```
type(scope): short description in imperative form

optional longer description

optional breaking changes
```

- **type**: `fix`, `feat`, `chore`, `docs`, `refactor`, etc. Drives version bumps: `fix` → patch, `feat` → minor, `BREAKING CHANGE` → major. `fix` and `feat` are ONLY for code that affects consumers (i.e. within `packages/`). Use `test`, `refactor`, `chore`, etc. for non-consumer-facing changes.
- **scope**: `package/component` format in lowercase. For components inside a `beta/` directory, use `package/beta/component` (e.g. `layout/beta/sidebar`). Single component: `travel/travel tag`. Beta component: `layout/beta/sidebar`. Entire package: `travel`. Entire repo: `root`. Documentation site: `website`. Multiple: `travel/travel tag, travel/travel header`.
- **short description**: one sentence, imperative form (e.g. "add new variant", not "added new variant").
- **Descriptions for `feat` and `fix`**: These end up in the changelog and are read by consumers. Keep them **consumer-focused** — explain what the change means for them and how to use it. Avoid internal technical details (implementation approach, refactoring rationale, what was removed internally).

Branch naming: start with Jira issue ID, e.g. `ETU-38373-branch-name`.

## AI Attribution

Do NOT use `Co-authored-by` trailers for AI tools — that convention is reserved for human collaborators.

When the majority of a commit's changes were produced by an AI tool, add a dedicated `AI-assistant` trailer with the actual tool and model used:

```
AI-assistant: <tool> (<model>)
```

If the developer wrote most of the code themselves (with only minor AI assistance), no AI attribution is needed.

## Formatting Rules

Prettier: single quotes, trailing commas, semicolons, `arrowParens: avoid`, 80 char width (160 for SCSS). ESLint extends recommended + React + TypeScript rules.
