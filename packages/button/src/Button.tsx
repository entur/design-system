import * as React from 'react';
import cx from 'classnames';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
} from '@entur/utils';
import { LoadingDots } from '@entur/loader';
import './Button.scss';

type ButtonBaseProps = {
  /** Farge og uttrykk på knappen */
  variant: 'primary' | 'secondary' | 'success' | 'negative' | 'tertiary';
  /** Størrelsen på knappen
   * @default 'medium'
   */
  size?: 'medium' | 'large';
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Bredden på knappen.
   * @default 'auto'
   */
  width?: 'fluid' | 'auto';
  /** Innholdet i knappen */
  children: React.ReactNode;
};

const defaultElement = 'button';

export type ButtonProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<ButtonBaseProps, T>;

export const Button: PolymorphicForwardRefExoticComponent<
  ButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      as,
      variant,
      size = 'medium',
      loading,
      className,
      children,
      disabled = false,
      width = 'auto',
      ...rest
    }: PolymorphicPropsWithoutRef<ButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = as || defaultElement;
    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
    const hasTrailingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[childrenArray.length - 1] !== 'string';

    return (
      <Element
        className={cx(
          'eds-button',
          {
            [`eds-button--variant-${variant}`]: variant,
            [`eds-button--size-${size}`]: size,
            'eds-button--width-fluid': width === 'fluid',
            'eds-button--loading': loading,
            'eds-button--leading-icon': hasLeadingIcon,
            'eds-button--trailing-icon': hasTrailingIcon,
          },
          className,
        )}
        ref={ref}
        aria-busy={loading}
        disabled={disabled}
        aria-disabled={disabled}
        {...rest}
      >
        {loading ? (
          <LoadingDots className="eds-button__loading-dots" />
        ) : (
          children
        )}
      </Element>
    );
  },
);
