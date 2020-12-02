import React from 'react';
import classNames from 'classnames';
import './TopNavigationItem.scss';
import { PolymorphicComponentProps, Box } from '@entur/utils';

export type TopNavigationItemOwnProps = {
  /** Om komponenten vises som valgt eller ikke
   * @default false
   */
  active?: boolean;
  /** Tekste som vises */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten
   * @default 'a'
   */
  as?: 'a' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
};

export type TopNavigationItemProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, TopNavigationItemOwnProps>;

const defaultElement = 'a';

export const TopNavigationItem = <
  E extends React.ElementType = typeof defaultElement
>({
  active = false,
  className,
  ...rest
}: TopNavigationItemProps<E>): JSX.Element => {
  return (
    <Box
      as={defaultElement}
      className={classNames([
        'eds-top-navigation-item',
        className,
        { 'eds-top-navigation-item--active': active },
      ])}
      {...rest}
    />
  );
};
