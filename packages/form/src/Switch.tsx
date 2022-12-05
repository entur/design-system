import React from 'react';
import classNames from 'classnames';
import { colors } from '@entur/tokens';
import { CheckIcon, CloseSmallIcon } from '@entur/icons';
import './Switch.scss';

export type SwitchProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for Switch-en. */
  children?: React.ReactNode;
  /** Posisjonen til label for Switch-en.
   * @default "right"
   */
  labelPlacement?: 'right' | 'bottom';
  /** Om switch-en er checked eller ikke */
  checked?: boolean;
  /** Ikonet som skal stå inne i sirkelen på Switch-en */
  icon?: React.ReactNode;
  /** Skjul ikonet inne i sikrelen på Switch-en
   * @default false
   */
  hideIcon?: boolean;
  /** Farge som settes på ikon og bakgrunn når Switch-en er "checked"
   * @default colors.validation.mint
   */
  color?: string;
  /** Farge på bakgrunn når Switch-en er "checked" og står i en kontrast-seksjon
   * @default colors.validation.mintContrast
   */
  contrastColor?: string;
  /** Størrelsen på Switch-en
   * @default "medium"
   */
  size?: 'medium' | 'large';
  /** Callback for når verdien endres */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      children,
      labelPlacement = 'right',
      icon,
      hideIcon = false,
      color = colors.validation.mint,
      contrastColor = colors.validation.mintContrast,
      size = 'medium',
      checked,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const displayedIcon = () => {
      if (icon) return icon;
      if (checked === undefined) return <></>;
      const iconSize = size === 'large' ? 23 : undefined;
      return checked ? (
        <CheckIcon size={iconSize} />
      ) : (
        <CloseSmallIcon size={iconSize} />
      );
    };

    return (
      <label
        className={classNames(
          'eds-switch',
          `eds-switch--${labelPlacement}`,
          className,
        )}
        style={{ ...rest.style }}
      >
        <input type="checkbox" ref={ref} checked={checked} {...rest} />
        <span
          className={classNames(
            'eds-switch__switch',
            `eds-switch__switch--${size}`,
          )}
          style={
            {
              '--eds-switch-color': color,
              '--eds-switch-contrast-color': contrastColor,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <span className="eds-switch__circle">
            {!hideIcon && displayedIcon()}
          </span>
        </span>
        {children && (
          <span
            className={classNames(
              'eds-switch__label',
              `eds-switch__label--${size}--${labelPlacement}`,
            )}
          >
            {children}
          </span>
        )}
      </label>
    );
  },
);
