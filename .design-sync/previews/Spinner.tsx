import React from 'react';
import { Spinner, Contrast } from '@entur/linje';

export const Default = () => <Spinner />;

export const InlineWithText = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-small, 0.5rem)',
    }}
  >
    <Spinner />
    <span>Henter avganger fra Jernbanetorget</span>
  </div>
);

export const OnContrast = () => (
  <Contrast
    style={{
      padding: 'var(--space-default, 1rem)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-small, 0.5rem)',
    }}
  >
    <Spinner />
    <span>Søker etter reiser</span>
  </Contrast>
);
