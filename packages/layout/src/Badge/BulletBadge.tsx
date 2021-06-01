import React from 'react';
import { Badge } from './Badge';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
  PolymorphicForwardRefExoticComponent,
} from '@entur/utils';

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

export type BulletBadgeProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<BulletBadgeBaseProps, T>;

const defaultElement = 'span';

export const BulletBadge: PolymorphicForwardRefExoticComponent<
  BulletBadgeBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<BulletBadgeBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return <Badge as={Element} {...props} ref={ref} type="bullet" />;
  },
);
