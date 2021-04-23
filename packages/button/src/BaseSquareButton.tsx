import * as React from 'react';
import classNames from 'classnames';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
} from '@entur/utils';
import { LoadingDots } from '@entur/loader';
import './BaseSquareButton.scss';

export type BaseSquareButtonBaseProps = {
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
};

export type BaseSquareButtonProps<
  T extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<BaseSquareButtonBaseProps, T>;

const defaultElement = 'button';

export const BaseSquareButton: PolymorphicForwardRefExoticComponent<
  BaseSquareButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      variant,
      disabled = false,
      loading = false,
      as,
      ...rest
    }: PolymorphicPropsWithoutRef<BaseSquareButtonBaseProps, T>,
    ref: React.ForwardedRef<React.ElementRef<T>>,
  ) => {
    const Element: React.ElementType = as || defaultElement;
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
              {loading ? (
                <LoadingDots className="eds-square-button__loading-dots" />
              ) : (
                child
              )}
            </span>
          );
        })}
      </Element>
    );
  },
);
