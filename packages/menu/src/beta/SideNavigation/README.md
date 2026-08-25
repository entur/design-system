# SideNavigation (beta)

Vertical navigation menu. Supersedes the stable `SideNavigation` in `@entur/menu`.

## Components

- **`SideNavigation`** — the root `<ul>`
- **`SideNavigation.Group`** — a non-interactive uppercase heading with its own item list
- **`SideNavigation.Item`** — a menu item, polymorphic, defaults to `<a>`
- **`SideNavigation.ExpandableItem`** — a menu item that reveals a submenu

## Usage

`@entur/expand/styles` must also be loaded — the submenu uses `BaseExpand`, and without
those styles a collapsed submenu stays visible. The beta entry point warns in development if
it is missing.

```tsx
import { SideNavigation } from '@entur/menu/beta';
import '@entur/expand/styles';
import '@entur/menu/beta/styles';

<SideNavigation>
  <SideNavigation.Group title="Gruppenavn">
    <SideNavigation.Item href="/oversikt" icon={<TicketIcon />} active>
      Oversikt
    </SideNavigation.Item>

    <SideNavigation.ExpandableItem title="Rapporter" icon={<TicketIcon />}>
      <SideNavigation.Item href="/rapporter/salg">Salg</SideNavigation.Item>
      <SideNavigation.Item href="/rapporter/bruk">Bruk</SideNavigation.Item>
    </SideNavigation.ExpandableItem>

    <SideNavigation.Item
      href="/varsler"
      badge={<StatusBadge variant="neutral">Ny</StatusBadge>}
      alert
    >
      Varsler
    </SideNavigation.Item>
  </SideNavigation.Group>
</SideNavigation>;
```

## Differences from the stable SideNavigation

- **No `CollapsibleSideNavigation`.** Collapsing belongs to the app shell —
  `Template.Portal.Sidebar` in `@entur/layout/beta` owns the `collapsed` prop.
- **"Group" means something else.** In the stable component a group is the expandable thing.
  Here a group is a heading, and expanding is `ExpandableItem`'s job.
- **No `size` prop.** The spec has a single 48px row height, growing only when a label wraps.
- **No dividers** between items.
- `onToggle` is now `onOpenChange`, and it always receives the new boolean.

## Architecture

### Open state is resolved during render, never in an effect

`ExpandableItem` resolves its open state in three tiers, in order:

1. `open` prop present → controlled by the consumer.
2. The user has toggled it → the stored toggle wins.
3. Otherwise → derived: does any descendant have `active`?

Tier 3 is what makes the component survive navigation. In a server-rendered or multi-page app
the whole tree unmounts on every page load, so anything stored in state is gone — an
`ExpandableItem` relying only on `defaultOpen` would collapse even though the user just
navigated _into_ its submenu. Deriving from `active` means the server and the client
independently arrive at the same answer, so the right submenu is already open in the server
HTML and hydration is clean.

When the derived value changes (a new page made a different group active), the stored toggle is
discarded using React's adjust-state-during-render pattern:

```tsx
if (state.derived !== derivedOpen) {
  setState({ user: null, derived: derivedOpen });
}
```

This deliberately does **not** use `useEffect`. An effect runs after paint, so the wrong group
would be visibly open for one frame on every navigation.

`BaseExpand` from `@entur/expand` is safe to rely on here: it seeds `useState(open)` and
animates with `grid-template-rows: 0fr → 1fr`, so it neither measures the DOM nor flips state
on mount.

### Labels may wrap to two lines

A label that does not fit on one line wraps to a second, and is cut with an ellipsis after that.
The row is built from block padding plus a `min-height` rather than a fixed height, so it grows
with the second line instead of clipping it. Icon, badge and alert stay vertically centred
against the whole label.

Truncation is `-webkit-line-clamp`, which needs `display: -webkit-box` on the text element —
hence the separate `__text` span around `children`. Two lines is a hard limit, not a default:
the row height stays predictable in a sidebar, and a label needing three lines is a content
problem.

### Visual states carry no React state

Figma's `Hover`, `Click`, `Active` and `Disabled` states map to `:hover`, `:active`, the
`active` prop and the `disabled` prop respectively. Nothing about the row's appearance is
tracked in JS, apart from the open state an `ExpandableItem` already tracks — see below.

