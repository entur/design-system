import React from 'react';
import { PolymorphicComponentProps } from '@entur/utils';
import classNames from 'classnames';
import { getSpacingValue } from '../LayoutWrapper/utils';
import type { GridSpacingValue, ResponsiveValue } from '../LayoutWrapper/utils';
import { useResponsiveValue } from '../LayoutWrapper/useResponsiveValue';

import './Flex.scss';

export type FlexSpacingValue = GridSpacingValue;

type FlexDirection = React.CSSProperties['flexDirection'];
type FlexWrap = React.CSSProperties['flexWrap'];
type AlignItems = React.CSSProperties['alignItems'];
type JustifyContent = React.CSSProperties['justifyContent'];
type AlignContent = React.CSSProperties['alignContent'];
type FlexBasis = React.CSSProperties['flexBasis'];
type FlexValue = React.CSSProperties['flex'];

export type FlexOwnProps = {
  /** CSS flex-direction value (supports responsive objects)
   * @default "row"
   */
  direction?: FlexDirection | ResponsiveValue<FlexDirection>;
  /** CSS flex-wrap value (supports responsive objects)
   * @default "nowrap"
   */
  wrap?: FlexWrap | ResponsiveValue<FlexWrap>;
  /** CSS align-items value (supports responsive objects) */
  align?: AlignItems | ResponsiveValue<AlignItems>;
  /** CSS justify-content value (supports responsive objects) */
  justify?: JustifyContent | ResponsiveValue<JustifyContent>;
  /** CSS align-content value (supports responsive objects) */
  alignContent?: AlignContent | ResponsiveValue<AlignContent>;
  /** Spacing between flex items (supports responsive objects) */
  gap?: FlexSpacingValue | ResponsiveValue<FlexSpacingValue>;
  /** Vertical spacing between rows (supports responsive objects) */
  rowGap?: FlexSpacingValue | ResponsiveValue<FlexSpacingValue>;
  /** Horizontal spacing between columns (supports responsive objects) */
  columnGap?: FlexSpacingValue | ResponsiveValue<FlexSpacingValue>;
  /** CSS flex shorthand value */
  flex?: FlexValue;
  /** CSS flex-grow value */
  grow?: number;
  /** CSS flex-shrink value */
  shrink?: number;
  /** CSS flex-basis value */
  basis?: FlexBasis;
  /** CSS width value */
  width?: string;
  /** CSS height value */
  height?: string;
  /** CSS min-width value */
  minWidth?: string;
  /** CSS min-height value */
  minHeight?: string;
  /** CSS max-width value */
  maxWidth?: string;
  /** CSS max-height value */
  maxHeight?: string;
  /** HTML element or React component used to render the Flex container
   * @default "div"
   */
  as?: string | React.ElementType;
  /** Additional class names */
  className?: string;
  /** Content of the Flex container */
  children?: React.ReactNode;
};

export type FlexProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, FlexOwnProps>;

const defaultElement = 'div';

export const Flex = <E extends React.ElementType = typeof defaultElement>({
  direction,
  wrap,
  align,
  justify,
  alignContent,
  gap,
  rowGap,
  columnGap,
  flex,
  grow,
  shrink,
  basis,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  as,
  className,
  children,
  style,
  ...rest
}: FlexProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;

  const resolvedDirection = useResponsiveValue(direction);
  const resolvedWrap = useResponsiveValue(wrap);
  const resolvedAlign = useResponsiveValue(align);
  const resolvedJustify = useResponsiveValue(justify);
  const resolvedAlignContent = useResponsiveValue(alignContent);
  const resolvedGap = useResponsiveValue(gap);
  const resolvedRowGap = useResponsiveValue(rowGap);
  const resolvedColumnGap = useResponsiveValue(columnGap);

  const flexStyle: React.CSSProperties = {
    ...(resolvedDirection && {
      '--flex-direction': resolvedDirection,
    }),
    ...(resolvedWrap && {
      '--flex-wrap': resolvedWrap,
    }),
    ...(resolvedAlign && {
      '--flex-align-items': resolvedAlign,
    }),
    ...(resolvedJustify && {
      '--flex-justify-content': resolvedJustify,
    }),
    ...(resolvedAlignContent && {
      '--flex-align-content': resolvedAlignContent,
    }),
    ...(resolvedGap && {
      '--flex-gap': getSpacingValue(resolvedGap, 'Flex'),
    }),
    ...(resolvedRowGap && {
      '--flex-row-gap': getSpacingValue(resolvedRowGap, 'Flex'),
    }),
    ...(resolvedColumnGap && {
      '--flex-column-gap': getSpacingValue(resolvedColumnGap, 'Flex'),
    }),
    ...(flex !== undefined && {
      '--flex': flex,
    }),
    ...(grow !== undefined && {
      '--flex-grow': grow,
    }),
    ...(shrink !== undefined && {
      '--flex-shrink': shrink,
    }),
    ...(basis !== undefined && {
      '--flex-basis': basis,
    }),
    ...(width && {
      '--flex-width': width,
    }),
    ...(height && {
      '--flex-height': height,
    }),
    ...(minWidth && {
      '--flex-min-width': minWidth,
    }),
    ...(minHeight && {
      '--flex-min-height': minHeight,
    }),
    ...(maxWidth && {
      '--flex-max-width': maxWidth,
    }),
    ...(maxHeight && {
      '--flex-max-height': maxHeight,
    }),
    ...style,
  } as React.CSSProperties;

  return (
    <Element
      className={classNames('eds-layout-flex', className)}
      style={flexStyle}
      {...rest}
    >
      {children}
    </Element>
  );
};
