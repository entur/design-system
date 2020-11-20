import React from 'react';
import cx from 'classnames';
import './Button.scss';
import './LoadingSpinner.scss';

export type ButtonProps = {
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
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: 'a' | 'button' | React.ElementType;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size = 'medium',
      loading,
      className,
      children,
      disabled = false,
      width = 'auto',
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
        {loading ? <div className="eds-button__spinner" /> : children}
      </Element>
    );
  },
);
