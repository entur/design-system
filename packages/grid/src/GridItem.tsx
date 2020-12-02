import React from 'react';
import { BaseGrid } from './BaseGrid';
import { PolymorphicComponentProps } from '@entur/utils';
import './Grid.scss';

export type GridItemOwnProps = {
  /** Antall kolonner en Item bruker på små flater (og oppover)
   * @default 1
   */
  small?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Antall kolonner en Item bruker på medium flater (og oppover) */
  medium?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Antall kolonner en Item bruker på store flater. */
  large?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** HTML-elementet eller React-komponenten som lager Grid-elementet*/
  as?: 'div' | React.ElementType;
  /** Innholdet til Grid containeren/item */
  children?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
};

export type GridItemProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, GridItemOwnProps>;

const defaultElement = 'div';

export const GridItem = <E extends React.ElementType = typeof defaultElement>({
  children,
  className,
  small,
  medium,
  large,
  ...rest
}: GridItemProps<E>): JSX.Element => {
  return (
    <BaseGrid
      item
      as={defaultElement}
      className={className}
      small={small}
      medium={medium}
      large={large}
      {...rest}
    >
      {children}
    </BaseGrid>
  );
};
