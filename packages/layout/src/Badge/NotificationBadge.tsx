import React from 'react';
import { Badge } from './Badge';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const danger = 'danger';

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
  variant: 'primary' | 'neutral' | VariantType | typeof danger | typeof info;
  /** Om 0 skal vises
   * @default false
   */
  showZero?: boolean;
  /** Hva som er høyeste tallet før det legges på "+"
   * @default ++
   */
  max?: number;
};

export type NotificationBadgeProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, NotificationBadgeBaseProps>;

export type NotificationBadgeComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: NotificationBadgeProps<T>,
) => React.ReactElement | null;

const defaultElement = 'span';

export const NotificationBadge: NotificationBadgeComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: NotificationBadgeProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    // @ts-expect-error type error due to props not being BadgeOwnProps
    return <Badge as={Element} {...props} ref={ref} type="notification" />;
  },
);
