import React from 'react';
import { PolymorphicComponentProps } from '@entur/utils';
import classNames from 'classnames';
import { toResponsiveCssVars } from '../utils';
import type { ResponsiveValue } from '../utils';
import './GridItem.scss';

type ColRowValue = number | string;

export type GridItemOwnProps = {
  /**
   * Columns to span. Number adds "span" prefix (e.g. 6 → "span 6"). String used as-is (e.g. "1 / -1").
   * Accepts a responsive object: `{ base: 12, m: 6, lg: 4 }`.
   */
  colSpan?: ResponsiveValue<ColRowValue>;
  /**
   * Rows to span. Number adds "span" prefix (e.g. 2 → "span 2"). String used as-is.
   * Accepts a responsive object: `{ base: 1, m: 2 }`.
   */
  rowSpan?: ResponsiveValue<ColRowValue>;
  /** CSS align-self value */
  alignSelf?: ResponsiveValue<React.CSSProperties['alignSelf']>;
  /** CSS justify-self value */
  justifySelf?: ResponsiveValue<React.CSSProperties['justifySelf']>;
  /** HTML element or React component to render as. @default "div" */
  as?: string | React.ElementType;
  className?: string;
  children?: React.ReactNode;
};

export type GridItemProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, GridItemOwnProps>;

export type GridItemComponent = (<
  E extends React.ElementType = typeof defaultElement,
>(
  props: GridItemProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'div';

const formatSpan = (value: ColRowValue): string =>
  typeof value === 'number' ? `span ${value}` : value;

export const GridItem: GridItemComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      colSpan,
      rowSpan,
      alignSelf,
      justifySelf,
      as,
      className,
      children,
      style,
      ...rest
    }: GridItemProps<E>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const Element: React.ElementType = as || defaultElement;

    const itemStyle: React.CSSProperties = {
      ...toResponsiveCssVars('--grid-item-col', colSpan, formatSpan),
      ...toResponsiveCssVars('--grid-item-row', rowSpan, formatSpan),
      ...toResponsiveCssVars('--grid-item-align-self', alignSelf),
      ...toResponsiveCssVars('--grid-item-justify-self', justifySelf),
      ...style,
    } as React.CSSProperties;

    return (
      <Element
        ref={ref}
        className={classNames('eds-layout-grid-item', className)}
        style={itemStyle}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

GridItem.displayName = 'GridItem';
