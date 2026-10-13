import React from 'react';
import { PrimaryButton } from '@entur/linje';
import { ForwardIcon } from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-default, 1rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Default = () => <PrimaryButton>Kjøp billett</PrimaryButton>;

export const Sizes = () => (
  <div style={row}>
    <PrimaryButton size="large">Kjøp billett</PrimaryButton>
    <PrimaryButton size="medium">Kjøp billett</PrimaryButton>
    <PrimaryButton size="small">Kjøp billett</PrimaryButton>
  </div>
);

export const WithIcon = () => (
  <PrimaryButton>
    Til betaling <ForwardIcon />
  </PrimaryButton>
);

export const States = () => (
  <div style={row}>
    <PrimaryButton loading>Betaler</PrimaryButton>
    <PrimaryButton disabled>Kjøp billett</PrimaryButton>
  </div>
);

export const Fluid = () => (
  <div style={{ width: 320 }}>
    <PrimaryButton width="fluid">Til betaling</PrimaryButton>
  </div>
);
