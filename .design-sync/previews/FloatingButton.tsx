import React from 'react';
import { FloatingButton } from '@entur/linje';
import { AddIcon, PositionIcon, SearchIcon, MapIcon } from '@entur/icons';

const noop = () => {};
const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-default, 1rem)',
  alignItems: 'center',
  padding: 'var(--space-small, 0.5rem)',
};

export const IconOnly = () => (
  <div style={row}>
    <FloatingButton aria-label="Finn min posisjon" onClick={noop}>
      <PositionIcon />
    </FloatingButton>
  </div>
);

export const Extended = () => (
  <div style={row}>
    <FloatingButton aria-label="Søk etter reise" onClick={noop}>
      <SearchIcon /> Søk etter reise
    </FloatingButton>
    <FloatingButton aria-label="Vis kart" onClick={noop}>
      Vis kart <MapIcon />
    </FloatingButton>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <FloatingButton aria-label="Legg til favoritt" onClick={noop}>
      <AddIcon />
    </FloatingButton>
    <FloatingButton aria-label="Legg til favoritt" size="small" onClick={noop}>
      <AddIcon />
    </FloatingButton>
    <FloatingButton
      aria-label="Legg til stoppested"
      size="small"
      onClick={noop}
    >
      <AddIcon /> Legg til stoppested
    </FloatingButton>
  </div>
);
