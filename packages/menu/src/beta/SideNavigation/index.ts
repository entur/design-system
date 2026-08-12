import { SideNavigationRoot } from './SideNavigation';
import { SideNavigationItem } from './SideNavigationItem';
import { SideNavigationGroup } from './SideNavigationGroup';
import { SideNavigationExpandableItem } from './SideNavigationExpandableItem';

export type SideNavigationComponent = typeof SideNavigationRoot & {
  Item: typeof SideNavigationItem;
  Group: typeof SideNavigationGroup;
  ExpandableItem: typeof SideNavigationExpandableItem;
};

export const SideNavigation: SideNavigationComponent = Object.assign(
  SideNavigationRoot,
  {
    Item: SideNavigationItem,
    Group: SideNavigationGroup,
    ExpandableItem: SideNavigationExpandableItem,
  },
);

// displayName is set in each component file so that react-docgen-typescript
// picks it up when the prop tables are generated.

export type { SideNavigationProps } from './SideNavigation';
export type {
  SideNavigationItemProps,
  SideNavigationItemOwnProps,
} from './SideNavigationItem';
export type { SideNavigationGroupProps } from './SideNavigationGroup';
export type { SideNavigationExpandableItemProps } from './SideNavigationExpandableItem';
