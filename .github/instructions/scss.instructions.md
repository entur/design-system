---
applyTo: 'packages/**/*.scss'
---

# Reviewing component styles

stylelint does not run in CI, so these rules are only enforced in review.

- **Shared styles reach many components.** For a change to a shared class,
  mixin or token (Dropdown, MultiSelect and SearchableDropdown share their form
  control styles), name the components that use it and ask for each to be
  checked in readOnly, disabled, dark and contrast. This is the most common
  regression found in review.
- **Specificity stays at (0,1,0).** Wrap extra conditions in `:where()` so
  nested components (`IconButton` inside `DatePicker`) and consumer classes can
  override. Flag `:not()`, compound or descendant selectors that raise
  specificity, `!important` and IDs, unless a `stylelint-disable` gives the
  reason. `&:where(.a .b)` matches the element itself as `.b` inside `.a`, not
  a descendant; check that is what was meant.
- **An explicit prop beats inherited styling.** An inherited selector must not
  override a value set on the element; exclude it with `:not()` inside
  `:where()` so specificity stays the same.
- **Cascade layers.** Most packages ship unlayered CSS; only some, such as the
  typography and layout beta styles, use `@entur/utils/styles/layers`. Do not
  ask to wrap unlayered CSS in a layer. Moving rules into or out of a layer
  changes which consumer rules win and is breaking.
- **No reliance on user-agent styles.** Consumer resets such as Tailwind
  Preflight zero margin, padding and border. Anything the layout needs is
  stated in the component's CSS. This has broken `<dialog>` centering and
  inline icons in production.
- **Tokens.** Use `--components-*` properties or semantic tokens. Flag new
  imports of primitive tokens in component files, and hardcoded colors,
  spacing, radii, timings or font values. `componentVariables.scss` is
  generated from `packages/tokens/src/component.json` (its header says so):
  flag hand edits and point to the source.
- **Units.** `rem` for sizes and shadows so they scale with text size; `px`
  only for hairline borders.
- **Colors.** Check a new or changed color, border or icon in light, dark
  (`data-color-mode="dark"`) and contrast (`.eds-contrast`). Avoid
  transparency unless it serves users.
- **Focus.** `outline: none` or `outline: 0` needs a `:focus-visible`
  replacement. A focus ring or state drawn only with `box-shadow` or
  `background` needs a `@media (forced-colors: active)` fallback.
- **Target size.** New or shrunk interactive elements keep a hit area of at
  least 24×24 CSS px (WCAG 2.2).
- **Layout.** Popovers, tooltips and menus are not clipped by a scroll
  container or modal, and a floating list is not wider than its field. Nothing
  scrolls horizontally at 320px; long words wrap. Ask why when `display` or
  `position` changes without a reason.
- **Motion.** Animation has a `prefers-reduced-motion` fallback. No affordance,
  such as a link underline or focus indicator, exists only in an animation or
  disappears on focus.
