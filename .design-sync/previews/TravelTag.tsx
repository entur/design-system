import React from 'react';
import { TravelTag } from '@entur/linje';

export const Transports = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-small)',
      flexWrap: 'wrap',
      alignItems: 'center',
    }}
  >
    <TravelTag transport="bus">31</TravelTag>
    <TravelTag transport="tram">17</TravelTag>
    <TravelTag transport="metro">5</TravelTag>
    <TravelTag transport="rail">F4</TravelTag>
    <TravelTag transport="ferry">B10</TravelTag>
    <TravelTag transport="walk" type="duration">
      6
    </TravelTag>
  </div>
);

export const WithDetails = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-default)',
      alignItems: 'center',
    }}
  >
    <TravelTag transport="rail" details="#602">
      R10
    </TravelTag>
    <TravelTag transport="bus" details="#45">
      32
    </TravelTag>
  </div>
);

export const Alerts = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-large)', alignItems: 'center' }}
  >
    <TravelTag transport="bus" alert="info">
      31
    </TravelTag>
    <TravelTag transport="rail" alert="warning">
      L2
    </TravelTag>
    <TravelTag transport="tram" alert="error">
      12
    </TravelTag>
  </div>
);

export const WithLabel = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-extra-large)',
      alignItems: 'flex-start',
    }}
  >
    <TravelTag transport="metro" label="Mot Vestli">
      5
    </TravelTag>
    <TravelTag transport="bus" label="14:32" labelPlacement="bottom">
      31
    </TravelTag>
  </div>
);

export const Closable = () => (
  <div style={{ display: 'flex', gap: 'var(--space-small)' }}>
    <TravelTag transport="bus" onClose={() => undefined}>
      32
    </TravelTag>
    <TravelTag transport="ferry" onClose={() => undefined}>
      B10
    </TravelTag>
  </div>
);
