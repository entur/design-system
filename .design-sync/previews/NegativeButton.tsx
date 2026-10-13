import React from 'react';
import { NegativeButton } from '@entur/linje';
import { ForwardIcon } from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-default, 1rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Default = () => <NegativeButton>Slett reise</NegativeButton>;

export const Sizes = () => (
  <div style={row}>
    <NegativeButton size="large">Slett reise</NegativeButton>
    <NegativeButton size="medium">Slett reise</NegativeButton>
    <NegativeButton size="small">Slett reise</NegativeButton>
  </div>
);

export const WithIcon = () => (
  <NegativeButton>
    Avbestill billett <ForwardIcon />
  </NegativeButton>
);

export const States = () => (
  <div style={row}>
    <NegativeButton loading>Sletter</NegativeButton>
    <NegativeButton disabled>Slett reise</NegativeButton>
  </div>
);

export const Fluid = () => (
  <div style={{ width: 320 }}>
    <NegativeButton width="fluid">Avbestill billett</NegativeButton>
  </div>
);
