import React from 'react';
import { SecondarySquareButton } from '@entur/linje';
import { AddIcon } from '@entur/icons';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-large, 1.5rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const IconOnly = () => (
  <SecondarySquareButton aria-label="Legg til reisende">
    <AddIcon />
  </SecondarySquareButton>
);

export const WithText = () => (
  <div style={row}>
    <SecondarySquareButton>
      Legg til reisende <AddIcon />
    </SecondarySquareButton>
    <SecondarySquareButton>
      <AddIcon /> Legg til reisende
    </SecondarySquareButton>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <SecondarySquareButton size="large">
      Legg til reisende <AddIcon />
    </SecondarySquareButton>
    <SecondarySquareButton size="medium">
      Legg til reisende <AddIcon />
    </SecondarySquareButton>
    <SecondarySquareButton size="small">
      Legg til reisende <AddIcon />
    </SecondarySquareButton>
  </div>
);

export const States = () => (
  <div style={row}>
    <SecondarySquareButton loading aria-label="Legg til reisende">
      <AddIcon />
    </SecondarySquareButton>
    <SecondarySquareButton disabled>
      Legg til reisende <AddIcon />
    </SecondarySquareButton>
  </div>
);
