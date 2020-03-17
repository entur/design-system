import React from 'react';
import { BaseGrid } from './BaseGrid';
import './Grid.scss';

export type GridContainerProps = {
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
  [key: string]: any;
};

export const GridContainer: React.FC<GridContainerProps> = ({
  as,
  children,
  className,
  spacing,
  rowSpacing,
  ...rest
}) => {
  return (
    <BaseGrid
      container
      as={as}
      className={className}
      spacing={spacing}
      rowSpacing={rowSpacing}
      {...rest}
    >
      {children}
    </BaseGrid>
  );
};
