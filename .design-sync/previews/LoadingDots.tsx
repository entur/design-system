import React from 'react';
import { LoadingDots, Contrast } from '@entur/linje';

export const Default = () => <LoadingDots />;

export const OnContrast = () => (
  <Contrast
    style={{ padding: 'var(--space-default, 1rem)', display: 'inline-block' }}
  >
    <LoadingDots color="white" />
  </Contrast>
);

export const InlineWithText = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-small, 0.5rem)',
    }}
  >
    <span>Oppdaterer sanntid</span>
    <LoadingDots />
  </div>
);
