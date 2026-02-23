import React from 'react';
import { Badge } from './Badge';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';
import { warnOnce } from '../warnOnce';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const danger = 'danger';

/**
 * @deprecated StatusBadge is deprecated. Use Tag with the same variant and size props instead.
 * @see Tag from '@entur/layout'
 */
type StatusBadgeBaseProps = {
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
  /** Skjul badge */
  hide?: boolean;
};

/**
 * @deprecated StatusBadge is deprecated. Use Tag instead.
 * @see Tag from '@entur/layout'
 */
export type StatusBadgeProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, StatusBadgeBaseProps>;

/**
 * @deprecated StatusBadge is deprecated. Use Tag instead.
 * @see Tag from '@entur/layout'
 */
export type StatusBadgeComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: StatusBadgeProps<T>,
) => React.ReactElement | null;

const defaultElement = 'span';

/**
 * @deprecated StatusBadge is deprecated. Use Tag with the same variant and size props instead.
 * @see Tag from '@entur/layout'
 */
export const StatusBadge: StatusBadgeComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: StatusBadgeProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    warnOnce(
      'StatusBadge-deprecated',
      '[Entur Linje] StatusBadge is deprecated. Use <Tag> with the same variant and size props instead.',
    );
    const Element = props.as || defaultElement;
    // @ts-expect-error type error due to props not being BadgeOwnProps
    return <Badge as={Element} {...props} ref={ref} type="status" />;
  },
);
