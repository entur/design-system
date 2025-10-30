import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';
import { Text } from '@entur/typography/beta';
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
  /** Hvilken variant badge man vil ha */
  variant: 'primary' | 'neutral' | VariantType | typeof danger | typeof info;
  /** Om 0 skal vises
   * @default false
   */
  /** Velg størrelse på badge */
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
  /** Hva som er høyeste tallet før det legges på "+"
   * @default ++
   */
  max?: number;
  /** Hva som er typen badge man vil ha */
  type?: BadgeTypes;
  /** @deprecated Bruk `hide` i stedet */
  invisible?: boolean;
  /** Skjul badge */
  hide?: boolean;
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
      size = 'medium',
      showZero = false,
      invisible: invisibleProp = false,
      hide: hideProp = false,
      as,
      type = 'status',
      ...rest
    }: BadgeProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;

    const computedHide =
      hideProp ||
      invisibleProp ||
      (children === 0 && !showZero) ||
      children == null;

    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[0] !== 'string' &&
      typeof childrenArray[0] !== 'number';

    let content;

    if (typeof children === 'number') {
      const displayValue = children > max ? `${max}+` : children;
      content = (
        <Text as="span" variant="caption" spacing="none">
          {displayValue}
        </Text>
      );
    } else if (hasLeadingIcon) {
      // When we have a leading icon, wrap text portions in Text component
      content = childrenArray.map((child, index) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return (
            <Text key={index} as="span" variant="caption" spacing="none">
              {child}
            </Text>
          );
        }
        return child;
      });
    } else {
      content = (
        <Text as="span" variant="caption" spacing="none">
          {children}
        </Text>
      );
    }

    const classList = classNames(
      className,
      'eds-badge',
      {
        'eds-badge--hide': computedHide,
        'eds-badge--show-zero': showZero,
        'eds-badge--leading-icon': hasLeadingIcon,
      },
      `eds-badge--variant-${variant}`,
      `eds-badge--type-${type}`,
      `eds-badge--size-${size}`,
    );

    return (
      <Element className={classList} ref={ref} {...rest}>
        {content}
      </Element>
    );
  },
);
