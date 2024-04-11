import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';

import './Badge.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const danger = 'danger';

export type BadgeTypes = 'status' | 'bullet' | 'notification';

export type BadgeOwnProps = {
  /** Elementet som wrapper badgen
   * @default "span"
   */
  as?: 'span' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Elementet som badge vil legges relativt til */
  children: React.ReactNode;
  /** Hvilken type badge man vil ha */
  variant: 'primary' | 'neutral' | VariantType | typeof danger | typeof info;
  /** Om 0 skal vises
   * @default false
   */
  showZero?: boolean;
  /** Hva som er høyeste tallet før det legges på "+"
   * @default ++
   */
  max?: number;
  type?: BadgeTypes;
  invisible?: boolean;
};

export type BadgeProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, BadgeOwnProps>;

export type BadgeComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: BadgeProps<T>,
) => React.ReactElement | null;

const defaultElement = 'span';

export const Badge: BadgeComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      max = 99,
      variant,
      showZero = false,
      invisible: invisibleProp = false,
      as,
      type = 'status',
      ...rest
    }: BadgeProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;
    let invisible = invisibleProp;
    if (
      invisibleProp === false &&
      ((children === 0 && !showZero) || children == null)
    ) {
      invisible = true;
    }

    let displayValue;
    if (typeof children === 'number') {
      displayValue = children > max ? `${max}+` : children;
    } else {
      displayValue = children;
    }

    const classList = classNames(
      className,
      'eds-badge',
      { 'eds-badge--invisible': invisible, 'eds-badge--show-zero': showZero },
      `eds-badge--variant-${variant}`,
      `eds-badge--type-${type}`,
    );

    return (
      <Element className={classList} ref={ref} {...rest}>
        {displayValue}
      </Element>
    );
  },
);
