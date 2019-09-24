import React from 'react';
import cx from 'classnames';
import './styles.scss';

declare type sizes = 'medium' | 'large';
declare type variants = 'primary' | 'secondary' | 'success' | 'negative';
declare type widths = 'medium' | 'large' | 'fluid' | 'square';
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
      loading = false,
      className,
      children,
      disabled = false,
      width,
      active,
      as: Element = 'button',
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

    return (
      <Element
        className={classList}
        ref={ref}
        aria-busy={loading}
        disabled={disabled}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);
