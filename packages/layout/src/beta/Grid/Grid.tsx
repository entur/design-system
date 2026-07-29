import React from 'react';
import { PolymorphicComponentProps } from '@entur/utils';
import { getSpacingValue, toResponsiveCssVars } from '../utils';
import type { SpacingValue, ResponsiveValue } from '../utils';
import classNames from 'classnames';
import './Grid.scss';

type AlignItems = React.CSSProperties['alignItems'];
type JustifyContent = React.CSSProperties['justifyContent'];
type JustifyItems = React.CSSProperties['justifyItems'];
type AlignContent = React.CSSProperties['alignContent'];
type AutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

/**
 * CSS Grid container with responsive props. All layout props accept either a flat value
 * (applied at all breakpoints) or a `{ base, m?, lg?, xl? }` object where `base` is required
 * and omitted breakpoints inherit from the previous one.
 *
 * Defaults to a 12-column grid. Pair with `GridItem` to control column/row placement.
 *
 * @example
 * <Grid templateColumns={{ base: 'repeat(4, 1fr)', lg: 'repeat(12, 1fr)' }} gap="m">
 *   <GridItem colSpan={{ base: 4, lg: 6 }}>...</GridItem>
 * </Grid>
 */
export type GridOwnProps = {
  /** CSS grid-template-columns value. @default "repeat(12, 1fr)" */
  templateColumns?: ResponsiveValue<string>;
  /** CSS grid-template-rows value */
  templateRows?: ResponsiveValue<string>;
  /** CSS grid-auto-flow value. @default "row" */
  autoFlow?: ResponsiveValue<AutoFlow>;
  /** CSS grid-auto-rows value */
  autoRows?: ResponsiveValue<string>;
  /** CSS grid-auto-columns value */
  autoColumns?: ResponsiveValue<string>;
  /** Gap between grid items */
  gap?: ResponsiveValue<SpacingValue>;
  /** Vertical gap between rows (overrides gap for rows) */
  rowGap?: ResponsiveValue<SpacingValue>;
  /** Horizontal gap between columns */
  columnGap?: ResponsiveValue<SpacingValue>;
  /** CSS align-items value */
  align?: ResponsiveValue<AlignItems>;
  /** CSS justify-content value */
  justify?: ResponsiveValue<JustifyContent>;
  /** CSS justify-items value */
  justifyItems?: ResponsiveValue<JustifyItems>;
  /** CSS align-content value */
  alignContent?: ResponsiveValue<AlignContent>;
  /** Height of the grid container */
  height?: ResponsiveValue<string>;
  /** Min-height of the grid container */
  minHeight?: ResponsiveValue<string>;
  /** Max-height of the grid container */
  maxHeight?: ResponsiveValue<string>;
  /** Min-width of the grid container */
  minWidth?: ResponsiveValue<string>;
  /** Max-width of the grid container */
  maxWidth?: ResponsiveValue<string>;
  className?: string;
  children?: React.ReactNode;
};

export type GridProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, GridOwnProps>;

export type GridComponent = (<
  E extends React.ElementType = typeof defaultElement,
>(
  props: GridProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'div';

export const Grid: GridComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      templateColumns,
      templateRows,
      autoFlow,
      autoRows,
      autoColumns,
      gap = 'm',
      rowGap,
      columnGap,
      align,
      justify,
      justifyItems,
      alignContent,
      height,
      minHeight,
      maxHeight,
      minWidth,
      maxWidth,
      as,
      className,
      children,
      style,
      ...rest
    }: GridProps<E>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const Element: React.ElementType = as || defaultElement;

    const gridStyle: React.CSSProperties = {
      ...toResponsiveCssVars('--grid-template-columns', templateColumns),
      ...toResponsiveCssVars('--grid-template-rows', templateRows),
      ...toResponsiveCssVars('--grid-auto-flow', autoFlow),
      ...toResponsiveCssVars('--grid-auto-rows', autoRows),
      ...toResponsiveCssVars('--grid-auto-columns', autoColumns),
      ...toResponsiveCssVars('--grid-gap', gap, getSpacingValue),
      ...toResponsiveCssVars('--grid-row-gap', rowGap ?? gap, getSpacingValue),
      ...toResponsiveCssVars(
        '--grid-column-gap',
        columnGap ?? gap,
        getSpacingValue,
      ),
      ...toResponsiveCssVars('--grid-align-items', align),
      ...toResponsiveCssVars('--grid-justify-content', justify),
      ...toResponsiveCssVars('--grid-justify-items', justifyItems),
      ...toResponsiveCssVars('--grid-align-content', alignContent),
      ...toResponsiveCssVars('--grid-height', height),
      ...toResponsiveCssVars('--grid-min-height', minHeight),
      ...toResponsiveCssVars('--grid-max-height', maxHeight),
      ...toResponsiveCssVars('--grid-min-width', minWidth),
      ...toResponsiveCssVars('--grid-max-width', maxWidth),
      ...style,
    } as React.CSSProperties;

    return (
      <Element
        ref={ref}
        className={classNames('eds-layout-grid', className)}
        style={gridStyle}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

Grid.displayName = 'Grid';
