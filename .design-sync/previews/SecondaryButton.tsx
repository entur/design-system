import React from 'react';
import { SecondaryButton } from '@entur/linje';
import { ForwardIcon } from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-default, 1rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Default = () => <SecondaryButton>Endre søk</SecondaryButton>;

export const Sizes = () => (
  <div style={row}>
    <SecondaryButton size="large">Endre søk</SecondaryButton>
    <SecondaryButton size="medium">Endre søk</SecondaryButton>
    <SecondaryButton size="small">Endre søk</SecondaryButton>
  </div>
);

export const WithIcon = () => (
  <SecondaryButton>
    Vis flere avganger <ForwardIcon />
  </SecondaryButton>
);

export const States = () => (
  <div style={row}>
    <SecondaryButton loading>Henter</SecondaryButton>
    <SecondaryButton disabled>Endre søk</SecondaryButton>
  </div>
);

export const Fluid = () => (
  <div style={{ width: 320 }}>
    <SecondaryButton width="fluid">Vis flere avganger</SecondaryButton>
  </div>
);
