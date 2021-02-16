import React from 'react';
import classNames from 'classnames';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
} from '@entur/utils';
import './IconButton.scss';

export type IconButtonBaseProps = {
  /** Ikonet som du vil ha inne i knappen */
  children: React.ReactNode;
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
};

const defaultElement = 'button';

export type IconButtonProps<
  E extends React.ElementType = typeof defaultElement
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
      ...rest
    }: PolymorphicPropsWithoutRef<IconButtonBaseProps, E>,
    ref: React.ForwardedRef<React.ElementRef<E>>,
  ) => {
    const Element: React.ElementType = as || defaultElement;
    return (
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
        ref={ref}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);
