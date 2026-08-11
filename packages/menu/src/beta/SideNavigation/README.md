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
- **No `size` prop.** The spec has a single 48px row height.
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

### Visual states carry no React state

Figma's `Hover`, `Click`, `Active` and `Disabled` states map to `:hover`, `:active`, the
`active` prop and the `disabled` prop respectively. Nothing about the row's appearance is
tracked in JS.

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

## Limitations

- **One submenu level.** The spec draws exactly one. Nesting an `ExpandableItem` inside a
  submenu will render, but the indentation is not designed for it.
- **The active-descendant walk only sees JSX children.** `items.map(...)` is fine, but a
  wrapper component that renders items internally is invisible to it — those consumers must
  pass `open` or `defaultOpen` themselves. The stable component has the same limitation.
- **No environment indicator.** Figma's `.EnvBadge` / `Stroke-Prod` stripe is drawn but hidden
  in every variant, so it is not implemented.
