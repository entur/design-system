import * as React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { LoadingDots } from '@entur/loader';
import './SquareButton.scss';

export type SquareButtonBaseProps = {
  /** Tekst og ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** En type knapp */
  variant?: 'success' | 'secondary' | 'tertiary';
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
  /** DOM-elementet knappen rendres som */
  as?: string | React.ElementType;
};

export type SquareButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, SquareButtonBaseProps>;

export type SquareButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: SquareButtonProps<T>,
) => React.ReactElement | null;

const defaultElement = 'button';

export const SquareButton: SquareButtonComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      as,
      children,
      className,
      disabled = false,
      loading = false,
      variant = 'secondary',
      ...rest
    }: SquareButtonProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;
    return (
      <Element
        className={classNames(
          'eds-square-button',
          `eds-square-button--${variant}`,
          {
            'eds-square-button--loading': loading,
          },
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
            <span className="eds-square-button__button">
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
