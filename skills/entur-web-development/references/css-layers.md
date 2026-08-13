# Using CSS Cascade Layers with Entur Linje

If your app uses [cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer), you can put Entur's component CSS into the layer order too and get clean, specificity-free overrides. This is how.

## What Entur ships

| Package                        | Layer status                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `@entur/typography`            | Partly layered — only its reset (modern-normalize + `box-sizing`) sits in `core.reset`. Everything else is unlayered plain CSS |
| every other `@entur/*` package | Unlayered plain CSS                                                                                                            |

Verify against the version you ship: `grep -c '@layer' node_modules/@entur/typography/dist/styles.css` returns 1 — the single `core.reset` block, ~4 kB of 27 kB. The remaining ~23 kB (headings, `.eds-paragraph`, `.eds-preformatted-text`, `.eds-link`, list styles) is unlayered, and there is no `@layer` order declaration in any `@entur/*` stylesheet.

Three consequences to design around:

1. **Unlayered CSS beats every layer**, regardless of declaration order. Untouched, `@entur/button` outranks anything you put in an `app` layer.
2. **You can move that CSS into a layer yourself** with `layer()` on the import — those files have no internal `@layer`, so wrapping them is safe and gives you full control. `@entur/typography` is the exception: it has an internal `@layer`, so never wrap it.
3. **You cannot beat typography's unlayered rules from a layer.** An override of `.eds-paragraph` or `.eds-preformatted-text` placed in `app` loses to typography's own unlayered rule, no matter how high `app` sits. Override those unlayered, with equal-or-higher specificity (see rule 3 below).

## Recipe: put everything in the layer order

Declare the order first, import Entur's component CSS into `components.primitives`, and keep your own styles in `app`:

```css
/* 1. Declare the order before any import. The first declaration wins. */
@layer core, third-party, components, utilities, app;
@layer core.reset, core.tokens, core.base;
@layer third-party.imports, third-party.overrides;
@layer components.primitives, components.composites, components.overrides;

/* 2. Tokens have no @layer inside, so wrap them in core.tokens */
@import '@entur/tokens/dist/base.css' layer(core.tokens);
@import '@entur/tokens/dist/styles.css' layer(core.tokens);

/* 3. Typography has an internal @layer — import it bare, never with layer() */
@import '@entur/typography/dist/styles.css';

/* 4. Component packages into components.primitives */
@import '@entur/button/dist/styles.css' layer(components.primitives);
@import '@entur/form/dist/styles.css' layer(components.primitives);
@import '@entur/table/dist/styles.css' layer(components.primitives);

/* 5. Your styles now win without !important or specificity tricks */
@layer app {
  .booking-hero-cta {
    padding-block: var(--space-large);
  }
}
```

With that in place a single class in `app` overrides component styling, because `app` is the highest layer and every wrapped package is inside it. Typography's unlayered bulk is the one exception — see consequence 3 above.

To pull the declarations from source instead of pasting them, in SCSS:

```scss
@use '@entur/utils/styles/layers';
```

That resolves to `dist/layers.scss`, so it works from Sass only — a plain-CSS `@import` cannot read it. The block in step 1 is that file's content; keep the two in sync.

Keep the token imports in step 2 even if the app appears to work without them: most component packages inline the base and semantic token declarations into their own `styles.css`, so dropping `base.css` fails silently for as long as one of those packages is imported — and breaks the moment the import list changes. Importing them explicitly also keeps every token declaration in `core.tokens`, below anything you override in a higher layer.

## Layer order

Lowest to highest priority:

`core.reset` < `core.tokens` < `core.base` < `third-party.imports` < `third-party.overrides` < `components.primitives` < `components.composites` < `components.overrides` < `utilities` < `app` < **unlayered**

Where to put your own CSS:

