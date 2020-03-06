import React from 'react';
import classnames from 'classnames';
import './Grid.scss';

export type GridProps = {
  /** Settes
   * @default false
   */
  container?: boolean;
  /** Settes
   * @default false
   */
  item?: boolean;
  /** Mellomromet mellom hver GridItem, basert på spacing-tokens
   * @default none
   */
  spacing?:
    | 'none'
    | 'xsmall2'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge';
  /** Vertikalt mellomrom for hver GridItem
   * @default Verdien til spacing
   */
  rowSpacing?:
    | 'none'
    | 'xsmall2'
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge';
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
  className?: 'string';
  [key: string]: any;
};

export const BaseGrid: React.FC<GridProps> = ({
  item = false,
  container = false,
  as: Component = 'div',
  children,
  className,
  spacing = 'none',
  rowSpacing = spacing,
  small = 1,
  medium,
  large,
  ...rest
}) => {
  const classList = classnames([
    'eds-grid',
    className,
    { 'eds-grid__item': item },
    { 'eds-grid__container': container },
    { [`eds-grid--spacing-${spacing}`]: spacing && container },
    { [`eds-grid--spacing-row-${rowSpacing}`]: spacing !== rowSpacing },
    { [`eds-grid--small-${small}`]: small && item },
    { [`eds-grid--medium-${medium}`]: medium && item },
    { [`eds-grid--large-${large}`]: large && item },
  ]);
  return (
    <Component className={classList} {...rest}>
      {children}
    </Component>
  );
};
