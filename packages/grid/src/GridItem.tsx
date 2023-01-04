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

export type GridItemProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, GridItemOwnProps>;

const defaultElement = 'div';

export const GridItem = <E extends React.ElementType = typeof defaultElement>({
  children,
  className,
  small,
  medium,
  large,
  as,
  ...rest
}: GridItemProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  return (
    <BaseGrid
      as={Element}
      item
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