| You have                                                | Put it in                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| A third-party reset (Tailwind preflight, normalize.css) | `core.reset`                                                 |
| Vendor CSS you need to tame                             | `third-party.imports`, your fixes in `third-party.overrides` |
| Your own components built on `@entur/*`                 | `components.composites`                                      |
| Overrides of an `@entur/*` component                    | `components.overrides`                                       |
| Utility classes                                         | `utilities`                                                  |
| Page and app-level styles                               | `app`                                                        |
| Overrides of an `@entur/typography` style               | nothing — keep it unlayered, see rule 3                      |

## Rules

1. **Declare the order first, before any import.** Re-declaring existing names does not reorder them, and new names in a later declaration are appended at the end — they cannot be inserted between existing layers. No `@entur/*` package declares the order for you, so the declaration in step 1 of the recipe is the one that governs: keep it as the first CSS statement in the app.

2. **Never wrap a file that contains its own `@layer` in `layer()`.** `@import './file.css' layer(X)` nests that file's `@layer` blocks under `X`, so `core.reset` becomes `X.core.reset` — a different layer. This applies to `@entur/typography/dist/styles.css` only; every other `@entur/*` stylesheet is safe to wrap.

3. **Unlayered CSS is beaten only by unlayered CSS.** That covers both component CSS you chose not to wrap and everything `@entur/typography` ships outside `core.reset`. Beat it with unlayered CSS of equal-or-higher specificity — use the scoped `className` anchor pattern in the "Component overrides" section of `getting-started.md`. Reach for the component's own props and tokens before either approach.

## Tailwind CSS v4

`@import "tailwindcss"` emits its own `@layer theme`, `base`, `components` and `utilities`. Those names collide with Entur's, and Tailwind's `base` layer holds preflight — a global reset that flattens component styling if it outranks it. Split the import so each part lands in the right Entur layer, and skip preflight:

```css
/* tailwind.css */
@import 'tailwindcss/utilities' layer(utilities);

@theme {
  /* custom theme values */
}
```

```css
/* global.css — order matters */
@import './entur-styles.css';
@import './tailwind.css';
```

Utilities land in `utilities`, and Entur's own reset is the only reset in play.

**Skip preflight when `@entur/typography` is installed.** Typography's `core.reset` block already ships modern-normalize plus `box-sizing: border-box`, so preflight is a second reset over the same ground. It is not merely redundant: preflight sets `svg { vertical-align: middle }`, and `.eds-icon` only sets `display: inline` — no `vertical-align` of its own. Icons rendered with `inline` get `.eds-icon--inline { position: relative; top: 0.2em }`, an offset calibrated for a baseline-aligned svg. Centre the svg first and the nudge becomes a second correction: the `BreadcrumbItem` separator lands ~4px below the breadcrumb text. Layer order does not help — no EDS rule opposes preflight's declaration, so it wins wherever it sits.

If you must keep preflight (a large existing Tailwind codebase depending on its normalization), neutralize that one rule in `third-party.overrides` or higher:

```css
@layer third-party.overrides {
  svg.eds-icon {
    vertical-align: baseline;
  }
}
```

For a Tailwind utility to actually override an Entur component, that component's CSS must sit in a layer below `utilities` — so use the `layer(components.primitives)` imports from the recipe above. Without them the component's unlayered rules outrank `utilities`, and `className="p-4"` silently does nothing. Typography's unlayered rules outrank `utilities` too, so a `text-*` or `leading-*` utility on an `.eds-paragraph` needs an unlayered override instead.

## Micro frontends

- **Pin the order in the host.** Declare the full `@layer` order as the host's first CSS statement; it then governs all CSS loaded afterwards, including each MFE's.
- **Deduplicate.** Let the host provide the shared `@entur/*` CSS and have MFEs skip their own imports. Version-align `@entur/*` between host and MFEs.
- **Wrap consistently.** If the host imports component CSS with `layer()` but an MFE imports it bare, the MFE's unlayered copy wins everywhere. Agree on one approach.
- **Test both contexts** — standalone and embedded.
