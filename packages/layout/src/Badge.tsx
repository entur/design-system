import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';

import './Badge.scss';

export type BadgeTypes = 'bullet' | 'notification';

export type BadgeOwnProps = {
  /** Elementet som wrapper badgen
   * @default "span"
   */
  as?: 'span' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /**
   * Innhold i badge.
   * For `type="notification"`: legg til `aria-label` på Badge-elementet eller bruk
   * `VisuallyHidden` inni for å gi skjermlesere kontekst utover tallet,
   * f.eks. `aria-label="3 uleste meldinger"`.
   * For `type="bullet"`: sørg for at teksten alene er meningsfull uten fargen.
   */
  children: React.ReactNode;
  /** Visuell farge-variant */
  variant: 'primary' | 'neutral' | VariantType;
  /** Om 0 skal vises
   * @default false
   */
  showZero?: boolean;
  /** Hva som er høyeste tallet før det legges på "+"
   * @default 99
   */
  max?: number;
  type?: BadgeTypes;
  /** Størrelse
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
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
      showZero = false,
      hide = false,
      as,
      type = 'notification',
      size = 'medium',
      ...rest
    }: BadgeProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;

    const computedHide =
      hide || (children === 0 && !showZero) || children == null;

    let displayValue;
    if (typeof children === 'number') {
      displayValue = children > max ? `${max}+` : children;
    } else {
      displayValue = children;
    }

    return (
      <Element
        className={classNames(
          className,
          'eds-badge',
          {
            'eds-badge--hide': computedHide,
            'eds-badge--show-zero': showZero,
          },
          `eds-badge--variant-${variant}`,
          `eds-badge--type-${type}`,
          `eds-badge--size-${size}`,
        )}
        ref={ref}
        {...rest}
      >
        {displayValue}
      </Element>
    );
  },
);
