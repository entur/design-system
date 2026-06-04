import React from 'react';
import classNames from 'classnames';
import './SideNavigation.scss';

export type SideNavigationProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse på menyen
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  [key: string]: any;
};

const SideNavigationBase = ({
  className,
  children,
  size = 'medium',
  ...rest
}: SideNavigationProps) => {
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

export const SideNavigation = Object.assign(SideNavigationBase, {
  __IS_ENTUR_MENU__: true as const,
});
