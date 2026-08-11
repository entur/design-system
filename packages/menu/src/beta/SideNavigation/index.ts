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

// displayName settes i den enkelte komponentfilen, slik at
// react-docgen-typescript plukker den opp når prop-tabellene genereres.

export type { SideNavigationProps } from './SideNavigation';
export type {
  SideNavigationItemProps,
  SideNavigationItemOwnProps,
} from './SideNavigationItem';
export type { SideNavigationGroupProps } from './SideNavigationGroup';
export type { SideNavigationExpandableItemProps } from './SideNavigationExpandableItem';
