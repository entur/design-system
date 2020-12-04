import React from 'react';
import { BaseGrid } from './BaseGrid';
import { PolymorphicComponentProps } from '@entur/utils';
import './Grid.scss';

export type GridContainerOwnProps = {
  /** Mellomromet mellom hver GridItem, basert på spacing-tokens
   * @default none
   */
  spacing?:
    | 'none'
    | 'extraSmall2'
    | 'extraSmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'extraLarge';
  /** Mellomrom mellom hver rad
   * @default Verdien til spacing
   */
  rowSpacing?:
    | 'none'
    | 'extraSmall2'
    | 'extraSmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'extraLarge';
  /** HTML-elementet eller React-komponenten som lager Grid-elementet*/
  as?: 'div' | React.ElementType;
  /** Innholdet til Grid-containeren */
  children?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
};

export type GridContainerProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, GridContainerOwnProps>;

const defaultElement = 'div';

export const GridContainer = <
  E extends React.ElementType = typeof defaultElement
>({
  children,
  className,
  spacing,
  rowSpacing,
  ...rest
}: GridContainerProps<E>): JSX.Element => {
  return (
    <BaseGrid
      container
      as={defaultElement}
      className={className}
      spacing={spacing}
      rowSpacing={rowSpacing}
      {...rest}
    >
      {children}
    </BaseGrid>
  );
};
