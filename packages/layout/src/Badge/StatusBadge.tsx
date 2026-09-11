import React from 'react';
import { Badge } from './Badge';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const danger = 'danger';

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

/** @deprecated Bruk `TagProps` i stedet */
export type StatusBadgeProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, StatusBadgeBaseProps>;

/** @deprecated Bruk `TagComponent` i stedet */
export type StatusBadgeComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: StatusBadgeProps<T>,
) => React.ReactElement | null;

const defaultElement = 'span';

/** @deprecated Bruk `Tag` i stedet. `variant="primary"` tilsvarer
 * `variant="neutral"` på `Tag` */
export const StatusBadge: StatusBadgeComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: StatusBadgeProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element = props.as || defaultElement;
    // @ts-expect-error type error due to props not being BadgeOwnProps
    return <Badge as={Element} {...props} ref={ref} type="status" />;
  },
);
