import React from 'react';
import { Badge } from './Badge';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
  PolymorphicForwardRefExoticComponent,
} from '@entur/utils';

type NotificationBadgeBaseProps = {
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

export type NotificationBadgePropsProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<NotificationBadgeBaseProps, T>;

const defaultElement = 'span';

export const NotificationBadge: PolymorphicForwardRefExoticComponent<
  NotificationBadgeBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PolymorphicPropsWithoutRef<NotificationBadgeBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return <Badge as={Element} {...props} ref={ref} type="notification" />;
  },
);
