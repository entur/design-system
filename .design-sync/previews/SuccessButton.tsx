import React from 'react';
import { SuccessButton } from '@entur/linje';
import { ForwardIcon } from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-default, 1rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Default = () => <SuccessButton>Bekreft kjøp</SuccessButton>;

export const Sizes = () => (
  <div style={row}>
    <SuccessButton size="large">Bekreft kjøp</SuccessButton>
    <SuccessButton size="medium">Bekreft kjøp</SuccessButton>
    <SuccessButton size="small">Bekreft kjøp</SuccessButton>
  </div>
);

export const WithIcon = () => (
  <SuccessButton>
    Lagre reise <ForwardIcon />
  </SuccessButton>
);

export const States = () => (
  <div style={row}>
    <SuccessButton loading>Lagrer</SuccessButton>
    <SuccessButton disabled>Bekreft kjøp</SuccessButton>
  </div>
);

export const Fluid = () => (
  <div style={{ width: 320 }}>
    <SuccessButton width="fluid">Lagre reise</SuccessButton>
  </div>
);
