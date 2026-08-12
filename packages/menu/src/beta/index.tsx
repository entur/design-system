import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';

// The submenu uses BaseExpand from @entur/expand and will not collapse without
// its styles. The chevron comes from @entur/icons.
warnAboutMissingStyles('expand', 'icons');

export { SideNavigation } from './SideNavigation';
export type {
  SideNavigationComponent,
  SideNavigationProps,
  SideNavigationItemProps,
  SideNavigationItemOwnProps,
  SideNavigationGroupProps,
  SideNavigationExpandableItemProps,
} from './SideNavigation';
