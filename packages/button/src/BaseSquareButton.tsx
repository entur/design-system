import React from 'react';
import classNames from 'classnames';
import './BaseSquareButton.scss';
import './LoadingSpinner.scss';

export type BaseSquareButtonProps = {
  /** Tekst og ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** En type knapp */
  variant: 'success' | 'secondary';
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: 'a' | 'button' | React.ElementType;
};

export const BaseSquareButton = React.forwardRef<
  HTMLButtonElement,
  BaseSquareButtonProps
>(
  (
    {
      children,
      className,
      variant,
      disabled = false,
      loading = false,
      as = 'button',
      ...rest
    },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const Element = disabled ? 'button' : as;

    return (
      <Element
        className={classNames(
          'eds-square-button',
          { 'eds-square-button--success': variant === 'success' },
          { 'eds-square-button--secondary': variant === 'secondary' },
          { 'eds-square-button--loading': loading },
          className,
        )}
        aria-busy={loading}
        disabled={disabled}
        aria-disabled={disabled}
        ref={ref}
        {...rest}
      >
        {React.Children.map(children, child => {
          if (typeof child === 'string') {
            return <span className="eds-square-button__label">{child}</span>;
          }
          return (
            <span className="eds-square-button__icon">
              {loading ? <div className="eds-button__spinner" /> : child}
            </span>
          );
        })}
      </Element>
    );
  },
);
