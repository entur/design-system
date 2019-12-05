import React from 'react';
import classNames from 'classnames';
import { Label } from '@entur/typography';
import { colors } from '@entur/tokens';
import './Switch.scss';

export type SwitchProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Label for Switchen, som vises ved høyre side. */
  children?: React.ReactNode;
  /** Ikonet som skal stå inne i sirkelen på Switchen */
  icon?: React.ReactNode;
  /** Farge som settes på ikon og bakgrunnen når Switchen er "checked". Default er mint-contrast
   * @default colors.validation .mintContrast
   */
  color?: string;
  /** Lik som color, men når Switchen står i en kontrast seksjon. Default er samme farge som color. */
  contrastColor?: string;
  /** Størrelsen på Switchen
   * @default "medium"
   */
  size?: 'medium' | 'large';
  [key: string]: any;
};

export const Switch: React.RefForwardingComponent<
  HTMLInputElement,
  SwitchProps
> = React.forwardRef(
  (
    {
      className,
      children,
      icon,
      color = colors.validation.mintContrast,
      contrastColor,
      size = 'medium',
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const chosenContrastColor = (contrastColor && contrastColor) || color;
    return (
      <label className={classNames('eds-switch', className)}>
        <input type="checkbox" ref={ref} {...rest} />
        <span
          className={classNames('eds-switch__switch', {
            'eds-switch__switch--large': size === 'large',
          })}
          style={
            {
              '--eds-switch-color': color,
              '--eds-switch-contrast-color': chosenContrastColor,
            } as React.CSSProperties
          }
        >
          <span className="eds-switch__circle">{icon && icon}</span>
        </span>
        {children && <Label as="span">{children}</Label>}
      </label>
    );
  },
);
