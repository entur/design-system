import React from 'react';
import { Badge } from './Badge';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

type BulletBadgeBaseProps = {
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
};

export type BulletBadgeProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, BulletBadgeBaseProps>;

export type BulletBadgeComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: BulletBadgeProps<T>,
) => React.ReactElement | null;

const defaultElement = 'span';

export const BulletBadge: BulletBadgeComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: BulletBadgeProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    // @ts-expect-error type error due to props not being BadgeOwnProps
    return <Badge as={Element} {...props} ref={ref} type="bullet" />;
  },
);
