import React from 'react';
import { ActionChip } from '@entur/linje';
import { AddIcon, RefreshIcon } from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-small, 0.5rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Default = () => (
  <div style={row}>
    <ActionChip>Lagre søk</ActionChip>
    <ActionChip>
      Legg til reisende <AddIcon aria-hidden />
    </ActionChip>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <ActionChip size="large">Oppdater avganger</ActionChip>
    <ActionChip size="medium">Oppdater avganger</ActionChip>
    <ActionChip size="small">Oppdater avganger</ActionChip>
  </div>
);

export const States = () => (
  <div style={row}>
    <ActionChip loading>Oppdater avganger</ActionChip>
    <ActionChip disabled>
      <RefreshIcon aria-hidden /> Oppdater avganger
    </ActionChip>
  </div>
);
