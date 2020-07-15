import React from 'react';
import classNames from 'classnames';
import './SideNavigation.scss';
import { Contrast } from '@entur/layout';

export type SideNavigationProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse på menyen
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  [key: string]: any;
};

type InternalMarker = {
  __IS_ENTUR_MENU__: boolean;
};

export const SideNavigation: React.FC<SideNavigationProps> & InternalMarker = ({
  className,
  children,
  size = 'medium',
  ...rest
}) => {
  if (!children || !React.Children.count(children)) {
    return null;
  }
  return (
    <Contrast
      as="ul"
      className={classNames(
        'eds-side-navigation',
        { 'eds-side-navigation--small': size === 'small' },
        className,
      )}
      {...rest}
    >
      {children}
    </Contrast>
  );
};

/** This is required to check that the Menu */
SideNavigation.__IS_ENTUR_MENU__ = true;
