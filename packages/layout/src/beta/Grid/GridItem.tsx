import React from 'react';
import { PolymorphicComponentProps } from '@entur/utils';
import classNames from 'classnames';
import { isResponsiveObject, toResponsiveCssVars } from '../utils';
import type { ResponsiveValue } from '../utils';
import './GridItem.scss';

type ColRowValue = number | string;

const formatSpanValue = (value: ColRowValue): string =>
  typeof value === 'number' ? `span ${value}` : value;

/**
 * Converts a colSpan/rowSpan value into grid-column-start / grid-column-end
 * (or row) CSS vars. String values containing "/" are split into start + end.
 */
const spanToStartEndVars = (
  startPrefix: string,
  endPrefix: string,
  value: ResponsiveValue<ColRowValue> | undefined,
): Record<string, string | number | undefined> => {
  if (value === undefined) return {};

  const processOne = (v: ColRowValue, suffix: string) => {
    const formatted = formatSpanValue(v);
    const slashIdx = formatted.indexOf('/');
    if (slashIdx !== -1) {
      return {
        [`${startPrefix}-${suffix}`]: formatted.slice(0, slashIdx).trim(),
        [`${endPrefix}-${suffix}`]: formatted.slice(slashIdx + 1).trim(),
      };
    }
    return { [`${startPrefix}-${suffix}`]: formatted };
  };

  if (isResponsiveObject(value)) {
    return {
      ...processOne(value.base, 'base'),
      ...(value.s !== undefined ? processOne(value.s, 's') : {}),
      ...(value.m !== undefined ? processOne(value.m, 'm') : {}),
      ...(value.lg !== undefined ? processOne(value.lg, 'lg') : {}),
      ...(value.xl !== undefined ? processOne(value.xl, 'xl') : {}),
    };
  }

  return processOne(value as ColRowValue, 'base');
};

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
  /** CSS grid-column-start value. Number = line number (e.g. 2 → grid-column-start: 2). String used as-is. */
  colStart?: ResponsiveValue<ColRowValue>;
  /** CSS grid-column-end value. Number = line number. String used as-is (e.g. "-1"). */
  colEnd?: ResponsiveValue<ColRowValue>;
  /** CSS grid-row-start value. Number = line number. String used as-is. */
  rowStart?: ResponsiveValue<ColRowValue>;
  /** CSS grid-row-end value. Number = line number. String used as-is. */
  rowEnd?: ResponsiveValue<ColRowValue>;
  /** CSS align-self value */
  alignSelf?: ResponsiveValue<React.CSSProperties['alignSelf']>;
  /** CSS justify-self value */
  justifySelf?: ResponsiveValue<React.CSSProperties['justifySelf']>;
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

export const GridItem: GridItemComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
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
      ...spanToStartEndVars(
        '--grid-item-col-start',
        '--grid-item-col-end',
        colSpan,
      ),
      ...spanToStartEndVars(
        '--grid-item-row-start',
        '--grid-item-row-end',
        rowSpan,
      ),
      ...toResponsiveCssVars('--grid-item-col-start', colStart),
      ...toResponsiveCssVars('--grid-item-col-end', colEnd),
      ...toResponsiveCssVars('--grid-item-row-start', rowStart),
      ...toResponsiveCssVars('--grid-item-row-end', rowEnd),
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
