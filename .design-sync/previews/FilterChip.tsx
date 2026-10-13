import React from 'react';
import { FilterChip } from '@entur/linje';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-small, 0.5rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const Default = () => (
  <div style={row} role="group" aria-label="Transportmidler">
    <FilterChip value="buss" defaultChecked>
      Buss
    </FilterChip>
    <FilterChip value="tog" defaultChecked>
      Tog
    </FilterChip>
    <FilterChip value="trikk">Trikk</FilterChip>
    <FilterChip value="bat">Båt</FilterChip>
  </div>
);

export const CheckedAndUnchecked = () => (
  <div style={row}>
    <FilterChip value="mandag" defaultChecked>
      Mandag
    </FilterChip>
    <FilterChip value="tirsdag">Tirsdag</FilterChip>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <FilterChip size="large" value="t-bane-l" defaultChecked>
      T-bane
    </FilterChip>
    <FilterChip size="medium" value="t-bane-m" defaultChecked>
      T-bane
    </FilterChip>
    <FilterChip size="small" value="t-bane-s" defaultChecked>
      T-bane
    </FilterChip>
  </div>
);

export const Disabled = () => (
  <div style={row}>
    <FilterChip value="fly" disabled>
      Fly
    </FilterChip>
    <FilterChip value="ferje" disabled defaultChecked>
      Ferje
    </FilterChip>
  </div>
);
