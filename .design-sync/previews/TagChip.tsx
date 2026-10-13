import React from 'react';
import { TagChip } from '@entur/linje';

const row: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-small, 0.5rem)',
  alignItems: 'center',
  flexWrap: 'wrap',
};
const noop = () => {};

export const Default = () => <TagChip onClose={noop}>Buss</TagChip>;

export const SelectedFilters = () => (
  <div style={row}>
    <TagChip onClose={noop}>Oslo S</TagChip>
    <TagChip onClose={noop}>Tog</TagChip>
    <TagChip onClose={noop}>Direkte avganger</TagChip>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <TagChip size="large" onClose={noop}>
      Bergen
    </TagChip>
    <TagChip size="medium" onClose={noop}>
      Bergen
    </TagChip>
    <TagChip size="small" onClose={noop}>
      Bergen
    </TagChip>
  </div>
);
