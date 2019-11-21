import React from 'react';
import classNames from 'classnames';
import './TopNavigationItem.scss';

type TopNavigationItemProps = {
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

export const TopNavigationItem: React.FC<TopNavigationItemProps> = ({
  active = false,
  as: Element = 'a',
  className,
  ...rest
}) => {
  return (
    <Element
      className={classNames([
        'eds-top-navigation-item',
        className,
        { 'eds-top-navigation-item--active': active },
      ])}
      {...rest}
    />
  );
};
