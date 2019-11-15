import React from 'react';
import classNames from 'classnames';
import './NavBarItem.scss';

type NavBarItemProps = {
  selected?: boolean;
  children: React.ReactNode;
  as?: 'a' | React.ElementType;
  className?: string;
  [key: string]: any;
};

export const NavBarItem: React.FC<NavBarItemProps> = ({
  selected = false,
  children,
  as: Element = 'a',
  className,
  ...rest
}) => {
  return (
    <Element
      className={classNames([
        'eds-navbar-item',
        className,
        { 'eds-navbar-item--active': selected },
      ])}
      {...rest}
    >
      {children}
    </Element>
  );
};
