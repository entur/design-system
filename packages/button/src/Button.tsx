import React from 'react';
import cx from 'classnames';
import './styles.scss';

declare type sizes = 'medium' | 'large';
declare type variants = 'primary' | 'secondary' | 'success' | 'negative';
declare type widths = 'fluid' | 'square';
type ButtonProps = {
  variant: variants;
  size?: sizes;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  width?: widths;
  active?: boolean;
  children: React.ReactNode;
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
      active,
      as = 'button',
      ...rest
    },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const classList = cx(
      'entur-button',
      {
        [`entur-button--variant-${variant}`]: variant,
        [`entur-button--size-${size}`]: size,
        [`entur-button--width-${width}`]: width,
        [`entur-button--active`]: active,
        [`entur-button--disabled`]: disabled,
        [`entur-button--loading`]: loading,
      },
      className,
    );

    const Element = disabled ? 'button' : as;

    return (
      <Element
        className={classList}
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
