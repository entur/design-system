import { warnAboutMissingStyles } from '@entur/utils';
import './index.scss';

// The submenu uses BaseExpand from @entur/expand and will not collapse without
// its styles. The chevron comes from @entur/icons. Footer.Brand renders Logo, whose
// styles live in the stable @entur/menu stylesheet.
warnAboutMissingStyles('expand', 'icons', 'menu');

export { SideNavigation } from './SideNavigation';
export { Footer } from './Footer';
export type {
  SideNavigationComponent,
  SideNavigationProps,
  SideNavigationItemProps,
  SideNavigationItemOwnProps,
  SideNavigationGroupProps,
  SideNavigationExpandableItemProps,
} from './SideNavigation';
export type {
  FooterComponent,
  FooterProps,
  FooterOwnProps,
  FooterBrandProps,
  FooterBrandOwnProps,
  FooterLinkGroupProps,
  FooterLinkGroupOwnProps,
} from './Footer';
