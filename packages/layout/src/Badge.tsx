import React from 'react';
import classNames from 'classnames';
import './Badge.scss';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

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
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** Om 0 skal vises
   * @default false
   */
  showZero?: boolean;
  /** Hva som er høyeste tallet før det legges på "+"
   * @default ++
   */
  max?: number;
};

export type BadgeProps<
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithoutRef<BadgeOwnProps, E>;

const defaultElement = 'span';

export const Badge: <E extends React.ElementType = typeof defaultElement>(
  props: BadgeProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      max = 99,
      variant,
      showZero = false,
      invisible: invisibleProp = false,
      as,
      ...rest
    }: BadgeProps<E>,
    ref: typeof rest.ref,
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
      'eds-badge',
      { 'eds-badge--invisible': invisible, 'eds-badge--show-zero': showZero },
      `eds-badge--variant-${variant}`,
    );

    return (
      <Element className={classList} ref={ref} {...rest}>
        {displayValue}
      </Element>
    );
  },
);
