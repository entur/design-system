# Using CSS Cascade Layers with Entur Linje

If your app uses [cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer), you can put Entur's component CSS into the layer order too and get clean, specificity-free overrides. This is how.

## What Entur ships

| Package                        | Layer status                                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `@entur/typography`            | Self-layered — places its styles in `core.reset`, `core.base` and `components.primitives`, and carries the shared `@layer` declarations |
| every other `@entur/*` package | Unlayered plain CSS                                                                                                                     |

Two consequences to design around:

1. **Unlayered CSS beats every layer**, regardless of declaration order. Untouched, `@entur/button` outranks anything you put in an `app` layer.
2. **You can move that CSS into a layer yourself** with `layer()` on the import — those files have no internal `@layer`, so wrapping them is safe and gives you full control. `@entur/typography` is the exception: it self-layers, so never wrap it.

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

/* 3. Typography self-layers — import it bare, never with layer() */
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

With that in place a single class in `app` overrides component styling, because `app` is the highest layer and nothing is left unlayered.

To pull the declarations from source instead of pasting them, in SCSS:

```scss
@use '@entur/utils/styles/layers';
```

That resolves to `dist/layers.scss`, so it works from Sass only — a plain-CSS `@import` cannot read it. The block in step 1 is that file's content; keep the two in sync.

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

## Rules

1. **Declare the order first, before any import.** Re-declaring existing names does not reorder them, and new names in a later declaration are appended at the end — they cannot be inserted between existing layers. `@entur/typography` also declares the order, so whichever declaration the browser sees first wins: make it yours.

2. **Never wrap a self-layering file in `layer()`.** `@import './file.css' layer(X)` nests that file's own `@layer` declarations under `X`, so `core.reset` becomes `X.core.reset` — a different layer. This applies to `@entur/typography/dist/styles.css` only; every other `@entur/*` stylesheet is safe to wrap.

3. **If you skip the `layer()` wrapping, override unlayered.** Component CSS left unlayered can only be beaten by unlayered CSS of equal-or-higher specificity — use the scoped `className` anchor pattern in the "Component overrides" section of `getting-started.md`. Reach for the component's own props and tokens before either approach.

## Tailwind CSS v4

`@import "tailwindcss"` emits its own `@layer theme`, `base`, `components` and `utilities`. Those names collide with Entur's, and Tailwind's `base` layer holds preflight — a global reset that flattens component styling if it outranks it. Split the import so each part lands in the right Entur layer:

```css
/* tailwind.css */
@import 'tailwindcss/preflight' layer(core.reset);
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

Preflight lands below everything Entur ships, and utilities land in `utilities`.

For a Tailwind utility to actually override an Entur component, that component's CSS must sit in a layer below `utilities` — so use the `layer(components.primitives)` imports from the recipe above. Without them the component's unlayered rules outrank `utilities`, and `className="p-4"` silently does nothing.

## Micro frontends

- **Pin the order in the host.** Declare the full `@layer` order as the host's first CSS statement; it then governs all CSS loaded afterwards, including each MFE's.
- **Deduplicate.** Let the host provide the shared `@entur/*` CSS and have MFEs skip their own imports. Version-align `@entur/*` between host and MFEs.
- **Wrap consistently.** If the host imports component CSS with `layer()` but an MFE imports it bare, the MFE's unlayered copy wins everywhere. Agree on one approach.
- **Test both contexts** — standalone and embedded.
