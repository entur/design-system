import React from 'react';
import classNames from 'classnames';
import './NavBarItem.scss';

type NavBarItemProps = {
  /** Om komponenten vises som valgt eller ikke */
  active?: boolean;
  /** Tekste som vises */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: 'a' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const NavBarItem: React.FC<NavBarItemProps> = ({
  active = false,
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
        { 'eds-navbar-item--active': active },
      ])}
      {...rest}
    >
      {children}
    </Element>
  );
};
