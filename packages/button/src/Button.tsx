import React from 'react';
import cx from 'classnames';
import './styles.scss';

declare type sizes = 'medium' | 'large';
declare type variants = 'primary' | 'secondary' | 'success' | 'negative';
declare type widths = 'fluid' | 'square';
type ButtonProps = {
  /** Farge og uttrykk på knappen */
  variant: variants;
  /** Størrelsen på knappen */
  size?: sizes;
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe */
  loading?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen */
  disabled?: boolean;
  /** Bredden på knappen. Defaulter til "standard-størrelse" */
  width?: widths;
  /** Innholdet i knappen */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager knappen */
  as?: 'a' | 'button' | React.ElementType;
  [key: string]: any;
};

export const Button: React.RefForwardingComponent<
  HTMLButtonElement,
  ButtonProps
> = React.forwardRef(
  (
    {
      variant,
      size = 'medium',
      loading,
      className,
      children,
      disabled = false,
      width,
      as = 'button',
      ...rest
    },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const Element = disabled ? 'button' : as;

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
            [`eds-button--width-${width}`]: width,
            'eds-button--disabled': disabled,
            'eds-button--loading': loading,
            'eds-button--leading-icon': hasLeadingIcon,
            'eds-button--trailing-icon': hasTrailingIcon,
          },
          className,
        )}
        ref={ref}
        aria-busy={loading}
        disabled={disabled}
        {...rest}
      >
        {loading ? <div className="spinner" /> : children}
      </Element>
    );
  },
);
