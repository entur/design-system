import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';

// Undermenyen bruker BaseExpand fra @entur/expand, og kollapser ikke uten
// stilene derfra. Ikonene kommer fra @entur/icons.
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
