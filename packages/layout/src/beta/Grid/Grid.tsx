import React from 'react';
import { PolymorphicComponentProps } from '@entur/utils';
import { getSpacingValue } from './utils';
import type { GridSpacingValue, ResponsiveValue } from './utils';
import { useResponsiveValue } from './useResponsiveValue';
import classNames from 'classnames';

import './Grid.scss';

export type GridOwnProps = {
  /** CSS grid-template-columns value (supports responsive objects)
   * @default "repeat(12, 1fr)"
   */
  templateColumns?: string | ResponsiveValue<string>;
  /** Spacing between grid items (supports responsive objects)
   * @default "m"
   */
  gap?: GridSpacingValue | ResponsiveValue<GridSpacingValue>;
  /** Vertical spacing between grid rows (supports responsive objects) */
  rowGap?: GridSpacingValue | ResponsiveValue<GridSpacingValue>;
  /** Horizontal spacing between grid columns (supports responsive objects) */
  columnGap?: GridSpacingValue | ResponsiveValue<GridSpacingValue>;
  /** CSS grid-template-rows value (supports responsive objects) */
  templateRows?: string | ResponsiveValue<string>;
  /** CSS grid-auto-flow value (supports responsive objects)
   * @default "row"
   */
  autoFlow?:
    | 'row'
    | 'column'
    | 'dense'
    | 'row dense'
    | 'column dense'
    | ResponsiveValue<
        'row' | 'column' | 'dense' | 'row dense' | 'column dense'
      >;
  /** The height of the grid container */
  height?: string;
  /** HTML element or React component used to render the Grid
   * @default "div"
   */
  as?: string | React.ElementType;
  /** Additional class names */
  className?: string;
  /** Content of the Grid container */
  children?: React.ReactNode;
};

export type GridProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, GridOwnProps>;

const defaultElement = 'div';

export const Grid = <E extends React.ElementType = typeof defaultElement>({
  templateColumns,
  templateRows,
  gap = 'm',
  rowGap,
  columnGap,
  autoFlow = 'row',
  height,
  as,
  className,
  children,
  style,
  ...rest
}: GridProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;

  const resolvedTemplateColumns =
    useResponsiveValue(templateColumns) ?? 'repeat(12, 1fr)';
  const resolvedTemplateRows = useResponsiveValue(templateRows);
  const resolvedGap = useResponsiveValue(gap);
  const resolvedRowGap = useResponsiveValue(rowGap);
  const resolvedColumnGap = useResponsiveValue(columnGap);
  const resolvedAutoFlow = useResponsiveValue(autoFlow) ?? 'row';

  const gridStyle: React.CSSProperties = {
    ...(resolvedTemplateColumns && {
      '--grid-template-columns': resolvedTemplateColumns,
    }),
    ...(resolvedTemplateRows && {
      '--grid-template-rows': resolvedTemplateRows,
    }),
    ...(resolvedAutoFlow && {
      '--grid-auto-flow': resolvedAutoFlow,
    }),
    ...(resolvedGap && {
      '--grid-gap': getSpacingValue(resolvedGap),
    }),
    ...(resolvedRowGap && {
      '--grid-row-gap': getSpacingValue(resolvedRowGap),
    }),
    ...(resolvedColumnGap && {
      '--grid-column-gap': getSpacingValue(resolvedColumnGap),
    }),
    ...(height && {
      '--grid-height': height,
    }),
    ...style,
  } as React.CSSProperties;

  return (
    <Element
      className={classNames('eds-layout-grid', className)}
      style={gridStyle}
      {...rest}
    >
      {children}
    </Element>
  );
};
