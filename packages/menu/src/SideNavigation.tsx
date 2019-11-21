import React from 'react';
import classNames from 'classnames';
import './SideNavigation.scss';

export type SideNavigationProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse på menyen */
  size?: 'small' | 'medium';
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
    <ul
      className={classNames(
        'eds-side-navigation',
        { 'eds-side-navigation--small': size === 'small' },
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  );
};

/** This is required to check that the Menu */
SideNavigation.__IS_ENTUR_MENU__ = true;
