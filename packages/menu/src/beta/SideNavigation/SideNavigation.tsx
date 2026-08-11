import React from 'react';
import classNames from 'classnames';

import './SideNavigation.scss';

export type SideNavigationProps = React.ComponentPropsWithoutRef<'ul'>;

export const SideNavigationRoot = React.forwardRef<
  HTMLUListElement,
  SideNavigationProps
>(({ className, children, ...rest }, ref) => (
  <ul
    className={classNames('eds-side-navigation-beta', className)}
    ref={ref}
    {...rest}
  >
    {children}
  </ul>
));

// Navnene her styrer både React DevTools og filnavnet på de genererte
// prop-tabellene i dokumentasjonen, og må derfor ikke kollidere med de stabile
// SideNavigation-komponentene.
SideNavigationRoot.displayName = 'SideNavigationBeta';
