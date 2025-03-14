import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { LoadingDots } from '@entur/loader';
import './IconButton.scss';

export type IconButtonBaseProps = {
  /** Ikonet som du vil ha inne i knappen */
  children: React.ReactNode;
  /** Tekst som forklarer knappens handling. MÅ være satt hvis du ikke har en forklarende tooltip på knappen */
  'aria-label'?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: React.ElementType;
  /**Størrelsen på knappen
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
};

const defaultElement = 'button';

export type IconButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, IconButtonBaseProps>;

export type IconButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: IconButtonProps<T>,
) => React.ReactElement | null;

export const IconButton: IconButtonComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      disabled = false,
      size = 'medium',
      as,
      loading,
      ...rest
    }: IconButtonProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || defaultElement;

    const IconWithAriaHidden = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        // @ts-expect-error aria-hidden does, in fact, exist
        return React.cloneElement(child, { 'aria-hidden': true });
      }
      return child;
    });

    const iconButtonElement = (
      <Element
        className={classNames(
          'eds-icon-button',
          className,
          {
            'eds-icon-button--disabled': disabled,
          },
          `eds-icon-button--size-${size}`,
        )}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={loading}
        ref={ref}
        {...rest}
      >
        {loading ? <LoadingDots /> : <>{IconWithAriaHidden}</>}
      </Element>
    );

    if (disabled) {
      return (
        <div className="eds-icon-button--disabled__wrapper">
          {iconButtonElement}
        </div>
      );
    }
    return <>{iconButtonElement}</>;
  },
);
