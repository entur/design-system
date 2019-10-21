import React from 'react';
import classNames from 'classnames';
import './styles.scss';

type MenuProps = {
  className?: string;
  size?: 'small' | 'medium';
};

export const Menu: React.FC<MenuProps> = ({
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
