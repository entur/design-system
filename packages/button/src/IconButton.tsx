import React from 'react';
import classNames from 'classnames';
import './IconButton.scss';

export type IconButtonProps = {
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
  as?: 'a' | 'button' | React.ElementType;
  [key: string]: any;
};

export const IconButton: React.RefForwardingComponent<
  HTMLButtonElement,
  IconButtonProps
> = React.forwardRef(
  (
    { children, className, variant, disabled = false, as = 'button', ...rest },
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const Element = disabled ? 'button' : as;

    return (
      <Element
        className={classNames('eds-icon-button', className, {
          'eds-icon-button--disabled': disabled,
        })}
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
