import React from 'react';
import classNames from 'classnames';
import './styles.scss';

type MenuProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse på menyen */
  size?: 'small' | 'medium';
};

type InternalMarker = {
  __IS_ENTUR_MENU__: boolean;
};

export const Menu: React.FC<MenuProps> & InternalMarker = ({
  className,
  children,
  size = 'medium',
  ...rest
}) => {
  return (
    <ul
      className={classNames(
        'entur-menu',
        { 'entur-menu--small': size === 'small' },
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  );
};

/** This is required to check that the Menu */
Menu.__IS_ENTUR_MENU__ = true;