### One current page, one marking

A bold label says this row leads to the current page. The tinted background and the accent bar
say this row _is_ it, so an `ExpandableItem` only draws them while its submenu is hidden:

| Expandable item                   | Marking                            |
| --------------------------------- | ---------------------------------- |
| Collapsed, `active`               | Background, accent bar, bold label |
| Collapsed, active page in submenu | Background, accent bar, bold label |
| Open, `active`                    | Bold label only                    |
| Open, active page in submenu      | Bold label only                    |

An open group would otherwise carry the background twice, once on the parent and once on the
submenu row below it. Hover and click backgrounds still apply on every row, open or not.

Both collapsed rows use the same submenu walk that decides whether to open, so the marking
follows the submenu even though nothing in the submenu is rendered.

### The alert dot stands in for the submenu's dots

An `ExpandableItem` shows the dot when any item in its submenu has `alert`, and drops it the
moment the submenu opens and those items can show their own dots. `alert` on the item itself
still forces a dot — for a submenu built by a wrapper component the walk cannot see into — and
follows the same open rule.

### The submenu rail

Every submenu row draws a 2px rail on its start edge; the rows stack with no gap, so the rails
read as one line down the submenu. The active row draws its own segment in the accent colour
instead. Unlike the full-bleed top-level rows, submenu rows are inset 1.5rem on both sides, so
the rail sits under the parent's icon and the background stops short of the sidebar edge.

### Contrast is inherited, not a prop

Styles respond to a `.eds-contrast` ancestor rather than exposing a `contrast` prop, so the
menu picks up whatever the surrounding shell already declares. `Template.Portal.Sidebar` sets
that class itself, which means the two compose with no configuration.

### Colour tokens are local for now

`src/beta/componentVariables.scss` hand-writes the
`--components-menu-sidenavigation-beta-*` variables against semantic tokens from
`@entur/tokens`. Figma has them under `Side Navigation/Standard beta` and
`Side Navigation/Contrast beta`, but they have not shipped in `@entur/tokens` yet. Delete that
file and switch to the generated `../componentVariables.scss` once they do.

Each variable is re-declared as a short `--eds-side-navigation-beta-*` alias on the root, and
the contrast variants are swapped in one place. Rules downstream only ever read the alias, so
adding a new mode means changing one block, not every rule.

### `--eds-side-navigation-padding-inline-start`

The one custom property meant to be set by consumers. It moves the label, icon and group
heading on the start side only — the end side always keeps its 1.5rem — without indenting the
top-level rows, so their hover and active backgrounds still run to the edge of the sidebar. The
submenu box starts at the same value, so its rail and its labels shift along with the rows
above and nesting reads the same at any value.

```scss
// Line the labels up with a logo sitting 2.5rem from the edge
.my-sidebar-nav {
  --eds-side-navigation-padding-inline-start: 2.5rem;
}
```

Set it on the nav itself or on any ancestor — the sidebar wrapper, a theme class, `:root`.

Deliberately **not** named `--eds-side-navigation-beta-*`: it is public API, and a consumer
should not have to rename it when the component leaves beta. The `--eds-side-navigation-beta-*`
colour aliases above are internal and will be renamed then.

The 1.5rem default lives in each `var()` fallback rather than in a declaration on the component
root. A declaration on the root would sit on the same element the consumer is most likely to
inherit from, so an ancestor's value would lose to it and the override would silently do
nothing.

Setting a margin on the `<ul>` instead would move the backgrounds and the active indicator
along with the text, which is usually not what you want in a full-bleed sidebar.

## Limitations

- **One submenu level.** The spec draws exactly one. Nesting an `ExpandableItem` inside a
  submenu will render, but the indentation is not designed for it.
- **The submenu walk only sees JSX children.** `items.map(...)` is fine, but a wrapper
  component that renders items internally is invisible to it — those consumers must pass
  `open` or `defaultOpen` and `alert` themselves. The stable component has the same
  limitation.
- **No environment indicator.** Figma's `.EnvBadge` / `Stroke-Prod` stripe is drawn but hidden
  in every variant, so it is not implemented.
