import React from 'react';
import { PolymorphicComponentProps } from '@entur/utils';
import classNames from 'classnames';
import { getSpacingValue, toResponsiveCssVars } from '../utils';
import type { SpacingValue, ResponsiveValue } from '../utils';
import './Flex.scss';

type FlexDirection = React.CSSProperties['flexDirection'];
type FlexWrap = React.CSSProperties['flexWrap'];
type AlignItems = React.CSSProperties['alignItems'];
type JustifyContent = React.CSSProperties['justifyContent'];
type AlignContent = React.CSSProperties['alignContent'];
type FlexBasis = React.CSSProperties['flexBasis'];
type FlexValue = React.CSSProperties['flex'];

/**
 * Flexbox container with responsive props. All layout props accept either a flat value
 * (applied at all breakpoints) or a `{ base, m?, lg?, xl? }` object where `base` is required
 * and omitted breakpoints inherit from the previous one.
 *
 * @example
 * <Flex direction={{ base: 'column', lg: 'row' }} gap="m">
 *   ...
 * </Flex>
 */
export type FlexOwnProps = {
  /** CSS display value. @default "flex" */
  display?: 'flex' | 'inline-flex';
  /** CSS flex-direction value. @default "row" */
  direction?: ResponsiveValue<FlexDirection>;
  /** CSS flex-wrap value. @default "nowrap" */
  wrap?: ResponsiveValue<FlexWrap>;
  /** CSS align-items value */
  align?: ResponsiveValue<AlignItems>;
  /** CSS justify-content value */
  justify?: ResponsiveValue<JustifyContent>;
  /** CSS align-content value */
  alignContent?: ResponsiveValue<AlignContent>;
  /** Gap between flex items */
  gap?: ResponsiveValue<SpacingValue>;
  /** Vertical gap between rows (overrides gap for rows) */
  rowGap?: ResponsiveValue<SpacingValue>;
  /** Horizontal gap between columns (overrides gap for columns) */
  columnGap?: ResponsiveValue<SpacingValue>;
  /** CSS flex shorthand (for use as a flex item) */
  flex?: ResponsiveValue<FlexValue>;
  /** CSS flex-grow (for use as a flex item) */
  grow?: ResponsiveValue<number>;
  /** CSS flex-shrink (for use as a flex item) */
  shrink?: ResponsiveValue<number>;
  /** CSS flex-basis (for use as a flex item) */
  basis?: ResponsiveValue<FlexBasis>;
  width?: ResponsiveValue<string>;
  height?: ResponsiveValue<string>;
  minWidth?: ResponsiveValue<string>;
  minHeight?: ResponsiveValue<string>;
  maxWidth?: ResponsiveValue<string>;
  maxHeight?: ResponsiveValue<string>;
  /** HTML element or React component to render as. @default "div" */
  as?: string | React.ElementType;
  className?: string;
  children?: React.ReactNode;
};

export type FlexProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, FlexOwnProps>;

export type FlexComponent = (<
  E extends React.ElementType = typeof defaultElement,
>(
  props: FlexProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'div';

export const Flex: FlexComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      display,
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
    }: FlexProps<E>,
    ref?: React.Ref<Element>,
  ): JSX.Element => {
    const Element: React.ElementType = as || defaultElement;

    const flexStyle: React.CSSProperties = {
      ...(display && { '--flex-display': display }),
      ...toResponsiveCssVars('--flex-direction', direction),
      ...toResponsiveCssVars('--flex-wrap', wrap),
      ...toResponsiveCssVars('--flex-align-items', align),
      ...toResponsiveCssVars('--flex-justify-content', justify),
      ...toResponsiveCssVars('--flex-align-content', alignContent),
      ...toResponsiveCssVars('--flex-gap', gap, getSpacingValue),
      ...toResponsiveCssVars('--flex-row-gap', rowGap ?? gap, getSpacingValue),
      ...toResponsiveCssVars(
        '--flex-column-gap',
        columnGap ?? gap,
        getSpacingValue,
      ),
      ...toResponsiveCssVars('--flex', flex),
      ...toResponsiveCssVars('--flex-grow', grow),
      ...toResponsiveCssVars('--flex-shrink', shrink),
      ...toResponsiveCssVars('--flex-basis', basis),
      ...toResponsiveCssVars('--flex-width', width),
      ...toResponsiveCssVars('--flex-height', height),
      ...toResponsiveCssVars('--flex-min-width', minWidth),
      ...toResponsiveCssVars('--flex-min-height', minHeight),
      ...toResponsiveCssVars('--flex-max-width', maxWidth),
      ...toResponsiveCssVars('--flex-max-height', maxHeight),
      ...style,
    } as React.CSSProperties;

    return (
      <Element
        ref={ref}
        className={classNames('eds-layout-flex', className)}
        style={flexStyle}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

Flex.displayName = 'Flex';
