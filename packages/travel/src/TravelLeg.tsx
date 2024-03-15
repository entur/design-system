import React from 'react';
import { useContrast } from '@entur/layout';
import { LegBone } from './LegBone';
import { getTransportStyle } from './utils';

import type { Transport } from './utils';

export type TravelLegProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Hviklen type reise som skal vises riktig farge og linjetype */
  transport: Transport;
  /** Retningen på komponenten */
  direction: 'horizontal' | 'vertical';
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const TravelLeg: React.FC<TravelLegProps> = ({
  className,
  transport,
  direction,
  ...rest
}) => {
  const { pattern } = getTransportStyle(transport);
  const isContrast = useContrast();
  const deCapitalizeTransport = transport.toLowerCase();

  console.log('deCapitalizeTransport', deCapitalizeTransport);
  const backgroundColor =
    'var(--components-travel-travelleg-standard-' + deCapitalizeTransport + ')';
  const contrastBackgroundColor =
    'var(--components-travel-travelleg-contrast-' + deCapitalizeTransport + ')';

  return (
    <LegBone
      direction={direction}
      pattern={pattern}
      color={isContrast ? contrastBackgroundColor : backgroundColor}
      className={className}
      {...rest}
    />
  );
};
