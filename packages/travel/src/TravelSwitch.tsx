import React from 'react';
import { Switch } from '@entur/form';
import { useContrast } from '@entur/layout';
import { getTransportStyle } from './utils';

import type { Transport } from './utils';

export type TravelSwitchProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Om switch-en er checked eller ikke */
  checked?: boolean;
  /** Label for TravelSwitch-en. */
  children?: React.ReactNode;
  /** Posisjonen til label for TravelSwitch-en.
   * @default "right"
   */
  labelPlacement?: 'right' | 'bottom';
  /** Hvilken type reise som skal vises ikon og farge for */
  transport: Transport; // When adding a new submode, check https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/825393529/Norwegian+submodes+and+their+definitions for names
  /** Callback for når verdien endres */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Størrelsen på Switch-en
   * @default "medium"
   */
  size?: 'medium' | 'large';
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const TravelSwitch = ({
  className,
  children,
  labelPlacement = 'right',
  transport,
  size,
  style,
  ...rest
}: TravelSwitchProps) => {
  const isContrast = useContrast();
  const { Icon, hasDarkForeground } = getTransportStyle(transport);
  const deCapitalizeTransport = transport.toLowerCase();

  const backgroundColor =
    'var(--components-travel-travelswitch-standard-backgroundtrue-' +
    deCapitalizeTransport +
    ')';
  const contrastBackgroundColor =
    'var(--components-travel-travelswitch-contrast-backgroundtrue-' +
    deCapitalizeTransport +
    ')';
  // A light fill needs a dark icon on the white toggle
  const iconColor = hasDarkForeground
    ? `var(--components-travel-travelswitch-${
        isContrast ? 'contrast' : 'standard'
      }-icontrue-${deCapitalizeTransport})`
    : undefined;

  return (
    <Switch
      className={className}
      labelPlacement={labelPlacement}
      color={backgroundColor}
      contrastColor={contrastBackgroundColor}
      icon={<Icon />}
      size={size}
      style={
        iconColor
          ? ({
              '--eds-switch-icon-color': iconColor,
              ...style,
            } as React.CSSProperties)
          : style
      }
      {...rest}
    >
      {children}
    </Switch>
  );
};
