import React from 'react';
import classNames from 'classnames';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
} from '@entur/utils';
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
   * @default "medium"
   */
  size?: 'small' | 'medium';
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
};

const defaultElement = 'button';

export type IconButtonProps<
  E extends React.ElementType = typeof defaultElement,
> = PolymorphicPropsWithRef<IconButtonBaseProps, E>;

export const IconButton: PolymorphicForwardRefExoticComponent<
  IconButtonBaseProps,
  typeof defaultElement
> = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      disabled = false,
      size,
      as,
      loading,
      ...rest
    }: PolymorphicPropsWithoutRef<IconButtonBaseProps, E>,
    ref: React.ForwardedRef<React.ElementRef<E>>,
  ) => {
    const Element: React.ElementType = as || defaultElement;

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
        {loading ? <LoadingDots /> : children}
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
