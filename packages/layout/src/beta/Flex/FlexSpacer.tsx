import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';

export type FlexSpacerOwnProps = {
  /** HTML element or React component used to render Flex.Spacer
   * @default "div"
   */
  as?: string | React.ElementType;
  /** Additional class name */
  className?: string;
  /** Spacer should not render children */
  children?: never;
};

export type FlexSpacerProps<
  T extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<T, FlexSpacerOwnProps>;

export type FlexSpacerComponent = (<
  E extends React.ElementType = typeof defaultElement,
>(
  props: FlexSpacerProps<E>,
) => React.ReactElement | null) & { displayName?: string };

const defaultElement = 'div';

export const FlexSpacer: FlexSpacerComponent = <
  E extends React.ElementType = typeof defaultElement,
>({
  as,
  className,
  style,
  ...rest
}: FlexSpacerProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;

  return (
    <Element
      className={classNames('eds-layout-flex-spacer', className)}
      style={style}
      {...rest}
      role="presentation"
      aria-hidden="true"
    ></Element>
  );
};
