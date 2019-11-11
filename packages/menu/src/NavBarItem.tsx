import React from 'react';
import { Heading4 } from '@entur/typography';
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
        'entur-navbar-item',
        className,
        { 'entur-navbar-item--active': selected },
      ])}
      {...rest}
    >
      <Heading4 as="div">{children}</Heading4>
    </Element>
  );
};
