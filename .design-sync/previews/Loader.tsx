import React from 'react';
import { Loader } from '@entur/linje';

const box: React.CSSProperties = { width: 360 };

export const Indeterminate = () => (
  <div style={box}>
    <Loader>Henter avganger …</Loader>
  </div>
);

export const Progress = () => (
  <div style={box}>
    <Loader progress={65}>Laster ned billetter</Loader>
  </div>
);

export const ProgressSteps = () => (
  <div style={box}>
    <Loader progress={20}>Behandler betaling</Loader>
    <div style={{ height: 'var(--space-large, 1.5rem)', clear: 'both' }} />
    <Loader progress={100}>Billett klar</Loader>
  </div>
);

export const WithoutLabel = () => (
  <div style={box}>
    <Loader />
  </div>
);
