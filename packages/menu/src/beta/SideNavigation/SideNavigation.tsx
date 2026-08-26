import React from 'react';
import classNames from 'classnames';

import { warnOnMixedIcons } from './warnOnMixedIcons';

import './SideNavigation.scss';

export type SideNavigationProps = React.ComponentPropsWithoutRef<'ul'>;

export const SideNavigationRoot = React.forwardRef<
  HTMLUListElement,
  SideNavigationProps
>(({ className, children, ...rest }, ref) => {
  warnOnMixedIcons(children, 'the top level');

  return (
    <ul
      className={classNames('eds-side-navigation-beta', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </ul>
  );
});

// These names drive both React DevTools and the filenames of the generated
// prop tables in the documentation, so they must not collide with the stable
// SideNavigation components.
SideNavigationRoot.displayName = 'SideNavigationBeta';
