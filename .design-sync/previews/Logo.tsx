import React from 'react';
import { Logo, Contrast } from '@entur/linje';

export const Default = () => <Logo href="#" />;

export const Sizes = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-extra-large)',
    }}
  >
    <Logo size="medium" />
    <Logo size="small" />
  </div>
);

export const WithProductName = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-large)',
    }}
  >
    <Logo productName="Tavla" href="#" />
    <Logo productName="Partner" size="small" href="#" />
  </div>
);

export const OnContrast = () => (
  <Contrast style={{ padding: 'var(--space-large)' }}>
    <Logo productName="Selvbetjening" href="#" />
  </Contrast>
);
