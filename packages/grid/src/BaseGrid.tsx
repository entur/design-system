import React from 'react';
import classnames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import './Grid.scss';

type BaseGridOwnProps = {
  /** Om det er en GridContainer
   * @default false
   */
  container?: boolean;
  /** Om det er et GridItem
   * @default false
   */
  item?: boolean;
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
  /** Vertikalt mellomrom for hver GridItem
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
  /** Antall kolonner en Item bruker på små flater (og oppover)
   * @default 1
   */
  small?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Antall kolonner en Item bruker på medium flater (og oppover) */
  medium?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Antall kolonner en Item bruker på store flater. */
  large?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** HTML-elementet eller React-komponenten som lager Grid-elementet
   * @default "div"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet til Grid containeren/item */
  children?: React.ReactNode;
};
const defaultElement = 'code';

export type BaseGridProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, BaseGridOwnProps>;

export const BaseGrid = <E extends React.ElementType = typeof defaultElement>({
  item,
  container,
  children,
  className,
  spacing,
  rowSpacing,
  small = 1,
  medium,
  large,
  as,
  ...rest
}: BaseGridProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
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
    <Element className={classList} {...rest}>
      {children}
    </Element>
  );
};
