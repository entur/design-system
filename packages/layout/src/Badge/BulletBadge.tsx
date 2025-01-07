import React from 'react';
import { Badge } from './Badge';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const danger = 'danger';

type BulletBadgeBaseProps = {
  /** Elementet som wrapper badgen
   * @default "span"
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Elementet som badge vil legges relativt til */
  children: React.ReactNode;
  /** Hvilken type badge man vil ha */
  variant: 'primary' | 'neutral' | VariantType | typeof danger | typeof info;
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
    const Element = props.as || defaultElement;
    // @ts-expect-error type error due to props not being BadgeOwnProps
    return <Badge as={Element} {...props} ref={ref} type="bullet" />;
  },
);
