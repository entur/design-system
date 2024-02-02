import React from 'react';
import { Switch } from '@entur/form';
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

export const TravelSwitch: React.FC<TravelSwitchProps> = ({
  className,
  children,
  labelPlacement = 'right',
  transport,
  size,
  ...rest
}) => {
  const { Icon } = getTransportStyle(transport);
  const deCapitalizeTransport = transport.toLowerCase();

  const backgroundColor =
    'var(--components-travel-travelswitch-standard-backgroundtrue-' +
    deCapitalizeTransport +
    ')';
  const contrastBackgroundColor =
    'var(--components-travel-travelswitch-contrast-backgroundtrue-' +
    deCapitalizeTransport +
    ')';

  return (
    <Switch
      className={className}
      labelPlacement={labelPlacement}
      color={backgroundColor}
      contrastColor={contrastBackgroundColor}
      icon={<Icon />}
      size={size}
      {...rest}
    >
      {children}
    </Switch>
  );
};
