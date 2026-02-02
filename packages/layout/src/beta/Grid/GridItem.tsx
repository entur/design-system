import React from 'react';
import { PolymorphicComponentProps } from '@entur/utils';
import { useResponsiveValue } from '../LayoutWrapper/useResponsiveValue';
import type { ResponsiveValue } from '../LayoutWrapper/utils';
import classNames from 'classnames';

import './GridItem.scss';

export type GridItemOwnProps = {
  /** Number of columns the item should span (supports responsive objects)
   * If number: adds "span" prefix (e.g., 6 → "span 6")
   * If string: used directly (e.g., "span 3" or "1 / 3")
   */
  colSpan?: number | string | ResponsiveValue<number | string>;
  /** Number of rows the item should span (supports responsive objects)
   * @default 1
   * If number: adds "span" prefix (e.g., 2 → "span 2")
   * If string: used directly (e.g., "span 2" or "1 / 3")
   */
  rowSpan?: number | string | ResponsiveValue<number | string>;
  /** HTML element or React component used to render the Grid item
   * @default "div"
   */
  as?: string | React.ElementType;
  /** Additional class names */
  className?: string;
  /** Content of the Grid item */
  children?: React.ReactNode;
};

export type GridItemProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, GridItemOwnProps>;

const defaultElement = 'div';

const formatGridSpan = (
  value: number | string | undefined,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `span ${value}`;
  }

  return value;
};

export const GridItem = <E extends React.ElementType = typeof defaultElement>({
  colSpan,
  rowSpan = 1,
  as,
  className,
  children,
  style,
  ...rest
}: GridItemProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;

  const resolvedColSpan = useResponsiveValue(colSpan);
  const resolvedRowSpan = useResponsiveValue(rowSpan);

  const itemStyle: React.CSSProperties = {
    ...(resolvedColSpan !== undefined && {
      '--grid-item-column': formatGridSpan(resolvedColSpan),
    }),
    ...(resolvedRowSpan !== undefined && {
      '--grid-item-row': formatGridSpan(resolvedRowSpan),
    }),
    ...style,
  } as React.CSSProperties;

  return (
    <Element
      className={classNames('eds-layout-grid-item', className)}
      style={itemStyle}
      {...rest}
    >
      {children}
    </Element>
  );
};
