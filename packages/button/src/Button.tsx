import * as React from 'react';
import cx from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { LoadingDots } from '@entur/loader';
import './Button.scss';

/** @deprecated use variant="secondary" size="small" instead */
const tertiary = 'tertiary';

type ButtonBaseProps = {
  /** Farge og uttrykk på knappen */
  variant: 'primary' | 'secondary' | 'success' | 'negative' | typeof tertiary;
  /** Størrelsen på knappen
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
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
  /** Et HTML-element eller en React-komponent som komponenten tar utgangspunkt i for å lage denne knappevarianten
   * @default "button"
   */
  as?: string | React.ElementType;
  /**
   * Tekst som leses opp på skjermleser (nødvendig når knappetekst mangler)
   */
  'aria-label'?: string;
};

const defaultElement = 'button';

export type ButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, ButtonBaseProps>;

export type ButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: ButtonProps<T>,
) => React.ReactElement | null;

export const Button: ButtonComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      as,
      children,
      variant = 'primary',
      size = 'medium',
      loading,
      className,
      disabled = false,
      width = 'auto',
      'aria-label': ariaLabel,
      ...rest
    }: ButtonProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;
    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
    const hasTrailingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[childrenArray.length - 1] !== 'string';

    const ariaLabelWhenLoading = childrenArray
      .filter(child => typeof child === 'string')
      .join(' ');

    const ariaLabelValue = () => {
      if (ariaLabel) return ariaLabel;
      if (loading) return ariaLabelWhenLoading;
      return undefined;
    };

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
        aria-label={ariaLabelValue()}
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
